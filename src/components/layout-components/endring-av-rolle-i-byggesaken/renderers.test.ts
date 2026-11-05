import * as renderers from "./renderers.ts";

/** A change of role in a building case, with everything its renderers read. */
const kontaktperson = { navn: "Kontakt Person", telefonnummer: "11223344", epost: "kontakt@example.com" };
const adresse = { adresselinje1: "Testveien 1", postnr: "3750", poststed: "Drangedal" };
const rolleendring = {
    aktoer: { navn: "Kari Nordmann AS", organisasjonsnummer: "123456789" },
    aktoertype: { kodebeskrivelse: "Ansvarlig søker" },
    aktoerendring: { kodebeskrivelse: "Ny" },
    erRolleendringErklaert: true
};
const component = {
    resourceBindings: {
        endringAvRolleIByggesaken: { title: "Endring av rolle" },
        kommunensSaksnummer: { title: "Saksnummer" },
        gjelderFraDato: { title: "Gjelder fra" },
        soeknadGjelderHeader: { title: "Søknaden gjelder" },
        eiendomByggested: { title: "Eiendom" },
        soeknadGjelderType: { title: "Type" },
        soeknadGjelderBrukTiltaksformaal: { title: "Formål" },
        rolleendringer: { title: "Rolleendringer" },
        rolleendringAktoertype: { title: "Rolle" },
        rolleendringAktoerendring: { title: "Endring" },
        rolleendringAktoerNavn: { title: "Navn" },
        rolleendringAktoerOrganisasjonsnummer: { title: "Orgnr" },
        rolleendringErRolleendringErklaert: { title: "Erklært", trueText: "Ja", falseText: "Nei" },
        endringMeldtAv: { title: "Meldt av" },
        endringMeldtAvNavn: { title: "Navn" },
        endringMeldtAvAdresse: { title: "Adresse" },
        endringMeldtAvKontaktperson: { title: "Kontaktperson" }
    },
    resourceValues: {
        data: {
            kommunensSaksnummer: { saksaar: 2024, sakssekvensnummer: 12345 },
            gjelderFraDato: "2026-12-12",
            eiendomByggested: { eiendom: [{ kommunenavn: "Larvik" }] },
            soeknadGjelder: {
                type: { kode: [{ kodebeskrivelse: "Nytt bygg" }] },
                bruk: { tiltaksformaal: { kode: [{ kodebeskrivelse: "Bolig" }] } }
            },
            rolleendringer: { rolleendring: [rolleendring] },
            endringMeldtAv: { navn: "Kari Nordmann AS", adresse, kontaktperson }
        }
    }
};

/** The custom element a renderer produced, unwrapped from the container when it added one. */
const element = (rendered: HTMLElement): HTMLElement =>
    rendered.tagName === "DIV" ? ((rendered.firstChild as HTMLElement).firstChild as HTMLElement) : rendered;

/** The attributes a custom element carries, with the JSON-valued ones parsed back. */
function attributes(rendered: HTMLElement) {
    const target = element(rendered);
    const read = (name: string) => target.getAttribute(name);
    const readJson = (name: string) => (read(name) === null ? null : JSON.parse(read(name)!));
    return {
        tagName: target.tagName.toLowerCase(),
        size: read("size"),
        format: read("format"),
        hideIfEmpty: read("hideifempty"),
        itemKey: read("itemkey"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        tableColumns: readJson("tablecolumns")
    };
}

describe("the headers", () => {
    it("puts the form at h1 and Søknaden gjelder at h2, either of which a caller can change", () => {
        expect(attributes(renderers.renderEndringAvRolleIByggesakenHeader(component))).toMatchObject({
            tagName: "custom-header-text",
            size: "h1",
            resourceBindings: { title: "Endring av rolle" }
        });
        expect(attributes(renderers.renderSoeknadGjelderHeader(component)).size).toBe("h2");
        expect(attributes(renderers.renderSoeknadGjelderHeader(component, "h3")).size).toBe("h3");
    });
});

describe("the case number and date", () => {
    it("shows the municipal case number", () => {
        expect(attributes(renderers.renderKommunensSaksnummer(component))).toMatchObject({
            tagName: "custom-field-kommunens-saksnummer",
            hideIfEmpty: "true",
            resourceValues: { data: { saksaar: 2024, sakssekvensnummer: 12345 } }
        });
    });

    it("formats the date the change applies from as a date", () => {
        expect(attributes(renderers.renderGjelderFraDato(component))).toMatchObject({
            tagName: "custom-field-data",
            format: "date",
            resourceBindings: { title: "Gjelder fra" },
            resourceValues: { data: "2026-12-12" }
        });
    });
});

describe("what the application concerns", () => {
    it("shows the building site as a table of properties", () => {
        expect(attributes(renderers.renderEiendomByggestedElement(component))).toMatchObject({
            tagName: "custom-table-eiendom",
            size: "h3",
            resourceValues: { data: [{ kommunenavn: "Larvik" }] }
        });
    });

    it("lists the types and purposes by their descriptions", () => {
        expect(attributes(renderers.renderSoeknadGjelderTypeElement(component))).toMatchObject({
            tagName: "custom-list-data",
            itemKey: "kodebeskrivelse",
            resourceValues: { data: [{ kodebeskrivelse: "Nytt bygg" }] }
        });
        expect(attributes(renderers.renderSoeknadGjelderBrukTiltaksformaalElement(component)).resourceValues).toEqual({
            data: [{ kodebeskrivelse: "Bolig" }]
        });
    });
});

describe("the changes of role", () => {
    it("draws one row per change, reading the role, the change, the actor and the declaration", () => {
        const rendered = attributes(renderers.renderRolleendringerElement(component));
        expect(rendered).toMatchObject({
            tagName: "custom-table-data",
            size: "h2",
            hideIfEmpty: "true",
            resourceBindings: { title: "Rolleendringer" },
            resourceValues: { data: [rolleendring] }
        });
        expect(rendered.tableColumns.map((column: { dataKey: string }) => column.dataKey)).toEqual([
            "aktoertype.kodebeskrivelse",
            "aktoerendring.kodebeskrivelse",
            "aktoer.navn",
            "aktoer.organisasjonsnummer",
            "erRolleendringErklaert"
        ]);
        expect(rendered.tableColumns[4]).toMatchObject({
            tagName: "custom-field-boolean-text",
            resourceBindings: { title: "Erklært", trueText: "Ja", falseText: "Nei" }
        });
    });
});

describe("who reported the change", () => {
    it("shows the party, their address and their contact person", () => {
        expect(attributes(renderers.renderEndringMeldtAv(component))).toMatchObject({
            tagName: "custom-table-part",
            size: "h2",
            resourceBindings: { title: "Meldt av", navn: { title: "Navn" } }
        });
        expect(attributes(renderers.renderEndringMeldtAvAdresse(component))).toMatchObject({
            tagName: "custom-field-adresse",
            resourceValues: { data: adresse }
        });
        expect(attributes(renderers.renderEndringMeldtAvKontaktperson(component))).toMatchObject({
            tagName: "custom-table-part",
            size: "h3",
            resourceValues: { data: kontaktperson }
        });
    });
});

describe("a component without data", () => {
    it("renders every element without throwing", () => {
        const empty = { resourceBindings: component.resourceBindings, resourceValues: {} };
        for (const render of Object.values(renderers)) {
            expect(() => render(empty)).not.toThrow();
        }
    });
});
