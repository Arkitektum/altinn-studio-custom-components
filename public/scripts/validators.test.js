import * as validators from "./validators";

describe("getMissingResourceBindings", () => {
    it("finds missing and literal resource bindings", () => {
        const allResourceBindings = ["id1", "id2", "literal value"];
        const textResources = { resources: [{ id: "id1" }] };
        const defaultTextResources = { resources: [{ id: "id3" }] };
        const result = validators.getMissingResourceBindings(allResourceBindings, textResources, defaultTextResources);
        expect(result.missingResourceBindings).toContain("id2");
        expect(result.literalValues).toContain("literal value");
    });
});

describe("getResourceBindingsFromComponent", () => {
    it("adds altinn textResourceBindings", () => {
        const set = new Set();
        const props = { textResourceBindings: { title: "id1", desc: "id2" } };
        validators.getResourceBindingsFromComponent(set, props, "altinn");
        expect(set.has("id1")).toBe(true);
        expect(set.has("id2")).toBe(true);
    });
});

describe("getResourceBindingsFromComponents", () => {
    it("adds from multiple components", () => {
        const set = new Set();
        const arr = [{ textResourceBindings: { title: "id1" } }, { textResourceBindings: { title: "id2" } }];
        validators.getResourceBindingsFromComponents(set, arr, "altinn");
        expect(set.has("id1")).toBe(true);
        expect(set.has("id2")).toBe(true);
    });
});

describe("getResourceBindingsFromLayout", () => {
    it("extracts from layout", () => {
        const set = new Set();
        const layout = { layout: { data: { layout: [{ textResourceBindings: { title: "id1" } }] } } };
        validators.getResourceBindingsFromLayout(set, layout, "altinn");
        expect(set.has("id1")).toBe(true);
    });
});

describe("getResourceBindingsWithUsageFromApplications", () => {
    it("extracts from applications", () => {
        const apps = [
            { layout: { data: { layout: [{ textResourceBindings: { title: "id1" } }] } } },
            { layout: { data: { layout: [{ textResourceBindings: { title: "id2" } }] } } }
        ];
        const set = validators.getResourceBindingsWithUsageFromApplications(apps, "altinn");
        expect(set.has("id1")).toBe(true);
        expect(set.has("id2")).toBe(true);
    });
});

describe("renderValidationMessages", () => {
    it("renders error, warning, info", () => {
        const validationResults = {
            missingResourceBindings: ["id1"],
            duplicateTextResources: ["id2"],
            unusedResourceBindings: ["id3"],
            literalValues: ["literal"],
            emptyTextResources: ["id4"]
        };
        const msg = validators.renderValidationMessages(validationResults);
        expect(msg.error.some((e) => e.includes("Missing resource: id1"))).toBe(true);
        expect(msg.error.some((e) => e.includes("Duplicate resource: id2"))).toBe(true);
        expect(msg.warning.some((e) => e.includes("Unused resource: id3"))).toBe(true);
        expect(msg.warning.some((e) => e.includes("Literal value: literal"))).toBe(true);
        expect(msg.info.some((e) => e.includes("Empty resource: id4"))).toBe(true);
    });
});

describe("resourceIsUsedInComponent", () => {
    it("returns true if resource is used in custom component", () => {
        const component = { tagName: "X", type: "Custom", resourceBindings: { a: "id1" } };
        const resource = { id: "id1" };
        expect(validators.resourceIsUsedInComponent(component, resource)).toBe(true);
    });
    it("returns false for non-custom", () => {
        const component = { tagName: "X", type: "Altinn", resourceBindings: { a: "id1" } };
        const resource = { id: "id1" };
        expect(validators.resourceIsUsedInComponent(component, resource)).toBe(false);
    });
});

describe("getResourceUsageForLayout", () => {
    it("returns components using resource", () => {
        const layout = { layout: { data: { layout: [{ tagName: "X", type: "Custom", resourceBindings: { a: "id1" } }] } } };
        const resource = { id: "id1" };
        const result = validators.getResourceUsageForLayout(layout, resource);
        expect(result.length).toBe(1);
    });
    it("returns empty if none use resource", () => {
        const layout = { layout: { data: { layout: [{ tagName: "X", type: "Custom", resourceBindings: { a: "id2" } }] } } };
        const resource = { id: "id1" };
        const result = validators.getResourceUsageForLayout(layout, resource);
        expect(result.length).toBe(0);
    });
});

describe("getResourceUsage", () => {
    it("returns usage across layouts", () => {
        const layouts = [
            { appOwner: "o", appName: "a", layout: { data: { layout: [{ tagName: "X", type: "Custom", resourceBindings: { a: "id1" } }] } } },
            { appOwner: "o", appName: "b", layout: { data: { layout: [{ tagName: "X", type: "Custom", resourceBindings: { a: "id2" } }] } } }
        ];
        const resource = { id: "id1" };
        const result = validators.getResourceUsage(layouts, resource);
        expect(result.length).toBe(1);
        expect(result[0].appName).toBe("a");
    });
});

describe("getUsageForResources", () => {
    it("returns usage for each resource", () => {
        const layouts = [
            { appOwner: "o", appName: "a", layout: { data: { layout: [{ tagName: "X", type: "Custom", resourceBindings: { a: "id1" } }] } } }
        ];
        const resources = [{ id: "id1" }, { id: "id2" }];
        const result = validators.getUsageForResources(layouts, resources);
        expect(result.length).toBe(2);
        expect(result[0].resource.id).toBe("id1");
        expect(Array.isArray(result[0].usage)).toBe(true);
    });
});

describe("getUsageForMissingResources", () => {
    it("returns missing usages and with local value", () => {
        const layouts = [
            { appOwner: "o", appName: "a", layout: { data: { layout: [{ tagName: "X", type: "Custom", resourceBindings: { a: "id1" } }] } } }
        ];
        const missingResourceBindings = ["id1"];
        const appResourceValues = [{ appName: "a", appOwner: "o", resourceValues: [{ id: "id1", values: { nb: "Hei" } }] }];
        const result = validators.getUsageForMissingResources(layouts, missingResourceBindings, appResourceValues);
        expect(Array.isArray(result.missingResourcesUsage)).toBe(true);
        expect(Array.isArray(result.missingResourcesWithLocalValueUsage)).toBe(true);
    });
});
