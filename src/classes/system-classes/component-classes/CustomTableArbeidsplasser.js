// Classes
import CustomComponent from "../CustomComponent.js";
import Arbeidsplasser from "../../data-classes/Arbeidsplasser.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomTableArbeidsplasser is a custom component class for handling and displaying workplace data in a table format.
 * It processes form data, resource bindings, and validation messages for affected workplaces.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component, including resource bindings and form data.
 * @property {boolean} isEmpty - Indicates if the workplace data is empty.
 * @property {boolean} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource bindings for localization and text resources.
 * @property {Object} resourceValues - Contains either the workplace data or empty field text.
 */

export default class CustomTableArbeidsplasser extends CustomComponent {
    constructor(props) {
        super(props);
        const arbeidsplasserBeroertKeys = ["eksisterende", "faste", "framtidige", "midlertidige", "utleieBygg"];
        const resourceBindings = this.getResourceBindings(props, arbeidsplasserBeroertKeys);
        const data = this.getValueFromFormData(props, arbeidsplasserBeroertKeys, resourceBindings);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings;
        this.resourceValues = {
            data: isEmpty ? getTextResourceFromResourceBinding(props?.resourceBindings?.emptyFieldText) : data
        };
    }

    /**
     * Retrieves an array of affected workplaces from form data if available.
     *
     * @param {Object} props - The properties containing form data.
     * @param {Array<string>} arbeidsplasserBeroertKeys - Keys identifying affected workplaces.
     * @param {Object} resourceBindings - Resource bindings for localization or additional data.
     * @returns {Array|undefined} An array of affected workplaces if present, otherwise undefined.
     */
    getValueFromFormData(props, arbeidsplasserBeroertKeys, resourceBindings) {
        const data = getComponentDataValue(props);
        if (!hasValue(data)) {
            return undefined;
        }
        const arbeidsplasser = new Arbeidsplasser(data);
        return this.hasArbeidsplasserBeroertProps(arbeidsplasser, arbeidsplasserBeroertKeys)
            ? this.getArbeidsplasserBeroertArray(arbeidsplasser, arbeidsplasserBeroertKeys, resourceBindings)
            : undefined;
    }

    /**
     * Generates an array of objects representing the affected workplaces, each with a title and value.
     *
     * @param {Object} arbeidsplasser - An object containing workplace data, keyed by workplace identifiers.
     * @param {string[]} arbeidsplasserBeroertKeys - An array of keys representing the workplaces to process.
     * @param {Object} resourceBindings - An object containing resource bindings for text resources, keyed by workplace identifiers.
     * @returns {Array<{title: string, value: string}>} An array of objects, each with a title and value based on the workplace data and resource bindings.
     */
    getArbeidsplasserBeroertArray(arbeidsplasser, arbeidsplasserBeroertKeys, resourceBindings) {
        return arbeidsplasserBeroertKeys.map((key) => {
            return {
                title: getTextResourceFromResourceBinding(resourceBindings[key]?.title),
                value: arbeidsplasser[key]
                    ? getTextResourceFromResourceBinding(resourceBindings[key]?.trueText)
                    : getTextResourceFromResourceBinding(resourceBindings[key]?.falseText)
            };
        });
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
     * Checks if any of the specified keys in `arbeidsplasserBeroertKeys` exist (are not undefined) in the `arbeidsplasser` object.
     *
     * @param {Object} arbeidsplasser - The object containing arbeidsplasser properties.
     * @param {string[]} arbeidsplasserBeroertKeys - Array of keys to check for existence in `arbeidsplasser`.
     * @returns {boolean} Returns `true` if at least one key exists and is not undefined in `arbeidsplasser`, otherwise `false`.
     */
    hasArbeidsplasserBeroertProps(arbeidsplasser, arbeidsplasserBeroertKeys) {
        return arbeidsplasserBeroertKeys.some((key) => arbeidsplasser?.[key] !== undefined);
    }

    /**
     * Generates an object containing text resource bindings for a custom table component.
     *
     * @param {Object} props - The properties object containing resource bindings and display options.
     * @param {Object} [props.resourceBindings] - Resource bindings for various table fields.
     * @param {boolean|string} [props.hideTitle] - If true or "true", hides the title field.
     * @param {boolean|string} [props.hideIfEmpty] - If true or "true", hides the empty field text.
     * @param {string[]} arbeidsplasserBeroertKeys - Array of keys representing affected workplaces.
     * @returns {Object} An object with text resource bindings for table fields, including titles and conditional texts.
     */
    getResourceBindings(props, arbeidsplasserBeroertKeys) {
        const resourceBindings = {
            arbeidsplasser: {},
            arbeidsplasserKey: {
                title: props?.resourceBindings?.arbeidsplasserKey?.title || `resource.arbeidsplasser.arbeidsplasserKey.title`
            },
            beroertAvTiltaket: {
                title: props?.resourceBindings?.beroertAvTiltaket?.title || `resource.arbeidsplasser.beroertAvTiltaket.title`
            }
        };
        arbeidsplasserBeroertKeys.forEach((key) => {
            resourceBindings[key] = {
                title: props?.resourceBindings?.[key]?.title || `resource.arbeidsplasser.${key}.title`,
                trueText: props?.resourceBindings?.[key]?.trueText || `resource.trueText.default`,
                falseText: props?.resourceBindings?.[key]?.falseText || `resource.falseText.default`
            };
        });
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.arbeidsplasser = {
                title: props?.resourceBindings?.title || `resource.arbeidsplasser.title`
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.arbeidsplasser = {
                ...resourceBindings.arbeidsplasser,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
