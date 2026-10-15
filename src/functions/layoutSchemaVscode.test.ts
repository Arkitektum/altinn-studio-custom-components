/**
 * @jest-environment node
 */
// In Node rather than jsdom: VS Code's JSON engine needs no DOM, and under jsdom jest picks its packages' browser builds, which are ES modules it cannot load.
import { TextDocument } from "vscode-languageserver-textdocument";
import altinnSchema from "../data/altinn/layout.schema.v1.json";
import { buildLayoutSchema } from "./layoutSchemaHelpers.ts";
import expressionSchema from "../data/altinn/expression.schema.v1.json";
import { getLanguageService } from "vscode-json-languageservice";

/**
 * The layout schema as VS Code sees it, through the JSON engine VS Code itself uses.
 *
 * ajv validated the first published schema in a second, yet VS Code's engine never finished a real layout with it and froze completion and validation for every JSON file. The two engines treat a schema differently, so what an editor shows is checked here, in the engine that shows it.
 */
const SCHEMA_URI = "file:///layout.schema.json";
const schemaText = JSON.stringify(buildLayoutSchema(altinnSchema, expressionSchema));

const service = getLanguageService({
    // Any other address fails, so a reference to another file would show up here as an unresolved schema.
    schemaRequestService: (uri) => (uri === SCHEMA_URI ? Promise.resolve(schemaText) : Promise.reject(new Error(`Not available: ${uri}`)))
});
service.configure({ validate: true });

/** A diagnostic's message as text, which newer versions of the engine may give as markup. */
const messageText = (diagnostic: { message: string | { value: string } }) =>
    typeof diagnostic.message === "string" ? diagnostic.message : diagnostic.message.value;

function openLayout(components: object[]) {
    const text = JSON.stringify({ $schema: SCHEMA_URI, data: { layout: components } }, null, 2);
    const document = TextDocument.create("file:///App/ui/form/layouts/DisplayLayout.json", "json", 1, text);
    return { text, document, jsonDocument: service.parseJSONDocument(document) };
}

/** The labels VS Code offers just after `marker` in the layout. */
async function completionsAfter(components: object[], marker: string) {
    const { text, document, jsonDocument } = openLayout(components);
    const completion = await service.doComplete(document, document.positionAt(text.indexOf(marker) + marker.length), jsonDocument);
    return (completion?.items || []).map((item) => item.label.replace(/"/g, "")).sort();
}

describe("the layout schema in VS Code's JSON engine", () => {
    it("validates a layout full of nested expressions quickly", async () => {
        // Each of these took VS Code's engine about two seconds with Altinn's expression checking.
        const components = [...Array(20)].map((_, index) => ({
            id: `heading${index}`,
            type: "Custom",
            tagName: "custom-header-text",
            size: "h2",
            hidden: ["lessThanEq", ["stringLength", ["dataModel", `model.field${index}`]], 0]
        }));
        const { document, jsonDocument } = openLayout(components);
        const started = Date.now();
        const diagnostics = await service.doValidation(document, jsonDocument);
        expect(Date.now() - started < 2000).toBe(true);
        expect(diagnostics.map(messageText)).toEqual([]);
    });

    it("offers only the binding keys of the component's own tag", async () => {
        const fieldData = { id: "field", type: "Custom", tagName: "custom-field-data", dataModelBindings: {} };
        expect(await completionsAfter([fieldData], '"dataModelBindings": {')).toEqual(["data", "dataTitle", "simpleBinding"]);
        const booleanData = { ...fieldData, tagName: "custom-field-boolean-data" };
        expect(await completionsAfter([booleanData], '"dataModelBindings": {')).toEqual([
            "data",
            "defaultData",
            "falseData",
            "simpleBinding",
            "trueData"
        ]);
    });

    it("offers only the resourceBindings keys of the component's own tag, and the keys of a group", async () => {
        const tablePart = (resourceBindings: object) => ({
            id: "part",
            type: "Custom",
            tagName: "custom-table-part",
            dataModelBindings: { data: "a.b" },
            resourceBindings
        });
        // VS Code leaves out a key the object already has, so each list is asked for where nothing is written yet.
        expect(await completionsAfter([tablePart({})], '"resourceBindings": {')).toEqual([
            "emptyFieldText",
            "epost",
            "navn",
            "telefonnummer",
            "title"
        ]);
        expect(await completionsAfter([tablePart({ navn: {} })], '"navn": {')).toEqual(["emptyFieldText", "title"]);
    });

    it("offers an attribute only some components read on those alone, and says who reads it", async () => {
        const listData = { id: "list", type: "Custom", tagName: "custom-list-data", hideIfEmpty: true, dataModelBindings: { data: "a.b" } };
        const fieldData = { ...listData, tagName: "custom-field-data" };
        expect(await completionsAfter([listData], '"hideIfEmpty": true,')).toContain("itemKey");
        expect(await completionsAfter([fieldData], '"hideIfEmpty": true,')).not.toContain("itemKey");
        expect(await completionsAfter([fieldData], '"hideIfEmpty": true,')).toContain("hideTitle");

        const { text, document, jsonDocument } = openLayout([{ ...listData, itemKey: "navn" }]);
        const hover = await service.doHover(document, document.positionAt(text.indexOf('"itemKey"') + 2), jsonDocument);
        // VS Code escapes hover text as Markdown, so the backslashes are left out before comparing.
        expect(JSON.stringify(hover?.contents).replace(/\\/g, "")).toContain("Read by custom-list-data.");
    });

    it("offers the tag names", async () => {
        const labels = await completionsAfter([{ id: "field", type: "Custom", tagName: "" }], '"tagName": ');
        expect(labels).toContain("custom-field-data");
        expect(labels).toContain("custom-dispensasjon");
    });

    it("describes a binding key on hover, and warns about a deprecated one with its hint", async () => {
        const fieldData = { id: "field", type: "Custom", tagName: "custom-field-data", dataModelBindings: { data: "a.b", dataTitle: "a.c" } };
        const { text, document, jsonDocument } = openLayout([fieldData]);
        const hover = await service.doHover(document, document.positionAt(text.indexOf('"dataTitle"') + 2), jsonDocument);
        expect(JSON.stringify(hover?.contents)).toContain("Optional for custom");

        const dispensasjon = { id: "disp", type: "Custom", tagName: "custom-dispensasjon", dataModelBindings: { dispensasjonReferanse: "a.b" } };
        const opened = openLayout([dispensasjon]);
        const messages = (await service.doValidation(opened.document, opened.jsonDocument)).map(messageText);
        expect(messages).toContain("Renamed to dispensasjonsreferanse.");
    });

    it("warns about a function Altinn does not have", async () => {
        const { document, jsonDocument } = openLayout([
            { id: "heading", type: "Header", size: "L", hidden: ["lessThenEq", 1, 0], textResourceBindings: { title: "x" } }
        ]);
        const messages = (await service.doValidation(document, jsonDocument)).map(messageText);
        expect(messages.some((message) => message.includes("lessThanEq"))).toBe(true);
    });
});
