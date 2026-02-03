// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
import KontrollAnsvarsomraade from "../../data-classes/KontrollAnsvarsomraade.js";

/**
 * Initializes a new instance of the CustomGroupKontrollAnsvarsomraade class.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.formData - The form data used to retrieve values.
 * @param {Object} props.resourceBindings - Resource bindings for text and validation.
 *
 * @property {boolean} isEmpty - Indicates if the component's data is empty.
 * @property {Array} validationMessages - Validation messages for the component.
 * @property {boolean} hasValidationMessages - Whether there are validation messages.
 * @property {Object} resourceBindings - The resource bindings used by the component.
 * @property {Object} resourceValues - The resource values, including data or empty field text.
 */
export default class CustomGroupKontrollAnsvarsomraade extends CustomComponent {
    constructor(props) {
        super(props);
        const resourceBindings = this.getResourceBindings(props);
        const data = this.getValueFromFormData(props, resourceBindings);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings;
        this.resourceValues = {
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.ansvarsomraade?.emptyFieldText) : data
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
     * Retrieves validation messages based on provided resource bindings.
     *
     * @param {Object} resourceBindings - The resource bindings to check for missing text resources.
     * @returns {Array|string|boolean} - The result of checking for missing text resources, which may be an array of messages, a string, or a boolean depending on implementation.
     */
    getValidationMessages(resourceBindings) {
        return hasMissingTextResources(resourceBindings);
    }

    /**
     * Retrieves the value from form data and returns an instance of KontrollAnsvarsomraade.
     *
     * @param {Object} props - The properties containing form data.
     * @returns {KontrollAnsvarsomraade} An instance of KontrollAnsvarsomraade initialized with the component data value.
     */
    getValueFromFormData(props, resourceBindings) {
        const data = getComponentDataValue(props);
        const kontrollAnsvarsomraade = new KontrollAnsvarsomraade(data, resourceBindings);
        return kontrollAnsvarsomraade;
    }


    /**
     * Generates an object containing resource binding configurations for various fields.
     *
     * Each field contains localized resource keys for titles, empty field texts, and, where applicable, 
     * true/false/default texts. If a specific resource binding is not provided in `props`, a default 
     * resource key is used.
     *
     * @param {Object} props - The properties object containing optional resourceBindings.
     * @param {Object} [props.resourceBindings] - Optional resource binding overrides for each field.
     * @returns {Object} An object with resource binding configurations for each field.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            funksjon: {
                title: props?.resourceBindings?.funksjon?.title || "resource.funksjon.title",
                emptyFieldText: props?.resourceBindings?.funksjon?.emptyFieldText || "resource.emptyFieldText.default"
            },
            beskrivelseAvAnsvarsomraadet: {
                title: props?.resourceBindings?.beskrivelseAvAnsvarsomraadet?.title || "resource.beskrivelseAvAnsvarsomraadet.title",
                emptyFieldText: props?.resourceBindings?.beskrivelseAvAnsvarsomraadet?.emptyFieldText || "resource.emptyFieldText.default"
            },
            datoAnsvarsrettErklaert: {
                title: props?.resourceBindings?.datoAnsvarsrettErklaert?.title || "resource.datoAnsvarsrettErklaert.title",
                emptyFieldText: props?.resourceBindings?.datoAnsvarsrettErklaert?.emptyFieldText || "resource.emptyFieldText.default"
            },
            erAnsvarsomraadetAvsluttet: {
                title: props?.resourceBindings?.erAnsvarsomraadetAvsluttet?.title || "resource.erAnsvarsomraadetAvsluttet.title",
                trueText: props?.resourceBindings?.erAnsvarsomraadetAvsluttet?.trueText?.title || "resource.trueText.default",
                falseText: props?.resourceBindings?.erAnsvarsomraadetAvsluttet?.falseText?.title || "resource.falseText.default",
                defaultText: props?.resourceBindings?.erAnsvarsomraadetAvsluttet?.defaultText || "resource.emptyFieldText.default"
            },
            ansvarsomraade: {
                title: props?.resourceBindings?.ansvarsomraade?.title || "resource.ansvarsomraade.title",
                emptyFieldText: props?.resourceBindings?.ansvarsomraade?.emptyFieldText || "resource.emptyFieldText.default"
            },
            sluttrapport: {
                title: props?.resourceBindings?.sluttrapport?.title || "resource.sluttrapport.title",
                emptyFieldText: props?.resourceBindings?.sluttrapport?.emptyFieldText || "resource.emptyFieldText.default"
            },
            harObserverteAvvik: {
                title: props?.resourceBindings?.harObserverteAvvik?.title || "resource.harObserverteAvvik.title",
                emptyFieldText: props?.resourceBindings?.harObserverteAvvik?.emptyFieldText || "resource.emptyFieldText.default"
            },
            harAapneAvvik: {
                title: props?.resourceBindings?.harAapneAvvik?.title || "resource.harAapneAvvik.title",
                emptyFieldText: props?.resourceBindings?.harAapneAvvik?.emptyFieldText || "resource.emptyFieldText.default"
            },
            harIngenAvvik: {
                title: props?.resourceBindings?.harIngenAvvik?.title || "resource.harIngenAvvik.title",
                emptyFieldText: props?.resourceBindings?.harIngenAvvik?.emptyFieldText || "resource.emptyFieldText.default"
            },
            erDetFunnetAvvik: {
                title: props?.resourceBindings?.erDetFunnetAvvik?.title || "resource.erDetFunnetAvvik.title",
                emptyFieldText: props?.resourceBindings?.erDetFunnetAvvik?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        return resourceBindings;
    }
}
