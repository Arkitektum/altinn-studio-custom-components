import {
    createCustomElement,
    getComponentContainerElement,
    getComponentTexts,
    getCustomComponentProps
} from "../../../functions/helpers.js";
import { getTableHeaders, getTableRows } from "../../../functions/tableHelpers.js";

export default customElements.define(
    "custom-table-eiendom",
    class extends HTMLElement {
        async connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (hideIfEmpty && !data && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const texts = await getComponentTexts(this);
                const tableColumns = JSON.parse(this.getAttribute("tableColumns"));
                const title = !hideTitle && text;
                this.innerHTML = createCustomElement("custom-table", {
                    data: {
                        tableHeaders: getTableHeaders(tableColumns, texts),
                        tableRows: getTableRows(tableColumns, data)
                    },
                    text: title,
                    emptyFieldText,
                    styleoverride
                }).outerHTML;
            }
        }
    }
);
