import type { ComponentProps } from "../../../types.ts";
// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.ts";

// Global functions
import { getComponentResourceValue } from "../../../functions/helpers.ts";

/**
 * CustomParagraphText is a custom component class that handles paragraph text with localization support.
 * It extends the CustomComponent base class and manages resource values for the component's title.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object for the component.
 * @param {string} [props.text] - The fallback text to use if no localized title is found.
 *
 * @property {Object} resourceValues - Contains the localized or fallback title for the component.
 */
export default class CustomParagraphText extends CustomComponent {
    declare resourceValues: { title?: unknown };

    constructor(props: ComponentProps) {
        super(props);
        this.resourceValues = {
            title: this.getTextData(props)
        };
    }

    /**
     * Retrieves the text data for a component, prioritizing the localized title if available.
     *
     * @param {Object} props - The properties object for the component.
     * @param {string} [props.text] - The fallback text to use if no title is found.
     * @returns {string|undefined} The component's title if available, otherwise the text property.
     */
    getTextData(props: ComponentProps): unknown {
        const title = getComponentResourceValue(props, "title");
        const text = props?.text;
        return hasValue(title) ? title : text;
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
