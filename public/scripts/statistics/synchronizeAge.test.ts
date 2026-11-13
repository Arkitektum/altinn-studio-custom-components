import { renderSynchronizeButton } from "./renderers.ts";

// Unmocked: renderers.test.ts mocks the API helpers to test synchronizing, this checks the age shown under the button.
describe("age under the Synchronize button", () => {
    const { setInterval: realSetInterval, clearInterval: realClearInterval } = globalThis;
    let timers: { callback: () => void; delay: number | undefined }[];
    let cleared: unknown[];

    beforeEach(() => {
        document.body.innerHTML = '<div id="sidebar"></div>';
        timers = [];
        cleared = [];
        globalThis.setInterval = ((callback: () => void, delay?: number) => {
            timers.push({ callback, delay });
            return timers.length as unknown as ReturnType<typeof setInterval>;
        }) as typeof setInterval;
        globalThis.clearInterval = ((id: unknown) => {
            cleared.push(id);
        }) as typeof clearInterval;
    });

    afterEach(() => {
        globalThis.setInterval = realSetInterval;
        globalThis.clearInterval = realClearInterval;
    });

    it("says how long ago the data was synchronized, and marks old data as stale", () => {
        globalThis.lastUpdated = new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString();
        renderSynchronizeButton();
        const age = document.querySelector("#sidebar .last-updated") as HTMLElement;
        expect(age.textContent).toBe("Synchronized 9 days ago (stale)");
        expect(age.classList.contains("stale")).toBe(true);
    });

    it("keeps the age current every minute while the page is open", () => {
        globalThis.lastUpdated = Date.now();
        renderSynchronizeButton();
        expect(timers).toHaveLength(1);
        expect(timers[0]!.delay).toBe(60 * 1000);
        globalThis.lastUpdated = Date.now() - 3 * 60 * 60 * 1000;
        timers[0]!.callback();
        expect(document.querySelector("#sidebar .last-updated")!.textContent).toBe("Synchronized 3 hours ago");
    });

    it("stops the earlier timer when the button is drawn again", () => {
        globalThis.lastUpdated = Date.now();
        renderSynchronizeButton();
        renderSynchronizeButton();
        expect(timers).toHaveLength(2);
        expect(cleared).toContain(1);
    });
});
