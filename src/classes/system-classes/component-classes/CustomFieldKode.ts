import type { ComponentProps } from "../../../types.ts";
import type { KodeProps } from "../../data-classes/Kode.ts";
// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.ts";
import Kode from "../../data-classes/Kode.ts";

// Global functions
import { getComponentDataValue, getComponentResourceValue } from "../../../functions/helpers.ts";

/**
 * CustomFieldKode is a custom component class for handling and formatting code fields.
 * It extends the CustomComponent base class and provides methods for checking content,
 * formatting code objects, and retrieving formatted values from form data.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties containing form data and component information.
 * @property {boolean} isEmpty - Indicates whether the field data is empty.
 * @property {Object} resourceValues - Contains resource values for title and data.
 * @property {string} resourceValues.title - The resource value for the component title.
 * @property {string} resourceValues.data - The formatted code value or empty field text.
 */
export default class CustomFieldKode extends CustomComponent {
    declare resourceValues: { title?: unknown; data?: unknown };

    constructor(props: ComponentProps) {
        super(props);
        const data = this.getValueFromFormData(props);
        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: !props?.hideTitle && getComponentResourceValue(props, "title"),
            data: isEmpty ? getComponentResourceValue(props, "emptyFieldText") : data
        };
    }

    /**
     * Formats a kode object by combining its value and description.
     *
     * If both `kodeverdi` and `kodebeskrivelse` are present, returns them as
     * "<kodeverdi>: <kodebeskrivelse>". If only one is present, returns that one.
     * Returns an empty string if neither is present.
     *
     * @param {Object} kode - The kode object to format.
     * @param {string} [kode.kodeverdi] - The code value.
     * @param {string} [kode.kodebeskrivelse] - The code description.
     * @returns {string} The formatted kode string.
     */
    formatKode(kode?: { kodeverdi?: string | null; kodebeskrivelse?: string | null }): string {
        if (hasValue(kode?.kodeverdi) && hasValue(kode?.kodebeskrivelse)) {
            return `${kode!.kodeverdi}: ${kode!.kodebeskrivelse}`;
        } else if (hasValue(kode?.kodeverdi)) {
            return kode!.kodeverdi as string;
        } else if (hasValue(kode?.kodebeskrivelse)) {
            return kode!.kodebeskrivelse as string;
        }
        return "";
    }

    /**
     * Retrieves and formats the value from form data for the custom field.
     *
     * @param {Object} props - The properties containing form data and component information.
     * @returns {string} The formatted code value extracted from the form data.
     */
    getValueFromFormData(props: ComponentProps): unknown {
        const data = getComponentDataValue(props);
        const kode = new Kode(data as KodeProps | undefined);
        return this.formatKode(kode);
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
