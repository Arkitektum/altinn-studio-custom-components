// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

export default class CustomDispensasjonerUnitInList extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings;

        this.isEmpty = isEmpty;
        this.resourceValues = {
            data
        };
    }

    hasContent(formDataValue) {
        return hasValue(formDataValue);
    }

    getValueFromFormData(props) {
        return getComponentDataValue(props);
    }

    getValidationMessages(textResourceBindings) {
        const textResources = typeof window !== "undefined" && window.textResources ? window.textResources : [];
        return hasMissingTextResources(textResources, textResourceBindings);
    }

    getResourceBindings(props) {
        const resourceBindings = {
            bestemmelse: {
                title: props?.resourceBindings?.bestemmelse?.title || "resource.dispensasjon.bestemmelse.title"
            },
            begrunnelse: {
                title: props?.resourceBindings?.begrunnelse?.title || "resource.dispensasjon.begrunnelse.title"
            }
        };
        if (!props?.hideTitle === true || !props?.hideTitle === "true") {
            resourceBindings.bestemmelsestype = {
                title: props?.resourceBindings?.title || "resource.bestemmelsestype.header"
            };
        }
        return resourceBindings;
    }
}
