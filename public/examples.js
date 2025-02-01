import {
    addContainerElement,
    createCustomElement,
    getCustomComponentDataFromFormdata
} from "../src/functions/helpers.js";

function addValueToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function getValueFromLocalStorage(key) {
    return localStorage.getItem(key);
}

function getDataModel() {
    return JSON.parse(getValueFromLocalStorage("dataModel"));
}

function getTextResources() {
    return JSON.parse(getValueFromLocalStorage("textResources"));
}

function getValueFromDataModelBinding(binding) {
    if (!binding) {
        return;
    }
    const path = binding?.split(/\.|\[|\]/).filter(Boolean);
    let value = getDataModel();
    for (let i = 0; i < path.length; i++) {
        value = value[path[i]];
    }
    return value;
}

function getValueFromTextResourceBinding(binding) {
    const textResources = getTextResources();
    const textResource = textResources.resources.find((resource) => resource.id === binding);
    return textResource?.value;
}

function handleTestCodeOnClick() {
    const codeInputElement = document.getElementById("code-input");
    const code = JSON.parse(codeInputElement.value);

    //const simpleBinding = code.dataModelBindings?.simpleBinding;
    const simpleBinding = code.dataModelBindings?.data;
    const tableColumns = code.tableColumns;
    const data = getValueFromDataModelBinding(simpleBinding);

    let texts = {};
    Object.keys(code.textResourceBindings).forEach((key) => {
        texts[key] = getValueFromTextResourceBinding(code.textResourceBindings[key]);
    });

    const tagName = code.tagName;
    const element = createCustomElement(tagName, { data, texts, tableColumns });
    const testElement = document.getElementById("test-element");
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
