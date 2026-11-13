import { renderResults, renderSidebar } from "./renderers.ts";

// Unmocked on purpose: the layout check runs from the sidebar and the preview, through the real layout code, data models and component classes.
describe("layout check in devTools", () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem(
            "code",
            JSON.stringify([
                { id: "tittel", type: "Custom", tagName: "custom-field-data", dataModelBindings: { simpleBinding: "soeknad.tittel", feil: "x" } },
                { id: "navn", type: "Custom", tagName: "custom-field-data", dataModelBindings: { simpleBinding: "soeknad.navn" } }
            ])
        );
        localStorage.setItem("dataModels", JSON.stringify([{ dataType: "main", data: { soeknad: { tittel: "Søknad" } } }]));
        globalThis.textResources = { resources: [] };
        globalThis.defaultTextResources = { resources: [] };
        document.body.innerHTML = `<aside id="sidebar"></aside><section id="data-input"></section><div id="code-results"></div>`;
    });
    afterEach(() => {
        delete (globalThis as { textResources?: unknown }).textResources;
        delete (globalThis as { defaultTextResources?: unknown }).defaultTextResources;
    });
    it("counts the findings on the layout code item in the sidebar", () => {
        renderSidebar();
        const counts = [...document.querySelectorAll("#layout-code #layout-findings-indicators span")].map((span) => span.textContent);
        expect(counts).toEqual(["1", "1"]);
    });
    it("lists the findings above the layout code editor when the count is clicked", () => {
        renderSidebar();
        (document.querySelector("#layout-code .layout-findings-button") as HTMLButtonElement).click();
        const items = [...document.querySelectorAll("#data-input .layout-findings li")].map((item) => item.textContent);
        expect(items).toEqual([
            "tittel dataModelBindings.feil is never read",
            'navn dataModelBindings.simpleBinding: no value at "soeknad.navn" in the main data model'
        ]);
        expect(document.querySelector("#layout-code")!.classList.contains("active")).toBe(true);
    });
    it("checks again when the preview is drawn again", () => {
        renderSidebar();
        localStorage.setItem(
            "code",
            JSON.stringify([{ id: "tittel", type: "Custom", tagName: "custom-field-data", dataModelBindings: { simpleBinding: "soeknad.tittel" } }])
        );
        renderResults();
        const counts = [...document.querySelectorAll("#layout-findings-indicators span")].map((span) => span.textContent);
        expect(counts).toEqual(["0", "0"]);
    });
});
