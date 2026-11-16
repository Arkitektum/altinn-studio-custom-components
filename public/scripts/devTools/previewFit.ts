import { PAGE_WIDTHS, centimetresToPixels, getFitScale } from "../pageScale.ts";

/** The margin on each side of the page in the preview, which shrinks with it. */
const PAGE_SIDE_MARGIN_CM = 0.5;

/**
 * The width the preview's page takes at full size, with its margins.
 *
 * @param {HTMLElement} pageElement - The page.
 * @returns {number} The width in CSS pixels.
 */
export function getPreviewPageWidth(pageElement: HTMLElement) {
    const pageWidth = Number.parseFloat(pageElement.classList.contains("landscape") ? PAGE_WIDTHS.landscape : PAGE_WIDTHS.portrait);
    return centimetresToPixels(pageWidth + 2 * PAGE_SIDE_MARGIN_CM);
}

/**
 * Shrinks the preview's page to the width of the preview, as the upgrade comparison does with its frames, and says how much when it does. The stylesheet zooms the page by `--preview-zoom`. Zoom, unlike a transform, shrinks the room the page takes as well as what it shows. Below the smallest scale the page scrolls sideways.
 *
 * @param {HTMLElement} containerElement - The preview.
 * @param {HTMLElement} pageElement - The page.
 * @param {HTMLElement} scaleElement - Where to say how much the page is shrunk.
 */
export function fitPreview(containerElement: HTMLElement, pageElement: HTMLElement, scaleElement: HTMLElement) {
    const availableWidth = containerElement.clientWidth;
    // Nothing to go by before the preview is laid out.
    const scale = availableWidth > 0 ? getFitScale(availableWidth, getPreviewPageWidth(pageElement)) : 1;
    const percent = Math.round(scale * 100);
    if (percent < 100) {
        pageElement.style.setProperty("--preview-zoom", String(scale));
    } else {
        pageElement.style.removeProperty("--preview-zoom");
    }
    scaleElement.hidden = percent >= 100;
    scaleElement.textContent = percent < 100 ? `Shown at ${percent}% to fit.` : "";
}

/**
 * Keeps the preview's page fitted to the preview's width, as the window is resized and as the divider beside it is moved.
 *
 * @returns {HTMLElement | null} The line saying how much the page is shrunk, or null when the page has no preview.
 */
export function setUpPreviewFit() {
    const containerElement = document.querySelector(".page-container") as HTMLElement | null;
    const pageElement = containerElement?.querySelector(".page") as HTMLElement | null;
    if (!containerElement || !pageElement) return null;
    const scaleElement = document.createElement("p");
    scaleElement.classList.add("preview-scale");
    pageElement.before(scaleElement);
    let fittedWidth = containerElement.clientWidth;
    fitPreview(containerElement, pageElement, scaleElement);
    // Fitted in the next frame, not while the size change is being reported: zooming the page can add or remove the preview's sideways scrollbar, which changes its height, and a change made while sizes are being reported is one the browser cannot deliver ("ResizeObserver loop completed with undelivered notifications"). A change of height alone leaves the fit as it is.
    let pendingFrame: number | undefined;
    const fitInNextFrame = () => {
        if (pendingFrame !== undefined) cancelAnimationFrame(pendingFrame);
        pendingFrame = requestAnimationFrame(() => {
            pendingFrame = undefined;
            if (containerElement.clientWidth === fittedWidth) return;
            fittedWidth = containerElement.clientWidth;
            fitPreview(containerElement, pageElement, scaleElement);
        });
    };
    if (typeof ResizeObserver === "function") {
        new ResizeObserver(fitInNextFrame).observe(containerElement);
    } else {
        globalThis.addEventListener("resize", fitInNextFrame);
    }
    return scaleElement;
}
