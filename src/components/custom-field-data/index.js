import { getComponentContainerElement, getCustomComponentProps, renderFieldElement } from "../../functions/helpers";

export default customElements.define(
    "custom-field-data",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, inline, styleoverride } =
                getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (hideIfEmpty && !data && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const value = data || emptyFieldText;
                const options = {
                    inline,
                    styleoverride
                };
                this.innerHTML = renderFieldElement(title, value, options);
            }
        }
    }
);
