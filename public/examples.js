import CustomElementHtmlAttributes from "../src/classes/system-classes/CustomElementHtmlAttributes.js";
import { addContainerElement, createCustomElement, getValueFromDataKey } from "../src/functions/helpers.js";

function removeTrailingOrLeadingComma(value) {
    return value.replace(/(^,)|(,$)/g, "");
}

function addValueToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function getValueFromLocalStorage(key) {
    return localStorage.getItem(key);
}

function getDataModels() {
    return JSON.parse(removeTrailingOrLeadingComma(getValueFromLocalStorage("dataModels")));
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
    const dataModels = getDataModels();
    const data = {};
    component?.dataModelBindings &&
        Object.keys(component?.dataModelBindings).forEach((key) => {
            const dataModelBinding = component.dataModelBindings[key];
            if (typeof dataModelBinding === "string") {
                const index = 0;
                const dataModel = dataModels[index]?.data;
                const dataModelData = getValueFromDataKey(dataModel, dataModelBinding);
                data[key] = dataModelData !== undefined ? dataModelData : dataModelBinding;
            } else if (typeof dataModelBinding === "object") {
                const index = dataModels.findIndex((dataModel) => dataModel.dataType === dataModelBinding.dataType);
                const dataModel = dataModels[index]?.data;
                const dataModelData = getValueFromDataKey(dataModel, dataModelBinding.field);
                data[key] = dataModelData !== undefined ? dataModelData : dataModelBinding.data;
            }
        });
    return data;
}

function getTextsForComponent(component) {
    let texts = {};
    const textResourceBindings = component?.textResourceBindings;
    const textResourcesBindingsKeys = textResourceBindings && Object.keys(textResourceBindings);
    textResourcesBindingsKeys?.length &&
        textResourcesBindingsKeys.forEach((key) => {
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
    const htmlAttributes = new CustomElementHtmlAttributes({
        ...component,
        formData: data,
        texts,
        textResources: getTextResources()
    });
    const element = createCustomElement(component?.tagName, htmlAttributes);
    const testElement = document.getElementById("code-results");
    testElement.innerHTML = "";
    testElement.appendChild(addContainerElement(element));
}

function getDataModelSummaryText(dataModel, index) {
    const dataModelType = index === 0 ? `${dataModel.dataType} (default)` : dataModel.dataType;
    return `Data model ${index + 1} - ${dataModelType}`;
}

function handleDataModelTypeOnChange(index) {
    const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
    const dataModelTypeInputElement = document.getElementById(`data-model-type-input-${index}`);
    dataModels[index].dataType = dataModelTypeInputElement.value;
    addValueToLocalStorage("dataModels", JSON.stringify(dataModels));
    renderDataModelElements();
}

function handleDataModelDataOnChange(index) {
    const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
    const dataModelDataInputElement = document.getElementById(`data-model-data-input-${index}`);
    dataModels[index].data = JSON.parse(dataModelDataInputElement.value);
    addValueToLocalStorage("dataModels", JSON.stringify(dataModels));
    renderDataModelElements();
}

function handleDataModelSummaryOnClick(index, dataModelElement) {
    const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
    if (dataModels[index]?.expanded !== undefined) {
        dataModels[index].expanded = !dataModels[index].expanded;
        addValueToLocalStorage("dataModels", JSON.stringify(dataModels));
        dataModelElement.open = dataModels[index].expanded;
        renderDataModelElements();
    }
}

function renderDataModelElements() {
    const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
    const dataModelContainerElement = document.getElementById("data-models-container");
    dataModelContainerElement.innerHTML = "";
    dataModels.forEach((dataModel, index) => {
        const dataModelElement = document.createElement("details");
        dataModelElement.id = `data-model-summary-${index}`;
        const dataModelSummaryElement = document.createElement("summary");
        dataModelSummaryElement.innerHTML = getDataModelSummaryText(dataModel, index);
        dataModelSummaryElement.onclick = function () {
            handleDataModelSummaryOnClick(index, dataModelElement);
        };
        dataModelElement.open = dataModel.expanded;

        const dataModelRemoveButtonElement = document.createElement("button");
        dataModelRemoveButtonElement.classList.add("summary-button", "remove-button");
        dataModelRemoveButtonElement.innerHTML = "Remove";
        dataModelRemoveButtonElement.onclick = function () {
            const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
            dataModels.splice(index, 1);
            addValueToLocalStorage("dataModels", JSON.stringify(dataModels));
            renderDataModelElements();
        };
        dataModelSummaryElement.appendChild(dataModelRemoveButtonElement);

        dataModelElement.appendChild(dataModelSummaryElement);

        const dataModelFormElement = document.createElement("div");
        dataModelFormElement.classList.add("data-model-form");

        const dataModelTypeLabelElement = document.createElement("label");
        dataModelTypeLabelElement.innerHTML = "Data type";
        dataModelTypeLabelElement.setAttribute("for", `data-model-type-input-${index}`);
        dataModelFormElement.appendChild(dataModelTypeLabelElement);

        const dataModelTypeInputElement = document.createElement("input");
        dataModelTypeInputElement.id = `data-model-type-input-${index}`;
        dataModelTypeInputElement.value = dataModel.dataType;
        dataModelTypeInputElement.onchange = function () {
            handleDataModelTypeOnChange(index);
        };
        dataModelFormElement.appendChild(dataModelTypeInputElement);

        const dataModelDataLabelElement = document.createElement("label");
        dataModelDataLabelElement.innerHTML = "Data";
        dataModelDataLabelElement.setAttribute("for", `data-model-data-input-${index}`);
        dataModelFormElement.appendChild(dataModelDataLabelElement);

        const dataModelDataInputElement = document.createElement("textarea");
        dataModelDataInputElement.id = `data-model-data-input-${index}`;
        dataModelDataInputElement.value = JSON.stringify(dataModel.data, null, 2);
        dataModelDataInputElement.onchange = function () {
            handleDataModelDataOnChange(index);
        };
        dataModelFormElement.appendChild(dataModelDataInputElement);

        dataModelElement.appendChild(dataModelFormElement);

        dataModelContainerElement.appendChild(dataModelElement);
    });
}

function addDataModel() {
    const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
    dataModels.push({ data: "", dataType: "", expanded: true });
    addValueToLocalStorage("dataModels", JSON.stringify(dataModels));
    renderDataModelElements();
}

function initInputElements() {
    const codeInputElement = document.getElementById("code-input");
    const textResourcesInputElement = document.getElementById("text-resources-input");
    const addDataModelButtonElement = document.getElementById("add-data-model-button");

    addDataModelButtonElement.onclick = function () {
        addDataModel();
    };


    codeInputElement.onchange = function () {
        addValueToLocalStorage("code", codeInputElement.value);
    };

    textResourcesInputElement.onchange = function () {
        addValueToLocalStorage("textResources", textResourcesInputElement.value);
        window.textResources = JSON.parse(textResourcesInputElement.value);
    };

    codeInputElement.value = getValueFromLocalStorage("code") || "";
    textResourcesInputElement.value = getValueFromLocalStorage("textResources") || "";
    window.textResources = JSON.parse(textResourcesInputElement.value);

    renderDataModelElements();

}

window.onload = function () {
    const testCodeButtonElement = document.getElementById("test-code-button");
    testCodeButtonElement.onclick = handleTestCodeOnClick;

    initInputElements();
};
