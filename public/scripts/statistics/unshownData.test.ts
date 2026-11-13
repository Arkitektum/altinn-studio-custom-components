import "../../../src/components/index.ts";
import { getDataValuePaths, recordReadsForTarget, renderUnshownDataResults, runUnshownDataCheck, startRecordingReads } from "./unshownData.ts";
import type { RenderTarget } from "./renderHealth.ts";

// Unmocked on purpose: what a component reads is only known by drawing the real one.
const data = {
    soeknad: {
        tittel: "Søknad",
        ubrukt: "Aldri vist",
        tom: "",
        adresse: { adresselinje1: "Gate 1", postnr: "0150", poststed: "Oslo" }
    }
};

function target(components: unknown[], files: Record<string, unknown> = { "eksempel.xml": data }, fileName = "eksempel.xml"): RenderTarget {
    return {
        appOwner: "dibk",
        appName: "et-v4",
        formName: "DisplayLayout",
        components: components as RenderTarget["components"],
        dataModels: [{ dataType: "Byggesoknad", data: files }],
        dataType: "Byggesoknad",
        fileNames: { Byggesoknad: fileName },
        fileName
    };
}

const tittel = { id: "tittel", type: "Custom", tagName: "custom-field-data", dataModelBindings: { simpleBinding: "soeknad.tittel" } };
const adresse = { id: "adresse", type: "Custom", tagName: "custom-field-adresse", dataModelBindings: { data: "soeknad.adresse" } };

describe("getDataValuePaths", () => {
    it("lists the path of every value, with array positions as []", () => {
        expect([...getDataValuePaths({ a: { b: 1, c: [{ d: "x" }, { d: "y", e: false }] }, f: 0 })]).toEqual(["a.b", "a.c[].d", "a.c[].e", "f"]);
    });
    it("leaves out empty strings and nulls", () => {
        expect([...getDataValuePaths({ a: "", b: null, c: { d: "" }, e: [] })]).toEqual([]);
    });
});

describe("startRecordingReads", () => {
    let recording: ReturnType<typeof startRecordingReads>;
    const { stringify, parse } = JSON;
    beforeEach(() => {
        recording = startRecordingReads();
    });
    afterEach(() => {
        recording.stop();
    });

    it("records the values read, not the objects on the way to them", () => {
        const wrapped = recording.wrap({ a: { b: 1, c: 2 }, list: [{ d: "x" }] }, "") as { a: { b: number }; list: { d: string }[] };
        expect(wrapped.a.b).toBe(1);
        expect(wrapped.list.map(({ d }) => d)).toEqual(["x"]);
        expect([...recording.reads].sort()).toEqual(["a.b", "list[].d"]);
    });
    it("records nothing that JSON.stringify reads", () => {
        const wrapped = recording.wrap({ a: { b: 1 } }, "");
        expect(JSON.stringify(wrapped)).toBe('{"a":{"b":1}}');
        expect([...recording.reads]).toEqual([]);
    });
    it("records what is read from data that went through JSON.stringify and JSON.parse, under its own path", () => {
        const wrapped = recording.wrap({ soeknad: { adresse: { postnr: "0150", poststed: "Oslo" } } }, "") as { soeknad: { adresse: unknown } };
        const formData = { data: wrapped.soeknad.adresse, other: "plain" };
        const parsed = JSON.parse(JSON.stringify(formData)) as { data: { postnr: string }; other: string };
        expect(parsed.data.postnr).toBe("0150");
        expect(parsed.other).toBe("plain");
        expect([...recording.reads]).toEqual(["soeknad.adresse.postnr"]);
    });
    it("does not count a read made only to check whether something is empty", () => {
        const wrapped = recording.wrap({ a: "x", b: "y" }, "") as Record<string, string>;
        function objectHasContent(value: Record<string, string>) {
            return Object.keys(value).some((key) => value[key] !== "");
        }
        expect(objectHasContent(wrapped)).toBe(true);
        expect([...recording.reads]).toEqual([]);
        expect(wrapped.b).toBe("y");
        expect([...recording.reads]).toEqual(["b"]);
    });
    it("gives JSON back when stopped", () => {
        expect(JSON.stringify).not.toBe(stringify);
        recording.stop();
        expect(JSON.stringify).toBe(stringify);
        expect(JSON.parse).toBe(parse);
    });
});

describe("recordReadsForTarget", () => {
    let host: HTMLElement;
    const { stringify } = JSON;
    const { error } = console;
    beforeEach(() => {
        globalThis.defaultTextResources = { resources: [] };
        globalThis.textResources = { resources: [] };
        host = document.createElement("div");
        document.body.appendChild(host);
    });
    afterEach(() => {
        host.remove();
    });

    it("records the value a text binding shows, and not the others", () => {
        const recorded = recordReadsForTarget(target([tittel]), host)!;
        expect(recorded.dataType).toBe("Byggesoknad");
        expect([...recorded.values].sort()).toEqual([
            "soeknad.adresse.adresselinje1",
            "soeknad.adresse.postnr",
            "soeknad.adresse.poststed",
            "soeknad.tittel",
            "soeknad.ubrukt"
        ]);
        expect([...recorded.reads]).toEqual(["soeknad.tittel"]);
    });
    it("records what a component bound to an object reads inside it", () => {
        const recorded = recordReadsForTarget(target([adresse]), host)!;
        expect([...recorded.reads].sort()).toEqual(["soeknad.adresse.adresselinje1", "soeknad.adresse.postnr", "soeknad.adresse.poststed"]);
        expect(host.childNodes).toHaveLength(0);
    });
    it("records nothing for a drawing without an example file", () => {
        expect(recordReadsForTarget({ ...target([tittel]), fileNames: {}, fileName: undefined }, host)).toBeNull();
    });
    it("empties the element, and gives JSON and the console back, even when the form cannot be drawn", () => {
        recordReadsForTarget(target([tittel, { id: "x", tagName: "custom-component" }]), host);
        expect(host.childNodes).toHaveLength(0);
        expect(JSON.stringify).toBe(stringify);
        expect(console.error).toBe(error);
    });
});

