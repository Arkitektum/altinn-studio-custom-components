import { fitPreview, getPreviewPageWidth, setUpPreviewFit } from "./previewFit.ts";
import { centimetresToPixels } from "../pageScale.ts";

/** The portrait page with its 0.5cm margins: 22cm. */
const PORTRAIT_WIDTH = centimetresToPixels(22);

function setUp(previewWidth: number) {
    document.body.innerHTML = '<section class="page-container"><main class="page"></main></section>';
    const container = document.querySelector(".page-container") as HTMLElement;
    Object.defineProperty(container, "clientWidth", { configurable: true, value: previewWidth });
    return { container, page: document.querySelector(".page") as HTMLElement };
}

function zoom(page: HTMLElement) {
    return page.style.getPropertyValue("--preview-zoom");
}

describe("getPreviewPageWidth", () => {
    it("is the page and its margins, wider in landscape", () => {
        const page = document.createElement("main");
        expect(getPreviewPageWidth(page)).toBeCloseTo(PORTRAIT_WIDTH, 10);
        page.classList.add("landscape");
        expect(getPreviewPageWidth(page)).toBeCloseTo(centimetresToPixels(30.7), 10);
    });
});

describe("fitPreview", () => {
    it("shrinks the page to the preview's width, and says by how much", () => {
        const { container, page } = setUp(PORTRAIT_WIDTH * 0.75);
        const note = document.createElement("p");
        fitPreview(container, page, note);
        expect(Number(zoom(page))).toBeCloseTo(0.75, 10);
        expect(note.hidden).toBe(false);
        expect(note.textContent).toBe("Shown at 75% to fit.");
    });

    it("shows the page at full size, and says nothing, when it fits", () => {
        const { container, page } = setUp(PORTRAIT_WIDTH * 0.75);
        const note = document.createElement("p");
        fitPreview(container, page, note);
        Object.defineProperty(container, "clientWidth", { configurable: true, value: PORTRAIT_WIDTH + 50 });
        fitPreview(container, page, note);
        expect(zoom(page)).toBe("");
        expect(note.hidden).toBe(true);
        expect(note.textContent).toBe("");
    });

    it("stops at half size, leaving the rest to scroll", () => {
        const { container, page } = setUp(100);
        const note = document.createElement("p");
        fitPreview(container, page, note);
        expect(zoom(page)).toBe("0.5");
        expect(note.textContent).toBe("Shown at 50% to fit.");
    });

    it("leaves the page at full size before the preview is laid out", () => {
        const { container, page } = setUp(0);
        const note = document.createElement("p");
        fitPreview(container, page, note);
        expect(zoom(page)).toBe("");
        expect(note.hidden).toBe(true);
    });

    it("fits a landscape page to its own width", () => {
        const { container, page } = setUp(PORTRAIT_WIDTH);
        page.classList.add("landscape");
        const note = document.createElement("p");
        fitPreview(container, page, note);
        expect(Number(zoom(page))).toBeCloseTo(22 / 30.7, 10);
    });
});

describe("setUpPreviewFit", () => {
    const OriginalResizeObserver = globalThis.ResizeObserver;
    afterEach(() => {
        globalThis.ResizeObserver = OriginalResizeObserver;
    });

    it("does nothing on a page without a preview", () => {
        document.body.innerHTML = "<main></main>";
        expect(setUpPreviewFit()).toBeNull();
    });

    it("puts the note just above the page and fits it straight away", () => {
        const { page } = setUp(PORTRAIT_WIDTH / 2);
        const note = setUpPreviewFit()!;
        expect(page.previousElementSibling).toBe(note);
        expect(note.classList.contains("preview-scale")).toBe(true);
        expect(zoom(page)).toBe("0.5");
    });

    it("fits the page again whenever the preview changes width, as when the divider moves", () => {
        let observed: Element | null = null;
        let callback: (() => void) | null = null;
        globalThis.ResizeObserver = class {
            constructor(resizeCallback: () => void) {
                callback = resizeCallback;
            }
            observe(element: Element) {
                observed = element;
            }
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
        const { container, page } = setUp(PORTRAIT_WIDTH / 2);
        setUpPreviewFit();
        expect(observed).toBe(container);
        Object.defineProperty(container, "clientWidth", { configurable: true, value: PORTRAIT_WIDTH * 0.8 });
        callback!();
        expect(Number(zoom(page))).toBeCloseTo(0.8, 10);
    });

    it("follows the window instead where there is no ResizeObserver", () => {
        globalThis.ResizeObserver = undefined as unknown as typeof ResizeObserver;
        const { container, page } = setUp(PORTRAIT_WIDTH / 2);
        setUpPreviewFit();
        Object.defineProperty(container, "clientWidth", { configurable: true, value: PORTRAIT_WIDTH * 0.8 });
        globalThis.dispatchEvent(new Event("resize"));
        expect(Number(zoom(page))).toBeCloseTo(0.8, 10);
    });
});
