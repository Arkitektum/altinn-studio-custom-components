const TYPE_CONFIG = {
    base: { label: "B", color: "#89b4fa", bgColor: "#1a1a35", borderColor: "#3d3d7a", rightPx: 2, typeName: "Base" },
    data: { label: "D", color: "#a6e3a1", bgColor: "#0d2518", borderColor: "#2a5e3a", rightPx: 26, typeName: "Data" },
    layout: { label: "L", color: "#cba6f7", bgColor: "#1e0838", borderColor: "#5a2a7a", rightPx: 50, typeName: "Layout" }
};

/**
 * Checks if the application is running in development mode based on the URL parameter "devtools".
 * @returns {boolean} True if in development mode, false otherwise.
 */
export function isDevMode() {
    return new URLSearchParams(globalThis.location?.search ?? "").get("devtools") === "true";
}

/**
 * Truncates a string to a specified maximum length, adding an ellipsis if the string exceeds the limit.
 * @param {string} str - The string to truncate.
 * @param {number} [maxLen=80] - The maximum length of the string.
 * @returns {string} The truncated string.
 */
function truncate(str, maxLen = 80) {
    return str.length > maxLen ? str.slice(0, maxLen) + "\u2026" : str;
}

/**
 * Extracts and formats the properties of a component for display in the DevTools panel, filtering out undefined, null, false, and empty string values.
 * @param {*} component - The component object to extract properties from.
 * @returns {Array} An array of key-value pairs representing the component's properties.
 */
function getComponentProperties(component) {
    return Object.entries(component)
        .filter(([, v]) => v !== undefined && v !== null && v !== false && v !== "")
        .map(([key, value]) => ({
            key,
            value: truncate(typeof value === "object" ? JSON.stringify(value) : String(value))
        }));
}

/**
 * Builds a DevTools panel element for a given component, displaying its tag name, properties, and hidden status.
 * @param {*} tagName - The tag name of the component.
 * @param {*} elementId - The ID of the component element.
 * @param {*} props - The properties of the component.
 * @param {*} hidden - Whether the component is hidden.
 * @param {*} type - The type of the component (default is "base").
 * @returns {HTMLElement} The DevTools panel element.
 */
function buildPanel(tagName, elementId, props, hidden, type) {
    const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.base;
    const panel = document.createElement("div");
    panel.style.cssText = [
        "display: none",
        "position: absolute",
        "top: 22px",
        `right: ${cfg.rightPx}px`,
        "min-width: 200px",
        "max-width: 380px",
        "background: #1e1e2e",
        "color: #cdd6f4",
        "border: 1px solid #45475a",
        "border-radius: 6px",
        "padding: 8px 10px",
        "font-family: 'Courier New', monospace",
        "font-size: 11px",
        "z-index: 10000",
        "box-shadow: 0 4px 16px rgba(0,0,0,0.5)",
        "line-height: 1.6",
        "text-align: left"
    ].join("; ");

    const typeBadge = `<span style="background:${cfg.bgColor};color:${cfg.color};border:1px solid ${cfg.borderColor};padding:1px 5px;border-radius:3px;font-size:9px;margin-right:4px;vertical-align:middle;">${cfg.typeName}</span>`;
    const hiddenBadge = hidden
        ? `<span style="background:#45475a;color:#f38ba8;padding:1px 5px;border-radius:3px;font-size:9px;margin-left:4px;vertical-align:middle;">hidden</span>`
        : "";

    let html = `<div style="font-weight:bold;font-size:12px;margin-bottom:6px;color:${cfg.color};">${typeBadge}&lt;${tagName}&gt;${hiddenBadge}</div>`;

    if (elementId) {
        html += `<div><span style="color:#89dceb;">id</span><span style="color:#585b70;">: </span><span style="color:#a6e3a1;">"${elementId}"</span></div>`;
    }

    for (const { key, value } of props) {
        html += `<div><span style="color:#89dceb;">${key}</span><span style="color:#585b70;">: </span><span style="color:#a6e3a1;">${value}</span></div>`;
    }

    panel.innerHTML = html;
    return panel;
}

