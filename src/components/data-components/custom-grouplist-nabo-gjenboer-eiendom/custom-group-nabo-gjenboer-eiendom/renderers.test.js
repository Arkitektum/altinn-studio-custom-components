import * as renderers from "./renderers.js";

/** The resource bindings one neighbour's entry reads, including the texts the response line chooses between. */
const resourceBindings = {
    eiendom: { title: "Eiendom" },
    eier: { title: "Eier" },
    eierAdresse: { title: "Adresse" },
    responsNabovarselSendtVia: { title: "Sendt via" },
    responsNabovarselSendt: { title: "Varsel sendt" },
    responsErMerknadEllerSamtykkeMottatt: { title: "Respons", falseText: "Ingen respons" },
    responsErMerknadMottatt: { trueText: "Merknad mottatt" },
    responsErSamtykkeMottatt: { trueText: "Samtykke mottatt" },
    responsMerknadMottattDato: { title: "Merknad mottatt" },
    responsSamtykkeMottattDato: { title: "Samtykke mottatt" }
};

/** One neighbour, with whatever response the case under test needs. */
function neighbour(respons = {}) {
    return {
        resourceBindings,
        resourceValues: {
            data: {
                eiendommer: { eiendom: [{ adresse: "Storgata 3" }] },
                eier: { navn: "Kari Nordmann", adresse: { adresselinje1: "Storgata 3" } },
                respons: { nabovarselSendtVia: { kodebeskrivelse: "Digitalt" }, nabovarselSendt: "2026-09-01", ...respons }
            }
        }
    };
}

/** The custom element a renderer produced, unwrapped from the container each of them adds. */
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
        format: read("format"),
        isChildComponent: read("ischildcomponent"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues")
    };
}

describe("the neighbour and the owner", () => {
    it("renders the properties as a table of their own", () => {
        expect(attributes(renderers.renderNaboGjenboerEiendomElement(neighbour()))).toMatchObject({
            tagName: "custom-table-nabo-gjenboer-eiendom",
            resourceValues: { data: [{ adresse: "Storgata 3" }] }
        });
    });

    it("renders the owner as a part, and the owner's address from within the owner", () => {
        expect(attributes(renderers.renderEierPartElement(neighbour()))).toMatchObject({
            tagName: "custom-table-part",
            resourceValues: { data: { navn: "Kari Nordmann", adresse: { adresselinje1: "Storgata 3" } } }
        });
        expect(attributes(renderers.renderEierAdresseElement(neighbour()))).toMatchObject({
            tagName: "custom-field-adresse",
            resourceValues: { data: { adresselinje1: "Storgata 3" } }
        });
    });
});

describe("how the notice was sent", () => {
    it("shows the channel by its description, not its code", () => {
        expect(attributes(renderers.renderResponsNabovarselSendtViaElement(neighbour())).resourceValues).toEqual({ data: "Digitalt" });
    });

    it("formats the date the notice went out as a date", () => {
        const rendered = renderers.renderResponsNabovarselSendtElement(neighbour());

        expect(attributes(rendered).resourceValues).toEqual({ data: "2026-09-01" });
        expect(attributes(rendered).format).toBe("date");
    });
});

describe("what the neighbour answered", () => {
    /** The text shown on the response line. Text resources are not loaded in a test, so a binding resolves to itself. */
    const responseText = (respons) => attributes(renderers.renderResponsErMerknadEllerSamtykkeMottattElement(neighbour(respons))).resourceValues;

    it("says nothing was received when neither a remark nor a consent was", () => {
        expect(responseText({})).toEqual({ data: "Ingen respons" });
    });

    it("names a remark, and names a consent, each by its own text", () => {
        expect(responseText({ erMerknadMottatt: true })).toEqual({ data: "Merknad mottatt" });
        expect(responseText({ erSamtykkeMottatt: true })).toEqual({ data: "Samtykke mottatt" });
    });

    it("says nothing at all when both were received", () => {
        // There is no text for that combination, so the line renders empty rather than picking one of the two.
        // Recorded as it stands: a neighbour who both consented and remarked shows no response text.
        expect(responseText({ erMerknadMottatt: true, erSamtykkeMottatt: true })).toBeNull();
    });
});

describe("when the neighbour answered", () => {
    /** The date line, which takes its title from whichever of the two was received. */
    const responseDate = (respons) => attributes(renderers.renderResponsSamtykkeEllerMerknadMottattElement(neighbour(respons)));

    it("shows the remark date under the remark's own title", () => {
        expect(responseDate({ erMerknadMottatt: true, merknadMottattDato: "2026-09-10" })).toMatchObject({
            format: "date",
            resourceBindings: { title: "Merknad mottatt" },
            resourceValues: { data: "2026-09-10" }
        });
    });

    it("shows the consent date under the consent's own title", () => {
        expect(responseDate({ erSamtykkeMottatt: true, samtykkeMottattDato: "2026-09-11" })).toMatchObject({
            resourceBindings: { title: "Samtykke mottatt" },
            resourceValues: { data: "2026-09-11" }
        });
    });

    it("shows no date when there was no response, and none when there were two", () => {
        expect(responseDate({}).resourceValues).toBeNull();
        expect(responseDate({ erMerknadMottatt: true, erSamtykkeMottatt: true }).resourceValues).toBeNull();
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        // This one is handed the text rather than a data object, which is why it reads resourceValues.data as a title.
        expect(attributes(renderers.renderEmptyFieldText({ resourceValues: { data: "Ingen naboer er varslet" } }))).toMatchObject({
            tagName: "custom-paragraph",
            resourceValues: { title: "Ingen naboer er varslet" }
        });
    });
});

describe("every renderer", () => {
    it("renders something for an entry with no data at all", () => {
        for (const [name, render] of Object.entries(renderers)) {
            expect({ name, rendered: render({}) !== null }).toEqual({ name, rendered: true });
        }
    });

    it("marks everything it renders as a child component", () => {
        for (const [name, render] of Object.entries(renderers)) {
            expect({ name, isChild: attributes(render(neighbour())).isChildComponent }).toEqual({ name, isChild: "true" });
        }
    });
});
