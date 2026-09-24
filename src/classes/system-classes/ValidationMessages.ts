/** What a caller can seed validation messages with, one array per severity. */
export interface ValidationMessagesProps {
    error?: string[];
    warning?: string[];
    info?: string[];
    success?: string[];
    default?: string[];
}

/**
 * Class representing ValidationMessages.
 * @class
 */
export default class ValidationMessages {
    // Always arrays, so a caller can push onto any severity without checking whether it was seeded.
    declare error: string[];
    declare warning: string[];
    declare info: string[];
    declare success: string[];
    declare default: string[];

    /**
     * Constructs a new instance of the ValidationMessages class.
     *
     * @param {Object} [props] - The properties object for initializing validation messages.
     * @param {Array} [props.error=[]] - An array of error messages.
     * @param {Array} [props.warning=[]] - An array of warning messages.
     * @param {Array} [props.info=[]] - An array of informational messages.
     * @param {Array} [props.success=[]] - An array of success messages.
     * @param {Array} [props.default=[]] - An array of default messages.
     */
    constructor(props?: ValidationMessagesProps) {
        this.error = props?.error || [];
        this.warning = props?.warning || [];
        this.info = props?.info || [];
        this.success = props?.success || [];
        this.default = props?.default || [];
    }
}
