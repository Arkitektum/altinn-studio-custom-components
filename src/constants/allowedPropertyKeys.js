/**
 * Allowed `formData` / `resourceValues` keys per component type, used by the data-attribute validation
 * in componentRenderHelpers.js.
 *
 * Values:
 *  - an array of strings → only those keys are allowed; anything else is reported as unrecognized.
 *  - `null`             → "allow all keys" (validation is skipped for that type).
 *
 * `layout` components are `null` on purpose: Altinn Studio can't bind a whole model, so layout components
 * receive many domain-specific keys in `formData` (one per model prop). Enumerating them here would be a
 * hand-maintained mirror of every layout model, so those types opt out of key validation entirely.
 */
export const allowedFormDataKeysForTypes = {
    base: ["data", "title"],
    data: ["data", "title", "dataTitle", "trueData", "falseData", "defaultData", "simpleBinding"],
    layout: null
};

export const allowedResourceValuesKeysForTypes = {
    base: ["data", "title"],
    data: ["data", "emptyFieldText", "title"],
    layout: null
};
