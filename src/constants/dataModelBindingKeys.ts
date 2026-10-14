import type { DataModelBindingKeys } from "../types.ts";

/**
 * The binding most data components read: `simpleBinding`, or `data` when `simpleBinding` is not bound, as `getComponentDataValue` reads them.
 *
 * Frozen, since every component sharing it gets the same object, and one changing its own list in place would change everyone's.
 */
export const SIMPLE_BINDING_OR_DATA: DataModelBindingKeys = Object.freeze({
    expected: Object.freeze([]),
    oneOf: Object.freeze([Object.freeze(["simpleBinding", "data"])]),
    deprecated: Object.freeze({})
});

/** For the components that read no binding at all, such as the text components, so any binding a layout gives them is reported. */
export const NO_DATA_MODEL_BINDINGS: DataModelBindingKeys = Object.freeze({
    expected: Object.freeze([]),
    deprecated: Object.freeze({})
});
