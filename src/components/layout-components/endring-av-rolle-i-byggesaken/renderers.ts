import type EndringAvRolleIByggesaken from "../../../classes/layout-classes/EndringAvRolleIByggesaken.ts";
import type { InstantiatedComponent } from "../../../types.ts";
// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Renders a custom header element for the "endringAvRolleIByggesaken" component.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @param {string} [size="h1"] - The header size (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The custom header element.
 */
export function renderEndringAvRolleIByggesakenHeader(component: InstantiatedComponent | null | undefined, size = "h1") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: size,
        resourceBindings: {
            title: component?.resourceBindings?.endringAvRolleIByggesaken?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders the custom field component for "Kommunens saksnummer", taking half the row.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @returns {HTMLElement} The rendered custom field component wrapped in a container element.
 */
export function renderKommunensSaksnummer(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as EndringAvRolleIByggesaken | undefined;
    const grid = { xs: 6 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        grid,
        resourceBindings: {
            title: component?.resourceBindings?.kommunensSaksnummer?.title
        },
        resourceValues: {
            data: data?.kommunensSaksnummer
        }
    });
    return addContainerElement(createCustomElement("custom-field-kommunens-saksnummer", htmlAttributes), grid);
}

/**
 * Renders the date the change of role applies from, taking the other half of the row.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container element.
 */
export function renderGjelderFraDato(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as EndringAvRolleIByggesaken | undefined;
    const grid = { xs: 6 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        format: "date",
        grid,
        resourceBindings: {
            title: component?.resourceBindings?.gjelderFraDato?.title
        },
        resourceValues: {
            data: data?.gjelderFraDato
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes), grid);
}

/**
 * Renders a custom header element for the "Søknaden gjelder" section.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @param {string} [size="h2"] - The header size (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The custom header element.
 */
export function renderSoeknadGjelderHeader(component: InstantiatedComponent | null | undefined, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: size,
        resourceBindings: {
            title: component?.resourceBindings?.soeknadGjelderHeader?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom element representing property and building site information.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @returns {HTMLElement} The custom element representing the property/building site.
 */
export function renderEiendomByggestedElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as EndringAvRolleIByggesaken | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        size: "h3",
        resourceBindings: {
            title: component?.resourceBindings?.eiendomByggested?.title,
            adresse: component?.resourceBindings?.adresse,
            eiendomsidentifikasjonGaardsnummer: component?.resourceBindings?.eiendomsidentifikasjonGaardsnummer,
            eiendomsidentifikasjonBruksnummer: component?.resourceBindings?.eiendomsidentifikasjonBruksnummer,
            eiendomsidentifikasjonSeksjonsnummer: component?.resourceBindings?.eiendomsidentifikasjonSeksjonsnummer,
            eiendomsidentifikasjonFestenummer: component?.resourceBindings?.eiendomsidentifikasjonFestenummer,
            bolignummer: component?.resourceBindings?.bolignummer,
            bygningsnummer: component?.resourceBindings?.bygningsnummer
        },
        resourceValues: {
            data: data?.eiendomByggested?.eiendom
        }
    });
    return createCustomElement("custom-table-eiendom", htmlAttributes);
}

/**
 * Renders a custom element listing the types of the application by their descriptions.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @returns {HTMLElement} The rendered custom element wrapped in a container.
 */
export function renderSoeknadGjelderTypeElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as EndringAvRolleIByggesaken | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        itemKey: "kodebeskrivelse",
        resourceBindings: {
            title: component?.resourceBindings?.soeknadGjelderType?.title
        },
        resourceValues: {
            data: data?.soeknadGjelder?.type?.kode
        }
    });
    return addContainerElement(createCustomElement("custom-list-data", htmlAttributes));
}

/**
 * Renders a custom element listing the purposes of the measure by their descriptions.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @returns {HTMLElement} The rendered custom element wrapped in a container.
 */
