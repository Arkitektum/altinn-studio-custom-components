import { WORKSPACE_FORMAT, getWorkspace } from "./workspace.ts";
import { exportWorkspace, importWorkspace, renderSidebar } from "./renderers.ts";
import { applyLanguage } from "./language.ts";

// Unmocked on purpose: export and import go through the real localStorage, globalThis and sidebar.
describe("workspace export and import in devTools", () => {
    const imported = {
        format: WORKSPACE_FORMAT,
        version: 1,
        layoutCode: [{ id: "importert", type: "Custom", tagName: "custom-field-data", dataModelBindings: { simpleBinding: "a" } }],
        dataModels: [{ dataType: "importert", data: { a: "A" } }],
        textResources: { nb: { language: "nb", resources: [{ id: "app.title", value: "Importert" }] } }
    };
    let alerts: string[];
    let confirmAnswer: boolean;
    const { alert, confirm } = globalThis;
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem("code", "[]");
        localStorage.setItem("dataModels", JSON.stringify([{ dataType: "main", data: {} }]));
        localStorage.setItem("textResources", JSON.stringify({ language: "nb", resources: [{ id: "app.title", value: "Før" }] }));
        localStorage.setItem("textResources.nn", JSON.stringify({ language: "nn", resources: [] }));
        document.body.innerHTML = `<aside id="sidebar"></aside><section id="data-input"><textarea id="code-input"></textarea></section><div id="code-results"></div>`;
        applyLanguage("nb");
        renderSidebar();
        alerts = [];
        confirmAnswer = true;
        globalThis.alert = (message?: string) => {
            alerts.push(String(message));
        };
        globalThis.confirm = () => confirmAnswer;
    });
    afterEach(() => {
        globalThis.alert = alert;
        globalThis.confirm = confirm;
        delete (globalThis as { textResources?: unknown }).textResources;
        delete (globalThis as { defaultTextResources?: unknown }).defaultTextResources;
        delete (globalThis as { selectedLanguage?: unknown }).selectedLanguage;
    });

    it("draws Export and Import buttons in the sidebar", () => {
        expect(document.querySelector("#sidebar .export-workspace-button")!.textContent).toBe("Export");
        expect(document.querySelector("#sidebar .import-workspace-button")!.textContent).toBe("Import");
        const input = document.querySelector("#sidebar .import-workspace-input") as HTMLInputElement;
        expect(input.type).toBe("file");
        expect(input.hidden).toBe(true);
    });

    it("exports the workspace as a dated JSON file, and frees the file's address afterwards", async () => {
        const { createObjectURL, revokeObjectURL } = URL;
        const { click } = HTMLAnchorElement.prototype;
        const clickedLinks: HTMLAnchorElement[] = [];
        const revokedUrls: string[] = [];
        let exportedBlob: Blob | undefined;
        URL.createObjectURL = (blob: Blob) => {
            exportedBlob = blob;
            return "blob:workspace";
        };
        URL.revokeObjectURL = (url: string) => {
            revokedUrls.push(url);
        };
        HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
            clickedLinks.push(this);
        };
        try {
            exportWorkspace();
            await new Promise((resolve) => setTimeout(resolve, 0));
        } finally {
            URL.createObjectURL = createObjectURL;
            URL.revokeObjectURL = revokeObjectURL;
            HTMLAnchorElement.prototype.click = click;
        }
        expect(clickedLinks).toHaveLength(1);
        expect(clickedLinks[0]!.href).toBe("blob:workspace");
        expect(/^devtools-workspace-\d{4}-\d{2}-\d{2}\.json$/.test(clickedLinks[0]!.download)).toBe(true);
        expect(revokedUrls).toEqual(["blob:workspace"]);
        expect(exportedBlob!.type).toBe("application/json");
        const exportedText: string = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsText(exportedBlob!);
        });
        expect(JSON.parse(exportedText)).toEqual(getWorkspace());
    });

    it("replaces the workspace once confirmed, and draws it again with the editor closed", () => {
        expect(importWorkspace(JSON.stringify(imported), "arbeid.json")).toBe(true);
        expect(getWorkspace()).toEqual(imported);
        expect(globalThis.textResources).toEqual(imported.textResources.nb);
        expect(document.getElementById("code-input")).toBeNull();
        expect(document.querySelector("#data-model-list")!.textContent).toContain("importert");
        expect(alerts).toEqual([]);
    });

    it("changes nothing when the replacement is not confirmed", () => {
        const before = getWorkspace();
        confirmAnswer = false;
        expect(importWorkspace(JSON.stringify(imported), "arbeid.json")).toBe(false);
        expect(getWorkspace()).toEqual(before);
        expect(document.getElementById("code-input")).not.toBeNull();
    });

    it("reports a file that is not a workspace and changes nothing", () => {
        const before = getWorkspace();
        let asked = false;
        globalThis.confirm = () => (asked = true);
        expect(importWorkspace('{"format":"other"}', "feil.json")).toBe(false);
        expect(alerts).toEqual(["feil.json could not be imported. The file is not a devTools workspace."]);
        expect(asked).toBe(false);
        expect(getWorkspace()).toEqual(before);
    });

    it("imports the file chosen in the file input", async () => {
        const input = document.querySelector("#sidebar .import-workspace-input") as HTMLInputElement;
        Object.defineProperty(input, "files", { value: [{ name: "arbeid.json", text: async () => JSON.stringify(imported) }], configurable: true });
        await (input.onchange as unknown as () => Promise<void>)();
        expect(getWorkspace()).toEqual(imported);
    });
});
