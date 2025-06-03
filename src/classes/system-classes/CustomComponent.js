// Global functions
import { isValidHeaderSize } from "../../functions/dataFormatHelpers.js";
import { hasValue } from "../../functions/helpers.js";

/**
 * Class representing a CustomComponent.
 * @class
 */
export default class CustomComponent {
    /**
     * Constructs a new CustomComponent instance.
     *
     * @param {HTMLElement | Object} element - The HTML element or an object containing properties to initialize the component.
     * @property {Object} [formData] - The form data extracted from the element.
     * @property {string} [tagName] - The tag name of the component, typically used for rendering.
     * @property {string} [text] - The text content extracted from the element.
     * @property {Object} [texts] - Additional text content extracted from the element.
     * @property {boolean} [inline] - Indicates whether the component should be displayed inline.
     * @property {boolean} [hideTitle] - Indicates whether the title should be hidden.
     * @property {string} [size] - The size of the component.
     * @property {boolean} [hideIfEmpty] - Indicates whether the component should be hidden if empty.
     * @property {Object} [styleOverride] - Custom styles to override the default styles.
     * @property {boolean} [isChildComponent] - Indicates whether the component is a child component.
     * @property {Array} [tableColumns] - The table columns configuration for the component.
     * @property {string} [feedbackType] - The type of feedback associated with the component.
     * @property {string} [itemKey] - The unique key for the component item.
     * @property {boolean} [hideOrgNr] - Indicates whether the organization number should be hidden.
     * @property {string} [format] - The format of the component.
     * @property {boolean} [showRowNumbers] - Indicates whether to show row numbers in the component.
     */
    constructor(element) {
        const props = element instanceof HTMLElement ? this.getPropsFromElementAttributes(element) : element;
        if (props?.formData) {
            this.formData = props.formData;
        }
        if (props?.tagName) {
            this.tagName = props.tagName;
        }
        if (props?.text) {
            this.text = props.text;
        }
        if (props?.texts) {
            this.texts = props.texts;
        }
        if (props?.inline) {
            this.inline = props.inline;
        }
        if (props?.hideTitle) {
            this.hideTitle = props.hideTitle;
        }
        if (props?.size) {
            this.size = props.size;
        }
        if (props?.hideIfEmpty) {
            this.hideIfEmpty = props.hideIfEmpty;
        }
        if (props?.styleOverride) {
            this.styleOverride = props.styleOverride;
        }
        if (props?.isChildComponent) {
            this.isChildComponent = props.isChildComponent;
        }
        if (props?.tableColumns) {
            this.tableColumns = props.tableColumns;
        }
        if (props?.feedbackType) {
            this.feedbackType = props.feedbackType;
        }
        if (props?.itemKey) {
            this.itemKey = props.itemKey;
        }
        if (props?.hideOrgNr) {
            this.hideOrgNr = props.hideOrgNr;
        }
        if (props?.format) {
            this.format = props.format;
        }
        if (props?.showRowNumbers) {
            this.showRowNumbers = props.showRowNumbers;
        }
    }

    /**
     * Extracts and returns a set of properties from the given element's attributes.
     *
     * @param {HTMLElement} element - The DOM element from which to extract properties.
     * @returns {Object} An object containing the following properties:
     *   @property {*} formData - The form data extracted from the element.
     *   @property {string} tagName - The tag name of the element.
     *   @property {string} text - The text content of the element.
     *   @property {Object} texts - Additional text values from the element.
     *   @property {boolean} inline - Whether the element is inline.
     *   @property {boolean} hideTitle - Whether the title should be hidden.
     *   @property {string|number} size - The size attribute of the element.
     *   @property {boolean} hideIfEmpty - Whether to hide the element if empty.
     *   @property {Object} styleOverride - Style overrides for the element.
     *   @property {boolean} isChildComponent - Whether the element is a child component.
     *   @property {Array} tableColumns - Table columns configuration.
     *   @property {string} feedbackType - The feedback type for the element.
     *   @property {string} itemKey - The item key for the element.
     *   @property {boolean} hideOrgNr - Whether to hide the organization number.
     *   @property {string} format - The format of the element.
     *   @property {boolean} showRowNumbers - Whether to show row numbers.
     */
    getPropsFromElementAttributes(element) {
        return {
            formData: this.getFormDataFromElement(element),
            tagName: this.getTagNameFromElement(element),
            text: this.getTextFromElement(element),
            texts: this.getTextsFromElement(element),
            inline: this.getInlineFromElement(element),
            hideTitle: this.getHideTitle(element),
            size: this.getSize(element),
            hideIfEmpty: this.getHideIfEmpty(element),
            styleOverride: this.getStyleOverride(element),
            isChildComponent: this.getIsChildComponent(element),
            tableColumns: this.getTableColumns(element),
            feedbackType: this.getFeedbackType(element),
            itemKey: this.getItemKey(element),
            hideOrgNr: this.getHideOrgNr(element),
            format: this.getFormat(element),
            showRowNumbers: this.getShowRowNumbers(element)
        };
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
     * Retrieves the tag name of a given HTML element.
     *
     * @param {HTMLElement} element - The HTML element from which to extract the tag name.
     * @returns {string|boolean} The tag name in lowercase if it exists and is valid, otherwise `false`.
     */
    getTagNameFromElement(element) {
        const tagName = element?.getAttribute("tagName") || element?.tagName?.toLowerCase();
        return hasValue(tagName) && tagName;
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
     * Retrieves the size attribute of a given element and validates it.
     *
     * @param {HTMLElement} element - The HTML element from which to retrieve the size attribute.
     * @returns {string|undefined} The validated size as a lowercase string, or undefined if invalid or not present.
     */
    getSize(element) {
        const size = element?.getAttribute("size");
        return isValidHeaderSize(size) ? size?.toString().toLowerCase() : undefined;
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
    getFormat(element) {
        const format = element?.getAttribute("format");
        return hasValue(format) && format;
    }

    /**
     * Determines whether the "showRowNumbers" attribute is set to "true" on the element.
     *
     * @returns {boolean} True if the "showRowNumbers" attribute is "true", otherwise false.
     */
    getShowRowNumbers(element) {
        return element?.getAttribute("showRowNumbers") === "true";
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
