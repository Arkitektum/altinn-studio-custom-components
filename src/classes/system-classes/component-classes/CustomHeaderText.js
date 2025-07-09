// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentResourceValue } from "../../../functions/helpers.js";

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
export default class CustomHeaderText extends CustomComponent {
    constructor(props) {
        super(props);
        this.size = props?.size;
        this.resourceValues = {
            title: getComponentResourceValue(props, "title")
        };
    }
}
