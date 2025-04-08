// Global functions
import { hasValue } from "../../functions/helpers.js";

/**
 * Class representing a CustomComponent.
 * @class
 */
export default class CustomComponent {
    /**
     * Constructs a new CustomComponent instance.
     *
     * @param {HTMLElement} element - The HTML element used to initialize the component.
     * @property {Object} [formData] - The form data extracted from the element.
     * @property {string} [text] - The text content extracted from the element.
     * @property {Object} [texts] - Additional text content extracted from the element.
     * @property {boolean} [inline] - Indicates whether the component should be displayed inline.
     * @property {boolean} [hideTitle] - Indicates whether the title should be hidden.
     * @property {string} [size] - The size of the component.
     * @property {boolean} [hideIfEmpty] - Indicates whether the component should be hidden if empty.
     * @property {string} [emptyFieldText] - The text to display when the field is empty.
     * @property {Object} [styleOverride] - Custom styles to override the default styles.
     * @property {boolean} [isChildComponent] - Indicates whether the component is a child component.
     * @property {Array} [tableColumns] - The table columns configuration for the component.
     * @property {string} [feedbackType] - The type of feedback associated with the component.
     * @property {string} [itemKey] - The unique key for the component item.
     * @property {boolean} [hideOrgNr] - Indicates whether the organization number should be hidden.
     * @property {string} [format] - The format of the component.
     */
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

    /**
     * Extracts and parses the form data from a given HTML element's "formdata" attribute.
     *
     * @param {HTMLElement} element - The HTML element containing the "formdata" attribute.
     * @returns {Object|null} The parsed form data object if it exists and is valid, otherwise null.
     */
    getFormDataFromElement(element) {
        const formData = JSON.parse(element?.getAttribute("formdata"));
        return hasValue(formData) && formData;
    }

    /**
     * Retrieves the text attribute value from a given element.
     *
     * @param {Element} element - The DOM element from which to retrieve the text attribute.
     * @returns {string|false} The value of the text attribute if it exists and is valid; otherwise, false.
     */
    getTextFromElement(element) {
        const text = element?.getAttribute("text");
        return hasValue(text) && text;
    }

    /**
     * Extracts and parses the "texts" attribute from a given DOM element.
     *
     * @param {Element} element - The DOM element from which to retrieve the "texts" attribute.
     * @returns {Object|boolean} The parsed "texts" object if it exists and is valid, otherwise `false`.
     */
    getTextsFromElement(element) {
        const texts = JSON.parse(element?.getAttribute("texts"));
        return hasValue(texts) && texts;
    }

    /**
     * Determines if the given element has the "inline" attribute set to "true".
     *
     * @param {HTMLElement} element - The HTML element to check.
     * @returns {boolean} True if the "inline" attribute is set to "true", otherwise false.
     */
    getInlineFromElement(element) {
        return element?.getAttribute("inline") === "true";
    }

    /**
     * Determines whether the title of the given element should be hidden.
     *
     * @param {Element} element - The DOM element to check for the "hideTitle" attribute.
     * @returns {boolean} Returns `true` if the "hideTitle" attribute is set to "true", otherwise `false`.
     */
    getHideTitle(element) {
        return element?.getAttribute("hideTitle") === "true";
    }

    /**
     * Retrieves the "size" attribute value from the given element.
     *
     * @param {HTMLElement} element - The HTML element from which to retrieve the "size" attribute.
     * @returns {string|boolean} The value of the "size" attribute if it exists and is valid,
     *                           otherwise `false`.
     */
    getSize(element) {
        const size = element?.getAttribute("size");
        return hasValue(size) && size;
    }

    /**
     * Determines if the "hideIfEmpty" attribute of the given element is set to "true".
     *
     * @param {Element} element - The DOM element to check for the "hideIfEmpty" attribute.
     * @returns {boolean} - Returns `true` if the "hideIfEmpty" attribute is set to "true", otherwise `false`.
     */
    getHideIfEmpty(element) {
        return element?.getAttribute("hideIfEmpty") === "true";
    }

