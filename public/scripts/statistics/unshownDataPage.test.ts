import "../../../src/components/index.ts";
import { openPageFromLocation, redrawOpenPage, renderAdminSidebar } from "./renderers.ts";

// Unmocked on purpose: the page is opened, run and redrawn the way a reader does it.
function settle() {
    return new Promise((resolve) => setTimeout(resolve, 30));
}

describe("unshown data page", () => {
    const originalWarn = console.warn;
    let main: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="sidebar"></div><main id="admin-main"></main>';
        main = document.getElementById("admin-main")!;
        console.warn = () => {};
        Object.assign(globalThis, {
            lastUpdated: "2026-11-13T10:00:00.000Z",
            displayLayouts: [
                {
                    appOwner: "dibk",
                    appName: "et-v4",
                    dataType: "Byggesoknad",
                    displayLayouts: [
                        {
                            name: "DisplayLayout",
                            layout: {
                                data: {
                                    layout: [
                                        { id: "tittel", type: "Custom", tagName: "custom-field-data", dataModelBindings: { simpleBinding: "tittel" } }
                                    ]
                                }
                            }
                        }
                    ],
                    subForms: [
                        { appName: "uten-data-v1", dataType: "Kart", layout: { data: { layout: [{ id: "k", tagName: "custom-field-data" }] } } }
                    ]
                }
            ],
            exampleData: [
                { appOwner: "dibk", appName: "et-v4", dataType: "Byggesoknad", files: [{ name: "a.xml", data: { tittel: "Søknad", ubrukt: "x" } }] }
            ],
            altinnStudioForms: [{ appOwner: "dibk", appName: "et-v4", dataType: "Byggesoknad" }],
            multilingualDefaultTextResources: [],
            multilingualAppResourceValues: []
        });
        history.replaceState(null, "", "#");
        renderAdminSidebar();
    });

    afterEach(() => {
        console.warn = originalWarn;
        history.replaceState(null, "", "#");
    });

    it("opens from the sidebar, with a button and nothing checked yet", () => {
        (
            Array.from(document.querySelectorAll("#sidebar button")).find((button) => button.textContent === "Unshown data") as HTMLButtonElement
        ).click();
        expect(location.hash).toBe("#/unshown-data");
        expect(main.querySelector("h2")!.textContent).toBe("Unshown data");
        expect((main.querySelector("#unshown-data-check-button") as HTMLButtonElement).textContent).toBe("Check all apps");
        expect(main.querySelector("#unshown-data-results")!.textContent).toBe("");
    });

    it("checks every form with example data when the button is pressed, and lists the values never shown", async () => {
        history.replaceState(null, "", "#/unshown-data");
        await openPageFromLocation();
        const button = main.querySelector("#unshown-data-check-button") as HTMLButtonElement;
        button.click();
        expect(button.disabled).toBe(true);
        await settle();
        expect(button.disabled).toBe(false);
        expect(main.querySelector(".unshown-data-summary")!.textContent).toBe("1 value is never shown, in 1 of 1 form.");
        expect(Array.from(main.querySelectorAll(".unshown-data-form li")).map((item) => item.textContent)).toEqual(["ubrukt in 1 of 1 example file"]);
    });

    it("keeps the last results when drawn again after a synchronization, and says they are from before it", async () => {
        history.replaceState(null, "", "#/unshown-data");
        await openPageFromLocation();
        (main.querySelector("#unshown-data-check-button") as HTMLButtonElement).click();
        await settle();
        globalThis.lastUpdated = "2026-11-14T10:00:00.000Z";
        await redrawOpenPage();
        expect(main.querySelector(".unshown-data-summary")).not.toBeNull();
        expect(main.querySelector(".render-health-stale")).not.toBeNull();
        expect(main.querySelectorAll("h2")).toHaveLength(1);
    });
});
