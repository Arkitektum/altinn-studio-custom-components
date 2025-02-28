import { getComponentContainerElement, getCustomComponentProps, hasValue } from "../../../functions/helpers.js";
import { renderFeedbackListElement } from "./functions.js";
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-feedbacklist-data",
    class extends HTMLElement {
        connectedCallback() {
            const { formData, text, styleOverride } = getCustomComponentProps(this);
            const feedbackType = this.getAttribute("feedbackType");
            const componentContainerElement = getComponentContainerElement(this);
            const listItems = formData?.data;
            const title = text || "Feedback";
            if (!hasValue(listItems) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                this.innerHTML = renderFeedbackListElement(title, listItems, feedbackType, styleOverride);
            }
        }
    }
);
