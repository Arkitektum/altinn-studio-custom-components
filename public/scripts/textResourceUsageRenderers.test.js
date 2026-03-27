import {
    renderDefaultTextResourceListItem,
    renderDefaultTextResourcesList,
    renderSelectApplicationFilterForTextResourcesList,
    renderTextInputFilterForTextResourcesList,
    renderUsageFilterForTextResourcesList
} from "./textResourceUsageRenderers";

describe("renderDefaultTextResourceListItem", () => {
    it("renders a resource with usage and values", () => {
        const textResource = {
            usage: [
                {
                    appOwner: "owner",
                    appName: "app",
                    componentsUsingResource: [
                        { id: "comp1", tagName: "Input" },
                        { id: "comp2", tagName: "Label" }
                    ]
                }
            ],
            resource: {
                id: "greeting",
                values: { nb: "Hei", en: "Hello" }
            },
            presence: ""
        };
        const allTextResources = [textResource];
        const el = renderDefaultTextResourceListItem(textResource, allTextResources);
        expect(el).toBeInstanceOf(HTMLElement);
        expect(el.querySelector(".resource-id").textContent).toContain("greeting");
        expect(el.querySelector(".resource-values-list")).not.toBeNull();
        expect(el.querySelector(".app-usage").textContent).toContain("Apps: 1");
        expect(el.querySelector(".component-usage").textContent).toContain("Components: 2");
    });

    it("renders unused indicator if no usage", () => {
        const textResource = {
            usage: [],
            resource: { id: "unused", values: { nb: "Ubrukt" } },
            presence: ""
        };
        const allTextResources = [textResource];
        const el = renderDefaultTextResourceListItem(textResource, allTextResources);
        expect(el.querySelector(".indicator-unused")).not.toBeNull();
        expect(el.textContent).toContain("Unused");
    });

    it("renders presence indicator if present", () => {
        const textResource = {
            usage: [],
            resource: { id: "missing", values: { nb: "Mangler" } },
            presence: "missing"
        };
        const allTextResources = [textResource];
        const el = renderDefaultTextResourceListItem(textResource, allTextResources);
        expect(el.querySelector(".indicator-missing")).not.toBeNull();
        expect(el.textContent).toContain("Missing");
    });
});

describe("renderDefaultTextResourcesList", () => {
    it("renders a list of resources", () => {
        const resources = [
            {
                usage: [],
                resource: { id: "id1", values: { nb: "Hei" } },
                presence: ""
            },
            {
                usage: [],
                resource: { id: "id2", values: { nb: "Ha det" } },
                presence: ""
            }
        ];
        const el = renderDefaultTextResourcesList(resources, resources);
        expect(el).toBeInstanceOf(HTMLElement);
        expect(el.querySelectorAll(".default-text-resource-list-item").length).toBe(2);
    });
});

describe("renderUsageFilterForTextResourcesList", () => {
    it("renders a filter form", () => {
        const el = renderUsageFilterForTextResourcesList(document.createElement("div"), []);
        expect(el).toBeInstanceOf(HTMLElement);
        expect(el.querySelector("select")).not.toBeNull();
        expect(el.querySelector('option[value="all"]')).not.toBeNull();
    });
});

describe("renderSelectApplicationFilterForTextResourcesList", () => {
    it("renders application select", () => {
        const applications = [
            { appOwner: "owner1", appName: "app1" },
            { appOwner: "owner2", appName: "app2" }
        ];
        const el = renderSelectApplicationFilterForTextResourcesList(document.createElement("div"), [], applications);
        expect(el).toBeInstanceOf(HTMLElement);
        expect(el.querySelector("select")).not.toBeNull();
        expect(el.querySelectorAll("option").length).toBe(3); // includes default
    });
});

describe("renderTextInputFilterForTextResourcesList", () => {
    it("renders text input and select", () => {
        const el = renderTextInputFilterForTextResourcesList(document.createElement("div"), []);
        expect(el).toBeInstanceOf(HTMLElement);
        expect(el.querySelector('input[type="text"]')).not.toBeNull();
        expect(el.querySelector("select")).not.toBeNull();
    });
});
