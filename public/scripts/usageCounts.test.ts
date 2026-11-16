import { renderUsageCount } from "./usageCounts.ts";

describe("renderUsageCount", () => {
    it("reads as the label and the count, with the number in a span of its own", () => {
        const count = renderUsageCount("Apps", 22, "app-usage");
        expect(count.textContent).toBe("Apps: 22");
        expect(count.classList.contains("app-usage")).toBe(true);
        expect(count.querySelector(".usage-count")!.textContent).toBe("22");
    });

    it("marks a count of zero, and only that", () => {
        expect(renderUsageCount("Apps", 0, "app-usage").classList.contains("usage-zero")).toBe(true);
        expect(renderUsageCount("Apps", 1, "app-usage").classList.contains("usage-zero")).toBe(false);
    });

    it("marks a count that needs looking at only when it is not zero", () => {
        expect(renderUsageCount("Duplicates", 2, "duplicate-usage", { attentionWhenNotZero: true }).classList.contains("usage-attention")).toBe(true);
        const zero = renderUsageCount("Duplicates", 0, "duplicate-usage", { attentionWhenNotZero: true });
        expect(zero.classList.contains("usage-attention")).toBe(false);
        expect(zero.classList.contains("usage-zero")).toBe(true);
        expect(renderUsageCount("Apps", 2, "app-usage").classList.contains("usage-attention")).toBe(false);
    });

    it("keeps the label as text, so markup in it is shown rather than parsed", () => {
        const count = renderUsageCount("<b>Apps</b>", 1, "app-usage");
        expect(count.querySelector("b")).toBeNull();
    });
});
