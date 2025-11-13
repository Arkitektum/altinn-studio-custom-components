// Classes
import CustomComponent from "../CustomComponent.js";
import Gjennomfoeringsplan from "../../data-classes/Gjennomfoeringsplan.js";

// Global functions
import { getComponentResourceValue, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGjennomfoeringsplan is a custom component class that extends CustomComponent.
 * It is responsible for handling the initialization and management of a "Gjennomfoeringsplan" (implementation plan) component,
 * including extracting form data, managing resource bindings, and handling validation messages.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object used to initialize the component.
 * @param {*} props.formData - The form data used to instantiate the Gjennomfoeringsplan.
 * @param {Object} [props.resourceBindings] - Optional overrides for resource binding values.
 *
 * @property {boolean} isEmpty - Indicates whether the component's data is empty.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages present.
 * @property {Object} validationMessages - The validation messages for the component.
 * @property {Object} resourceBindings - The resource binding keys and their references.
 * @property {Object} resourceValues - The resource values, including data or empty field text.
 */
export default class CustomGjennomfoeringsplan extends CustomComponent {
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
            data: isEmpty ? getComponentResourceValue(props, "emptyFieldText") : data
        };
    }

    /**
     * Checks if the provided data has content by delegating to the hasValue function.
     *
     * @param {*} data - The data to check for content.
     * @returns {boolean} True if the data has content, false otherwise.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Extracts form data from the provided props and creates a new Gjennomfoeringsplan instance.
     *
     * @param {Object} props - The properties object containing form data.
     * @param {*} props.formData - The form data used to instantiate Gjennomfoeringsplan.
     * @returns {Gjennomfoeringsplan} A new instance of Gjennomfoeringsplan initialized with the form data.
     */
    getValueFromFormData(props) {
        const data = props?.formData;
        const gjennomfoeringsplan = new Gjennomfoeringsplan(data);
        return gjennomfoeringsplan;
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
     * Generates an object containing resource binding keys and their corresponding resource string references.
     * Allows for overriding certain resource bindings via the `props.resourceBindings` object.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Optional overrides for resource binding values.
     * @returns {Object} An object mapping resource binding keys to their resource string references, with optional overrides applied.
     */
    getResourceBindings(props) {
        return {
            gjennomfoeringsplan: {
                title: "resource.gjennomfoeringsplan.title",
                description: "resource.gjennomfoeringsplan.description"
            },
            planenGjelder: {
                title: "resource.planenGjelder.title"
            },
            ansvarsfordeling: {
                title: "resource.ansvarsfordeling.title"
            },
            versjon: {
                title: "resource.versjon.title"
            },
            kommunensSaksnummer: {
                title: "resource.kommunensSaksnummer.title"
            },
            metadataProsjektnavn: {
                title: "resource.metadata.prosjekt.title"
            },
            metadataFtbId: {
                title: "resource.metadata.ftbId.title"
            },
            tiltaksklasse: {
                title: props?.resourceBindings?.tiltaksklasse?.title || "resource.tiltaksklasse.title",
                emptyFieldText: props?.resourceBindings?.tiltaksklasse?.emptyFieldText || "resource.emptyFieldText.default"
            },
            ansvarsomraade: {
                title: props?.resourceBindings?.ansvarsomraade?.title || "resource.ansvarsomraade.title",
                emptyFieldText: props?.resourceBindings?.ansvarsomraade?.emptyFieldText || "resource.emptyFieldText.default"
            },
            foretak: {
                title: props?.resourceBindings?.foretak?.title || "resource.foretak.title",
                emptyFieldText: props?.resourceBindings?.foretak?.emptyFieldText || "resource.emptyFieldText.default"
            },
            planlagteSamsvarKontrollErklaeringer: {
                title: props?.resourceBindings?.planlagteSamsvarKontrollErklaeringer?.title || "resource.planlagteSamsvarKontrollErklaeringer.title",
                emptyFieldText: props?.resourceBindings?.planlagteSamsvarKontrollErklaeringer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            ansvarsomraadeStatus: {
                title: props?.resourceBindings?.ansvarsomraadeStatus?.title || "resource.ansvarsomraadeStatus.title",
                emptyFieldText: props?.resourceBindings?.ansvarsomraadeStatus?.emptyFieldText || "resource.emptyFieldText.default"
            },
            samsvarKontrollPlanlagtVedRammetillatelse: {
                title:
                    props?.resourceBindings?.samsvarKontrollPlanlagtVedRammetillatelse?.title ||
                    "resource.samsvarKontrollPlanlagtVedRammetillatelse.title"
            },
            samsvarKontrollPlanlagtVedIgangsettingstillatelse: {
                title:
                    props?.resourceBindings?.samsvarKontrollPlanlagtVedIgangsettingstillatelse?.title ||
                    "resource.samsvarKontrollPlanlagtVedIgangsettingstillatelse.title"
            },
            samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse: {
                title:
                    props?.resourceBindings?.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse?.title ||
                    "resource.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse.title"
            },
            samsvarKontrollPlanlagtVedFerdigattest: {
                title:
                    props?.resourceBindings?.samsvarKontrollPlanlagtVedFerdigattest?.title || "resource.samsvarKontrollPlanlagtVedFerdigattest.title"
            }
        };
    }
}
