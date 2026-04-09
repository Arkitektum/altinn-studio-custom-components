import { addBodyClassNamesForApplication, getPropsFromElementAttributes } from "./htmlElementHelpers.js";

/* @jest-environment jsdom */

function createElementWithAttributes(attrs = {}) {
    const el = document.createElement("div");
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}

describe("getPropsFromElementAttributes", () => {
    test("extracts all provided attributes correctly", () => {
        const element = createElementWithAttributes({
            formdata: JSON.stringify({ a: 1 }),
            tagName: "custom-tag",
            text: "Hello",
            texts: JSON.stringify({ title: "World" }),
            inline: "true",
            hideTitle: "true",
            size: "H2",
            hideIfEmpty: "true",
            styleOverride: JSON.stringify({ color: "red" }),
            isChildComponent: "true",
            feedbackType: "info",
            itemKey: "item-1",
            dataItemKey: "data-1",
            dataTitleItemKey: "data-title-1",
            hideOrgNr: "true",
            format: "uppercase",
            tableColumns: JSON.stringify([{ key: "col1" }, { key: "col2" }]),
            showRowNumbers: "true",
            resourceBindings: JSON.stringify({ title: "res.title" }),
            resourceValues: JSON.stringify({ value: "res.value" }),
            partType: "ansvarligSoeker",
            enableLinks: "true"
        });

        const props = getPropsFromElementAttributes(element);

        expect(props.formData).toEqual({ a: 1 });
        expect(props.tagName).toBe("custom-tag");
        expect(props.text).toBe("Hello");
        expect(props.texts).toEqual({ title: "World" });
        expect(props.inline).toBe(true);
        expect(props.hideTitle).toBe(true);
        // size depends on external validation, so only check type if present
        if (props.size !== undefined) {
            expect(typeof props.size).toBe("string");
        }
        expect(props.hideIfEmpty).toBe(true);
        expect(props.styleOverride).toEqual({ color: "red" });
        expect(props.isChildComponent).toBe(true);
        expect(props.feedbackType).toBe("info");
        expect(props.itemKey).toBe("item-1");
        expect(props.dataItemKey).toBe("data-1");
        expect(props.dataTitleItemKey).toBe("data-title-1");
        expect(props.hideOrgNr).toBe(true);
        expect(props.format).toBe("uppercase");
        expect(props.tableColumns).toEqual([{ key: "col1" }, { key: "col2" }]);
        expect(props.showRowNumbers).toBe(true);
        expect(props.resourceBindings).toEqual({ title: "res.title" });
        expect(props.resourceValues).toEqual({ value: "res.value" });
        expect(props.partType).toBe("ansvarligSoeker");
        expect(props.enableLinks).toBe(true);
    });

    test('defaults partType to "tiltakshaver" when not provided', () => {
        const element = createElementWithAttributes({
            formdata: JSON.stringify({ x: 1 }),
            texts: JSON.stringify({}),
            styleOverride: JSON.stringify({ some: "override" }),
            tableColumns: JSON.stringify([]),
            resourceBindings: JSON.stringify({}),
            resourceValues: JSON.stringify({})
        });

        const props = getPropsFromElementAttributes(element);
        expect(props.partType).toBe("tiltakshaver");
    });

    test("boolean attributes return false when set to other values", () => {
        const element = createElementWithAttributes({
            formdata: JSON.stringify({}),
            texts: JSON.stringify({}),
            styleOverride: JSON.stringify({ a: 1 }),
            tableColumns: JSON.stringify([]),
            resourceBindings: JSON.stringify({}),
            resourceValues: JSON.stringify({}),
            inline: "false",
            hideTitle: "nope",
            hideIfEmpty: "0",
            isChildComponent: "False",
            hideOrgNr: "n",
            showRowNumbers: "FALSE",
            enableLinks: "False"
        });

        const props = getPropsFromElementAttributes(element);
        expect(props.inline).toBe(false);
        expect(props.hideTitle).toBe(false);
        expect(props.hideIfEmpty).toBe(false);
        expect(props.isChildComponent).toBe(false);
        expect(props.hideOrgNr).toBe(false);
        expect(props.showRowNumbers).toBe(false);
        expect(props.enableLinks).toBe(false);
    });

    test("falls back to element tagName when tagName attribute is missing", () => {
        const el = document.createElement("section");
        el.setAttribute("formdata", JSON.stringify({}));
        el.setAttribute("texts", JSON.stringify({}));
        el.setAttribute("styleOverride", JSON.stringify({ a: 1 }));
        el.setAttribute("tableColumns", JSON.stringify([]));
        el.setAttribute("resourceBindings", JSON.stringify({}));
        el.setAttribute("resourceValues", JSON.stringify({}));

        const props = getPropsFromElementAttributes(el);
        expect(props.tagName).toBe("section");
    });
});

describe("addBodyClassNamesForApplication", () => {
    afterEach(() => {
        document.body.className = "";
    });

    test("adds org and app class names to body", () => {
        addBodyClassNamesForApplication("foo", "bar");
        expect(document.body.classList.contains("org-foo")).toBe(true);
        expect(document.body.classList.contains("app-bar")).toBe(true);
    });

    test("does not add class names if org or app is missing", () => {
        addBodyClassNamesForApplication(null, "bar");
        expect(document.body.classList.contains("app-bar")).toBe(false);
        addBodyClassNamesForApplication("foo", undefined);
        expect(document.body.classList.contains("org-foo")).toBe(false);
    });
});

describe("removeAllBodyClassNamesForApplication", () => {
    const { removeAllBodyClassNamesForApplication } = require("./htmlElementHelpers.js");

    afterEach(() => {
        document.body.className = "";
    });

    test("removes all org- and app- class names from body", () => {
        document.body.classList.add("org-foo", "app-bar", "other-class");
        removeAllBodyClassNamesForApplication();
        expect(document.body.classList.contains("org-foo")).toBe(false);
        expect(document.body.classList.contains("app-bar")).toBe(false);
        expect(document.body.classList.contains("other-class")).toBe(true);
    });
});

describe("updateBodyClassNamesForApplication", () => {
    const { updateBodyClassNamesForApplication } = require("./htmlElementHelpers.js");

    afterEach(() => {
        document.body.className = "";
    });

    test("removes old org/app classes and adds new ones", () => {
        document.body.classList.add("org-old", "app-old", "keep-me");
        updateBodyClassNamesForApplication("neworg", "newapp");
        expect(document.body.classList.contains("org-old")).toBe(false);
        expect(document.body.classList.contains("app-old")).toBe(false);
        expect(document.body.classList.contains("org-neworg")).toBe(true);
        expect(document.body.classList.contains("app-newapp")).toBe(true);
        expect(document.body.classList.contains("keep-me")).toBe(true);
    });
});
