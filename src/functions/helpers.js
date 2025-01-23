export function objectHasValue(obj) {
    for (let key in obj) {
        if (!!obj?.[key]?.toString().length > 0) {
            return true;
        }
    }
    return false;
}

export function addStyle(element, style) {
    for (let key in style) {
        element.style[key] = style[key];
    }
}

function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

export async function getComponentTexts(component) {
    let texts = component.getAttribute("texts");
    if (texts) {
        return JSON.parse(texts);
    } else {
        texts = await getAsync(component, "texts");
        return texts;
    }
}

export function createCustomElement(tagName, props) {
    const customFieldElement = document.createElement(tagName);
    const htmlAttributes = {
        formdata: JSON.stringify({ [typeof props?.data === "object" ? "data" : "simpleBinding"]: props?.data }),
        text: props?.text?.toString() || "",
        size: props?.size?.toString() || "",
        hidetitle: props?.hideTitle?.toString() || "",
        hideifempty: props?.hideIfEmpty?.toString() || "",
        emptyfieldtext: props?.emptyFieldText?.toString() || "",
        styleoverride: JSON.stringify(props?.styleoverride) || "",
        grid: JSON.stringify(props?.grid) || "",
        texts: JSON.stringify(props?.texts) || ""
    };
    setAttributes(customFieldElement, htmlAttributes);
    return customFieldElement;
}

export function addContainerElement(component) {
    const containerElement = document.createElement("div");
    const formContentElement = document.createElement("div");

    formContentElement.appendChild(component);
    containerElement.appendChild(formContentElement);

    addStyle(containerElement, {
        padding: "0.75rem 0"
    });

    return containerElement;
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
        styleoverride: JSON.parse(customComponent.getAttribute("styleoverride") || "{}")
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

function getAsync(obj, prop) {
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

export function getComponentContainerElement(component) {
    return component?.parentElement?.parentElement;
}
