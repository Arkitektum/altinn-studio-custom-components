import * as renderers from "./renderers.ts";

/** The renderers looked up by name, which is how the table-driven tests below reach them. */
const byName = renderers as unknown as Record<string, (component: unknown) => HTMLElement>;

/**
 * A dispensation carrying everything these renderers read.
 *
 * The values are deliberately distinguishable from one another, so a test that asserts on one of them cannot pass
 * by reading a neighbour.
 */
const component = {
    resourceBindings: {
        dispensasjonsreferanse: { title: "Referanse" },
        metadataFtbId: { title: "FtB-id" },
        kommunensSaksnummer: { title: "Saksnummer" },
        soeknadGjelder: { title: "Søknaden gjelder" },
        tiltakstyper: { title: "Tiltakstyper" },
        tiltakstyperKode: { title: "Type" },
        tiltakshaver: { title: "Tiltakshaver" },
        tiltakshaverAdresse: { title: "Adresse" },
        tiltakshaverKontaktperson: { title: "Kontaktperson" },
        tiltakshaverKontaktpersonAdresse: { title: "Kontaktpersonens adresse" },
        eiendomByggested: { title: "Eiendom" },
        dispensasjonsbeskrivelse: { title: "Beskrivelse" },
        plannavn: { title: "Plannavn" },
        dispensasjonFra: { title: "Dispensasjon fra" },
        nasjonalArealplanIdPlanIdentifikasjon: { title: "Planident" },
        bestemmelsestype: { title: "Bestemmelsestype" },
        paragrafnummer: { title: "Paragraf" },
        stedfesting: { title: "Stedfesting" },
        stedfestingPosisjonKoordinatsystem: { title: "Koordinatsystem" },
        stedfestingPosisjonKoordinater: { title: "Koordinater" },
        stedfestingVertikalnivaa: { title: "Vertikalnivå" },
        varighet: { title: "Varighet" },
        oensketVarighet: { title: "Ønsket varighet" },
        begrunnelse: { title: "Begrunnelse" },
        begrunnelseHensynBakBestemmelsen: { title: "Hensyn" },
        begrunnelseVurderingHensynBakBestemmelsen: { title: "Vurdering av hensyn" },
        begrunnelseVurderingHensynOverordnet: { title: "Overordnet vurdering" },
        begrunnelseFordeler: { title: "Fordeler" },
        begrunnelseUlemper: { title: "Ulemper" },
        begrunnelseSamletBegrunnelse: { title: "Samlet begrunnelse" },
        generelleVilkaarNorskSvenskDansk: { title: "Norsk, svensk eller dansk" }
    },
    resourceValues: {
        data: {
            dispensasjonstema: { kodebeskrivelse: "Avstand til nabogrense" },
            dispensasjonsreferanse: "REF-1",
            metadata: { ftbId: "ftb-1" },
            kommunensSaksnummer: { saksaar: 2026, sakssekvensnummer: 12 },
            eiendomByggested: { eiendom: [{ adresse: "Storgata 1" }] },
            tiltakstyper: { kode: ["nybygg"] },
            tiltakshaver: {
                navn: "Firma AS",
                adresse: { adresselinje1: "Storgata 1" },
                kontaktperson: { navn: "Ola Nordmann", adresse: { adresselinje1: "Lillegata 2" } }
            },
            dispensasjonsbeskrivelse: "Ønsker å bygge nærmere grensen",
            plannavn: "Reguleringsplan sør",
            nasjonalArealplanId: { planidentifikasjon: "1234" },
            bestemmelsestype: { kodebeskrivelse: "Byggegrense" },
            paragrafnummer: "12-4",
            stedfesting: {
                posisjon: { koordinatsystem: { kodebeskrivelse: "EUREF89" }, koordinater: { koordinat: [{ nord: 1, oest: 2 }] } },
                vertikalnivaa: { kodebeskrivelse: "På bakken" }
            },
            varighet: { oensketVarighetTil: "2027-01-01" },
            begrunnelse: {
                hensynBakBestemmelsen: "Hensynet bak",
                vurderingHensynBakBestemmelsen: "Vurdering av hensynet",
                vurderingHensynOverordnet: "Overordnet vurdering",
                fordeler: { effekt: ["Bedre utnyttelse"] },
                ulemper: { effekt: ["Noe skygge"] },
                samletBegrunnelse: "Samlet sett"
            },
            generelleVilkaar: { norskSvenskDansk: true }
        }
    }
};

