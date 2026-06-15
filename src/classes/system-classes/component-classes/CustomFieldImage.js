// Dependencies
import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue } from "../../../functions/helpers.js";

/**
 * CustomFieldImage renders an image (PNG/JPEG/SVG/…) from a source string.
 *
 * The source is resolved in priority order:
 *  1. The data model binding value (`formData.simpleBinding`/`data`) — for a per-instance
 *     image stored as a URL or a base64 data URI (`data:image/jpeg;base64,...`).
 *  2. `resourceBindings.src` — a static path/URL/data URI from the text resources,
 *     useful as a placeholder or for a fixed image.
 *
 * Optional `resourceBindings.title` renders a caption above the image, and
 * `resourceBindings.alt` sets the alt text. Size is controlled via `styleOverride`
 * (e.g. `{ "maxWidth": "480px" }`).
 *
 * @class
 * @extends CustomComponent
 *
 * @property {boolean} isEmpty - True when no image source is available.
 * @property {Object} resourceValues - `{ title, data }` where `data` is the resolved image src.
 * @property {string} alt - The alt text for the image.
 */
export default class CustomFieldImage extends CustomComponent {
    constructor(props) {
        super(props);
        const src = this.getSrcFromProps(props);
        this.isEmpty = !hasValue(src);
        this.alt = getTextResourceFromResourceBinding(props?.resourceBindings?.alt);
        this.resourceValues = {
            title: getTextResourceFromResourceBinding(props?.resourceBindings?.title),
            data: src
        };
    }

    /**
     * Resolves the image source from the data binding, falling back to a static resource binding.
     *
     * @param {Object} props - The properties object.
     * @returns {string} The image source (URL, path or data URI), or an empty value when none.
     */
    getSrcFromProps(props) {
        const data = getComponentDataValue(props);
        if (hasValue(data)) {
            return data;
        }
        return getTextResourceFromResourceBinding(props?.resourceBindings?.src);
    }

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An empty array — this component renders a plain image element.
     */
    getComponentUsage() {
        return [];
    }
}
