/**
 * The icons the dev tools put in front of a label, drawn as outlines on a 24 by 24 grid in the text colour.
 *
 * Each icon is a list of path data, so a new one is added here and nowhere else.
 */
const iconPaths = {
    book: ["M12 6.5C10 5 7 4.5 3 4.5v13c4 0 7 .5 9 2 2-1.5 5-2 9-2v-13c-4 0-7 .5-9 2z", "M12 6.5v13"],
    components: ["M4 4h6v6H4z", "M14 4h6v6h-6z", "M4 14h6v6H4z", "M17 13v8", "M13 17h8"],
    database: ["M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z", "M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6", "M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"],
    layout: ["M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", "M3 9h18", "M9 9v12"],
    package: ["M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z", "M3 7.5 12 12l9-4.5", "M12 12v9"],
    sort: ["M4 6h9", "M4 12h6", "M4 18h3", "M17 5v14", "M14 16l3 3 3-3"],
    trash: ["M4 7h16", "M9 7V4h6v3", "M6 7l1 13h10l1-13", "M10 11v6", "M14 11v6"]
};

export type IconName = keyof typeof iconPaths;

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

/**
 * Draws one of the icons. It is hidden from assistive technology, since the label next to it already says what it means.
 *
 * @param {IconName} name - Which icon to draw.
 * @returns {SVGSVGElement} The icon.
 */
export function createIcon(name: IconName): SVGSVGElement {
    const svgElement = document.createElementNS(SVG_NAMESPACE, "svg");
    svgElement.setAttribute("viewBox", "0 0 24 24");
    svgElement.setAttribute("fill", "none");
    svgElement.setAttribute("stroke", "currentColor");
    svgElement.setAttribute("stroke-width", "2");
    svgElement.setAttribute("stroke-linecap", "round");
    svgElement.setAttribute("stroke-linejoin", "round");
    svgElement.setAttribute("aria-hidden", "true");
    svgElement.classList.add("icon");
    for (const pathData of iconPaths[name]) {
        const pathElement = document.createElementNS(SVG_NAMESPACE, "path");
        pathElement.setAttribute("d", pathData);
        svgElement.appendChild(pathElement);
    }
    return svgElement;
}

/**
 * Gives an element an icon followed by a label, in place of whatever it held.
 *
 * @param {HTMLElement} element - The element to label, usually a button.
 * @param {IconName} name - Which icon to draw.
 * @param {string} label - The text after the icon.
 */
export function setIconLabel(element: HTMLElement, name: IconName, label: string) {
    element.replaceChildren(createIcon(name), document.createTextNode(label));
}
