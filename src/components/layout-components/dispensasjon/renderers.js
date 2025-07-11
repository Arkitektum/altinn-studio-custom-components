// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement, hasValue } from "../../../functions/helpers.js";

/**
 * Renders a custom header text component for a dispensasjon (dispensation) header.
 *
 * @param {Object} component - The component object containing resource values.
 * @param {string} [size="h1"] - The header size (e.g., "h1", "h2").
 * @returns {Object|null} The custom header element or null if the title is not available.
 */
export function renderDispansasjonHeader(component, size = "h1") {
    const data = component?.resourceValues?.data;
    const title = data?.dispensasjonBeskrivelse?.dispensasjonTittel?.kodebeskrivelse;
    if (!hasValue(title)) {
        return null;
    }
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: size,
        resourceValues: {
            title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom field data component for "dispensasjonReferanse".
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values for the component.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @returns {React.ReactNode} The rendered custom field data component wrapped in a container element.
 */
export function renderDispensasjonReferanse(component) {
    const data = component?.resourceValues?.data;
    const grid = { xs: 6 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        grid,
        resourceBindings: {
            title: component.resourceBindings?.dispensasjonReferanse?.title
        },
        resourceValues: {
            data: data?.dispensasjonReferanse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes), grid);
}

/**
 * Renders a custom field displaying the metadata FTB ID from the given component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing metadata.
 * @param {Object} [component.resourceValues.data.metadata] - The metadata object.
 * @param {string} [component.resourceValues.data.metadata.ftbId] - The FTB ID to display.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.metadataFtbId] - The resource binding for the metadata FTB ID.
 * @param {string} [component.resourceBindings.metadataFtbId.title] - The title for the field.
 * @returns {React.ReactElement} The rendered custom field element wrapped in a container.
 */
export function renderMetadataFtbId(component) {
    const data = component?.resourceValues?.data;
    const grid = { xs: 6 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        grid,
        resourceBindings: {
            title: component.resourceBindings?.metadataFtbId?.title
        },
        resourceValues: {
            data: data?.metadata?.ftbId
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes), grid);
}

/**
 * Renders the custom field component for "Kommunens Saksnummer".
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceValues.data] - The data object containing field values.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.kommunensSaksnummer] - Resource bindings for "kommunensSaksnummer".
 * @param {string} [component.resourceBindings.kommunensSaksnummer.title] - The title for the field.
 * @returns {React.ReactElement} The rendered custom field component wrapped in a container element.
 */
export function renderKommunensSaksnummer(component) {
    const data = component?.resourceValues?.data;
    const grid = { xs: 6 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        grid,
        resourceBindings: {
            title: component.resourceBindings?.kommunensSaksnummer?.title
        },
        resourceValues: {
            data: data?.kommunensSaksnummer
        }
    });
    return addContainerElement(createCustomElement("custom-field-kommunens-saksnummer", htmlAttributes), grid);
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
 * Renders a custom table element for displaying property (eiendom) data.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values associated with the component.
 * @param {Object} component.resourceValues.data - The data object containing property information.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @param {Object} component.resourceBindings.eiendomByggested - The resource binding for property location.
 * @param {string} component.resourceBindings.eiendomByggested.title - The title for the property table.
 * @returns {HTMLElement} The custom table element for displaying property data.
 */
export function renderEiendomTable(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.eiendomByggested?.title
        },
        resourceValues: {
            data: data?.eiendomByggested?.eiendom
        }
    });
    return createCustomElement("custom-table-eiendom", htmlAttributes);
}

/**
 * Renders a custom header text element for the "tiltakstyper type" if the relevant data exists.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {string} [size="h3"] - The size of the header, defaults to "h3".
 * @returns {React.ReactElement|null} The custom header element if data is present, otherwise null.
 */
export function renderTiltakstyperTypeHeader(component, size = "h3") {
    const data = component?.resourceValues?.data;
    const hasValue = data?.tiltakstyper?.type?.kode?.length > 0;
    if (!hasValue) {
        return null;
    }
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceBindings: {
            title: component.resourceBindings?.tiltakstyperTypeHeader?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom list data element for "tiltakstyperTypeKode" using the provided component's resource values and bindings.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing tiltakstyper information.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.tiltakstyperTypeKode] - The resource binding for tiltakstyperTypeKode.
 * @param {string} [component.resourceBindings.tiltakstyperTypeKode.title] - The title for the tiltakstyperTypeKode.
 * @returns {HTMLElement} The rendered custom list data element wrapped in a container element.
 */
export function renderTiltakstyperTypeKode(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        itemKey: "kodebeskrivelse",
        resourceBindings: {
            title: component.resourceBindings?.tiltakstyperTypeKode?.title
        },
        resourceValues: {
            data: data?.tiltakstyper?.type?.kode
        }
    });
    return addContainerElement(createCustomElement("custom-list-data", htmlAttributes));
}

