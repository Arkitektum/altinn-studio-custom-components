// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
import SamsvarAnsvarsomraade from "../../data-classes/SamsvarAnsvarsomraade.js";

export default class CustomTableSamsvarAnsvarsomraade extends CustomComponent {
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
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.ansvarsomraader?.emptyFieldText) : data
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
        const data = getComponentDataValue(props);
        const ansvarsomraadeList = this.getAnsvarsomraadeListFromData(data, resourceBindings);
        return ansvarsomraadeList;
    }

    /**
     * Converts input data into a list of SamsvarAnsvarsomraade instances.
     *
     * @param {*} data - The input data, expected to be an array of ansvarsomraade objects.
     * @param {*} resourceBindings - Resource bindings to be passed to each SamsvarAnsvarsomraade instance.
     * @returns {SamsvarAnsvarsomraade[]|undefined} An array of SamsvarAnsvarsomraade instances if data is valid, otherwise undefined.
     */
    getAnsvarsomraadeListFromData(data, resourceBindings) {
        if (!hasValue(data)) {
            return undefined;
        }
        return Array.isArray(data) ? data.map((ansvarsomraade) => new SamsvarAnsvarsomraade(ansvarsomraade, resourceBindings)) : [];
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
     * @param {Object} [props.resourceBindings.datoAnsvarsrettErklaert] - Resource bindings for 'datoAnsvarsrettErklaert' field.
     * @param {Object} [props.resourceBindings.faseSamsvarKontroll] - Resource bindings for 'faseSamsvarKontroll' field.
     * @param {Object} [props.resourceBindings.dekkesOmraadeAvSentralGodkjenning] - Resource bindings for 'dekkesOmraadeAvSentralGodkjenning' field.
     * @param {Object} [props.resourceBindings.Rammetillatelse] - Resource bindings for 'Rammetillatelse' field.
     * @param {Object} [props.resourceBindings.Igangsettingstillatelse] - Resource bindings for 'Igangsettingstillatelse' field.
     * @param {Object} [props.resourceBindings.MidlertidigBrukstillatelse] - Resource bindings for 'MidlertidigBrukstillatelse' field.
     * @param {Object} [props.resourceBindings.Ferdigattest] - Resource bindings for 'Ferdigattest' field.
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
            datoAnsvarsrettErklaert: {
                title: props?.resourceBindings?.datoAnsvarsrettErklaert?.title || "resource.datoAnsvarsrettErklaert.title",
                emptyFieldText: props?.resourceBindings?.datoAnsvarsrettErklaert?.emptyFieldText || "resource.emptyFieldText.default"
            },
            erAnsvarsomraadetAvsluttet: {
                title: props?.resourceBindings?.erAnsvarsomraadetAvsluttet?.title || "resource.erAnsvarsomraadetAvsluttet.title",
                trueText: props?.resourceBindings?.erAnsvarsomraadetAvsluttet?.trueText?.title || "resource.trueText.default",
                falseText: props?.resourceBindings?.erAnsvarsomraadetAvsluttet?.falseText?.title || "resource.falseText.default",
                defaultText: props?.resourceBindings?.erAnsvarsomraadetAvsluttet?.defaultText || "resource.emptyFieldText.default"
            },
            prosjekterende: {
                title: props?.resourceBindings?.prosjekterende?.title || "resource.prosjekterende.title",
                emptyFieldText: props?.resourceBindings?.prosjekterende?.emptyFieldText || "resource.emptyFieldText.default"
            },
            Rammetillatelse: {
                title: props?.resourceBindings?.Rammetillatelse?.title || "resource.Rammetillatelse.title",
                emptyFieldText: props?.resourceBindings?.Rammetillatelse?.emptyFieldText || "resource.emptyFieldText.default"
            },
            Igangsettingstillatelse: {
                title: props?.resourceBindings?.Igangsettingstillatelse?.title || "resource.Igangsettingstillatelse.title",
                emptyFieldText: props?.resourceBindings?.Igangsettingstillatelse?.emptyFieldText || "resource.emptyFieldText.default"
            },
            MidlertidigBrukstillatelse: {
                title: props?.resourceBindings?.MidlertidigBrukstillatelse?.title || "resource.MidlertidigBrukstillatelse.title",
                emptyFieldText: props?.resourceBindings?.MidlertidigBrukstillatelse?.emptyFieldText || "resource.emptyFieldText.default"
            },
            Ferdigattest: {
                title: props?.resourceBindings?.Ferdigattest?.title || "resource.Ferdigattest.title",
                emptyFieldText: props?.resourceBindings?.Ferdigattest?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true" && !hasValue(props?.resourceValues?.title)) {
            resourceBindings.ansvarsomraader = {
                title: props?.resourceBindings?.title || "resource.ansvarsomraader.title"
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
