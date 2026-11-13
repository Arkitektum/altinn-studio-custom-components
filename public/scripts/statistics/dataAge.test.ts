import { STALE_AFTER_DAYS, describeDataAge, renderDataAge } from "./dataAge.ts";

const now = new Date(2026, 10, 13, 12, 0, 0).getTime();
const minutes = (count: number) => now - count * 60 * 1000;
const hours = (count: number) => minutes(count * 60);
const days = (count: number) => hours(count * 24);

describe("describeDataAge", () => {
    it.each([
        [minutes(0), "Synchronized just now"],
        [now - 59 * 1000, "Synchronized just now"],
        [minutes(1), "Synchronized 1 minute ago"],
        [minutes(59), "Synchronized 59 minutes ago"],
        [now - 150 * 1000, "Synchronized 2 minutes ago"],
        [hours(1), "Synchronized 1 hour ago"],
        [hours(23), "Synchronized 23 hours ago"],
        [minutes(160), "Synchronized 2 hours ago"],
        [hours(24 * 3 + 20), "Synchronized 3 days ago"],
        [days(1), "Synchronized yesterday"],
        [days(6), "Synchronized 6 days ago"],
        [days(STALE_AFTER_DAYS), "Synchronized 7 days ago (stale)"],
        [days(40), "Synchronized 40 days ago (stale)"]
    ])("describes %p", (lastUpdated, text) => {
        expect(describeDataAge(lastUpdated, now).text).toBe(text);
    });
    it("reads the ISO timestamp a synchronization stores", () => {
        expect(describeDataAge(new Date(hours(3)).toISOString(), now).text).toBe("Synchronized 3 hours ago");
    });
    it("marks data as stale from STALE_AFTER_DAYS on", () => {
        expect(describeDataAge(days(STALE_AFTER_DAYS) + 1, now).stale).toBe(false);
        expect(describeDataAge(days(STALE_AFTER_DAYS), now).stale).toBe(true);
    });
    it("gives the exact time for the tooltip, and says why stale data is", () => {
        expect(describeDataAge(hours(3), now).title).toBe(`Synchronized ${new Date(hours(3)).toLocaleString()}`);
        expect(describeDataAge(days(9), now).title).toBe(
            `Synchronized ${new Date(days(9)).toLocaleString()}. Older than 7 days, synchronize to see recent changes.`
        );
    });
    it("reads a time ahead of the clock as just now", () => {
        expect(describeDataAge(now + 2 * 60 * 60 * 1000, now).text).toBe("Synchronized just now");
    });
    it.each([[undefined], [null], [0], [""], ["not a date"]])("says the data was never synchronized for %p", (lastUpdated) => {
        expect(describeDataAge(lastUpdated, now)).toEqual({ text: "Not synchronized yet", title: "", stale: true });
    });
});

describe("renderDataAge", () => {
    it("shows the age with the exact time as its tooltip", () => {
        const element = document.createElement("span");
        renderDataAge(element, hours(2), now);
        expect(element.textContent).toBe("Synchronized 2 hours ago");
        expect(element.title).toBe(`Synchronized ${new Date(hours(2)).toLocaleString()}`);
        expect(element.classList.contains("stale")).toBe(false);
    });
    it("marks stale data, and unmarks it once it is fresh again", () => {
        const element = document.createElement("span");
        renderDataAge(element, days(8), now);
        expect(element.classList.contains("stale")).toBe(true);
        renderDataAge(element, minutes(0), now);
        expect(element.classList.contains("stale")).toBe(false);
    });
});
