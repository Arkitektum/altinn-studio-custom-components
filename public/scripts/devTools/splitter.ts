/** Where the editor's width is kept once the divider has been moved. Not part of the workspace, since it belongs to the screen rather than the work. */
export const EDITOR_WIDTH_STORAGE_KEY = "devToolsEditorWidth";

/** The narrowest the editor gets, and the narrowest the preview is left. The preview scrolls sideways below the page's own width. */
export const MIN_EDITOR_WIDTH = 320;
export const MIN_PREVIEW_WIDTH = 240;

/** How far an arrow key moves the divider, and with Shift. */
const KEY_STEP = 16;
const LARGE_KEY_STEP = 64;

/**
 * The widest the editor can be beside the sidebar, the divider and the narrowest preview.
 *
 * @param {HTMLElement} editorElement - The editor.
 * @param {HTMLElement} handleElement - The divider.
 * @returns {number} The width in pixels, never below MIN_EDITOR_WIDTH.
 */
export function getMaxEditorWidth(editorElement: HTMLElement, handleElement: HTMLElement) {
    const containerWidth = editorElement.parentElement?.clientWidth || globalThis.innerWidth;
    const sidebarWidth = document.getElementById("sidebar")?.offsetWidth || 0;
    return Math.max(MIN_EDITOR_WIDTH, containerWidth - sidebarWidth - handleElement.offsetWidth - MIN_PREVIEW_WIDTH);
}

/**
 * Keeps a width between the editor's narrowest and widest.
 *
 * @param {number} width - The width asked for.
 * @param {number} maxWidth - The widest the editor can be.
 * @returns {number} The width, rounded to whole pixels.
 */
export function clampEditorWidth(width: number, maxWidth: number) {
    return Math.round(Math.min(Math.max(width, MIN_EDITOR_WIDTH), Math.max(maxWidth, MIN_EDITOR_WIDTH)));
}

/**
 * The editor's width as stored, or null when the divider has not been moved or what is stored is not a width.
 *
 * @returns {number | null} The width in pixels.
 */
export function getStoredEditorWidth() {
    const stored = Number.parseInt(localStorage.getItem(EDITOR_WIDTH_STORAGE_KEY) ?? "", 10);
    return Number.isFinite(stored) && stored > 0 ? stored : null;
}

/**
 * Gives the editor a width, or hands it back to the default split when the width is null. The page's CSS lets the preview take the rest.
 *
 * @param {HTMLElement} editorElement - The editor.
 * @param {HTMLElement} handleElement - The divider, which announces the width.
 * @param {number | null} width - The width in pixels, or null for the default split.
 */
export function applyEditorWidth(editorElement: HTMLElement, handleElement: HTMLElement, width: number | null) {
    const maxWidth = getMaxEditorWidth(editorElement, handleElement);
    if (width === null) {
        editorElement.style.removeProperty("--editor-width");
        document.body.classList.remove("has-editor-width");
    } else {
        editorElement.style.setProperty("--editor-width", `${clampEditorWidth(width, maxWidth)}px`);
        document.body.classList.add("has-editor-width");
    }
    handleElement.setAttribute("aria-valuemin", String(MIN_EDITOR_WIDTH));
    handleElement.setAttribute("aria-valuemax", String(maxWidth));
    handleElement.setAttribute("aria-valuenow", String(clampEditorWidth(width ?? editorElement.offsetWidth, maxWidth)));
}

/**
 * Puts a divider between the editor and the preview. Dragging it, or moving it with the arrow keys, Home and End, sets the editor's width and keeps it for the next visit. A double click forgets it, going back to the default split.
 *
 * @returns {HTMLElement | null} The divider, or null when the page has no editor to size.
 */
export function setUpSplitter() {
    const editorElement = document.getElementById("data-input");
    if (!editorElement) return null;

    const handleElement = document.createElement("div");
    handleElement.classList.add("split-handle");
    handleElement.setAttribute("role", "separator");
    handleElement.setAttribute("aria-orientation", "vertical");
    handleElement.setAttribute("aria-label", "Editor width");
    handleElement.setAttribute("aria-controls", "data-input");
    handleElement.title = "Drag to resize the editor. Double-click to reset.";
    handleElement.tabIndex = 0;
    editorElement.after(handleElement);

    const setWidth = (width: number | null) => {
        applyEditorWidth(editorElement, handleElement, width);
        if (width === null) {
            localStorage.removeItem(EDITOR_WIDTH_STORAGE_KEY);
        } else {
            localStorage.setItem(EDITOR_WIDTH_STORAGE_KEY, String(clampEditorWidth(width, getMaxEditorWidth(editorElement, handleElement))));
        }
    };

    applyEditorWidth(editorElement, handleElement, getStoredEditorWidth());

    handleElement.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        handleElement.setPointerCapture?.(event.pointerId);
        document.body.classList.add("is-resizing-editor");
        const editorLeft = editorElement.getBoundingClientRect().left;
        const onMove = (moveEvent: PointerEvent) => setWidth(moveEvent.clientX - editorLeft);
        const onUp = () => {
            document.body.classList.remove("is-resizing-editor");
            handleElement.removeEventListener("pointermove", onMove);
            handleElement.removeEventListener("pointerup", onUp);
            handleElement.removeEventListener("pointercancel", onUp);
        };
        handleElement.addEventListener("pointermove", onMove);
        handleElement.addEventListener("pointerup", onUp);
        handleElement.addEventListener("pointercancel", onUp);
    });

    handleElement.addEventListener("keydown", (event) => {
        const current = editorElement.offsetWidth;
        const step = event.shiftKey ? LARGE_KEY_STEP : KEY_STEP;
        let width: number;
        switch (event.key) {
            case "ArrowLeft":
                width = current - step;
                break;
            case "ArrowRight":
                width = current + step;
                break;
            case "Home":
                width = MIN_EDITOR_WIDTH;
                break;
            case "End":
                width = getMaxEditorWidth(editorElement, handleElement);
                break;
            default:
                return;
        }
        event.preventDefault();
        setWidth(width);
    });

    handleElement.addEventListener("dblclick", () => setWidth(null));

    // The widest the editor can be follows the window, so the stored width is fitted again when the window changes.
    globalThis.addEventListener("resize", () => applyEditorWidth(editorElement, handleElement, getStoredEditorWidth()));

    return handleElement;
}
