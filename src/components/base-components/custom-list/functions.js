function renderFieldTitleElement(fieldTitle) {
    const fieldTitleLabelElement = document.createElement("label");
    fieldTitleLabelElement.innerText = fieldTitle;
    return fieldTitleLabelElement;
}

export function renderListElement(listItems, listType, returnHtml = true) {
    const listElement = document.createElement(listType || "ul");
    listItems.forEach((listItem) => {
        const listItemElement = document.createElement("li");
        listItemElement.innerHTML = listItem;
        listElement.appendChild(listItemElement);
    });
    return returnHtml ? listElement.outerHTML : listElement;
}

export function renderListFieldElement(fieldTitle, listItems, listType) {
    const fieldElement = document.createElement("div");
    fieldElement.classList.add("field");
    if (fieldTitle?.length) {
        fieldElement.appendChild(renderFieldTitleElement(fieldTitle));
    }
    const listElement = renderListElement(listItems, listType, false);
    if (fieldTitle?.length) {
        listElement.classList.add("has-title");
    }
    fieldElement.appendChild(listElement);
    return fieldElement.outerHTML;
}
