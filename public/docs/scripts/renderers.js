import { appendChildren } from "../../../src/functions/helpers.js";

function renderComponentExampleMarkup(componentExample) {
    const containerElement = document.createElement("details");
    containerElement.classList.add("component-example-code");

    const titleElement = document.createElement("summary");
    titleElement.classList.add("component-example-markup-title");
    titleElement.textContent = "Markup";
    containerElement.appendChild(titleElement);

    const codeElement = document.createElement("pre");
    const codeContentElement = document.createElement("code");
    codeContentElement.classList.add("language-json");
    codeContentElement.textContent = JSON.stringify(componentExample?.markup, null, 2);
    codeElement.appendChild(codeContentElement);
    containerElement.appendChild(codeElement);

    return containerElement;
}

function renderComponentExampleData(componentExample) {
    const containerElement = document.createElement("details");
    containerElement.classList.add("component-example-code");

    const titleElement = document.createElement("summary");
    titleElement.classList.add("component-example-data-title");
    titleElement.textContent = "Data";
    containerElement.appendChild(titleElement);

    const codeElement = document.createElement("pre");
    const codeContentElement = document.createElement("code");
    codeContentElement.classList.add("language-json");
    codeContentElement.textContent = JSON.stringify(componentExample?.data, null, 2);
    codeElement.appendChild(codeContentElement);
    containerElement.appendChild(codeElement);

    return containerElement;
}

function renderComponentExampleResources(componentExample) {
    const containerElement = document.createElement("details");
    containerElement.classList.add("component-example-code");

    const titleElement = document.createElement("summary");
    titleElement.classList.add("component-example-resources-title");
    titleElement.textContent = "Resources";
    containerElement.appendChild(titleElement);

    const codeElement = document.createElement("pre");
    const codeContentElement = document.createElement("code");
    codeContentElement.classList.add("language-json");
    codeContentElement.textContent = JSON.stringify(componentExample?.resources, null, 2);
    codeElement.appendChild(codeContentElement);
    containerElement.appendChild(codeElement);

    return containerElement;
}

function renderPreviewElement(componentExample) {
    const containerElement = document.createElement("div");
    containerElement.classList.add("component-example-preview");

    const previewElement = componentExample?.element;
    containerElement.appendChild(previewElement);

    return containerElement;
}

function renderComponentExample(componentExample) {
    const containerElement = document.createElement("div");
    containerElement.classList.add("component-example");

    const titleElement = document.createElement("h3");
    titleElement.id = `component-${componentExample?.markup?.tagName}`;
    titleElement.textContent = componentExample?.markup?.tagName;
    containerElement.appendChild(titleElement);

    const previewElement = renderPreviewElement(componentExample);
    containerElement.appendChild(previewElement);

    const markupElement = renderComponentExampleMarkup(componentExample);
    containerElement.appendChild(markupElement);

    const dataElement = renderComponentExampleData(componentExample);
    containerElement.appendChild(dataElement);

    const resourcesElement = renderComponentExampleResources(componentExample);
    containerElement.appendChild(resourcesElement);

    return containerElement;
}

export function renderResults(results) {
    const containerElement = document.getElementById("code-results");
    containerElement.innerHTML = "";
    const resultElements = results.map((componentType) => {
        const typeContainerElement = document.createElement("div");
        typeContainerElement.classList.add("component-type-section");

        const typeTitleElement = document.createElement("h2");
        typeTitleElement.id = `component-type-${componentType.type}`;
        typeTitleElement.textContent = componentType.type;
        typeContainerElement.appendChild(typeTitleElement);

        const componentsContainerElement = document.createElement("div");
        componentsContainerElement.classList.add("components-container");

        const componentElements = componentType.components.map((componentExample) => {
            return renderComponentExample(componentExample);
        });

        appendChildren(componentsContainerElement, componentElements);
        typeContainerElement.appendChild(componentsContainerElement);

        return typeContainerElement;
    });

    appendChildren(containerElement, resultElements);
}

export function renderSidebar(results) {
    const sidebarElement = document.getElementById("sidebar");
    const navElement = document.createElement("nav");
    
    navElement.classList.add("component-type-list");

    results.forEach((componentType) => {
        const typeDetailsElement = document.createElement("details");
        typeDetailsElement.open = true;
        const typeTitleElement = document.createElement("summary");
        typeTitleElement.textContent = componentType.type;
        typeDetailsElement.appendChild(typeTitleElement);
        typeDetailsElement.appendChild(typeTitleElement);

        const componentsUlElement = document.createElement("ul");
        componentsUlElement.classList.add("component-list");

        componentType.components.forEach((componentExample) => {
            const componentLiElement = document.createElement("li");
            const componentLinkElement = document.createElement("a");
            componentLinkElement.textContent = componentExample?.markup?.tagName;
            componentLinkElement.href = `#component-${componentExample?.markup?.tagName}`;
            componentLiElement.appendChild(componentLinkElement);
            componentsUlElement.appendChild(componentLiElement);
        });

        typeDetailsElement.appendChild(componentsUlElement);
        navElement.appendChild(typeDetailsElement);
    });

    sidebarElement.appendChild(navElement);
}
