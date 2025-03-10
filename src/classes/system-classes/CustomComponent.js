import { hasValue } from "../../functions/helpers.js";

export default class CustomComponent {
    constructor(element) {
        const formData = this.getFormDataFromElement(element);
        const text = this.getTextFromElement(element);
        const texts = this.getTextsFromElement(element);
        const inline = this.getInlineFromElement(element);
        const hideTitle = this.getHideTitle(element);
        const size = this.getSize(element);
        const hideIfEmpty = this.getHideIfEmpty(element);
        const emptyFieldText = this.getEmptyFieldText(element);
        const styleOverride = this.getStyleOverride(element);
        const isChildComponent = this.getIsChildComponent(element);
        const tableColumns = this.getTableColumns(element);
        const feedbackType = this.getFeedbackType(element);
        const itemKey = this.getItemKey(element);
        const hideOrgNr = this.getHideOrgNr(element);
        const format = this.getFormatFromElement(element);
        if (formData) {
            this.formData = formData;
        }
        if (text) {
            this.text = text;
        }
        if (texts) {
            this.texts = texts;
        }
        if (inline) {
            this.inline = inline;
        }
        if (hideTitle) {
            this.hideTitle = hideTitle;
        }
        if (size) {
            this.size = size;
        }
        if (hideIfEmpty) {
            this.hideIfEmpty = hideIfEmpty;
        }
        if (emptyFieldText) {
            this.emptyFieldText = emptyFieldText;
        }
        if (styleOverride) {
            this.styleOverride = styleOverride;
        }
        if (isChildComponent) {
            this.isChildComponent = isChildComponent;
        }
        if (tableColumns) {
            this.tableColumns = tableColumns;
        }
        if (feedbackType) {
            this.feedbackType = feedbackType;
        }
        if (itemKey) {
            this.itemKey = itemKey;
        }
        if (hideOrgNr) {
            this.hideOrgNr = hideOrgNr;
        }
        if (format) {
            this.format = format;
        }
    }

    getFormDataFromElement(element) {
        const formData = JSON.parse(element?.getAttribute("formdata"));
        return hasValue(formData) && formData;
    }

    getTextFromElement(element) {
        const text = element?.getAttribute("text");
        return hasValue(text) && text;
    }

    getTextsFromElement(element) {
        const texts = JSON.parse(element?.getAttribute("texts"));
        return hasValue(texts) && texts;
    }

    getInlineFromElement(element) {
        return element?.getAttribute("inline") === "true";
    }

    getHideTitle(element) {
        return element?.getAttribute("hideTitle") === "true";
    }

    getSize(element) {
        const size = element?.getAttribute("size");
        return hasValue(size) && size;
    }

    getHideIfEmpty(element) {
        return element?.getAttribute("hideIfEmpty") === "true";
    }

    getEmptyFieldText(element) {
        const emptyFieldText = element?.getAttribute("emptyFieldText");
        return hasValue(emptyFieldText) && emptyFieldText;
    }

    getStyleOverride(element) {
        const styleOverride = JSON.parse(element?.getAttribute("styleOverride") || "{}");
        return hasValue(styleOverride) && styleOverride;
    }

    getIsChildComponent(element) {
        return element?.getAttribute("isChildComponent") === "true";
    }

    getTableColumns(element) {
        const tableColumns = JSON.parse(element?.getAttribute("tableColumns"));
        return hasValue(tableColumns) && tableColumns;
    }

    getFeedbackType(element) {
        const feedbackType = element?.getAttribute("feedbackType");
        return hasValue(feedbackType) && feedbackType;
    }

    getItemKey(element) {
        const itemKey = element?.getAttribute("itemKey");
        return hasValue(itemKey) && itemKey;
    }

    getHideOrgNr(element) {
        return element?.getAttribute("hideOrgNr") === "true";
    }

    getFormatFromElement(element) {
        const format = element?.getAttribute("format");
        return hasValue(format) && format;
    }

    setFormData(formData) {
        this.formData = formData;
    }

    setTexts(texts) {
        this.texts = texts;
    }

    setText(text) {
        this.text = text;
    }
}
