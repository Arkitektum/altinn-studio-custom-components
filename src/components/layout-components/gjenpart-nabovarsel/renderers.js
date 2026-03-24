// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Renders a custom header element for the "gjenpartNabovarsel" component.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @param {string} [size="h1"] - The header size (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The custom header element.
 */
export function renderGjenpartNabovarselHeader(component, size = "h1") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: size,
        resourceBindings: {
            title: component.resourceBindings?.gjenpartNabovarsel?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a subheader for the "GjenpartNabovarsel" component.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @param {Object} [component.resourceBindings] - Optional resource bindings for the component.
 * @param {Object} [component.resourceBindings.gjenpartNabovarsel] - Resource bindings specific to "gjenpartNabovarsel".
 * @param {string} [component.resourceBindings.gjenpartNabovarsel.description] - The description to be used as the title.
 * @returns {HTMLElement} The rendered custom paragraph text element wrapped in a container.
 */
export function renderGjenpartNabovarselSubHeader(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceBindings: {
            title: component.resourceBindings?.gjenpartNabovarsel?.description
        }
    });
    return addContainerElement(createCustomElement("custom-paragraph-text", htmlAttributes));
}

/**
 * Renders the metadata project name field as a custom element with specific HTML attributes.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing metadata.
 * @param {Object} [component.resourceValues.data.metadata] - The metadata object.
 * @param {string} [component.resourceValues.data.metadata.prosjektnavn] - The project name to display.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.metadataProsjektnavn] - The resource binding for the project name.
 * @param {string} [component.resourceBindings.metadataProsjektnavn.title] - The title for the project name field.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderMetadataProsjektnavn(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.metadataProsjektnavn?.title
        },
        resourceValues: {
            data: data?.metadata?.prosjektnavn
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Formats the data for "ansvarligSoeker" or "tiltakshaver" components.
 *
 * @param {Object} part - The part object containing name and organization number.
 * @param {string} [part.navn] - The name of the part.
 * @param {string} [part.organisasjonsnummer] - The organization number of the part.
 * @returns {string} The formatted string combining name and organization number.
 */
function formatAnsvarligSoekerTiltakshaverData(part) {
    if (!part?.navn) {
        return "";
    }
    let result = part.navn;
    if (part?.organisasjonsnummer?.length > 0) {
        result += ` (${part.organisasjonsnummer})`;
    }
    return result;
}

/**
 * Renders the "ansvarligSoeker" element as a custom field data component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing "ansvarligSoeker" information.
 * @param {Object} [component.resourceValues.data.ansvarligSoeker] - The "ansvarligSoeker" object.
 * @param {string} [component.resourceValues.data.ansvarligSoeker.navn] - The name of the "ansvarligSoeker".
 * @param {string} [component.resourceValues.data.ansvarligSoeker.organisasjonsnummer] - The organization number of the "ansvarligSoeker".
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.ansvarligSoeker] - The resource binding for the "ansvarligSoeker".
 * @param {string} [component.resourceBindings.ansvarligSoeker.title] - The title for the "ansvarligSoeker" field.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
function renderAnsvarligSoekerElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.ansvarligSoeker?.title
        },
        resourceValues: {
            data: formatAnsvarligSoekerTiltakshaverData(data?.ansvarligSoeker)
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the "tiltakshaver" element as a custom field data component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing "tiltakshaver" information.
 * @param {Object} [component.resourceValues.data.tiltakshaver] - The "tiltakshaver" object.
 * @param {string} [component.resourceValues.data.tiltakshaver.navn] - The name of the "tiltakshaver".
 * @param {string} [component.resourceValues.data.tiltakshaver.organisasjonsnummer] - The organization number of the "tiltakshaver".
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.tiltakshaver] - The resource binding for the "tiltakshaver".
 * @param {string} [component.resourceBindings.tiltakshaver.title] - The title for the "tiltakshaver" field.
 * @returns {React.ReactElement} The rendered custom field data element wrapped in a container.
 */
function renderTiltakshaverElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.tiltakshaver?.title
        },
        resourceValues: {
            data: formatAnsvarligSoekerTiltakshaverData(data?.tiltakshaver)
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the "soeker" element as a custom field data component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing "soeker" information.
 * @param {Object} [component.resourceValues.data.ansvarligSoeker] - The "ansvarligSoeker" object.
 * @param {Object} [component.resourceValues.data.tiltakshaver] - The "tiltakshaver" object.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.ansvarligSoeker] - The resource binding for the "ansvarligSoeker".
 * @param {Object} [component.resourceBindings.tiltakshaver] - The resource binding for the "tiltakshaver".
 * @returns {React.ReactElement} The rendered custom field data element wrapped in a container.
 */
