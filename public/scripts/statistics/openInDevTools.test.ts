import { WORKSPACE_FORMAT } from "../devTools/workspace.ts";
import { getDevToolsWorkspaceForDisplayLayout } from "./openInDevTools.ts";

const components = [{ id: "tittel", type: "Custom", tagName: "custom-field-data", dataModelBindings: { simpleBinding: "soeknad.tittel" } }];
const multilingualAppResourceValues = [
    {
        appOwner: "dibk",
        appName: "et-v4",
        resourceValues: [
            { id: "app.title", values: { nb: "Tittel", nn: "Tittel på nynorsk" } },
            { id: "app.only.nb", values: { nb: "Bare bokmål" } }
        ]
    },
    { appOwner: "dibk", appName: "other-v1", resourceValues: [{ id: "other.title", values: { nb: "Annen", en: "Other" } }] }
];
const base = {
    appOwner: "dibk",
    appName: "et-v4",
    components,
    dataModels: [
        { dataType: "Vedlegg", data: { "vedlegg.xml": { navn: "Tegning" } } },
        { dataType: "Byggesoknad", data: { "eksempel-1.xml": { soeknad: { tittel: "En" } }, "eksempel-2.xml": { soeknad: { tittel: "To" } } } }
    ],
    mainDataType: "Byggesoknad",
    fileNames: { Byggesoknad: "eksempel-2.xml" },
    multilingualAppResourceValues
};

describe("getDevToolsWorkspaceForDisplayLayout", () => {
    it("is a devTools workspace with the form's components as its layout code", () => {
        const workspace = getDevToolsWorkspaceForDisplayLayout(base);
        expect(workspace.format).toBe(WORKSPACE_FORMAT);
        expect(workspace.version).toBe(1);
        expect(workspace.layoutCode).toEqual(components);
    });
    it("gives each data type the example file chosen on the page, the first file when none is, and the main data type first", () => {
        expect(getDevToolsWorkspaceForDisplayLayout(base).dataModels).toEqual([
            { dataType: "Byggesoknad", data: { soeknad: { tittel: "To" } } },
            { dataType: "Vedlegg", data: { navn: "Tegning" } }
        ]);
    });
    it("falls back to the first file when the chosen one is not among the data type's files", () => {
        const workspace = getDevToolsWorkspaceForDisplayLayout({ ...base, fileNames: { Byggesoknad: "borte.xml" } });
        expect(workspace.dataModels[0]).toEqual({ dataType: "Byggesoknad", data: { soeknad: { tittel: "En" } } });
    });
    it("gives a data type without example files empty data", () => {
        const workspace = getDevToolsWorkspaceForDisplayLayout({ ...base, dataModels: [{ dataType: "Byggesoknad", data: {} }] });
        expect(workspace.dataModels).toEqual([{ dataType: "Byggesoknad", data: {} }]);
    });
    it("keeps the order of the data types when the main one is not among them", () => {
        const workspace = getDevToolsWorkspaceForDisplayLayout({ ...base, mainDataType: undefined });
        expect(workspace.dataModels.map(({ dataType }) => dataType)).toEqual(["Vedlegg", "Byggesoknad"]);
    });
    it("takes the app's own text resources in each language it has any in, and no other app's", () => {
        expect(getDevToolsWorkspaceForDisplayLayout(base).textResources).toEqual({
            nb: {
                language: "nb",
                resources: [
                    { id: "app.title", value: "Tittel" },
                    { id: "app.only.nb", value: "Bare bokmål" }
                ]
            },
            nn: { language: "nn", resources: [{ id: "app.title", value: "Tittel på nynorsk" }] }
        });
    });
    it("takes no text resources for an app without any", () => {
        expect(getDevToolsWorkspaceForDisplayLayout({ ...base, appName: "unknown-v1" }).textResources).toEqual({});
    });
});
