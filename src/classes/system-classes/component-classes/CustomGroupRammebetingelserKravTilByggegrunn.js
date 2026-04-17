// Dependencies
import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.js";
import KravTilByggegrunn from "../../data-classes/KravTilByggegrunn.js";

// Global functions
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
import { getComponentDataValue } from "../../../functions/helpers.js";

/**
 * CustomGroupRammebetingelserKravTilByggegrunn is a custom component class for handling "krav til byggegrunn" group data and resource bindings.
 *
 * @extends CustomComponent
 *
 * @class
 * @param {Object} props - The properties for the component, including form data and resource bindings.
 *
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} validationMessages - Validation messages for the component.
 * @property {Object} resourceBindings - Text resource bindings for the component.
 * @property {Object} resourceValues - Resource values for rendering, including title and data or empty field text.
 */
export default class CustomGroupRammebetingelserKravTilByggegrunn extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);
        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings || {};
        this.resourceValues = {
            title: hasValue(props?.resourceValues?.title)
                ? props?.resourceValues?.title
                : getTextResourceFromResourceBinding(resourceBindings?.rammebetingelserKravTilByggegrunn?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.rammebetingelserKravTilByggegrunn?.emptyFieldText) : data
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
     * Retrieves the value from the form data and initializes a KravTilByggegrunn instance.
     *
     * @param {*} props - The properties object containing form data.
     * @returns {KravTilByggegrunn} An instance of KravTilByggegrunn initialized with the form data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const kravTilByggegrunn = new KravTilByggegrunn(data);
        return kravTilByggegrunn;
    }

    /**
     * Generates an object containing resource binding configurations for various components,
     * providing default resource keys if specific bindings are not supplied via props.
     *
     * @param {Object} props - The properties object containing optional resource bindings and flags.
     * @param {Object} [props.resourceBindings] - Optional resource binding overrides for each component.
     * @param {boolean|string} [props.hideTitle] - If true or "true", omits the title for rammebetingelserTilknytninger.
     * @param {boolean|string} [props.hideIfEmpty] - If true or "true", omits the emptyFieldText for rammebetingelserTilknytninger.
     * @returns {Object} An object mapping component keys to their resource binding configurations.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            risikotype: {
                title:
                    props?.resourceBindings?.risikotype?.title || "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.risikotype.title",
                emptyFieldText: props?.resourceBindings?.risikotype?.emptyFieldText || "resource.emptyFieldText.default"
            },
            sikkerhetsklasse: {
                title:
                    props?.resourceBindings?.sikkerhetsklasse?.title ||
                    "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.sikkerhetsklasse.title",
                emptyFieldText: props?.resourceBindings?.sikkerhetsklasse?.emptyFieldText || "resource.emptyFieldText.default"
            },
            omraaderisiko: {
                title: props?.resourceBindings?.omraaderisiko?.title || "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.title"
            },
            harMiljoeforhold: {
                title: props?.resourceBindings?.harMiljoeforhold?.title || "resource.rammebetingelser.kravTilByggegrunn.harMiljoeforhold.title",
                trueText: props?.resourceBindings?.harMiljoeforhold?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.harMiljoeforhold?.falseText || "resource.falseText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.rammebetingelserKravTilByggegrunn = {
                title: props?.resourceBindings?.title || "resource.kravTilByggegrunn.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.rammebetingelserKravTilByggegrunn = {
                ...resourceBindings.rammebetingelserKravTilByggegrunn,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage() {
        return [
            "custom-feedbacklist-validation-messages",
            "custom-field-boolean-text",
            "custom-header-text",
            "custom-paragraph",
            "custom-table-omraaderisiko"
        ];
    }
}
