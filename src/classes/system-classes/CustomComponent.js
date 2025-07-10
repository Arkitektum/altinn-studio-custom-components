/**
 * Class representing a CustomComponent.
 * @class
 */
export default class CustomComponent {
    /**
     * Constructs a new CustomComponent instance with the provided properties.
     *
     * @param {Object} props - The properties to initialize the component with.
     * @param {string} [props.tagName] - The tag name for the component.
     * @param {string} [props.text] - The main text content of the component.
     * @param {Object} [props.texts] - Additional text resources for the component.
     * @param {boolean} [props.inline] - Whether the component should be displayed inline.
     * @param {boolean} [props.hideTitle] - Whether to hide the component's title.
     * @param {string} [props.size] - The size of the component.
     * @param {boolean} [props.hideIfEmpty] - Whether to hide the component if it is empty.
     * @param {Object} [props.styleOverride] - Custom style overrides for the component.
     * @param {boolean} [props.isChildComponent] - Whether this is a child component.
     * @param {string} [props.feedbackType] - The type of feedback for the component.
     * @param {boolean} [props.hideOrgNr] - Whether to hide the organization number.
     * @param {string} [props.format] - The format of the component's value.
     */
    constructor(props) {
        if (props?.tagName) {
            this.tagName = props.tagName;
        }
        if (props?.inline) {
            this.inline = props.inline;
        }
        if (props?.hideTitle) {
            this.hideTitle = props.hideTitle;
        }
        if (props?.size) {
            this.size = props.size;
        }
        if (props?.hideIfEmpty) {
            this.hideIfEmpty = props.hideIfEmpty;
        }
        if (props?.styleOverride) {
            this.styleOverride = props.styleOverride;
        }
        if (props?.isChildComponent) {
            this.isChildComponent = props.isChildComponent;
        }
        if (props?.feedbackType) {
            this.feedbackType = props.feedbackType;
        }
        if (props?.hideOrgNr) {
            this.hideOrgNr = props.hideOrgNr;
        }
        if (props?.format) {
            this.format = props.format;
        }
    }

    /**
     * Sets the form data for the custom component.
     *
     * @param {Object} formData - The form data to be set.
     */
    setFormData(formData) {
        this.formData = formData;
    }
}
