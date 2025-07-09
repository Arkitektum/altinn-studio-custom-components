// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";

/**
 * CustomListData is a custom component class that handles list data extraction and resource value management.
 * It extends the CustomComponent class and provides utility methods for working with form data and list items.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties used to initialize the component.
 * @param {*} [props.itemKey] - Optional key to retrieve specific list items from the data.
 *
 * @property {boolean} isEmpty - Indicates whether the data is empty.
 * @property {Object} resourceValues - Contains resource values for the component, such as title and data/empty text.
 *
 * @method hasContent Checks if the provided data has a value.
 * @method getListItemsFromKey Extracts values from a list of objects based on a specified key.
 * @method getValueFromFormData Retrieves a value from the form data based on the provided props.
 */
export default class CustomListData extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: getComponentResourceValue(props, "title"),
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
     * Extracts values from a list of objects based on a specified key.
     *
     * @param {Array<Object>} items - The list of objects to extract values from.
     * @param {string} itemKey - The key whose values need to be extracted.
     * @returns {Array<*>} An array of values corresponding to the specified key from each object in the list.
     */
    getListItemsFromKey(items, itemKey) {
        return Array.isArray(items) && items.length ? items.map((item) => item?.[itemKey]) : [];
    }

    /**
     * Retrieves a value from the form data based on the provided props.
     * If an item key is present in props, it returns the list items corresponding to that key.
     * Otherwise, it returns the entire component data value.
     *
     * @param {Object} props - The properties containing form data and optional item key.
     * @param {*} [props.itemKey] - Optional key to retrieve specific list items.
     * @returns {*} The value from the form data, either filtered by item key or the entire data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        return hasValue(props?.itemKey) ? this.getListItemsFromKey(data, props?.itemKey) : data;
    }
}
