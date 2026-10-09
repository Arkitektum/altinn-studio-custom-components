import {
    filterComponentsBySelectedFilters,
    renderComponentUsageListItem,
    renderSelectApplicationFilterForComponentUsageList,
    renderSelectComponentTypeFilterForComponentUsageList,
    renderSelectFormFilterForComponentUsageList,
    renderTextInputFilterForComponentUsageList,
    renderUsageFilterForComponentUsageList
} from "./componentUsageRenderers.ts";

import type { ApiValue } from "../types.ts";

describe("renderComponentUsageListItem", () => {
    it("groups direct usages by app and by display layout", () => {
        const component = {
            tagName: "custom-field-data",
            usages: [
                { tagName: "custom-field-data", id: "c1", appOwner: "o", appName: "a", layoutName: "DisplayLayout" },
                { tagName: "custom-field-data", id: "c2", appOwner: "o", appName: "a", layoutName: "SvarSkjema" },
                { tagName: "custom-field-data", id: "c3", appOwner: "o", appName: "a", layoutName: "SvarSkjema" }
            ]
        };
        const element = renderComponentUsageListItem(component);

        // Apps count is based on unique apps.
        expect(element.querySelector(".app-usage")!.textContent!).toContain("Apps: 1");

        // Direct usage: one app node...
        const appTitles = element.querySelectorAll(".app-usage-details-list .app-usage-summary-title");
        expect(appTitles.length).toBe(1);
        expect(appTitles[0]!.textContent!).toBe("o/a");

        // ...with two display layout nodes beneath it.
        const layoutTitles = element.querySelectorAll(".app-usage-details-list .layout-usage-summary-title");
        expect(Array.from(layoutTitles).map((node: ApiValue) => node.textContent)).toEqual(["DisplayLayout", "SvarSkjema"]);

        // Component list items sum to the three direct usages.
        expect(element.querySelectorAll(".app-using-component-list-item").length).toBe(3);
    });

    it("groups indirect usages by app and by display layout", () => {
        const component = {
            tagName: "custom-field-data",
            usages: [
                {
                    tagName: "custom-field-data",
                    appOwner: "o",
                    appName: "a",
                    layoutName: "DisplayLayout",
                    parent: { tagName: "custom-group", id: "g1" }
                }
            ]
        };
        const element = renderComponentUsageListItem(component);

        const layoutTitles = element.querySelectorAll(".component-usage-details-list .layout-usage-summary-title");
        expect(layoutTitles.length).toBe(1);
        expect(layoutTitles[0]!.textContent!).toBe("DisplayLayout");
        expect(element.querySelectorAll(".component-using-component-list-item").length).toBe(1);
    });
});