    /**
     * Retrieves the value of the "emptyFieldText" attribute from the given element.
     *
     * @param {HTMLElement} element - The HTML element from which to retrieve the "emptyFieldText" attribute.
     * @returns {string|boolean} The value of the "emptyFieldText" attribute if it exists and is valid,
     *                           otherwise returns `false`.
     */
    getEmptyFieldText(element) {
        const emptyFieldText = element?.getAttribute("emptyFieldText");
        return hasValue(emptyFieldText) && emptyFieldText;
    }

    /**
     * Retrieves the style override configuration from a given element's attribute.
     *
     * @param {HTMLElement} element - The HTML element from which to extract the style override.
     * @returns {Object|false} The parsed style override object if it exists and is valid, otherwise `false`.
     */
    getStyleOverride(element) {
        const styleOverride = JSON.parse(element?.getAttribute("styleOverride") || "{}");
        return hasValue(styleOverride) && styleOverride;
    }

    /**
     * Determines if the given element is a child component.
     *
     * @param {HTMLElement} element - The DOM element to check.
     * @returns {boolean} True if the element has the attribute "isChildComponent" set to "true", otherwise false.
     */
    getIsChildComponent(element) {
        return element?.getAttribute("isChildComponent") === "true";
    }

    /**
     * Retrieves the table columns configuration from the given element's "tableColumns" attribute.
     *
     * @param {HTMLElement} element - The HTML element containing the "tableColumns" attribute.
     * @returns {Array|boolean} The parsed table columns if the attribute is present and valid,
     *                          otherwise returns `false`.
     */
    getTableColumns(element) {
        const tableColumns = JSON.parse(element?.getAttribute("tableColumns"));
        return hasValue(tableColumns) && tableColumns;
    }

    /**
     * Retrieves the feedback type attribute from the given element.
     *
     * @param {HTMLElement} element - The DOM element from which to retrieve the feedback type.
     * @returns {string|boolean} The feedback type if it exists and has a value, otherwise `false`.
     */
    getFeedbackType(element) {
        const feedbackType = element?.getAttribute("feedbackType");
        return hasValue(feedbackType) && feedbackType;
    }

    /**
     * Retrieves the value of the "itemKey" attribute from the given element.
     *
     * @param {HTMLElement} element - The DOM element from which to retrieve the "itemKey" attribute.
     * @returns {string|boolean} The value of the "itemKey" attribute if it exists and is valid; otherwise, returns false.
     */
    getItemKey(element) {
        const itemKey = element?.getAttribute("itemKey");
        return hasValue(itemKey) && itemKey;
    }

    /**
     * Determines whether the "hideOrgNr" attribute of a given element is set to "true".
     *
     * @param {HTMLElement} element - The HTML element to check for the "hideOrgNr" attribute.
     * @returns {boolean} - Returns `true` if the "hideOrgNr" attribute is set to "true", otherwise `false`.
     */
    getHideOrgNr(element) {
        return element?.getAttribute("hideOrgNr") === "true";
    }

    /**
     * Retrieves the "format" attribute value from a given DOM element.
     *
     * @param {Element} element - The DOM element from which to retrieve the "format" attribute.
     * @returns {string|boolean} The value of the "format" attribute if it exists and is valid,
     *                           otherwise returns `false`.
     */
    getFormatFromElement(element) {
        const format = element?.getAttribute("format");
        return hasValue(format) && format;
    }

    /**
     * Sets the form data for the custom component.
     *
     * @param {Object} formData - The form data to be set.
     */
    setFormData(formData) {
        this.formData = formData;
    }

    /**
     * Sets the texts for the custom component.
     *
     * @param {Object} texts - An object containing the texts to be set.
     */
    setTexts(texts) {
        this.texts = texts;
    }

    /**
     * Sets the text property of the CustomComponent instance.
     *
     * @param {string} text - The text to set.
     */
    setText(text) {
        this.text = text;
    }
}