export function renderSoeknadGjelderBrukTiltaksformaalElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as EndringAvRolleIByggesaken | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        itemKey: "kodebeskrivelse",
        resourceBindings: {
            title: component?.resourceBindings?.soeknadGjelderBrukTiltaksformaal?.title
        },
        resourceValues: {
            data: data?.soeknadGjelder?.bruk?.tiltaksformaal?.kode
        }
    });
    return addContainerElement(createCustomElement("custom-list-data", htmlAttributes));
}

/**
 * Renders the changes of role as a table, one row per actor: the role, the kind of change, who, and whether it is declared.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @returns {HTMLElement} The custom table element.
 */
export function renderRolleendringerElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as EndringAvRolleIByggesaken | undefined;
    const tableColumns = [
        {
            dataKey: "aktoertype.kodebeskrivelse",
            tagName: "custom-field-data",
            resourceBindings: component?.resourceBindings?.rolleendringAktoertype
        },
        {
            dataKey: "aktoerendring.kodebeskrivelse",
            tagName: "custom-field-data",
            resourceBindings: component?.resourceBindings?.rolleendringAktoerendring
        },
        {
            dataKey: "aktoer.navn",
            tagName: "custom-field-data",
            resourceBindings: component?.resourceBindings?.rolleendringAktoerNavn
        },
        {
            dataKey: "aktoer.organisasjonsnummer",
            tagName: "custom-field-data",
            resourceBindings: component?.resourceBindings?.rolleendringAktoerOrganisasjonsnummer
        },
        {
            dataKey: "erRolleendringErklaert",
            tagName: "custom-field-boolean-text",
            resourceBindings: component?.resourceBindings?.rolleendringErRolleendringErklaert
        }
    ];
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        size: "h2",
        resourceBindings: {
            title: component?.resourceBindings?.rolleendringer?.title
        },
        resourceValues: {
            data: data?.rolleendringer?.rolleendring
        },
        tableColumns
    });
    return createCustomElement("custom-table-data", htmlAttributes);
}

/**
 * Renders the party who reported the change as a table of name, phone and email.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @returns {HTMLElement} The custom table element.
 */
export function renderEndringMeldtAv(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as EndringAvRolleIByggesaken | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        size: "h2",
        resourceBindings: {
            title: component?.resourceBindings?.endringMeldtAv?.title,
            navn: component?.resourceBindings?.endringMeldtAvNavn,
            telefonnummer: component?.resourceBindings?.endringMeldtAvTelefonnummer,
            epost: component?.resourceBindings?.endringMeldtAvEpost
        },
        resourceValues: {
            data: data?.endringMeldtAv
        }
    });
    return createCustomElement("custom-table-part", htmlAttributes);
}

/**
 * Renders the address of the party who reported the change.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @returns {HTMLElement} The rendered custom field element wrapped in a container.
 */
export function renderEndringMeldtAvAdresse(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as EndringAvRolleIByggesaken | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.endringMeldtAvAdresse?.title
        },
        resourceValues: {
            data: data?.endringMeldtAv?.adresse
        }
    });
    return addContainerElement(createCustomElement("custom-field-adresse", htmlAttributes));
}

/**
 * Renders the contact person of the party who reported the change as a table of name, phone and email.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @returns {HTMLElement} The custom table element.
 */
export function renderEndringMeldtAvKontaktperson(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as EndringAvRolleIByggesaken | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        size: "h3",
        resourceBindings: {
            title: component?.resourceBindings?.endringMeldtAvKontaktperson?.title,
            navn: component?.resourceBindings?.endringMeldtAvKontaktpersonNavn,
            telefonnummer: component?.resourceBindings?.endringMeldtAvKontaktpersonTelefonnummer,
            epost: component?.resourceBindings?.endringMeldtAvKontaktpersonEpost
        },
        resourceValues: {
            data: data?.endringMeldtAv?.kontaktperson
        }
    });
    return createCustomElement("custom-table-part", htmlAttributes);
}