describe("component usage filters", () => {
    // A container seeded with the initial (unfiltered) list, mirroring how renderComponentUsagePage lays out the page.
    function setupContainer() {
        const container = document.createElement("div");
        const list = document.createElement("div");
        list.id = "component-usage-list";
        container.appendChild(list);
        globalThis.componentUsageFilter = "all";
        globalThis.componentSelectedAppOwner = "";
        globalThis.componentSelectedAppName = "";
        globalThis.componentSelectedForm = "";
        globalThis.componentTypeFilter = "";
        globalThis.componentTextFilter = "";
        globalThis.componentMatchBy = "tag";
        return container;
    }

    function renderedTagNames(container: HTMLElement) {
        return Array.from(container.querySelectorAll("#component-usage-list .component-tag-name")).map((node: ApiValue) => node.textContent);
    }

    const components = [
        { tagName: "custom-field", usages: [] },
        { tagName: "custom-header", usages: [{ id: "greeting", appOwner: "owner1", appName: "app1" }] },
        { tagName: "custom-field-data", usages: [{ id: "answer", appOwner: "owner2", appName: "app2" }] },
        { tagName: "custom-dispensasjon", usages: [{ id: "disp", appOwner: "owner1", appName: "app1" }] }
    ];

    it("usage filter renders options and filters to unused components", () => {
        const container = setupContainer();
        const filterEl = renderUsageFilterForComponentUsageList(container, components);
        container.appendChild(filterEl);

        expect(Array.from(filterEl.querySelectorAll("option")).map((o) => o.value)).toEqual(["all", "unused", "used-once"]);

        const select = filterEl.querySelector("select");
        select!.value = "unused";
        select!.dispatchEvent(new Event("change"));

        expect(renderedTagNames(container)).toEqual(["custom-field"]);
    });

    it("component type filter renders options and filters by category", () => {
        const container = setupContainer();
        const filterEl = renderSelectComponentTypeFilterForComponentUsageList(container, components);
        container.appendChild(filterEl);

        expect(Array.from(filterEl.querySelectorAll("option")).map((o) => o.value)).toEqual(["", "base", "data", "layout"]);

        const select = filterEl.querySelector("select");
        select!.value = "layout";
        select!.dispatchEvent(new Event("change"));

        expect(renderedTagNames(container)).toEqual(["custom-dispensasjon"]);
    });

    it("application filter renders options and filters by owner and name", () => {
        const container = setupContainer();
        const applications = [
            { appOwner: "owner1", appName: "app1" },
            { appOwner: "owner2", appName: "app2" }
        ];
        const filterEl = renderSelectApplicationFilterForComponentUsageList(container, components, applications);
        container.appendChild(filterEl);

        expect(filterEl.querySelectorAll("option").length).toBe(3); // includes "All applications"

        const select = filterEl.querySelector("select");
        select!.value = "owner1/app1";
        select!.dispatchEvent(new Event("change"));

        expect(renderedTagNames(container)).toEqual(["custom-header", "custom-dispensasjon"]);
    });

    describe("form filter", () => {
        const applications = [
            { appOwner: "o", appName: "a", subForms: [{ appName: "sub-v1" }, { appName: "other-v1" }] },
            { appOwner: "o", appName: "b", subForms: [{ appName: "sub-v1" }] },
            { appOwner: "o", appName: "c" }
        ];
        const formComponents = [
            { tagName: "custom-field", usages: [{ appOwner: "o", appName: "a" }] },
            { tagName: "custom-header", usages: [{ appOwner: "o", appName: "a", subformAppName: "sub-v1" }] },
            { tagName: "custom-field-data", usages: [{ appOwner: "o", appName: "b", subformAppName: "sub-v1" }] }
        ];

        function renderFilters() {
            const container = setupContainer();
            const applicationFilter = renderSelectApplicationFilterForComponentUsageList(container, formComponents, applications);
            const formFilter = renderSelectFormFilterForComponentUsageList(container, formComponents, applications);
            container.appendChild(applicationFilter);
            container.appendChild(formFilter);
            return { container, applicationSelect: applicationFilter.querySelector("select")!, formSelect: formFilter.querySelector("select")! };
        }

        function choose(select: HTMLSelectElement, value: string) {
            select.value = value;
            select.dispatchEvent(new Event("change"));
        }

        it("filters to the components used in a subform, in any app", () => {
            const { container, formSelect } = renderFilters();
            expect(Array.from(formSelect.options).map((option) => option.value)).toEqual(["", ":main", "other-v1", "sub-v1"]);
            choose(formSelect, "sub-v1");
            expect(renderedTagNames(container)).toEqual(["custom-header", "custom-field-data"]);
        });

        it("narrows the forms on offer to the selected app's, and keeps a form it still carries", () => {
            const { container, applicationSelect, formSelect } = renderFilters();
            choose(formSelect, "sub-v1");
            choose(applicationSelect, "o/b");
            expect(Array.from(formSelect.options).map((option) => option.value)).toEqual(["", ":main", "sub-v1"]);
            expect(formSelect.value).toBe("sub-v1");
            expect(renderedTagNames(container)).toEqual(["custom-field-data"]);
        });

        it("falls back to every form when the selected app does not carry the chosen subform", () => {
            const { container, applicationSelect, formSelect } = renderFilters();
            choose(formSelect, "other-v1");
            choose(applicationSelect, "o/b");
            expect(formSelect.value).toBe("");
            expect(globalThis.componentSelectedForm).toBe("");
            expect(renderedTagNames(container)).toEqual(["custom-field-data"]);
        });
    });

    it("text filter matches by tag by default and by id when selected", () => {
        const container = setupContainer();
        const filterEl = renderTextInputFilterForComponentUsageList(container, components);
        container.appendChild(filterEl);

        const input = filterEl.querySelector("input");
        input!.value = "data";
        input!.dispatchEvent(new Event("input"));
        expect(renderedTagNames(container)).toEqual(["custom-field-data"]);

        const matchBySelect = filterEl.querySelector("select");
        expect(Array.from(matchBySelect!.querySelectorAll("option")).map((o) => o.value)).toEqual(["tag", "id"]);
        matchBySelect!.value = "id";
        input!.value = "greeting";
        input!.dispatchEvent(new Event("input"));
        expect(renderedTagNames(container)).toEqual(["custom-header"]);
    });
});

