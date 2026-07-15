import { renderComponentUsageListItem } from "./componentUsageRenderers";

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
