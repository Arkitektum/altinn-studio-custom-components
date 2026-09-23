import {
    renderAnsvarligSoeker,
    renderAnsvarsomraade,
    renderEiendomByggested,
    renderGjennomfoeringsplanHeader,
    renderGjennomfoeringsplanSubHeader,
    renderKommunensSaksnummer,
    renderMetadataFtbId,
    renderMetadataProsjektnavn,
    renderPlanenGjelderHeader,
    renderVersjon
} from "./renderers.js";

/**
 * A component carrying everything these renderers read, so each test can say what it cares about and ignore the rest.
 */
const component = {
    resourceBindings: {
        gjennomfoeringsplan: { title: "Gjennomføringsplan", description: "Sist oppdatert av ansvarlig søker" },
        planenGjelder: { title: "Planen gjelder" },
        versjon: { title: "Versjon" },
        kommunensSaksnummer: { title: "Kommunens saksnummer" },
        metadataProsjektnavn: { title: "Prosjektnavn" },
        metadataFtbId: { title: "FtB-id" },
        eiendomByggested: { title: "Eiendom/byggested" },
        ansvarligSoeker: { title: "Ansvarlig søker" },
        ansvarligSoekerNavn: { title: "Navn", emptyFieldText: "Ikke oppgitt" },
        ansvarligSoekerOrganisasjonsnummer: { title: "Organisasjonsnummer", emptyFieldText: "Ikke oppgitt" },
        tiltaksklasse: { title: "Tiltaksklasse", emptyFieldText: "Ikke oppgitt" },
        ansvarsfordeling: { title: "Ansvarsfordeling" }
    },
    resourceValues: {
        data: {
            versjon: "3",
            kommunensSaksnummer: { saksaar: 2026, sakssekvensnummer: 12 },
            metadata: { prosjektnavn: "Nytt bygg", ftbId: "ftb-1" },
            eiendomByggested: { eiendom: [{ adresse: "Storgata 1" }] },
            ansvarligSoeker: { navn: "Firma AS", organisasjonsnummer: "912345678" },
            ansvarligSoekerTiltaksklasse: { kodeverdi: "2" },
            gjennomfoeringsplan: { ansvarsomraade: [{ funksjon: "SØK" }] }
        }
    }
};

/**
 * The custom element a renderer produced. Some of them wrap it in a container for the grid, which is a detail of
 * the layout rather than of the element, so it is unwrapped here.
 */
function element(rendered) {
    return rendered.tagName === "DIV" ? rendered.firstChild.firstChild : rendered;
}