/**
 * Builds a button element for the DevTools overlay.
 * @param {*} hidden - Whether the button represents a hidden component.
 * @param {*} type - The type of the component (default is "base").
 * @returns {HTMLElement} The button element for the DevTools overlay.
 */
function buildButton(hidden, type) {
    const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.base;
    const button = document.createElement("button");
    button.style.cssText = [
        "position: absolute",
        "top: 2px",
        `right: ${cfg.rightPx}px`,
        "width: 20px",
        "height: 20px",
        `background: ${hidden ? "#2a2a3a" : cfg.bgColor}`,
        `color: ${hidden ? "#6c7086" : cfg.color}`,
        `border: 1px solid ${hidden ? "#45475a" : cfg.borderColor}`,
        "border-radius: 3px",
        "cursor: pointer",
        "font-size: 9px",
        "font-family: 'Courier New', monospace",
        "font-weight: bold",
        "display: flex",
        "align-items: center",
        "justify-content: center",
        "z-index: 9999",
        "padding: 0",
        "line-height: 1"
    ].join("; ");
    button.textContent = cfg.label;
    button.title = `${cfg.typeName} component${hidden ? " (hidden)" : ""} \u2014 click for details`;
    return button;
}

/**
 * Adds a DevTools overlay to a given DOM element for inspecting component properties.
 * @param {*} element - The DOM element to attach the DevTools overlay to.
 * @param {*} component - The component instance to inspect.
 * @param {*} type - The type of the component (default is "base").
 * @returns {void}
 */
export function addDevToolsOverlay(element, component, type = "base") {
    if (!isDevMode()) return;
    if (!element.style.position) {
        element.style.position = "relative";
    }
    const tagName = element.tagName.toLowerCase();
    const props = getComponentProperties(component);
    const panel = buildPanel(tagName, element.id || null, props, false, type);
    const button = buildButton(false, type);
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        panel.style.display = panel.style.display === "none" ? "block" : "none";
    });
    element.appendChild(button);
    element.appendChild(panel);
}

/**
 * Renders a hidden DevTools element for a given component.
 * @param {*} element - The DOM element to attach the DevTools overlay to.
 * @param {*} component - The component instance to inspect.
 * @param {*} type - The type of the component (default is "base").
 * @returns {HTMLElement|null} The container element for the hidden DevTools overlay, or null if not in dev mode.
 */
export function renderHiddenDevToolsElement(element, component, type = "base") {
    if (!isDevMode()) return null;
    const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.base;
    const tagName = element.tagName.toLowerCase();
    const props = getComponentProperties(component);

    const container = document.createElement("div");
    container.style.cssText = [
        "position: relative",
        "display: inline-flex",
        "align-items: center",
        "gap: 6px",
        "padding: 2px 28px 2px 8px",
        `background: ${cfg.bgColor}`,
        `border: 1px dashed ${cfg.borderColor}`,
        "border-radius: 4px",
        `color: ${cfg.color}`,
        "font-family: 'Courier New', monospace",
        "font-size: 11px",
        "opacity: 0.8"
    ].join("; ");

    const typeLabel = document.createElement("span");
    typeLabel.style.cssText = `background:${cfg.bgColor};color:${cfg.color};border:1px solid ${cfg.borderColor};padding:1px 4px;border-radius:3px;font-size:9px;`;
    typeLabel.textContent = cfg.typeName;

    const tagLabel = document.createElement("span");
    tagLabel.style.color = cfg.color;
    tagLabel.textContent = `<${tagName}>`;

    const hiddenBadge = document.createElement("span");
    hiddenBadge.style.color = "#6c7086";
    hiddenBadge.textContent = "hidden";

    const panel = buildPanel(tagName, element.id || null, props, true, type);
    const button = buildButton(true, type);
    button.style.position = "absolute";
    button.style.top = "2px";
    button.style.right = "2px";

    button.addEventListener("click", (e) => {
        e.stopPropagation();
        panel.style.display = panel.style.display === "none" ? "block" : "none";
    });

    container.appendChild(typeLabel);
    container.appendChild(tagLabel);
    container.appendChild(hiddenBadge);
    container.appendChild(button);
    container.appendChild(panel);

    return container;
}