describe("runUnshownDataCheck", () => {
    it("joins what each example file of a form had and what was read, and lists the values never read", async () => {
        Object.assign(globalThis, { multilingualDefaultTextResources: [], multilingualAppResourceValues: [] });
        const files = {
            "en.xml": { soeknad: { tittel: "Søknad", ubrukt: "Aldri vist" } },
            "to.xml": { soeknad: { tittel: "Annen", ekstra: "Bare her", adresse: data.soeknad.adresse } }
        };
        const progress: [number, number][] = [];
        const withoutData = { ...target([tittel]), formName: "uten-data-v1", fileNames: {}, fileName: undefined };
        const forms = await runUnshownDataCheck(
            [target([tittel, adresse], files, "en.xml"), withoutData, target([tittel, adresse], files, "to.xml")],
            (done, total) => progress.push([done, total])
        );
        expect(progress).toEqual([
            [1, 2],
            [2, 2]
        ]);
        expect(forms).toEqual([
            {
                appOwner: "dibk",
                appName: "et-v4",
                formName: "DisplayLayout",
                dataType: "Byggesoknad",
                files: 2,
                values: 6,
                unshown: [
                    { path: "soeknad.ekstra", files: 1 },
                    { path: "soeknad.ubrukt", files: 1 }
                ]
            }
        ]);
        expect(document.querySelector(".unshown-data-drawing")).toBeNull();
    });
});

describe("renderUnshownDataResults", () => {
    const form = {
        appOwner: "dibk",
        appName: "et-v4",
        formName: "DisplayLayout",
        dataType: "Byggesoknad",
        files: 2,
        values: 6,
        unshown: [
            { path: "soeknad.<b>x</b>", files: 1 },
            { path: "soeknad.ubrukt", files: 2 }
        ]
    };
    beforeEach(() => {
        globalThis.lastUpdated = "2026-11-13T10:00:00.000Z";
    });

    it("counts the unshown values and lists them per form, as text", () => {
        const element = document.createElement("div");
        renderUnshownDataResults(element, { forms: [form, { ...form, formName: "Clean", unshown: [] }], lastUpdated: globalThis.lastUpdated });
        expect(element.querySelector(".unshown-data-summary")!.textContent).toBe("2 values are never shown, in 1 of 2 forms.");
        const details = element.querySelectorAll("details.unshown-data-form");
        expect(details).toHaveLength(1);
        expect(details[0]!.querySelector("summary")!.textContent).toBe("dibk/et-v4, DisplayLayout (Byggesoknad): 2 of 6 values never shown");
        expect(Array.from(details[0]!.querySelectorAll("li")).map((item) => item.textContent)).toEqual([
            "soeknad.<b>x</b> in 1 of 2 example files",
            "soeknad.ubrukt in 2 of 2 example files"
        ]);
        expect(element.querySelector("li b")).toBeNull();
    });
    it("says every value is shown when none is unshown", () => {
        const element = document.createElement("div");
        renderUnshownDataResults(element, { forms: [{ ...form, unshown: [] }], lastUpdated: globalThis.lastUpdated });
        expect(element.textContent).toBe("Every value in the example data is shown, in 1 form.");
    });
    it("counts one form, one value and one example file in the singular", () => {
        const element = document.createElement("div");
        const single = { ...form, files: 1, values: 1, unshown: [{ path: "soeknad.ubrukt", files: 1 }] };
        renderUnshownDataResults(element, { forms: [single], lastUpdated: globalThis.lastUpdated });
        expect(element.querySelector(".unshown-data-summary")!.textContent).toBe("1 value is never shown, in 1 of 1 form.");
        expect(element.querySelector("summary")!.textContent).toBe("dibk/et-v4, DisplayLayout (Byggesoknad): 1 of 1 value never shown");
        expect(element.querySelector("li")!.textContent).toBe("soeknad.ubrukt in 1 of 1 example file");
    });
    it("says when the results are from before the last synchronization", () => {
        const element = document.createElement("div");
        renderUnshownDataResults(element, { forms: [], lastUpdated: "2026-11-01T10:00:00.000Z" });
        expect(element.querySelector(".render-health-stale")).not.toBeNull();
    });
    it("shows nothing before the first check", () => {
        const element = document.createElement("div");
        element.textContent = "old";
        renderUnshownDataResults(element, null);
        expect(element.textContent).toBe("");
    });
});
