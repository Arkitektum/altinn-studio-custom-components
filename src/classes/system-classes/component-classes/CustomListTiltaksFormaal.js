// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentResourceValue, hasValue } from "../../../functions/helpers.js";

/**
 * CustomListTiltaksFormaal is a custom component class for handling list-based form data,
 * particularly for rendering and managing a list of "TiltaksFormaal" items.
 *
 * @extends CustomComponent
 *
 * @param {object} props - The properties passed to the component.
 * @param {object} props.formData - The form data containing the list items and simple binding.
 * @param {boolean} [props.isChildComponent] - Indicates if the component is a child component.
 * @param {object} [props.resourceValues] - Resource values for localization and display.
 * @param {string} [props.itemKey] - Optional key for identifying list items.
 *
 * @property {boolean} isEmpty - Indicates if the component's data is empty.
 * @property {object} resourceValues - Contains localized resource values for the component.
 *
 * @method hasContent
 * Checks if the provided data has content.
 * @param {*} data - The data to check.
 * @returns {boolean} True if data has content, false otherwise.
 *
 * @method getListItemsFromKey
 * Extracts and formats list items from the form data.
 * @param {object} formData - The form data containing the list.
 * @returns {string[]} An array of formatted list item strings.
 *
 * @method getValueFromFormData
 * Retrieves the list items from the component's props.
 * @param {object} props - The component's properties.
 * @returns {string[]} An array of formatted list item strings.
 *
 * @method getComponentDataValue
 * Retrieves the relevant data value from the component's props.
 * @param {object} props - The component's properties.
 * @returns {object} The data value object containing simpleBinding and data.
 */
export default class CustomListTiltaksFormaal extends CustomComponent {
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
     * Generates a list of item descriptions from the provided form data.
     *
     * Iterates over the `data` array in the `formData` object and returns an array of strings.
     * If an item's `kodebeskrivelse` is "Annet", it appends the `simpleBinding` value from `formData`.
     * Otherwise, it returns the `kodebeskrivelse` as is.
     *
     * @param {Object} formData - The form data object containing the items.
     * @param {Array} [formData.data] - The array of items to process.
     * @param {string} [formData.simpleBinding] - The value to append for items with "Annet" as `kodebeskrivelse`.
     * @returns {string[]} An array of item descriptions.
     */
    getListItemsFromKey(formData) {
        const data = formData?.data;
        return Array.isArray(data) && data.length
            ? data.map((item) => {
                  if (item?.kodebeskrivelse === "Annet") {
                      return `${item?.kodebeskrivelse}: ${formData?.simpleBinding}`;
                  } else {
                      return item?.kodebeskrivelse;
                  }
              })
            : [];
    }

    /**
     * Retrieves a list of items from the form data based on the provided properties.
     *
     * @param {Object} props - The properties object containing component and item information.
     * @param {string} [props.itemKey] - The key used to extract specific list items from the form data.
     * @returns {*} The list items extracted from the form data using the specified item key.
     */
    getValueFromFormData(props) {
        const formData = this.getComponentDataValue(props);
        return this.getListItemsFromKey(formData, props?.itemKey);
    }

    /**
     * Retrieves the component data value based on whether the component is a child.
     *
     * @param {Object} props - The properties object.
     * @param {boolean} props.isChildComponent - Indicates if the component is a child component.
     * @param {Object} [props.resourceValues] - Resource values for child components.
     * @param {Object} [props.resourceValues.data] - Data for child components.
     * @param {Object} [props.formData] - Form data for non-child components.
     * @param {*} [props.formData.simpleBinding] - Simple binding value for non-child components.
     * @param {*} [props.formData.data] - Data value for non-child components.
     * @returns {*} The data value for child components, or an object containing simpleBinding and data for non-child components.
     */
    getComponentDataValue(props) {
        if (props.isChildComponent) {
            return props.resourceValues?.data;
        } else {
            return { simpleBinding: props.formData?.simpleBinding, data: props.formData?.data };
        }
    }
}
