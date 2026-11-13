import { applyLanguage } from "./language.ts";
import { renderSidebar } from "./renderers.ts";

// Unmocked on purpose: the picker reaches the stored text resources, globalThis and the open editor through the real modules.
describe("language picker in devTools", () => {
    function choose(language: string) {
        const select = document.getElementById("devtools-language") as HTMLSelectElement;
        select.value = language;
        select.onchange!(new Event("change"));
    }
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem("code", "[]");
        localStorage.setItem("textResources", JSON.stringify({ language: "nb", resources: [{ id: "app.title", value: "Tittel" }] }));
        localStorage.setItem("textResources.nn", JSON.stringify({ language: "nn", resources: [{ id: "app.title", value: "Tittel på nynorsk" }] }));
        document.body.innerHTML = `<aside id="sidebar"></aside><section id="data-input"></section><div id="code-results"></div>`;
        applyLanguage("nb");
        renderSidebar();
    });
    afterEach(() => {
        delete (globalThis as { textResources?: unknown }).textResources;
        delete (globalThis as { defaultTextResources?: unknown }).defaultTextResources;
        delete (globalThis as { selectedLanguage?: unknown }).selectedLanguage;
    });
    it("offers the three languages with the chosen one selected", () => {
        localStorage.setItem("devToolsLanguage", "en");
        renderSidebar();
        const select = document.getElementById("devtools-language") as HTMLSelectElement;
        expect([...select.options].map((option) => option.value)).toEqual(["nb", "nn", "en"]);
        expect(select.value).toBe("en");
        expect(document.querySelector('label[for="devtools-language"]')!.textContent).toBe("Language");
    });
    it("stores the chosen language and puts its text resources on globalThis", () => {
        choose("nn");
        expect(localStorage.getItem("devToolsLanguage")).toBe("nn");
        expect(globalThis.selectedLanguage).toBe("nn");
        expect(globalThis.textResources).toEqual({ language: "nn", resources: [{ id: "app.title", value: "Tittel på nynorsk" }] });
        expect((document.getElementById("devtools-language") as HTMLSelectElement).value).toBe("nn");
    });
    it("fills an open text resources editor with the chosen language's text resources, and keeps it open", () => {
        (document.querySelector("#text-resources-code .buttons-container > button") as HTMLButtonElement).click();
        choose("nn");
        expect(JSON.parse((document.getElementById("code-input") as HTMLTextAreaElement).value).language).toBe("nn");
        expect(document.getElementById("text-resources-code")!.classList.contains("active")).toBe(true);
    });
    it("saves what is typed in the text resources editor under the chosen language", () => {
        choose("en");
        (document.querySelector("#text-resources-code .buttons-container > button") as HTMLButtonElement).click();
        const input = document.getElementById("code-input") as HTMLTextAreaElement;
        input.value = JSON.stringify({ language: "en", resources: [{ id: "app.title", value: "Title" }] });
        input.onchange!(new Event("change"));
        expect(JSON.parse(localStorage.getItem("textResources.en")!).resources).toEqual([{ id: "app.title", value: "Title" }]);
        expect(JSON.parse(localStorage.getItem("textResources")!).resources).toEqual([{ id: "app.title", value: "Tittel" }]);
    });
    it("leaves another open editor open", () => {
        (document.querySelector("#layout-code .buttons-container > button") as HTMLButtonElement).click();
        choose("nn");
        expect(document.getElementById("layout-code")!.classList.contains("active")).toBe(true);
        expect((document.getElementById("code-input") as HTMLTextAreaElement).dataset.editor).toBe("layout");
    });
    it("orders, and removes from, the chosen language's text resources in the validation dialog", () => {
        document.body.insertAdjacentHTML(
            "beforeend",
            `<dialog id="validation-dialog"><button class="close-dialog-button"></button><section class="dialog-content"></section></dialog>`
        );
        const dialog = document.getElementById("validation-dialog") as HTMLDialogElement;
        dialog.showModal = () => {};
        dialog.close = () => {};
        localStorage.setItem(
            "textResources.nn",
            JSON.stringify({
                language: "nn",
                resources: [
                    { id: "b", value: "B" },
                    { id: "a", value: "A" },
                    { id: "a", value: "A igjen" }
                ]
            })
        );
        choose("nn");
        (document.querySelector(".validate-text-resources-button") as HTMLButtonElement).click();
        (document.querySelector(".order-resources-alphabetically-button") as HTMLButtonElement).click();
        expect(JSON.parse(localStorage.getItem("textResources.nn")!).resources.map(({ id }: { id: string }) => id)).toEqual(["a", "a", "b"]);
        (document.querySelector(".validate-text-resources-button") as HTMLButtonElement).click();
        (document.querySelector(".remove-duplicate-resources-button") as HTMLButtonElement).click();
        expect(JSON.parse(localStorage.getItem("textResources.nn")!).resources.map(({ id }: { id: string }) => id)).toEqual(["a", "b"]);
        (document.querySelector(".validate-text-resources-button") as HTMLButtonElement).click();
        (document.querySelector(".remove-unused-resources-button") as HTMLButtonElement).click();
        expect(JSON.parse(localStorage.getItem("textResources.nn")!).resources).toEqual([]);
        expect(JSON.parse(localStorage.getItem("textResources")!).resources).toEqual([{ id: "app.title", value: "Tittel" }]);
    });
});
