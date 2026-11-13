import { applyLanguage, getDefaultTextResourcesForLanguage } from "./language.ts";
import multilingualDefaultTextResources from "../../../src/data/resources.json";

describe("getDefaultTextResourcesForLanguage", () => {
    const resources = [
        { id: "resource.a", values: { nb: "A på bokmål", nn: "A på nynorsk" } },
        { id: "resource.b", values: { nb: "B på bokmål" } }
    ];
    it("returns the package's text resources in the language when there are any", () => {
        expect(getDefaultTextResourcesForLanguage("nn", resources)).toEqual({
            language: "nn",
            resources: [{ id: "resource.a", value: "A på nynorsk" }]
        });
    });
    it("falls back to nb for a language without any", () => {
        expect(getDefaultTextResourcesForLanguage("en", resources)).toEqual({
            language: "nb",
            resources: [
                { id: "resource.a", value: "A på bokmål" },
                { id: "resource.b", value: "B på bokmål" }
            ]
        });
    });
    it("reads src/data/resources.json when no list is given", () => {
        const nb = getDefaultTextResourcesForLanguage("nb");
        expect(nb.language).toBe("nb");
        expect(nb.resources).toHaveLength(multilingualDefaultTextResources.filter((resource) => "nb" in resource.values).length);
        expect(nb.resources.length > 0).toBe(true);
    });
});

describe("applyLanguage", () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem("textResources", JSON.stringify({ language: "nb", resources: [{ id: "app.title", value: "Tittel" }] }));
        localStorage.setItem("textResources.nn", JSON.stringify({ language: "nn", resources: [{ id: "app.title", value: "Tittel på nynorsk" }] }));
    });
    afterEach(() => {
        delete (globalThis as { textResources?: unknown }).textResources;
        delete (globalThis as { defaultTextResources?: unknown }).defaultTextResources;
        delete (globalThis as { selectedLanguage?: unknown }).selectedLanguage;
    });
    it("puts the language and its text resources on globalThis", () => {
        applyLanguage("nn");
        expect(globalThis.selectedLanguage).toBe("nn");
        expect(globalThis.textResources).toEqual({ language: "nn", resources: [{ id: "app.title", value: "Tittel på nynorsk" }] });
        expect((globalThis.defaultTextResources as { resources: unknown[] }).resources).toEqual(getDefaultTextResourcesForLanguage("nn").resources);
    });
    it("uses the nb text resources stored before there were languages", () => {
        applyLanguage("nb");
        expect(globalThis.textResources).toEqual({ language: "nb", resources: [{ id: "app.title", value: "Tittel" }] });
    });
    it("leaves the app's text resources empty for a language with none stored", () => {
        applyLanguage("en");
        expect(globalThis.textResources).toEqual({});
    });
});
