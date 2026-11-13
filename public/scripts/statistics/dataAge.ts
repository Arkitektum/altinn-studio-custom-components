/**
 * How old the synchronized data is, for the line under the Synchronize button.
 */

/** Data synchronized this many days ago or longer is marked as stale. */
export const STALE_AFTER_DAYS = 7;

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const relativeTimeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/**
 * Describes how long ago the data was synchronized.
 *
 * @param {string|number|null|undefined} lastUpdated - When it was synchronized, as stored.
 * @param {number} [now] - The time to measure from.
 * @returns {{ text: string, title: string, stale: boolean }} The text to show, the exact time for its tooltip, and whether it is old enough to synchronize again.
 */
export function describeDataAge(lastUpdated: string | number | null | undefined, now = Date.now()) {
    const time = lastUpdated ? new Date(lastUpdated).getTime() : Number.NaN;
    if (Number.isNaN(time)) {
        return { text: "Not synchronized yet", title: "", stale: true };
    }
    // A time ahead of the clock gives a negative age, which reads as just now.
    const age = now - time;
    let ago: string;
    if (age < MINUTE) {
        ago = "just now";
    } else if (age < HOUR) {
        ago = relativeTimeFormat.format(-Math.floor(age / MINUTE), "minute");
    } else if (age < DAY) {
        ago = relativeTimeFormat.format(-Math.floor(age / HOUR), "hour");
    } else {
        ago = relativeTimeFormat.format(-Math.floor(age / DAY), "day");
    }
    const stale = age >= STALE_AFTER_DAYS * DAY;
    return {
        text: `Synchronized ${ago}${stale ? " (stale)" : ""}`,
        title: `Synchronized ${new Date(time).toLocaleString()}${stale ? `. Older than ${STALE_AFTER_DAYS} days, synchronize to see recent changes.` : ""}`,
        stale
    };
}

/**
 * Shows how old the data is in the given element, marking it as stale when it is.
 *
 * @param {HTMLElement} element - The element.
 * @param {string|number|null|undefined} lastUpdated - When the data was synchronized.
 * @param {number} [now] - The time to measure from.
 */
export function renderDataAge(element: HTMLElement, lastUpdated: string | number | null | undefined, now = Date.now()) {
    const { text, title, stale } = describeDataAge(lastUpdated, now);
    element.textContent = text;
    element.title = title;
    element.classList.toggle("stale", stale);
}
