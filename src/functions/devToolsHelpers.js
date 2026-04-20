export function isDevMode() {
    return new URLSearchParams(globalThis.location?.search ?? "").get("devtools") === "true";
}

function truncate(str, maxLen = 80) {
    return str.length > maxLen ? str.slice(0, maxLen) + "\u2026" : str;
}

function getComponentProperties(component) {
    return Object.entries(component)
        .filter(([, v]) => v !== undefined && v !== null && v !== false && v !== "")
        .map(([key, value]) => ({
            key,
            value: truncate(typeof value === "object" ? JSON.stringify(value) : String(value))
        }));
}

function buildPanel(tagName, elementId, props, hidden) {
    const panel = document.createElement("div");
    panel.style.cssText = [
        "display: none",
        "position: absolute",
        "top: 22px",
        "right: 0",
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

    const statusBadge = hidden
        ? `<span style="background:#45475a;color:#f38ba8;padding:1px 5px;border-radius:3px;font-size:9px;margin-left:6px;vertical-align:middle;">hidden</span>`
        : "";

    let html = `<div style="font-weight:bold;font-size:12px;margin-bottom:6px;color:#89b4fa;">&lt;${tagName}&gt;${statusBadge}</div>`;

    if (elementId) {
        html += `<div><span style="color:#89dceb;">id</span><span style="color:#585b70;">: </span><span style="color:#a6e3a1;">"${elementId}"</span></div>`;
    }

    for (const { key, value } of props) {
        html += `<div><span style="color:#89dceb;">${key}</span><span style="color:#585b70;">: </span><span style="color:#a6e3a1;">${value}</span></div>`;
    }

    panel.innerHTML = html;
    return panel;
}

function buildButton(hidden) {
    const button = document.createElement("button");
    button.style.cssText = [
        "position: absolute",
        "top: 2px",
        "right: 2px",
        "width: 20px",
        "height: 20px",
        `background: ${hidden ? "#45475a" : "#313244"}`,
        `color: ${hidden ? "#f38ba8" : "#89b4fa"}`,
        "border: 1px solid #45475a",
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
    button.textContent = "{}";
    button.title = hidden ? "Hidden component \u2014 click for details" : "Component info";
    return button;
}

export function addDevToolsOverlay(element, component) {
    if (!isDevMode()) return;
    if (!element.style.position) {
        element.style.position = "relative";
    }
    const tagName = element.tagName.toLowerCase();
    const props = getComponentProperties(component);
    const panel = buildPanel(tagName, element.id || null, props, false);
    const button = buildButton(false);
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        panel.style.display = panel.style.display === "none" ? "block" : "none";
    });
    element.appendChild(button);
    element.appendChild(panel);
}

export function renderHiddenDevToolsElement(element, component) {
    if (!isDevMode()) return null;
    const tagName = element.tagName.toLowerCase();
    const props = getComponentProperties(component);

    const container = document.createElement("div");
    container.style.cssText = [
        "position: relative",
        "display: inline-flex",
        "align-items: center",
        "gap: 6px",
        "padding: 2px 28px 2px 8px",
        "background: #1e1e2e",
        "border: 1px dashed #45475a",
        "border-radius: 4px",
        "color: #6c7086",
        "font-family: 'Courier New', monospace",
        "font-size: 11px"
    ].join("; ");

    const label = document.createElement("span");
    label.style.color = "#f38ba8";
    label.textContent = `<${tagName}>`;

    const hiddenBadge = document.createElement("span");
    hiddenBadge.textContent = "hidden";

    const panel = buildPanel(tagName, element.id || null, props, true);
    const button = buildButton(true);

    button.addEventListener("click", (e) => {
        e.stopPropagation();
        panel.style.display = panel.style.display === "none" ? "block" : "none";
    });

    container.appendChild(label);
    container.appendChild(hiddenBadge);
    container.appendChild(button);
    container.appendChild(panel);

    return container;
}
