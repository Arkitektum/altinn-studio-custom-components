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
     * @param {string} [props.itemKey] - The key identifying the item.
     * @param {boolean} [props.hideOrgNr] - Whether to hide the organization number.
     * @param {string} [props.format] - The format of the component's value.
     * @param {boolean} [props.showRowNumbers] - Whether to show row numbers.
     */
    constructor(props) {
        if (props?.tagName) {
            this.tagName = props.tagName;
        }
        if (props?.text) {
            this.text = props.text;
        }
        if (props?.texts) {
            this.texts = props.texts;
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
        if (props?.itemKey) {
            this.itemKey = props.itemKey;
        }
        if (props?.hideOrgNr) {
            this.hideOrgNr = props.hideOrgNr;
        }
        if (props?.format) {
            this.format = props.format;
        }
        if (props?.showRowNumbers) {
            this.showRowNumbers = props.showRowNumbers;
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

    /**
     * Sets the texts for the custom component.
     *
     * @param {Object} texts - An object containing the texts to be set.
     */
    setTexts(texts) {
        this.texts = texts;
    }

    /**
     * Sets the text property of the CustomComponent instance.
     *
     * @param {string} text - The text to set.
     */
    setText(text) {
        this.text = text;
    }
}
