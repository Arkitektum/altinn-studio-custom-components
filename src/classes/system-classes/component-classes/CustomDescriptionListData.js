// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";

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
     * Transforms an array of items into an array of objects with `term` and `description` properties,
     * using the specified keys to extract values from each item.
     *
     * @param {Array<Object>} items - The array of items to transform.
     * @param {string} itemTermKey - The key to extract the term from each item.
     * @param {string} itemDescriptionKey - The key to extract the description from each item.
     * @returns {Array<{term: any, description: any}>} An array of objects with `term` and `description` properties,
     *   or an empty array if the input is not a non-empty array.
     */
    getDescriptionListItemsFromKeys(items, itemTermKey, itemDescriptionKey) {
        return Array.isArray(items) && items.length
            ? items.map((item) => {
                  return { term: item?.[itemTermKey], description: item?.[itemDescriptionKey] };
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
