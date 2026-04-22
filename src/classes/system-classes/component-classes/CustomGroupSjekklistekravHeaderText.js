// Dependencies
import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.js";

export default class CustomGroupSjekklistekravHeaderText extends CustomComponent {
    constructor(props) {
        super(props);
        const resourceBindings = this.getResourceBindings(props);
        const data = this.getValueFromResourceBindings(resourceBindings);

        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceBindings = resourceBindings?.sjekklistekravHeader || {};
        this.resourceValues = {
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.sjekklistekravHeader?.emptyFieldText) : data
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
     * Retrieves the values from the resource bindings.
     *
     * @param {Object} resourceBindings - The resource bindings object.
     * @returns {Object} An object containing the values from the resource bindings.
     */
    getValueFromResourceBindings(resourceBindings) {
        return {
            sjekklistepunkt: getTextResourceFromResourceBinding(resourceBindings?.sjekklistekravHeader?.sjekklistepunkt),
            sjekklistepunktsvar: getTextResourceFromResourceBinding(resourceBindings?.sjekklistekravHeader?.sjekklistepunktsvar)
        };
    }

    /**
     * Retrieves the resource bindings for the component based on the provided props.
     *
     * @param {Object} props - The properties object containing resource bindings.
     * @returns {Object} An object containing the resource bindings for the component.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            sjekklistepunkt: props?.resourceBindings?.sjekklistepunkt,
            sjekklistepunktsvar: props?.resourceBindings?.sjekklistepunktsvar
        };
        return {
            sjekklistekravHeader: resourceBindings
        };
    }

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage() {
        return ["custom-field"];
    }
}
