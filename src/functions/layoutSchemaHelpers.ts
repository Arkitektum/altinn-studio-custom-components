import type { DataModelBindingKeys } from "../types.ts";
// Dependencies
import { customElementTagNames } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { getDataModelBindingKeysByTagName } from "./componentHelpers.ts";

// Constants
import { deprecatedLayoutAttributes, layoutAttributeSchemas } from "../constants/layoutAttributeSchemas.ts";

type JsonSchema = Record<string, unknown>;

/** Where the published layout schema can be fetched, which is also its `$id`. */
export const LAYOUT_SCHEMA_ID = "https://cdn.jsdelivr.net/npm/@arkitektum/altinn-studio-custom-components/dist/layout.schema.json";

/** Where Altinn publishes its layout schema and the schemas it refers to by relative path. */
export const ALTINN_LAYOUT_SCHEMA_BASE_URL = "https://altinncdn.no/toolkits/altinn-app-frontend/4/schemas/json/layout/";

/**
 * Builds the schema for one component's `dataModelBindings` from the keys it declares.
 *
 * Keys outside the lists are not allowed, a `oneOf` group must have exactly one of its keys bound, and a deprecated key is allowed but carries a `deprecationMessage`, which editors such as VS Code show as a warning with the hint.
 *
 * @param {string} tagName - The component's tag name, named in the descriptions.
 * @param {DataModelBindingKeys} bindingKeys - The keys the component declares.
 * @returns {Object} The schema for the component's `dataModelBindings`.
 */
export function getDataModelBindingsSchema(tagName: string, bindingKeys: DataModelBindingKeys): JsonSchema {
    const binding = { $ref: "#/definitions/IRawDataModelBinding" };
    const oneOfGroups = bindingKeys.oneOf || [];
    const properties: Record<string, JsonSchema> = {};
    for (const key of bindingKeys.expected) {
        properties[key] = { ...binding, description: `Required by ${tagName}.` };
    }
    for (const group of oneOfGroups) {
        for (const key of group) {
            properties[key] = {
                ...binding,
                description: `${tagName} reads one of ${group.join(" or ")}: bind exactly one. When more are bound, ${group[0]} is the one read.`
            };
        }
    }
    for (const key of bindingKeys.optional || []) {
        properties[key] = { ...binding, description: `Optional for ${tagName}.` };
    }
    for (const [key, hint] of Object.entries(bindingKeys.deprecated)) {
        properties[key] = { ...binding, description: `No longer read by ${tagName}. ${hint}.`, deprecationMessage: `${hint}.` };
    }
    return {
        type: "object",
        properties,
        ...(bindingKeys.expected.length ? { required: [...bindingKeys.expected] } : {}),
        ...(oneOfGroups.length ? { allOf: oneOfGroups.map((group) => ({ oneOf: group.map((key) => ({ required: [key] })) })) } : {}),
        additionalProperties: false
    };
}

/**
 * Points every reference to another of Altinn's schema files at Altinn's own copy, since a relative reference would otherwise be resolved against this schema's address.
 *
 * Every object and array is rebuilt on the way, so the result shares nothing with the schema it was given.
 *
 * @param {*} value - Part of the schema.
 * @returns {*} A copy with the references made absolute.
 */
function withAbsoluteAltinnReferences(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(withAbsoluteAltinnReferences);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(
        Object.entries(value).map(([key, child]) => [
            key,
            key === "$ref" && typeof child === "string" && !child.startsWith("#") && !/^https?:/.test(child)
                ? `${ALTINN_LAYOUT_SCHEMA_BASE_URL}${child}`
                : withAbsoluteAltinnReferences(child)
        ])
    );
}

/**
 * Builds this package's layout schema from Altinn's: the same schema, with the definition of a `Custom` component replaced.
 *
 * Altinn's definition closes a `Custom` component with `additionalProperties: false`, so every attribute these components read (`resourceBindings`, `hideIfEmpty`, `size` and the rest) is reported as not allowed, and a schema that only added to Altinn's could not change that. The replacement keeps every part of Altinn's definition and adds:
 *
 *   - the attributes in layoutAttributeSchemas.ts, and the deprecated ones with their hint
 *   - completion for `tagName`, and an error for a `custom-` tag this package does not have
 *   - for each component that declares its binding keys, a schema for its `dataModelBindings`
 *
 * @param {Object} altinnSchema - Altinn's layout schema, which is not changed.
 * @returns {Object} The layout schema to publish.
 * @throws {Error} When Altinn's definition of a `Custom` component no longer has the parts this builds on, so a refreshed copy cannot quietly produce a wrong schema.
 */
export function buildLayoutSchema(altinnSchema: JsonSchema): JsonSchema {
    const schema = withAbsoluteAltinnReferences(altinnSchema) as JsonSchema & { definitions: Record<string, JsonSchema> };
    const altinnCustomParts = (schema.definitions?.CompCustomExternal?.allOf || []) as JsonSchema[];
    const customProperties = altinnCustomParts.find((part) => (part.properties as JsonSchema)?.tagName && part.title === "CompCustomExternal");
    const closingPart = altinnCustomParts.find((part) => part.additionalProperties === false);
    if (!customProperties || !closingPart || schema.definitions.CompCustom?.$ref !== "#/definitions/CompCustomExternal") {
        throw new Error(
            "Altinn's layout schema no longer defines CompCustomExternal the way buildLayoutSchema expects. Check its definition before publishing."
        );
    }

    const attributeNames = [...Object.keys(layoutAttributeSchemas), ...Object.keys(deprecatedLayoutAttributes)];
    const attributes: JsonSchema = {
        type: "object",
        properties: {
            ...layoutAttributeSchemas,
            ...Object.fromEntries(
                Object.entries(deprecatedLayoutAttributes).map(([name, hint]) => [name, { description: `${hint}.`, deprecationMessage: `${hint}.` }])
            )
        }
    };
    const tagName = {
        type: "string",
        title: "Tag name",
        description: "The custom component to render.",
        anyOf: [{ enum: [...customElementTagNames] }, { not: { pattern: "^custom-" } }]
    };
    const bindingRules = Object.entries(getDataModelBindingKeysByTagName()).map(([componentTagName, bindingKeys]) => ({
        if: { properties: { tagName: { const: componentTagName } }, required: ["tagName"] },
        then: {
            properties: { dataModelBindings: getDataModelBindingsSchema(componentTagName, bindingKeys) },
            // A component that has to have something bound cannot leave dataModelBindings out altogether.
            ...(bindingKeys.expected.length || bindingKeys.oneOf?.length ? { required: ["dataModelBindings"] } : {})
        }
    }));

    schema.definitions.CompCustomExternal = {
        allOf: [
            ...altinnCustomParts.map((part) => {
                if (part === customProperties) {
                    return { ...part, properties: { ...(part.properties as JsonSchema), tagName } };
                }
                if (part === closingPart) {
                    const allowed = Object.fromEntries(attributeNames.map((name) => [name, true]));
                    return { ...part, properties: { ...(part.properties as JsonSchema), ...allowed } };
                }
                return part;
            }),
            attributes,
            ...bindingRules
        ]
    };
    return {
        ...schema,
        $id: LAYOUT_SCHEMA_ID,
        $comment: `Altinn's layout schema (${ALTINN_LAYOUT_SCHEMA_BASE_URL}layout.schema.v1.json) with the definition of a Custom component replaced by @arkitektum/altinn-studio-custom-components, so its attributes are allowed and each component's dataModelBindings are checked.`
    };
}
