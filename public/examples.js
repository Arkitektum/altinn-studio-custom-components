import {
    addContainerElement,
    createCustomElement,
    getCustomComponentDataFromFormdata,
    getCustomComponentProps,
    getValueFromDataKey
} from "../src/functions/helpers.js";

function removeTrailingOrLeadingComma(value) {
    return value.replace(/(^,)|(,$)/g, "");
}

function addValueToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function getValueFromLocalStorage(key) {
    return localStorage.getItem(key);
}

function getDataModel() {
    return JSON.parse(removeTrailingOrLeadingComma(getValueFromLocalStorage("dataModel")));
}

function getTextResources() {
    return JSON.parse(removeTrailingOrLeadingComma(getValueFromLocalStorage("textResources")));
}

function getValueFromTextResourceBinding(binding) {
    const textResources = getTextResources();
    const textResource = textResources.resources.find((resource) => resource.id === binding);
    return textResource?.value;
}

function getDataForComponent(component) {
    const dataModel = getDataModel();
    const simpleBinding = getCustomComponentDataFromFormdata(component?.dataModelBindings);
    const data = getValueFromDataKey(dataModel, simpleBinding);
    return data;
}

function getTextsForComponent(component) {
    let texts = {};
    Object.keys(component?.textResourceBindings).forEach((key) => {
        const textResourceBinding = component.textResourceBindings[key];
        texts[key] = getValueFromTextResourceBinding(textResourceBinding);
    });
    return texts;
}

function getComponent() {
    const codeInputElement = document.getElementById("code-input");
    const component = JSON.parse(removeTrailingOrLeadingComma(codeInputElement.value));
    return component;
}

function handleTestCodeOnClick() {
    const component = getComponent();
    const data = getDataForComponent(component);
    const texts = getTextsForComponent(component);
    const { tagName, hideTitle, hideIfEmpty, emptyFieldText, itemKey, tableColumns, size, styleOverride } = component;
    const element = createCustomElement(tagName, {
        data,
        texts,
        tagName,
        hideTitle,
        hideIfEmpty,
        emptyFieldText,
        itemKey,
        tableColumns,
        size,
        styleOverride
    });
    const testElement = document.getElementById("code-results");
    testElement.innerHTML = "";
    testElement.appendChild(addContainerElement(element));
}

function initInputElements() {
    const codeInputElement = document.getElementById("code-input");
    const dataModelInputElement = document.getElementById("data-model-input");
    const textResourcesInputElement = document.getElementById("text-resources-input");

    codeInputElement.onchange = function () {
        addValueToLocalStorage("code", codeInputElement.value);
    };
    dataModelInputElement.onchange = function () {
        addValueToLocalStorage("dataModel", dataModelInputElement.value);
    };
    textResourcesInputElement.onchange = function () {
        addValueToLocalStorage("textResources", textResourcesInputElement.value);
    };

    codeInputElement.value = getValueFromLocalStorage("code") || "";
    dataModelInputElement.value = getValueFromLocalStorage("dataModel") || "";
    textResourcesInputElement.value = getValueFromLocalStorage("textResources") || "";
}

window.onload = function () {
    const testCodeButtonElement = document.getElementById("test-code-button");
    testCodeButtonElement.onclick = handleTestCodeOnClick;

    initInputElements();
};
