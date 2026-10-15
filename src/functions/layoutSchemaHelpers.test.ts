import type { DataModelBindingKeys } from "../types.ts";

import { LAYOUT_SCHEMA_ID, buildLayoutSchema, getDataModelBindingsSchema, getResourceBindingsSchema } from "./layoutSchemaHelpers.ts";
import { deprecatedLayoutAttributes, layoutAttributeSchemas } from "../constants/layoutAttributeSchemas.ts";
import Ajv from "ajv";
import altinnSchema from "../data/altinn/layout.schema.v1.json";
import expressionSchema from "../data/altinn/expression.schema.v1.json";
import { getDataModelBindingKeysByTagName } from "./componentHelpers.ts";
import { getPropsFromElementAttributes } from "./htmlElementHelpers.ts";
import { getResourceBindingKeysByTagName } from "./resourceBindingKeys.ts";

type Component = Record<string, unknown>;

function compile(schema: object, ...otherSchemas: object[]) {
    // strict is off for the keywords editors read and validators do not, such as deprecationMessage and enumDescriptions.
    const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false });
    otherSchemas.forEach((otherSchema) => ajv.addSchema(otherSchema));
    return ajv.compile(schema);
}

const ourSchema = buildLayoutSchema(altinnSchema, expressionSchema) as { definitions: Record<string, unknown> };
// Ours refers to no other file. Altinn's refers to its expression schema, which carries its own address in $id.
const validateWithOurs = compile(ourSchema);
const validateWithAltinns = compile(altinnSchema, expressionSchema);

/** The names of the functions Altinn's expression schema defines, read here the way a reader of that file would. */
const altinnFunctionNames = [
    ...new Set(
        Object.values(expressionSchema.definitions as Record<string, { items?: { const?: string }[] }>)
            .map((definition) => definition.items?.[0]?.const)
            .filter(Boolean)
    )
];

const layoutWith = (...components: Component[]) => ({ data: { layout: components } });

/** A component binding what its list asks for: every expected key, and the first key of each oneOf group. */
function componentBindingWhatItReads(tagName: string, bindingKeys: DataModelBindingKeys, index: number): Component {
    const keys = [...bindingKeys.expected, ...(bindingKeys.oneOf || []).map((group) => group[0]!)];
    return {
        id: `component${index}`,
        type: "Custom",
        tagName,
        ...(keys.length ? { dataModelBindings: Object.fromEntries(keys.map((key) => [key, `model.${key}`])) } : {})
    };
}

/** The errors ours reports for one layout, each as `<keyword> <property>`, leaving out the ones that only say which branch failed. */
function errorsWithOurs(layout: object) {
    validateWithOurs(layout);
    return (validateWithOurs.errors || [])
        .filter((error) => !["if", "anyOf", "allOf"].includes(error.keyword))
        .map((error) => `${error.keyword} ${error.params.missingProperty || error.params.additionalProperty || ""}`.trim());
}

const fieldData = (dataModelBindings: object, extra: Component = {}) => ({
    id: "field",
    type: "Custom",
    tagName: "custom-field-data",
    dataModelBindings,
    ...extra
});

