import {
    filterDataModelBindingDriftBySelectedFilters,
    renderDataModelBindingDriftFilters,
    renderDataModelBindingDriftList,
    renderDataModelBindingDriftListItem,
    renderDataModelBindingDriftUsage
} from "./dataModelBindingRenderers.ts";

import type { DataModelBindingDriftEntry } from "./dataModelBindingRenderers.ts";
import type { DataModelBindingDriftUsage } from "./dataModelBindingHelpers.ts";

function usage(id: string, appName: string, findings: Partial<DataModelBindingDriftUsage> = {}, subformAppName?: string): DataModelBindingDriftUsage {
    return {
        id,
        appOwner: "o",
        appName,
        layoutName: subformAppName || "DisplayLayout",
        ...(subformAppName ? { subformAppName } : {}),
        missing: [],
        deprecated: [],
        unknown: [],
        ...findings
    };
}

const drift: DataModelBindingDriftEntry[] = [
    {
        tagName: "custom-dispensasjon",
        usages: [
            usage("main-a", "a", { missing: ["plannavn"], unknown: ["typo"] }),
            usage("sub-a", "a", { deprecated: [{ key: "dispensasjonFra", hint: "Replaced by bestemmelsestype" }] }, "sub-v1"),
            usage("main-b", "b", { missing: ["metadata", "versjon"] })
        ]
    },
    { tagName: "custom-gjennomfoeringsplan", usages: [] }
];

const applications = [
    { appOwner: "o", appName: "a", displayLayouts: [], subForms: [{ appName: "sub-v1" }] },
    { appOwner: "o", appName: "b", displayLayouts: [] }
];

function setFilters(appOwner = "", appName = "", form = "", finding = "") {
    globalThis.bindingDriftSelectedAppOwner = appOwner;
    globalThis.bindingDriftSelectedAppName = appName;
    globalThis.bindingDriftSelectedForm = form;
    globalThis.bindingDriftFindingFilter = finding;
}

function usageIds(entries: DataModelBindingDriftEntry[], tagName = "custom-dispensasjon") {
    return entries.find((entry) => entry.tagName === tagName)!.usages.map((entry) => entry.id);
}

function choose(select: HTMLSelectElement, value: string) {
    select.value = value;
    select.dispatchEvent(new Event("change"));
}

describe("filterDataModelBindingDriftBySelectedFilters", () => {
    beforeEach(() => setFilters());

    it("keeps everything when nothing is chosen", () => {
        expect(filterDataModelBindingDriftBySelectedFilters(drift)).toEqual(drift);
    });

    it("keeps only the chosen app's uses, and every component", () => {
        setFilters("o", "b");
        const result = filterDataModelBindingDriftBySelectedFilters(drift);
        expect(usageIds(result)).toEqual(["main-b"]);
        expect(result.map((entry) => entry.tagName)).toEqual(["custom-dispensasjon", "custom-gjennomfoeringsplan"]);
    });

    it("keeps the main form's uses or one subform's, as chosen", () => {
        setFilters("o", "a", ":main");
        expect(usageIds(filterDataModelBindingDriftBySelectedFilters(drift))).toEqual(["main-a"]);
        setFilters("o", "a", "sub-v1");
        expect(usageIds(filterDataModelBindingDriftBySelectedFilters(drift))).toEqual(["sub-a"]);
    });

    it("keeps only the chosen kind of finding, and drops the uses left with none", () => {
        setFilters("", "", "", "missing");
        const result = filterDataModelBindingDriftBySelectedFilters(drift);
        expect(usageIds(result)).toEqual(["main-a", "main-b"]);
        expect(result[0]!.usages[0]).toEqual(usage("main-a", "a", { missing: ["plannavn"] }));
    });

    it("answers an empty list when there is no drift yet", () => {
        expect(filterDataModelBindingDriftBySelectedFilters(undefined)).toEqual([]);
    });
});

