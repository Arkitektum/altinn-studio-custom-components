// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataTitle, getComponentResourceValue } from "../../../functions/helpers.js";

/**
 * CustomHeaderText is a custom component class for rendering header text with configurable size and resource values.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component.
 * @param {string} [props.size] - The size of the header text.
 * @param {any} props.title - The title resource value for the header.
 *
 * @property {string} size - The size of the header text.
 * @property {Object} resourceValues - The resource values used by the component.
 * @property {string} resourceValues.title - The title resource value.
 */
export default class CustomHeaderTextData extends CustomComponent {
    constructor(props) {
        super(props);
        console.log("props", props);
        this.size = props?.size;
        const textResource = getComponentResourceValue(props, "title");
        const textData = getComponentDataTitle(props);
        console.log("textData", textData);
        this.resourceValues = {
            title: [textResource || "", textData || ""].filter(Boolean).join(" ")
        };
        console.log(this.resourceValues);
    }
}
