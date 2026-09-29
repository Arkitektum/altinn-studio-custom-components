import * as renderers from "./renderers.ts";
import type { InstantiatedComponent } from "../../../types.ts";

/** The invoice recipient, as the component class has already assembled it. Every value differs, so a renderer
 * reading the wrong property cannot pass. */
const component = {
    resourceBindings: {
        navn: { title: "Navn", emptyFieldText: "Navn mangler" },
        adresse: { title: "Adresse" },
        organisasjonsnummer: { title: "Organisasjonsnummer", emptyFieldText: "Organisasjonsnummer mangler" },
        bestillerreferanse: { title: "Bestillerreferanse", emptyFieldText: "Bestillerreferanse mangler" },
        fakturareferanse: { title: "Fakturareferanse", emptyFieldText: "Fakturareferanse mangler" },
        prosjektnummer: { title: "Prosjektnummer", emptyFieldText: "Prosjektnummer mangler" },
        epost: { title: "E-post", emptyFieldText: "E-post mangler" }
    },
    resourceValues: {
        data: {
            navn: "Testbedrift AS",
            adresse: { adresselinje1: "Storgata 1", poststed: "Oslo" },
            organisasjonsnummer: "987654321",
            bestillerreferanse: "Bestilt av Kari",
            fakturareferanse: "Faktura 2024-17",
            prosjektnummer: 4711,
            epost: "faktura@testbedrift.no"
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
        isChildComponent: read("ischildcomponent"),
        hideIfEmpty: read("hideifempty"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("the header", () => {
    it("takes the title it is given and sits at h2 unless a level is asked for", () => {
        expect(attributes(renderers.renderHeaderElement("Fakturaadresse for tiltakshaver"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h2",
            resourceValues: { title: "Fakturaadresse for tiltakshaver" }
        });
        expect(attributes(renderers.renderHeaderElement("Fakturaadresse for tiltakshaver", "h3")).size).toBe("h3");
    });
});

describe("the address", () => {
    it("hands the address object to the component that knows how to lay it out", () => {
        expect(attributes(renderers.renderAdresseElement(component))).toMatchObject({
            tagName: "custom-field-adresse",
            hideIfEmpty: "true",
            wrapped: true,
            resourceBindings: { title: "Adresse" },
            resourceValues: { data: component.resourceValues.data.adresse }
        });
    });

    it("leaves the empty field text to the address component rather than passing one", () => {
        expect(attributes(renderers.renderAdresseElement(component)).resourceBindings.emptyFieldText).toBeUndefined();
    });
});

describe("each text field", () => {
    /** Which renderer reads which property, and which binding names it. */
    const fields: [string, (component?: InstantiatedComponent | null) => HTMLElement, string, unknown][] = [
        ["navn", renderers.renderNavnElement, "Navn", "Testbedrift AS"],
        ["organisasjonsnummer", renderers.renderOrganisasjonsnummerElement, "Organisasjonsnummer", "987654321"],
        ["bestillerreferanse", renderers.renderBestillerreferanseElement, "Bestillerreferanse", "Bestilt av Kari"],
        ["fakturareferanse", renderers.renderFakturareferanseElement, "Fakturareferanse", "Faktura 2024-17"],
        ["prosjektnummer", renderers.renderProsjektnummerElement, "Prosjektnummer", 4711],
        ["epost", renderers.renderEpostElement, "E-post", "faktura@testbedrift.no"]
    ];

    it.each(fields)("renders %s with its own title and value", (property, render, title, value) => {
        expect(attributes(render(component))).toMatchObject({
            tagName: "custom-field-data",
            hideIfEmpty: "true",
            wrapped: true,
            resourceBindings: { title, emptyFieldText: `${title} mangler` },
            resourceValues: { data: value }
        });
    });

    it.each(fields)("passes nothing on for %s when the recipient has no such value", (property, render) => {
        expect(attributes(render({ resourceBindings: component.resourceBindings, resourceValues: { data: {} } })).resourceValues).toBeNull();
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderers.renderEmptyFieldText({ resourceValues: { data: "Ikke oppgitt" } }))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Ikke oppgitt" }
        });
    });
});

describe("every renderer", () => {
    const fromComponent: Record<string, (component?: unknown) => HTMLElement> = Object.fromEntries(
        Object.entries(renderers).filter(([name]) => name !== "renderHeaderElement")
    ) as Record<string, (component?: unknown) => HTMLElement>;

    it("renders something for a component with no data at all", () => {
        for (const [name, render] of Object.entries(fromComponent)) {
            expect({ name, rendered: render({}) !== null }).toEqual({ name, rendered: true });
        }
    });

    it("renders without a component at all rather than throwing", () => {
        for (const [name, render] of Object.entries(fromComponent)) {
            expect({ name, rendered: render(undefined) !== undefined }).toEqual({ name, rendered: true });
        }
    });

    it("marks everything it renders as a child component", () => {
        for (const [name, render] of Object.entries(fromComponent)) {
            expect({ name, isChild: attributes(render(component)).isChildComponent }).toEqual({ name, isChild: "true" });
        }
        expect(attributes(renderers.renderHeaderElement("Fakturaadresse for tiltakshaver")).isChildComponent).toBe("true");
    });
});
