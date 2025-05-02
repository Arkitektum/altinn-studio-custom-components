// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";

// Local functions
import { dispensasjonIsPlanBestemmelseType } from "./functions.js";

/**
 * Renders a custom header element for a given dispensasjon object.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing details for rendering the header.
 * @param {Object} [dispensasjon.dispensasjonBeskrivelse] - The description object of the dispensasjon.
 * @param {Object} [dispensasjon.dispensasjonBeskrivelse.dispensasjonTittel] - The title object of the dispensasjon.
 * @param {string} [dispensasjon.dispensasjonBeskrivelse.dispensasjonTittel.kodebeskrivelse] - The title text of the dispensasjon.
 * @param {string} [size="h1"] - The size of the header element (e.g., "h1", "h2").
 * @returns {HTMLElement|null} - A custom header element if the title is valid, otherwise null.
 */
export function renderDispansasjonHeader(dispensasjon, size = "h1") {
    const title = dispensasjon?.dispensasjonBeskrivelse?.dispensasjonTittel?.kodebeskrivelse;
    if (!hasValue(title)) {
        return null;
    }
    const htmlAttributes = new CustomElementHtmlAttributes({
        text: title,
        size: size
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom field data element for "dispensasjonReferanse" with specified attributes.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data to render.
 * @param {Object} textResources - The text resources object for retrieving localized text.
 * @param {Object} textResourceBindings - The bindings object for mapping text resources to fields.
 * @param {Object} textResourceBindings.dispensasjonReferanse - The specific binding for "dispensasjonReferanse".
 * @param {string} textResourceBindings.dispensasjonReferanse.title - The title binding for the "dispensasjonReferanse" field.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container element.
 */
export function renderDispensasjonReferanse(dispensasjon, textResources, textResourceBindings) {
    const grid = { xs: 6 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.dispensasjonReferanse },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.dispensasjonReferanse?.title),
        hideIfEmpty: true,
        grid
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes), grid);
}

/**
 * Renders metadata for the FTB ID of a dispensasjon object.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing metadata.
 * @param {Object[]} textResources - An array of text resources used for localization.
 * @param {Object} textResourceBindings - An object containing bindings for text resources.
 * @param {Object} textResourceBindings.metadataFtbId - The binding for the FTB ID metadata.
 * @param {string} textResourceBindings.metadataFtbId.title - The title binding for the FTB ID metadata.
 * @returns {HTMLElement} A container element with the rendered custom field data.
 */
export function renderMetadataFtbId(dispensasjon, textResources, textResourceBindings) {
    const grid = { xs: 6 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.metadata?.ftbId },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.metadataFtbId?.title),
        hideIfEmpty: true,
        grid
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes), grid);
}

/**
 * Renders a custom field component for "Kommunens saksnummer" with the provided data and configuration.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data for the field.
 * @param {string} [dispensasjon.kommunensSaksnummer] - The value of "Kommunens Saksnummer" to be displayed.
 * @param {Array<Object>} textResources - The array of text resources used for localization.
 * @param {Object} textResourceBindings - The bindings for text resources specific to this field.
 * @param {Object} [textResourceBindings.kommunensSaksnummer] - The text resource bindings for "Kommunens Saksnummer".
 * @param {string} [textResourceBindings.kommunensSaksnummer.title] - The title key for the text resource.
 * @returns {HTMLElement} The rendered custom field component wrapped in a container element.
 */
export function renderKommunensSaksnummer(dispensasjon, textResources, textResourceBindings) {
    const grid = { xs: 6 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: dispensasjon?.kommunensSaksnummer },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.kommunensSaksnummer?.title),
        hideIfEmpty: true,
        grid
    });
    return addContainerElement(createCustomElement("custom-field-kommunens-saksnummer", htmlAttributes), grid);
}

