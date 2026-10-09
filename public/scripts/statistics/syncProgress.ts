/**
 * One request the synchronization waits for, as the progress panel shows it.
 */
export interface SyncSource {
    /** The name shown on the row, e.g. "Display layouts". */
    label: string;
    /** The request. Its result is only looked at to say how much came back. */
    promise: Promise<unknown>;
    /** What one item of the result is called, singular and plural, e.g. ["app", "apps"]. */
    unit: [string, string];
}

/** Options for tests, which need a clock they control and no lingering panel. */
export interface SyncProgressOptions {
    /** Answers the current time in milliseconds. */
    now?: () => number;
    /** How long a successful panel stays up before it closes itself. */
    closeDelayMs?: number;
}

/**
 * How much came back: the length of a list, or the number of keys of an object, counted in the source's unit.
 *
 * @param {unknown} result - What the request resolved to.
 * @param {[string, string]} unit - The singular and plural name of one item.
 * @returns {string} For example "26 apps", or an empty string when the result is neither a list nor an object.
 */
export function describeSyncResult(result: unknown, [singular, plural]: [string, string]) {
    let count: number;
    if (Array.isArray(result)) {
        count = result.length;
    } else if (result && typeof result === "object") {
        count = Object.keys(result).length;
    } else {
        return "";
    }
    return `${count} ${count === 1 ? singular : plural}`;
}

/**
 * Formats a duration the way the panel shows it, in seconds with one decimal.
 *
 * @param {number} milliseconds
 * @returns {string} For example "3.1 s".
 */
export function formatSyncDuration(milliseconds: number) {
    return `${(Math.max(0, milliseconds) / 1000).toFixed(1)} s`;
}

/**
 * Creates an element with a class and, optionally, its text.
 *
 * @param {string} tagName
 * @param {string} className
 * @param {string} [text]
 * @returns {HTMLElement}
 */
function createElement(tagName: string, className: string, text?: string) {
    const element = document.createElement(tagName);
    element.classList.add(className);
    if (text !== undefined) {
        element.textContent = text;
    }
    return element;
}

/**
 * Shows the synchronization's progress in a panel over the page, one row per request.
 *
 * Each row waits, then says how much came back and how long it took, or why it failed. A progress bar and a running
 * clock sit above them. When every request has succeeded the panel closes itself after a moment. When any has failed
 * it stays open with the reasons and a Close button, since a panel that closed would leave nothing to read, and one
 * that never closed was what a failed request used to leave behind.
 *
 * @param {SyncSource[]} sources - The requests, in the order they are shown.
 * @param {SyncProgressOptions} [options]
 * @returns {HTMLElement} The panel's backdrop, already appended to the document body.
 */
export function showSyncProgress(sources: SyncSource[], { now = () => Date.now(), closeDelayMs = 1000 }: SyncProgressOptions = {}) {
    const startedAt = now();
    const total = sources.length;
    let settled = 0;
    let failed = 0;

    const backdropElement = createElement("div", "sync-progress-backdrop");
    const panelElement = createElement("section", "sync-progress");
    panelElement.setAttribute("role", "dialog");
    panelElement.setAttribute("aria-labelledby", "sync-progress-title");
    backdropElement.appendChild(panelElement);

    const headerElement = createElement("header", "sync-progress-header");
    const titleElement = createElement("h2", "sync-progress-title", "Synchronizing data");
    titleElement.id = "sync-progress-title";
    const elapsedElement = createElement("span", "sync-progress-elapsed", formatSyncDuration(0));
    headerElement.appendChild(titleElement);
    headerElement.appendChild(elapsedElement);
    panelElement.appendChild(headerElement);

    const barRowElement = createElement("div", "sync-progress-bar-row");
    const barElement = document.createElement("progress");
    barElement.classList.add("sync-progress-bar");
    barElement.max = total;
    barElement.value = 0;
    const countElement = createElement("span", "sync-progress-count", `0 of ${total}`);
    countElement.setAttribute("aria-live", "polite");
    barRowElement.appendChild(barElement);
    barRowElement.appendChild(countElement);
    panelElement.appendChild(barRowElement);

    const listElement = createElement("ul", "sync-progress-list");
    panelElement.appendChild(listElement);

    const updateElapsed = () => {
        elapsedElement.textContent = formatSyncDuration(now() - startedAt);
    };
    const timer = setInterval(updateElapsed, 100);

    const finish = () => {
        clearInterval(timer);
        updateElapsed();
        panelElement.classList.add(failed > 0 ? "is-failed" : "is-done");
        if (failed === 0) {
            titleElement.textContent = "Data synchronized";
            setTimeout(() => backdropElement.remove(), closeDelayMs);
            return;
        }
        titleElement.textContent = "Synchronization failed";
        panelElement.appendChild(
            createElement(
                "p",
                "sync-progress-note",
                `${failed} of ${total} could not be fetched, so nothing was saved. The tools keep using the data from the last synchronization.`
            )
        );
        const closeButton = createElement("button", "sync-progress-close", "Close") as HTMLButtonElement;
        closeButton.type = "button";
        closeButton.onclick = () => backdropElement.remove();
        panelElement.appendChild(closeButton);
        closeButton.focus();
    };

    const settle = () => {
        settled++;
        barElement.value = settled;
        countElement.textContent = `${settled} of ${total}`;
        if (settled === total) {
            finish();
        }
    };

    sources.forEach((source: SyncSource) => {
        const itemElement = createElement("li", "sync-progress-item");
        itemElement.classList.add("is-pending");
        const statusElement = createElement("span", "sync-progress-status");
        statusElement.setAttribute("aria-hidden", "true");
        const labelElement = createElement("span", "sync-progress-label", source.label);
        const detailElement = createElement("span", "sync-progress-detail", "waiting…");
        const timeElement = createElement("span", "sync-progress-time");
        itemElement.append(statusElement, labelElement, detailElement, timeElement);
        listElement.appendChild(itemElement);

        source.promise.then(
            (result: unknown) => {
                itemElement.classList.replace("is-pending", "is-done");
                detailElement.textContent = describeSyncResult(result, source.unit);
                timeElement.textContent = formatSyncDuration(now() - startedAt);
                settle();
            },
            (error: unknown) => {
                failed++;
                itemElement.classList.replace("is-pending", "is-failed");
                detailElement.textContent = error instanceof Error ? error.message : String(error);
                timeElement.textContent = formatSyncDuration(now() - startedAt);
                settle();
            }
        );
    });

    if (total === 0) {
        finish();
    }

    document.body.appendChild(backdropElement);
    return backdropElement;
}
