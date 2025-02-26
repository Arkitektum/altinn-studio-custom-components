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
    const htmlAttributes = {
        isChildComponent: "true"
    };
    if (hasValue(props?.formData)) {
        if (typeof props?.formData === "string") {
            const formData = props?.formData;
            htmlAttributes.formdata = JSON.stringify(formData);
        } else if (typeof props?.formData === "number") {
            const formData = props?.formData.toString();
            htmlAttributes.formdata = JSON.stringify(formData);
        } else if (typeof props?.formData === "object") {
            const formData = {};
            Object.keys(props.formData).forEach((key) => {
                formData[key] = props.formData[key];
            });
            htmlAttributes.formdata = JSON.stringify(formData);
        }
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
    if (hasValue(props?.styleOverride)) {
        htmlAttributes.styleOverride = JSON.stringify(props?.styleOverride) || "";
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
    if (hasValue(props?.textResources)) {
        htmlAttributes.textResources = JSON.stringify(props?.textResources) || "";
    }
    if (hasValue(props?.itemKey)) {
        htmlAttributes.itemKey = props?.itemKey || "";
    }
    if (hasValue(props?.id)) {
        htmlAttributes.id = props?.id || "";
    }
    if (hasValue(props?.feedbackType)) {
        htmlAttributes.feedbackType = props?.feedbackType || "";
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

export function getCustomComponentProps(customComponent) {
    const formData = JSON.parse(customComponent.getAttribute("formdata"));
    return {
        formData,
        text: customComponent.getAttribute("text"),
        inline: customComponent.getAttribute("inline") === "true",
        hideTitle: customComponent.getAttribute("hideTitle") === "true",
        size: customComponent.getAttribute("size"),
        hideIfEmpty: customComponent.getAttribute("hideIfEmpty") === "true",
        emptyFieldText: customComponent.getAttribute("emptyFieldText"),
        styleOverride: JSON.parse(customComponent.getAttribute("styleOverride") || "{}"),
        isChildComponent: customComponent.getAttribute("isChildComponent") === "true"
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

function getAsync(obj, prop, timeout = 200) {
    console.log("getAsync", { obj, prop });
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Timeout: ${prop} was not set within ${timeout}ms`));
        }, timeout);

        if (typeof obj[prop] === "undefined") {
            Object.defineProperty(obj, prop, {
                set: (value) => {
                    clearTimeout(timer);
                    Object.defineProperty(obj, prop, { value });
                    resolve(value);
                },
                configurable: true,
                enumerable: true
            });
        } else {
            clearTimeout(timer);
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