/**
 * Renders a custom header element for "Søknad gjelder" with the specified text and attributes.
 *
 * @param {Object} textResources - The collection of text resources used for localization.
 * @param {Object} textResourceBindings - The bindings for text resources, containing keys for specific text elements.
 * @param {Object} textResourceBindings.soeknadGjelderHeader - The specific binding for the "Søknad Gjelder" header.
 * @param {string} textResourceBindings.soeknadGjelderHeader.title - The key for the title text resource.
 * @returns {HTMLElement} A custom header element with the specified attributes and localized text.
 */
export function renderSoeknadGjelderHeader(textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.soeknadGjelderHeader?.title),
        size: "h2"
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom table component for displaying property information.
 *
 * @param {Object} dispensasjon - The data object containing information about the dispensation.
 * @param {Object} dispensasjon.eiendomByggested - The property or building site information.
 * @param {Object} dispensasjon.eiendomByggested.eiendom - The specific property data to be displayed in the table.
 * @param {Array} textResources - An array of text resources used for localization.
 * @param {Object} textResourceBindings - An object containing bindings for text resources.
 * @param {Object} textResourceBindings.eiendomByggested - The text resource bindings for the property or building site.
 * @param {string} textResourceBindings.eiendomByggested.title - The key for the title text resource.
 * @returns {HTMLElement} A custom HTML element representing the property table.
 */
export function renderEiendomTable(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: dispensasjon?.eiendomByggested?.eiendom },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.eiendomByggested?.title),
        hideIfEmpty: true
    });
    return createCustomElement("custom-table-eiendom", htmlAttributes);
}

/**
 * Renders a header for the "tiltakstyper type" section if the provided `dispensasjon` object contains a valid value.
 *
 * @param {Object} dispensasjon - The object containing data about the dispensasjon.
 * @param {Object} dispensasjon.tiltakstyper - The tiltakstyper object within the dispensasjon.
 * @param {Object} dispensasjon.tiltakstyper.type - The type object within tiltakstyper.
 * @param {string} dispensasjon.tiltakstyper.type.kode - The code representing the type.
 * @param {Array} textResources - An array of text resources used for localization.
 * @param {Object} textResourceBindings - An object containing bindings for text resources.
 * @param {Object} textResourceBindings.tiltakstyperTypeHeader - The binding for the tiltakstyper type header.
 * @param {string} textResourceBindings.tiltakstyperTypeHeader.title - The title binding for the header.
 * @returns {HTMLElement|null} A custom header element if the value exists, otherwise null.
 */
export function renderTiltakstyperTypeHeader(dispensasjon, textResources, textResourceBindings) {
    const hasValue = dispensasjon?.tiltakstyper?.type?.kode?.length > 0;
    if (!hasValue) {
        return null;
    }
    const htmlAttributes = new CustomElementHtmlAttributes({
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.tiltakstyperTypeHeader?.title),
        size: "h3"
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom list data element for the "Tiltakstyper Type Kode" field.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data to render.
 * @param {Object} textResources - The text resources object used for localization.
 * @param {Object} textResourceBindings - The bindings for text resources to retrieve specific text.
 * @returns {HTMLElement} - A container element wrapping the custom list data element.
 */
export function renderTiltakstyperTypeKode(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: dispensasjon?.tiltakstyper?.type?.kode },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.tiltakstyperTypeKode?.title),
        hideIfEmpty: true,
        itemKey: "kodebeskrivelse"
    });
    return addContainerElement(createCustomElement("custom-list-data", htmlAttributes));
}

/**
 * Renders a custom table component for displaying "tiltakshaver" information.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data for rendering.
 * @param {Object} dispensasjon.tiltakshaver - The "tiltakshaver" data to be displayed in the table.
 * @param {Array} textResources - An array of text resources used for localization.
 * @param {Object} textResourceBindings - An object containing bindings for text resources.
 * @param {Object} textResourceBindings.tiltakshaver - The text resource bindings for "tiltakshaver".
 * @param {string} textResourceBindings.tiltakshaver.title - The title binding for the "tiltakshaver" table.
 * @returns {HTMLElement} A custom HTML element representing the "tiltakshaver" table.
 */
