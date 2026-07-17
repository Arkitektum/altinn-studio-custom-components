import {
    renderComponentUsageListItem,
    renderSelectApplicationFilterForComponentUsageList,
    renderSelectComponentTypeFilterForComponentUsageList,
    renderTextInputFilterForComponentUsageList,
    renderUsageFilterForComponentUsageList
} from "./componentUsageRenderers";

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
        expect(element.querySelector(".app-usage").textContent).toContain("Apps: 1");

        // Direct usage: one app node...
        const appTitles = element.querySelectorAll(".app-usage-details-list .app-usage-summary-title");
        expect(appTitles.length).toBe(1);
        expect(appTitles[0].textContent).toBe("o/a");

        // ...with two display layout nodes beneath it.
        const layoutTitles = element.querySelectorAll(".app-usage-details-list .layout-usage-summary-title");
        expect(Array.from(layoutTitles).map((node) => node.textContent)).toEqual(["DisplayLayout", "SvarSkjema"]);

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
        expect(layoutTitles[0].textContent).toBe("DisplayLayout");
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
        globalThis.componentTypeFilter = "";
        globalThis.componentTextFilter = "";
        globalThis.componentMatchBy = "tag";
        return container;
    }

    function renderedTagNames(container) {
        return Array.from(container.querySelectorAll("#component-usage-list .component-tag-name")).map((node) => node.textContent);
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
        select.value = "unused";
        select.dispatchEvent(new Event("change"));

        expect(renderedTagNames(container)).toEqual(["custom-field"]);
    });

    it("component type filter renders options and filters by category", () => {
        const container = setupContainer();
        const filterEl = renderSelectComponentTypeFilterForComponentUsageList(container, components);
        container.appendChild(filterEl);

        expect(Array.from(filterEl.querySelectorAll("option")).map((o) => o.value)).toEqual(["", "base", "data", "layout"]);

        const select = filterEl.querySelector("select");
        select.value = "layout";
        select.dispatchEvent(new Event("change"));

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
        select.value = "owner1/app1";
        select.dispatchEvent(new Event("change"));

        expect(renderedTagNames(container)).toEqual(["custom-header", "custom-dispensasjon"]);
    });

    it("text filter matches by tag by default and by id when selected", () => {
        const container = setupContainer();
        const filterEl = renderTextInputFilterForComponentUsageList(container, components);
        container.appendChild(filterEl);

        const input = filterEl.querySelector("input");
        input.value = "data";
        input.dispatchEvent(new Event("input"));
        expect(renderedTagNames(container)).toEqual(["custom-field-data"]);

        const matchBySelect = filterEl.querySelector("select");
        expect(Array.from(matchBySelect.querySelectorAll("option")).map((o) => o.value)).toEqual(["tag", "id"]);
        matchBySelect.value = "id";
        input.value = "greeting";
        input.dispatchEvent(new Event("input"));
        expect(renderedTagNames(container)).toEqual(["custom-header"]);
    });
});
