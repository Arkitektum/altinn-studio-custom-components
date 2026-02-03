// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
import SamsvarAnsvarsomraade from "../../data-classes/SamsvarAnsvarsomraade.js";

/**
 * Initializes a new instance of the CustomGroupSamsvarAnsvarsomraade class.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.formData - The form data used to retrieve values.
 * @param {Object} props.resourceBindings - Resource bindings for text and validation.
 *
 * @property {boolean} isEmpty - Indicates if the component's data is empty.
 * @property {Array} validationMessages - Validation messages for the component.
 * @property {boolean} hasValidationMessages - Whether there are validation messages.
 * @property {Object} resourceBindings - The resource bindings used by the component.
 * @property {Object} resourceValues - The resource values, including data or empty field text.
 */
export default class CustomGroupSamsvarAnsvarsomraade extends CustomComponent {
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
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.ansvarsomraade?.emptyFieldText) : data
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
     * Retrieves the value from form data and returns an instance of SamsvarAnsvarsomraade.
     *
     * @param {Object} props - The properties containing form data.
     * @returns {SamsvarAnsvarsomraade} An instance of SamsvarAnsvarsomraade initialized with the component data value.
     */
    getValueFromFormData(props, resourceBindings) {
        const data = getComponentDataValue(props);
        const samsvarAnsvarsomraade = new SamsvarAnsvarsomraade(data, resourceBindings);
        return samsvarAnsvarsomraade;
    }

    /**
     * Generates an object containing resource binding configurations for various fields.
     *
     * Each field in the returned object contains localized resource keys or default values for titles,
     * empty field texts, and, where applicable, true/false/default texts.
     *
     * @param {Object} props - The properties object containing optional resourceBindings.
     * @param {Object} [props.resourceBindings] - Optional resource binding overrides for each field.
     * @returns {Object} An object mapping field names to their resource binding configurations.
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
            avdekketArbeider: {
                title: props?.resourceBindings?.avdekketArbeider?.title || "resource.avdekketArbeider.title",
                emptyFieldText: props?.resourceBindings?.avdekketArbeider?.emptyFieldText || "resource.emptyFieldText.default"
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
            },
            ansvarsomraade: {
                title: props?.resourceBindings?.ansvarsomraade?.title || "resource.ansvarsomraade.title",
                emptyFieldText: props?.resourceBindings?.ansvarsomraade?.emptyFieldText || "resource.emptyFieldText.default"
            },
            gjenstaaendeArbeider: {
                title: props?.resourceBindings?.gjenstaaendeArbeider?.title || "resource.gjenstaaendeArbeider.title",
                emptyFieldText: props?.resourceBindings?.gjenstaaendeArbeider?.emptyFieldText || "resource.emptyFieldText.default"
            },
            sikkerhetsNivaa: {
                title: props?.resourceBindings?.sikkerhetsNivaa?.title || "resource.sikkerhetsNivaa.title",
                emptyFieldText: props?.resourceBindings?.sikkerhetsNivaa?.emptyFieldText || "resource.emptyFieldText.default"
            },
            utfoereInnen: {
                title: props?.resourceBindings?.utfoereInnen?.title || "resource.utfoereInnen.title",
                emptyFieldText: props?.resourceBindings?.utfoereInnen?.emptyFieldText || "resource.emptyFieldText.default"
            },
            typeArbeider: {
                title: props?.resourceBindings?.typeArbeider?.title || "resource.typeArbeider.title",
                emptyFieldText: props?.resourceBindings?.typeArbeider?.emptyFieldText || "resource.emptyFieldText.default"
            },
            tilstrekkeligSikkerhet: {
                title: props?.resourceBindings?.tilstrekkeligSikkerhet?.title || "resource.tilstrekkeligSikkerhet.title",
                trueText: props?.resourceBindings?.tilstrekkeligSikkerhet?.trueText?.title || "resource.trueText.default",
                falseText: props?.resourceBindings?.tilstrekkeligSikkerhet?.falseText?.title || "resource.falseText.default",
                defaultText: props?.resourceBindings?.tilstrekkeligSikkerhet?.defaultText || "resource.emptyFieldText.default"
            },
            arbeidGjenstaaendeInnenfor: {
                title: props?.resourceBindings?.arbeidGjenstaaendeInnenfor?.title || "resource.gjenstaaendeArbeider.gjenstaaendeInnenfor.title",
                emptyFieldText: props?.resourceBindings?.arbeidGjenstaaendeInnenfor?.emptyFieldText || "resource.emptyFieldText.default"
            },
            arbeidGjenstaaendeUtenfor: {
                title: props?.resourceBindings?.arbeidGjenstaaendeUtenfor?.title || "resource.gjenstaaendeArbeider.gjenstaaendeUtenfor.title",
                emptyFieldText: props?.resourceBindings?.arbeidGjenstaaendeUtenfor?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        return resourceBindings;
    }
}
