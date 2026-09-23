import * as renderers from "./renderers.js";

/** The notice of an exemption application, with everything its renderers read. */
const component = {
    resourceBindings: {
        dispensasjonsvarsel: { title: "Varsel om dispensasjon" },
        emne: { title: "Emne" },
        bestemmelse: { title: "Bestemmelse" },
        dispVarselBeskrivelse: { title: "Beskrivelse" },
        spoersmaalOmDispensasjonssoeknaden: { title: "Spørsmål om søknaden rettes til ansvarlig søker" }
    },
    resourceValues: {
        data: {
            dispensasjonstema: { kodebeskrivelse: "Avstand til nabogrense", kodeverdi: "AVSTAND" },
            annetTema: "Eget tema",
            plannavn: "Kommuneplan",
            paragrafnummer: "5",
            bestemmelsestype: { kodebeskrivelse: "Planbestemmelse" },
            bestemmelsesoverskrift: "Byggegrense",
            bestemmelsestekst: "Bebyggelse skal ligge minst fire meter fra nabogrense",
            dispVarselBeskrivelse: "Det søkes om å bygge nærmere grensen"
        }
    }
};

/** The custom element a renderer produced, unwrapped from the container when it added one. */
const element = (rendered) => (rendered.tagName === "DIV" ? rendered.firstChild.firstChild : rendered);

/** The attributes a custom element carries, with the JSON-valued ones parsed back. */
function attributes(rendered) {
    const target = element(rendered);
    const read = (name) => target.getAttribute(name);
    const readJson = (name) => (read(name) === null ? null : JSON.parse(read(name)));
    return {
        tagName: target.tagName.toLowerCase(),
        size: read("size"),
        isChildComponent: read("ischildcomponent"),
        hideIfEmpty: read("hideifempty"),
        hideTitle: read("hidetitle"),
        styleOverride: readJson("styleoverride"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("the headers", () => {
    it("puts the notice at h1 and the two sections under it at h2", () => {
        expect(attributes(renderers.renderDispensasjonsvarselHeader(component))).toMatchObject({
            tagName: "custom-header-text",
            size: "h1",
            resourceBindings: { title: "Varsel om dispensasjon" }
        });
        expect(attributes(renderers.renderBestemmelseHeader(component)).size).toBe("h2");
        expect(attributes(renderers.renderDispVarselBeskrivelseHeader(component)).size).toBe("h2");
    });

    it("lets a caller ask for another level on each of them", () => {
        expect(attributes(renderers.renderDispensasjonsvarselHeader(component, "h2")).size).toBe("h2");
        expect(attributes(renderers.renderBestemmelseHeader(component, "h3")).size).toBe("h3");
        expect(attributes(renderers.renderDispVarselBeskrivelseHeader(component, "h3")).size).toBe("h3");
    });

    it("names each title as a binding rather than handing over a finished string", () => {
        expect(attributes(renderers.renderBestemmelseHeader(component)).resourceBindings).toEqual({ title: "Bestemmelse" });
        expect(attributes(renderers.renderBestemmelseHeader(component)).resourceValues).toBeNull();
    });
});

describe("the subject of the exemption", () => {
    it("shows the subject from the code list by its description", () => {
        expect(attributes(renderers.renderEmne(component))).toMatchObject({
            tagName: "custom-field-data",
            hideIfEmpty: "true",
            resourceBindings: { title: "Emne" },
            resourceValues: { data: "Avstand til nabogrense" }
        });
    });

    it("shows the freely written subject instead when the provision is not one the code list covers", () => {
        // Other planning provisions and other acts are not in the code list, so the subject was typed in by hand.
        expect(attributes(renderers.renderEmne({ ...component, isAndrePlanbestemmelser: true })).resourceValues).toEqual({
            data: "Eget tema"
        });
        expect(attributes(renderers.renderEmne({ ...component, isAnnetLovForskrift: true })).resourceValues).toEqual({ data: "Eget tema" });
    });
});

describe("the provision being departed from", () => {
    it("titles the field with the kind of provision it is", () => {
        // The kind comes from the data rather than from a binding, since it names what is being shown.
        expect(attributes(renderers.renderPlannavnParagrafnummer(component)).resourceBindings).toEqual({ title: "Planbestemmelse" });
    });

    it("names the plan alongside the section number for a provision that belongs to a plan", () => {
        expect(attributes(renderers.renderPlannavnParagrafnummer({ ...component, isPlanBestemmelsesType: true })).resourceValues).toEqual({
            data: "Kommuneplan 5"
        });
    });

    it("shows the section number alone for a provision that belongs to an act", () => {
        // An act is already named by the heading above, so repeating it in every row would only add noise.
        expect(attributes(renderers.renderPlannavnParagrafnummer(component)).resourceValues).toEqual({ data: "5" });
    });
});

describe("the text of the provision", () => {
    it("shows the provision's own heading above its text, both taken from the data", () => {
        expect(attributes(renderers.renderBestemmelsestekst(component))).toMatchObject({
            tagName: "custom-field-data",
            hideIfEmpty: "true",
            resourceValues: {
                title: "Byggegrense",
                data: "Bebyggelse skal ligge minst fire meter fra nabogrense"
            }
        });
    });
});

describe("the description of what is being applied for", () => {
    it("shows the description with no title of its own", () => {
        // The section heading above it already says what it is.
        expect(attributes(renderers.renderDispVarselBeskrivelse(component))).toMatchObject({
            hideTitle: "true",
            resourceValues: { data: "Det søkes om å bygge nærmere grensen" }
        });
    });
});

describe("where to send questions", () => {
    it("renders the line in bold, since it tells the reader what to do next", () => {
        expect(attributes(renderers.renderSpoersmaalOmDispensasjonssoeknaden(component))).toMatchObject({
            tagName: "custom-paragraph-text",
            styleOverride: { fontWeight: "600" },
            resourceBindings: { title: "Spørsmål om søknaden rettes til ansvarlig søker" }
        });
    });

    it("carries no data, being wording that stands on its own", () => {
        expect(attributes(renderers.renderSpoersmaalOmDispensasjonssoeknaden(component)).resourceValues).toBeNull();
    });
});

describe("every renderer", () => {
    it("renders something for a component with no data at all", () => {
        for (const [name, render] of Object.entries(renderers)) {
            expect({ name, rendered: render({}) !== null }).toEqual({ name, rendered: true });
        }
    });

    it("renders without a component at all rather than throwing", () => {
        for (const [name, render] of Object.entries(renderers)) {
            expect({ name, rendered: render(undefined) !== undefined }).toEqual({ name, rendered: true });
        }
    });

    it("marks everything it renders as a child component", () => {
        for (const [name, render] of Object.entries(renderers)) {
            expect({ name, isChild: attributes(render(component)).isChildComponent }).toEqual({ name, isChild: "true" });
        }
    });
});
