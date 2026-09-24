import { renderImageElement } from "./renderers.ts";

/** An image with a title above it. */
const component = { resourceValues: { title: "Situasjonsplan", data: "https://example.no/plan.png" } };

/** The image inside the container, if one was drawn. */
const image = (rendered: HTMLElement) => rendered.querySelector("img");

describe("the image", () => {
    it("is drawn inside a container of its own", () => {
        const rendered = renderImageElement(component);

        expect(rendered.classList.contains("custom-field-image")).toBe(true);
        expect(image(rendered)!.classList.contains("custom-field-image-img")).toBe(true);
    });

    it("takes its source from the data", () => {
        expect(image(renderImageElement(component))!.getAttribute("src")).toBe("https://example.no/plan.png");
    });

    it("shows the title above it when there is one, and leaves it out when there is none", () => {
        expect(renderImageElement(component).querySelector(".custom-field-image-title")!.textContent).toBe("Situasjonsplan");
        expect(renderImageElement({ resourceValues: { data: "plan.png" } }).querySelector(".custom-field-image-title")).toBeNull();
    });

    it("applies whatever styling the component asked for", () => {
        expect(image(renderImageElement({ ...component, styleOverride: { maxWidth: "400px" } }))!.style.maxWidth).toBe("400px");
    });
});

describe("the alternative text", () => {
    it("uses the text the component gave, when it gave one", () => {
        expect(image(renderImageElement({ ...component, alt: "Kart over tomta" }))!.getAttribute("alt")).toBe("Kart over tomta");
    });

    it("falls back to the title, so the image is not left unnamed", () => {
        expect(image(renderImageElement(component))!.getAttribute("alt")).toBe("Situasjonsplan");
    });

    it("ends up empty when there is neither, which marks the image as decorative", () => {
        expect(image(renderImageElement({ resourceValues: { data: "plan.png" } }))!.getAttribute("alt")).toBe("");
    });
});

describe("an image with no source", () => {
    it("draws no image at all, rather than a broken one", () => {
        expect(image(renderImageElement({ resourceValues: { title: "Situasjonsplan" } })))!.toBeNull();
    });

    it("still draws the title, so the reader knows what is missing", () => {
        expect(renderImageElement({ resourceValues: { title: "Situasjonsplan" } }).querySelector(".custom-field-image-title")).not.toBeNull();
    });

    it("renders an empty container for nothing at all, rather than throwing", () => {
        expect(renderImageElement({}).children).toHaveLength(0);
        expect(renderImageElement(undefined).children).toHaveLength(0);
    });
});