export function renderSoekerElement(component) {
    const data = component?.resourceValues?.data;
    if (hasValue(data?.ansvarligSoeker)) {
        return renderAnsvarligSoekerElement(component);
    } else if (hasValue(data?.tiltakshaver)) {
        return renderTiltakshaverElement(component);
    }
}

/**
 * Renders a custom element representing property and building site information.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing property information.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {string} [component.resourceBindings.eiendomByggested.title] - The title for the property/building site.
 * @param {string} [component.resourceBindings.adresse] - The address binding.
 * @param {string} [component.resourceBindings.eiendomsidentifikasjonGaardsnummer] - The farm number binding.
 * @param {string} [component.resourceBindings.eiendomsidentifikasjonBruksnummer] - The usage number binding.
 * @param {string} [component.resourceBindings.eiendomsidentifikasjonSeksjonsnummer] - The section number binding.
 * @param {string} [component.resourceBindings.eiendomsidentifikasjonFestenummer] - The lease number binding.
 * @param {string} [component.resourceBindings.bolignummer] - The housing number binding.
 * @param {string} [component.resourceBindings.bygningsnummer] - The building number binding.
 * @returns {HTMLElement} The custom element representing the property/building site.
 */
export function renderEiendomByggestedElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        size: "h2",
        resourceBindings: {
            title: component.resourceBindings?.eiendomByggested?.title,
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
 * Renders a custom header element for the "Det er varslet om" section.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @param {string} [size="h2"] - The header size (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The custom header element.
 */
export function renderDetErVarsletOmHeader(component, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: size,
        resourceBindings: {
            title: component.resourceBindings?.detErVarsletOm?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom element for displaying the "Søknad Gjelder Type" data.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values for the component.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom element wrapped in a container.
 */
export function renderSoeknadGjelderTypeElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: false,
        itemKey: "kodebeskrivelse",
        resourceBindings: {
            title: component.resourceBindings?.soeknadGjelderType?.title
        },
        resourceValues: {
            data: data?.soeknadGjelder?.type?.kode
        }
    });
    return addContainerElement(createCustomElement("custom-list-data", htmlAttributes));
}

/**
 * Renders a custom element for displaying the "Søknad Gjelder Bruk Tiltaksformål" data.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing nested values.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.soeknadGjelderBrukTiltaksformaal] - Resource binding for the title.
 * @param {string} [component.resourceBindings.soeknadGjelderBrukTiltaksformaal.title] - The title for the custom element.
 * @returns {HTMLElement} The rendered custom element wrapped in a container.
 */
export function renderSoeknadGjelderBrukTiltaksformaalElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: false,
        itemKey: "kodebeskrivelse",
        resourceBindings: {
            title: component.resourceBindings?.soeknadGjelderBrukTiltaksformaal?.title
        },
        resourceValues: {
            data: data?.soeknadGjelder?.bruk?.tiltaksformaal?.kode
        }
    });
    return addContainerElement(createCustomElement("custom-list-data", htmlAttributes));
}

/**
 * Renders a custom element for displaying the "Beskriv Planlagt Formål" field within the "Søknad Gjelder Bruk" section.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values for the component.
 * @param {Object} component.resourceValues.data - The data object containing form values.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @param {Object} component.resourceBindings.soeknadGjelderBrukBeskrivPlanlagtFormaal - Resource binding for the title.
 * @returns {HTMLElement} The rendered custom element wrapped in a container.
 */
