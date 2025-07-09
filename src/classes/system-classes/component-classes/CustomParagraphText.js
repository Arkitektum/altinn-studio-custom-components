// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentResourceValue } from "../../../functions/helpers.js";

/**
 * CustomParagraphText is a custom component class that extends CustomComponent.
 * It initializes resource values for the component, specifically the "title" property.
 *
 * @extends CustomComponent
 * @param {Object} props - The properties passed to the component.
 */
export default class CustomParagraphText extends CustomComponent {
    constructor(props) {
        super(props);
        this.resourceValues = {
            title: getComponentResourceValue(props, "title")
        };
    }
}
