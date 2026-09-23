import {
    renderDetErVarsletOmHeader,
    renderDispensasjonOversiktElement,
    renderEiendomByggestedElement,
    renderGjenpartNabovarselHeader,
    renderGjenpartNabovarselSubHeader,
    renderKontaktpersonForNabovarseletElement,
    renderMetadataProsjektnavn,
    renderNaboGjenboerEiendom,
    renderPlanerAndrePlanerElement,
    renderPlanerGjeldendePlanHeaderElement,
    renderPlanerGjeldendePlanNavnElement,
    renderPlanerGjeldendePlanPlantypeElement,
    renderSoekerElement,
    renderSoeknadGjelderBrukBeskrivPlanlagtFormaalElement,
    renderSoeknadGjelderBrukTiltaksformaalElement,
    renderSoeknadGjelderFoelgebrevElement,
    renderSoeknadGjelderTypeElement
} from "./renderers.js";

/** A notice carrying everything these renderers read, so each test can say what it cares about and ignore the rest. */
const component = {
    resourceBindings: {
        gjenpartNabovarsel: { title: "Gjenpart av nabovarsel", description: "Kopi til nabo" },
        metadataProsjektnavn: { title: "Prosjektnavn" },
        ansvarligSoeker: { title: "Ansvarlig søker" },
        tiltakshaver: { title: "Tiltakshaver" },
        eiendomByggested: { title: "Eiendom/byggested" },
        detErVarsletOm: { title: "Det er varslet om" },
        soeknadGjelderType: { title: "Type" },
        soeknadGjelderBrukTiltaksformaal: { title: "Tiltaksformål" },
        soeknadGjelderBrukBeskrivPlanlagtFormaal: { title: "Planlagt formål" },
        soeknadGjelderFoelgebrev: { title: "Følgebrev" },
        planerGjeldendePlan: { title: "Gjeldende plan" },
        planerGjeldendePlanNavn: { title: "Plannavn" },
        planerGjeldendePlanPlantype: { title: "Plantype" },
        planerAndrePlaner: { title: "Andre planer" },
        dispensasjonOversikt: { title: "Dispensasjoner" },
        kontaktpersonForNabovarselet: { title: "Kontaktperson" },
        naboGjenboerEiendommer: { title: "Naboer og gjenboere" }
    },
    resourceValues: {
        data: {
            metadata: { prosjektnavn: "Nytt bygg" },
            ansvarligSoeker: { navn: "Firma AS", organisasjonsnummer: "912345678" },
            eiendomByggested: { eiendom: [{ adresse: "Storgata 1" }] },
            soeknadGjelder: {
                type: { kode: ["nybygg"] },
                bruk: { tiltaksformaal: { kode: ["bolig"] }, beskrivPlanlagtFormaal: "Enebolig" },
                foelgebrev: "Se vedlegg"
            },
            planer: {
                gjeldendePlan: { navn: "Reguleringsplan sør", plantype: { kodebeskrivelse: "Reguleringsplan" } },
                andrePlaner: { plan: [{ navn: "Kommuneplan" }] }
            },
            dispensasjonOversikt: [{ type: "Avstand" }],
            kontaktpersonForNabovarselet: { navn: "Ola Nordmann" },
            naboGjenboerEiendommer: { naboGjenboerEiendom: [{ adresse: "Storgata 3" }] }
        }
    }
};

/** The custom element a renderer produced, unwrapped from the grid container some of them add. */
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
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("the notice headers", () => {
    it("renders the notice header at h1 unless told otherwise", () => {
        expect(attributes(renderGjenpartNabovarselHeader(component))).toMatchObject({
            tagName: "custom-header-text",
            size: "h1",
            resourceBindings: { title: "Gjenpart av nabovarsel" }
        });
        expect(attributes(renderGjenpartNabovarselHeader(component, "h2")).size).toBe("h2");
    });

    it("renders the description as a paragraph rather than a heading", () => {
        expect(attributes(renderGjenpartNabovarselSubHeader(component))).toMatchObject({
            tagName: "custom-paragraph-text",
            resourceBindings: { title: "Kopi til nabo" },
            wrapped: true
        });
    });

    it("renders the section headers at the level their section sits at", () => {
        expect(attributes(renderDetErVarsletOmHeader(component))).toMatchObject({ tagName: "custom-header-text", size: "h2" });
        expect(attributes(renderDetErVarsletOmHeader(component, "h3")).size).toBe("h3");
        expect(attributes(renderPlanerGjeldendePlanHeaderElement(component))).toMatchObject({ tagName: "custom-header-text", size: "h3" });
    });
});

describe("who the notice is from", () => {
    it("renders the responsible applicant when there is one", () => {
        expect(attributes(renderSoekerElement(component))).toMatchObject({
            tagName: "custom-field-data",
            resourceBindings: { title: "Ansvarlig søker" },
            resourceValues: { data: "Firma AS (912345678)" }
        });
    });

    it("falls back to the developer when there is no responsible applicant", () => {
        // A self-builder notice names the tiltakshaver instead, and only one of the two is ever shown.
        const selvbygger = {
            ...component,
            resourceValues: { data: { tiltakshaver: { navn: "Kari Nordmann" } } }
        };

        expect(attributes(renderSoekerElement(selvbygger))).toMatchObject({
            resourceBindings: { title: "Tiltakshaver" },
            resourceValues: { data: "Kari Nordmann" }
        });
    });

    it("renders nothing at all when neither is named", () => {
        expect(renderSoekerElement({ resourceValues: { data: {} } })).toBeUndefined();
    });

    it("appends the organisation number to the name, and leaves it out when there is none", () => {
        const withoutOrgNr = { ...component, resourceValues: { data: { ansvarligSoeker: { navn: "Firma AS" } } } };

        expect(attributes(renderSoekerElement(component)).resourceValues).toEqual({ data: "Firma AS (912345678)" });
        expect(attributes(renderSoekerElement(withoutOrgNr)).resourceValues).toEqual({ data: "Firma AS" });
    });
});

