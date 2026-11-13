import { WORKSPACE_FORMAT, getWorkspace, getWorkspaceFileName, parseWorkspace, storeWorkspace } from "./workspace.ts";

const layoutCode = [{ id: "tittel", type: "Custom", tagName: "custom-field-data", dataModelBindings: { simpleBinding: "soeknad.tittel" } }];
const dataModels = [{ dataType: "main", data: { soeknad: { tittel: "Søknad" } } }];
const nb = { language: "nb", resources: [{ id: "app.title", value: "Tittel" }] };
const nn = { language: "nn", resources: [{ id: "app.title", value: "Tittel på nynorsk" }] };

describe("getWorkspace", () => {
    beforeEach(() => {
        localStorage.clear();
    });
    it("collects the layout code, the data models and the text resources of each language that has any", () => {
        localStorage.setItem("code", JSON.stringify(layoutCode));
        localStorage.setItem("dataModels", JSON.stringify(dataModels));
        localStorage.setItem("textResources", JSON.stringify(nb));
        localStorage.setItem("textResources.nn", JSON.stringify(nn));
        expect(getWorkspace()).toEqual({ format: WORKSPACE_FORMAT, version: 1, layoutCode, dataModels, textResources: { nb, nn } });
    });
    it("is empty when nothing is stored", () => {
        expect(getWorkspace()).toEqual({ format: WORKSPACE_FORMAT, version: 1, layoutCode: {}, dataModels: [], textResources: {} });
    });
});

describe("getWorkspaceFileName", () => {
    it("names the file after the local date", () => {
        expect(getWorkspaceFileName(new Date(2026, 10, 3, 23, 59))).toBe("devtools-workspace-2026-11-03.json");
    });
});

describe("parseWorkspace", () => {
    const valid = { format: WORKSPACE_FORMAT, version: 1, layoutCode, dataModels, textResources: { nb, nn } };
    const parse = (value: unknown) => parseWorkspace(JSON.stringify(value));
    it("reads an exported workspace", () => {
        expect(parse(valid)).toEqual({ workspace: valid });
    });
    it("fills in what an exported workspace leaves out", () => {
        expect(parse({ format: WORKSPACE_FORMAT, version: 1 })).toEqual({
            workspace: { format: WORKSPACE_FORMAT, version: 1, layoutCode: [], dataModels: [], textResources: {} }
        });
    });
    it("leaves out text resources for a language devTools does not offer", () => {
        expect(parse({ ...valid, textResources: { nb, se: { resources: [] } } }).workspace!.textResources).toEqual({ nb });
    });
    it("reports a file that is not JSON", () => {
        const { workspace, error } = parseWorkspace("{");
        expect(workspace).toBeUndefined();
        expect(error!.startsWith("The file is not valid JSON: ")).toBe(true);
    });
    it.each([[[valid]], [{ ...valid, format: "something-else" }], [null], ["text"]])("reports a file that is not a workspace: %p", (value) => {
        expect(parse(value)).toEqual({ error: "The file is not a devTools workspace." });
    });
    it("reports a version it cannot read", () => {
        expect(parse({ ...valid, version: 2 })).toEqual({ error: "Workspace version 2 cannot be imported, only version 1." });
    });
    it.each([[{}], [["text"]], [[null]]])("reports data models that are not a list of data models: %p", (value) => {
        expect(parse({ ...valid, dataModels: value })).toEqual({ error: "dataModels in the file is not a list of data models." });
    });
    it.each([[[nb]], [{ nb: "text" }], ["text"]])("reports text resources that are not by language: %p", (value) => {
        expect(parse({ ...valid, textResources: value })).toEqual({ error: "textResources in the file is not text resources by language." });
    });
});

describe("storeWorkspace", () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem("textResources.en", JSON.stringify({ language: "en", resources: [] }));
    });
    it("replaces what is stored, removing text resources for a language the workspace has none for", () => {
        storeWorkspace({ format: WORKSPACE_FORMAT, version: 1, layoutCode, dataModels, textResources: { nb, nn } });
        expect(JSON.parse(localStorage.getItem("code")!)).toEqual(layoutCode);
        expect(JSON.parse(localStorage.getItem("dataModels")!)).toEqual(dataModels);
        expect(JSON.parse(localStorage.getItem("textResources")!)).toEqual(nb);
        expect(JSON.parse(localStorage.getItem("textResources.nn")!)).toEqual(nn);
        expect(localStorage.getItem("textResources.en")).toBeNull();
    });
    it("stores the layout code and text resources formatted, the way their editors show them", () => {
        storeWorkspace({ format: WORKSPACE_FORMAT, version: 1, layoutCode, dataModels, textResources: { nb } });
        expect(localStorage.getItem("code")).toBe(JSON.stringify(layoutCode, null, 2));
        expect(localStorage.getItem("textResources")).toBe(JSON.stringify(nb, null, 2));
    });
    it("gives back what was exported", () => {
        storeWorkspace({ format: WORKSPACE_FORMAT, version: 1, layoutCode, dataModels, textResources: { nn } });
        const exported = getWorkspace();
        localStorage.clear();
        storeWorkspace(parseWorkspace(JSON.stringify(exported)).workspace!);
        expect(getWorkspace()).toEqual(exported);
    });
});