export function renderTiltakshaverTable(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: dispensasjon?.tiltakshaver },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.tiltakshaver?.title),
        hideIfEmpty: true
    });

    return createCustomElement("custom-table-tiltakshaver", htmlAttributes);
}

/**
 * Renders the "Tiltakshaver Adresse" custom field component.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data for rendering.
 * @param {Object} dispensasjon.tiltakshaver - The tiltakshaver object within the dispensasjon.
 * @param {string} dispensasjon.tiltakshaver.adresse - The address of the tiltakshaver.
 * @param {Array} textResources - An array of text resources used for localization.
 * @param {Object} textResourceBindings - An object containing bindings for text resources.
 * @param {Object} textResourceBindings.tiltakshaverAdresse - The bindings for the tiltakshaver address text resource.
 * @param {string} textResourceBindings.tiltakshaverAdresse.title - The title binding for the tiltakshaver address.
 * @returns {HTMLElement} A container element wrapping the custom "Tiltakshaver Adresse" field.
 */
export function renderTiltakshaverAdresse(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: dispensasjon?.tiltakshaver?.adresse },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.tiltakshaverAdresse?.title),
        hideIfEmpty: true
    });

    return addContainerElement(createCustomElement("custom-field-adresse", htmlAttributes));
}

/**
 * Renders the inngangsbeskrivelse (entry description) for a dispensasjon object.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing the necessary data.
 * @param {Object} dispensasjon.dispensasjonBeskrivelse - The description object for the dispensasjon.
 * @param {string} [dispensasjon.dispensasjonBeskrivelse.annenInngangsbeskrivelse] - The alternative entry description.
 * @param {Object} [dispensasjon.dispensasjonBeskrivelse.inngangsbeskrivelse] - The main entry description object.
 * @param {string} [dispensasjon.dispensasjonBeskrivelse.inngangsbeskrivelse.kodebeskrivelse] - The code description for the main entry.
 * @param {Object} dispensasjon.soeknadstype - The application type object.
 * @param {string} [dispensasjon.soeknadstype.kodebeskrivelse] - The code description for the application type.
 * @returns {HTMLElement|null} The rendered custom element wrapped in a container, or null if no valid data is provided.
 */
export function renderInngangsbeskrivelse(dispensasjon) {
    if (
        !hasValue(dispensasjon?.dispensasjonBeskrivelse?.annenInngangsbeskrivelse) &&
        !hasValue(dispensasjon?.dispensasjonBeskrivelse?.inngangsbeskrivelse?.kodebeskrivelse)
    ) {
        return null;
    }
    const condition = dispensasjon?.soeknadstype?.kodebeskrivelse === "Annet";
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: {
            simpleBinding: condition,
            trueData: dispensasjon?.dispensasjonBeskrivelse?.annenInngangsbeskrivelse,
            falseData: dispensasjon?.dispensasjonBeskrivelse?.inngangsbeskrivelse?.kodebeskrivelse,
            defaultData: dispensasjon?.dispensasjonBeskrivelse?.inngangsbeskrivelse?.kodebeskrivelse
        },
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-field-boolean-data", htmlAttributes));
}

/**
 * Renders a custom element for displaying the description of a dispensasjon.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing the description data.
 * @param {Object[]} textResources - An array of text resources used for localization.
 * @param {Object} textResourceBindings - An object containing bindings for text resources.
 * @param {Object} textResourceBindings.dispensasjonBeskrivelseBeskrivelse - The specific binding for the description title.
 * @param {string} textResourceBindings.dispensasjonBeskrivelseBeskrivelse.title - The title key for the description text resource.
 * @returns {HTMLElement} A custom HTML element representing the dispensasjon description.
 */
export function renderDispensasjonBeskrivelse(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.dispensasjonBeskrivelse?.beskrivelse },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.dispensasjonBeskrivelseBeskrivelse?.title),
        hideIfEmpty: true
    });
    return createCustomElement("custom-field-data", htmlAttributes);
}

