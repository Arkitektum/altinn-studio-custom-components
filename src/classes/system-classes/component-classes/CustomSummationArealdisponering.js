// Classes
import CustomComponent from "../CustomComponent.js";
import Arealdisponering from "../../data-classes/Arealdisponering.js";
import ArealdisponeringSummation from "../data-classes/ArealdisponeringSummation.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomSummationArealdisponering is a custom component class for handling area disposition summation logic.
 * It processes form data, manages resource bindings, and provides validation for arealdisponering (area disposition) fields.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object containing form data, resource bindings, and configuration.
 * @param {Object} [props.resourceBindings] - Optional object with custom resource binding overrides for each field.
 * @param {boolean|string} [props.hideIfEmpty] - If true or "true", omits the 'part' resource binding from the result.
 *
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} validationMessages - The validation messages for the component.
 * @property {Object} resourceBindings - The resource bindings for the component.
 * @property {Object} resourceValues - The resource values for the component, including data or empty field text.
 */
export default class CustomSummationArealdisponering extends CustomComponent {
    constructor(props) {
        super(props);
        const resourceBindings = this.getResourceBindings(props);
        const data = this.getValueFromFormData(props, resourceBindings);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = {
            emptyFieldText: resourceBindings?.arealdisponering?.emptyFieldText || undefined
        };
        this.resourceValues = {
            title: !props?.hideTitle && getTextResourceFromResourceBinding(resourceBindings?.arealdisponering?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.arealdisponering?.emptyFieldText) : data
        };
    }

    /**
     * Retrieves and processes form data to create an ArealdisponeringSummation instance if valid.
     *
     * @param {Object} props - The properties containing form data and context.
     * @param {Object} resourceBindings - Resource bindings required for summation processing.
     * @returns {ArealdisponeringSummation|undefined} An instance of ArealdisponeringSummation if the data is valid; otherwise, undefined.
     */
    getValueFromFormData(props, resourceBindings) {
        const data = getComponentDataValue(props);
        if (!hasValue(data)) {
            return undefined;
        }
        const arealdisponering = new Arealdisponering(data);
        const arealdisponeringSummation = new ArealdisponeringSummation(arealdisponering, resourceBindings);
        return this.hasArealdisponeringSummationProps(arealdisponeringSummation) ? arealdisponeringSummation : undefined;
    }

    /**
     * Checks if the provided `arealdisponering` object contains either bebyggelsen data or tomtearealet data.
     *
     * @param {Object} arealdisponering - The object representing arealdisponering data to check.
     * @returns {boolean} Returns `true` if either bebyggelsen data or tomtearealet data is present, otherwise `false`.
     */
    hasArealdisponeringSummationProps(arealdisponering) {
        return this.hasBebyggelsenData(arealdisponering) || this.hasTomtearealetData(arealdisponering);
    }

    /**
     * Checks if the given `arealdisponering` object contains valid `bebyggelsen` data.
     *
     * @param {Object} arealdisponering - The object to check for `bebyggelsen` data.
     * @returns {boolean} Returns `true` if `arealdisponering.bebyggelsen.resourceValues.data` has a value, otherwise `false`.
     */
    hasBebyggelsenData(arealdisponering) {
        return hasValue(arealdisponering?.bebyggelsen?.resourceValues?.data);
    }

