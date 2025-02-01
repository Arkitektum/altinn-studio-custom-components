import { addStyle } from "../../../functions/helpers.js";

function renderFieldTitleElement(fieldTitle, inline) {
    const fieldTitleLabelElement = document.createElement("label");
    fieldTitleLabelElement.innerText = `${fieldTitle}${inline ? ":" : ""}`;
    return fieldTitleLabelElement;
}

function renderFieldValueElement(fieldValue) {
    const fieldValueElement = document.createElement("span");
    fieldValueElement.innerHTML = fieldValue;
    return fieldValueElement;
}

export function renderFieldElement(fieldTitle, fieldValue, options) {
    options = {
        returnHtml: true,
        inline: false,
        styleoverride: {},
        ...options
    };
    const fieldElement = document.createElement("div");
    fieldElement.classList.add("field");
    if (fieldTitle?.length) {
        fieldElement.appendChild(renderFieldTitleElement(fieldTitle, options.inline));
    }
    if (options?.inline) {
        fieldElement.classList.add("inline");
    }
    fieldElement.appendChild(renderFieldValueElement(fieldValue));
    addStyle(fieldElement, {
        ...options.styleoverride
    });
    return options.returnHtml ? fieldElement.outerHTML : fieldElement;
}
