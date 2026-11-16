/**
 * One count beside an entry in a usage list, e.g. "Apps: 22". The number is kept in a span of its own so the counts line up in columns.
 *
 * A count of zero is marked, so it can be shown dimmed. A count that needs looking at when it is not zero, such as duplicates, is marked when it is not.
 *
 * @param {string} label - What is counted, e.g. "Apps".
 * @param {number} count - The count.
 * @param {string} className - The class of the count, which sets its column.
 * @param {Object} [options]
 * @param {boolean} [options.attentionWhenNotZero] - Mark the count when it is not zero.
 * @returns {HTMLSpanElement} The count, reading "Label: count".
 */
export function renderUsageCount(
    label: string,
    count: number,
    className: string,
    { attentionWhenNotZero = false }: { attentionWhenNotZero?: boolean } = {}
) {
    const countElement = document.createElement("span");
    countElement.classList.add(className);
    if (count === 0) {
        countElement.classList.add("usage-zero");
    } else if (attentionWhenNotZero) {
        countElement.classList.add("usage-attention");
    }
    const numberElement = document.createElement("span");
    numberElement.classList.add("usage-count");
    numberElement.textContent = String(count);
    countElement.append(`${label}: `, numberElement);
    return countElement;
}
