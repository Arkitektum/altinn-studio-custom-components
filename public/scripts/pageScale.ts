/** The width of an A4 page in each orientation, as the page views draw it. */
export const PAGE_WIDTHS = { portrait: "21cm", landscape: "29.7cm" } as const;

export type PageOrientation = keyof typeof PAGE_WIDTHS;

/** The smallest a page is shown at to fit. Below it the text gets too small to read, and the page scrolls sideways instead. */
export const MIN_PAGE_SCALE = 0.5;

/**
 * A length in centimetres as CSS pixels, at 96 pixels to the inch.
 *
 * @param {number} centimetres - The length.
 * @returns {number} The length in CSS pixels.
 */
export function centimetresToPixels(centimetres: number) {
    return (centimetres * 96) / 2.54;
}

/**
 * How much to shrink something so it fits the width there is, never past full size or below MIN_PAGE_SCALE.
 *
 * @param {number} availableWidth - The width there is, in CSS pixels.
 * @param {number} contentWidth - The width it takes at full size, in CSS pixels.
 * @returns {number} The scale, 1 for full size.
 */
export function getFitScale(availableWidth: number, contentWidth: number) {
    if (!(contentWidth > 0) || Number.isNaN(availableWidth)) return 1;
    return Math.min(1, Math.max(MIN_PAGE_SCALE, availableWidth / contentWidth));
}
