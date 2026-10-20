import {
    describeField,
    filterSubformDataModelDriftBySelectedFilters,
    renderSubformDataModelFilters,
    renderSubformDataModelList,
    renderSubformDataModelListItem,
    variantLabel
} from "./subformDataModelRenderers.ts";

import type { SubformDataModelDrift, XsdField } from "./subformDataModelHelpers.ts";
import type { FilteredSubformDataModelDrift } from "./subformDataModelRenderers.ts";

function field(path: string, overrides: Partial<XsdField> = {}): XsdField {
    return { path, node: "element", type: "string", minOccurs: 1, maxOccurs: 1, ...overrides };
}

const app = (appName: string) => ({ appOwner: "dibk", appName });

const drift: SubformDataModelDrift[] = [
    {
        dataType: "DispensasjonssoeknadDataV1",
        variants: [
            { apps: [app("es-v2"), app("et-v4")], rootElement: "Dispensasjon", fieldCount: 3 },
            { apps: [app("fts-v1")], rootElement: "Dispensasjon", fieldCount: 1 }
        ],
        differences: [
            { path: "gradAvUtnytting", fields: [field("gradAvUtnytting", { type: "decimal", minOccurs: 0 }), null], hiddenBelow: 0 },
            { path: "plan", fields: [field("plan", { type: null }), null], hiddenBelow: 1 }
        ],
        unreadable: [{ appOwner: "dibk", appName: "rs-v4", error: "App/models/DispensasjonssoeknadDataV1.xsd could not be read from Altinn Studio." }]
    },
    {
        dataType: "GjenpartNabovarselDataV3",
        variants: [{ apps: [app("es-v2"), app("su-v2")], rootElement: "Gjenpart", fieldCount: 5 }],
        differences: [],
        unreadable: []
    }
];

function resetFilters() {
    globalThis.subformModelSelectedApp = "";
    globalThis.subformModelPathFilter = "";
    globalThis.subformModelShowAgreeing = false;
}

function filtered(dataType: string): FilteredSubformDataModelDrift {
    return filterSubformDataModelDriftBySelectedFilters(drift).find((entry) => entry.dataType === dataType)!;
}

function texts(element: ParentNode, selector: string) {
    return Array.from(element.querySelectorAll(selector)).map((node) => node.textContent);
}

describe("variantLabel", () => {
    it("letters the variants, and numbers them after Z", () => {
        expect([variantLabel(0), variantLabel(1), variantLabel(25), variantLabel(26)]).toEqual(["A", "B", "Z", "V27"]);
    });
});

describe("describeField", () => {
    it("says what a field holds, then how often it occurs", () => {
        expect(describeField(field("a"))).toBe("string 1..1");
        expect(describeField(field("a", { type: "decimal", minOccurs: 0 }))).toBe("decimal 0..1");
    });

    it("calls an element holding other elements a group, and writes unbounded as n", () => {
        expect(describeField(field("a", { type: null, maxOccurs: "unbounded" }))).toBe("group 1..n");
    });

    it("marks an attribute, and the value the schema fixes", () => {
        expect(describeField(field("a", { node: "attribute", fixed: "47365" }))).toBe('attribute string 1..1 fixed "47365"');
    });
});

describe("filterSubformDataModelDriftBySelectedFilters", () => {
    beforeEach(resetFilters);

    it("keeps every subform, with findings where the copies form more than one variant or one could not be read", () => {
        expect(filterSubformDataModelDriftBySelectedFilters(drift).map((entry) => [entry.dataType, entry.hasFindings])).toEqual([
            ["DispensasjonssoeknadDataV1", true],
            ["GjenpartNabovarselDataV3", false]
        ]);
    });

    it("counts an unreadable copy as a finding even when the readable copies agree", () => {
        const entry = { ...drift[1]!, unreadable: [{ appOwner: "dibk", appName: "ta-v4", error: "Gone" }] };
        expect(filterSubformDataModelDriftBySelectedFilters([entry])[0]!.hasFindings).toBe(true);
    });

    it("keeps the subforms the chosen app declares, unreadable copies included", () => {
        globalThis.subformModelSelectedApp = "dibk/su-v2";
        expect(filterSubformDataModelDriftBySelectedFilters(drift).map((entry) => entry.dataType)).toEqual(["GjenpartNabovarselDataV3"]);
        globalThis.subformModelSelectedApp = "dibk/rs-v4";
        expect(filterSubformDataModelDriftBySelectedFilters(drift).map((entry) => entry.dataType)).toEqual(["DispensasjonssoeknadDataV1"]);
    });

    it("narrows the differing fields to the paths holding the text, whatever its case, and gives findings only where one is left", () => {
        globalThis.subformModelPathFilter = " avutNYTTING ";
        expect(filtered("DispensasjonssoeknadDataV1").differences.map((difference) => difference.path)).toEqual(["gradAvUtnytting"]);
        expect(filtered("DispensasjonssoeknadDataV1").hasFindings).toBe(true);

        globalThis.subformModelPathFilter = "nothing like it";
        expect(filtered("DispensasjonssoeknadDataV1").differences).toEqual([]);
        // The unreadable copy is no answer to a question about a field.
        expect(filtered("DispensasjonssoeknadDataV1").hasFindings).toBe(false);
    });
});

