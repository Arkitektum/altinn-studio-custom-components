import {
    addStyle,
    createCustomElement,
    getComponentContainerElement,
    getCustomComponentProps,
    objectHasValue
} from "../../../../functions/helpers";

export default customElements.define(
    "custom-grouplist-utfall-svar",
    class extends HTMLElement {
        connectedCallback() {
            const { data, hideIfEmpty } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const texts = JSON.parse(this.getAttribute("texts"));
            if (hideIfEmpty && !objectHasValue(data) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                for (const utfallSvar of data) {
                    const utfallSvarElement = createCustomElement("custom-group-utfall-svar", {
                        data: utfallSvar,
                        hideIfEmpty: true,
                        texts
                    });
                    this.appendChild(utfallSvarElement);

                    const isLastElement = utfallSvar === data[data.length - 1];
                    if (!isLastElement) {
                        const dividerElement = document.createElement("hr");
                        addStyle(dividerElement, {
                            height: "2px",
                            border: "none",
                            backgroundColor: "#68707C",
                            margin: "0"
                        });
                        this.appendChild(dividerElement);
                    }
                }
                addStyle(this, {
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem"
                });
            }
        }
    }
);