/** The attributes a custom element carries, with the JSON-valued ones parsed back. */
function attributes(rendered) {
    const target = element(rendered);
    const read = (name) => target.getAttribute(name);
    const readJson = (name) => (read(name) === null ? null : JSON.parse(read(name)));
    return {
        tagName: target.tagName.toLowerCase(),
        size: read("size"),
        hideIfEmpty: read("hideifempty"),
        isChildComponent: read("ischildcomponent"),
        grid: readJson("grid"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

const renderers = {
    renderGjennomfoeringsplanHeader,
    renderGjennomfoeringsplanSubHeader,
    renderPlanenGjelderHeader,
    renderVersjon,
    renderKommunensSaksnummer,
    renderMetadataProsjektnavn,
    renderMetadataFtbId,
    renderEiendomByggested,
    renderAnsvarligSoeker,
    renderAnsvarsomraade
};

describe("the gjennomfoeringsplan headers", () => {
    it("renders the plan header as header text, at h1 unless told otherwise", () => {
        expect(attributes(renderGjennomfoeringsplanHeader(component))).toMatchObject({
            tagName: "custom-header-text",
            size: "h1",
            resourceBindings: { title: "Gjennomføringsplan" }
        });
        expect(attributes(renderGjennomfoeringsplanHeader(component, "h2")).size).toBe("h2");
    });

    it("renders the plan's description as a paragraph rather than a heading", () => {
        const rendered = renderGjennomfoeringsplanSubHeader(component);

        expect(attributes(rendered)).toMatchObject({
            tagName: "custom-paragraph-text",
            resourceBindings: { title: "Sist oppdatert av ansvarlig søker" },
            wrapped: true
        });
    });

    it("renders the section header one level below the plan header", () => {
        expect(attributes(renderPlanenGjelderHeader(component))).toMatchObject({
            tagName: "custom-header-text",
            size: "h2",
            resourceBindings: { title: "Planen gjelder" }
        });
        expect(attributes(renderPlanenGjelderHeader(component, "h3")).size).toBe("h3");
    });
});

describe("the half-width fields", () => {
    it("renders the version from the data root", () => {
        expect(attributes(renderVersjon(component))).toMatchObject({
            tagName: "custom-field-data",
            hideIfEmpty: "true",
            grid: { xs: 6 },
            wrapped: true,
            resourceBindings: { title: "Versjon" },
            resourceValues: { data: "3" }
        });
    });

    it("hands the whole saksnummer object to the element that knows how to format it", () => {
        // The year and the sequence number are formatted together, so the field gets the object rather than a string.
        expect(attributes(renderKommunensSaksnummer(component))).toMatchObject({
            tagName: "custom-field-kommunens-saksnummer",
            resourceValues: { data: { saksaar: 2026, sakssekvensnummer: 12 } }
        });
    });

    it("reads the project name and the FtB id out of metadata, not the data root", () => {
        expect(attributes(renderMetadataProsjektnavn(component)).resourceValues).toEqual({ data: "Nytt bygg" });
        expect(attributes(renderMetadataFtbId(component)).resourceValues).toEqual({ data: "ftb-1" });
    });
});

describe("the tables", () => {
    it("renders the properties as a table, without a grid container", () => {
        // A table takes the full width, so it is not wrapped the way the half-width fields are.
        expect(attributes(renderEiendomByggested(component))).toMatchObject({
            tagName: "custom-table-eiendom",
            size: "h3",
            hideIfEmpty: "true",
            wrapped: false,
            resourceValues: { data: [{ adresse: "Storgata 1" }] }
        });
    });

    it("gathers the applicant's name, organisation number and class into one row", () => {
        // The class comes from a sibling of ansvarligSoeker rather than from within it, which is the part worth pinning.
        expect(attributes(renderAnsvarligSoeker(component))).toMatchObject({
            tagName: "custom-table-part-gjennomfoeringsplan",
            resourceValues: { data: { navn: "Firma AS", organisasjonsnummer: "912345678", tiltaksklasse: "2" } }
        });
    });

    it("carries the empty-field texts for each column of the applicant row", () => {
        // Each column falls back to its own text when the data has nothing, so the bindings have to arrive nested.
        expect(attributes(renderAnsvarligSoeker(component)).resourceBindings).toMatchObject({
            title: "Ansvarlig søker",
            navn: { title: "Navn", emptyFieldText: "Ikke oppgitt" },
            organisasjonsnummer: { title: "Organisasjonsnummer", emptyFieldText: "Ikke oppgitt" },
            tiltaksklasse: { title: "Tiltaksklasse", emptyFieldText: "Ikke oppgitt" }
        });
    });

    it("renders the responsibilities from the nested gjennomfoeringsplan, not the data root", () => {
        expect(attributes(renderAnsvarsomraade(component))).toMatchObject({
            tagName: "custom-grouplist-ansvarsomraade-type",
            size: "h3",
            resourceValues: { data: [{ funksjon: "SØK" }] }
        });
    });
});

describe("every renderer", () => {
    it("renders something for a component with no data at all", () => {
        // A plan can be opened before anything has been filled in, and an empty section is better than a broken page.
        for (const [name, render] of Object.entries(renderers)) {
            expect({ name, rendered: render({}) !== null }).toEqual({ name, rendered: true });
        }
    });

    it("marks everything it renders as a child component", () => {
        for (const [name, render] of Object.entries(renderers)) {
            expect({ name, isChild: attributes(render(component)).isChildComponent }).toEqual({ name, isChild: "true" });
        }
    });

    it("needs a component to render from", () => {
        // Documented rather than desired: resourceValues is reached through `component?.` but resourceBindings is not,
        // so an absent component throws here rather than rendering nothing.
        for (const render of Object.values(renderers)) {
            expect(() => render(undefined)).toThrow(TypeError);
        }
    });
});
