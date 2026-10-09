import {
    filterTextResourcesBySelectedFilters,
    renderDefaultTextResourceListItem,
    renderDefaultTextResourcesList,
    renderSelectApplicationFilterForTextResourcesList,
    renderSelectFormFilterForTextResourcesList,
    renderTextInputFilterForTextResourcesList,
    renderUsageFilterForTextResourcesList
} from "./textResourceUsageRenderers.ts";

import type { ApiValue } from "./types.ts";

describe("renderDefaultTextResourceListItem", () => {
    it("renders a resource with usage and values", () => {
        const textResource = {
            usage: [
                {
                    appOwner: "owner",
                    appName: "app",
                    layouts: [
                        {
                            layoutName: "DisplayLayout",
                            componentsUsingResource: [
                                { id: "comp1", tagName: "Input" },
                                { id: "comp2", tagName: "Label" }
                            ]
                        }
                    ]
                }
            ],
            resource: {
                id: "greeting",
                values: { nb: "Hei", en: "Hello" }
            },
            presence: ""
        };
        const allTextResources = [textResource];
        const el = renderDefaultTextResourceListItem(textResource, allTextResources);
        expect(el).toBeInstanceOf(HTMLElement);
        expect(el.querySelector(".resource-id")!.textContent!).toContain("greeting");
        expect(el.querySelector(".resource-values-list")).not.toBeNull();
        expect(el.querySelector(".app-usage")!.textContent!).toContain("Apps: 1");
        expect(el.querySelector(".component-usage")!.textContent!).toContain("Components: 2");
    });

    it("renders unused indicator if no usage", () => {
        const textResource = {
            usage: [],
            resource: { id: "unused", values: { nb: "Ubrukt" } },
            presence: ""
        };
        const allTextResources = [textResource];
        const el = renderDefaultTextResourceListItem(textResource, allTextResources);
        expect(el.querySelector(".indicator-unused")).not.toBeNull();
        expect(el.textContent).toContain("Unused");
    });

    it("renders presence indicator if present", () => {
        const textResource = {
            usage: [],
            resource: { id: "missing", values: { nb: "Mangler" } },
            presence: "missing"
        };
        const allTextResources = [textResource];
        const el = renderDefaultTextResourceListItem(textResource, allTextResources);
        expect(el.querySelector(".indicator-missing")).not.toBeNull();
        expect(el.textContent).toContain("Missing");
    });
});

describe("renderDefaultTextResourcesList", () => {
    it("renders a list of resources", () => {
        const resources = [
            {
                usage: [],
                resource: { id: "id1", values: { nb: "Hei" } },
                presence: ""
            },
            {
                usage: [],
                resource: { id: "id2", values: { nb: "Ha det" } },
                presence: ""
            }
        ];
        const el = renderDefaultTextResourcesList(resources, resources);
        expect(el).toBeInstanceOf(HTMLElement);
        expect(el.querySelectorAll(".default-text-resource-list-item").length).toBe(2);
    });
});

describe("renderUsageFilterForTextResourcesList", () => {
    it("renders a filter form", () => {
        const el = renderUsageFilterForTextResourcesList(document.createElement("div"), []);
        expect(el).toBeInstanceOf(HTMLElement);
        expect(el.querySelector("select")).not.toBeNull();
        expect(el.querySelector('option[value="all"]')).not.toBeNull();
    });
});

describe("renderSelectApplicationFilterForTextResourcesList", () => {
    it("renders application select", () => {
        const applications = [
            { appOwner: "owner1", appName: "app1" },
            { appOwner: "owner2", appName: "app2" }
        ];
        const el = renderSelectApplicationFilterForTextResourcesList(document.createElement("div"), [], applications);
        expect(el).toBeInstanceOf(HTMLElement);
        expect(el.querySelector("select")).not.toBeNull();
        expect(el.querySelectorAll("option").length).toBe(3); // includes default
    });
});

describe("renderSelectFormFilterForTextResourcesList", () => {
    const applications = [
        { appOwner: "o", appName: "a", subForms: [{ appName: "sub-v1" }, { appName: "other-v1" }] },
        { appOwner: "o", appName: "b", subForms: [{ appName: "sub-v1" }] },
        { appOwner: "o", appName: "c" }
    ];
    const usage = (appName: string, subformAppName?: string) => ({
        appOwner: "o",
        appName,
        layouts: [{ layoutName: subformAppName || "DisplayLayout", ...(subformAppName ? { subformAppName } : {}), componentsUsingResource: [] }]
    });
    const textResources = [
        { resource: { id: "main-a" }, usage: [usage("a")] },
        { resource: { id: "sub-a" }, usage: [usage("a", "sub-v1")] },
        { resource: { id: "sub-b" }, usage: [usage("b", "sub-v1")] }
    ];

    function renderFilters() {
        globalThis.textFilter = "";
        globalThis.matchBy = "id";
        globalThis.selectedFilter = "default";
        globalThis.selectedAppOwner = "";
        globalThis.selectedAppName = "";
        globalThis.selectedForm = "";
        const container = document.createElement("div");
        const applicationFilter = renderSelectApplicationFilterForTextResourcesList(container, textResources, applications);
        const formFilter = renderSelectFormFilterForTextResourcesList(container, textResources, applications);
        container.appendChild(applicationFilter);
        container.appendChild(formFilter);
        return { container, applicationSelect: applicationFilter.querySelector("select")!, formSelect: formFilter.querySelector("select")! };
    }

    function choose(select: HTMLSelectElement, value: string) {
        select.value = value;
        select.dispatchEvent(new Event("change"));
    }

    function renderedIds(container: HTMLElement) {
        return Array.from(container.querySelectorAll("#default-text-resources-list .resource-id")).map((node) => node.textContent);
    }

    it("filters to the resources used in the main form", () => {
        const { container, formSelect } = renderFilters();
        expect(Array.from(formSelect.options).map((option) => option.value)).toEqual(["", ":main", "other-v1", "sub-v1"]);
        choose(formSelect, ":main");
        expect(renderedIds(container)).toEqual(["main-a"]);
    });

    it("narrows the forms on offer to the selected app's, and filters on both", () => {
        const { container, applicationSelect, formSelect } = renderFilters();
        choose(formSelect, "sub-v1");
        expect(renderedIds(container)).toEqual(["sub-a", "sub-b"]);
        choose(applicationSelect, "o/b");
        expect(Array.from(formSelect.options).map((option) => option.value)).toEqual(["", ":main", "sub-v1"]);
        expect(renderedIds(container)).toEqual(["sub-b"]);
    });

    it("falls back to every form when the selected app does not carry the chosen subform", () => {
        const { applicationSelect, formSelect } = renderFilters();
        choose(formSelect, "other-v1");
        choose(applicationSelect, "o/b");
        expect(formSelect.value).toBe("");
        expect(globalThis.selectedForm).toBe("");
    });
});

