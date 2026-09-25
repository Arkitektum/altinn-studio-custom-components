import { renderSummationElement, renderSummationItemElement } from "./renderers";

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
        expect(element.querySelector(".summation-item-data")!.textContent).toBe("20.15");
    });

    it("appends the unit to the data value", () => {
        const element = renderSummationItemElement(item({ data: 60.1, unit: "m²" }), false);
        expect(element.querySelector(".summation-item-data")!.textContent).toBe("60.1 m²");
    });

    it("falls back to 0 when there is no data", () => {
        const element = renderSummationItemElement(item({ title: "Tom" }), false);
        expect(element.querySelector(".summation-item-data")!.textContent).toBe("0");
    });

    it("serializes the rendered text into the HTML string", () => {
        expect(renderSummationItemElement(item({ title: "Sum", data: 60.1, unit: "m²" }))).toContain("60.1 m²");
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
        const titleId = element.querySelector(".summation-item-title")!.id;
        expect(titleId).toBeTruthy();
        expect(dataElement!.getAttribute("aria-labelledby")).toBe(titleId);
        expect(dataElement!.classList.contains("has-title")).toBe(true);
    });

    it("omits the title wiring when there is no title", () => {
        const element = renderSummationItemElement(item({ data: 1 }), false);
        const dataElement = element.querySelector(".summation-item-data");
        expect(element.querySelector(".summation-item-title")!.id).toBe("");
        expect(dataElement!.getAttribute("aria-labelledby")).toBeNull();
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

    it("gives each item its own title id and keeps aria-labelledby pointing at it", () => {
        const element = renderSummationElement([item({ title: "Første", data: 1 }), item({ title: "Andre", data: 2 })]);
        const pairs = Array.from(element.querySelectorAll(".summation-item")).map((row) => [
            row.querySelector(".summation-item-title")!.id,
            row.querySelector(".summation-item-data")!.getAttribute("aria-labelledby")
        ]);
        expect(pairs.every(([titleId, labelledBy]) => titleId && titleId === labelledBy)).toBe(true);
        expect(pairs[0]![0]).not.toBe(pairs[1]![0]);
    });

    it("renders an empty container when there is no data", () => {
        for (const data of [[], null, undefined, "not an array"]) {
            const element = renderSummationElement(data);
            expect(element.classList.contains("custom-summation")).toBe(true);
            expect(element.querySelectorAll(".summation-item")).toHaveLength(0);
        }
    });
});
