// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, hasValue } from "../../../functions/helpers.js";
import { formatString } from "../../../functions/dataFormatHelpers.js";

export default class CustomDispensasjonerListData extends CustomComponent {
    constructor(props) {
        super(props);
        console.log("props", props);
        const data = this.getValueFromFormData(props);
        console.log("data", data);
        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            data: data
        };
    }

    hasContent(formDataValue) {
        return hasValue(formDataValue);
    }

    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        return formatString(data, props?.format);
    }
}
