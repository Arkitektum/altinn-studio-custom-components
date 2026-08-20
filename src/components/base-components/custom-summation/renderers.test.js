import { renderSummationElement, renderSummationItemElement } from "./renderers";

const item = (resourceValues) => ({ resourceValues });

// The operator/title/data spans are filled via innerText, which jsdom does not implement, so their rendered text is
// not observable here — these tests assert structure, classes and the accessibility wiring instead.

describe("renderSummationItemElement", () => {
    it("returns an HTML string by default and a DOM element when asked", () => {
        expect(typeof renderSummationItemElement(item({ data: 1 }))).toBe("string");
        expect(renderSummationItemElement(item({ data: 1 }), false)).toBeInstanceOf(HTMLElement);
    });

    it("renders an operator, a title and a data span", () => {
        const element = renderSummationItemElement(item({ operator: "-", title: "Trekkes fra", data: 20.15 }), false);
        expect(element.classList.contains("summation-item")).toBe(true);
        expect(element.querySelector(".summation-item-operator")).not.toBeNull();
        expect(element.querySelector(".summation-item-title")).not.toBeNull();
        expect(element.querySelector(".summation-item-data")).not.toBeNull();
    });

    it("marks the total item", () => {
        expect(renderSummationItemElement(item({ data: 1, isTotal: true }), false).classList.contains("total")).toBe(true);
        // Attributes arrive as strings, so the string form counts too.
        expect(renderSummationItemElement(item({ data: 1, isTotal: "true" }), false).classList.contains("total")).toBe(true);
        expect(renderSummationItemElement(item({ data: 1 }), false).classList.contains("total")).toBe(false);
    });

    it("links the data to its title for screen readers", () => {
        const element = renderSummationItemElement(item({ title: "Sum", data: 1 }), false);
        const dataElement = element.querySelector(".summation-item-data");
        const titleId = element.querySelector(".summation-item-title").id;
        expect(titleId).toBeTruthy();
        expect(dataElement.getAttribute("aria-labelledby")).toBe(titleId);
        expect(dataElement.classList.contains("has-title")).toBe(true);
    });

    it("omits the title wiring when there is no title", () => {
        const element = renderSummationItemElement(item({ data: 1 }), false);
        const dataElement = element.querySelector(".summation-item-data");
        expect(element.querySelector(".summation-item-title").id).toBe("");
        expect(dataElement.getAttribute("aria-labelledby")).toBeNull();
        expect(dataElement.classList.contains("has-title")).toBe(false);
    });

    it("does not parse HTML-like content into elements (XSS-safe)", () => {
        const payload = "<img src=x onerror=alert(1)>";
        const element = renderSummationItemElement(item({ title: payload, data: payload }), false);
        expect(element.querySelector("img")).toBeNull();
    });
});

describe("renderSummationElement", () => {
    it("renders one item per data entry", () => {
        const element = renderSummationElement([item({ title: "Første", data: 1 }), item({ title: "Andre", data: 2 })]);
        expect(element.classList.contains("custom-summation")).toBe(true);
        expect(element.querySelectorAll(".summation-item")).toHaveLength(2);
    });

    it("gives each item its own title id and keeps aria-labelledby pointing at it", () => {
        const element = renderSummationElement([item({ title: "Første", data: 1 }), item({ title: "Andre", data: 2 })]);
        const pairs = Array.from(element.querySelectorAll(".summation-item")).map((row) => [
            row.querySelector(".summation-item-title").id,
            row.querySelector(".summation-item-data").getAttribute("aria-labelledby")
        ]);
        expect(pairs.every(([titleId, labelledBy]) => titleId && titleId === labelledBy)).toBe(true);
        expect(pairs[0][0]).not.toBe(pairs[1][0]);
    });

    it("preserves the order of the data entries", () => {
        const element = renderSummationElement([item({ data: 1 }), item({ data: 2, isTotal: true })]);
        const rows = element.querySelectorAll(".summation-item");
        expect(rows[0].classList.contains("total")).toBe(false);
        expect(rows[1].classList.contains("total")).toBe(true);
    });

    it("renders an empty container when there is no data", () => {
        for (const data of [[], null, undefined, "not an array"]) {
            const element = renderSummationElement(data);
            expect(element.classList.contains("custom-summation")).toBe(true);
            expect(element.querySelectorAll(".summation-item")).toHaveLength(0);
        }
    });
});
