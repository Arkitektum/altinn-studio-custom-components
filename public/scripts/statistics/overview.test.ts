import type { OverviewData } from "./overview.ts";

import { getOverviewLines, renderOverviewPage } from "./overview.ts";

function summaries(data: OverviewData) {
    return Object.fromEntries(getOverviewLines(data).map((line) => [line.pageId, line.summary]));
}

const variant = { apps: [{ appOwner: "o", appName: "a" }], rootElement: "root", fieldCount: 1 };

describe("getOverviewLines", () => {
    it("has a line for every page, in the order of the sidebar", () => {
        expect(getOverviewLines({}).map((line) => line.label)).toEqual([
            "Resource usage",
            "Component usage",
            "Data model bindings",
            "Subform data models",
            "Package versions",
            "Display layouts",
            "Render health",
            "Unshown data",
            "Upgrade check"
        ]);
    });

    it("counts the default text resources, the missing ones, and the missing ones with a local value apart", () => {
        const allTextResourceUsage = [{}, {}, {}, { presence: "missing" }, { presence: "missing" }, { presence: "localValue" }];
        expect(summaries({ allTextResourceUsage })["resource-usage"]).toBe("3 text resources, 2 missing, 1 missing with local value");
    });

    it("counts the components in use, and the apps using any of them once each", () => {
        const componentUsage = [
            {
                tagName: "custom-a",
                usages: [
                    { appOwner: "o", appName: "a" },
                    { appOwner: "o", appName: "a" }
                ]
            },
            { tagName: "custom-b", usages: [{ appOwner: "o", appName: "b" }] },
            { tagName: "custom-c", usages: [] }
        ];
        expect(summaries({ componentUsage })["component-usage"]).toBe("2 of 3 components in use, in 2 apps");
    });

    it("counts the checked components with findings", () => {
        const dataModelBindingDrift = [{ usages: [{}] }, { usages: [] }, { usages: [] }];
        expect(summaries({ dataModelBindingDrift })["data-model-bindings"]).toBe("1 of 3 checked components with findings");
    });

    it("counts a subform as differing when its copies form more than one variant or one could not be read", () => {
        const subformDataModelDrift = [
            { dataType: "agree", variants: [variant], differences: [], unreadable: [] },
            { dataType: "differ", variants: [variant, variant], differences: [], unreadable: [] },
            { dataType: "unreadable", variants: [variant], differences: [], unreadable: [{ appOwner: "o", appName: "b", error: "x" }] }
        ];
        expect(summaries({ subformDataModelDrift })["subform-data-models"]).toBe("2 of 3 subforms with copies that differ");
    });

    it("counts an app as behind when any of its packages is, comparing the frontend's CSS and JS with the frontend's release", () => {
        const latestPackageVersions = { altinnStudioCustomComponents: "17.11.2", altinnAppFrontend: "4.37.0", dibkFtpbCommonAltinnApps: "1.7.5" };
        const current = {
            altinnStudioCustomComponents: "17.11.2",
            altinnAppFrontendCSS: "4.37.0",
            altinnAppFrontendJS: "4.37.0",
            dibkFtpbCommonAltinnApps: "1.7.5"
        };
        const packageVersions = [
            { packageVersions: current },
            { packageVersions: { ...current, altinnAppFrontendJS: "4.36.9" } },
            { packageVersions: { ...current, dibkFtpbCommonAltinnApps: undefined } }
        ];
        expect(summaries({ packageVersions, latestPackageVersions })["package-versions"]).toBe("3 apps, 1 behind on a package");
    });

    it("says one rather than ones for a single thing", () => {
        const data = {
            allTextResourceUsage: [{}],
            componentUsage: [{ tagName: "custom-a", usages: [{ appOwner: "o", appName: "a" }] }],
            dataModelBindingDrift: [{ usages: [] }],
            subformDataModelDrift: [{ dataType: "s", variants: [variant], differences: [], unreadable: [] }],
            packageVersions: [{ packageVersions: {} }],
            latestPackageVersions: {}
        };
        expect(summaries(data)).toMatchObject({
            "resource-usage": "1 text resource, 0 missing, 0 missing with local value",
            "component-usage": "1 of 1 component in use, in 1 app",
            "data-model-bindings": "0 of 1 checked component with findings",
            "subform-data-models": "0 of 1 subform with copies that differ",
            "package-versions": "1 app, 0 behind on a package"
        });
    });

    it("counts nothing when no data is there", () => {
        expect(summaries({})["component-usage"]).toBe("0 of 0 components in use, in 0 apps");
    });
});

describe("renderOverviewPage", () => {
    it("links every page to its address, with its summary beside it", () => {
        const container = document.createElement("main");
        renderOverviewPage(container, { allTextResourceUsage: [{}] });
        expect(container.querySelector("h2")!.textContent).toBe("Overview");
        const links = Array.from(container.querySelectorAll("dt a"));
        expect(links).toHaveLength(9);
        expect(links[0]!.getAttribute("href")).toBe("/statistics/resource-usage");
        expect(links[8]!.getAttribute("href")).toBe("/statistics/upgrade-check");
        expect(container.querySelector("dd")!.textContent).toBe("1 text resource, 0 missing, 0 missing with local value");
    });
});
