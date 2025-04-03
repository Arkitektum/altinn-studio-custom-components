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

function getLayoutCode() {
    return JSON.parse(removeTrailingOrLeadingComma(getValueFromLocalStorage("code")));
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

function renderResults() {
    const component = getLayoutCode();
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
    const dataTypeName = dataModel.dataType?.length > 0 ? dataModel.dataType : `Data model ${index + 1}`;
    const dataModelType = index === 0 ? `[main] ${dataModel.dataType}` : dataTypeName;
    return dataModelType;
}

function handleDataModelTypeOnChange(index) {
    const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
    const dataModelTypeInputElement = document.getElementById(`data-model-type-input-${index}`);
    dataModels[index].dataType = dataModelTypeInputElement.value;
    addValueToLocalStorage("dataModels", JSON.stringify(dataModels));
}

function handleDataModelDataOnChange(index) {
    const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
    const dataModelDataInputElement = document.getElementById("code-input");
    dataModels[index].data = JSON.parse(removeTrailingOrLeadingComma(dataModelDataInputElement.value));
    addValueToLocalStorage("dataModels", JSON.stringify(dataModels));
}

function setActiveSidebarElement(itemId) {
    const fileListElement = document.getElementById("file-list");
    const dataModelListElement = document.getElementById("data-model-list");

    if (fileListElement) {
        const fileListItems = fileListElement.querySelectorAll("li");
        fileListItems.forEach((item) => {
            item.classList.remove("active");
        });
    }

    if (dataModelListElement) {
        const dataModelListItems = dataModelListElement.querySelectorAll("li");
        dataModelListItems.forEach((item) => {
            item.classList.remove("active");
        });
    }

    const activeItem = document.getElementById(itemId);
    if (activeItem) {
        activeItem.classList.add("active");
    }
}

function renderSidebar() {
    const sidebarElement = document.getElementById("sidebar");
    sidebarElement.innerHTML = "";

    const fileListElement = document.createElement("ul");
    fileListElement.id = "file-list";
    fileListElement.classList.add("file-list");

    // Layout code
    const layoutCodeItemId = "layout-code";
    const layoutCodeListElement = document.createElement("li");
    layoutCodeListElement.id = layoutCodeItemId;
    const layoutCodeButtonElement = document.createElement("button");
    layoutCodeButtonElement.innerHTML = "Layout code";
    layoutCodeButtonElement.onclick = function () {
        const codeInputElement = getCodeInputElementForLayoutCode();
        updateDataInputElement(codeInputElement);
        setActiveSidebarElement(layoutCodeItemId);
    };
    layoutCodeListElement.appendChild(layoutCodeButtonElement);
    fileListElement.appendChild(layoutCodeListElement);

    // Text resources code
    const textResourcesItemId = "text-resources-code";
    const textResourcesCodeListElement = document.createElement("li");
    textResourcesCodeListElement.id = textResourcesItemId;
    const textResourcesCodeButtonElement = document.createElement("button");
    textResourcesCodeButtonElement.innerHTML = "Text resources";
    textResourcesCodeButtonElement.onclick = function () {
        const codeInputElement = getCodeInputElementForTextResources();
        updateDataInputElement(codeInputElement);
        setActiveSidebarElement(textResourcesItemId);
    };
    textResourcesCodeListElement.appendChild(textResourcesCodeButtonElement);
    fileListElement.appendChild(textResourcesCodeListElement);

    sidebarElement.appendChild(fileListElement);

    sidebarElement.appendChild(getDataModelListElements());

    const addDataModelButtonElement = document.createElement("button");
    addDataModelButtonElement.id = "add-data-model-button";
    addDataModelButtonElement.innerHTML = "Add Data Model";
    addDataModelButtonElement.classList.add("add-button");
    addDataModelButtonElement.onclick = function () {
        addDataModel();
        renderSidebar();
    };
    sidebarElement.appendChild(addDataModelButtonElement);
}

function getDataModelListElements() {
    const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
    const dataModelListElement = document.createElement("ul");
    dataModelListElement.id = "data-model-list";
    dataModelListElement.classList.add("data-model-list");
    dataModels.forEach((dataModel, index) => {
        const itemId = `data-model-list-item-${index}`;
        const dataModelListItemElement = document.createElement("li");
        dataModelListItemElement.id = itemId;

        const buttonsContainerElement = document.createElement("div");
        buttonsContainerElement.classList.add("buttons-container");

        const typeInputElement = document.createElement("input");
        typeInputElement.classList.add("type-input");
        typeInputElement.setAttribute("placeholder", "Data type");
        typeInputElement.id = `data-model-type-input-${index}`;
        typeInputElement.value = dataModel.dataType;
        typeInputElement.onchange = function () {
            handleDataModelTypeOnChange(index);
            renderSidebar();
            renderResults();
        };
        typeInputElement.onblur = function () {
            dataModelListItemElement.classList.remove("editable");
        };

        const dataModelListItemButtonElement = document.createElement("button");
        dataModelListItemButtonElement.innerHTML = getDataModelSummaryText(dataModel, index);
        dataModelListItemButtonElement.onclick = function () {
            const codeInputElement = getCodeInputElementForDataModel(index);
            updateDataInputElement(codeInputElement);
            setActiveSidebarElement(itemId);
        };

        // Option buttons
        const optionButtonsContainerElement = document.createElement("div");
        optionButtonsContainerElement.classList.add("option-buttons-container");

        // Option button for edit data model type
        const dataModelListItemEditNameButtonElement = document.createElement("button");
        dataModelListItemEditNameButtonElement.classList.add("edit-type-button");
        dataModelListItemEditNameButtonElement.innerHTML = "Type";
        dataModelListItemEditNameButtonElement.onclick = function () {
            dataModelListItemElement.classList.add("editable");
            typeInputElement.focus();
        };
        optionButtonsContainerElement.appendChild(dataModelListItemEditNameButtonElement);

        // Option button for remove data model
        const dataModelListItemRemoveButtonElement = document.createElement("button");
        dataModelListItemRemoveButtonElement.classList.add("remove-button");
        dataModelListItemRemoveButtonElement.innerHTML = "Remove";
        dataModelListItemRemoveButtonElement.onclick = function () {
            const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
            dataModels.splice(index, 1);
            addValueToLocalStorage("dataModels", JSON.stringify(dataModels));
            renderSidebar();
            renderResults();
        };
        optionButtonsContainerElement.appendChild(dataModelListItemRemoveButtonElement);

        buttonsContainerElement.appendChild(dataModelListItemButtonElement);
        buttonsContainerElement.appendChild(optionButtonsContainerElement);

        dataModelListItemElement.appendChild(buttonsContainerElement);
        dataModelListItemElement.appendChild(typeInputElement);
        dataModelListElement.appendChild(dataModelListItemElement);
    });
    return dataModelListElement;
}

function beautifyJson(json) {
    return JSON.stringify(JSON.parse(removeTrailingOrLeadingComma(json)), null, 2);
}

function addDataModel() {
    const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
    dataModels.push({ data: "", dataType: "", expanded: true });
    addValueToLocalStorage("dataModels", JSON.stringify(dataModels));
}

function getCodeInputElementForDataModel(dataModelIndex) {
    const codeInputElement = document.createElement("textarea");
    codeInputElement.id = "code-input";
    const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
    const dataModel = dataModels[dataModelIndex];
    codeInputElement.value = JSON.stringify(dataModel.data, null, 2);
    codeInputElement.onchange = function () {
        handleDataModelDataOnChange(dataModelIndex);
        renderResults();
    };
    return codeInputElement;
}

function getCodeInputElementForLayoutCode() {
    const codeInputElement = document.createElement("textarea");
    codeInputElement.id = "code-input";
    codeInputElement.value = getValueFromLocalStorage("code") || "";
    codeInputElement.onchange = function () {
        codeInputElement.value = beautifyJson(codeInputElement.value);
        addValueToLocalStorage("code", codeInputElement.value);
        renderResults();
    };
    return codeInputElement;
}

function getCodeInputElementForTextResources() {
    const codeInputElement = document.createElement("textarea");
    codeInputElement.id = "code-input";
    codeInputElement.value = getValueFromLocalStorage("textResources") || "";
    codeInputElement.onchange = function () {
        codeInputElement.value = beautifyJson(codeInputElement.value);
        addValueToLocalStorage("textResources", codeInputElement.value);
        window.textResources = JSON.parse(codeInputElement.value);
        renderResults();
    };
    return codeInputElement;
}

function updateDataInputElement(inputElement) {
    const dataInputElement = document.getElementById("data-input");
    dataInputElement.innerHTML = "";
    dataInputElement.appendChild(inputElement);
}

window.onload = function () {
    window.textResources = JSON.parse(getValueFromLocalStorage("textResources") || "");
    renderSidebar();
    renderResults();
};
