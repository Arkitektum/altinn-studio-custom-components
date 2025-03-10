import { hasValue } from "../../functions/helpers.js";

export default class CustomElementHtmlAttributes {
    constructor(props) {
        const isChildComponent = true;
        const formData = this.getFormDataAttributeFromProps(props);
        const text = this.getTextAttributeFromProps(props);
        const size = this.getSizeAttributeFromProps(props);
        const hideTitle = this.getHideTitleAttributeFromProps(props);
        const hideIfEmpty = this.getHideIfEmptyAttributeFromProps(props);
        const inline = this.getInlineAttributeFromProps(props);
        const emptyFieldText = this.getEmptyFieldTextAttributeFromProps(props);
        const styleOverride = this.getStyleOverrideAttributeFromProps(props);
        const grid = this.getGridAttributeFromProps(props);
        const texts = this.getTextsAttributeFromProps(props);
        const tableColumns = this.getTableColumnsAttributeFromProps(props);
        const textResources = this.getTextResourcesAttributeFromProps(props);
        const itemKey = this.getItemKeyAttributeFromProps(props);
        const id = this.getIdAttributeFromProps(props);
        const feedbackType = this.getFeedbackTypeAttributeFromProps(props);
        const hideOrgNr = this.getHideOrgNr(props);
        const format = this.getFormatAttributeFromProps(props);
        if (isChildComponent) {
            this.isChildComponent = "true";
        }
        if (formData) {
            this.formData = formData;
        }
        if (text) {
            this.text = text;
        }
        if (size) {
            this.size = size;
        }
        if (hideTitle) {
            this.hideTitle = hideTitle;
        }
        if (hideIfEmpty) {
            this.hideIfEmpty = hideIfEmpty;
        }
        if (inline) {
            this.inline = inline;
        }
        if (emptyFieldText) {
            this.emptyFieldText = emptyFieldText;
        }
        if (styleOverride) {
            this.styleOverride = styleOverride;
        }
        if (grid) {
            this.grid = grid;
        }
        if (texts) {
            this.texts = texts;
        }
        if (tableColumns) {
            this.tableColumns = tableColumns;
        }
        if (textResources) {
            this.textResources = textResources;
        }
        if (itemKey) {
            this.itemKey = itemKey;
        }
        if (id) {
            this.id = id;
        }
        if (feedbackType) {
            this.feedbackType = feedbackType;
        }
        if (hideOrgNr) {
            this.hideOrgNr = hideOrgNr;
        }
        if (format) {
            this.format = format;
        }
    }

    getFormDataAttributeFromProps(props) {
        if (hasValue(props?.formData)) {
            if (typeof props?.formData === "string") {
                const formData = props?.formData;
                return JSON.stringify(formData);
            } else if (typeof props?.formData === "number") {
                const formData = props?.formData.toString();
                return JSON.stringify(formData);
            } else if (typeof props?.formData === "object") {
                const formData = {};
                Object.keys(props.formData).forEach((key) => {
                    formData[key] = props.formData[key];
                });
                return JSON.stringify(formData);
            }
        } else {
            return null;
        }
    }

    getTextAttributeFromProps(props) {
        const textAttribute = props?.text?.toString() || props?.texts?.title?.toString() || "";
        return !props?.hideTitle && textAttribute;
    }

    getSizeAttributeFromProps(props) {
        return hasValue(props?.size) && props?.size?.toString();
    }

    getHideTitleAttributeFromProps(props) {
        return props?.hideTitle?.toString() === "true" && "true";
    }

    getHideIfEmptyAttributeFromProps(props) {
        return props?.hideIfEmpty?.toString() === "true" && "true";
    }

    getInlineAttributeFromProps(props) {
        return props?.inline?.toString() === "true" && "true";
    }

    getEmptyFieldTextAttributeFromProps(props) {
        return hasValue(props?.emptyFieldText) && props?.emptyFieldText.toString();
    }

    getStyleOverrideAttributeFromProps(props) {
        return hasValue(props?.styleOverride) && JSON.stringify(props?.styleOverride);
    }

    getGridAttributeFromProps(props) {
        return hasValue(props?.grid) && JSON.stringify(props?.grid);
    }

    getTextsAttributeFromProps(props) {
        return hasValue(props?.texts) && JSON.stringify(props?.texts);
    }

    getTableColumnsAttributeFromProps(props) {
        return hasValue(props?.tableColumns) && JSON.stringify(props?.tableColumns);
    }

    getTextResourcesAttributeFromProps(props) {
        return hasValue(props?.textResources) && JSON.stringify(props?.textResources);
    }

    getItemKeyAttributeFromProps(props) {
        return hasValue(props?.itemKey) && props?.itemKey;
    }

    getIdAttributeFromProps(props) {
        return hasValue(props?.id) && props?.id;
    }

    getFeedbackTypeAttributeFromProps(props) {
        const validFeedbackTypes = ["error", "warning", "success", "info", "default"];
        if (hasValue(props?.feedbackType)) {
            return validFeedbackTypes.includes(props?.feedbackType) ? props?.feedbackType : "default";
        } else {
            return null;
        }
    }

    getHideOrgNr(props) {
        return props?.hideOrgNr?.toString() === "true" && "true";
    }

    getFormatAttributeFromProps(props) {
        return hasValue(props?.format) && props?.format.toString();
    }
}