/**
 * Renders the name of the dispensasjon plan bestemmelse as a custom field data element.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data to render.
 * @param {Object[]} textResources - Array of text resources used for localization.
 * @param {Object} textResourceBindings - Object containing bindings for text resources.
 * @param {Object} textResourceBindings.dispensasjonPlanBestemmelseNavn - Binding for the dispensasjon plan bestemmelse navn.
 * @param {string} textResourceBindings.dispensasjonPlanBestemmelseNavn.title - Title binding for the text resource.
 * @returns {HTMLElement} A custom field data element with the specified attributes.
 */
export function renderDispensasjonPlanBestemmelseNavn(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.dispensasjonFra?.dispensasjonPlanBestemmelse?.navn },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.dispensasjonPlanBestemmelseNavn?.title),
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom header element for "Dispensasjon Fra" using the provided text resources and bindings.
 *
 * @param {Object} textResources - The collection of text resources available for rendering.
 * @param {Object} textResourceBindings - The bindings that map to specific text resources.
 * @param {Object} textResourceBindings.dispensasjonFraHeader - The specific binding for the "Dispensasjon Fra" header.
 * @param {string} textResourceBindings.dispensasjonFraHeader.title - The key for the title text resource.
 * @returns {HTMLElement} A custom header element with the specified attributes and content.
 */
export function renderDispensasjonFraHeader(textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.dispensasjonFraHeader?.title),
        size: "h2"
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom field data element for displaying the "Nasjonal Arealplan Id Plan Identifikasjon".
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data to render.
 * @param {Object} textResources - The text resources used for localization.
 * @param {Object} textResourceBindings - The bindings for text resources, including titles.
 * @returns {HTMLElement} A container element wrapping the custom field data element.
 */
export function renderNasjonalArealplanIdPlanIdentifikasjon(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.dispensasjonFra?.dispensasjonPlanBestemmelse?.nasjonalArealplanId?.planidentifikasjon },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.nasjonalArealplanIdPlanIdentifikasjon?.title),
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the "Bestemmelser Type" for a given dispensasjon object.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data to render.
 * @param {Object[]} textResources - An array of text resources used for localization.
 * @param {Object} textResourceBindings - An object containing bindings for text resources.
 * @param {Object} textResourceBindings.bestemmelserType - The bindings for "Bestemmelser Type".
 * @param {string} textResourceBindings.bestemmelserType.title - The title binding for "Bestemmelser Type".
 * @returns {HTMLElement} A container element with the rendered "Bestemmelser Type".
 */
export function renderBestemmelserType(dispensasjon, textResources, textResourceBindings) {
    const isPlanBestemmelseType = dispensasjonIsPlanBestemmelseType(dispensasjon);
    const simpleBinding = isPlanBestemmelseType
        ? dispensasjon?.dispensasjonFra?.bestemmelserType?.kodebeskrivelse
        : dispensasjon?.dispensasjonFra?.lovbestemmelse;
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.bestemmelserType?.title),
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the plan bestemmelse nummerering (plan provision numbering) for a dispensasjon.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data for rendering.
 * @param {Object} dispensasjon.dispensasjonFra - The object containing details about the dispensasjon.
 * @param {Object} dispensasjon.dispensasjonFra.dispensasjonPlanBestemmelse - The object containing plan provision details.
 * @param {Object} dispensasjon.dispensasjonFra.dispensasjonPlanBestemmelse.planbestemmelse - The object containing specific plan provision information.
 * @param {string} dispensasjon.dispensasjonFra.dispensasjonPlanBestemmelse.planbestemmelse.nummerering - The numbering of the plan provision.
 * @param {Array} textResources - An array of text resources used for localization.
 * @param {Object} textResourceBindings - An object containing bindings for text resources.
 * @param {Object} textResourceBindings.planBestemmelseNummerering - The binding for the plan provision numbering text resource.
 * @param {string} textResourceBindings.planBestemmelseNummerering.title - The title binding for the plan provision numbering text resource.
 * @returns {HTMLElement} A container element with the rendered custom field data.
 */
