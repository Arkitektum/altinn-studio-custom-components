import { renderUtfallSvarType } from "./renderers.ts";

/** One answer, as the group below this one will receive it. */
const utfallSvar = { beskrivelse: "Send inn situasjonsplan", tema: { kodebeskrivelse: "Plan" } };

/** The list component, holding its answers keyed by type. */
const component = {
    enableLinks: true,
    resourceBindings: {
        tilleggsopplysninger: { title: "Tilleggsopplysninger" },
        kommentar: { title: "Kommentar" },
        tema: { title: "Tema" },
        utfallSvarStatus: { title: "Status" },
        vedleggsliste: { title: "Vedlegg" }
    },
    resourceValues: { data: { TilleggsOpplysninger: [utfallSvar] } }
};

/** The attributes a custom element carries, with the JSON-valued ones parsed back. */
function attributes(element: HTMLElement) {
    const read = (name: string) => element.getAttribute(name);
    const readJson = (name: string) => (read(name) === null ? null : JSON.parse(read(name)!));
    return {
        tagName: element.tagName.toLowerCase(),
        isChildComponent: read("ischildcomponent"),
        hideIfEmpty: read("hideifempty"),
        enableLinks: read("enablelinks"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues")
    };
}

describe("rendering one type of answer", () => {
    it("hands the answers of that type to the group below, unwrapped", () => {
        expect(attributes(renderUtfallSvarType(component, "TilleggsOpplysninger"))).toMatchObject({
            tagName: "custom-group-utfall-svar-type",
            isChildComponent: "true",
            hideIfEmpty: "true",
            resourceValues: { data: [utfallSvar] }
        });
    });

    it("finds the type's title under the lower-cased key, though the data key keeps its casing", () => {
        // The data is keyed as the model spells it, the text resources are keyed in lower case, and this is
        // what bridges the two.
        expect(attributes(renderUtfallSvarType(component, "TilleggsOpplysninger")).resourceBindings.title).toBe("Tilleggsopplysninger");
    });

    it("passes the shared bindings down untouched, so every answer is labelled the same way", () => {
        expect(attributes(renderUtfallSvarType(component, "TilleggsOpplysninger")).resourceBindings).toEqual({
            title: "Tilleggsopplysninger",
            kommentar: { title: "Kommentar" },
            tema: { title: "Tema" },
            utfallSvarStatus: { title: "Status" },
            vedleggsliste: { title: "Vedlegg" }
        });
    });

    it("carries the link setting down, since answers may hold links", () => {
        expect(attributes(renderUtfallSvarType(component, "TilleggsOpplysninger")).enableLinks).toBe("true");
        expect(attributes(renderUtfallSvarType({ ...component, enableLinks: false }, "TilleggsOpplysninger")).enableLinks).toBeNull();
    });

    it("renders a type with no title binding rather than nothing", () => {
        // A type the text resources do not name still has answers worth showing.
        expect(attributes(renderUtfallSvarType(component, "Ukjent")).resourceBindings.title).toBeUndefined();
    });
});