describe("renderTextInputFilterForTextResourcesList", () => {
    it("renders text input and select", () => {
        const el = renderTextInputFilterForTextResourcesList(document.createElement("div"), []);
        expect(el).toBeInstanceOf(HTMLElement);
        expect(el.querySelector('input[type="text"]')).not.toBeNull();
        expect(el.querySelector("select")).not.toBeNull();
    });
});

describe("starting from the filter choices made before", () => {
    const applications = [
        { appOwner: "o", appName: "a", subForms: [{ appName: "sub-v1" }] },
        { appOwner: "o", appName: "b" }
    ];
    const usage = (appName: string, subformAppName?: string) => ({
        appOwner: "o",
        appName,
        layouts: [{ layoutName: subformAppName || "DisplayLayout", ...(subformAppName ? { subformAppName } : {}), componentsUsingResource: [] }]
    });
    const textResources = [
        { resource: { id: "greeting.main", values: { nb: "Hei" } }, usage: [usage("a")] },
        { resource: { id: "greeting.sub", values: { nb: "Hallo" } }, usage: [usage("a", "sub-v1")] },
        { resource: { id: "other.b", values: { nb: "Annet" } }, usage: [usage("b")] },
        { resource: { id: "unused.one", values: { nb: "Ubrukt" } }, usage: [] }
    ];

    function store(choices: Record<string, string>) {
        Object.assign(
            globalThis,
            { textFilter: "", matchBy: "id", selectedFilter: "all", selectedAppOwner: "", selectedAppName: "", selectedForm: "" },
            choices
        );
    }

    it("starts every control on the stored choice", () => {
        store({
            selectedFilter: "unused",
            selectedAppOwner: "o",
            selectedAppName: "a",
            selectedForm: "sub-v1",
            textFilter: "greet",
            matchBy: "value"
        });
        const container = document.createElement("div");

        const usageSelect = renderUsageFilterForTextResourcesList(container, textResources).querySelector("select")!;
        const appSelect = renderSelectApplicationFilterForTextResourcesList(container, textResources, applications).querySelector("select")!;
        const formSelect = renderSelectFormFilterForTextResourcesList(container, textResources, applications).querySelector("select")!;
        const textControls = renderTextInputFilterForTextResourcesList(container, textResources);

        expect(usageSelect.value).toBe("unused");
        expect(appSelect.value).toBe("o/a");
        expect(formSelect.value).toBe("sub-v1");
        expect(textControls.querySelector("input")!.value).toBe("greet");
        expect(textControls.querySelector("select")!.value).toBe("value");
    });

    it("falls back, and stores the fallback, when an app or form chosen before is no longer offered", () => {
        store({ selectedAppOwner: "o", selectedAppName: "gone", selectedForm: "sub-v1" });
        const container = document.createElement("div");

        const appSelect = renderSelectApplicationFilterForTextResourcesList(container, textResources, applications).querySelector("select")!;
        expect(appSelect.value).toBe("");
        expect(globalThis.selectedAppName).toBe("");

        store({ selectedAppOwner: "o", selectedAppName: "b", selectedForm: "sub-v1" });
        const formSelect = renderSelectFormFilterForTextResourcesList(container, textResources, applications).querySelector("select")!;
        expect(formSelect.value).toBe("");
        expect(globalThis.selectedForm).toBe("");
    });

    it("filters by every stored choice", () => {
        store({ selectedAppOwner: "o", selectedAppName: "a", selectedForm: "sub-v1" });
        expect(filterTextResourcesBySelectedFilters(textResources).map((entry: ApiValue) => entry.resource.id)).toEqual(["greeting.sub"]);

        store({ textFilter: "Hei", matchBy: "value" });
        expect(filterTextResourcesBySelectedFilters(textResources).map((entry: ApiValue) => entry.resource.id)).toEqual(["greeting.main"]);

        store({ selectedFilter: "unused" });
        expect(filterTextResourcesBySelectedFilters(textResources).map((entry: ApiValue) => entry.resource.id)).toEqual(["unused.one"]);
    });
});