export function renderPlanBestemmelseNummerering(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.dispensasjonFra?.dispensasjonPlanBestemmelse?.planbestemmelse?.nummerering },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.planBestemmelseNummerering?.title),
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom header element for "Stedfesting" with the specified text and attributes.
 *
 * @param {Object} textResources - The collection of text resources used for localization.
 * @param {Object} textResourceBindings - The bindings for text resources, containing keys for specific text elements.
 * @param {Object} textResourceBindings.stedfestingHeader - The specific binding for the "Stedfesting" header.
 * @param {string} textResourceBindings.stedfestingHeader.title - The key for the title text resource of the header.
 * @returns {HTMLElement} A custom header element with the specified attributes and localized text.
 */
export function renderStedfestingHeader(textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.stedfestingHeader?.title),
        size: "h2"
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders the "Stedfesting Posisjon Koordinatsystem" component for a dispensasjon.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data for rendering.
 * @param {Object[]} textResources - An array of text resources used for localization.
 * @param {Object} textResourceBindings - An object containing bindings for text resources.
 * @param {Object} textResourceBindings.stedfestingPosisjonKoordinatsystem - The text resource binding for the "Stedfesting Posisjon Koordinatsystem" title.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container element.
 */
export function renderStedfestingPosisjonKoordinatsystem(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.stedfesting?.posisjon?.koordinatsystem?.kodebeskrivelse },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.stedfestingPosisjonKoordinatsystem?.title),
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom field for displaying position coordinates related to a dispensation.
 *
 * @param {Object} dispensasjon - The dispensation object containing data to render.
 * @param {Object} textResources - The collection of text resources for localization.
 * @param {Object} textResourceBindings - The bindings for text resources specific to this component.
 * @param {Object} textResourceBindings.stedfestingPosisjonKoordinater - The text resource binding for the title.
 * @param {string} textResourceBindings.stedfestingPosisjonKoordinater.title - The key for the title text resource.
 * @returns {HTMLElement} A container element wrapping the custom field data element.
 */
export function renderStedfestingPosisjonKoordinater(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.stedfesting?.posisjon?.koordinater },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.stedfestingPosisjonKoordinater?.title),
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the vertical level ("vertikalnivaa") of the location ("stedfesting") for a dispensation.
 *
 * @param {Object} dispensasjon - The dispensation object containing data to render.
 * @param {Object[]} textResources - Array of text resources used for localization.
 * @param {Object} textResourceBindings - Object containing bindings for text resources.
 * @param {Object} textResourceBindings.stedfestingVertikalnivaa - Binding for the vertical level text resource.
 * @param {string} textResourceBindings.stedfestingVertikalnivaa.title - Title binding for the vertical level text resource.
 * @returns {HTMLElement} A container element wrapping the custom field data element.
 */
export function renderStedfestingVertikalnivaa(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.stedfesting?.vertikalnivaa?.kodebeskrivelse },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.stedfestingVertikalnivaa?.title),
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom header element for "Varighet" using the provided text resources and bindings.
 *
 * @param {Object} textResources - The collection of text resources available for rendering.
 * @param {Object} textResourceBindings - The bindings for text resources, containing keys for specific text elements.
 * @param {Object} textResourceBindings.varighetHeader - The binding for the "Varighet" header.
 * @param {string} textResourceBindings.varighetHeader.title - The key for the title text resource of the "Varighet" header.
 * @returns {HTMLElement} A custom header element with the specified attributes and text.
 */
export function renderVarighetHeader(textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.varighetHeader?.title),
        size: "h2"
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders the desired duration of a dispensation based on its properties.
 *
 * @param {Object} dispensasjon - The dispensation object containing duration details.
 * @param {Object} textResources - The text resources used for localization.
 * @param {Object} textResourceBindings - The bindings for text resources.
 * @param {Object} textResourceBindings.varighetOenskesVarigDispensasjon - Text resource bindings for permanent dispensation.
 * @param {string} textResourceBindings.varighetOenskesVarigDispensasjon.trueText - Text to display when permanent dispensation is desired.
 * @param {Object} textResourceBindings.varighetOensketVarighetTil - Text resource bindings for the desired end date.
 * @param {string} textResourceBindings.varighetOensketVarighetTil.title - Title text for the desired end date.
 * @returns {HTMLElement|null} A container element with the rendered content, or null if no valid data is provided.
 */