describe("renderSubformDataModelListItem", () => {
    beforeEach(resetFilters);

    it("sums up the subform: the data type, that it differs, how many are unreadable, variants and apps", () => {
        const item = renderSubformDataModelListItem(filtered("DispensasjonssoeknadDataV1"));

        expect(item.querySelector(".component-tag-name")!.firstChild!.textContent).toBe("DispensasjonssoeknadDataV1");
        expect(texts(item, ".indicator")).toEqual(["Differs", "Unreadable: 1"]);
        expect(texts(item, ".usage-container span")).toEqual(["Variants: 2", "Apps: 4"]);
    });

    it("lists the variants under the letters the table's columns use", () => {
        const item = renderSubformDataModelListItem(filtered("DispensasjonssoeknadDataV1"));

        expect(texts(item, ".subform-model-variants dt")).toEqual(["A", "B"]);
        expect(texts(item, ".subform-model-variants dd")).toEqual(["dibk/es-v2, dibk/et-v4 (3 fields)", "dibk/fts-v1 (1 field)"]);
        expect(texts(item, "thead th")).toEqual(["Field", "A", "B"]);
    });

    it("gives every differing field a row, saying how each variant declares it and what is folded into it", () => {
        const item = renderSubformDataModelListItem(filtered("DispensasjonssoeknadDataV1"));
        const rows = Array.from(item.querySelectorAll("tbody tr")).map((row) => texts(row, "td"));

        expect(rows).toEqual([
            ["gradAvUtnytting", "decimal 0..1", "missing"],
            ["plan+ 1 field below", "group 1..1", "missing"]
        ]);
        expect(texts(item, ".subform-model-missing")).toEqual(["missing", "missing"]);
    });

    it("lists the copies that could not be read, with why", () => {
        const item = renderSubformDataModelListItem(filtered("DispensasjonssoeknadDataV1"));

        expect(texts(item, ".subform-model-unreadable dt")).toEqual(["dibk/rs-v4"]);
        expect(texts(item, ".subform-model-unreadable dd")).toEqual([
            "App/models/DispensasjonssoeknadDataV1.xsd could not be read from Altinn Studio."
        ]);
    });

    it("marks the chosen app's variant in the list and in its table column", () => {
        const item = renderSubformDataModelListItem(filtered("DispensasjonssoeknadDataV1"), "dibk/fts-v1");

        expect(texts(item, ".subform-model-variants .selected-variant")).toEqual(["B", "dibk/fts-v1 (1 field)"]);
        expect(texts(item, "th.selected-variant")).toEqual(["B"]);
        expect(texts(item, "td.selected-variant")).toEqual(["missing", "missing"]);
    });

    it("says every copy agrees, and leaves the table out, when there is one variant", () => {
        const item = renderSubformDataModelListItem(filtered("GjenpartNabovarselDataV3"));

        expect(item.querySelector("table")).toBeNull();
        expect(item.querySelector(".indicator")).toBeNull();
        expect(texts(item, ".message")).toEqual(["Every copy that could be read declares the same fields."]);
    });

    it("says no differing field matches when the path filter leaves none", () => {
        globalThis.subformModelPathFilter = "nothing like it";
        const item = renderSubformDataModelListItem(filtered("DispensasjonssoeknadDataV1"));

        expect(item.querySelector("table")).toBeNull();
        expect(texts(item, ".message")).toEqual(["No field that differs matches the path filter."]);
    });

    it("names the root element only when it is what the variants differ in", () => {
        const entry: FilteredSubformDataModelDrift = {
            dataType: "D",
            variants: [
                { apps: [app("es-v2")], rootElement: "Ny", fieldCount: 1 },
                { apps: [app("fts-v1")], rootElement: "Gammel", fieldCount: 1 }
            ],
            differences: [],
            unreadable: [],
            hasFindings: true
        };
        const item = renderSubformDataModelListItem(entry);

        expect(texts(item, ".subform-model-variants dd")).toEqual([
            "dibk/es-v2 (1 field, root element Ny)",
            "dibk/fts-v1 (1 field, root element Gammel)"
        ]);
        expect(texts(item, ".message")).toEqual(["The variants declare the same fields under different root elements."]);
    });
});

