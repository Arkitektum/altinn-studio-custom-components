import {
    PREVIEW_DELAY_MS,
    getCodeInputElementForDataModel,
    getCodeInputElementForLayoutCode,
    getCodeInputElementForTextResources,
    getDataModelListElements,
    getDataModelSummaryText
} from "./getters.ts";

/** An editor as the tests use it: its text through `value`, as with the textarea it replaced. */
type CodeInput = HTMLElement & { value: string };

describe("getDataModelSummaryText", () => {
    it("returns [main] for first index", () => {
        expect(getDataModelSummaryText({ dataType: "Person" }, 0)).toBe("[main] Person");
    });
    it("returns dataType for other indexes", () => {
        expect(getDataModelSummaryText({ dataType: "Person" }, 1)).toBe("Person");
    });
    it("returns fallback for missing dataType", () => {
        expect(getDataModelSummaryText({}, 2)).toBe("Data model 3");
    });
    it("names the main data model by its position when it has no type", () => {
        expect(getDataModelSummaryText({ dataType: "" }, 0)).toBe("[main] Data model 1");
        expect(getDataModelSummaryText({}, 0)).toBe("[main] Data model 1");
    });
});

describe("code inputs given invalid JSON", () => {
    const cases: [name: string, storageKey: string, stored: string, getInput: () => CodeInput][] = [
        ["layout code", "code", '{"tagName":"custom-field"}', getCodeInputElementForLayoutCode],
        ["text resources", "textResources", '{"resources":[]}', getCodeInputElementForTextResources],
        ["data model", "dataModels", '[{"dataType":"main","data":{"a":1}}]', () => getCodeInputElementForDataModel(0)]
    ];
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = `<section id="data-input"></section>`;
    });
    it.each(cases)("%s: keeps what was typed, saves nothing and shows the error", (_name, storageKey, stored, getInput) => {
        localStorage.setItem(storageKey, stored);
        const input = getInput();
        document.getElementById("data-input")!.appendChild(input);
        input.value = '{"broken":';
        input.onchange!(new Event("change"));
        expect(input.value).toBe('{"broken":');
        expect(localStorage.getItem(storageKey)).toBe(stored);
        expect(document.querySelector(".code-input-error")).not.toBeNull();
    });
});

describe("getCodeInputElementForLayoutCode given valid JSON", () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = `<section id="data-input"></section><div id="code-results"></div><div id="text-resource-status-indicators"></div>`;
        globalThis.textResources = { resources: [] };
        globalThis.defaultTextResources = { resources: [] };
    });
    afterEach(() => {
        delete (globalThis as { textResources?: unknown }).textResources;
        delete (globalThis as { defaultTextResources?: unknown }).defaultTextResources;
    });
    it("saves the beautified JSON, without a leading or trailing comma, and clears an earlier error", () => {
        const input = getCodeInputElementForLayoutCode();
        document.getElementById("data-input")!.appendChild(input);
        input.value = "{";
        input.onchange!(new Event("change"));
        input.value = '[{"tagName":"custom-divider"}],';
        input.onchange!(new Event("change"));
        const expected = JSON.stringify([{ tagName: "custom-divider" }], null, 2);
        expect(input.value).toBe(expected);
        expect(localStorage.getItem("code")).toBe(expected);
        expect(document.querySelector(".code-input-error")).toBeNull();
    });
});

describe("getCodeInputElementForLayoutCode", () => {
    it("marks the input as the layout code editor, which the layout check looks for", () => {
        expect(getCodeInputElementForLayoutCode().dataset.editor).toBe("layout");
    });
    it("leaves the other editors unmarked", () => {
        localStorage.setItem("dataModels", JSON.stringify([{ dataType: "main", data: {} }]));
        expect(getCodeInputElementForTextResources().dataset.editor).toBeUndefined();
        expect(getCodeInputElementForDataModel(0).dataset.editor).toBeUndefined();
    });
});

