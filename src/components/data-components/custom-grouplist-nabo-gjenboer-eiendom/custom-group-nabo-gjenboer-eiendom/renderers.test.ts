import * as renderers from "./renderers.ts";

/** The resource bindings one neighbour's entry reads, including the texts the status line chooses between. */
const resourceBindings = {
    eiendomMatrikkelinformasjon: { title: "Eiendom" },
    eiendomMatrikkelinformasjonAdresse: { title: "Adresse", emptyFieldText: "Ingen adresse" },
    eiendomMatrikkelinformasjonEiendomsidentifikasjonGaardsnummer: { title: "Gnr." },
    eiendomMatrikkelinformasjonEiendomsidentifikasjonBruksnummer: { title: "Bnr." },
    eiendomMatrikkelinformasjonEiendomsidentifikasjonSeksjonsnummer: { title: "Snr." },
    eiendomMatrikkelinformasjonEiendomsidentifikasjonFestenummer: { title: "Fnr." },
    eiendomMatrikkelinformasjonBolignummer: { title: "Bolignr." },
    eiendomMatrikkelinformasjonBygningsnummer: { title: "Bygningsnr." },
    eier: { title: "Eier" },
    responsNabovarselSendt: { title: "Varsel sendt" },
    responsErMerknadEllerSamtykkeMottatt: { title: "Status" },
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
        format: read("format"),
        hideIfEmpty: read("hideifempty"),
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

    it("hands the property table its title and column bindings under the names the table reads", () => {
        expect(attributes(renderers.renderNaboGjenboerEiendomElement(neighbour())).resourceBindings).toEqual({
            title: "Eiendom",
            adresse: { title: "Adresse", emptyFieldText: "Ingen adresse" },
            eiendomsidentifikasjonGaardsnummer: { title: "Gnr." },
            eiendomsidentifikasjonBruksnummer: { title: "Bnr." },
            eiendomsidentifikasjonSeksjonsnummer: { title: "Snr." },
            eiendomsidentifikasjonFestenummer: { title: "Fnr." },
            bolignummer: { title: "Bolignr." },
            bygningsnummer: { title: "Bygningsnr." }
        });
    });

    it("renders the owner by name alone, under the owner's title, handed the whole owner", () => {
        expect(attributes(renderers.renderEierNavnElement(neighbour()))).toMatchObject({
            tagName: "custom-field-part-navn",
            hideIfEmpty: "true",
            resourceBindings: { title: "Eier" },
            resourceValues: { data: { navn: "Kari Nordmann", adresse: { adresselinje1: "Storgata 3" } } }
        });
    });
});

describe("how and when the notice was sent", () => {
    /** The value on the "sent" line for a given response. */
    const sentText = (respons: Record<string, unknown>) =>
        attributes(renderers.renderResponsNabovarselSendtElement(neighbour(respons))).resourceValues;

    it("shows the channel by its description and the date it went out, on one line under the sent title", () => {
        expect(attributes(renderers.renderResponsNabovarselSendtElement(neighbour()))).toMatchObject({
            tagName: "custom-field-data",
            hideIfEmpty: "true",
            resourceBindings: { title: "Varsel sendt" },
            resourceValues: { data: "Digitalt, 01.09.2026" }
        });
    });

    it("hands the field nothing but its title", () => {
        expect(attributes(renderers.renderResponsNabovarselSendtElement(neighbour())).resourceBindings).toEqual({ title: "Varsel sendt" });
    });

    it("shows whichever of the two is there when the other is missing", () => {
        expect(sentText({ nabovarselSendt: undefined })).toEqual({ data: "Digitalt" });
        expect(sentText({ nabovarselSendtVia: undefined })).toEqual({ data: "01.09.2026" });
    });

    it("shows nothing, and hides, when neither is there", () => {
        expect(sentText({ nabovarselSendt: undefined, nabovarselSendtVia: undefined })).toBeNull();
    });
});

describe("what the neighbour answered, and when", () => {
    /** The status line for a given response. Text resources are not loaded in a test, so a binding resolves to itself. */
    const status = (respons: Record<string, unknown>) => attributes(renderers.renderResponsErMerknadEllerSamtykkeMottattElement(neighbour(respons)));

    it("names a remark with its date, and a consent with its date, under the status title", () => {
        expect(status({ erMerknadMottatt: true, merknadMottattDato: "2026-09-10", samtykkeMottattDato: "2026-09-11" })).toMatchObject({
            tagName: "custom-field-data",
            resourceBindings: { title: "Status" },
            resourceValues: { data: "Merknad mottatt 10.09.2026" }
        });
        expect(status({ erSamtykkeMottatt: true, merknadMottattDato: "2026-09-10", samtykkeMottattDato: "2026-09-11" }).resourceValues).toEqual({
            data: "Samtykke mottatt 11.09.2026"
        });
    });

    it("names the response alone when its date is missing", () => {
        expect(status({ erMerknadMottatt: true }).resourceValues).toEqual({ data: "Merknad mottatt" });
        expect(status({ erSamtykkeMottatt: true, erMerknadMottatt: false }).resourceValues).toEqual({ data: "Samtykke mottatt" });
    });

    it("shows nothing, and hides, when neither was received", () => {
        const rendered = status({ erMerknadMottatt: false, erSamtykkeMottatt: false, merknadMottattDato: "2026-09-10" });

        expect(rendered.hideIfEmpty).toBe("true");
        expect(rendered.resourceValues).toBeNull();
        expect(status({}).resourceValues).toBeNull();
    });

    it("shows nothing, and hides, when both were received", () => {
        expect(status({ erMerknadMottatt: true, erSamtykkeMottatt: true, merknadMottattDato: "2026-09-10" }).resourceValues).toBeNull();
    });

    it("counts only true as received, not a truthy string", () => {
        expect(status({ erMerknadMottatt: "true", merknadMottattDato: "2026-09-10" }).resourceValues).toBeNull();
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
