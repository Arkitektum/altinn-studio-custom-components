import Part from "../../../classes/data-classes/Part.js";
import { hasValue } from "../../../functions/helpers.js";
import { getPartTableElement } from "../../../functions/tableHelpers.js";

export function getPart(component) {
    return hasValue(component?.formData?.data) && new Part(component.formData.data);
}

export function renderTiltakshaverTable(part, textResources, textResourceBindings) {
    return getPartTableElement(part, textResources, textResourceBindings?.tiltakshaver);
}
