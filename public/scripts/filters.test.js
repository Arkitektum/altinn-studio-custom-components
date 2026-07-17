import {
    filterComponentsByApplication,
    filterComponentsByTextInput,
    filterComponentsByType,
    filterComponentsByUsage,
    filterResources,
    filterResourcesByApplication,
    filterTextResourcesByTextInput,
    getComponentType,
    getResourcesWithSameValue
} from "./filters";

describe("filterResources", () => {
    const resources = [
        {
            usage: [],
            missingFromDefaultTextResources: false,
            presence: "present",
            resource: { values: { nb: "Hei", nn: "Hei", en: "Hello" }, id: "id1" }
        },
        {
            usage: [{}],
            missingFromDefaultTextResources: false,
            presence: "present",
            resource: { values: { nb: "Hallo", nn: "Hallo", en: "Hello" }, id: "id2" }
        },
        {
            usage: [{}],
            missingFromDefaultTextResources: false,
            presence: "present",
            resource: { values: { nb: "Hei", nn: "Hei", en: "Hello" }, id: "id3" }
        },
        { usage: [], missingFromDefaultTextResources: true, presence: "present", resource: { values: { nb: "Unused", nn: "", en: "" }, id: "id4" } },
        { usage: [{}], missingFromDefaultTextResources: false, presence: "missing", resource: { values: { nb: "", nn: "", en: "" }, id: "id5" } },
        {
            usage: [{}],
            missingFromDefaultTextResources: false,
            presence: "localValue",
            resource: { values: { nb: "Lokal", nn: "", en: "" }, id: "id6" }
        },
        { usage: [{}], missingFromDefaultTextResources: false, presence: "present", resource: { values: { nb: "", nn: "", en: "" }, id: "id7" } }
    ];

    it("filters unused resources", () => {
        const result = filterResources(resources, "unused");
        expect(result).toHaveLength(1);
        expect(result[0].resource.id).toBe("id1");
    });

    it("filters used-once resources", () => {
        const result = filterResources(resources, "used-once");
        expect(result.some((r) => r.resource.id === "id2")).toBe(true);
    });

    it("filters with-duplicates", () => {
        const result = filterResources(resources, "with-duplicates");
        expect(result.some((r) => r.resource.id === "id1")).toBe(true);
        expect(result.some((r) => r.resource.id === "id3")).toBe(true);
    });

    it("filters missing", () => {
        const result = filterResources(resources, "missing");
        expect(result).toHaveLength(1);
        expect(result[0].resource.id).toBe("id5");
    });

    it("filters missing-with-local-value", () => {
        const result = filterResources(resources, "missing-with-local-value");
        expect(result).toHaveLength(1);
        expect(result[0].resource.id).toBe("id6");
    });

    it("filters missing-nb-translations", () => {
        const result = filterResources(resources, "missing-nb-translations");
        expect(result.some((r) => r.resource.id === "id7")).toBe(true);
    });

    it("filters missing-nn-translations", () => {
        const result = filterResources(resources, "missing-nn-translations");
        expect(result.some((r) => r.resource.id === "id7")).toBe(true);
    });

    it("filters missing-en-translations", () => {
        const result = filterResources(resources, "missing-en-translations");
        expect(result.some((r) => r.resource.id === "id7")).toBe(true);
    });

    it("filters all", () => {
        const result = filterResources(resources, "all");
        expect(result.some((r) => r.resource.id === "id1")).toBe(true);
        expect(result.some((r) => r.resource.id === "id2")).toBe(true);
    });

    it("returns all resources for unknown filter", () => {
        const result = filterResources(resources, "unknown");
        expect(result).toHaveLength(resources.length);
    });
});

describe("filterResourcesByApplication", () => {
    const resources = [
        { usage: [{ appOwner: "Owner1", appName: "App1" }], resource: { id: "id1" } },
        { usage: [{ appOwner: "Owner2", appName: "App2" }], resource: { id: "id2" } },
        { usage: [{ appOwner: "Owner1", appName: "App1" }, { appOwner: "Owner2", appName: "App2" }], resource: { id: "id3" } },
        { usage: [{ appOwner: "Owner2", appName: "App1" }], resource: { id: "id5" } },
        { usage: [], resource: { id: "id4" } }
    ];

    it("filters by application owner and name", () => {
        const result = filterResourcesByApplication(resources, "Owner1", "App1");
        expect(result.map((r) => r.resource.id)).toEqual(["id1", "id3"]);
    });

    it("does not match a same-named app under a different owner", () => {
        const result = filterResourcesByApplication(resources, "Owner1", "App1");
        expect(result.map((r) => r.resource.id)).not.toContain("id5");
    });

    it("returns all if owner and name are falsy", () => {
        const result = filterResourcesByApplication(resources, "", "");
        expect(result).toHaveLength(resources.length);
    });
});

describe("filterTextResourcesByTextInput", () => {
    const resources = [
        { resource: { id: "greeting", values: { nb: "Hei", en: "Hello" } } },
        { resource: { id: "farewell", values: { nb: "Ha det", en: "Goodbye" } } },
        { resource: { id: "welcome", values: { nb: "Velkommen", en: "Welcome" } } }
    ];

    it("filters by id", () => {
        const result = filterTextResourcesByTextInput(resources, "greet", "id");
        expect(result).toHaveLength(1);
        expect(result[0].resource.id).toBe("greeting");
    });

    it("filters by value", () => {
        const result = filterTextResourcesByTextInput(resources, "good", "value");
        expect(result).toHaveLength(1);
        expect(result[0].resource.id).toBe("farewell");
    });

    it("returns all if textFilter is empty", () => {
        const result = filterTextResourcesByTextInput(resources, "", "id");
        expect(result).toHaveLength(resources.length);
    });
});

