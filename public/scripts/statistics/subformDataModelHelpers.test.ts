import { getSubformDataModelDrift } from "./subformDataModelHelpers.ts";

import type { SubformDataModelCopy, XsdField } from "./subformDataModelHelpers.ts";

/** A text field that occurs once, the most common kind. */
function field(path: string, overrides: Partial<XsdField> = {}): XsdField {
    return { path, node: "element", type: "string", minOccurs: 1, maxOccurs: 1, ...overrides };
}

/** A group: an element holding other elements. */
function group(path: string, overrides: Partial<XsdField> = {}): XsdField {
    return field(path, { type: null, ...overrides });
}

function copy(appName: string, fields: XsdField[], overrides: Partial<SubformDataModelCopy> = {}): SubformDataModelCopy {
    return { appOwner: "dibk", appName, error: null, rootElement: "Dispensasjon", fields, ...overrides };
}

function appNames(apps: { appName: string }[]) {
    return apps.map((app) => app.appName);
}

describe("getSubformDataModelDrift", () => {
    it("puts copies declaring the same fields in one variant, whatever order they declare them in", () => {
        const [drift] = getSubformDataModelDrift([
            {
                dataType: "DispensasjonssoeknadDataV1",
                copies: [copy("es-v2", [field("a"), field("b")]), copy("et-v4", [field("b"), field("a")])]
            }
        ]);

        expect(drift!.variants).toEqual([
            {
                apps: [
                    { appOwner: "dibk", appName: "es-v2" },
                    { appOwner: "dibk", appName: "et-v4" }
                ],
                rootElement: "Dispensasjon",
                fieldCount: 2
            }
        ]);
        expect(drift!.differences).toEqual([]);
        expect(drift!.unreadable).toEqual([]);
    });

    it("lists the variants with the most apps first, ties in the order the copies came in", () => {
        const [drift] = getSubformDataModelDrift([
            {
                dataType: "DispensasjonssoeknadDataV1",
                copies: [
                    copy("disp-v1", [field("a")]),
                    copy("es-v2", [field("a"), field("b")]),
                    copy("fts-v1", [field("old")]),
                    copy("et-v4", [field("a"), field("b")])
                ]
            }
        ]);

        expect(drift!.variants.map((variant) => appNames(variant.apps))).toEqual([["es-v2", "et-v4"], ["disp-v1"], ["fts-v1"]]);
    });

    it("lists each field the variants disagree on, with how each variant declares it, sorted by path", () => {
        const [drift] = getSubformDataModelDrift([
            {
                dataType: "DispensasjonssoeknadDataV1",
                copies: [
                    copy("es-v2", [field("same"), field("gradAvUtnytting", { type: "decimal" }), field("nytt")]),
                    copy("et-v4", [field("same"), field("gradAvUtnytting", { type: "decimal" }), field("nytt")]),
                    copy("fts-v1", [field("same"), field("gradAvUtnytting"), field("gammelt")])
                ]
            }
        ]);

        expect(drift!.differences).toEqual([
            { path: "gammelt", fields: [null, field("gammelt")], hiddenBelow: 0 },
            { path: "gradAvUtnytting", fields: [field("gradAvUtnytting", { type: "decimal" }), field("gradAvUtnytting")], hiddenBelow: 0 },
            { path: "nytt", fields: [field("nytt"), null], hiddenBelow: 0 }
        ]);
    });

    it.each([
        ["how often it may occur", { maxOccurs: "unbounded" as const }],
        ["whether it is required", { minOccurs: 0 }],
        ["the value it fixes", { fixed: "47365" }],
        ["whether it is an attribute", { node: "attribute" as const }]
    ])("tells two declarations of a field apart by %s", (_label, overrides) => {
        const [drift] = getSubformDataModelDrift([{ dataType: "D", copies: [copy("es-v2", [field("a")]), copy("fts-v1", [field("a", overrides)])] }]);

        expect(drift!.variants).toHaveLength(2);
        expect(drift!.differences).toEqual([{ path: "a", fields: [field("a"), field("a", overrides)], hiddenBelow: 0 }]);
    });

    it("tells copies with different root elements apart even when their fields agree", () => {
        const [drift] = getSubformDataModelDrift([
            { dataType: "D", copies: [copy("es-v2", [field("a")]), copy("fts-v1", [field("a")], { rootElement: "Annen" })] }
        ]);

        expect(drift!.variants.map((variant) => variant.rootElement)).toEqual(["Dispensasjon", "Annen"]);
        expect(drift!.differences).toEqual([]);
    });

    it("folds the fields of a group one variant lacks into the group's row, counting them", () => {
        const [drift] = getSubformDataModelDrift([
            {
                dataType: "D",
                copies: [
                    copy("es-v2", [field("a"), group("plan"), field("plan.navn"), group("plan.bestemmelse"), field("plan.bestemmelse.tekst")]),
                    copy("fts-v1", [field("a")])
                ]
            }
        ]);

        expect(drift!.differences).toEqual([{ path: "plan", fields: [group("plan"), null], hiddenBelow: 3 }]);
    });

    it("folds a field into the group holding it, when only a group further down is missing", () => {
        const [drift] = getSubformDataModelDrift([
            {
                dataType: "D",
                copies: [copy("es-v2", [group("plan"), group("plan.bestemmelse"), field("plan.bestemmelse.tekst")]), copy("fts-v1", [group("plan")])]
            }
        ]);

        expect(drift!.differences).toEqual([{ path: "plan.bestemmelse", fields: [group("plan.bestemmelse"), null], hiddenBelow: 1 }]);
    });

    it("keeps a row for a field inside such a group when the variants holding the group disagree on it", () => {
        const [drift] = getSubformDataModelDrift([
            {
                dataType: "D",
                copies: [
                    copy("es-v2", [group("plan"), field("plan.navn"), field("plan.id")]),
                    copy("et-v4", [group("plan"), field("plan.navn", { minOccurs: 0 }), field("plan.id")]),
                    copy("fts-v1", [])
                ]
            }
        ]);

        expect(drift!.differences).toEqual([
            { path: "plan", fields: [group("plan"), group("plan"), null], hiddenBelow: 1 },
            { path: "plan.navn", fields: [field("plan.navn"), field("plan.navn", { minOccurs: 0 }), null], hiddenBelow: 0 }
        ]);
    });

    it("keeps a row for a field that a variant holding its group lacks", () => {
        const [drift] = getSubformDataModelDrift([
            {
                dataType: "D",
                copies: [copy("es-v2", [group("plan"), field("plan.navn")]), copy("et-v4", [group("plan", { minOccurs: 0 })])]
            }
        ]);

        expect(drift!.differences).toEqual([
            { path: "plan", fields: [group("plan"), group("plan", { minOccurs: 0 })], hiddenBelow: 0 },
            { path: "plan.navn", fields: [field("plan.navn"), null], hiddenBelow: 0 }
        ]);
    });

    it("keeps unreadable copies out of the variants and lists them with the reason", () => {
        const [drift] = getSubformDataModelDrift([
            {
                dataType: "D",
                copies: [
                    copy("es-v2", [field("a")]),
                    copy("rs-v4", [], { error: "App/models/D.xsd could not be read from Altinn Studio.", rootElement: null }),
                    copy("su-v2", [], { rootElement: null })
                ]
            }
        ]);

        expect(drift!.variants.map((variant) => appNames(variant.apps))).toEqual([["es-v2"]]);
        expect(drift!.differences).toEqual([]);
        expect(drift!.unreadable).toEqual([
            { appOwner: "dibk", appName: "rs-v4", error: "App/models/D.xsd could not be read from Altinn Studio." },
            { appOwner: "dibk", appName: "su-v2", error: "The copy declares no root element." }
        ]);
    });

    it("answers one entry per subform data type, in the order given, and none for nothing", () => {
        const drift = getSubformDataModelDrift([
            { dataType: "B", copies: [copy("es-v2", [field("a")])] },
            { dataType: "A", copies: [] }
        ]);

        expect(drift.map((entry) => entry.dataType)).toEqual(["B", "A"]);
        expect(drift[1]).toEqual({ dataType: "A", variants: [], differences: [], unreadable: [] });
        expect(getSubformDataModelDrift(undefined)).toEqual([]);
    });
});