export function renderOensketVarighet(dispensasjon, textResources, textResourceBindings) {
    const oenskesVarigDispensasjon = dispensasjon?.varighet?.oenskesVarigDispensasjon;
    if (oenskesVarigDispensasjon) {
        const htmlAttributes = new CustomElementHtmlAttributes({
            text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.varighetOenskesVarigDispensasjon?.trueText)
        });
        return addContainerElement(createCustomElement("custom-paragraph-text", htmlAttributes));
    } else if (hasValue(dispensasjon?.varighet?.oensketVarighetTil)) {
        const htmlAttributes = new CustomElementHtmlAttributes({
            formData: { simpleBinding: dispensasjon?.varighet?.oensketVarighetTil },
            text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.varighetOensketVarighetTil?.title),
            format: "date"
        });
        return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
    } else {
        return null;
    }
}

/**
 * Renders a custom header element for the "begrunnelseHeader" section.
 *
 * @param {Object} textResources - The collection of text resources available for rendering.
 * @param {Object} textResourceBindings - The bindings that map to specific text resources.
 * @param {Object} textResourceBindings.begrunnelseHeader - The specific binding for the "begrunnelseHeader" section.
 * @param {string} textResourceBindings.begrunnelseHeader.title - The key for the title text resource.
 * @returns {HTMLElement} A custom header element with the specified attributes.
 */
export function renderBegrunnelseHeader(textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.begrunnelseHeader?.title),
        size: "h2"
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders the "Begrunnelse Hensyn Bak Bestemmelsen" custom field data element.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data for rendering.
 * @param {Object} textResources - The collection of text resources used for localization.
 * @param {Object} textResourceBindings - The bindings for text resources specific to this renderer.
 * @param {Object} textResourceBindings.begrunnelseHensynBakBestemmelsen - The specific text resource binding for the title.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container element.
 */
export function renderBegrunnelseHensynBakBestemmelsen(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.begrunnelse?.hensynBakBestemmelsen },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.begrunnelseHensynBakBestemmelsen?.title),
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom field data element for the "Begrunnelse Vurdering Hensyn Bak Bestemmelsen".
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data for rendering.
 * @param {Object} textResources - The text resources object used for retrieving localized text.
 * @param {Object} textResourceBindings - The bindings object for text resource keys.
 * @param {Object} textResourceBindings.begrunnelseVurderingHensynBakBestemmelsen - The specific binding for the title text resource.
 * @returns {HTMLElement} A container element wrapping the custom field data element.
 */
export function renderBegrunnelseVurderingHensynBakBestemmelsen(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.begrunnelse?.vurderingHensynBakBestemmelsen },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.begrunnelseVurderingHensynBakBestemmelsen?.title),
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom field data element for the "Begrunnelse Vurdering Hensyn Overordnet" section.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data for rendering.
 * @param {Object[]} textResources - Array of text resources used for localization.
 * @param {Object} textResourceBindings - Object containing bindings for text resources.
 * @param {Object} textResourceBindings.begrunnelseVurderingHensynOverordnet - Binding for the "Begrunnelse Vurdering Hensyn Overordnet" text resource.
 * @param {string} textResourceBindings.begrunnelseVurderingHensynOverordnet.title - Title binding for the text resource.
 * @returns {HTMLElement} A container element wrapping the custom field data element.
 */
