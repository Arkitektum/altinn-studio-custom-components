import { EDITOR_WIDTH_STORAGE_KEY, MIN_EDITOR_WIDTH, clampEditorWidth, getMaxEditorWidth, getStoredEditorWidth, setUpSplitter } from "./splitter.ts";

/** jsdom lays nothing out, so the editor's width is set here, as the browser would report it. */
function setEditorWidth(width: number) {
    Object.defineProperty(document.getElementById("data-input")!, "offsetWidth", { configurable: true, value: width });
}

/** The width of the page the editor, the divider and the preview share. */
function setPageWidth(width: number) {
    Object.defineProperty(document.body, "clientWidth", { configurable: true, value: width });
}

function setUp() {
    document.body.className = "developer-tools";
    document.body.innerHTML = '<aside id="sidebar"></aside><section id="data-input"></section><section class="page-container"></section>';
    setPageWidth(1024);
    return setUpSplitter()!;
}

function press(handle: HTMLElement, key: string, shiftKey = false) {
    const event = new KeyboardEvent("keydown", { key, shiftKey, bubbles: true, cancelable: true });
    handle.dispatchEvent(event);
    return event;
}

function editorWidthStyle() {
    return document.getElementById("data-input")!.style.getPropertyValue("--editor-width");
}

/** The page is 1024px wide, and jsdom gives the sidebar and divider no width, so the editor can be 1024 - 240. */
const MAX_WIDTH = 1024 - 240;

describe("clampEditorWidth", () => {
    it.each([
        [100, 800, MIN_EDITOR_WIDTH],
        [500.4, 800, 500],
        [900, 800, 800],
        [500, 200, MIN_EDITOR_WIDTH]
    ])("keeps %s within the narrowest and %s", (width, max, expected) => {
        expect(clampEditorWidth(width, max)).toBe(expected);
    });
});

describe("getMaxEditorWidth", () => {
    it("leaves room for the sidebar, the divider and the narrowest preview", () => {
        const handle = setUp();
        Object.defineProperty(document.getElementById("sidebar")!, "offsetWidth", { configurable: true, value: 330 });
        Object.defineProperty(handle, "offsetWidth", { configurable: true, value: 6 });
        expect(getMaxEditorWidth(document.getElementById("data-input")!, handle)).toBe(1024 - 330 - 6 - 240);
    });
});

describe("getStoredEditorWidth", () => {
    beforeEach(() => localStorage.clear());

    it.each([
        [null, null],
        ["480", 480],
        ["wide", null],
        ["0", null],
        ["-20", null]
    ])("reads %s as %s", (stored, expected) => {
        if (stored !== null) localStorage.setItem(EDITOR_WIDTH_STORAGE_KEY, stored);
        expect(getStoredEditorWidth()).toBe(expected);
    });
});

