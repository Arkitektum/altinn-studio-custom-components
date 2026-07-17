import { customElementTagNames } from "@arkitektum/altinn-studio-custom-components-utils";

import { componentMap, getComponentForTagName, instantiateComponent } from "./componentHelpers.js";

/**
 * The `custom-component` key is the internal base/fallback and is intentionally not part of the public tag allow-list.
 */
const FALLBACK_TAG_NAME = "custom-component";

describe("componentMap registry sync", () => {
    const mappedTagNames = Object.keys(componentMap).filter((tagName) => tagName !== FALLBACK_TAG_NAME);

    it("maps exactly the tag names in the utils customElementTagNames allow-list", () => {
        // This guards against drift between the runtime registry in this repo and the createCustomElement
        // allow-list published from @arkitektum/...-utils. A mismatch means either a tag the DOM can render
        // cannot be instantiated, or a tag we can instantiate that createCustomElement will reject at runtime.
        expect([...mappedTagNames].sort()).toEqual([...customElementTagNames].sort());
    });

    it("maps no tag name more than once and resolves every allow-listed tag to a class", () => {
        expect(mappedTagNames.length).toBe(new Set(mappedTagNames).size);
        customElementTagNames.forEach((tagName) => {
            expect(getComponentForTagName(tagName)).not.toBeNull();
        });
    });

    it("returns the fallback class for the internal custom-component tag and null for unknown tags", () => {
        expect(getComponentForTagName(FALLBACK_TAG_NAME)).toBe(componentMap[FALLBACK_TAG_NAME]);
        expect(getComponentForTagName("custom-does-not-exist")).toBeNull();
    });
});

describe("getComponentForTagName", () => {
    it("is case-insensitive", () => {
        expect(getComponentForTagName("CUSTOM-FIELD")).toBe(getComponentForTagName("custom-field"));
    });
});

describe("instantiateComponent", () => {
    it("instantiates the mapped class from a props object", () => {
        const instance = instantiateComponent({ tagName: "custom-field" });
        expect(instance).toBeInstanceOf(getComponentForTagName("custom-field"));
    });

    it("falls back to custom-component when no tagName is provided", () => {
        const instance = instantiateComponent({});
        expect(instance).toBeInstanceOf(componentMap[FALLBACK_TAG_NAME]);
    });

    it("returns null and warns for an unknown tag name", () => {
        const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
        expect(instantiateComponent({ tagName: "custom-does-not-exist" })).toBeNull();
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });
});
