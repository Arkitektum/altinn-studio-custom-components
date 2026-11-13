import { openPageFromLocation } from "./renderers.ts";

// Unmocked on purpose: the button is drawn by the real display layouts page, and writes what devTools reads.
describe("Open in devTools on the display layouts page", () => {
    const { confirm, open } = globalThis;
    const originalWarn = console.warn;
    let opened: unknown[][];
    let confirmAnswer: boolean;
    let confirmMessages: string[];

    beforeEach(async () => {
        localStorage.clear();
        localStorage.setItem("code", '[{"tagName":"custom-divider"}]');
        localStorage.setItem("textResources.en", '{"language":"en","resources":[]}');
        document.body.innerHTML = '<div id="sidebar"></div><main id="admin-main"></main>';
        console.warn = () => {};
        opened = [];
        confirmAnswer = true;
        confirmMessages = [];
        globalThis.confirm = (message?: string) => {
            confirmMessages.push(String(message));
            return confirmAnswer;
        };
        globalThis.open = ((...args: unknown[]) => {
            opened.push(args);
            return null;
        }) as typeof open;
        Object.assign(globalThis, {
            displayLayouts: [
                {
                    appOwner: "dibk",
                    appName: "et-v4",
                    displayLayouts: [
                        {
                            name: "DisplayLayout",
                            layout: {
                                data: {
                                    layout: [
                                        {
                                            id: "tittel",
                                            type: "Custom",
                                            tagName: "custom-field-data",
                                            dataModelBindings: { simpleBinding: "soeknad.tittel" }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            ],
            exampleData: [
                { appOwner: "dibk", appName: "et-v4", dataType: "Vedlegg", files: [{ name: "vedlegg.xml", data: { navn: "Tegning" } }] },
                {
                    appOwner: "dibk",
                    appName: "et-v4",
                    dataType: "Byggesoknad",
                    files: [
                        { name: "eksempel-1.xml", data: { soeknad: { tittel: "En" } } },
                        { name: "eksempel-2.xml", data: { soeknad: { tittel: "To" } } }
                    ]
                }
            ],
            applicationMetadata: [],
            altinnStudioForms: [{ appOwner: "dibk", appName: "et-v4", dataType: "Byggesoknad" }],
            multilingualDefaultTextResources: [],
            multilingualAppResourceValues: [
                { appOwner: "dibk", appName: "et-v4", resourceValues: [{ id: "app.title", values: { nb: "Tittel", nn: "Tittel på nynorsk" } }] }
            ],
            appResourceValues: [],
            defaultTextResources: undefined
        });
        history.replaceState(null, "", "#/display-layouts?owner=dibk&app=et-v4&lang=nn&file.Byggesoknad=eksempel-2.xml");
        await openPageFromLocation();
        await new Promise((resolve) => setTimeout(resolve, 20));
    });

    afterEach(() => {
        globalThis.confirm = confirm;
        globalThis.open = open;
        console.warn = originalWarn;
        history.replaceState(null, "", "#");
    });

    it("draws the button above the form", () => {
        const button = document.querySelector("#admin-main .open-in-devtools-button") as HTMLButtonElement;
        expect(button.textContent).toBe("Open in devTools");
        const page = document.querySelector("#admin-main > .page")!;
        expect(button.parentElement!.parentElement).toBe(page.parentElement);
        expect(Boolean(button.parentElement!.compareDocumentPosition(page) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true);
    });

    it("gives devTools the form, the chosen example data, the app's text resources and the language, then opens it in a new tab", () => {
        (document.querySelector("#admin-main .open-in-devtools-button") as HTMLButtonElement).click();
        expect(JSON.parse(localStorage.getItem("code")!)).toEqual([
            { id: "tittel", type: "Custom", tagName: "custom-field-data", dataModelBindings: { simpleBinding: "soeknad.tittel" } }
        ]);
        expect(JSON.parse(localStorage.getItem("dataModels")!)).toEqual([
            { dataType: "Byggesoknad", data: { soeknad: { tittel: "To" } } },
            { dataType: "Vedlegg", data: { navn: "Tegning" } }
        ]);
        expect(JSON.parse(localStorage.getItem("textResources.nn")!)).toEqual({
            language: "nn",
            resources: [{ id: "app.title", value: "Tittel på nynorsk" }]
        });
        expect(localStorage.getItem("textResources.en")).toBeNull();
        expect(localStorage.getItem("devToolsLanguage")).toBe("nn");
        expect(opened).toEqual([["/devTools", "_blank", "noopener"]]);
        expect(confirmMessages).toEqual([
            "Replace the layout code, data models and text resources in devTools with dibk/et-v4 (DisplayLayout)? Export the devTools workspace first to keep what is there."
        ]);
    });

    it("changes nothing and opens nothing when the replacement is not confirmed", () => {
        confirmAnswer = false;
        (document.querySelector("#admin-main .open-in-devtools-button") as HTMLButtonElement).click();
        expect(localStorage.getItem("code")).toBe('[{"tagName":"custom-divider"}]');
        expect(localStorage.getItem("devToolsLanguage")).toBeNull();
        expect(opened).toEqual([]);
    });
});
