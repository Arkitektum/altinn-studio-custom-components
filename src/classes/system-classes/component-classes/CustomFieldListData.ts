import type { ComponentProps } from "../../../types.ts";
// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.ts";

// Global functions
import { getComponentDataValue } from "../../../functions/helpers.ts";

/** One entry of the list this component builds: a title and the value it labels, each taken from its own key. */
export interface FieldListItem {
    title: unknown;
    data: unknown;
}

/**
 * CustomFieldListData is a custom component class for handling and transforming
 * list data structures, typically used in form data scenarios.
 *
 * @extends CustomComponent
 *
 * @param {object} props - The properties passed to the component.
 * @param {Array|object} props.data - The data to be processed by the component.
 * @param {string} [props.dataItemKey] - Dot-separated key path to extract item values from data.
 * @param {string} [props.dataTitleItemKey] - Dot-separated key path to extract title values from data.
 *
 * @property {boolean} isEmpty - Indicates if the data is empty.
 * @property {object} resourceValues - Contains the processed list data with titles and items.
 *
 * @method hasContent Checks if the provided form data value is not empty.
 * @param {*} formDataValue - The value to check for content.
 * @returns {boolean} True if the value has content, false otherwise.
 *
 * @method getListItemsFromKey Extracts a list of values from an array of items using a dot-separated key path.
 * @param {Array} items - The array of items to extract values from.
 * @param {string} itemKey - Dot-separated key path to extract the value.
 * @returns {Array} Array of extracted values.
 *
 * @method getValueFromFormData Processes the props to extract and pair titles and items from the data.
 * @param {object} props - The properties containing data and key paths.
 * @returns {Array|undefined} Array of objects with title and item properties, or undefined if keys are missing.
 */
export default class CustomFieldListData extends CustomComponent {
    /** Only set when the component resolved a list, which is what leaves an unset one absent. */
    declare resourceValues?: { data?: FieldListItem[] };

    constructor(props: ComponentProps) {
        super(props);
        const data = this.getValueFromFormData(props);
        const isEmpty = !this.hasContent(data);
        this.isEmpty = isEmpty;

        if (Array.isArray(data) && data.length) {
            this.resourceValues = {
                data
            };
        }
    }

    /**
     * Determines if the provided form data value contains content.
     *
     * @param {*} formDataValue - The value from the form data to check.
     * @returns {boolean} True if the form data value has content; otherwise, false.
     */
    hasContent(formDataValue: unknown): boolean {
        return hasValue(formDataValue);
    }

    /**
     * Retrieves a list of values from an array of objects based on a dot-separated key path.
     *
     * @param {Array<Object>} items - The array of objects to extract values from.
     * @param {string} itemKey - The dot-separated key path (e.g., "user.name") to retrieve the value from each object.
     * @returns {Array<*>} An array of values corresponding to the specified key path in each object. Returns an empty array if items is not a valid array or is empty.
     */
    getListItemsFromKey(items: unknown, itemKey: string): unknown[] {
        if (!Array.isArray(items) || !items.length) return [];
        const keys = itemKey.split(".");
        return items.map((item) => {
            return keys.reduce((obj: Record<string, unknown> | undefined, key) => obj?.[key] as Record<string, unknown> | undefined, item);
        });
    }

    /**
     * Extracts and pairs title and item values from form data based on provided keys in props.
     *
     * @param {Object} props - The properties object containing data and keys.
     * @param {string} [props.dataItemKey] - The key used to extract item values from the data.
     * @param {string} [props.dataTitleItemKey] - The key used to extract title values from the data.
     * @returns {Array<{title: any, item: any}>|undefined} An array of objects each containing a title and item,
     *   or undefined if required keys are not present.
     */
    getValueFromFormData(props: ComponentProps): FieldListItem[] | undefined {
        const dataItemKey = this.hasContent(props?.dataItemKey);
        const dataTitleItemKey = this.hasContent(props?.dataTitleItemKey);
        const data = getComponentDataValue(props);

        if (dataItemKey && dataTitleItemKey) {
            const dataTitles = (
                hasValue(props?.dataTitleItemKey) ? this.getListItemsFromKey(data, props?.dataTitleItemKey as string) : data
            ) as unknown[];
            const dataItems = (hasValue(props?.dataItemKey) ? this.getListItemsFromKey(data, props?.dataItemKey as string) : data) as unknown[];
            const len = Math.min(dataTitles.length, dataItems.length);

            return Array.from({ length: len }, (_, i) => ({
                title: dataTitles[i],
                data: dataItems[i]
            }));
        }
    }

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage(): string[] {
        return ["custom-field-data"];
    }
}