/**
 * Renders a custom table part for the "tiltakshaver" data.
 *
 * @param {Object} component - The component object containing resource values.
 * @param {Object} component.resourceValues - The resource values associated with the component.
 * @param {Object} component.resourceValues.data - The data object containing "tiltakshaver".
 * @returns {HTMLElement} The custom table part element for "tiltakshaver".
 */
export function renderTiltakshaverTable(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        partType: "tiltakshaver",
        hideIfEmpty: true,
        resourceValues: {
            data: data?.tiltakshaver
        }
    });

    return createCustomElement("custom-table-part", htmlAttributes);
}

/**
 * Renders the "Tiltakshaver Adresse" custom field component.
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceValues.data] - The data object containing tiltakshaver information.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.tiltakshaverAdresse] - The resource binding for the tiltakshaver address.
 * @param {string} [component.resourceBindings.tiltakshaverAdresse.title] - The title for the tiltakshaver address field.
 * @returns {HTMLElement} The rendered custom address field wrapped in a container element.
 */
export function renderTiltakshaverAdresse(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.tiltakshaverAdresse?.title
        },
        resourceValues: {
            data: data?.tiltakshaver?.adresse
        }
    });

    return addContainerElement(createCustomElement("custom-field-adresse", htmlAttributes));
}

/**
 * Renders the "inngangsbeskrivelse" (entrance description) field for a dispensasjon component.
 *
 * This function checks if either the "annenInngangsbeskrivelse" (other entrance description)
 * or the "inngangsbeskrivelse.kodebeskrivelse" (entrance description code description) has a value.
 * If neither has a value, it returns null and does not render anything.
 *
 * If the "soeknadstype.kodebeskrivelse" (application type code description) is "Annet" (Other),
 * it binds the "annenInngangsbeskrivelse" as the data; otherwise, it uses the "inngangsbeskrivelse.kodebeskrivelse".
 * The function creates a custom element with these bindings and wraps it in a container element.
 *
 * @param {Object} component - The component object containing resource values and data.
 * @returns {React.ReactNode|null} The rendered custom field element or null if no relevant data is present.
 */
export function renderInngangsbeskrivelse(component) {
    const data = component?.resourceValues?.data;
    if (
        !hasValue(data?.dispensasjonBeskrivelse?.annenInngangsbeskrivelse) &&
        !hasValue(data?.dispensasjonBeskrivelse?.inngangsbeskrivelse?.kodebeskrivelse)
    ) {
        return null;
    }
    const condition = data?.soeknadstype?.kodebeskrivelse === "Annet";
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: false,
        resourceValues: {
            data: condition,
            trueData: data?.dispensasjonBeskrivelse?.annenInngangsbeskrivelse,
            falseData: data?.dispensasjonBeskrivelse?.inngangsbeskrivelse?.kodebeskrivelse,
            defaultData: data?.dispensasjonBeskrivelse?.inngangsbeskrivelse?.kodebeskrivelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-data", htmlAttributes));
}

/**
 * Renders the "dispensasjonBeskrivelse" custom field component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceValues.data] - The data object containing "dispensasjonBeskrivelse".
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.dispensasjonBeskrivelseBeskrivelse] - The resource binding for the title.
 * @param {string} [component.resourceBindings.dispensasjonBeskrivelseBeskrivelse.title] - The title for the custom field.
 * @returns {HTMLElement} The rendered custom field element.
 */
export function renderDispensasjonBeskrivelse(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.dispensasjonBeskrivelseBeskrivelse?.title
        },
        resourceValues: {
            data: data?.dispensasjonBeskrivelse?.beskrivelse
        }
    });
    return createCustomElement("custom-field-data", htmlAttributes);
}

/**
 * Renders a custom field displaying the name of the "dispensasjon plan bestemmelse".
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceValues.data] - The data object containing dispensasjon information.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom field element wrapped in a container.
 */