describe("buildLayoutSchema", () => {
    it("accepts every component that declares its bindings, binding what it reads", () => {
        const components = Object.entries(getDataModelBindingKeysByTagName()).map(([tagName, bindingKeys], index) =>
            componentBindingWhatItReads(tagName, bindingKeys, index)
        );
        expect(components.length > 60).toBe(true);
        expect(errorsWithOurs(layoutWith(...components))).toEqual([]);
    });

    it("accepts every attribute the components read, where Altinn's schema rejects them", () => {
        const attributes = {
            resourceBindings: { title: "resource.title" },
            hideIfEmpty: true,
            hideTitle: false,
            inline: true,
            size: "h2",
            styleOverride: { marginTop: "12px" },
            format: "date",
            enableLinks: true,
            hideOrgNr: false,
            tableColumns: [{ dataKey: "navn" }],
            showRowNumbers: true,
            order: { key: "navn", direction: "desc" },
            feedbackType: "info",
            itemKey: "a",
            itemTermKey: "b",
            itemDescriptionKey: "c",
            dataItemKey: "d",
            dataTitleItemKey: "e"
        };
        expect(Object.keys(attributes).sort()).toEqual(Object.keys(layoutAttributeSchemas).sort());
        const layout = layoutWith(fieldData({ data: "model.value" }, attributes));
        expect(errorsWithOurs(layout)).toEqual([]);
        expect(validateWithAltinns(layout)).toBe(false);
    });

    it("accepts a deprecated attribute, marked with what to do instead", () => {
        expect(errorsWithOurs(layoutWith(fieldData({ data: "model.value" }, { partType: "eier" })))).toEqual([]);
        const customDefinition = JSON.stringify(ourSchema.definitions);
        expect(customDefinition).toContain(`"deprecationMessage":"${deprecatedLayoutAttributes.partType}."`);
    });

    it("rejects an attribute of the wrong type, and one no component reads", () => {
        expect(errorsWithOurs(layoutWith(fieldData({ data: "model.value" }, { hideIfEmpty: "true" })))).toEqual(["type"]);
        expect(errorsWithOurs(layoutWith(fieldData({ data: "model.value" }, { size: "h7" })))).toEqual(["enum"]);
        expect(errorsWithOurs(layoutWith(fieldData({ data: "model.value" }, { hideIfempty: true })))).toEqual(["additionalProperties hideIfempty"]);
    });

    it("reports a missing key, a group with nothing bound, two keys of one group, and a key the component does not read", () => {
        const dispensasjonKeys = getDataModelBindingKeysByTagName()["custom-dispensasjon"]!.expected;
        const dispensasjon = {
            id: "dispensasjon",
            type: "Custom",
            tagName: "custom-dispensasjon",
            dataModelBindings: Object.fromEntries(dispensasjonKeys.filter((key) => key !== "plannavn").map((key) => [key, `model.${key}`]))
        };
        expect(errorsWithOurs(layoutWith(dispensasjon))).toEqual(["required plannavn"]);
        expect(errorsWithOurs(layoutWith(fieldData({ dataTitle: "model.title" })))).toEqual(["required simpleBinding", "required data", "oneOf"]);
        expect(errorsWithOurs(layoutWith(fieldData({ simpleBinding: "model.a", data: "model.b" })))).toEqual(["oneOf"]);
        expect(errorsWithOurs(layoutWith(fieldData({ data: "model.value", dataTittle: "model.title" })))).toEqual([
            "additionalProperties dataTittle"
        ]);
    });

    it("requires dataModelBindings on a component that has to have something bound, and not on one that reads none", () => {
        expect(errorsWithOurs(layoutWith({ id: "field", type: "Custom", tagName: "custom-field-data" }))).toEqual(["required dataModelBindings"]);
        expect(errorsWithOurs(layoutWith({ id: "header", type: "Custom", tagName: "custom-header-text" }))).toEqual([]);
    });

    it("marks a deprecated binding key with its hint, and still accepts it", () => {
        const bindingsSchema = getDataModelBindingsSchema("custom-x", { expected: [], deprecated: { old: "Renamed to new" } });
        // The $ref sits in allOf because VS Code ignores whatever is written beside a $ref, which would hide the description and the deprecation.
        expect(bindingsSchema.properties).toEqual({
            old: {
                allOf: [{ $ref: "#/definitions/IRawDataModelBinding" }],
                description: "No longer read by custom-x. Renamed to new.",
                deprecationMessage: "Renamed to new."
            }
        });
    });

    it("rejects a custom- tag this package does not have, and leaves other web components alone", () => {
        expect(errorsWithOurs(layoutWith({ id: "typo", type: "Custom", tagName: "custom-feild-data" }))).toEqual(["enum", "not"]);
        expect(errorsWithOurs(layoutWith({ id: "other", type: "Custom", tagName: "my-element", dataModelBindings: { anything: "a.b" } }))).toEqual(
            []
        );
    });

    it("judges Altinn's own components exactly as Altinn's schema does", () => {
        const valid = layoutWith({ id: "heading", type: "Header", size: "L", textResourceBindings: { title: "heading" } });
        const invalid = layoutWith({ id: "heading", type: "Header", size: "huge", styleOverride: { marginTop: "0" } });
        expect(validateWithOurs(valid)).toBe(validateWithAltinns(valid));
        expect(validateWithAltinns(invalid)).toBe(false);
        expect(validateWithOurs(invalid)).toBe(false);
        expect(validateWithOurs.errors!.map((error) => error.message)).toEqual(
            (validateWithAltinns(invalid), validateWithAltinns.errors!.map((error) => error.message))
        );
    });

    it("names itself, refers to no other file, and leaves the copies it was given alone", () => {
        const before = JSON.stringify([altinnSchema, expressionSchema]);
        const schema = buildLayoutSchema(altinnSchema, expressionSchema);
        expect(schema.$id).toBe(LAYOUT_SCHEMA_ID);
        expect(JSON.stringify(schema).match(/"\$ref":"[^#][^"]*"/g)).toBeNull();
        expect(JSON.stringify([altinnSchema, expressionSchema])).toBe(before);
    });

    it("fails rather than publish a wrong schema when Altinn's Custom definition changes shape", () => {
        const changed = JSON.parse(JSON.stringify(altinnSchema)) as { definitions: Record<string, unknown> };
        changed.definitions.CompCustomExternal = { type: "object" };
        expect(() => buildLayoutSchema(changed, expressionSchema)).toThrow("CompCustomExternal");
    });
});

describe("buildLayoutSchema's resourceBindings", () => {
    const tablePart = (resourceBindings: object) => ({
        id: "part",
        type: "Custom",
        tagName: "custom-table-part",
        dataModelBindings: { data: "a.b" },
        resourceBindings
    });

    it("accepts every key each component reads, in the shape it reads it", () => {
        const components = Object.entries(getResourceBindingKeysByTagName()).map(([tagName, keys], index) => ({
            id: `component${index}`,
            type: "Custom",
            tagName,
            resourceBindings: Object.fromEntries(
                Object.entries(keys).map(([key, keysInGroup]) => [
                    key,
                    keysInGroup ? Object.fromEntries(keysInGroup.map((keyInGroup) => [keyInGroup, "x.y"])) : "x.y"
                ])
            )
        }));
        const keysChecked = components.reduce((total, component) => total + Object.keys(component.resourceBindings).length, 0);
        expect(keysChecked > 400).toBe(true);
        expect(errorsWithOurs(layoutWith(...components)).filter((error) => !error.startsWith("required"))).toEqual([]);
    });

    it("reports a key the component does not read, at the top and inside a group", () => {
        expect(errorsWithOurs(layoutWith(tablePart({ title: "a.b", trueText: "a.c" })))).toEqual(["additionalProperties trueText"]);
        expect(errorsWithOurs(layoutWith(tablePart({ navn: { title: "a.b", trueText: "a.c" } })))).toEqual(["additionalProperties trueText"]);
    });

    it("reports a group given as text, and text given as a group", () => {
        expect(errorsWithOurs(layoutWith(tablePart({ navn: "a.b" })))).toEqual(["type"]);
        expect(errorsWithOurs(layoutWith(tablePart({ title: { nb: "a.b" } })))).toEqual(["type"]);
    });

    it("allows the groups a component names after its data, and only as groups", () => {
        const utfallSvarType = (resourceBindings: object) => ({
            id: "utfall",
            type: "Custom",
            tagName: "custom-grouplist-utfall-svar-type",
            dataModelBindings: { data: "a.b" },
            resourceBindings
        });
        expect(errorsWithOurs(layoutWith(utfallSvarType({ mangel: { title: "a.b" }, tema: { title: "a.c" } })))).toEqual([]);
        expect(errorsWithOurs(layoutWith(utfallSvarType({ title: "a.b" })))).toEqual(["type"]);
    });

    it("describes each key for an editor", () => {
        expect(getResourceBindingsSchema("custom-x", { title: null, navn: ["emptyFieldText"] })).toEqual({
            type: "object",
            properties: {
                title: { type: "string", description: "Text resource id for the title." },
                navn: {
                    type: "object",
                    description: "Text resource ids for the navn part of custom-x.",
                    properties: { emptyFieldText: { type: "string", description: "Text resource id shown when there is no value." } },
                    additionalProperties: false
                }
            },
            additionalProperties: false
        });
    });
});

describe("buildLayoutSchema's expressions", () => {
    const headerHiddenWhen = (hidden: unknown) =>
        layoutWith({ id: "heading", type: "Header", size: "L", hidden, textResourceBindings: { title: "heading" } });

    it("accepts a plain value, and a nested expression of Altinn's functions", () => {
        expect(validateWithOurs(headerHiddenWhen(true))).toBe(true);
        expect(validateWithOurs(headerHiddenWhen(["lessThanEq", ["stringLength", ["dataModel", "soeknadGjelder.foelgebrev"]], 0]))).toBe(true);
        expect(validateWithOurs(headerHiddenWhen(["if", ["equals", ["instanceContext", "instanceOwnerPartyId"], "1"], true, "else", false]))).toBe(
            true
        );
    });

    it("rejects a function Altinn does not have, at any depth", () => {
        expect(validateWithOurs(headerHiddenWhen(["lessThenEq", 1, 0]))).toBe(false);
        expect(validateWithOurs(headerHiddenWhen(["not", ["equals", ["dataModell", "a.b"], "x"]]))).toBe(false);
    });

    it("offers every function Altinn's expression schema defines, each with its title", () => {
        const call = ourSchema.definitions.ExpressionCall as { items: { enum: string[]; enumDescriptions: string[] }[] };
        expect([...call.items[0]!.enum].sort()).toEqual([...altinnFunctionNames].sort());
        expect(call.items[0]!.enumDescriptions).toHaveLength(call.items[0]!.enum.length);
        expect(altinnFunctionNames.length > 40).toBe(true);
    });

    it("fails rather than publish a wrong schema when Altinn refers to something it does not replace", () => {
        const changed = JSON.parse(
            JSON.stringify(altinnSchema).replace('"expression.schema.v1.json#/definitions/number"', '"expression.schema.v1.json#/definitions/any"')
        );
        expect(() => buildLayoutSchema(changed, expressionSchema)).toThrow("expression.schema.v1.json#/definitions/any");
        expect(() => buildLayoutSchema(altinnSchema, { definitions: {} })).toThrow("names its functions");
    });
});

describe("layoutAttributeSchemas", () => {
    // Set by a parent component on the components it builds, never written in a layout.
    const SET_BY_PARENT_COMPONENTS = ["formData", "tagName", "text", "texts", "isChildComponent", "resourceValues"];

    it("names exactly the attributes a component reads from its element, less the ones a parent sets", () => {
        const readByComponents = Object.keys(getPropsFromElementAttributes(document.createElement("div")));
        expect(readByComponents.filter((name) => !SET_BY_PARENT_COMPONENTS.includes(name)).sort()).toEqual(
            Object.keys(layoutAttributeSchemas).sort()
        );
    });

    it("lists no deprecated attribute that is still read", () => {
        const readByComponents = Object.keys(getPropsFromElementAttributes(document.createElement("div")));
        expect(Object.keys(deprecatedLayoutAttributes).filter((name) => readByComponents.includes(name))).toEqual([]);
    });
});
