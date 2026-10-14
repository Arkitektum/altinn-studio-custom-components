import type { DataModelBindingKeys } from "../types.ts";

import { ALTINN_LAYOUT_SCHEMA_BASE_URL, LAYOUT_SCHEMA_ID, buildLayoutSchema, getDataModelBindingsSchema } from "./layoutSchemaHelpers.ts";
import { deprecatedLayoutAttributes, layoutAttributeSchemas } from "../constants/layoutAttributeSchemas.ts";
import Ajv from "ajv";
import altinnSchema from "../data/altinn/layout.schema.v1.json";
import { getDataModelBindingKeysByTagName } from "./componentHelpers.ts";
import { getPropsFromElementAttributes } from "./htmlElementHelpers.ts";

type Component = Record<string, unknown>;

/** Every definition Altinn's layout schema uses from its expression schema, accepted as anything: these tests are about custom components, not expressions. */
function expressionSchemaStub(id: string) {
    const used: Set<string> = new Set();
    JSON.stringify(altinnSchema, (key, value) => {
        if (key === "$ref" && typeof value === "string" && value.startsWith("expression.schema.v1.json")) used.add(value.split("/").pop()!);
        return value;
    });
    return { $id: id, definitions: Object.fromEntries([...used].map((name) => [name, {}])) };
}

function compile(schema: object, expressionSchemaId: string) {
    // strict is off for the keywords editors read and validators do not, such as deprecationMessage.
    const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false });
    ajv.addSchema(expressionSchemaStub(expressionSchemaId));
    return ajv.compile(schema);
}

const validateWithOurs = compile(buildLayoutSchema(altinnSchema), `${ALTINN_LAYOUT_SCHEMA_BASE_URL}expression.schema.v1.json`);
const validateWithAltinns = compile(altinnSchema, "https://altinncdn.no/schemas/json/layout/expression.schema.v1.json");

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
        const customDefinition = JSON.stringify(buildLayoutSchema(altinnSchema).definitions);
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
        expect(bindingsSchema.properties).toEqual({
            old: {
                $ref: "#/definitions/IRawDataModelBinding",
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

    it("names itself, points Altinn's other schema files at Altinn, and leaves the copy it was given alone", () => {
        const before = JSON.stringify(altinnSchema);
        const schema = buildLayoutSchema(altinnSchema);
        expect(schema.$id).toBe(LAYOUT_SCHEMA_ID);
        expect(JSON.stringify(schema)).not.toContain('"$ref":"expression.schema.v1.json');
        expect(JSON.stringify(schema)).toContain(`"$ref":"${ALTINN_LAYOUT_SCHEMA_BASE_URL}expression.schema.v1.json#/definitions/`);
        expect(JSON.stringify(altinnSchema)).toBe(before);
    });

    it("fails rather than publish a wrong schema when Altinn's Custom definition changes shape", () => {
        const changed = JSON.parse(JSON.stringify(altinnSchema)) as { definitions: Record<string, unknown> };
        changed.definitions.CompCustomExternal = { type: "object" };
        expect(() => buildLayoutSchema(changed)).toThrow("CompCustomExternal");
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