export function renderDispensasjonPlanBestemmelseNavn(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.dispensasjonPlanBestemmelseNavn?.title
        },
        resourceValues: {
            data: data?.dispensasjonFra?.dispensasjonPlanBestemmelse?.navn
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom header text element for "Dispensasjon Fra" using the provided component and size.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @param {string} [size="h2"] - The header size (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The created custom header text element.
 */
export function renderDispensasjonFraHeader(component, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceBindings: {
            title: component.resourceBindings?.dispensasjonFraHeader?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders the "Nasjonal Arealplan Id Plan Identifikasjon" custom field component.
 *
 * This function extracts the relevant data from the provided component object,
 * constructs the necessary HTML attributes, and returns a container element
 * containing the custom field data element.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceValues.data] - The data object containing dispensasjon information.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.nasjonalArealplanIdPlanIdentifikasjon] - The resource binding for the title.
 * @returns {HTMLElement} The rendered container element with the custom field data.
 */
export function renderNasjonalArealplanIdPlanIdentifikasjon(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.nasjonalArealplanIdPlanIdentifikasjon?.title
        },
        resourceValues: {
            data: data?.dispensasjonFra?.dispensasjonPlanBestemmelse?.nasjonalArealplanId?.planidentifikasjon
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom field data element for "Bestemmelser Type" based on the provided component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing information for rendering.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.bestemmelserType] - The bindings for "bestemmelserType".
 * @param {string} [component.resourceBindings.bestemmelserType.title] - The title binding for "bestemmelserType".
 * @param {boolean} [component.isPlanBestemmelseType] - Flag indicating if the component is of type "PlanBestemmelse".
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderBestemmelserType(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.bestemmelserType?.title
        },
        resourceValues: {
            data: component.isPlanBestemmelseType ? data?.dispensasjonFra?.bestemmelserType?.kodebeskrivelse : data?.dispensasjonFra?.lovbestemmelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the "PlanBestemmelseNummerering" custom field component.
 *
 * This function creates a custom element for displaying the numbering of a plan determination,
 * using resource bindings and values from the provided component object.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing plan determination information.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderPlanBestemmelseNummerering(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.planBestemmelseNummerering?.title
        },
        resourceValues: {
            data: data?.dispensasjonFra?.dispensasjonPlanBestemmelse?.planbestemmelse?.nummerering
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom header element for "stedfesting" (localization) sections.
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceBindings] - Optional resource bindings for the component.
 * @param {Object} [component.resourceBindings.stedfestingHeader] - Resource binding for the stedfesting header.
 * @param {string} [component.resourceBindings.stedfestingHeader.title] - The title to display in the header.
 * @returns {HTMLElement} The custom header element.
 */
export function renderStedfestingHeader(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: "h2",
        resourceBindings: {
            title: component.resourceBindings?.stedfestingHeader?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom field data element for the "Stedfesting Posisjon Koordinatsystem" component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceValues.data] - The data object containing stedfesting information.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderStedfestingPosisjonKoordinatsystem(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.stedfestingPosisjonKoordinatsystem?.title
        },
        resourceValues: {
            data: data?.stedfesting?.posisjon?.koordinatsystem?.kodebeskrivelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom field data element for displaying position coordinates.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values associated with the component.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderStedfestingPosisjonKoordinater(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.stedfestingPosisjonKoordinater?.title
        },
        resourceValues: {
            data: data?.stedfesting?.posisjon?.koordinater?.koordinat
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the vertical level ("vertikalnivaa") location information for a component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing location information.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.stedfestingVertikalnivaa] - The resource binding for vertical level.
 * @param {string} [component.resourceBindings.stedfestingVertikalnivaa.title] - The title for the vertical level field.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderStedfestingVertikalnivaa(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.stedfestingVertikalnivaa?.title
        },
        resourceValues: {
            data: data?.stedfesting?.vertikalnivaa?.kodebeskrivelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom header element for "varighet" (duration) with the specified size.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @param {string} [size="h2"] - The header size (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The created custom header element.
 */
export function renderVarighetHeader(component, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceBindings: {
            title: component.resourceBindings?.varighetHeader?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders the desired duration section for a component based on its data.
 *
 * If the component indicates a permanent dispensation is desired, renders a custom paragraph text element.
 * If a specific desired duration is provided, renders a custom field data element with date formatting.
 * Returns null if neither condition is met.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values associated with the component.
 * @param {Object} component.resourceValues.data - The data object containing duration information.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @returns {HTMLElement|null} The rendered custom element wrapped in a container, or null if no data is available.
 */
export function renderOensketVarighet(component) {
    const data = component?.resourceValues?.data;
    if (data?.varighet?.oenskesVarigDispensasjon) {
        const htmlAttributes = new CustomElementHtmlAttributes({
            isChildComponent: true,
            resourceBindings: {
                title: component.resourceBindings?.varighetOenskesVarigDispensasjon?.trueText
            }
        });
        return addContainerElement(createCustomElement("custom-paragraph-text", htmlAttributes));
    } else if (hasValue(data?.varighet?.oensketVarighetTil)) {
        const htmlAttributes = new CustomElementHtmlAttributes({
            isChildComponent: true,
            format: "date",
            resourceBindings: {
                title: component.resourceBindings?.varighetOensketVarighetTil?.title
            },
            resourceValues: {
                data: data?.varighet?.oensketVarighetTil
            }
        });
        return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
    } else {
        return null;
    }
}

/**
 * Renders a custom header text component for "begrunnelse" (justification) headers.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @param {string} [size="h2"] - The size of the header (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The custom header text element.
 */
export function renderBegrunnelseHeader(component, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceBindings: {
            title: component.resourceBindings?.begrunnelseHeader?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders the "Begrunnelse Hensyn Bak Bestemmelsen" custom field component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceValues.data] - The data object containing begrunnelse.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.begrunnelseHensynBakBestemmelsen] - The resource binding for the title.
 * @param {string} [component.resourceBindings.begrunnelseHensynBakBestemmelsen.title] - The title for the custom field.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderBegrunnelseHensynBakBestemmelsen(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.begrunnelseHensynBakBestemmelsen?.title
        },
        resourceValues: {
            data: data?.begrunnelse?.hensynBakBestemmelsen
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the "Begrunnelse Vurdering Hensyn Bak Bestemmelsen" custom field component.
 *
 * This function creates a custom element with specific HTML attributes based on the provided component's
 * resource values and bindings. It is intended to display the evaluation and reasoning behind a specific provision.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceValues.data] - The data object containing field values.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.begrunnelseVurderingHensynBakBestemmelsen] - The resource binding for the title.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderBegrunnelseVurderingHensynBakBestemmelsen(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.begrunnelseVurderingHensynBakBestemmelsen?.title
        },
        resourceValues: {
            data: data?.begrunnelse?.vurderingHensynBakBestemmelsen
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the "Begrunnelse Vurdering Hensyn Overordnet" custom field component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceValues.data] - The data object containing begrunnelse and vurderingHensynOverordnet.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.begrunnelseVurderingHensynOverordnet] - The resource binding for the title.
 * @param {string} [component.resourceBindings.begrunnelseVurderingHensynOverordnet.title] - The title for the custom field.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderBegrunnelseVurderingHensynOverordnet(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.begrunnelseVurderingHensynOverordnet?.title
        },
        resourceValues: {
            data: data?.begrunnelse?.vurderingHensynOverordnet
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the "Begrunnelse Fordeler" section as a custom list data element.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values associated with the component.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom list data element wrapped in a container.
 */
export function renderBegrunnelseFordeler(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.begrunnelseFordeler?.title
        },
        resourceValues: {
            data: data?.begrunnelse?.fordeler?.effekt
        }
    });
    return addContainerElement(createCustomElement("custom-list-data", htmlAttributes));
}

/**
 * Renders the "Begrunnelse Ulemper" section as a custom list data element.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values associated with the component.
 * @param {Object} component.resourceValues.data - The data object containing begrunnelse and ulemper.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom list data element wrapped in a container.
 */
export function renderBegrunnelseUlemper(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.begrunnelseUlemper?.title
        },
        resourceValues: {
            data: data?.begrunnelse?.ulemper?.effekt
        }
    });
    return addContainerElement(createCustomElement("custom-list-data", htmlAttributes));
}

/**
 * Renders a custom field data element for "begrunnelseSamletBegrunnelse".
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceValues.data] - The data object containing begrunnelse.
 * @param {Object} [component.resourceValues.data.begrunnelse] - The begrunnelse object.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.begrunnelseSamletBegrunnelse] - The resource binding for title.
 * @param {string} [component.resourceBindings.begrunnelseSamletBegrunnelse.title] - The title for the custom field.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderBegrunnelseSamletBegrunnelse(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.begrunnelseSamletBegrunnelse?.title
        },
        resourceValues: {
            data: data?.begrunnelse?.samletBegrunnelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom header for the "Generelle Vilkaar Norsk Svensk Dansk" section if the relevant condition is met.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {string} [size="h2"] - The header size to use (e.g., "h1", "h2", etc.).
 * @returns {React.ReactElement|null} The custom header element if the condition exists, otherwise null.
 */
export function renderGenerelleVilkaarNorskSvenskDanskHeader(component, size = "h2") {
    const data = component?.resourceValues?.data;
    const condition = data?.generelleVilkaar?.norskSvenskDansk;
    if (!condition) {
        return null;
    }
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceBindings: {
            title: component.resourceBindings?.generelleVilkaarNorskSvenskDansk?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom boolean text field for "Generelle Vilkaar" in Norwegian, Swedish, or Danish.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values associated with the component.
 * @param {Object} component.resourceValues.data - The data object containing "generelleVilkaar".
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @param {Object} component.resourceBindings.generelleVilkaarNorskSvenskDansk - Resource bindings for the boolean text.
 * @param {string} component.resourceBindings.generelleVilkaarNorskSvenskDansk.trueText - Text to display when the value is true.
 * @returns {HTMLElement} The rendered custom boolean text field wrapped in a container element.
 */
export function renderGenerelleVilkaarNorskSvenskDansk(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            trueText: component.resourceBindings?.generelleVilkaarNorskSvenskDansk?.trueText,
            falseText: "",
            defaultText: ""
        },
        resourceValues: {
            data: data?.generelleVilkaar?.norskSvenskDansk
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}
