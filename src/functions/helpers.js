export function hasValue(obj) {
    if (typeof obj === "string") {
        return obj.length > 0;
    } else if (typeof obj === "number") {
        return isNaN(obj) === false;
    }
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
    const htmlAttributes = {};
    if (hasValue(props?.data)) {
        const propName = typeof props?.data === "object" ? "data" : "simpleBinding";
        const propValue = typeof props?.data === "number" ? props.data.toString() : props?.data;
        htmlAttributes.formdata = JSON.stringify({
            [propName]: propValue
        });
    }
    if (props?.text || props?.texts?.title) {
        htmlAttributes.text = props?.text?.toString() || props?.texts?.title?.toString() || "";
    }
    if (hasValue(props?.size)) {
        htmlAttributes.size = props?.size?.toString() || "";
    }
    if (props?.hideTitle?.toString() === "true") {
        htmlAttributes.hidetitle = "true";
    }
    if (props?.hideIfEmpty?.toString() === "true") {
        htmlAttributes.hideifempty = "true";
    }
    if (props?.inline?.toString() === "true") {
        htmlAttributes.inline = "true";
    }
    if (hasValue(props?.emptyFieldText)) {
        htmlAttributes.emptyfieldtext = props?.emptyFieldText.toString() || "";
    }
    if (hasValue(props?.styleoverride)) {
        htmlAttributes.styleoverride = JSON.stringify(props?.styleoverride) || "";
    }
    if (hasValue(props?.grid)) {
        htmlAttributes.grid = JSON.stringify(props?.grid) || "";
    }
    if (hasValue(props?.texts)) {
        htmlAttributes.texts = JSON.stringify(props?.texts) || "";
    }
    if (hasValue(props?.tableColumns)) {
        htmlAttributes.tablecolumns = JSON.stringify(props?.tableColumns) || "";
    }

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

export function getCustomComponentDataFromFormdata(formdata) {
    const simpleBinding = hasValue(formdata?.simpleBinding) ? formdata.simpleBinding : null;
    const data = hasValue(formdata?.data) ? formdata.data : null;
    return simpleBinding || data;
}

export function getCustomComponentProps(customComponent) {
    const formData = JSON.parse(customComponent.getAttribute("formdata"));
    const data = getCustomComponentDataFromFormdata(formData);
    return {
        data,
        text: customComponent.getAttribute("text"),
        inline: customComponent.getAttribute("inline") === "true",
        hideTitle: customComponent.getAttribute("hideTitle") === "true",
        size: customComponent.getAttribute("size"),
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

export function getValueFromDataKey(data, dataKey) {
    if (!dataKey) {
        return data;
    }
    const path = dataKey?.split(/\.|\[|\]/).filter(Boolean);
    for (let i = 0; i < path.length; i++) {
        data = data[path[i]];
    }
    return data;
}
