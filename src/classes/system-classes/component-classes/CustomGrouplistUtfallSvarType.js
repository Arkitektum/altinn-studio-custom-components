// Classes
import CustomComponent from "../CustomComponent.js";
import UtfallSvar from "../../data-classes/UtfallSvar.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources } from "../../../functions/validations.js";

/**
 * CustomGrouplistUtfallSvarType is a custom component class that extends CustomComponent.
 * It processes form data, groups array items by their "UtfallType", and manages resource values for display.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component.
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {Object} resourceValues - Contains resource values for title and data display.
 *
 */
export default class CustomGrouplistUtfallSvarType extends CustomComponent {
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
     * Retrieves validation messages based on the provided resource bindings.
     *
     * @param {Object} resourceBindings - An object containing resource binding keys.
     * @returns {Array|string|boolean} The result of the validation, which may be an array of messages, a string, or a boolean indicating missing resources.
     */
    getValidationMessages(resourceBindings) {
        const textResources = getTextResources();
        return hasMissingTextResources(textResources, resourceBindings);
    }

    /**
     * Retrieves the component data value from the provided props and groups array items by their "UtfallType".
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {Object} The grouped array items, organized by "UtfallType".
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        return this.groupArrayItemsByUtfallType(data);
    }

    /**
     * Groups an array of items by the `utfallType.kodeverdi` property.
     *
     * @param {Array} array - The array of items to be grouped.
     * @returns {Object} An object where each key is a unique `utfallType.kodeverdi` and the value is an array of `UtfallSvar` instances.
     */
    groupArrayItemsByUtfallType(array) {
        return hasValue(array)
            ? array.reduce((acc, obj) => {
                  const key = obj?.utfallType?.kodeverdi;
                  if (!key?.length) {
                      return acc;
                  }
                  if (!acc[key]) {
                      acc[key] = [];
                  }
                  acc[key].push(new UtfallSvar(obj));
                  return acc;
              }, {})
            : {};
    }
}
