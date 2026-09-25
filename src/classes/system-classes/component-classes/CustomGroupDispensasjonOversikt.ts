import type { ComponentProps, ResourceBindingGroup } from "../../../types.ts";
import type { DispensasjonOversiktProps } from "../../data-classes/DispensasjonOversikt.ts";
// Dependencies
import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.ts";
import DispensasjonOversikt from "../../data-classes/DispensasjonOversikt.ts";

// Global functions
import { getComponentDataValue } from "../../../functions/helpers.ts";
import { hasValidationMessages } from "../../../functions/validations.ts";

/**
 * CustomGroupDispensasjonOversikt is a custom component class that extends the base CustomComponent class.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for initializing the component.
 * @param {Object} [props.resourceBindings] - Custom resource binding values for fields.
 * @param {Object} [props.resourceValues] - Custom resource values for fields.
 *
 * @property {boolean} isEmpty - Indicates if the dispensasjon data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource bindings for component fields.
 * @property {Object} resourceValues - Resource values for title and data.
 *
 * @returns {CustomGroupDispensasjonOversikt} An instance of CustomGroupDispensasjonOversikt initialized with the provided properties.
 */
export default class CustomGroupDispensasjonOversikt extends CustomComponent {
    declare resourceBindings: Record<string, ResourceBindingGroup | undefined>;
    declare resourceValues: { title?: unknown; data?: DispensasjonOversikt | string };

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
                : getTextResourceFromResourceBinding(resourceBindings?.dispensasjonOversikt?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.dispensasjonOversikt?.emptyFieldText) : data
        };
    }

    /**
     * Retrieves the value from the form data and initializes a DispensasjonOversikt instance.
     *
     * @param {*} props - The properties object containing form data.
     * @returns {DispensasjonOversikt} An instance of DispensasjonOversikt initialized with the form data.
     */
    getValueFromFormData(props: ComponentProps): DispensasjonOversikt {
        const data = getComponentDataValue(props);
        const dispensasjonOversikt = new DispensasjonOversikt(data as DispensasjonOversiktProps | undefined);
        return dispensasjonOversikt;
    }

    /**
     * Retrieves resource bindings based on provided properties.
     *
     * @param {*} props - The properties object containing resource bindings.
     * @returns {Object} An object containing the resource bindings for the component.
     */
    getResourceBindings(props?: ComponentProps) {
        const resourceBindings: Record<string, ResourceBindingGroup> = {
            count: {
                title: props?.resourceBindings?.count?.title || "resource.dispensasjonOversikt.dispensasjon.count.title",
                emptyFieldText: props?.resourceBindings?.count?.emptyFieldText || "resource.emptyFieldText.zero"
            },
            dispensasjon: {
                rowNumberTitle: props?.resourceBindings?.dispensasjon?.rowNumberTitle || "resource.nummer.short",
                dispensasjonKategori: props?.resourceBindings?.dispensasjon?.dispensasjonKategori || "resource.kategori.title",
                dispensasjonTittel: props?.resourceBindings?.dispensasjon?.dispensasjonTittel || "resource.emne.title",
                bestemmelserType:
                    props?.resourceBindings?.dispensasjon?.bestemmelserType || "resource.dispensasjonOversikt.dispensasjon.bestemmelserType.title",
                emptyFieldText: props?.resourceBindings?.dispensasjon?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.dispensasjonOversikt = {
                title: props?.resourceBindings?.title || "resource.dispensasjonOversikt.header"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.dispensasjonOversikt = {
                ...resourceBindings.dispensasjonOversikt,
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
        return ["custom-feedbacklist-validation-messages", "custom-field-count-data", "custom-header-text", "custom-paragraph", "custom-table-data"];
    }
}