describe("renderDataModelBindingDriftUsage", () => {
    it("names the use, then lists each kind of finding it has, with the hint after a deprecated key", () => {
        const element = renderDataModelBindingDriftUsage(
            usage("plan", "a", { missing: ["a", "b"], deprecated: [{ key: "old", hint: "Renamed to a" }] })
        );
        expect(element.querySelector(".binding-drift-usage-id")!.textContent).toBe("plan");
        expect(Array.from(element.querySelectorAll("dt")).map((node) => node.textContent)).toEqual(["Missing", "Deprecated"]);
        expect(Array.from(element.querySelectorAll("dd")).map((node) => node.textContent)).toEqual(["a, b", "old (Renamed to a)"]);
    });

    it("shows a key as text, never as markup", () => {
        const element = renderDataModelBindingDriftUsage(usage("<b>id</b>", "a", { unknown: ["<i>key</i>"] }));
        expect(element.querySelector("b")).toBeNull();
        expect(element.querySelector("i")).toBeNull();
        expect(element.querySelector("dd")!.textContent).toBe("<i>key</i>");
    });
});

describe("renderDataModelBindingDriftListItem", () => {
    it("counts the uses with each kind of finding, and the apps and uses with any", () => {
        const element = renderDataModelBindingDriftListItem(drift[0]!);
        expect(Array.from(element.querySelectorAll(".indicator")).map((node) => node.textContent)).toEqual([
            "Missing: 2",
            "Deprecated: 1",
            "Unknown: 1"
        ]);
        expect(Array.from(element.querySelectorAll(".indicator-missing")).map((node) => node.textContent)).toEqual(["Missing: 2"]);
        expect(Array.from(element.querySelectorAll(".indicator-deprecated")).map((node) => node.textContent)).toEqual([
            "Deprecated: 1",
            "Unknown: 1"
        ]);
        expect(element.querySelector(".app-usage")!.textContent).toBe("Apps: 2");
        expect(element.querySelector(".component-usage")!.textContent).toBe("Components: 3");
    });

    it("groups the uses by app, then by form, naming a subform as one", () => {
        const element = renderDataModelBindingDriftListItem(drift[0]!);
        expect(Array.from(element.querySelectorAll(".app-usage-summary-title")).map((node) => node.textContent)).toEqual(["o/a", "o/b"]);
        const appA = element.querySelector(".app-usage-details-list > details")!;
        expect(Array.from(appA.querySelectorAll(".layout-usage-summary-title")).map((node) => node.textContent)).toEqual([
            "DisplayLayout",
            "sub-v1 (subform)"
        ]);
        expect(appA.querySelector(".app-usage-summary-count")!.textContent).toBe("Components: 2");
    });

    it("says so when no layout binds other keys than the component reads", () => {
        const element = renderDataModelBindingDriftListItem(drift[1]!);
        expect(element.querySelector(".indicator")).toBeNull();
        expect(element.querySelector(".message")!.textContent).toBe("No layout binds other keys than this component reads.");
    });
});

describe("renderDataModelBindingDriftFilters", () => {
    let page: HTMLElement;

    function renderPage() {
        page = document.createElement("div");
        page.append(...renderDataModelBindingDriftFilters(page, drift, applications));
        page.appendChild(renderDataModelBindingDriftList(filterDataModelBindingDriftBySelectedFilters(drift)));
    }

    const select = (id: string) => page.querySelector(`#binding-drift-${id}-filter-select`) as HTMLSelectElement;
    const listedUsageIds = () => Array.from(page.querySelectorAll("#binding-drift-list .binding-drift-usage-id")).map((node) => node.textContent);

    beforeEach(() => setFilters());

    it("lists only the chosen app's uses, and offers that app's forms", () => {
        renderPage();
        choose(select("application"), "o/b");
        expect(listedUsageIds()).toEqual(["main-b"]);
        expect(Array.from(select("form").options).map((option) => option.value)).toEqual(["", ":main"]);
        expect(page.querySelectorAll("#binding-drift-list").length).toBe(1);
    });

    it("lists only the chosen form's and kind of finding's uses", () => {
        renderPage();
        choose(select("form"), ":main");
        expect(listedUsageIds()).toEqual(["main-a", "main-b"]);
        choose(select("finding"), "unknown");
        expect(listedUsageIds()).toEqual(["main-a"]);
    });

    it("starts on the choices made before, and falls back from an app that has gone", () => {
        setFilters("o", "a", "sub-v1", "deprecated");
        renderPage();
        expect([select("application").value, select("form").value, select("finding").value]).toEqual(["o/a", "sub-v1", "deprecated"]);
        expect(listedUsageIds()).toEqual(["sub-a"]);

        setFilters("o", "gone", "", "");
        renderPage();
        expect(select("application").value).toBe("");
        expect(globalThis.bindingDriftSelectedAppName).toBe("");
    });
});
