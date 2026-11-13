import {
    getAppResourceValuesForLanguage,
    getCodeInputElementForDataModel,
    getCodeInputElementForLayoutCode,
    getCodeInputElementForTextResources,
    getDataModelSummaryText,
    getDefaultValueForResource,
    getResourcesForLanguage
} from "./getters.ts";

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

describe("getResourcesForLanguage", () => {
    const resources = [
        { id: "greeting", values: { nb: "Hei", en: "Hello" } },
        { id: "farewell", values: { nb: "Ha det", en: "Goodbye" } },
        { id: "welcome", values: { nb: "Velkommen", en: "Welcome" } }
    ];
    it("returns resources for nb", () => {
        const result = getResourcesForLanguage(resources, "nb");
        expect(result.language).toBe("nb");
        expect(result.resources).toEqual([
            { id: "greeting", value: "Hei" },
            { id: "farewell", value: "Ha det" },
            { id: "welcome", value: "Velkommen" }
        ]);
    });
    it("returns resources for en", () => {
        const result = getResourcesForLanguage(resources, "en");
        expect(result.language).toBe("en");
        expect(result.resources).toEqual([
            { id: "greeting", value: "Hello" },
            { id: "farewell", value: "Goodbye" },
            { id: "welcome", value: "Welcome" }
        ]);
    });
    it("returns empty for unknown language", () => {
        const result = getResourcesForLanguage(resources, "nn");
        expect(result.language).toBe("nn");
        expect(result.resources).toEqual([]);
    });
});

describe("getAppResourceValuesForLanguage", () => {
    const appResourceValues = [
        {
            appName: "App1",
            appOwner: "Owner1",
            resourceValues: [
                { id: "greeting", values: { nb: "Hei", en: "Hello" } },
                { id: "farewell", values: { nb: "Ha det", en: "Goodbye" } }
            ]
        },
        {
            appName: "App2",
            appOwner: "Owner2",
            resourceValues: [{ id: "welcome", values: { nb: "Velkommen", en: "Welcome" } }]
        }
    ];
    it("returns app resource values for nb", () => {
        const result = getAppResourceValuesForLanguage(appResourceValues, "nb");
        expect(result[0].appName).toBe("App1");
        expect(result[0].resources.language).toBe("nb");
        expect(result[0].resources.resources).toEqual([
            { id: "greeting", value: "Hei" },
            { id: "farewell", value: "Ha det" }
        ]);
        expect(result[1].appName).toBe("App2");
        expect(result[1].resources.language).toBe("nb");
        expect(result[1].resources.resources).toEqual([{ id: "welcome", value: "Velkommen" }]);
    });
});

describe("getDefaultValueForResource", () => {
    beforeEach(() => {
        globalThis.defaultTextResources = {
            resources: [
                { id: "greeting", value: "Hei" },
                { id: "farewell", value: "Ha det" }
            ]
        };
    });
    afterEach(() => {
        delete (globalThis as { defaultTextResources?: unknown }).defaultTextResources;
    });
    it("returns value for existing resource", () => {
        expect(getDefaultValueForResource("greeting")).toBe("Hei");
    });
    it("returns null for missing resource", () => {
        expect(getDefaultValueForResource("unknown")).toBeNull();
    });
});

describe("code inputs given invalid JSON", () => {
    const cases: [name: string, storageKey: string, stored: string, getInput: () => HTMLTextAreaElement][] = [
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
