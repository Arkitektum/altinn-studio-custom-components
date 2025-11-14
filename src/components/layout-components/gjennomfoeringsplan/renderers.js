// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom header element for the "gjennomfoeringsplan" component.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @param {string} [size="h1"] - The header size (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The custom header element.
 */
export function renderGjennomfoeringsplanHeader(component, size = "h1") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: size,
        resourceBindings: {
            title: component.resourceBindings?.gjennomfoeringsplan?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a subheader for the "Gjennomføringsplan" component.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @param {Object} [component.resourceBindings] - Optional resource bindings for the component.
 * @param {Object} [component.resourceBindings.gjennomfoeringsplan] - Resource bindings specific to "gjennomfoeringsplan".
 * @param {string} [component.resourceBindings.gjennomfoeringsplan.description] - The description to be used as the title.
 * @returns {HTMLElement} The rendered custom paragraph text element wrapped in a container.
 */
export function renderGjennomfoeringsplanSubHeader(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceBindings: {
            title: component.resourceBindings?.gjennomfoeringsplan?.description
        }
    });
    return addContainerElement(createCustomElement("custom-paragraph-text", htmlAttributes));
}

/**
 * Renders a custom header element for the "Planen Gjelder" section.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @param {string} [size="h2"] - The header size (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The custom header element.
 */
export function renderPlanenGjelderHeader(component, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: size,
        resourceBindings: {
            title: component.resourceBindings?.planenGjelder?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders the "Versjon" (Version) field for a given component.
 *
 * This function extracts the version data from the provided component,
 * constructs the necessary HTML attributes, and returns a container element
 * with a custom field displaying the version information.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing the version.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.versjon] - The version resource binding.
 * @param {string} [component.resourceBindings.versjon.title] - The title for the version field.
 * @returns {React.ReactNode} A container element with the rendered version field.
 */
export function renderVersjon(component) {
    const data = component?.resourceValues?.data;
    const grid = { xs: 6 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        grid,
        resourceBindings: {
            title: component.resourceBindings?.versjon?.title
        },
        resourceValues: {
            data: data?.versjon
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes), grid);
}

/**
 * Renders the "Kommunens Saksnummer" custom field component.
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceValues.data] - The data values for the component.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.kommunensSaksnummer] - The resource binding for "kommunensSaksnummer".
 * @param {string} [component.resourceBindings.kommunensSaksnummer.title] - The title for the "kommunensSaksnummer" field.
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
 * @returns {React.ReactElement} The rendered custom field data element wrapped in a container.
 */
export function renderMetadataProsjektnavn(component) {
    const data = component?.resourceValues?.data;
    const grid = { xs: 6 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        grid,
        resourceBindings: {
            title: component.resourceBindings?.metadataProsjektnavn?.title
        },
        resourceValues: {
            data: data?.metadata?.prosjektnavn
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes), grid);
}

/**
 * Renders a custom field data element for the metadata FTB ID of a component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values associated with the component.
 * @param {Object} component.resourceValues.data - The data object containing metadata.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @param {Object} component.resourceBindings.metadataFtbId - The metadata FTB ID bindings.
 * @param {string} component.resourceBindings.metadataFtbId.title - The title for the metadata FTB ID.
 * @returns {React.ReactNode} The rendered custom field data element wrapped in a container.
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
 * Renders a custom table element for displaying property (eiendom) and building location (byggested) information.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing eiendomByggested information.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.eiendomByggested] - The resource bindings specific to eiendomByggested.
 * @param {string} [component.resourceBindings.eiendomByggested.title] - The title binding for the eiendomByggested.
 * @returns {HTMLElement} The custom table element for displaying property and building location data.
 */
export function renderEiendomByggested(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        size: "h3",
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
 * Renders the "Ansvarlig Søker" (Responsible Applicant) component as a custom table part.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceValues.data] - The data object containing "ansvarligSoeker".
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.ansvarligSoeker] - The bindings specific to "ansvarligSoeker".
 * @param {string} [component.resourceBindings.ansvarligSoeker.title] - The title for the "ansvarligSoeker" part.
 * @returns {HTMLElement} The custom element representing the "ansvarligSoeker" table part.
 */
export function renderAnsvarligSoeker(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        size: "h3",
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
 * Renders a custom element for displaying "ansvarsomraade" (area of responsibility) in a table format.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing gjennomfoeringsplan and ansvarsomraade.
 * @param {Object} [component.resourceBindings] - The resource bindings for various fields.
 * @param {Object} [component.resourceBindings.ansvarsfordeling] - The ansvarsfordeling resource binding.
 * @param {string} [component.resourceBindings.ansvarsfordeling.title] - The title for the ansvarsfordeling.
 * @param {string} [component.resourceBindings.tiltaksklasse] - The tiltaksklasse resource binding.
 * @param {string} [component.resourceBindings.ansvarsomraade] - The ansvarsomraade resource binding.
 * @param {string} [component.resourceBindings.foretak] - The foretak resource binding.
 * @param {string} [component.resourceBindings.planlagteSamsvarKontrollErklaeringer] - The planlagteSamsvarKontrollErklaeringer resource binding.
 * @param {string} [component.resourceBindings.ansvarsomraadeStatus] - The ansvarsomraadeStatus resource binding.
 * @param {string} [component.resourceBindings.samsvarKontrollPlanlagtVedRammetillatelse] - The samsvarKontrollPlanlagtVedRammetillatelse resource binding.
 * @param {string} [component.resourceBindings.samsvarKontrollPlanlagtVedIgangsettingstillatelse] - The samsvarKontrollPlanlagtVedIgangsettingstillatelse resource binding.
 * @param {string} [component.resourceBindings.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse] - The samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse resource binding.
 * @param {string} [component.resourceBindings.samsvarKontrollPlanlagtVedFerdigattest] - The samsvarKontrollPlanlagtVedFerdigattest resource binding.
 * @returns {HTMLElement} The custom element representing the ansvarsomraade table.
 */
export function renderAnsvarsomraade(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        size: "h3",
        resourceBindings: {
            title: component.resourceBindings?.ansvarsfordeling?.title,
            tiltaksklasse: component.resourceBindings?.tiltaksklasse,
            ansvarsomraade: component.resourceBindings?.ansvarsomraade,
            foretak: component.resourceBindings?.foretak,
            planlagteSamsvarKontrollErklaeringer: component.resourceBindings?.planlagteSamsvarKontrollErklaeringer,
            ansvarsomraadeStatus: component.resourceBindings?.ansvarsomraadeStatus,
            samsvarKontrollPlanlagtVedRammetillatelse: component.resourceBindings?.samsvarKontrollPlanlagtVedRammetillatelse,
            samsvarKontrollPlanlagtVedIgangsettingstillatelse: component.resourceBindings?.samsvarKontrollPlanlagtVedIgangsettingstillatelse,
            samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse: component.resourceBindings?.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse,
            samsvarKontrollPlanlagtVedFerdigattest: component.resourceBindings?.samsvarKontrollPlanlagtVedFerdigattest
        },
        resourceValues: {
            data: data?.gjennomfoeringsplan?.ansvarsomraade
        }
    });
    return createCustomElement("custom-grouplist-ansvarsomraade-type", htmlAttributes);
}
