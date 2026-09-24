import * as adkomstRenderers from "../custom-group-adkomst/renderers.ts";
import * as avloepRenderers from "../custom-group-avloep/renderers.ts";
import * as overvannRenderers from "../custom-group-overvann/renderers.js";
import * as renderers from "./renderers.js";
import * as vannforsyningRenderers from "../custom-group-vannforsyning/renderers.js";

/**
 * The four connections, with bindings named the way this group holds them: each prefixed by the connection it
 * belongs to, since they all sit side by side here.
 */
const component = {
    resourceBindings: {
        adkomst: { title: "Adkomst" },
        adkomstErNyEllerEndretAdkomst: { title: "Ny eller endret adkomst" },
        adkomstVegtype: { title: "Vegtype" },
        adkomstErTillatelseGitt: { title: "Er tillatelse gitt" },
        avloep: { title: "Avløp" },
        avloepHarTinglystErklaering: { title: "Tinglyst erklæring for avløp" },
        avloepKrysserAvloepAnnensGrunn: { title: "Avløp krysser annens grunn" },
        avloepTilknytningstype: { title: "Tilknytningstype for avløp" },
        avloepSkalInstallereVannklosett: { title: "Skal installere vannklosett" },
        avloepHarUtslippstillatelse: { title: "Har utslippstillatelse" },
        overvann: { title: "Overvann" },
        overvannLedesOvervannTilAvloepssystem: { title: "Ledes til avløpssystem" },
        overvannLedesOvervannTilTerreng: { title: "Ledes til terreng" },
        vannforsyning: { title: "Vannforsyning" },
        vannforsyningBeskrivelse: { title: "Beskrivelse av vannforsyning" },
        vannforsyningHarTinglystErklaering: { title: "Tinglyst erklæring for vannforsyning" },
        vannforsyningKrysserVannforsyningAnnensGrunn: { title: "Vannforsyning krysser annens grunn" },
        vannforsyningTilknytningstype: { title: "Tilknytningstype for vann" }
    },
    resourceValues: {
        data: {
            adkomst: { erNyEllerEndretAdkomst: true },
            avloep: { tilknytningstype: { kodebeskrivelse: "Offentlig" } },
            overvann: { ledesOvervannTilTerreng: true },
            vannforsyning: { beskrivelse: "Egen brønn" }
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
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

/** What one of the four connection renderers produced, as a component its own group could be handed. */
const handOver = (render) => {
    const rendered = attributes(render(component));
    return { resourceBindings: rendered.resourceBindings, resourceValues: rendered.resourceValues };
};

describe("the header", () => {
    it("takes the title it is given and sits at h2 unless a level is asked for", () => {
        expect(attributes(renderers.renderHeaderElement("Tilknytninger"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h2",
            resourceValues: { title: "Tilknytninger" }
        });
        expect(attributes(renderers.renderHeaderElement("Tilknytninger", "h3")).size).toBe("h3");
    });
});

describe("the four connections", () => {
    const connections = [
        ["renderAdkomstElement", "custom-group-adkomst", "adkomst"],
        ["renderAvloepElement", "custom-group-avloep", "avloep"],
        ["renderOvervannElement", "custom-group-overvann", "overvann"],
        ["renderVannforsyningElement", "custom-group-vannforsyning", "vannforsyning"]
    ];

    it.each(connections)("%s renders %s with its own slice of the data", (name, tagName, key) => {
        expect(attributes(renderers[name](component))).toMatchObject({
            tagName,
            hideIfEmpty: "true",
            wrapped: false,
            resourceValues: { data: component.resourceValues.data[key] },
            resourceBindings: { title: component.resourceBindings[key].title }
        });
    });
});

describe("the prefixed bindings", () => {
    it("strips the connection's name off each binding on the way down", () => {
        // Every binding is prefixed here because the four connections sit side by side, and each group below
        // knows its own fields only by their short names.
        expect(attributes(renderers.renderAvloepElement(component)).resourceBindings).toEqual({
            title: "Avløp",
            harTinglystErklaering: { title: "Tinglyst erklæring for avløp" },
            krysserAvloepAnnensGrunn: { title: "Avløp krysser annens grunn" },
            tilknytningstype: { title: "Tilknytningstype for avløp" },
            skalInstallereVannklosett: { title: "Skal installere vannklosett" },
            harUtslippstillatelse: { title: "Har utslippstillatelse" }
        });
        expect(attributes(renderers.renderOvervannElement(component)).resourceBindings).toEqual({
            title: "Overvann",
            ledesOvervannTilAvloepssystem: { title: "Ledes til avløpssystem" },
            ledesOvervannTilTerreng: { title: "Ledes til terreng" }
        });
    });

    it("keeps the two connections that share field names apart", () => {
        // Both avløp and vannforsyning ask about a registered declaration, so the prefix is the only thing
        // telling the two bindings apart before they are handed down.
        expect(attributes(renderers.renderVannforsyningElement(component)).resourceBindings).toEqual({
            title: "Vannforsyning",
            beskrivelse: { title: "Beskrivelse av vannforsyning" },
            harTinglystErklaering: { title: "Tinglyst erklæring for vannforsyning" },
            krysserVannforsyningAnnensGrunn: { title: "Vannforsyning krysser annens grunn" },
            tilknytningstype: { title: "Tilknytningstype for vann" }
        });
    });
});

describe("what the groups below make of it", () => {
    // These read the renamed bindings back through the renderers that consume them, so a rename on either side
    // shows up here rather than as a field quietly losing its title in an app.

    it("gives the access group a title it can find", () => {
        const rendered = adkomstRenderers.renderErNyEllerEndretAdkomstElement(handOver(renderers.renderAdkomstElement));

        expect(JSON.parse(rendered.firstChild.firstChild.getAttribute("resourcebindings")).title).toBe("Ny eller endret adkomst");
    });

    it("gives the sewage group a title it can find", () => {
        const rendered = avloepRenderers.renderTilknytningstypeElement(handOver(renderers.renderAvloepElement));

        expect(JSON.parse(rendered.firstChild.firstChild.getAttribute("resourcebindings")).title).toBe("Tilknytningstype for avløp");
    });

    it("gives the surface water group a title it can find", () => {
        const rendered = overvannRenderers.renderLedesOvervannTilTerrengElement(handOver(renderers.renderOvervannElement));

        expect(JSON.parse(rendered.firstChild.firstChild.getAttribute("resourcebindings")).title).toBe("Ledes til terreng");
    });

    it("gives the water supply group a title it can find", () => {
        const rendered = vannforsyningRenderers.renderBeskrivelseElement(handOver(renderers.renderVannforsyningElement));

        expect(JSON.parse(rendered.firstChild.firstChild.getAttribute("resourcebindings")).title).toBe("Beskrivelse av vannforsyning");
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
    const fromComponent = Object.fromEntries(Object.entries(renderers).filter(([name]) => name !== "renderHeaderElement"));

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
        expect(attributes(renderers.renderHeaderElement("Tilknytninger")).isChildComponent).toBe("true");
    });
});
