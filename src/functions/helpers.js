export function objectHasValue(obj) {
    for (let key in obj) {
        return !!obj?.[key]?.toString().length > 0;
    }
    return false;
}

function addStyle(element, style) {
    for (let key in style) {
        element.style[key] = style[key];
    }
}

export function renderFieldTitleElement(fieldTitle) {
    const fieldTitleLabelElement = document.createElement("label");
    fieldTitleLabelElement.classList.add("fds-label", "fds-label--md");
    addStyle(fieldTitleLabelElement, { breakAfter: "avoid" });
    const fieldTitleSpanElement = document.createElement("span");
    fieldTitleSpanElement.innerHTML = fieldTitle;
    fieldTitleLabelElement.appendChild(fieldTitleSpanElement);
    return fieldTitleLabelElement;
}

export function renderFieldValueElement(fieldValue) {
    const fieldValueElement = document.createElement("span");
    fieldValueElement.classList.add("fds-paragraph", "fds-paragraph--md");
    fieldValueElement.innerHTML = fieldValue;
    addStyle(fieldValueElement, {
        whiteSpace: "pre-line"
    });
    return fieldValueElement;
}

export function renderFieldElement(fieldTitle, fieldValue, returnHtml = true, styleoverride) {
    const fieldElement = document.createElement("div");
    fieldElement.classList.add("field");
    if (fieldTitle?.length) {
        fieldElement.appendChild(renderFieldTitleElement(fieldTitle));
    }
    fieldElement.appendChild(renderFieldValueElement(fieldValue));
    addStyle(fieldElement, {
        ...styleoverride,
        display: "flex",
        flexDirection: "column"
    });
    return returnHtml ? fieldElement.outerHTML : fieldElement;
}

export function renderListElement(listItems, listType, returnHtml = true) {
    const listElement = document.createElement(listType || "ul");
    listElement.classList.add("fds-paragraph", "fds-paragraph--md", "fds-list", "fds-list--md");
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
    fieldElement.appendChild(renderListElement(listItems, listType, false));
    addStyle(fieldElement, {
        display: "flex",
        flexDirection: "column"
    });
    return fieldElement.outerHTML;
}

function getCustomComponentDataFromFormdata(formdata) {
    const simpleBinding = objectHasValue(formdata?.simpleBinding) ? formdata.simpleBinding : null;
    const data = objectHasValue(formdata?.data) ? formdata.data : null;
    return simpleBinding || data;
}

export function getCustomComponentProps(customComponent) {
    const formData = JSON.parse(customComponent.getAttribute("formdata"));
    const data = getCustomComponentDataFromFormdata(formData);
    return {
        data,
        text: customComponent.getAttribute("text"),
        hideTitle: customComponent.getAttribute("hideTitle") === "true",
        hideIfEmpty: customComponent.getAttribute("hideIfEmpty") === "true",
        emptyFieldText: customComponent.getAttribute("emptyFieldText"),
        styleoverride: JSON.parse(customComponent.getAttribute("styleoverride"))
    };
}

export function validateTexts(texts, fallbackTexts, keys, componentName) {
    keys.forEach((key) => {
        if (texts[key] === undefined || texts[key] === null) {
            if (fallbackTexts?.[key] !== undefined && fallbackTexts?.[key] !== null) {
                console.warn(
                    `Missing textResourceBindings.${key} for "${componentName}". Using fallback text: "${fallbackTexts[key]}"`
                );
            } else {
                console.warn(`Missing textResourceBindings.${key} for "${componentName}".`);
            }
        }
    });
}

export function getAsync(obj, prop) {
    return new Promise((resolve, reject) => {
        if (typeof obj[prop] === "undefined") {
            Object.defineProperty(obj, prop, {
                set: (value) => {
                    Object.defineProperty(obj, prop, { value });
                    resolve(value);
                },
                configurable: true,
                enumerable: true
            });
        } else {
            resolve(obj[prop]);
        }
    });
}
