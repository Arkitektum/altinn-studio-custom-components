// Classes
import CustomComponent from "../CustomComponent.js";
import Ansvarsomraade from "../../data-classes/Ansvarsomraade.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomTableAnsvarsomraade is a specialized table component for displaying "Ansvarsomraade" data.
 * It extends CustomComponent and provides logic for extracting, validating, and binding resources
 * for table fields related to responsibility areas.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component, including form data and resource bindings.
 *
 * @property {boolean} isEmpty - Indicates if the table data is empty.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} validationMessages - Validation messages for the component.
 * @property {Object} resourceBindings - Resource bindings for table fields.
 * @property {Object} resourceValues - Resource values for rendering, including empty field text.
 */
export default class CustomTableAnsvarsomraade extends CustomComponent {
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
            title: props?.resourceValues?.title,
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.eiendomByggested?.emptyFieldText) : data
        };
    }

    /**
     * Extracts and returns the list of "Ansvarsomraade" from the form data using the provided resource bindings.
     *
     * @param {Object} props - The properties containing form data and component information.
     * @param {Object} resourceBindings - The resource bindings used to map data fields.
     * @returns {Array} The list of "Ansvarsomraade" extracted from the form data.
     */
    getValueFromFormData(props, resourceBindings) {
        const data = getComponentDataValue(props);
        const ansvarsomraadeList = this.getAnsvarsomraadeListFromData(data, resourceBindings);
        return ansvarsomraadeList;
    }

    /**
     * Generates a list of Ansvarsomraade instances from the provided data.
     *
     * @param {*} data - The input data, expected to be an array of omraaderisiko objects.
     * @param {*} resourceBindings - Resource bindings to be passed to each Ansvarsomraade instance.
     * @returns {Ansvarsomraade[]|undefined} An array of Ansvarsomraade instances if data is valid, otherwise undefined.
     */
    getAnsvarsomraadeListFromData(data, resourceBindings) {
        if (!hasValue(data)) {
            return undefined;
        }
        return Array.isArray(data) ? data.map((omraaderisiko) => new Ansvarsomraade(omraaderisiko, resourceBindings)) : [];
    }

    /**
     * Retrieves validation messages based on provided text resource bindings.
     *
     * @param {Object} textResourceBindings - An object containing keys for text resources to validate.
     * @returns {boolean} Returns true if there are missing text resources, otherwise false.
     */
    getValidationMessages(textResourceBindings) {
        const textResources = getTextResources();
        return hasMissingTextResources(textResources, textResourceBindings);
    }

    /**
     * Checks if the provided data contains any content.
     *
     * @param {Object} data - The data object to check.
     * @returns {boolean} Returns true if the data contains a value, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Generates an object containing resource binding configurations for various fields.
     * Each field includes localized titles and optional empty field text, with fallbacks to default resource keys.
     * The returned object can be customized based on the provided props, including conditional inclusion of titles and empty field text for "ansvarsomraade".
     *
     * @param {Object} props - The properties used to customize resource bindings.
     * @param {Object} [props.resourceBindings] - Optional resource binding overrides for each field.
     * @param {boolean|string} [props.hideTitle] - If true or "true", omits the title for "ansvarsomraade".
     * @param {boolean|string} [props.hideIfEmpty] - If true or "true", omits the empty field text for "ansvarsomraade".
     * @returns {Object} An object mapping field names to their resource binding configurations.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            tiltaksklasse: {
                title: props?.resourceBindings?.tiltaksklasse?.title || "resource.tiltaksklasse.title",
                emptyFieldText: props?.resourceBindings?.tiltaksklasse?.emptyFieldText || "resource.emptyFieldText.default"
            },
            ansvarsomraade: {
                title: props?.resourceBindings?.ansvarsomraade?.title || "resource.ansvarsomraade.title",
                emptyFieldText: props?.resourceBindings?.ansvarsomraade?.emptyFieldText || "resource.emptyFieldText.default"
            },
            foretak: {
                title: props?.resourceBindings?.foretak?.title || "resource.foretak.title",
                emptyFieldText: props?.resourceBindings?.foretak?.emptyFieldText || "resource.emptyFieldText.default"
            },
            planlagteSamsvarKontrollErklaeringer: {
                title: props?.resourceBindings?.planlagteSamsvarKontrollErklaeringer?.title || "resource.planlagteSamsvarKontrollErklaeringer.title",
                emptyFieldText: props?.resourceBindings?.planlagteSamsvarKontrollErklaeringer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            ansvarsomraadeStatus: {
                title: props?.resourceBindings?.ansvarsomraadeStatus?.title || "resource.ansvarsomraadeStatus.title",
                emptyFieldText: props?.resourceBindings?.ansvarsomraadeStatus?.emptyFieldText || "resource.emptyFieldText.default"
            },
            samsvarKontrollPlanlagtVedRammetillatelse: {
                title:
                    props?.resourceBindings?.samsvarKontrollPlanlagtVedRammetillatelse?.title ||
                    "resource.samsvarKontrollPlanlagtVedRammetillatelse.title"
            },
            samsvarKontrollPlanlagtVedIgangsettingstillatelse: {
                title:
                    props?.resourceBindings?.samsvarKontrollPlanlagtVedIgangsettingstillatelse?.title ||
                    "resource.samsvarKontrollPlanlagtVedIgangsettingstillatelse.title"
            },
            samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse: {
                title:
                    props?.resourceBindings?.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse?.title ||
                    "resource.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse.title"
            },
            samsvarKontrollPlanlagtVedFerdigattest: {
                title:
                    props?.resourceBindings?.samsvarKontrollPlanlagtVedFerdigattest?.title || "resource.samsvarKontrollPlanlagtVedFerdigattest.title"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true" && !hasValue(props?.resourceValues?.title)) {
            resourceBindings.ansvarsfordeling = {
                title: props?.resourceBindings?.title || "resource.ansvarsfordeling.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.ansvarsfordeling = {
                ...resourceBindings.ansvarsfordeling,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
