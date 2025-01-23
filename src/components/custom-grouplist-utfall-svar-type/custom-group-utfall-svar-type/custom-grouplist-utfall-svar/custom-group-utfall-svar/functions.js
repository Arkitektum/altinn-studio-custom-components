import { addContainerElement, createCustomElement } from "../../../../../functions/helpers";

/**
 * Creates a custom element for the 'beskrivelse' field and wraps it in a container element.
 *
 * @param {Object} data - The data object containing the 'beskrivelse' field.
 * @param {string} [data.beskrivelse] - The description text to be displayed.
 * @returns {HTMLElement} The container element wrapping the custom field element.
 */
export function getBeskrivelseElement(data) {
    return addContainerElement(
        createCustomElement("custom-field-data", {
            data: data?.beskrivelse,
            hideIfEmpty: true
        })
    );
}

/**
 * Creates a status element by wrapping a custom element in a container element.
 *
 * @param {Object} data - The data to be passed to the custom element.
 * @param {Object} texts - The texts to be used in the custom element.
 * @param {string} texts.status.title - The title text for the status.
 * @returns {HTMLElement} The container element with the custom status element inside.
 */
export function getStatusElement(data, texts) {
    return addContainerElement(
        createCustomElement("custom-field-utfall-svar-status", {
            data,
            texts,
            text: texts?.["status.title"]
        })
    );
}

/**
 * Retrieves a themed element based on provided data and texts.
 *
 * @param {Object} data - The data object containing theme information.
 * @param {Object} texts - The texts object containing title descriptions.
 * @returns {HTMLElement} - The custom element wrapped in a container element.
 */
export function getTemaElement(data, texts) {
    return addContainerElement(
        createCustomElement("custom-field-data", {
            data: data?.tema?.kodebeskrivelse,
            text: texts?.["tema.kodebeskrivelse.title"],
            hideIfEmpty: true
        })
    );
}

/**
 * Creates a custom field data element for the "kommentar" field and wraps it in a container element.
 *
 * @param {Object} data - The data object containing the "kommentar" field.
 * @param {Object} texts - The texts object containing the title for the "kommentar" field.
 * @returns {HTMLElement} The container element wrapping the custom field data element.
 */
export function getKommentarElement(data, texts) {
    return addContainerElement(
        createCustomElement("custom-field-data", {
            data: data?.kommentar,
            text: texts?.["kommentar.title"],
            hideIfEmpty: false,
            emptyFieldText: "-"
        })
    );
}

/**
 * Generates a custom list element for the attachment list.
 *
 * @param {Object} data - The data object containing the attachment list.
 * @param {Object} texts - The texts object containing the title for the attachment list.
 * @param {Object} texts["vedleggsliste.vedlegg.title"] - The title text for the attachment list.
 * @returns {HTMLElement} The custom list element for the attachment list.
 */
export function getVedleggslisteElement(data, texts) {
    return addContainerElement(
        createCustomElement("custom-list-vedlegg", {
            data: data?.vedleggsliste?.vedlegg,
            text: texts?.["vedleggsliste.vedlegg.title"],
            hideIfEmpty: true
        })
    );
}
