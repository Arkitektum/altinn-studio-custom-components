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

    /** Lets the next animation frame run, in which the fit is made. */
    const nextFrame = () => new Promise((resolve) => setTimeout(resolve, 50));

    function observeWithFake() {
        const fake: { observed: Element | null; callback: (() => void) | null } = { observed: null, callback: null };
        globalThis.ResizeObserver = class {
            constructor(resizeCallback: () => void) {
                fake.callback = resizeCallback;
            }
            observe(element: Element) {
                fake.observed = element;
            }
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
        return fake;
    }

    it("fits the page again whenever the preview changes width, as when the divider moves", async () => {
        const fake = observeWithFake();
        const { container, page } = setUp(PORTRAIT_WIDTH / 2);
        setUpPreviewFit();
        expect(fake.observed).toBe(container);
        Object.defineProperty(container, "clientWidth", { configurable: true, value: PORTRAIT_WIDTH * 0.8 });
        fake.callback!();
        await nextFrame();
        expect(Number(zoom(page))).toBeCloseTo(0.8, 10);
    });

    it("changes nothing while the size change is being reported, only in the next frame", async () => {
        const fake = observeWithFake();
        const { container, page } = setUp(PORTRAIT_WIDTH / 2);
        setUpPreviewFit();
        Object.defineProperty(container, "clientWidth", { configurable: true, value: PORTRAIT_WIDTH * 0.8 });
        fake.callback!();
        expect(zoom(page)).toBe("0.5");
        await nextFrame();
        expect(Number(zoom(page))).toBeCloseTo(0.8, 10);
    });

    it("leaves the fit alone when only the preview's height changed, as when a scrollbar comes or goes", async () => {
        const fake = observeWithFake();
        const { page } = setUp(PORTRAIT_WIDTH * 0.8);
        setUpPreviewFit();
        // Landscape would fit smaller, so a fit made now would show.
        page.classList.add("landscape");
        fake.callback!();
        await nextFrame();
        expect(Number(zoom(page))).toBeCloseTo(0.8, 10);
    });

    it("remembers the width it last fitted to, so a height change after a width change leaves the fit alone too", async () => {
        const fake = observeWithFake();
        const { container, page } = setUp(PORTRAIT_WIDTH / 2);
        setUpPreviewFit();
        Object.defineProperty(container, "clientWidth", { configurable: true, value: PORTRAIT_WIDTH * 0.8 });
        fake.callback!();
        await nextFrame();
        page.classList.add("landscape");
        fake.callback!();
        await nextFrame();
        expect(Number(zoom(page))).toBeCloseTo(0.8, 10);
    });

    it("follows the window instead where there is no ResizeObserver", async () => {
        globalThis.ResizeObserver = undefined as unknown as typeof ResizeObserver;
        const { container, page } = setUp(PORTRAIT_WIDTH / 2);
        setUpPreviewFit();
        Object.defineProperty(container, "clientWidth", { configurable: true, value: PORTRAIT_WIDTH * 0.8 });
        globalThis.dispatchEvent(new Event("resize"));
        await nextFrame();
        expect(Number(zoom(page))).toBeCloseTo(0.8, 10);
    });
});