describe("getResourcesWithSameValue", () => {
    const resources = [
        { resource: { id: "id1", values: { nb: "Hei" } }, missingFromDefaultTextResources: false },
        { resource: { id: "id2", values: { nb: "Hallo" } }, missingFromDefaultTextResources: false },
        { resource: { id: "id3", values: { nb: "Hei" } }, missingFromDefaultTextResources: false },
        { resource: { id: "id4", values: { nb: "Hei" } }, missingFromDefaultTextResources: true }
    ];

    it("finds resources with same nb value and different id", () => {
        const result = getResourcesWithSameValue(resources, resources[0]);
        expect(result.map((r) => r.resource.id)).toContain("id3");
        expect(result.map((r) => r.resource.id)).not.toContain("id1");
        expect(result.map((r) => r.resource.id)).not.toContain("id4");
    });

    it("returns empty array if no matches", () => {
        const result = getResourcesWithSameValue(resources, resources[1]);
        expect(result).toHaveLength(0);
    });

    it("returns empty array if resources is empty", () => {
        const result = getResourcesWithSameValue([], resources[0]);
        expect(result).toEqual([]);
    });
});

describe("getComponentType", () => {
    it("categorizes base, layout and data components", () => {
        expect(getComponentType("custom-field")).toBe("base");
        expect(getComponentType("custom-table")).toBe("base");
        expect(getComponentType("custom-dispensasjon")).toBe("layout");
        expect(getComponentType("custom-gjenpart-nabovarsel")).toBe("layout");
        expect(getComponentType("custom-field-data")).toBe("data");
        expect(getComponentType("custom-table-part")).toBe("data");
    });

    it("treats unknown tag names as data", () => {
        expect(getComponentType("something-unknown")).toBe("data");
        expect(getComponentType(undefined)).toBe("data");
    });
});

describe("filterComponentsByUsage", () => {
    const components = [
        { tagName: "custom-field", usages: [] },
        { tagName: "custom-header", usages: [{ id: "a" }] },
        { tagName: "custom-table", usages: [{ id: "b" }, { id: "c" }] }
    ];

    it("returns unused components", () => {
        expect(filterComponentsByUsage(components, "unused").map((c) => c.tagName)).toEqual(["custom-field"]);
    });

    it("returns components used exactly once", () => {
        expect(filterComponentsByUsage(components, "used-once").map((c) => c.tagName)).toEqual(["custom-header"]);
    });

    it("returns all components for 'all' or unknown", () => {
        expect(filterComponentsByUsage(components, "all")).toHaveLength(components.length);
        expect(filterComponentsByUsage(components, "whatever")).toHaveLength(components.length);
    });
});

describe("filterComponentsByApplication", () => {
    const components = [
        { tagName: "custom-field", usages: [{ appOwner: "Owner1", appName: "App1" }] },
        { tagName: "custom-header", usages: [{ appOwner: "Owner2", appName: "App1" }] },
        { tagName: "custom-table", usages: [{ appOwner: "Owner1", appName: "App1" }, { appOwner: "Owner2", appName: "App2" }] },
        { tagName: "custom-list", usages: [] }
    ];

    it("filters by owner and name and does not collide on same name", () => {
        const result = filterComponentsByApplication(components, "Owner1", "App1");
        expect(result.map((c) => c.tagName)).toEqual(["custom-field", "custom-table"]);
    });

    it("returns all when owner and name are falsy", () => {
        expect(filterComponentsByApplication(components, "", "")).toHaveLength(components.length);
    });
});

describe("filterComponentsByType", () => {
    const components = [
        { tagName: "custom-field", usages: [] },
        { tagName: "custom-field-data", usages: [] },
        { tagName: "custom-dispensasjon", usages: [] }
    ];

    it("filters by category", () => {
        expect(filterComponentsByType(components, "base").map((c) => c.tagName)).toEqual(["custom-field"]);
        expect(filterComponentsByType(components, "data").map((c) => c.tagName)).toEqual(["custom-field-data"]);
        expect(filterComponentsByType(components, "layout").map((c) => c.tagName)).toEqual(["custom-dispensasjon"]);
    });

    it("returns all when type is falsy", () => {
        expect(filterComponentsByType(components, "")).toHaveLength(components.length);
    });
});

describe("filterComponentsByTextInput", () => {
    const components = [
        { tagName: "custom-field", usages: [{ id: "firstName" }] },
        { tagName: "custom-table", usages: [{ id: "personTable" }] }
    ];

    it("matches by tag name", () => {
        expect(filterComponentsByTextInput(components, "table", "tag").map((c) => c.tagName)).toEqual(["custom-table"]);
    });

    it("matches by usage id", () => {
        expect(filterComponentsByTextInput(components, "firstname", "id").map((c) => c.tagName)).toEqual(["custom-field"]);
    });

    it("returns all when the text filter is empty", () => {
        expect(filterComponentsByTextInput(components, "", "tag")).toHaveLength(components.length);
    });
});
