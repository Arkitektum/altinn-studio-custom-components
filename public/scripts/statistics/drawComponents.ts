import type { ApiValue, LayoutComponent } from "../types.ts";
// Dependencies
import {
    CustomElementHtmlAttributes,
    addContainerElement,
    createCustomElement,
    getDataForComponent
} from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Builds the elements for a form's components, each with its data from the example data, the way the display layouts page draws them. A component is drawn when its element is put in the document.
 *
 * @param {Array} components - The form's components. Entries without a tag name are skipped.
 * @param {Array} dataModels - The app's example data, by data type, each holding its example files by name.
 * @param {string} [dataType] - The data type text bindings are read from.
 * @param {Object} [fileNames] - The example file to read for each data type.
 * @returns {Array<{ component: LayoutComponent, element: HTMLElement }>} Each component with the element that draws it.
 */
export function drawLayoutComponents(
    components: (LayoutComponent | undefined)[],
    dataModels: ApiValue[],
    dataType: string | undefined,
    fileNames: Record<string, string> | undefined
) {
    const drawn: { component: LayoutComponent; element: HTMLElement }[] = [];
    for (const component of components) {
        if (!component?.tagName) {
            continue;
        }
        const formData = getDataForComponent(component, dataModels, dataType, fileNames);
        const htmlAttributes = new CustomElementHtmlAttributes({
            ...component,
            formData
        });
        const element = addContainerElement(createCustomElement(component.tagName, htmlAttributes));
        if (component.tagName === "custom-header-text") {
            element.style.margin = "0 -.75rem";
        }
        drawn.push({ component, element });
    }
    return drawn;
}