describe("renderSubformDataModelList", () => {
    beforeEach(resetFilters);

    it("lists the subforms with findings under a count, and the ones that agree only when asked for", () => {
        const entries = filterSubformDataModelDriftBySelectedFilters(drift);

        const list = renderSubformDataModelList(entries, false);
        expect(texts(list, ".binding-drift-summary")).toEqual(["1 of 2 subforms have copies that differ for the chosen filters."]);
        expect(texts(list, ".component-tag-name").map((text) => text!.split(/Differs|Unreadable/)[0])).toEqual(["DispensasjonssoeknadDataV1"]);

        const withAgreeing = renderSubformDataModelList(entries, true);
        expect(withAgreeing.querySelectorAll(".component-usage-list-item")).toHaveLength(2);
    });
});

describe("renderSubformDataModelFilters", () => {
    let page: HTMLElement;

    beforeEach(() => {
        resetFilters();
        page = document.createElement("div");
        page.append(...renderSubformDataModelFilters(page, drift));
        page.appendChild(renderSubformDataModelList(filterSubformDataModelDriftBySelectedFilters(drift)));
    });

    function listedDataTypes() {
        return Array.from(page.querySelectorAll("#subform-model-list .component-tag-name")).map((node) => node.firstChild!.textContent);
    }

    it("offers the apps that declare a subform, each once", () => {
        const select = page.querySelector("#subform-model-application-filter-select") as HTMLSelectElement;
        expect(Array.from(select.options).map((option) => option.value)).toEqual([
            "",
            "dibk/es-v2",
            "dibk/et-v4",
            "dibk/fts-v1",
            "dibk/rs-v4",
            "dibk/su-v2"
        ]);
    });

    it("draws the list again when the app, the path or the checkbox changes", () => {
        const select = page.querySelector("#subform-model-application-filter-select") as HTMLSelectElement;
        const checkbox = page.querySelector("#subform-model-show-agreeing") as HTMLInputElement;
        const input = page.querySelector("#subform-model-path-filter-input") as HTMLInputElement;

        checkbox.checked = true;
        checkbox.dispatchEvent(new Event("change"));
        expect(listedDataTypes()).toEqual(["DispensasjonssoeknadDataV1", "GjenpartNabovarselDataV3"]);

        select.value = "dibk/su-v2";
        select.dispatchEvent(new Event("change"));
        expect(listedDataTypes()).toEqual(["GjenpartNabovarselDataV3"]);

        select.value = "";
        select.dispatchEvent(new Event("change"));
        input.value = "plan";
        input.dispatchEvent(new Event("input"));
        expect(Array.from(page.querySelectorAll("tbody tr td:first-child .subform-model-path")).map((node) => node.textContent)).toEqual(["plan"]);
        expect(page.querySelectorAll("#subform-model-list")).toHaveLength(1);
    });

    it("starts on the choices stored before, and falls back when the app is no longer offered", () => {
        globalThis.subformModelSelectedApp = "dibk/gone-v1";
        globalThis.subformModelPathFilter = "grad";
        globalThis.subformModelShowAgreeing = true;
        const filters = renderSubformDataModelFilters(document.createElement("div"), drift);
        const holder = document.createElement("div");
        holder.append(...filters);

        expect((holder.querySelector("#subform-model-application-filter-select") as HTMLSelectElement).value).toBe("");
        expect(globalThis.subformModelSelectedApp).toBe("");
        expect((holder.querySelector("#subform-model-path-filter-input") as HTMLInputElement).value).toBe("grad");
        expect((holder.querySelector("#subform-model-show-agreeing") as HTMLInputElement).checked).toBe(true);
    });
});