describe("component usage filters, starting from the choices made before", () => {
    const applications = [
        { appOwner: "o", appName: "a", subForms: [{ appName: "sub-v1" }] },
        { appOwner: "o", appName: "b" }
    ];
    const components = [
        { tagName: "custom-field", usages: [] },
        { tagName: "custom-header", usages: [{ id: "h1", appOwner: "o", appName: "a" }] },
        { tagName: "custom-field-data", usages: [{ id: "d1", appOwner: "o", appName: "a", subformAppName: "sub-v1" }] },
        { tagName: "custom-dispensasjon", usages: [{ id: "x1", appOwner: "o", appName: "b" }] }
    ];

    function store(choices: Record<string, string>) {
        Object.assign(
            globalThis,
            {
                componentUsageFilter: "all",
                componentSelectedAppOwner: "",
                componentSelectedAppName: "",
                componentSelectedForm: "",
                componentTypeFilter: "",
                componentTextFilter: "",
                componentMatchBy: "tag"
            },
            choices
        );
    }

    it("starts every control on the stored choice", () => {
        store({
            componentUsageFilter: "used-once",
            componentSelectedAppOwner: "o",
            componentSelectedAppName: "a",
            componentSelectedForm: "sub-v1",
            componentTypeFilter: "data",
            componentTextFilter: "d1",
            componentMatchBy: "id"
        });
        const container = document.createElement("div");

        expect(renderUsageFilterForComponentUsageList(container, components).querySelector("select")!.value).toBe("used-once");
        expect(renderSelectApplicationFilterForComponentUsageList(container, components, applications).querySelector("select")!.value).toBe("o/a");
        expect(renderSelectFormFilterForComponentUsageList(container, components, applications).querySelector("select")!.value).toBe("sub-v1");
        expect(renderSelectComponentTypeFilterForComponentUsageList(container, components).querySelector("select")!.value).toBe("data");
        const textControls = renderTextInputFilterForComponentUsageList(container, components);
        expect(textControls.querySelector("input")!.value).toBe("d1");
        expect(textControls.querySelector("select")!.value).toBe("id");
    });

    it("falls back, and stores the fallback, when a choice made before is no longer offered", () => {
        store({ componentSelectedAppOwner: "o", componentSelectedAppName: "gone", componentTypeFilter: "nonsense" });
        const container = document.createElement("div");

        expect(renderSelectApplicationFilterForComponentUsageList(container, components, applications).querySelector("select")!.value).toBe("");
        expect(globalThis.componentSelectedAppName).toBe("");
        expect(renderSelectComponentTypeFilterForComponentUsageList(container, components).querySelector("select")!.value).toBe("");
        expect(globalThis.componentTypeFilter).toBe("");

        store({ componentSelectedAppOwner: "o", componentSelectedAppName: "b", componentSelectedForm: "sub-v1" });
        expect(renderSelectFormFilterForComponentUsageList(container, components, applications).querySelector("select")!.value).toBe("");
        expect(globalThis.componentSelectedForm).toBe("");
    });

    it("filters by every stored choice", () => {
        store({ componentSelectedAppOwner: "o", componentSelectedAppName: "a", componentSelectedForm: "sub-v1" });
        expect(filterComponentsBySelectedFilters(components)!.map((component: ApiValue) => component.tagName)).toEqual(["custom-field-data"]);

        store({ componentUsageFilter: "unused" });
        expect(filterComponentsBySelectedFilters(components)!.map((component: ApiValue) => component.tagName)).toEqual(["custom-field"]);
    });
});