describe("what the notice is about", () => {
    it("renders the property as a table at h2", () => {
        expect(attributes(renderEiendomByggestedElement(component))).toMatchObject({
            tagName: "custom-table-eiendom",
            size: "h2",
            hideIfEmpty: "true",
            wrapped: false,
            resourceValues: { data: [{ adresse: "Storgata 1" }] }
        });
    });

    it("renders the codes as lists and the free text as fields", () => {
        // The type and the purpose are code lists, so they render as lists even when a notice names only one.
        expect(attributes(renderSoeknadGjelderTypeElement(component))).toMatchObject({
            tagName: "custom-list-data",
            resourceValues: { data: ["nybygg"] }
        });
        expect(attributes(renderSoeknadGjelderBrukTiltaksformaalElement(component))).toMatchObject({
            tagName: "custom-list-data",
            resourceValues: { data: ["bolig"] }
        });
        expect(attributes(renderSoeknadGjelderBrukBeskrivPlanlagtFormaalElement(component)).resourceValues).toEqual({ data: "Enebolig" });
        expect(attributes(renderSoeknadGjelderFoelgebrevElement(component)).resourceValues).toEqual({ data: "Se vedlegg" });
    });

    it("renders the project name from metadata rather than the data root", () => {
        expect(attributes(renderMetadataProsjektnavn(component)).resourceValues).toEqual({ data: "Nytt bygg" });
    });
});

describe("the plans and the neighbours", () => {
    it("reads the current plan's name and type from their own nesting", () => {
        expect(attributes(renderPlanerGjeldendePlanNavnElement(component)).resourceValues).toEqual({ data: "Reguleringsplan sør" });
        // The plan type is shown by its description, not its code.
        expect(attributes(renderPlanerGjeldendePlanPlantypeElement(component)).resourceValues).toEqual({ data: "Reguleringsplan" });
    });

    it("renders the other plans as a table", () => {
        expect(attributes(renderPlanerAndrePlanerElement(component))).toMatchObject({
            tagName: "custom-table-plan",
            size: "h3",
            resourceValues: { data: [{ navn: "Kommuneplan" }] }
        });
    });

    it("renders the dispensations and the contact person as their own groups", () => {
        expect(attributes(renderDispensasjonOversiktElement(component))).toMatchObject({
            tagName: "custom-group-dispensasjon-oversikt",
            resourceValues: { data: [{ type: "Avstand" }] }
        });
        expect(attributes(renderKontaktpersonForNabovarseletElement(component))).toMatchObject({
            tagName: "custom-table-part",
            size: "h2",
            resourceValues: { data: { navn: "Ola Nordmann" } }
        });
    });

    it("renders the neighbours from the list nested inside their container", () => {
        expect(attributes(renderNaboGjenboerEiendom(component))).toMatchObject({
            tagName: "custom-grouplist-nabo-gjenboer-eiendom",
            size: "h2",
            resourceValues: { data: [{ adresse: "Storgata 3" }] }
        });
    });
});

describe("every renderer", () => {
    /** All of them except renderSoekerElement, which chooses between two and is covered on its own. */
    const renderers = {
        renderGjenpartNabovarselHeader,
        renderGjenpartNabovarselSubHeader,
        renderMetadataProsjektnavn,
        renderEiendomByggestedElement,
        renderDetErVarsletOmHeader,
        renderSoeknadGjelderTypeElement,
        renderSoeknadGjelderBrukTiltaksformaalElement,
        renderSoeknadGjelderBrukBeskrivPlanlagtFormaalElement,
        renderSoeknadGjelderFoelgebrevElement,
        renderPlanerGjeldendePlanHeaderElement,
        renderPlanerGjeldendePlanNavnElement,
        renderPlanerAndrePlanerElement,
        renderPlanerGjeldendePlanPlantypeElement,
        renderDispensasjonOversiktElement,
        renderKontaktpersonForNabovarseletElement,
        renderNaboGjenboerEiendom
    };

    it("renders something for a notice with no data at all", () => {
        // A notice can be opened before anything is filled in, and an empty section beats a broken page.
        for (const [name, render] of Object.entries(renderers)) {
            expect({ name, rendered: render({}) !== null }).toEqual({ name, rendered: true });
        }
    });

    it("marks everything it renders as a child component", () => {
        for (const [name, render] of Object.entries(renderers)) {
            expect({ name, isChild: attributes(render(component)).isChildComponent }).toEqual({ name, isChild: "true" });
        }
    });

    // There is deliberately no test for an absent component here. Most of these renderers throw on one, because they
    // reach for `component.resourceBindings` without a guard, but renderDispensasjonOversiktElement guards it and
    // renders anyway. That difference looks like an oversight rather than a decision, and pinning it would make it
    // harder to put right.
});