export function renderSoeknadGjelderBrukBeskrivPlanlagtFormaalElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: false,
        resourceBindings: {
            title: component.resourceBindings?.soeknadGjelderBrukBeskrivPlanlagtFormaal?.title
        },
        resourceValues: {
            data: data?.soeknadGjelder?.bruk?.beskrivPlanlagtFormaal
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom header element for "Planer Gjeldende Plan".
 *
 * @param {Object} component - The component object containing resource bindings.
 * @param {Object} [component.resourceBindings] - Optional resource bindings for the component.
 * @param {Object} [component.resourceBindings.planerGjeldendePlan] - Resource binding for the "planerGjeldendePlan".
 * @param {string} [component.resourceBindings.planerGjeldendePlan.title] - The title to display in the header.
 * @returns {HTMLElement} The custom header element created.
 */
export function renderPlanerGjeldendePlanHeaderElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: "h3",
        resourceBindings: {
            title: component.resourceBindings?.planerGjeldendePlan?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom element displaying the name of the current plan.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values for the component.
 * @param {Object} component.resourceValues.data - The data object containing plan information.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @param {Object} component.resourceBindings.planerGjeldendePlanNavn - Resource bindings for the plan name.
 * @param {string} component.resourceBindings.planerGjeldendePlanNavn.title - The title for the plan name field.
 * @returns {HTMLElement} The rendered custom element wrapped in a container.
 */
export function renderPlanGjeldendePlanNavnElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: false,
        resourceBindings: {
            title: component.resourceBindings?.planerGjeldendePlanNavn?.title
        },
        resourceValues: {
            data: data?.planer?.gjeldendePlan?.navn
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom field data element for the "planerGjeldendePlanPlantype" component.
 *
 * This function extracts relevant resource values and bindings from the provided component,
 * constructs the necessary HTML attributes, and returns a container element containing
 * the custom field data.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values associated with the component.
 * @param {Object} component.resourceBindings - The resource bindings associated with the component.
 * @returns {HTMLElement} The rendered container element with the custom field data.
 */
export function renderPlanerGjeldendePlanPlantypeElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: false,
        resourceBindings: {
            title: component.resourceBindings?.planerGjeldendePlanPlantype?.title
        },
        resourceValues: {
            data: data?.planer?.gjeldendePlan?.plantype?.kodebeskrivelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom element for displaying the contact person for the notification (nabovarsel).
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values associated with the component.
 * @param {Object} component.resourceValues.data - The data object containing contact person information.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @param {Object} component.resourceBindings.kontaktpersonForNabovarselet - The resource binding for the contact person.
 * @param {string} component.resourceBindings.kontaktpersonForNabovarselet.title - The title for the contact person section.
 * @returns {HTMLElement} The custom element representing the contact person for the notification.
 */
export function renderKontaktpersonForNabovarseletElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        size: "h2",
        partType: "kontaktpersonForNabovarselet",
        resourceBindings: {
            title: component.resourceBindings?.kontaktpersonForNabovarselet?.title
        },
        resourceValues: {
            data: data?.kontaktpersonForNabovarselet
        }
    });
    return createCustomElement("custom-table-part", htmlAttributes);
}

/**
 * Renders a custom element for displaying information about a neighboring or opposite property (Nabo/Gjenboer Eiendom).
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing property information.
 * @param {Object} [component.resourceBindings] - The resource bindings for various property and owner fields.
 * @returns {HTMLElement} The custom element representing the neighboring property group list.
 */
export function renderNaboGjenboerEiendom(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        size: "h2",
        resourceBindings: {
            title: component.resourceBindings?.naboGjenboerEiendom?.title,
            eiendomMatrikkelinformasjon: component?.resourceBindings?.eiendomMatrikkelinformasjon,
            eiendomMatrikkelinformasjonAdresse: component?.resourceBindings?.eiendomMatrikkelinformasjonAdresse,
            eiendomMatrikkelinformasjonEiendomsidentifikasjonGaardsnummer:
                component?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonGaardsnummer,
            eiendomMatrikkelinformasjonEiendomsidentifikasjonBruksnummer:
                component?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonBruksnummer,
            eiendomMatrikkelinformasjonEiendomsidentifikasjonSeksjonsnummer:
                component?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonSeksjonsnummer,
            eiendomMatrikkelinformasjonEiendomsidentifikasjonFestenummer:
                component?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonFestenummer,
            eiendomMatrikkelinformasjonBolignummer: component?.resourceBindings?.eiendomMatrikkelinformasjonBolignummer,
            eiendomMatrikkelinformasjonBygningsnummer: component?.resourceBindings?.eiendomMatrikkelinformasjonBygningsnummer,
            eier: component?.resourceBindings?.eier,
            eierNavn: component?.resourceBindings?.eierNavn,
            eierTelefonnummer: component?.resourceBindings?.eierTelefonnummer,
            eierEpost: component?.resourceBindings?.eierEpost,
            eierAdresse: component?.resourceBindings?.eierAdresse,
            responsNabovarselSendtVia: component?.resourceBindings?.responsNabovarselSendtVia,
            responsNabovarselSendt: component?.resourceBindings?.responsNabovarselSendt,
            responsErMerknadEllerSamtykkeMottatt: component?.resourceBindings?.responsErMerknadEllerSamtykkeMottatt,
            responsErMerknadMottatt: component?.resourceBindings?.responsErMerknadMottatt,
            responsErSamtykkeMottatt: component?.resourceBindings?.responsErSamtykkeMottatt
        },
        resourceValues: {
            data: data?.naboGjenboerEiendommer?.naboGjenboerEiendom
        }
    });
    return createCustomElement("custom-grouplist-nabo-gjenboer-eiendom", htmlAttributes);
}
