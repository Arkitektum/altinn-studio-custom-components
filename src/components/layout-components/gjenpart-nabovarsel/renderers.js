// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../functions/helpers.js";

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
 * Renders a custom header text element for the "Søknad Gjelder" section.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @param {string} [size="h2"] - The header size (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The custom header text element.
 */
export function renderSoeknadGjelderHeader(component, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: size,
        resourceBindings: {
            title: component.resourceBindings?.soeknadGjelderHeader?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
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
        size: "h3",
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
 * Renders a custom header element for the "Det Varsles Herved Om" section.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @param {string} [size="h2"] - The header size (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The custom header element.
 */
export function renderDetVarslesHervedOmHeader(component, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: size,
        resourceBindings: {
            title: component.resourceBindings?.detVarslesHervedOmHeader?.title
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
 * Renders a custom header element for the "Spørsmål rettes til" section.
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceBindings] - Resource bindings for the component.
 * @param {Object} [component.resourceBindings.spoersmaalRettesTil] - Resource binding for "spoersmaalRettesTil".
 * @param {string} [component.resourceBindings.spoersmaalRettesTil.title] - The title to display in the header.
 * @returns {HTMLElement} The custom header element.
 */
export function renderSpoersmaalRettesTilHeaderElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: "h3",
        resourceBindings: {
            title: component.resourceBindings?.spoersmaalRettesTil?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
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
        size: "h4",
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
 * Renders a custom header element for "Merknader sendes til".
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceBindings] - Resource bindings for the component.
 * @param {Object} [component.resourceBindings.merknaderSendesTil] - Resource binding for "merknaderSendesTil".
 * @param {string} [component.resourceBindings.merknaderSendesTil.title] - The title to be displayed in the header.
 * @returns {HTMLElement} The custom header element.
 */
export function renderMerknaderSendesTilHeaderElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: "h3",
        resourceBindings: {
            title: component.resourceBindings?.merknaderSendesTil?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom element for displaying the "Ansvarlig Søker" (responsible applicant) part.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing "ansvarligSoeker".
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.ansvarligSoeker] - The resource binding for "ansvarligSoeker".
 * @param {string} [component.resourceBindings.ansvarligSoeker.title] - The title for the "ansvarligSoeker" part.
 * @returns {HTMLElement} The custom element representing the "Ansvarlig Søker" part.
 */
export function renderAnsvarligSoekerElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        size: "h4",
        partType: "ansvarligSoeker",
        resourceBindings: {
            title: component.resourceBindings?.ansvarligSoeker?.title
        },
        resourceValues: {
            data: data?.ansvarligSoeker
        }
    });
    return createCustomElement("custom-table-part", htmlAttributes);
}

/**
 * Renders a custom element for the "tiltakshaver" part of a component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing "tiltakshaver" information.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.tiltakshaver] - The resource binding for "tiltakshaver".
 * @param {string} [component.resourceBindings.tiltakshaver.title] - The title for the "tiltakshaver" part.
 * @returns {HTMLElement} The rendered custom element for the "tiltakshaver" part.
 */
export function renderTiltakshaverElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        size: "h4",
        partType: "tiltakshaver",
        resourceBindings: {
            title: component.resourceBindings?.tiltakshaver?.title
        },
        resourceValues: {
            data: data?.tiltakshaver
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
        size: "h3",
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
            responsMerknadMottattDato: component?.resourceBindings?.responsMerknadMottattDato,
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
