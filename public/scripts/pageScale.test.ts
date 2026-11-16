import { MIN_PAGE_SCALE, PAGE_WIDTHS, centimetresToPixels, getFitScale } from "./pageScale.ts";

describe("centimetresToPixels", () => {
    it("counts 96 CSS pixels to the inch", () => {
        expect(centimetresToPixels(2.54)).toBeCloseTo(96, 10);
        expect(centimetresToPixels(Number.parseFloat(PAGE_WIDTHS.portrait))).toBeCloseTo((21 * 96) / 2.54, 10);
    });
});

describe("getFitScale", () => {
    it("is full size when it fits", () => {
        expect(getFitScale(800, 800)).toBe(1);
        expect(getFitScale(4000, 800)).toBe(1);
    });

    it("shrinks just enough to fit", () => {
        expect(getFitScale(600, 800)).toBe(0.75);
    });

    it("never shrinks below the smallest scale that is still readable", () => {
        expect(MIN_PAGE_SCALE).toBe(0.5);
        expect(getFitScale(100, 800)).toBe(0.5);
        expect(getFitScale(-20, 800)).toBe(0.5);
    });

    it("is full size when there is nothing to go by", () => {
        expect(getFitScale(Number.NaN, 800)).toBe(1);
        expect(getFitScale(600, 0)).toBe(1);
    });
});
