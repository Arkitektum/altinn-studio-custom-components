import type { ComponentProps, ResourceBindingGroup } from "../../../types.ts";
import type { KontrollAnsvarsomraadeProps } from "../../data-classes/KontrollAnsvarsomraade.ts";
// Dependencies
import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.ts";
import KontrollAnsvarsomraade from "../../data-classes/KontrollAnsvarsomraade.ts";

// Global functions
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.ts";
import { getComponentDataValue } from "../../../functions/helpers.ts";

/**
 * Initializes a new instance of the CustomGroupKontrollErklaeringer class.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.resourceValues - Resource values for the component, including title.
 *
 * @property {boolean} isEmpty - Indicates if the data is empty.
 * @property {Array} validationMessages - Validation messages for the component.
 * @property {boolean} hasValidationMessages - Indicates if there are any validation messages.
 * @property {Object} resourceBindings - Resource bindings used in the component.
 * @property {Object} resourceValues - Contains title and data for the component.
 */
export default class CustomGroupKontrollErklaeringer extends CustomComponent {
    declare resourceBindings: Record<string, ResourceBindingGroup | undefined>;
    declare resourceValues: { title?: unknown; data?: KontrollAnsvarsomraade | string };

    constructor(props: ComponentProps) {
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
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.erklaeringer?.emptyFieldText) : data
        };
    }

    /**
     * Retrieves and constructs a KontrollAnsvarsomraade instance from form data and resource bindings.
     *
     * @param {Object} props - The properties containing form data.
     * @param {Object} resourceBindings - The resource bindings used for initialization.
     * @returns {KontrollAnsvarsomraade} An instance of KontrollAnsvarsomraade initialized with the extracted data and resource bindings.
     */
    getValueFromFormData(props: ComponentProps, resourceBindings?: Record<string, ResourceBindingGroup | undefined>): KontrollAnsvarsomraade {
        const data = getComponentDataValue(props);
        const kontrollAnsvarsomraade = new KontrollAnsvarsomraade(data as KontrollAnsvarsomraadeProps | undefined, resourceBindings);
        return kontrollAnsvarsomraade;
    }

    /**
     * Retrieves validation messages based on the provided text resource bindings.
     *
     * @param {Object} textResourceBindings - An object containing text resource bindings to be validated.
     * @returns {Array|string|boolean} The result of the validation, as returned by hasMissingTextResources.
     */
    getValidationMessages(textResourceBindings?: Record<string, ResourceBindingGroup | undefined>) {
        return hasMissingTextResources(textResourceBindings);
    }

    /**
     * Generates an object containing resource bindings for various text fields,
     * providing default values if not specified in the props.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Resource binding overrides for text fields.
     * @param {Object} [props.resourceBindings.kontrollErklaeringTekst] - Overrides for 'kontrollErklaeringTekst'.
     * @param {Object} [props.resourceBindings.kontrollKONTROLLTekst] - Overrides for 'kontrollKONTROLLTekst'.
     * @param {string} [props.resourceBindings.title] - Title override for 'erklaeringer'.
     * @param {string} [props.resourceBindings.emptyFieldText] - Empty field text override for 'erklaeringer'.
     * @param {Object} [props.resourceValues] - Resource values, used to check for title presence.
     * @param {boolean|string} [props.hideTitle] - If true, hides the title for 'erklaeringer'.
     * @param {boolean|string} [props.hideIfEmpty] - If true, hides the empty field text for 'erklaeringer'.
     * @returns {Object} Resource bindings object with localized text and titles for each field.
     */
    getResourceBindings(props?: ComponentProps) {
        const resourceBindings: Record<string, ResourceBindingGroup> = {
            kontrollErklaeringTekst: {
                title: props?.resourceBindings?.kontrollErklaeringTekst?.title || "resource.kontrollErklaeringTekst.title",
                emptyFieldText: props?.resourceBindings?.kontrollErklaeringTekst?.emptyFieldText || "resource.emptyFieldText.default"
            },
            kontrollKONTROLLTekst: {
                title: props?.resourceBindings?.kontrollKONTROLLTekst?.title || "resource.kontrollKONTROLLTekst.title",
                emptyFieldText: props?.resourceBindings?.kontrollKONTROLLTekst?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true" && !hasValue(props?.resourceValues?.title)) {
            resourceBindings.erklaeringer = {
                title: props?.resourceBindings?.title || "resource.erklaering.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.erklaeringer = {
                ...resourceBindings.erklaeringer,
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
    getComponentUsage(): string[] {
        return ["custom-feedbacklist-validation-messages", "custom-header-text", "custom-paragraph-text", "custom-paragraph"];
    }
}
