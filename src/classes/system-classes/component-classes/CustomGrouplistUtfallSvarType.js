// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.js";
import UtfallSvar from "../../data-classes/UtfallSvar.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue } from "../../../functions/helpers.js";
import { hasMissingTextResources } from "../../../functions/validations.js";

/**
 * CustomGrouplistUtfallSvarType is a custom component class that extends CustomComponent.
 * It processes form data, groups array items by their "UtfallType", and manages resource values for display.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component.
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {Object} resourceValues - Contains resource values for title and data display.
 *
 */
export default class CustomGrouplistUtfallSvarType extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);

        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceBindings = resourceBindings;
        this.resourceValues = {
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
        return hasMissingTextResources(resourceBindings);
    }

    /**
     * Retrieves the component data value from the provided props and groups array items by their "UtfallType".
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {Object} The grouped array items, organized by "UtfallType".
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        return this.groupArrayItemsByUtfallType(data);
    }

    /**
     * Groups an array of items by the `utfallType.kodeverdi` property
     * and sorts items inside each group by utfall status.
     *
     * Order:
     * 1. besvares nå
     * 2. besvares senere
     * 3. besvart tidligere
     */
    groupArrayItemsByUtfallType(array) {
        if (!hasValue(array)) return {};

        const grouped = array.reduce((acc, obj) => {
            const key = obj?.utfallType?.kodeverdi;
            if (!key?.length) return acc;

            if (!acc[key]) {
                acc[key] = [];
            }

            acc[key].push(new UtfallSvar(obj));

            return acc;
        }, {});

        const getSortPriority = (item) => {
            if (item.erUtfallBesvart) return 2; // besvart tidligere
            if (item.erUtfallBesvaresSenere) return 1; // besvares senere
            return 0; // besvares nå
        };

        Object.values(grouped).forEach((group) => {
            group.sort((a, b) => getSortPriority(a) - getSortPriority(b));
        });

        return grouped;
    }

    /**
     * Generates an object containing resource bindings for various fields based on the provided props.
     * Default resource keys are used if specific bindings are not provided in props.
     * Dynamically adds resource bindings for each key found in form data.
     * Optionally includes empty field text based on props configuration.
     *
     * @param {Object} props - The properties object containing resourceBindings and configuration flags.
     * @param {Object} [props.resourceBindings] - Custom resource bindings for fields.
     * @param {boolean|string} [props.hideIfEmpty] - If true, omits the emptyFieldText binding.
     * @returns {Object} An object mapping field names to their resource bindings.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            utfallSvarStatus: {
                title: props?.resourceBindings?.status?.title || "resource.utfallBesvarelse.utfallSvar.status.title",
                status: props?.resourceBindings?.status?.status || "resource.utfallBesvarelse.utfallSvar.status",
                erUtfallBesvaresSenere:
                    props?.resourceBindings?.erUtfallBesvaresSenere || "resource.utfallBesvarelse.utfallSvar.erUtfallBesvaresSenere",
                erUtfallBesvart: props?.resourceBindings?.erUtfallBesvart || "resource.utfallBesvarelse.utfallSvar.erUtfallBesvart"
            },
            tema: {
                title: props?.resourceBindings?.tema?.kodebeskrivelse?.title || "resource.utfallBesvarelse.utfallSvar.tema.kodebeskrivelse.title"
            },
            kommentar: {
                title: props?.resourceBindings?.kommentar?.title || "resource.utfallBesvarelse.utfallSvar.kommentar.title"
            },
            vedleggsliste: {
                title: props?.resourceBindings?.vedleggsliste?.vedlegg?.title || "resource.utfallBesvarelse.utfallSvar.vedleggsliste.vedlegg.title"
            },
            utfallSvarType: {}
        };
        const data = this.getValueFromFormData(props);
        if (typeof data === "object" && hasValue(data)) {
            for (const utfallType of Object.keys(data)) {
                if (utfallType?.toLocaleLowerCase().length) {
                    resourceBindings[utfallType?.toLocaleLowerCase()] = {
                        title:
                            props?.resourceBindings?.[utfallType?.toLocaleLowerCase()]?.title ||
                            `resource.utfallBesvarelse.utfallSvar.${utfallType?.toLowerCase()}.header`
                    };
                }
            }
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.utfallSvarType = {
                ...resourceBindings.utfallSvarType,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
