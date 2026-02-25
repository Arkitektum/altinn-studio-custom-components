// Classes
import CustomComponent from "../CustomComponent.js";
import RammebetingelserTilknytninger from "../../data-classes/RammebetingelserTilknytninger.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGroupRammebetingelserTilknytninger is a custom component class for handling
 * resource bindings and validation messages related to "rammebetingelser tilknytninger".
 * It extends the CustomComponent base class and provides methods for extracting data,
 * generating resource bindings, and handling validation logic.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} [props.resourceBindings] - Optional resource binding overrides for each component.
 * @param {Object} [props.resourceValues] - Optional resource values for the component.
 * @param {boolean|string} [props.hideTitle] - If true or "true", omits the title for rammebetingelserTilknytninger.
 * @param {boolean|string} [props.hideIfEmpty] - If true or "true", omits the emptyFieldText for rammebetingelserTilknytninger.
 *
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are any validation messages.
 * @property {Object} resourceBindings - Resource binding configurations for the component.
 * @property {Object} resourceValues - Resource values such as title and data for the component.
 */
export default class CustomGroupRammebetingelserTilknytninger extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);
        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings || {};
        this.resourceValues = {
            title: hasValue(props?.resourceValues?.title)
                ? props?.resourceValues?.title
                : getTextResourceFromResourceBinding(resourceBindings?.rammebetingelserTilknytninger?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.rammebetingelserTilknytninger?.emptyFieldText) : data
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
     * Extracts the component data from the provided props, constructs a new
     * RammebetingelserTilknytninger instance with this data, and returns it.
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {RammebetingelserTilknytninger} An instance of RammebetingelserTilknytninger initialized with the extracted data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const rammebetingelserTilknytninger = new RammebetingelserTilknytninger(data);
        return rammebetingelserTilknytninger;
    }

    /**
     * Generates an object containing resource binding configurations for various components,
     * providing default resource keys if specific bindings are not supplied via props.
     *
     * @param {Object} props - The properties object containing optional resource bindings and flags.
     * @param {Object} [props.resourceBindings] - Optional resource binding overrides for each component.
     * @param {boolean|string} [props.hideTitle] - If true or "true", omits the title for rammebetingelserTilknytninger.
     * @param {boolean|string} [props.hideIfEmpty] - If true or "true", omits the emptyFieldText for rammebetingelserTilknytninger.
     * @returns {Object} An object mapping component keys to their resource binding configurations.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            adkomst: {
                title: props?.resourceBindings?.adkomst?.title || "resource.rammebetingelser.adkomst.title",
                emptyFieldText: props?.resourceBindings?.adkomst?.emptyFieldText || "resource.emptyFieldText.default"
            },
            adkomstErNyEllerEndretAdkomst: {
                title:
                    props?.resourceBindings?.adkomst?.erNyEllerEndretAdkomst?.title ||
                    "resource.rammebetingelser.adkomst.erNyEllerEndretAdkomst.title",
                trueText: props?.resourceBindings?.adkomst?.erNyEllerEndretAdkomst?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.adkomst?.erNyEllerEndretAdkomst?.falseText || "resource.falseText.default"
            },
            adkomstVegtype: {
                title: props?.resourceBindings?.adkomst?.vegtype?.title || "resource.rammebetingelser.adkomst.vegtype.title"
            },
            adkomstErTillatelseGitt: {
                title: props?.resourceBindings?.adkomst?.erTillatelseGitt?.title || "resource.rammebetingelser.adkomst.erTillatelseGitt.title",
                trueText: props?.resourceBindings?.adkomst?.erTillatelseGitt?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.adkomst?.erTillatelseGitt?.falseText || "resource.falseText.default",
                defaultText: props?.resourceBindings?.adkomst?.erTillatelseGitt?.defaultText || "resource.emptyFieldText.default"
            },
            avloep: {
                title: props?.resourceBindings?.avloep?.title || "resource.rammebetingelser.avloep.title",
                emptyFieldText: props?.resourceBindings?.avloep?.emptyFieldText || "resource.emptyFieldText.default"
            },
            avloepHarTinglystErklaering: {
                title:
                    props?.resourceBindings?.avloep?.harTinglystErklaering?.title || "resource.rammebetingelser.avloep.harTinglystErklaering.title",
                trueText: props?.resourceBindings?.avloep?.harTinglystErklaering?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.avloep?.harTinglystErklaering?.falseText || "resource.falseText.default"
            },
            avloepKrysserAvloepAnnensGrunn: {
                title:
                    props?.resourceBindings?.avloep?.krysserAvloepAnnensGrunn?.title ||
                    "resource.rammebetingelser.avloep.krysserAvloepAnnensGrunn.title",
                trueText: props?.resourceBindings?.avloep?.krysserAvloepAnnensGrunn?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.avloep?.krysserAvloepAnnensGrunn?.falseText || "resource.falseText.default"
            },
            avloepTilknytningstype: {
                title: props?.resourceBindings?.avloep?.tilknytningstype?.title || "resource.rammebetingelser.avloep.tilknytningstype.title"
            },
            avloepSkalInstallereVannklosett: {
                title:
                    props?.resourceBindings?.avloep?.skalInstallereVannklosett?.title ||
                    "resource.rammebetingelser.avloep.skalInstallereVannklosett.title",
                trueText: props?.resourceBindings?.avloep?.skalInstallereVannklosett?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.avloep?.skalInstallereVannklosett?.falseText || "resource.falseText.default"
            },
            avloepHarUtslippstillatelse: {
                title:
                    props?.resourceBindings?.avloep?.harUtslippstillatelse?.title || "resource.rammebetingelser.avloep.harUtslippstillatelse.title",
                trueText: props?.resourceBindings?.avloep?.harUtslippstillatelse?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.avloep?.harUtslippstillatelse?.falseText || "resource.falseText.default"
            },
            overvann: {
                title: props?.resourceBindings?.overvann?.title || "resource.rammebetingelser.overvann.title",
                emptyFieldText: props?.resourceBindings?.overvann?.emptyFieldText || "resource.emptyFieldText.default"
            },
            overvannLedesOvervannTilTerreng: {
                title:
                    props?.resourceBindings?.overvann?.ledesOvervannTilTerreng?.title ||
                    "resource.rammebetingelser.overvann.ledesOvervannTilTerreng.title",
                trueText: props?.resourceBindings?.overvann?.ledesOvervannTilTerreng?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.overvann?.ledesOvervannTilTerreng?.falseText || "resource.falseText.default"
            },
            overvannLedesOvervannTilAvloepssystem: {
                title:
                    props?.resourceBindings?.overvann?.ledesOvervannTilAvloepssystem?.title ||
                    "resource.rammebetingelser.overvann.ledesOvervannTilAvloepssystem.title",
                trueText: props?.resourceBindings?.overvann?.ledesOvervannTilAvloepssystem?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.overvann?.ledesOvervannTilAvloepssystem?.falseText || "resource.falseText.default"
            },
            vannforsyning: {
                title: props?.resourceBindings?.vannforsyning?.title || "resource.rammebetingelser.vannforsyning.title",
                emptyFieldText: props?.resourceBindings?.vannforsyning?.emptyFieldText || "resource.emptyFieldText.default"
            },
            vannforsyningBeskrivelse: {
                title: props?.resourceBindings?.vannforsyning?.beskrivelse?.title || "resource.beskrivelse.title"
            },
            vannforsyningHarTinglystErklaering: {
                title:
                    props?.resourceBindings?.vannforsyning?.harTinglystErklaering?.title ||
                    "resource.rammebetingelser.vannforsyning.harTinglystErklaering.title",
                trueText: props?.resourceBindings?.vannforsyning?.harTinglystErklaering?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.vannforsyning?.harTinglystErklaering?.falseText || "resource.falseText.default"
            },
            vannforsyningKrysserVannforsyningAnnensGrunn: {
                title:
                    props?.resourceBindings?.vannforsyning?.krysserVannforsyningAnnensGrunn?.title ||
                    "resource.rammebetingelser.vannforsyning.krysserVannforsyningAnnensGrunn.title",
                trueText: props?.resourceBindings?.vannforsyning?.krysserVannforsyningAnnensGrunn?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.vannforsyning?.krysserVannforsyningAnnensGrunn?.falseText || "resource.falseText.default"
            },
            vannforsyningTilknytningstype: {
                title:
                    props?.resourceBindings?.vannforsyning?.tilknytningstype?.title ||
                    "resource.rammebetingelser.vannforsyning.tilknytningstype.title"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.rammebetingelserTilknytninger = {
                title: props?.resourceBindings?.title || "resource.rammebetingelser.tilknytning.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.rammebetingelserTilknytninger = {
                ...resourceBindings.rammebetingelserTilknytninger,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
