// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";
import { formatString } from "../../../functions/dataFormatHelpers.js";

/**
 * CustomDescriptionListData is a custom component class for handling description list data.
 * It extends the CustomComponent class and provides methods to extract and transform data
 * for use in description lists, including handling empty states and resource values.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component, including form data and optional keys.
 *
 * @property {boolean} isEmpty - Indicates whether the data is empty.
 * @property {Object} resourceValues - Contains resource values for the title and data or empty field text.
 */
export default class CustomDescriptionListData extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: !props?.hideTitle && getComponentResourceValue(props, "title"),
            data: isEmpty ? getComponentResourceValue(props, "emptyFieldText") : data
        };
    }

    /**
     * Checks if the provided data has a value.
     *
     * @param {*} data - The data to check for content.
     * @returns {boolean} Returns true if the data has a value, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Generates an array of description list items from the provided items array,
     * extracting term and description values using the specified keys. If a format is provided
     * for a term or description, it uses the formatString function to format the data.
     *
     * @param {Array<Object>} items - The array of items to process.
     * @param {string} itemTermKey - The key used to extract the term from each item.
     * @param {string} itemDescriptionKey - The key used to extract the description from each item.
     * @returns {Array<{ term: any, description: any }>} An array of objects containing term and description pairs.
     */
    getDescriptionListItemsFromKeys(items, itemTermKey, itemDescriptionKey) {
        return Array.isArray(items) && items.length
            ? items.map((item) => {
                  const term = item?.[itemTermKey]?.format
                      ? formatString(item?.[itemTermKey]?.data, item?.[itemTermKey]?.format)
                      : item?.[itemTermKey]?.data;
                  const description = item?.[itemDescriptionKey]?.format
                      ? formatString(item?.[itemDescriptionKey]?.data, item?.[itemDescriptionKey]?.format)
                      : item?.[itemDescriptionKey]?.data;
                  return { term, description };
              })
            : [];
    }

    /**
     * Retrieves a value from the form data based on the provided props.
     * If either `itemTermKey` or `itemDescriptionKey` exists and has a value,
     * it returns a description list generated from those keys.
     * Otherwise, it returns the raw component data value.
     *
     * @param {Object} props - The properties containing form data and optional keys.
     * @param {string} [props.itemTermKey] - Optional key for the term in the description list.
     * @param {string} [props.itemDescriptionKey] - Optional key for the description in the description list.
     * @returns {*} The description list items if keys are provided, otherwise the raw data value.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        return hasValue(props?.itemTermKey) || hasValue(props?.itemDescriptionKey)
            ? this.getDescriptionListItemsFromKeys(data, props?.itemTermKey, props?.itemDescriptionKey)
            : data;
    }
}
