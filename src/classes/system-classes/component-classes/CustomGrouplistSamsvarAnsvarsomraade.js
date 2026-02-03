// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * Initializes a new instance of the CustomGrouplistSamsvarAnsvarsomraade class.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.formData - The form data used to initialize the component.
 * @param {Object} props.resourceBindings - The resource bindings for text resources.
 *
 * @property {boolean} isEmpty - Indicates if the component has content.
 * @property {Array} validationMessages - The validation messages for the component.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - The resource bindings for the component.
 * @property {Object} resourceValues - The resolved text resources for the component.
 */
export default class CustomGrouplistSamsvarAnsvarsomraade extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);
        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings;
        this.resourceValues = {
            title: getTextResourceFromResourceBinding(resourceBindings?.ansvarsomraade?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.ansvarsomraade?.emptyFieldText) : data
        };
    }

    /**
     * Determines if the provided data contains any content.
     *
     * @param {*} data - The data to check for content.
     * @returns {boolean} True if the data has content, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Retrieves validation messages based on provided resource bindings.
     *
     * @param {Object} resourceBindings - The resource bindings to check for missing text resources.
     * @returns {Array|string} - The validation messages indicating missing text resources.
     */
    getValidationMessages(resourceBindings) {
        return hasMissingTextResources(resourceBindings);
    }

    /**
     * Retrieves the value for this component from the provided form data.
     *
     * @param {Object} props - The properties containing form data and component information.
     * @returns {*} The value extracted from the form data for this component.
     */
    getValueFromFormData(props) {
        return getComponentDataValue(props);
    }

    /**
     * Generates a set of resource binding objects for various component fields,
     * providing default resource keys if not specified in the input props.
     *
     * @param {Object} props - The properties object containing optional resourceBindings.
     * @param {Object} [props.resourceBindings] - Optional resource binding overrides for each field.
     * @returns {Object} An object mapping field names to their resource binding configurations,
     *                   each containing titles and optional text values.
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
                title: props?.resourceBindings?.Ferdigattest?.title || "resource.ferdigattest.title",
                emptyFieldText: props?.resourceBindings?.Ferdigattest?.emptyFieldText || "resource.emptyFieldText.default"
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
