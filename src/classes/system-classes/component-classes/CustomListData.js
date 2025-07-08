// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";

export default class CustomListData extends CustomComponent {
    constructor(props) {
        super(props);
        const formDataValue = this.getValueFromFormData(props);
        const isEmpty = props?.isEmpty !== undefined ? props.isEmpty : !this.hasContent(formDataValue);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: getTextResourceFromResourceBinding(props?.resourceBindings?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(props?.resourceBindings?.emptyFieldText) : formDataValue
        };
    }

    hasContent(formDataValue) {
        return hasValue(formDataValue);
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

    getValueFromFormData(props) {
        return hasValue(props?.itemKey) ? this.getListItemsFromKey(props?.formData?.data, props?.itemKey) : props?.formData?.data;
    }
}