    /**
     * Checks if the given `arealdisponering` object contains valid tomtearealet data.
     *
     * @param {Object} arealdisponering - The object representing area disposition.
     * @returns {boolean} Returns `true` if `arealdisponering.tomtearealet.resourceValues.data` has a value, otherwise `false`.
     */
    hasTomtearealetData(arealdisponering) {
        return hasValue(arealdisponering?.tomtearealet?.resourceValues?.data);
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
     * Checks if the provided form data contains any content.
     *
     * @param {Object} formDataValue - The form data object to check.
     * @returns {boolean} Returns true if the form data contains a value, otherwise false.
     */
    hasContent(formDataValue) {
        return hasValue(formDataValue);
    }

    /**
     * Generates an object containing text resource bindings for various arealdisponering (area disposition) fields.
     * Each field may include a title, empty field text, and an operator, with values sourced from the provided props or default resource keys.
     *
     * @param {Object} props - The properties object containing resource bindings and configuration.
     * @param {Object} [props.resourceBindings] - Optional object with custom resource binding overrides for each field.
     * @param {boolean|string} [props.hideIfEmpty] - If true or "true", omits the 'part' resource binding from the result.
     * @returns {Object} An object mapping field names to their respective resource binding configurations.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            tomtearealet: {
                title: props?.resourceBindings?.tomtearealet?.title || `resource.rammebetingelser.arealdisponering.tomtearealet.title`
            },
            bebyggelsen: {
                title: props?.resourceBindings?.bebyggelsen?.title || `resource.rammebetingelser.arealdisponering.bebyggelsen.title`
            },
            arealBebyggelseEksisterende: {
                title:
                    props?.resourceBindings?.arealBebyggelseEksisterende?.title ||
                    `resource.rammebetingelser.arealdisponering.arealBebyggelseEksisterende.title`,
                emptyFieldText: props?.resourceBindings?.arealBebyggelseEksisterende?.emptyFieldText || "resource.emptyFieldText.default",
                unit: "resource.unit.meterSquared"
            },
            arealBebyggelseNytt: {
                title: props?.resourceBindings?.arealBebyggelseNytt?.title || `resource.rammebetingelser.arealdisponering.arealBebyggelseNytt.title`,
                emptyFieldText: props?.resourceBindings?.arealBebyggelseNytt?.emptyFieldText || "resource.emptyFieldText.default",
                operator: "resource.operator.plus",
                unit: "resource.unit.meterSquared"
            },
            arealBebyggelseSomSkalRives: {
                title:
                    props?.resourceBindings?.arealBebyggelseSomSkalRives?.title ||
                    `resource.rammebetingelser.arealdisponering.arealBebyggelseSomSkalRives.title`,
                emptyFieldText: props?.resourceBindings?.arealBebyggelseSomSkalRives?.emptyFieldText || "resource.emptyFieldText.default",
                operator: "resource.operator.minus",
                unit: "resource.unit.meterSquared"
            },
            arealSumByggesak: {
                title: props?.resourceBindings?.arealSumByggesak?.title || `resource.rammebetingelser.arealdisponering.arealSumByggesak.title`,
                emptyFieldText: props?.resourceBindings?.arealSumByggesak?.emptyFieldText || "resource.emptyFieldText.default",
                operator: "resource.operator.equals",
                unit: "resource.unit.meterSquared"
            },
            beregnetMaksByggeareal: {
                title:
                    props?.resourceBindings?.beregnetMaksByggeareal?.title ||
                    `resource.rammebetingelser.arealdisponering.beregnetMaksByggeareal.title`,
                emptyFieldText: props?.resourceBindings?.beregnetMaksByggeareal?.emptyFieldText || "resource.emptyFieldText.default",
                unit: "resource.unit.meterSquared"
            },
            parkeringsarealTerreng: {
                title:
                    props?.resourceBindings?.parkeringsarealTerreng?.title ||
                    `resource.rammebetingelser.arealdisponering.parkeringsarealTerreng.title`,
                emptyFieldText: props?.resourceBindings?.parkeringsarealTerreng?.emptyFieldText || "resource.emptyFieldText.default",
                operator: "resource.operator.plus",
                unit: "resource.unit.meterSquared"
            },
            tomtearealBeregnet: {
                title: props?.resourceBindings?.tomtearealBeregnet?.title || `resource.rammebetingelser.arealdisponering.tomtearealBeregnet.title`,
                emptyFieldText: props?.resourceBindings?.tomtearealBeregnet?.emptyFieldText || "resource.emptyFieldText.default",
                operator: "resource.operator.equals",
                unit: "resource.unit.meterSquared"
            },
            tomtearealByggeomraade: {
                title:
                    props?.resourceBindings?.tomtearealByggeomraade?.title ||
                    `resource.rammebetingelser.arealdisponering.tomtearealByggeomraade.title`,
                emptyFieldText: props?.resourceBindings?.tomtearealByggeomraade?.emptyFieldText || "resource.emptyFieldText.default",
                unit: "resource.unit.meterSquared"
            },
            tomtearealSomLeggesTil: {
                title:
                    props?.resourceBindings?.tomtearealSomLeggesTil?.title ||
                    `resource.rammebetingelser.arealdisponering.tomtearealSomLeggesTil.title`,
                emptyFieldText: props?.resourceBindings?.tomtearealSomLeggesTil?.emptyFieldText || "resource.emptyFieldText.default",
                operator: "resource.operator.plus",
                unit: "resource.unit.meterSquared"
            },
            tomtearealSomTrekkesFra: {
                title:
                    props?.resourceBindings?.tomtearealSomTrekkesFra?.title ||
                    `resource.rammebetingelser.arealdisponering.tomtearealSomTrekkesFra.title`,
                emptyFieldText: props?.resourceBindings?.tomtearealSomTrekkesFra?.emptyFieldText || "resource.emptyFieldText.default",
                operator: "resource.operator.minus",
                unit: "resource.unit.meterSquared"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.arealdisponering = {
                ...resourceBindings.arealdisponering,
                title: props?.resourceBindings?.title || "resource.arealdisponering.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.arealdisponering = {
                ...resourceBindings.arealdisponering,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