describe("setUpSplitter", () => {
    beforeEach(() => localStorage.clear());

    it("does nothing on a page without an editor", () => {
        document.body.innerHTML = "<main></main>";
        expect(setUpSplitter()).toBeNull();
        expect(document.querySelector(".split-handle")).toBeNull();
    });

    it("puts a focusable separator right after the editor, telling assistive technology what it sizes", () => {
        const handle = setUp();
        expect(document.getElementById("data-input")!.nextElementSibling).toBe(handle);
        expect(handle.getAttribute("role")).toBe("separator");
        expect(handle.getAttribute("aria-orientation")).toBe("vertical");
        expect(handle.getAttribute("aria-controls")).toBe("data-input");
        expect(handle.getAttribute("aria-label")).toBe("Editor width");
        expect(handle.tabIndex).toBe(0);
        expect(handle.getAttribute("aria-valuemin")).toBe(String(MIN_EDITOR_WIDTH));
        expect(handle.getAttribute("aria-valuemax")).toBe(String(MAX_WIDTH));
    });

    it("leaves the default split alone when no width is stored", () => {
        setUp();
        expect(document.body.classList.contains("has-editor-width")).toBe(false);
        expect(editorWidthStyle()).toBe("");
    });

    it("gives the editor the stored width, fitted to the window", () => {
        localStorage.setItem(EDITOR_WIDTH_STORAGE_KEY, "500");
        const handle = setUp();
        expect(document.body.classList.contains("has-editor-width")).toBe(true);
        expect(editorWidthStyle()).toBe("500px");
        expect(handle.getAttribute("aria-valuenow")).toBe("500");

        localStorage.setItem(EDITOR_WIDTH_STORAGE_KEY, "5000");
        setUp();
        expect(editorWidthStyle()).toBe(`${MAX_WIDTH}px`);
    });

    it.each([
        ["ArrowRight", false, 416],
        ["ArrowRight", true, 464],
        ["ArrowLeft", false, 384],
        ["ArrowLeft", true, 336],
        ["Home", false, MIN_EDITOR_WIDTH],
        ["End", false, MAX_WIDTH]
    ])("moves the divider with %s (Shift: %s) and keeps the width", (key, shiftKey, expected) => {
        const handle = setUp();
        setEditorWidth(400);
        const event = press(handle, key as string, shiftKey as boolean);
        expect(event.defaultPrevented).toBe(true);
        expect(editorWidthStyle()).toBe(`${expected}px`);
        expect(localStorage.getItem(EDITOR_WIDTH_STORAGE_KEY)).toBe(String(expected));
        expect(handle.getAttribute("aria-valuenow")).toBe(String(expected));
    });

    it("stops at the narrowest width", () => {
        const handle = setUp();
        setEditorWidth(MIN_EDITOR_WIDTH + 4);
        press(handle, "ArrowLeft");
        expect(editorWidthStyle()).toBe(`${MIN_EDITOR_WIDTH}px`);
    });

    it("leaves other keys to the page", () => {
        const handle = setUp();
        setEditorWidth(400);
        expect(press(handle, "Tab").defaultPrevented).toBe(false);
        expect(localStorage.getItem(EDITOR_WIDTH_STORAGE_KEY)).toBeNull();
    });

    it("follows a drag with the main button, and stops when it is let go", () => {
        const handle = setUp();
        handle.dispatchEvent(new MouseEvent("pointerdown", { button: 0, bubbles: true, cancelable: true }));
        expect(document.body.classList.contains("is-resizing-editor")).toBe(true);
        handle.dispatchEvent(new MouseEvent("pointermove", { clientX: 600, bubbles: true }));
        expect(editorWidthStyle()).toBe("600px");
        expect(localStorage.getItem(EDITOR_WIDTH_STORAGE_KEY)).toBe("600");
        handle.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
        expect(document.body.classList.contains("is-resizing-editor")).toBe(false);
        handle.dispatchEvent(new MouseEvent("pointermove", { clientX: 700, bubbles: true }));
        expect(editorWidthStyle()).toBe("600px");
    });

    it("ignores a drag with another button", () => {
        const handle = setUp();
        handle.dispatchEvent(new MouseEvent("pointerdown", { button: 2, bubbles: true, cancelable: true }));
        handle.dispatchEvent(new MouseEvent("pointermove", { clientX: 600, bubbles: true }));
        expect(editorWidthStyle()).toBe("");
        expect(document.body.classList.contains("is-resizing-editor")).toBe(false);
    });

    it("goes back to the default split on a double click, forgetting the width", () => {
        localStorage.setItem(EDITOR_WIDTH_STORAGE_KEY, "500");
        const handle = setUp();
        handle.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
        expect(document.body.classList.contains("has-editor-width")).toBe(false);
        expect(editorWidthStyle()).toBe("");
        expect(localStorage.getItem(EDITOR_WIDTH_STORAGE_KEY)).toBeNull();
    });

    it("fits the stored width again when the window gets narrower", () => {
        localStorage.setItem(EDITOR_WIDTH_STORAGE_KEY, "700");
        setUp();
        expect(editorWidthStyle()).toBe("700px");
        setPageWidth(800);
        globalThis.dispatchEvent(new Event("resize"));
        expect(editorWidthStyle()).toBe(`${800 - 240}px`);
        expect(localStorage.getItem(EDITOR_WIDTH_STORAGE_KEY)).toBe("700");
    });
});
