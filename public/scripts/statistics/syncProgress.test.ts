import { describeSyncResult, formatSyncDuration, showSyncProgress } from "./syncProgress.ts";

/** Lets every settled promise's handlers run, and any zero-delay timer after them. */
function flush() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

/** A promise with its resolve and reject handed out, so a test decides when each request answers. */
function deferred() {
    let resolve: (value: unknown) => void = () => {};
    let reject: (reason: unknown) => void = () => {};
    const promise = new Promise((resolveWith, rejectWith) => {
        resolve = resolveWith;
        reject = rejectWith;
    });
    return { promise, resolve, reject };
}

function rowTexts(panel: HTMLElement) {
    return Array.from(panel.querySelectorAll(".sync-progress-item")).map((item) => ({
        state: ["is-pending", "is-done", "is-failed"].find((state) => item.classList.contains(state)),
        label: item.querySelector(".sync-progress-label")!.textContent,
        detail: item.querySelector(".sync-progress-detail")!.textContent,
        time: item.querySelector(".sync-progress-time")!.textContent
    }));
}

describe("describeSyncResult", () => {
    it("counts a list, using the plural unless there is exactly one", () => {
        expect(describeSyncResult([1, 2, 3], ["app", "apps"])).toBe("3 apps");
        expect(describeSyncResult([1], ["app", "apps"])).toBe("1 app");
        expect(describeSyncResult([], ["app", "apps"])).toBe("0 apps");
    });

    it("counts the keys of an object", () => {
        expect(describeSyncResult({ a: "1.0.0", b: "2.0.0" }, ["package", "packages"])).toBe("2 packages");
    });

    it("says nothing about a result that is neither", () => {
        expect(describeSyncResult(null, ["app", "apps"])).toBe("");
        expect(describeSyncResult("text", ["app", "apps"])).toBe("");
    });
});

describe("formatSyncDuration", () => {
    it("shows seconds with one decimal", () => {
        expect(formatSyncDuration(3140)).toBe("3.1 s");
        expect(formatSyncDuration(0)).toBe("0.0 s");
    });

    it("never shows a negative time", () => {
        expect(formatSyncDuration(-50)).toBe("0.0 s");
    });
});

describe("showSyncProgress", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("shows a waiting row per request, in the order given", () => {
        const panel = showSyncProgress([
            { label: "Display layouts", promise: deferred().promise, unit: ["app", "apps"] },
            { label: "Example data", promise: deferred().promise, unit: ["entry", "entries"] }
        ]);

        expect(document.body.contains(panel)).toBe(true);
        expect(rowTexts(panel)).toEqual([
            { state: "is-pending", label: "Display layouts", detail: "waiting…", time: "" },
            { state: "is-pending", label: "Example data", detail: "waiting…", time: "" }
        ]);
        expect(panel.querySelector(".sync-progress-count")!.textContent).toBe("0 of 2");
    });

    it("marks a request done with how much came back and when, and moves the bar", async () => {
        let clock = 1000;
        const layouts = deferred();
        const panel = showSyncProgress(
            [
                { label: "Display layouts", promise: layouts.promise, unit: ["app", "apps"] },
                { label: "Example data", promise: deferred().promise, unit: ["entry", "entries"] }
            ],
            { now: () => clock }
        );

        clock = 4100;
        layouts.resolve([{}, {}, {}]);
        await flush();

        expect(rowTexts(panel)[0]).toEqual({ state: "is-done", label: "Display layouts", detail: "3 apps", time: "3.1 s" });
        expect(rowTexts(panel)[1]!.state).toBe("is-pending");
        expect((panel.querySelector(".sync-progress-bar") as HTMLProgressElement).value).toBe(1);
        expect(panel.querySelector(".sync-progress-count")!.textContent).toBe("1 of 2");
    });

    it("says it is done and closes itself once every request has succeeded", async () => {
        const panel = showSyncProgress([{ label: "Display layouts", promise: Promise.resolve([]), unit: ["app", "apps"] }], {
            closeDelayMs: 50
        });
        await flush();

        expect(panel.querySelector(".sync-progress-title")!.textContent).toBe("Data synchronized");
        expect(panel.querySelector(".sync-progress")!.classList.contains("is-done")).toBe(true);
        expect(document.body.contains(panel)).toBe(true);

        await new Promise((resolve) => setTimeout(resolve, 60));
        expect(document.body.contains(panel)).toBe(false);
    });

    it("shows why a request failed, counts it towards the bar, and stays open until closed", async () => {
        const panel = showSyncProgress(
            [
                { label: "Display layouts", promise: Promise.resolve([{}]), unit: ["app", "apps"] },
                { label: "Example data", promise: Promise.reject(new Error("Failed to fetch example data: Bad Gateway")), unit: ["entry", "entries"] }
            ],
            { closeDelayMs: 0 }
        );
        await flush();
        await flush();

        expect(rowTexts(panel)[1]).toMatchObject({ state: "is-failed", detail: "Failed to fetch example data: Bad Gateway" });
        expect(panel.querySelector(".sync-progress-count")!.textContent).toBe("2 of 2");
        expect(panel.querySelector(".sync-progress-title")!.textContent).toBe("Synchronization failed");
        expect(panel.querySelector(".sync-progress")!.classList.contains("is-failed")).toBe(true);
        expect(panel.querySelector(".sync-progress-note")!.textContent).toContain("1 of 2 could not be fetched, so nothing was saved");
        expect(document.body.contains(panel)).toBe(true);

        (panel.querySelector(".sync-progress-close") as HTMLButtonElement).click();
        expect(document.body.contains(panel)).toBe(false);
    });

    it("keeps the clock running while it waits and stops it when everything has answered", async () => {
        let clock = 0;
        const layouts = deferred();
        const panel = showSyncProgress([{ label: "Display layouts", promise: layouts.promise, unit: ["app", "apps"] }], {
            now: () => clock,
            closeDelayMs: 1000
        });
        const elapsed = panel.querySelector(".sync-progress-elapsed")!;

        clock = 2500;
        await new Promise((resolve) => setTimeout(resolve, 150));
        expect(elapsed.textContent).toBe("2.5 s");

        layouts.resolve([]);
        await flush();
        clock = 9000;
        await new Promise((resolve) => setTimeout(resolve, 150));
        expect(elapsed.textContent).toBe("2.5 s");
    });
});
