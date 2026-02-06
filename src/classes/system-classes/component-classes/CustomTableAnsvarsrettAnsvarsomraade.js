// Classes
import CustomComponent from "../CustomComponent.js";
import AnsvarsrettAnsvarsomraade from "../../data-classes/AnsvarsrettAnsvarsomraade.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomTableAnsvarsrettAnsvarsomraade is a custom component class for handling and displaying
 * a table of "ansvarsomraade" (areas of responsibility) data, including resource bindings,
 * validation messages, and resource values for UI rendering.
 *
 * @extends CustomComponent
 *
 * @class
 * @param {Object} props - The properties object containing form data, resource bindings, and configuration flags.
 * @param {Object} [props.resourceBindings] - Optional resource binding overrides for each field.
 * @param {Object} [props.resourceValues] - Optional resource values, used to determine if the title should be included.
 * @param {boolean|string} [props.hideTitle] - If true, omits the 'ansvarsomraader' title from the resource bindings.
 * @param {boolean|string} [props.hideIfEmpty] - If true, omits the 'emptyFieldText' for 'ansvarsomraader'.
 *
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for the component.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource bindings object for various fields.
 * @property {Object} resourceValues - Resource values for UI rendering, including title and data.
 *
 */
export default class CustomTableAnsvarsrettAnsvarsomraade extends CustomComponent {
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
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.ansvarsomraader?.emptyFieldText) : data,
            simpleBinding: props?.formData?.simpleBinding
        };
    }

    /**
     * Retrieves a list of "ansvarsomraade" values from the form data.
     *
     * @param {Object} props - The properties object containing form data and component information.
     * @param {Object} resourceBindings - The resource bindings used to extract specific data.
     * @returns {Array} The list of "ansvarsomraade" values extracted from the form data.
     */
    getValueFromFormData(props, resourceBindings) {
        const { simpleBinding, ...formDataWithoutSimpleBinding } = props.formData ?? {};
        const cleanedProps = {
            ...props,
            formData: formDataWithoutSimpleBinding
        };
        const data = getComponentDataValue(cleanedProps);
        const ansvarsomraadeList = this.getAnsvarsomraadeListFromData(data, resourceBindings);
        return ansvarsomraadeList;
    }

    /**
     * Converts input data into a list of AnsvarsrettAnsvarsomraade instances.
     *
     * @param {*} data - The input data, expected to be an array of ansvarsomraade objects.
     * @param {*} resourceBindings - Resource bindings to be passed to each AnsvarsrettAnsvarsomraade instance.
     * @returns {AnsvarsrettAnsvarsomraade[]|undefined} An array of AnsvarsrettAnsvarsomraade instances if data is valid, otherwise undefined.
     */
    getAnsvarsomraadeListFromData(data, resourceBindings) {
        if (!hasValue(data)) {
            return undefined;
        }
        return Array.isArray(data) ? data.map((ansvarsomraade) => new AnsvarsrettAnsvarsomraade(ansvarsomraade, resourceBindings)) : [];
    }

    /**
     * Retrieves validation messages based on the provided text resource bindings.
     *
     * @param {Object} textResourceBindings - An object containing text resource bindings to be validated.
     * @returns {Array|string|boolean} The result of the validation, as returned by hasMissingTextResources.
     */
    getValidationMessages(textResourceBindings) {
        return hasMissingTextResources(textResourceBindings);
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
     * Generates a resource bindings object for various fields, providing default resource keys if not specified in props.
     *
     * @param {Object} props - The properties object containing resource bindings and configuration flags.
     * @param {Object} [props.resourceBindings] - Optional resource binding overrides for each field.
     * @param {Object} [props.resourceBindings.funksjon] - Resource bindings for 'funksjon' field.
     * @param {Object} [props.resourceBindings.beskrivelseAvAnsvarsomraadet] - Resource bindings for 'beskrivelseAvAnsvarsomraadet' field.
     * @param {Object} [props.resourceBindings.tiltaksklasse] - Resource bindings for 'tiltaksklasse' field.
     * @param {Object} [props.resourceBindings.faseSamsvarKontroll] - Resource bindings for 'faseSamsvarKontroll' field.
     * @param {Object} [props.resourceBindings.dekkesOmraadeAvSentralGodkjenning] - Resource bindings for 'dekkesOmraadeAvSentralGodkjenning' field.
     * @param {Object} [props.resourceBindings.rammetillatelse] - Resource bindings for 'rammetillatelse' field.
     * @param {Object} [props.resourceBindings.igangsettingstillatelse] - Resource bindings for 'igangsettingstillatelse' field.
     * @param {Object} [props.resourceBindings.midlertidigBrukstillatelse] - Resource bindings for 'midlertidigBrukstillatelse' field.
     * @param {Object} [props.resourceBindings.ferdigattest] - Resource bindings for 'ferdigattest' field.
     * @param {boolean|string} [props.hideTitle] - If true, omits the 'ansvarsomraader' title from the resource bindings.
     * @param {boolean|string} [props.hideIfEmpty] - If true, omits the 'emptyFieldText' for 'ansvarsomraader'.
     * @param {Object} [props.resourceValues] - Optional resource values, used to determine if the title should be included.
     * @returns {Object} Resource bindings object with titles and empty field texts for each field, using defaults if not provided.
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
            tiltaksklasse: {
                title: props?.resourceBindings?.tiltaksklasse?.title || "resource.tiltaksklasse.title",
                emptyFieldText: props?.resourceBindings?.tiltaksklasse?.emptyFieldText || "resource.emptyFieldText.default"
            },
            faseSamsvarKontroll: {
                title: props?.resourceBindings?.faseSamsvarKontroll?.title || "resource.faseSamsvarKontroll.title",
                emptyFieldText: props?.resourceBindings?.faseSamsvarKontroll?.emptyFieldText || "resource.emptyFieldText.default"
            },
            dekkesOmraadeAvSentralGodkjenning: {
                title: props?.resourceBindings?.dekkesOmraadeAvSentralGodkjenning?.title || "resource.dekkesOmraadeAvSentralGodkjenning.title",
                trueText: props?.resourceBindings?.dekkesOmraadeAvSentralGodkjenning?.trueText?.title || "resource.trueText.default",
                falseText: props?.resourceBindings?.dekkesOmraadeAvSentralGodkjenning?.falseText?.title || "resource.falseText.default",
                defaultText: props?.resourceBindings?.dekkesOmraadeAvSentralGodkjenning?.defaultText || "resource.emptyFieldText.default"
            },
            rammetillatelse: {
                title: props?.resourceBindings?.rammetillatelse?.title || "resource.rammetillatelse.title",
                emptyFieldText: props?.resourceBindings?.rammetillatelse?.emptyFieldText || "resource.emptyFieldText.default"
            },
            igangsettingstillatelse: {
                title: props?.resourceBindings?.igangsettingstillatelse?.title || "resource.igangsettingstillatelse.title",
                emptyFieldText: props?.resourceBindings?.igangsettingstillatelse?.emptyFieldText || "resource.emptyFieldText.default"
            },
            midlertidigBrukstillatelse: {
                title: props?.resourceBindings?.midlertidigBrukstillatelse?.title || "resource.midlertidigBrukstillatelse.title",
                emptyFieldText: props?.resourceBindings?.midlertidigBrukstillatelse?.emptyFieldText || "resource.emptyFieldText.default"
            },
            ferdigattest: {
                title: props?.resourceBindings?.ferdigattest?.title || "resource.ferdigattest.title",
                emptyFieldText: props?.resourceBindings?.ferdigattest?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true" && !hasValue(props?.resourceValues?.title)) {
            resourceBindings.ansvarsomraader = {
                titleSingle: props?.resourceBindings?.titleSingle || "resource.ansvarsomraade.title",
                titlePlural: props?.resourceBindings?.titlePlural || "resource.ansvarsomraader.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.ansvarsomraader = {
                ...resourceBindings.ansvarsomraader,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