describe("editors while typing", () => {
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const pause = () => wait(PREVIEW_DELAY_MS + 50);

    function type(input: CodeInput, value: string) {
        input.value = value;
        input.dispatchEvent(new Event("input"));
    }

    function mount(input: CodeInput) {
        document.getElementById("data-input")!.appendChild(input);
        return input;
    }

    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = `<section id="data-input"></section><div id="code-results"></div><div id="text-resource-status-indicators"></div>`;
        globalThis.textResources = { resources: [] };
        globalThis.defaultTextResources = { resources: [] };
    });
    afterEach(() => {
        delete (globalThis as { textResources?: unknown }).textResources;
        delete (globalThis as { defaultTextResources?: unknown }).defaultTextResources;
    });

    it("draws the layout code once typing pauses, leaving the text as typed", async () => {
        const input = mount(getCodeInputElementForLayoutCode());
        type(input, '[{"tagName":"custom-divider"}]');
        expect(localStorage.getItem("code")).toBeNull();
        await pause();
        expect(localStorage.getItem("code")).toBe(JSON.stringify([{ tagName: "custom-divider" }], null, 2));
        expect(document.querySelector("#code-results custom-divider")).not.toBeNull();
        expect(input.value).toBe('[{"tagName":"custom-divider"}]');
    });

    it("waits for typing to pause, rather than saving after each key", async () => {
        const input = mount(getCodeInputElementForLayoutCode());
        type(input, '[{"tagName":"custom-divider"}]');
        await wait(200);
        type(input, '[{"tagName":"custom-header-text"}]');
        await wait(200);
        expect(localStorage.getItem("code")).toBeNull();
        await wait(200);
        expect(JSON.parse(localStorage.getItem("code")!)).toEqual([{ tagName: "custom-header-text" }]);
    });

    it("leaves invalid JSON alone without a word while typing, and clears an earlier error once it is valid", async () => {
        localStorage.setItem("code", "[]");
        const input = mount(getCodeInputElementForLayoutCode());
        type(input, '[{"tagName":');
        await pause();
        expect(localStorage.getItem("code")).toBe("[]");
        expect(document.querySelector(".code-input-error")).toBeNull();

        input.onchange!(new Event("change"));
        expect(document.querySelector(".code-input-error")).not.toBeNull();
        type(input, '[{"tagName":"custom-divider"}]');
        await pause();
        expect(document.querySelector(".code-input-error")).toBeNull();
    });

    it("drops a save still waiting when the editor is left, since leaving saves at once", async () => {
        const input = mount(getCodeInputElementForLayoutCode());
        type(input, '[{"tagName":"custom-divider"}]');
        input.dispatchEvent(new Event("change"));
        const saved = localStorage.getItem("code");
        expect(JSON.parse(saved!)).toEqual([{ tagName: "custom-divider" }]);
        input.value = '[{"tagName":"custom-header-text"}]';
        await pause();
        expect(localStorage.getItem("code")).toBe(saved);
    });

    it("drops a save still waiting for an editor no longer on the page", async () => {
        const input = mount(getCodeInputElementForLayoutCode());
        type(input, '[{"tagName":"custom-divider"}]');
        input.remove();
        await pause();
        expect(localStorage.getItem("code")).toBeNull();
    });

    it("saves text resources cleaned up while typing, even one with no value yet, leaving the text as typed", async () => {
        const input = mount(getCodeInputElementForTextResources());
        const typed = '{"resources":[{"id":" a ","value":" A "},{"id":"b"}]}';
        type(input, typed);
        await pause();
        expect(JSON.parse(localStorage.getItem("textResources")!)).toEqual({ resources: [{ id: "a", value: "A" }, { id: "b" }] });
        expect(input.value).toBe(typed);
    });

    it("saves a data model while typing", async () => {
        localStorage.setItem("dataModels", JSON.stringify([{ dataType: "main", data: { a: 1 } }]));
        const input = mount(getCodeInputElementForDataModel(0));
        type(input, '{"a":2}');
        await pause();
        expect(JSON.parse(localStorage.getItem("dataModels")!)).toEqual([{ dataType: "main", data: { a: 2 } }]);
    });
});

describe("getDataModelListElements", () => {
    beforeEach(() => localStorage.clear());

    it("gives each data model's button its whole name as a tooltip, for when the sidebar cuts it short", () => {
        localStorage.setItem(
            "dataModels",
            JSON.stringify([{ dataType: "main", data: {} }, { dataType: "GjennomfoeringsplanUnderskjemaDataV7", data: {} }, { data: {} }])
        );
        const buttons = Array.from(getDataModelListElements().querySelectorAll(".buttons-container > button"));
        expect(buttons.map((button) => button.getAttribute("title"))).toEqual([
            "[main] main",
            "GjennomfoeringsplanUnderskjemaDataV7",
            "Data model 3"
        ]);
    });
});
