import { renderAnsvarsrettAnsvarsomraadeTable } from "./renderers.js";

/** The bindings this table reads, including the four wordings the declarations column chooses between. */
const resourceBindings = {
    ansvarsomraader: { titleSingle: "Ansvarsområde", titlePlural: "Ansvarsområder", emptyFieldText: "Ingen" },
    funksjon: { title: "Funksjon", emptyFieldText: "-" },
    beskrivelseAvAnsvarsomraadet: { title: "Beskrivelse", emptyFieldText: "-" },
    tiltaksklasse: { title: "Tiltaksklasse", emptyFieldText: "-" },
    faseSamsvarKontroll: {
        titleKontroll: "Kontrollerklæringer",
        titleProUtf: "Samsvarserklæringer",
        titleMix: "Samsvars- og kontrollerklæringer",
        emptyFieldText: "Ingen erklæringer"
    },
    dekkesOmraadeAvSentralGodkjenning: { title: "Sentral godkjenning", trueText: "Ja", falseText: "Nei", defaultText: "Ikke oppgitt" }
};

/** One area of responsibility carrying the given function code. */
const area = (kodeverdi) => ({ funksjon: { kodeverdi }, beskrivelseAvAnsvarsomraadet: "Beskrivelse" });

/** The table for the given areas, with anything else the case under test puts alongside the data. */
const table = (areas, extra = {}) => renderAnsvarsrettAnsvarsomraadeTable({ resourceBindings, resourceValues: { data: areas, ...extra } });

/** The attributes the table carries, with the JSON-valued ones parsed back. */
function attributes(element) {
    const read = (name) => element.getAttribute(name);
    const readJson = (name) => (read(name) === null ? null : JSON.parse(read(name)));
    return {
        tagName: element.tagName.toLowerCase(),
        hideIfEmpty: read("hideifempty"),
        hideTitle: read("hidetitle"),
        columns: readJson("tablecolumns"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues")
    };
}

/** The data keys of the columns drawn for the given areas. */
const columnKeys = (areas, extra) => attributes(table(areas, extra)).columns.map((entry) => entry.dataKey);

/** The title the declarations column was given for the given areas. */
const declarationsTitle = (areas) =>
    attributes(table(areas)).columns.find((entry) => entry.dataKey === "faseSamsvarKontrollList.resourceValues.data")?.resourceBindings
        .title;

describe("the table's own title", () => {
    it("names one area in the singular and several in the plural", () => {
        expect(attributes(table([area("PRO")])).resourceBindings.title).toBe("Ansvarsområde");
        expect(attributes(table([area("PRO"), area("UTF")])).resourceBindings.title).toBe("Ansvarsområder");
    });

    it("uses the plural when there is nothing at all, rather than the singular", () => {
        expect(attributes(table([])).resourceBindings.title).toBe("Ansvarsområder");
    });
});

describe("the three columns always drawn", () => {
    it("draws the function, the description and the class", () => {
        expect(columnKeys([area("PRO")]).slice(0, 3)).toEqual([
            "funksjon.kodeverdi",
            "beskrivelseAvAnsvarsomraadet",
            "tiltaksklasse.kodebeskrivelse"
        ]);
    });

    it("shows the function by its code and the class by its description", () => {
        // A function is known by its short code, SOEK or PRO, while a class is a word.
        expect(columnKeys([area("PRO")])).toContain("funksjon.kodeverdi");
        expect(columnKeys([area("PRO")])).toContain("tiltaksklasse.kodebeskrivelse");
    });
});

describe("the declarations column", () => {
    it("is drawn only when some area carries a role that declares anything", () => {
        expect(columnKeys([area("PRO")])).toContain("faseSamsvarKontrollList.resourceValues.data");
        expect(columnKeys([area("SOEK")])).not.toContain("faseSamsvarKontrollList.resourceValues.data");
    });

    it("is titled for control alone, for conformity alone, or for both together", () => {
        expect(declarationsTitle([area("KONTROLL")])).toBe("Kontrollerklæringer");
        expect(declarationsTitle([area("PRO")])).toBe("Samsvarserklæringer");
        expect(declarationsTitle([area("UTF")])).toBe("Samsvarserklæringer");
        expect(declarationsTitle([area("KONTROLL"), area("PRO")])).toBe("Samsvars- og kontrollerklæringer");
    });

    it("reads function codes whatever case they were written in", () => {
        expect(declarationsTitle([area("kontroll")])).toBe("Kontrollerklæringer");
        expect(declarationsTitle([area("pro")])).toBe("Samsvarserklæringer");
    });

    it("hides its own heading and strips the bullets off the list", () => {
        // The column heading above it already says what the list is.
        const column = attributes(table([area("PRO")])).columns.find((entry) => entry.dataKey.startsWith("faseSamsvarKontrollList"));

        expect(column).toMatchObject({
            tagName: "custom-list-data",
            hideTitle: true,
            styleOverride: { listStyle: "none", paddingInline: "0" }
        });
    });
});

describe("the central approval column", () => {
    it("is left out unless the component asks for it", () => {
        expect(columnKeys([area("PRO")])).not.toContain("dekkesOmraadeAvSentralGodkjenning");
    });

    it("is drawn when asked for, whether the flag arrives as a string or as a boolean", () => {
        // It comes off an attribute in some places and off an object in others, so both spellings have to work.
        expect(columnKeys([area("PRO")], { simpleBinding: "true" })).toContain("dekkesOmraadeAvSentralGodkjenning");
        expect(columnKeys([area("PRO")], { simpleBinding: true })).toContain("dekkesOmraadeAvSentralGodkjenning");
    });

    it("is not drawn for anything else that merely looks true", () => {
        expect(columnKeys([area("PRO")], { simpleBinding: "yes" })).not.toContain("dekkesOmraadeAvSentralGodkjenning");
        expect(columnKeys([area("PRO")], { simpleBinding: false })).not.toContain("dekkesOmraadeAvSentralGodkjenning");
    });

    it("turns the flag into words, with a wording for each outcome", () => {
        const columns = attributes(table([area("PRO")], { simpleBinding: "true" })).columns;
        const column = columns.find((entry) => entry.dataKey === "dekkesOmraadeAvSentralGodkjenning");

        expect(column).toMatchObject({
            tagName: "custom-field-boolean-text",
            hideTitle: true,
            resourceBindings: { trueText: "Ja", falseText: "Nei", defaultText: "Ikke oppgitt" }
        });
    });
});

describe("areas with no function to go on", () => {
    it("is passed over when working out the declarations heading, rather than clearing it", () => {
        // An area whose function was never filled in says nothing about which declarations are planned, so the
        // areas that do have one still decide the heading.
        expect(declarationsTitle([{ funksjon: {} }, area("PRO")])).toBe("Samsvarserklæringer");
    });

    it("draws the three plain columns and nothing more", () => {
        expect(columnKeys([{ funksjon: {} }])).toHaveLength(3);
    });

    it("renders without a component at all rather than throwing", () => {
        expect(renderAnsvarsrettAnsvarsomraadeTable(undefined) !== undefined).toBe(true);
        expect(renderAnsvarsrettAnsvarsomraadeTable({}) !== undefined).toBe(true);
    });
});
