import { renderAnsvarsomraadeType, renderEmptyFieldText, renderHeaderElement } from "./renderers.js";

/** The list of areas of responsibility, keyed by the kind of responsibility. */
const component = {
    resourceBindings: {
        tiltaksklasse: { title: "Tiltaksklasse" },
        ansvarsomraade: { title: "Ansvarsområde" },
        foretak: { title: "Foretak" },
        ansvarsomraadeStatus: { title: "Status" }
    },
    resourceValues: { data: { PROSJEKTERING: [{ funksjon: { kodebeskrivelse: "Prosjekterende", kodeverdi: "PRO" } }] } }
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
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

/** The title the list works out for a group, given the function its first entry carries. */
const titleFor = (funksjon) =>
    attributes(renderAnsvarsomraadeType({ resourceValues: { data: { K: [{ funksjon }] } } }, "K")).resourceValues.title;

describe("the header", () => {
    it("takes the title it is given and sits at h2 unless a level is asked for", () => {
        expect(attributes(renderHeaderElement("Ansvarsområder"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h2",
            resourceValues: { title: "Ansvarsområder" }
        });
        expect(attributes(renderHeaderElement("Ansvarsområder", "h3")).size).toBe("h3");
    });
});

describe("one kind of responsibility", () => {
    it("renders the entries of that kind as a table, at h4", () => {
        expect(attributes(renderAnsvarsomraadeType(component, "PROSJEKTERING"))).toMatchObject({
            tagName: "custom-table-ansvarsomraade",
            size: "h4",
            hideIfEmpty: "true",
            hideTitle: null,
            wrapped: false,
            resourceValues: { data: component.resourceValues.data.PROSJEKTERING }
        });
    });

    it("passes down the bindings for every column the table may show", () => {
        expect(attributes(renderAnsvarsomraadeType(component, "PROSJEKTERING")).resourceBindings).toEqual(component.resourceBindings);
    });
});

describe("the title of a group", () => {
    it("is taken from the first entry, since every entry in the group shares its function", () => {
        expect(titleFor({ kodebeskrivelse: "Prosjekterende", kodeverdi: "PRO" })).toBe("Prosjekterende (PRO)");
    });

    it("falls back to whichever of the description and the code is there", () => {
        expect(titleFor({ kodebeskrivelse: "Prosjekterende" })).toBe("Prosjekterende");
        expect(titleFor({ kodeverdi: "PRO" })).toBe("PRO");
    });

    it("says the function is unknown rather than leaving the group unlabelled", () => {
        expect(titleFor({})).toBe("Ukjent funksjon");
        expect(titleFor(undefined)).toBe("Ukjent funksjon");
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderEmptyFieldText({ resourceValues: { data: "Ingen ansvarsområder" } }))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Ingen ansvarsområder" }
        });
    });
});

describe("every renderer", () => {
    it("marks everything it renders as a child component", () => {
        const rendered = {
            renderHeaderElement: renderHeaderElement("Ansvarsområder"),
            renderAnsvarsomraadeType: renderAnsvarsomraadeType(component, "PROSJEKTERING"),
            renderEmptyFieldText: renderEmptyFieldText(component)
        };
        for (const [name, element] of Object.entries(rendered)) {
            expect({ name, isChild: attributes(element).isChildComponent }).toEqual({ name, isChild: "true" });
        }
    });

    it("renders a group whose entries are empty rather than throwing", () => {
        // An entry list can arrive empty, and there is then no first entry to take a title from.
        expect(attributes(renderAnsvarsomraadeType({ resourceValues: { data: { K: [] } } }, "K")).resourceValues).toEqual({
            data: [],
            title: "Ukjent funksjon"
        });
    });
});