/** The custom element a renderer produced, unwrapped from the grid container some of them add. */
function element(rendered: HTMLElement): HTMLElement {
    return rendered.tagName === "DIV" ? ((rendered.firstChild as HTMLElement).firstChild as HTMLElement) : rendered;
}

/** The attributes a custom element carries, with the JSON-valued ones parsed back. */
function attributes(rendered: HTMLElement) {
    const target = element(rendered);
    const read = (name: string) => target.getAttribute(name);
    const readJson = (name: string) => (read(name) === null ? null : JSON.parse(read(name)!));
    return {
        tagName: target.tagName.toLowerCase(),
        size: read("size"),
        hideIfEmpty: read("hideifempty"),
        isChildComponent: read("ischildcomponent"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

const data = component.resourceValues.data;

/**
 * The fields, each with the element it renders as and the value it should have found.
 *
 * Written as a table because the interesting part is which path each one reads: several of them sit three or four
 * levels down, and a field reading its neighbour's value would otherwise look perfectly correct.
 */
const fields: [string, string, unknown][] = [
    ["renderDispensasjonsreferanse", "custom-field-data", data.dispensasjonsreferanse],
    ["renderMetadataFtbId", "custom-field-data", data.metadata.ftbId],
    ["renderKommunensSaksnummer", "custom-field-kommunens-saksnummer", data.kommunensSaksnummer],
    ["renderTiltakstyperKode", "custom-list-data", data.tiltakstyper.kode],
    ["renderTiltakshaverAdresse", "custom-field-adresse", data.tiltakshaver.adresse],
    ["renderTiltakshaverKontaktpersonAdresse", "custom-field-adresse", data.tiltakshaver.kontaktperson.adresse],
    ["renderDispensasjonsbeskrivelse", "custom-field-data", data.dispensasjonsbeskrivelse],
    ["renderPlannavn", "custom-field-data", data.plannavn],
    ["renderNasjonalArealplanIdPlanIdentifikasjon", "custom-field-data", data.nasjonalArealplanId.planidentifikasjon],
    ["renderBestemmelsestype", "custom-field-data", data.bestemmelsestype.kodebeskrivelse],
    ["renderParagrafnummer", "custom-field-data", data.paragrafnummer],
    ["renderStedfestingPosisjonKoordinatsystem", "custom-field-data", data.stedfesting.posisjon.koordinatsystem.kodebeskrivelse],
    ["renderStedfestingPosisjonKoordinater", "custom-field-data", data.stedfesting.posisjon.koordinater.koordinat],
    ["renderStedfestingVertikalnivaa", "custom-field-data", data.stedfesting.vertikalnivaa.kodebeskrivelse],
    ["renderBegrunnelseHensynBakBestemmelsen", "custom-field-data", data.begrunnelse.hensynBakBestemmelsen],
    ["renderBegrunnelseVurderingHensynBakBestemmelsen", "custom-field-data", data.begrunnelse.vurderingHensynBakBestemmelsen],
    ["renderBegrunnelseVurderingHensynOverordnet", "custom-field-data", data.begrunnelse.vurderingHensynOverordnet],
    ["renderBegrunnelseFordeler", "custom-list-data", data.begrunnelse.fordeler.effekt],
    ["renderBegrunnelseUlemper", "custom-list-data", data.begrunnelse.ulemper.effekt],
    ["renderBegrunnelseSamletBegrunnelse", "custom-field-data", data.begrunnelse.samletBegrunnelse],
    ["renderGenerelleVilkaarNorskSvenskDansk", "custom-field-boolean-text", data.generelleVilkaar.norskSvenskDansk]
];

describe("the fields", () => {
    it.each(fields)("%s renders %s with the value it read", (name, tagName, expected) => {
        expect(attributes(byName[name]!(component))).toMatchObject({
            tagName,
            resourceValues: { data: expected },
            wrapped: true
        });
    });
});

describe("the dispensation header", () => {
    it("titles the dispensation by its theme", () => {
        expect(attributes(renderers.renderDispensasjonHeader(component)!)).toMatchObject({
            tagName: "custom-header-text",
            size: "h1",
            resourceValues: { title: "Avstand til nabogrense" }
        });
    });

    it("renders nothing at all when the theme has no description", () => {
        // The only renderer here that can decline: a dispensation with no theme would otherwise show an empty heading.
        expect(renderers.renderDispensasjonHeader({})).toBeNull();
        expect(renderers.renderDispensasjonHeader({ resourceValues: { data: { dispensasjonstema: {} } } })).toBeNull();
    });

    it("takes the heading level it is given", () => {
        expect(attributes(renderers.renderDispensasjonHeader(component, "h2")!).size).toBe("h2");
    });

    it("leaves out the tiltakstyper heading unless there is at least one type", () => {
        // The heading introduces a list, so an empty list leaves nothing for it to introduce.
        expect(renderers.renderTiltakstyperHeader({})).toBeNull();
        expect(renderers.renderTiltakstyperHeader({ resourceValues: { data: { tiltakstyper: { kode: [] } } } })).toBeNull();
        expect(attributes(renderers.renderTiltakstyperHeader(component)!).size).toBe("h3");
    });

    it("leaves out the general conditions heading unless the condition was answered", () => {
        // The heading introduces a single yes-or-no answer, so without the answer there is nothing to introduce.
        expect(renderers.renderGenerelleVilkaarNorskSvenskDanskHeader({})).toBeNull();
        expect(attributes(renderers.renderGenerelleVilkaarNorskSvenskDanskHeader(component)!).size).toBe("h2");
    });
});

describe("the section headers", () => {
    it.each([
        ["renderSoeknadGjelderHeader", "h2"],
        ["renderDispensasjonFraHeader", "h2"],
        ["renderVarighetHeader", "h2"],
        ["renderBegrunnelseHeader", "h2"],
        ["renderGenerelleVilkaarNorskSvenskDanskHeader", "h2"],
        ["renderStedfestingHeader", "h2"]
    ])("%s sits at %s", (name, size) => {
        expect(attributes(byName[name]!(component))).toMatchObject({ tagName: "custom-header-text", size });
    });
});

describe("how long the dispensation is wanted for", () => {
    it("says so plainly when a permanent dispensation is asked for", () => {
        const permanent = {
            resourceBindings: { varighetOenskesVarigDispensasjon: { trueText: "Varig dispensasjon" } },
            resourceValues: { data: { varighet: { oenskesVarigDispensasjon: true } } }
        };

        expect(attributes(renderers.renderOensketVarighet(permanent)!)).toMatchObject({
            tagName: "custom-paragraph-text",
            resourceBindings: { title: "Varig dispensasjon" }
        });
    });

    it("renders the end date as a date field when one is given instead", () => {
        // The format attribute is what turns the stored 2027-01-01 into a date a reader recognises.
        const rendered = renderers.renderOensketVarighet(component);

        expect(attributes(rendered!)).toMatchObject({
            tagName: "custom-field-data",
            resourceValues: { data: "2027-01-01" }
        });
        expect(element(rendered!).getAttribute("format")).toBe("date");
    });

    it("renders nothing when neither is given", () => {
        expect(renderers.renderOensketVarighet({ resourceValues: { data: { varighet: {} } } })).toBeNull();
    });
});

describe("the tables", () => {
    it("renders the property as a table, at full width", () => {
        expect(attributes(renderers.renderEiendomByggestedElement(component))).toMatchObject({
            tagName: "custom-table-eiendom",
            wrapped: false,
            resourceValues: { data: [{ adresse: "Storgata 1" }] }
        });
    });

    it("renders the developer and the contact person as parts, each from its own level of the data", () => {
        // The contact person sits inside the developer, so these two differ only by one step down the path.
        expect(attributes(renderers.renderTiltakshaver(component))).toMatchObject({
            tagName: "custom-table-part",
            resourceValues: { data: data.tiltakshaver }
        });
        expect(attributes(renderers.renderTiltakshaverKontaktperson(component))).toMatchObject({
            tagName: "custom-table-part",
            resourceValues: { data: data.tiltakshaver.kontaktperson }
        });
    });
});

describe("every renderer", () => {
    it("renders an element or nothing at all for a dispensation with no data, and never throws", () => {
        // Half of this layout is optional, so an empty dispensation has to come out as an empty page rather than an error.
        for (const [name, render] of Object.entries(renderers)) {
            const rendered = render({});
            expect({ name, ok: rendered === null || rendered instanceof HTMLElement }).toEqual({ name, ok: true });
        }
    });

    it("marks everything it renders as a child component", () => {
        for (const [name, render] of Object.entries(renderers)) {
            expect({ name, isChild: attributes(render(component)!).isChildComponent }).toEqual({ name, isChild: "true" });
        }
    });
});
