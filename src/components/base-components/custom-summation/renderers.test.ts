import { renderSummationElement, renderSummationItemElement } from "./renderers.ts";

const item = (resourceValues: unknown) => ({ resourceValues });

describe("renderSummationItemElement", () => {
    it("returns an HTML string by default and a DOM element when asked", () => {
        expect(typeof renderSummationItemElement(item({ data: 1 }))).toBe("string");
        expect(renderSummationItemElement(item({ data: 1 }), false)).toBeInstanceOf(HTMLElement);
    });

    it("renders the operator, title and data", () => {
        const element = renderSummationItemElement(item({ operator: "-", title: "Trekkes fra", data: 20.15 }), false);
        expect(element.classList.contains("summation-item")).toBe(true);
        expect(element.querySelector(".summation-item-operator")!.textContent).toBe("-");
        expect(element.querySelector(".summation-item-title")!.textContent).toBe("Trekkes fra");
        expect(element.querySelector(".summation-item-data")!.textContent).toBe("20,15");
    });

    it("appends the unit to the data value", () => {
        const element = renderSummationItemElement(item({ data: 60.1, unit: "m²" }), false);
        expect(element.querySelector(".summation-item-data")!.textContent).toBe("60,1 m²");
    });

    it("falls back to 0 when there is no data", () => {
        const element = renderSummationItemElement(item({ title: "Tom" }), false);
        expect(element.querySelector(".summation-item-data")!.textContent).toBe("0");
    });

    it("serializes the rendered text into the HTML string", () => {
        expect(renderSummationItemElement(item({ title: "Sum", data: 60.1, unit: "m²" }))).toContain("60,1 m²");
    });

    it("marks the total item", () => {
        expect(renderSummationItemElement(item({ data: 1, isTotal: true }), false).classList.contains("total")).toBe(true);
        // Attributes arrive as strings, so the string form counts too.
        expect(renderSummationItemElement(item({ data: 1, isTotal: "true" }), false).classList.contains("total")).toBe(true);
        expect(renderSummationItemElement(item({ data: 1 }), false).classList.contains("total")).toBe(false);
    });

    it("is one row of a description list: the operator and title as the term, the data as its description", () => {
        const element = renderSummationItemElement(item({ operator: "-", title: "Trekkes fra", data: 1 }), false);
        const [term, description] = Array.from(element.children);

        expect(element.tagName).toBe("DIV");
        expect(element.children).toHaveLength(2);
        expect(term!.tagName).toBe("DT");
        expect(Array.from(term!.children).map((child) => child.className)).toEqual(["summation-item-operator", "summation-item-title"]);
        expect(description!.tagName).toBe("DD");
        expect(description!.classList.contains("summation-item-data")).toBe(true);
        expect(description!.classList.contains("has-title")).toBe(true);
        expect(element.querySelector("[aria-labelledby]")).toBeNull();
        expect(element.querySelector("[id]")).toBeNull();
    });

    it("does not mark the data as titled when there is no title", () => {
        const element = renderSummationItemElement(item({ data: 1 }), false);
        const dataElement = element.querySelector(".summation-item-data");
        expect(dataElement!.classList.contains("has-title")).toBe(false);
    });

    it("does not render HTML in the title or data (XSS-safe)", () => {
        const payload = "<img src=x onerror=alert(1)>";
        const element = renderSummationItemElement(item({ title: payload, data: payload }), false);
        expect(element.querySelector("img")).toBeNull();
        expect(element.querySelector(".summation-item-title")!.textContent).toBe(payload);
        expect(renderSummationItemElement(item({ title: payload, data: 1 }))).toContain("&lt;img");
    });
});

describe("renderSummationElement", () => {
    it("renders one item per data entry, in order", () => {
        const element = renderSummationElement([item({ title: "Første", data: 1 }), item({ title: "Andre", data: 2 })]);
        const titles = Array.from(element.querySelectorAll(".summation-item-title")).map((title) => title.textContent);
        expect(element.classList.contains("custom-summation")).toBe(true);
        expect(element.querySelectorAll(".summation-item")).toHaveLength(2);
        expect(titles).toEqual(["Første", "Andre"]);
    });

    it("is a description list holding nothing but its rows", () => {
        const element = renderSummationElement([item({ title: "Første", data: 1 }), item({ title: "Andre", data: 2 })]);

        expect(element.tagName).toBe("DL");
        expect(Array.from(element.children).map((child) => child.tagName)).toEqual(["DIV", "DIV"]);
    });

    it("renders an empty container when there is no data", () => {
        for (const data of [[], null, undefined, "not an array"]) {
            const element = renderSummationElement(data);
            expect(element.classList.contains("custom-summation")).toBe(true);
            expect(element.querySelectorAll(".summation-item")).toHaveLength(0);
        }
    });
});
