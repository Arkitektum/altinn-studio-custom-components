// Global functions
import { isValidHeaderSize } from "../../functions/dataFormatHelpers.js";
import { hasValue } from "../../functions/helpers.js";

/**
 * Class representing CustomElementHtmlAttributes.
 * @class
 */
export default class CustomElementHtmlAttributes {
    /**
     * Constructs a new instance of the CustomElementHtmlAttributes class.
     *
     * @param {Object} props - The properties object containing attributes for the custom element.
     * @param {boolean} [props.isChildComponent] - Indicates if the component is a child component.
     * @param {*} [props.formData] - The form data associated with the component.
     * @param {string} [props.tagName] - The tag name of the custom element.
     * @param {string} [props.size] - The size attribute of the component.
     * @param {boolean} [props.hideTitle] - Determines if the title should be hidden.
     * @param {boolean} [props.hideIfEmpty] - Determines if the component should be hidden when empty.
     * @param {boolean} [props.isEmpty] - Indicates if the component is empty.
     * @param {boolean} [props.inline] - Indicates if the component should be displayed inline.
     * @param {Object} [props.styleOverride] - Custom styles to override default styles.
     * @param {Object} [props.grid] - Grid configuration for the component.
     * @param {Array} [props.tableColumns] - An array of table column configurations.
     * @param {string} [props.itemKey] - A unique key for the item.
     * @param {string} [props.id] - The ID of the component.
     * @param {string} [props.feedbackType] - The type of feedback associated with the component.
     * @param {boolean} [props.hideOrgNr] - Determines if the organization number should be hidden.
     * @param {string} [props.format] - The format attribute of the component.
     * @param {boolean} [props.showRowNumbers] - Indicates if row numbers should be shown.
     * @param {string} [props.partType] - The type of part for the component.
     * @param {Object} [props.resourceBindings] - Text resource bindings for the component.
     * @param {Object} [props.resourceValues] - Resource values associated with the component.
     * @param {boolean} [props.enableLinks] - Indicates if links should be enabled in the component.
     */
    constructor(props) {
        const isChildComponent = this.getIsChildComponentAttributeFromProps(props);
        const formData = this.getFormDataAttributeFromProps(props);
        const tagName = this.getTagNameAttributeFromProps(props);
        const size = this.getSizeAttributeFromProps(props);
        const hideTitle = this.getHideTitleAttributeFromProps(props);
        const hideIfEmpty = this.getHideIfEmptyAttributeFromProps(props);
        const isEmpty = this.getIsEmptyAttributeFromProps(props);
        const inline = this.getInlineAttributeFromProps(props);
        const styleOverride = this.getStyleOverrideAttributeFromProps(props);
        const grid = this.getGridAttributeFromProps(props);
        const tableColumns = this.getTableColumnsAttributeFromProps(props);
        const itemKey = this.getItemKeyAttributeFromProps(props);
        const dataItemKey = this.getDataItemKeyAttributeFromProps(props);
        const dataTitleItemKey = this.getDataTitleItemKeyAttributeFromProps(props);
        const id = this.getIdAttributeFromProps(props);
        const feedbackType = this.getFeedbackTypeAttributeFromProps(props);
        const hideOrgNr = this.getHideOrgNr(props);
        const format = this.getFormatAttributeFromProps(props);
        const showRowNumbers = this.getShowRowNumbersAttributeFromProps(props);
        const partType = this.getPartTypeAttributeFromProps(props);
        const resourceBindings = this.getResourceBindingsFromProps(props);
        const resourceValues = this.getResourceValuesFromProps(props);
        const enableLinks = this.getEnableLinksFromProps(props);
        const text = this.getTextAttributeFromProps(props);

        if (isChildComponent) {
            this.isChildComponent = isChildComponent;
        }
        if (formData) {
            this.formData = formData;
        }
        if (tagName) {
            this.tagName = tagName;
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
        if (isEmpty) {
            this.isEmpty = isEmpty;
        }
        if (inline) {
            this.inline = inline;
        }
        if (styleOverride) {
            this.styleOverride = styleOverride;
        }
        if (grid) {
            this.grid = grid;
        }
        if (tableColumns) {
            this.tableColumns = tableColumns;
        }
        if (itemKey) {
            this.itemKey = itemKey;
        }
        if (dataItemKey) {
            this.dataItemKey = dataItemKey;
        }
        if (dataTitleItemKey) {
            this.dataTitleItemKey = dataTitleItemKey;
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
        if (showRowNumbers) {
            this.showRowNumbers = showRowNumbers;
        }
        if (partType) {
            this.partType = partType;
        }
        if (resourceBindings) {
            this.resourceBindings = resourceBindings;
        }
        if (resourceValues) {
            this.resourceValues = resourceValues;
        }
        if (enableLinks) {
            this.enableLinks = enableLinks;
        }
        if (text) {
            this.text = text;
        }
    }

    /**
     * Extracts and formats the `formData` attribute from the given props.
     * Converts the `formData` into a JSON string based on its type.
     *
     * @param {Object} props - The properties object containing the `formData` attribute.
     * @param {string|number|Object} [props.formData] - The form data to be processed.
     * @returns {string|null} A JSON string representation of the `formData` if it exists and is valid, otherwise `null`.
     */
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

    getIsChildComponentAttributeFromProps(props) {
        return props?.isChildComponent ? "true" : undefined;
    }

    /**
     * Retrieves the `tagName` attribute from the provided props object.
     *
     * @param {Object} props - The props object containing attributes.
     * @param {string} [props.tagName] - The tagName attribute to retrieve.
     * @returns {string|undefined} The `tagName` as a string if it exists, otherwise `undefined`.
     */
    getTagNameAttributeFromProps(props) {
        return props?.tagName ? props?.tagName.toString() : undefined;
    }

    /**
     * If the size is valid, it returns the size as a string; otherwise, it returns undefined.
     *
     * @param {Object} props - The properties object containing the size attribute.
     * @param {string|number} [props.size] - The size value to validate and convert.
     * @returns {string|undefined} The size as a string if valid, otherwise undefined.
     */
    getSizeAttributeFromProps(props) {
        return isValidHeaderSize(props?.size) ? props?.size?.toString().toLowerCase() : undefined;
    }

    /**
     * Retrieves the "hideTitle" attribute from the provided props object.
     * Converts the "hideTitle" property to a string and checks if it equals "true".
     * If so, returns the string "true"; otherwise, returns undefined.
     *
     * @param {Object} props - The props object containing the "hideTitle" property.
     * @param {boolean|string} [props.hideTitle] - The property indicating whether the title should be hidden.
     * @returns {string|undefined} - Returns "true" if the "hideTitle" property is strictly equal to "true" as a string; otherwise, undefined.
     */
    getHideTitleAttributeFromProps(props) {
        return props?.hideTitle?.toString() === "true" ? "true" : undefined;
    }

    /**
     * Retrieves the "hideIfEmpty" attribute from the provided props.
     *
     * @param {Object} props - The properties object to extract the attribute from.
     * @param {boolean|string} [props.hideIfEmpty] - A property that determines if the element should be hidden when empty.
     * @returns {string|boolean} - Returns the string "true" if the "hideIfEmpty" property is strictly equal to the string "true", otherwise returns `false`.
     */
    getHideIfEmptyAttributeFromProps(props) {
        return props?.hideIfEmpty?.toString() === "true" ? "true" : undefined;
    }

    /**
     * Returns the string "true" if the `isEmpty` property in the given props is strictly equal to the string "true".
     * Otherwise, returns `undefined`.
     *
     * @param {Object} props - The props object that may contain the `isEmpty` property.
     * @param {*} [props.isEmpty] - The value to check for emptiness.
     * @returns {string|undefined} "true" if `props.isEmpty` is "true", otherwise `undefined`.
     */
    getIsEmptyAttributeFromProps(props) {
        return props?.isEmpty?.toString() === "true" ? "true" : undefined;
    }

    /**
     * Retrieves the "inline" attribute from the provided props object.
     * Converts the "inline" property to a string and checks if it equals "true".
     * If so, returns the string "true"; otherwise, returns undefined.
     *
     * @param {Object} props - The properties object to extract the attribute from.
     * @param {any} props.inline - The "inline" property to evaluate.
     * @returns {string|undefined} - Returns "true" if the "inline" property is strictly equal to "true" as a string; otherwise, undefined.
     */
    getInlineAttributeFromProps(props) {
        return props?.inline?.toString() === "true" ? "true" : undefined;
    }

    /**
     * Retrieves the style override attribute from the provided props.
     *
     * @param {Object} props - The properties object containing potential style overrides.
     * @param {Object} [props.styleOverride] - An object representing style overrides.
     * @returns {string|undefined} A JSON string representation of the styleOverride object if it exists and has a value, otherwise undefined.
     */
    getStyleOverrideAttributeFromProps(props) {
        return hasValue(props?.styleOverride) ? JSON.stringify(props?.styleOverride) : undefined;
    }

    /**
     * Retrieves the grid attribute from the provided props object.
     * If the `grid` property exists and has a value, it returns the JSON stringified version of it.
     * Otherwise, it returns `undefined`.
     *
     * @param {Object} props - The props object containing the grid attribute.
     * @param {Object} [props.grid] - The grid attribute to be processed.
     * @returns {string|undefined} The JSON stringified grid attribute if it exists, otherwise `undefined`.
     */
    getGridAttributeFromProps(props) {
        return hasValue(props?.grid) && JSON.stringify(props?.grid);
    }

    /**
     * Retrieves the `tableColumns` attribute from the provided props object.
     * If the `tableColumns` property exists and has a value, it returns the
     * JSON stringified version of the `tableColumns` property. Otherwise, it
     * returns `false`.
     *
     * @param {Object} props - The props object containing the `tableColumns` property.
     * @returns {string|false} The JSON stringified `tableColumns` if it exists and has a value, otherwise `false`.
     */
    getTableColumnsAttributeFromProps(props) {
        return hasValue(props?.tableColumns) && JSON.stringify(props?.tableColumns);
    }

    /**
     * Retrieves the `itemKey` attribute from the provided props if it has a valid value.
     *
     * @param {Object} props - The properties object to extract the `itemKey` from.
     * @param {*} props.itemKey - The key to be checked and returned if valid.
     * @returns {*} The value of `itemKey` if it exists and is valid; otherwise, returns `undefined`.
     */
    getItemKeyAttributeFromProps(props) {
        return hasValue(props?.itemKey) && props?.itemKey;
    }

    /**
     * Retrieves the `dataItemKey` attribute from the given props object if it has a value.
     *
     * @param {Object} props - The props object containing potential attributes.
     * @param {*} props.dataItemKey - The key to be retrieved if it has a value.
     * @returns {*} The value of `dataItemKey` if it exists and is valid; otherwise, returns undefined or false.
     */
    getDataItemKeyAttributeFromProps(props) {
        return hasValue(props?.dataItemKey) && props?.dataItemKey;
    }

    /**
     * Retrieves the 'dataTitleItemKey' attribute from the given props if it has a value.
     *
     * @param {Object} props - The properties object to extract the attribute from.
     * @returns {*} The value of 'dataTitleItemKey' if it exists and is valid; otherwise, returns undefined or a falsy value.
     */
    getDataTitleItemKeyAttributeFromProps(props) {
        return hasValue(props?.dataTitleItemKey) && props?.dataTitleItemKey;
    }

    /**
     * Retrieves the `id` attribute from the provided props object if it has a valid value.
     *
     * @param {Object} props - The props object containing potential attributes.
     * @param {string} [props.id] - The `id` attribute to be retrieved.
     * @returns {string|undefined} The `id` attribute if it has a valid value, otherwise `undefined`.
     */
    getIdAttributeFromProps(props) {
        return hasValue(props?.id) && props?.id;
    }

    /**
     * Retrieves the feedback type attribute from the provided props.
     *
     * @param {Object} props - The properties object containing the feedbackType attribute.
     * @param {string} [props.feedbackType] - The feedback type to validate.
     * @returns {string|null} - Returns the feedback type if it is valid, "default" if invalid, or null if feedbackType is not provided.
     */
    getFeedbackTypeAttributeFromProps(props) {
        const validFeedbackTypes = ["error", "warning", "success", "info", "default"];
        if (hasValue(props?.feedbackType)) {
            return validFeedbackTypes.includes(props?.feedbackType) ? props?.feedbackType : "default";
        } else {
            return null;
        }
    }

    /**
     * Determines if the "hideOrgNr" property is set to the string "true".
     *
     * @param {Object} props - The properties object.
     * @param {boolean|string} [props.hideOrgNr] - The property indicating whether to hide the organization number.
     * @returns {string|undefined} Returns the string "true" if the "hideOrgNr" property is strictly equal to "true", otherwise undefined.
     */
    getHideOrgNr(props) {
        return props?.hideOrgNr?.toString() === "true" ? "true" : undefined;
    }

    /**
     * Retrieves the 'format' attribute from the provided props object.
     *
     * @param {Object} props - The properties object containing the 'format' attribute.
     * @param {string|number|boolean|null|undefined} [props.format] - The format value to be retrieved.
     * @returns {string|undefined} - The string representation of the 'format' attribute if it exists and has a value; otherwise, undefined.
     */
    getFormatAttributeFromProps(props) {
        return hasValue(props?.format) && props?.format?.toString();
    }

    /**
     * Retrieves the "showRowNumbers" attribute from the provided props.
     * Converts the value to a string and checks if it equals "true".
     * Returns "true" if the condition is met, otherwise returns undefined.
     *
     * @param {Object} props - The properties object containing the "showRowNumbers" attribute.
     * @param {boolean|string} [props.showRowNumbers] - The value of the "showRowNumbers" attribute.
     * @returns {string|undefined} - Returns "true" if the "showRowNumbers" attribute is strictly equal to "true" as a string, otherwise undefined.
     */
    getShowRowNumbersAttributeFromProps(props) {
        return props?.showRowNumbers?.toString() === "true" ? "true" : undefined;
    }

    /**
     * Retrieves the 'partType' attribute from the provided props object if it has a value.
     *
     * @param {Object} props - The properties object that may contain the 'partType' attribute.
     * @returns {*} The value of 'partType' if it exists and has a value; otherwise, returns a falsy value.
     */
    getPartTypeAttributeFromProps(props) {
        return hasValue(props?.partType) && props?.partType;
    }

    /**
     * Retrieves the text resource bindings from the given props object.
     * If the `resourceBindings` property exists and has a value, it returns its JSON string representation.
     * Otherwise, returns a falsy value.
     *
     * @param {Object} props - The properties object that may contain text resource bindings.
     * @returns {string|false} The JSON stringified text resource bindings if present, otherwise a falsy value.
     */
    getResourceBindingsFromProps(props) {
        return hasValue(props?.resourceBindings) && JSON.stringify(props?.resourceBindings);
    }

    /**
     * Retrieves the resource values from the provided props object.
     *
     * @param {Object} props - The properties object that may contain resource values.
     * @param {*} [props.resourceValues] - The resource values to retrieve.
     * @returns {*} The resource values if present and valid; otherwise, returns null.
     */
    getResourceValuesFromProps(props) {
        if (hasValue(props?.resourceValues)) {
            return JSON.stringify(props?.resourceValues);
        } else {
            return null;
        }
    }

    /**
     * Determines if the 'enableLinks' property in the given props is set to "true".
     *
     * @param {Object} props - The properties object to check.
     * @param {*} [props.enableLinks] - The value indicating whether links should be enabled.
     * @returns {string|undefined} Returns "true" if 'enableLinks' is strictly "true", otherwise undefined.
     */
    getEnableLinksFromProps(props) {
        return props?.enableLinks?.toString() === "true" ? "true" : undefined;
    }

    /**
     * Retrieves the 'text' attribute from the given props object if it has a value.
     *
     * @param {Object} props - The properties object that may contain a 'text' attribute.
     * @returns {*} The value of 'props.text' if it exists and passes the hasValue check; otherwise, returns false or undefined.
     */
    getTextAttributeFromProps(props) {
        return hasValue(props?.text) && props?.text;
    }
}
