// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources } from "../../../functions/validations.js";

/**
 * CustomGrouplistAnsvarsomraadeType is a custom component class for handling grouped list data
 * related to "Ansvarsområde" (area of responsibility) in Altinn Studio custom components.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component, including form data and resource bindings.
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {Object} resourceBindings - Resource binding keys for various fields.
 * @property {Object} resourceValues - Contains resolved resource values for title and data.
 */
export default class CustomGrouplistAnsvarsomraadeType extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);

        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceBindings = resourceBindings;
        this.resourceValues = {
            title: !props?.hideTitle && getComponentResourceValue(props, "title"),
            data: isEmpty ? getComponentResourceValue(props, "emptyFieldText") : data
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
     * Retrieves validation messages based on the provided resource bindings.
     *
     * @param {Object} resourceBindings - An object containing resource binding keys.
     * @returns {Array|string|boolean} The result of the validation, which may be an array of messages, a string, or a boolean indicating missing resources.
     */
    getValidationMessages(resourceBindings) {
        const textResources = getTextResources();
        return hasMissingTextResources(textResources, resourceBindings);
    }

    /**
     * Retrieves the component data value from the provided props and groups array items by their 'Funksjon' property.
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {Object} The grouped array items based on the 'Funksjon' property.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        return this.groupArrayItemsByFunksjon(data);
    }

    /**
     * Groups items in an array by the `kodeverdi` property found in each item's `funksjon` object.
     *
     * @param {Array<Object>} array - The array of objects to group.
     * @returns {Object} An object where each key is a `kodeverdi` and the value is an array of objects with that `kodeverdi`.
     */
    groupArrayItemsByFunksjon(array) {
        return hasValue(array)
            ? array.reduce((acc, obj) => {
                  const key = obj?.funksjon?.kodeverdi;
                  if (!key?.length) {
                      return acc;
                  }
                  if (!acc[key]) {
                      acc[key] = [];
                  }
                  acc[key].push(obj);
                  return acc;
              }, {})
            : {};
    }

    /**
     * Generates an object containing resource bindings for various fields, using provided props.
     * Default resource keys are used if specific bindings are not provided in props.
     * Optionally includes 'ansvarsfordeling' field based on `hideTitle` and `hideIfEmpty` props.
     *
     * @param {Object} props - The properties object containing resource bindings and options.
     * @param {Object} [props.resourceBindings] - Custom resource bindings for fields.
     * @param {boolean|string} [props.hideTitle] - If true, omits the 'ansvarsfordeling' title field.
     * @param {boolean|string} [props.hideIfEmpty] - If true, omits the 'ansvarsfordeling' emptyFieldText field.
     * @returns {Object} An object with resource bindings for each field.
     */
    getResourceBindings(props) {
        const resourceBindings = {
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
                emptyFieldText:
                    props?.resourceBindings?.planlagteSamsvarKontrollErklaeringer?.emptyFieldText ||
                    "resource.planlagteSamsvarKontrollErklaeringer.emptyFieldText.default",
                emptyFieldTextAvsluttet:
                    props?.resourceBindings?.ansvarsomraadeStatus?.emptyFieldTextAvsluttet ||
                    "resource.planlagteSamsvarKontrollErklaeringer.emptyFieldText.avsluttet"
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
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.ansvarsfordeling = {
                title: props?.resourceBindings?.title || "resource.ansvarsfordeling.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.ansvarsfordeling = {
                ...resourceBindings.ansvarsfordeling,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
