import type { ComponentProps, ResourceBindingGroup } from "../../../types.ts";
import type { FakturamottakerProps } from "../../data-classes/Fakturamottaker.ts";
// Dependencies
import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.ts";
import Fakturamottaker from "../../data-classes/Fakturamottaker.ts";

// Global functions
import { getComponentDataValue } from "../../../functions/helpers.ts";
import { hasValidationMessages } from "../../../functions/validations.ts";

/**
 * CustomGroupFakturamottaker gathers the fields of an invoice recipient into one component, so a form author binds
 * the whole object once instead of writing a field component per property.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component, including form data and resource bindings.
 * @param {Object} [props.resourceBindings] - Optional resource bindings for customizing text resources.
 * @param {Object} [props.resourceValues] - Optional resource values for overriding default text resources.
 *
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource bindings for text resources.
 * @property {Object} resourceValues - Values for text resources, including title and data.
 */
export default class CustomGroupFakturamottaker extends CustomComponent {
    declare resourceBindings: Record<string, ResourceBindingGroup | undefined>;
    declare resourceValues: { title?: unknown; data?: Fakturamottaker | string };

    constructor(props: ComponentProps) {
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
                : getTextResourceFromResourceBinding(resourceBindings?.fakturamottaker?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.fakturamottaker?.emptyFieldText) : data
        };
    }

    /**
     * Retrieves the value from form data and returns an instance of Fakturamottaker.
     *
     * @param {Object} props - The properties containing form data.
     * @returns {Fakturamottaker} An instance of Fakturamottaker initialized with the component data value.
     */
    getValueFromFormData(props: ComponentProps): Fakturamottaker {
        const data = getComponentDataValue(props);
        const fakturamottaker = new Fakturamottaker(data as FakturamottakerProps | undefined);
        return fakturamottaker;
    }

    /**
     * Generates resource bindings for component properties, providing default resource keys if not specified.
     *
     * @param {Object} props - The properties object containing resource bindings and display options.
     * @param {Object} [props.resourceBindings] - Custom resource binding overrides.
     * @param {Object} [props.resourceBindings.navn] - Resource bindings for 'navn'.
     * @param {Object} [props.resourceBindings.adresse] - Resource bindings for 'adresse'.
     * @param {Object} [props.resourceBindings.organisasjonsnummer] - Resource bindings for 'organisasjonsnummer'.
     * @param {Object} [props.resourceBindings.bestillerreferanse] - Resource bindings for 'bestillerreferanse'.
     * @param {Object} [props.resourceBindings.fakturareferanse] - Resource bindings for 'fakturareferanse'.
     * @param {Object} [props.resourceBindings.prosjektnummer] - Resource bindings for 'prosjektnummer'.
     * @param {Object} [props.resourceBindings.epost] - Resource bindings for 'epost'.
     * @param {string} [props.resourceBindings.title] - Custom title for 'fakturamottaker'.
     * @param {string} [props.resourceBindings.emptyFieldText] - Custom empty field text for 'fakturamottaker'.
     * @param {boolean|string} [props.hideTitle] - If true, hides the 'fakturamottaker' title.
     * @param {boolean|string} [props.hideIfEmpty] - If true, hides the 'fakturamottaker' empty field text.
     * @returns {Object} Resource bindings object with default and overridden values.
     */
    getResourceBindings(props?: ComponentProps) {
        const resourceBindings: Record<string, ResourceBindingGroup> = {
            navn: {
                title: props?.resourceBindings?.navn?.title || "resource.navn.title",
                emptyFieldText: props?.resourceBindings?.navn?.emptyFieldText || "resource.emptyFieldText.default"
            },
            // The address component renders its own empty state, so it is the one field here without an emptyFieldText.
            adresse: {
                title: props?.resourceBindings?.adresse?.title || "resource.adresse.title"
            },
            organisasjonsnummer: {
                title: props?.resourceBindings?.organisasjonsnummer?.title || "resource.organisasjonsnummer.title",
                emptyFieldText: props?.resourceBindings?.organisasjonsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            bestillerreferanse: {
                title: props?.resourceBindings?.bestillerreferanse?.title || "resource.bestillerreferanse.title",
                emptyFieldText: props?.resourceBindings?.bestillerreferanse?.emptyFieldText || "resource.emptyFieldText.default"
            },
            fakturareferanse: {
                title: props?.resourceBindings?.fakturareferanse?.title || "resource.fakturareferanse.title",
                emptyFieldText: props?.resourceBindings?.fakturareferanse?.emptyFieldText || "resource.emptyFieldText.default"
            },
            prosjektnummer: {
                title: props?.resourceBindings?.prosjektnummer?.title || "resource.prosjektnummer.title",
                emptyFieldText: props?.resourceBindings?.prosjektnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            epost: {
                title: props?.resourceBindings?.epost?.title || "resource.epostadresse.title",
                emptyFieldText: props?.resourceBindings?.epost?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.fakturamottaker = {
                title: props?.resourceBindings?.title || "resource.tiltakshaver.fakturamottaker.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.fakturamottaker = {
                ...resourceBindings.fakturamottaker,
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
        return ["custom-feedbacklist-validation-messages", "custom-field-adresse", "custom-field-data", "custom-header-text", "custom-paragraph"];
    }
}
