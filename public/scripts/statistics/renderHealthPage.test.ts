import "../../../src/components/index.ts";
import { openPageFromLocation, redrawOpenPage, renderAdminSidebar } from "./renderers.ts";

// Unmocked on purpose: the page is opened, run and redrawn the way a reader does it.
function settle() {
    return new Promise((resolve) => setTimeout(resolve, 30));
}

describe("render health page", () => {
    const originalWarn = console.warn;
    let main: HTMLElement;

    beforeEach(async () => {
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
                                        {
                                            id: "liste",
                                            type: "Custom",
                                            tagName: "custom-feedbacklist-data",
                                            dataModelBindings: { simpleBinding: "antall" }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            ],
            exampleData: [
                {
                    appOwner: "dibk",
                    appName: "et-v4",
                    dataType: "Byggesoknad",
                    files: [
                        { name: "feil.xml", data: { antall: 42 } },
                        { name: "tom.xml", data: {} }
                    ]
                }
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
            Array.from(document.querySelectorAll("#sidebar button")).find((button) => button.textContent === "Render health") as HTMLButtonElement
        ).click();
        expect(location.hash).toBe("#/render-health");
        expect(main.querySelector("h2")!.textContent).toBe("Render health");
        expect((main.querySelector("#render-health-check-button") as HTMLButtonElement).textContent).toBe("Check all apps");
        expect(main.querySelector("#render-health-results")!.textContent).toBe("");
    });

    it("checks every app when the button is pressed, and lists what could not be drawn", async () => {
        history.replaceState(null, "", "#/render-health");
        await openPageFromLocation();
        const button = main.querySelector("#render-health-check-button") as HTMLButtonElement;
        button.click();
        expect(button.disabled).toBe(true);
        expect(button.textContent).toBe("Checking…");
        await settle();
        expect(button.disabled).toBe(false);
        expect(button.textContent).toBe("Check all apps");
        expect(main.querySelector(".render-health-summary")!.textContent).toBe("1 component could not be drawn, in 1 of 2 drawings.");
        const cells = Array.from(main.querySelectorAll(".render-health-failures tbody td")).map((cell) => cell.textContent);
        expect(cells.slice(0, 4)).toEqual(["dibk/et-v4", "DisplayLayout", "feil.xml", "<custom-feedbacklist-data> liste"]);
    });

    it("keeps the last results when opened again, and says when the data has been synchronized since", async () => {
        history.replaceState(null, "", "#/render-health");
        await openPageFromLocation();
        (main.querySelector("#render-health-check-button") as HTMLButtonElement).click();
        await settle();
        globalThis.lastUpdated = "2026-11-14T10:00:00.000Z";
        await redrawOpenPage();
        expect(main.querySelector(".render-health-summary")!.textContent).toBe("1 component could not be drawn, in 1 of 2 drawings.");
        expect(main.querySelector(".render-health-stale")).not.toBeNull();
        expect(main.querySelectorAll("h2")).toHaveLength(1);
    });
});
