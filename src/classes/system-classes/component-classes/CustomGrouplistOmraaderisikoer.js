// Classes
import CustomComponent from "../CustomComponent.js";
import Sjekklistekrav from "../../data-classes/Sjekklistekrav.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
import Omraaderisiko from "../../data-classes/Omraaderisiko.js";

export default class CustomGrouplistOmraaderisikoer extends CustomComponent {
    constructor(props) {
        super(props);
        const resourceBindings = this.getResourceBindings(props);
        const data = this.getValueFromFormData(props, resourceBindings);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = {
            title: resourceBindings?.varsling?.title,
            emptyFieldText: resourceBindings?.varsling?.emptyFieldText,
            trueText: resourceBindings?.varsling?.trueText,
            falseText: resourceBindings?.varsling?.falseText,
            defaultText: resourceBindings?.varsling?.defaultText
        };
        this.resourceValues = {
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.varsling?.emptyFieldText) : data
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
        const textResources = getTextResources();
        return hasMissingTextResources(textResources, resourceBindings);
    }

    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const omraaderisikoItems = data.map((omraaderisiko) => new Omraaderisiko(omraaderisiko));
        console.log("omraaderisikoItems", omraaderisikoItems);
        const sjekklistekravItems = this.getSjekklistekravItems(omraaderisikoItems);
        console.log("sjekklistekravItems", sjekklistekravItems);
        return sjekklistekravItems;
    }

    getSjekklistekravItems(omraaderisikoItems) {
        return omraaderisikoItems.map((omraaderisiko) => {
            return new Sjekklistekrav({
                sjekklistepunktsvar: omraaderisiko?.kode?.kodeverdi !== "0",
                sjekklistepunkt: omraaderisiko.kodelisteNavn,
                dokumentasjon: omraaderisiko?.kode?.kodebeskrivelse
            });
        });
    }

    /**
     * Generates resource bindings for a component based on provided props.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Optional resource bindings overrides.
     * @param {string} [props.resourceBindings.trueText] - Text to display for true value.
     * @param {string} [props.resourceBindings.falseText] - Text to display for false value.
     * @param {string} [props.resourceBindings.defaultText] - Default text to display.
     * @param {string} [props.resourceBindings.fritattFraNabovarsling] - Resource bindings for 'fritattFraNabovarsling'.
     * @param {string} [props.resourceBindings.foreliggerMerknader] - Resource bindings for 'foreliggerMerknader'.
     * @param {string} [props.resourceBindings.title] - Title text for the component.
     * @param {string} [props.resourceBindings.emptyFieldText] - Text to display when field is empty.
     * @param {boolean|string} [props.hideTitle] - If true or "true", hides the title.
     * @param {boolean|string} [props.hideIfEmpty] - If true or "true", hides the empty field text.
     * @returns {Object} An object containing the resource bindings for the varsling component.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            varsling: {
                trueText: props?.resourceBindings?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.falseText || "resource.falseText.default",
                defaultText: props?.resourceBindings?.defaultText || "resource.defaultText.default"
            },
            fritattFraNabovarsling: {
                title: props?.resourceBindings?.fritattFraNabovarsling?.title || `resource.varsling.fritattFraNabovarsling.title`
            },
            foreliggerMerknader: {
                title: props?.resourceBindings?.foreliggerMerknader?.title || `resource.varsling.foreliggerMerknader.title`
            }
        };
        if (!props?.hideTitle === true || !props?.hideTitle === "true") {
            resourceBindings.varsling = {
                ...resourceBindings.varsling,
                title: props?.resourceBindings?.title || "resource.varsling.title"
            };
        }
        if (!props?.hideIfEmpty === true || !props?.hideIfEmpty === "true") {
            resourceBindings.varsling = {
                ...resourceBindings.varsling,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
