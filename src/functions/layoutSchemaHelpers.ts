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

/** Where Altinn publishes its layout and expression schemas. */
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
    // In allOf rather than next to the descriptions: VS Code's JSON engine ignores everything beside a $ref, which hid every description and deprecation warning below.
    const binding = { allOf: [{ $ref: "#/definitions/IRawDataModelBinding" }] };
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

/** The kinds of expression Altinn's layout schema asks for, each a definition this schema adds in place of Altinn's. */
const EXPRESSION_DEFINITIONS: Record<string, string> = { boolean: "ExpressionBoolean", string: "ExpressionString", number: "ExpressionNumber" };

/**
 * Builds the expression definitions that replace Altinn's: an expression is a value, or an array naming one of Altinn's functions followed by its arguments, which are checked the same way.
 *
 * Altinn's expression schema checks every argument against every function at every level of nesting. VS Code's JSON engine took two seconds over one three-level expression and never finished a whole layout, freezing completion and validation for every JSON file. This check costs one step per level, keeps completion for the function names, and leaves argument counts and types to Altinn.
 *
 * @param {Object} expressionSchema - Altinn's expression schema, which the function names and their descriptions are read from.
 * @returns {Object} The definitions to add.
 */
function getExpressionDefinitions(expressionSchema: JsonSchema): Record<string, JsonSchema> {
    const functions: Map<string, string> = new Map();
    for (const definition of Object.values((expressionSchema.definitions || {}) as Record<string, JsonSchema>)) {
        const name = ((definition.items as JsonSchema[] | undefined)?.[0] as JsonSchema | undefined)?.const;
        if (typeof name === "string" && !functions.has(name)) functions.set(name, String(definition.title || name));
    }
    if (!functions.size) {
        throw new Error(
            "Altinn's expression schema no longer names its functions the way buildLayoutSchema reads them. Check its definitions before publishing."
        );
    }
    const call = { $ref: "#/definitions/ExpressionCall" };
    const valueOrCall = { anyOf: [{ type: ["string", "number", "boolean", "null"] }, call] };
    return {
        ExpressionCall: {
            title: "Expression",
            description: "A function call: the function's name first, then its arguments, which may be expressions themselves.",
            type: "array",
            minItems: 1,
            items: [{ enum: [...functions.keys()], enumDescriptions: [...functions.values()], description: "The function to call." }],
            additionalItems: valueOrCall
        },
        ...Object.fromEntries(Object.values(EXPRESSION_DEFINITIONS).map((name) => [name, valueOrCall]))
    };
}

/**
 * Points every reference to Altinn's expression schema at the definitions this schema adds instead, so the result refers to no other file.
 *
 * Every object and array is rebuilt on the way, so the result shares nothing with the schema it was given.
 *
 * @param {*} value - Part of the schema.
 * @returns {*} A copy with the references replaced.
 * @throws {Error} When the schema refers to another file, or to a kind of expression this does not replace.
 */
function withLightExpressionReferences(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(withLightExpressionReferences);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(
        Object.entries(value).map(([key, child]) => {
            if (key !== "$ref" || typeof child !== "string" || child.startsWith("#")) return [key, withLightExpressionReferences(child)];
            const kind = /^expression\.schema\.v1\.json#\/definitions\/(\w+)$/.exec(child)?.[1];
            if (!kind || !EXPRESSION_DEFINITIONS[kind]) {
                throw new Error(`Altinn's layout schema refers to ${child}, which buildLayoutSchema does not replace. Check it before publishing.`);
            }
            return [key, `#/definitions/${EXPRESSION_DEFINITIONS[kind]}`];
        })
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
 * Altinn's expression checking is replaced by a lighter one, see getExpressionDefinitions, so the result refers to no other file.
 *
 * @param {Object} altinnSchema - Altinn's layout schema, which is not changed.
 * @param {Object} expressionSchema - Altinn's expression schema, which the expression function names are read from.
 * @returns {Object} The layout schema to publish.
 * @throws {Error} When Altinn's definition of a `Custom` component no longer has the parts this builds on, so a refreshed copy cannot quietly produce a wrong schema.
 */
export function buildLayoutSchema(altinnSchema: JsonSchema, expressionSchema: JsonSchema): JsonSchema {
    const schema = withLightExpressionReferences(altinnSchema) as JsonSchema & { definitions: Record<string, JsonSchema> };
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
    Object.assign(schema.definitions, getExpressionDefinitions(expressionSchema));
    return {
        ...schema,
        $id: LAYOUT_SCHEMA_ID,
        $comment: `Altinn's layout schema (${ALTINN_LAYOUT_SCHEMA_BASE_URL}layout.schema.v1.json) with the definition of a Custom component replaced by @arkitektum/altinn-studio-custom-components, so its attributes are allowed and each component's dataModelBindings are checked, and with a lighter expression check that VS Code can keep up with.`
    };
}
