import type { ComponentProps } from "../../../types.ts";
import type { ProsjektProps } from "../../data-classes/Prosjekt.ts";
// Dependencies
import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.ts";
import Prosjekt from "../../data-classes/Prosjekt.ts";

/**
 * CustomFieldProsjekt is a custom component class for handling and displaying project-related form data.
 * It extends the CustomComponent base class and provides methods for formatting and extracting project information.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object for the component.
 * @param {Object} props.formData - The form data object containing project data.
 * @param {Object} props.resourceBindings - Resource bindings for text resources.
 * @param {string} [props.resourceBindings.title] - Resource binding for the title.
 * @param {string} [props.resourceBindings.emptyFieldText] - Resource binding for the empty field text.
 * @param {boolean} [props.isEmpty] - Optional flag to indicate if the field is empty.
 *
 * @property {boolean} isEmpty - Indicates whether the field is empty.
 * @property {Object} resourceValues - Contains the title and text to be displayed, based on the project data and resource bindings.
 */
export default class CustomFieldProsjekt extends CustomComponent {
    declare resourceValues: { title?: unknown; data?: unknown };

    constructor(props: ComponentProps) {
        super(props);
        const formDataValue = this.getValueFromFormData(props);
        const isEmpty = props?.isEmpty !== undefined ? props.isEmpty : !this.hasContent(formDataValue);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: !props?.hideTitle && getTextResourceFromResourceBinding(props?.resourceBindings?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(props?.resourceBindings?.emptyFieldText) : formDataValue
        };
    }

    /**
     * Checks if the provided form data value has content.
     *
     * @param {*} formDataValue - The value from the form data to check.
     * @returns {boolean} Returns true if the form data value has content, otherwise false.
     */
    hasContent(formDataValue: unknown): boolean {
        return hasValue(formDataValue);
    }

    /**
     * Formats a project object into a string containing the project name and project number (if available).
     *
     * @param {Object} prosjekt - The project object to format.
     * @param {string} [prosjekt.prosjektnavn] - The name of the project.
     * @param {number|string} [prosjekt.prosjektnr] - The project number.
     * @returns {string} A formatted string containing the project name and project number in parentheses,
     *                   separated by a space. If either is missing, it will be excluded from the result.
     */
    formatProsjekt(prosjekt?: { prosjektnavn?: string | null; prosjektnr?: number | null }): string {
        const prosjektnrString = hasValue(prosjekt?.prosjektnr) && `(${prosjekt!.prosjektnr?.toString()})`;
        const prosjektParts = [prosjekt?.prosjektnavn?.toString(), prosjektnrString];
        return prosjektParts.filter((prosjektPart) => (prosjektPart as string | undefined)?.length).join(" ");
    }

    /**
     * Extracts and formats the 'prosjekt' value from the provided form data props.
     *
     * @param {Object} props - The properties object containing form data.
     * @param {Object} props.formData - The form data object.
     * @param {Object} props.formData.data - The data used to instantiate a Prosjekt.
     * @returns {*} The formatted prosjekt value.
     */
    getValueFromFormData(props: ComponentProps): unknown {
        const prosjekt = new Prosjekt(props?.formData?.data as ProsjektProps | undefined);
        return this.formatProsjekt(prosjekt);
    }

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage(): string[] {
        return ["custom-field"];
    }
}