export function renderBegrunnelseVurderingHensynOverordnet(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.begrunnelse?.vurderingHensynOverordnet },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.begrunnelseVurderingHensynOverordnet?.title),
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the "Begrunnelse Fordeler" section for a dispensasjon.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data for rendering.
 * @param {Object[]} textResources - An array of text resources used for localization.
 * @param {Object} textResourceBindings - An object containing bindings for text resources.
 * @param {Object} textResourceBindings.begrunnelseFordeler - Bindings for the "Begrunnelse Fordeler" section.
 * @param {string} textResourceBindings.begrunnelseFordeler.title - The resource binding key for the title text.
 * @returns {HTMLElement} A container element with the rendered "Begrunnelse Fordeler" content.
 */
export function renderBegrunnelseFordeler(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: dispensasjon?.begrunnelse?.fordeler?.effekt },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.begrunnelseFordeler?.title),
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-list-data", htmlAttributes));
}

/**
 * Renders the "Begrunnelse Ulemper" section for a dispensasjon.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data.
 * @param {Object[]} textResources - Array of text resources used for localization.
 * @param {Object} textResourceBindings - Object containing bindings for text resources.
 * @param {Object} textResourceBindings.begrunnelseUlemper - Bindings specific to "Begrunnelse Ulemper".
 * @param {string} textResourceBindings.begrunnelseUlemper.title - The title binding for "Begrunnelse Ulemper".
 * @returns {HTMLElement} A container element with the rendered "Begrunnelse Ulemper" content.
 */
export function renderBegrunnelseUlemper(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: dispensasjon?.begrunnelse?.ulemper?.effekt },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.begrunnelseUlemper?.title),
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-list-data", htmlAttributes));
}

/**
 * Renders the "Samlet Begrunnelse" (combined justification) for a dispensasjon.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data to render.
 * @param {Object[]} textResources - Array of text resources used for localization.
 * @param {Object} textResourceBindings - Object containing bindings for text resources.
 * @param {Object} textResourceBindings.begrunnelseSamletBegrunnelse - Binding for the "Samlet Begrunnelse" text resource.
 * @param {string} textResourceBindings.begrunnelseSamletBegrunnelse.title - The title binding for the "Samlet Begrunnelse".
 * @returns {HTMLElement} A container element wrapping the custom field data element.
 */
export function renderBegrunnelseSamletBegrunnelse(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.begrunnelse?.samletBegrunnelse },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.begrunnelseSamletBegrunnelse?.title),
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom header element with text for general terms in Norwegian, Swedish, and Danish.
 *
 * @param {Object} textResources - The collection of text resources available for rendering.
 * @param {Object} textResourceBindings - The bindings for text resources, containing keys for specific text elements.
 * @param {Object} textResourceBindings.generelleVilkaarNorskSvenskDansk - The binding for general terms in Norwegian, Swedish, and Danish.
 * @param {string} textResourceBindings.generelleVilkaarNorskSvenskDansk.title - The key for the title text resource.
 * @returns {HTMLElement} A custom header element with the specified text and attributes.
 */
export function renderGenerelleVilkaarNorskSvenskDanskHeader(textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.generelleVilkaarNorskSvenskDansk?.title),
        size: "h2"
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom boolean text field for "Generelle Vilkår" in Norwegian, Swedish, and Danish.
 *
 * @param {Object} dispensasjon - The dispensasjon object containing data for rendering.
 * @param {Object[]} textResources - Array of text resources used for localization.
 * @param {Object} textResourceBindings - Object containing bindings for text resources.
 * @param {Object} textResourceBindings.generelleVilkaarNorskSvenskDansk - Bindings for the "Generelle Vilkår" text resources.
 * @param {string} textResourceBindings.generelleVilkaarNorskSvenskDansk.trueText - The text to display when the value is true.
 *
 * @returns {HTMLElement} A container element wrapping the custom boolean text field.
 */
export function renderGenerelleVilkaarNorskSvenskDansk(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.generelleVilkaar?.norskSvenskDansk },
        texts: {
            trueText: getTextResourceFromResourceBinding(textResources, textResourceBindings?.generelleVilkaarNorskSvenskDansk?.trueText),
            falseText: "",
            defaultText: ""
        },
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}
