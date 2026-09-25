import type { ComponentProps } from "../../../types.ts";
// Classes
import CustomComponent from "../CustomComponent.ts";

// Global functions
import { getComponentResourceValue } from "../../../functions/helpers.ts";

/**
 * CustomSubheaderText is a custom component class that extends CustomComponent.
 * It initializes resource values for the component, specifically the "title" property,
 * using the getComponentResourceValue utility function.
 *
 * @class
 * @extends CustomComponent
 * @param {Object} props - The properties passed to the component.
 */
export default class CustomSubheaderText extends CustomComponent {
    declare resourceValues: { title?: unknown };

    constructor(props: ComponentProps) {
        super(props);
        this.resourceValues = {
            title: getComponentResourceValue(props, "title")
        };
    }

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage(): string[] {
        return ["custom-paragraph"];
    }
}
