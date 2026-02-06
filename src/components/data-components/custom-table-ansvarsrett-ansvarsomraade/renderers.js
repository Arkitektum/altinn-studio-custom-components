// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom table for "Ansvarsrett Ansvarsomraade" with specified columns and attributes.
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceBindings] - Resource bindings for table columns and title.
 * @param {Object} [component.resourceValues] - Resource values for the table.
 * @param {string} [component.size] - The size of the table.
 * @returns {HTMLElement} The rendered custom table element.
 */
export function renderAnsvarsrettAnsvarsomraadeTable(component) {
    const funksjonListe = setFunksjonListe(component);
    const titleFaseSamsvarKontroll = setErklaeringTitle(component, funksjonListe);

    const tableColumns = [
        {
            dataKey: "funksjon.kodeverdi",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.funksjon?.title,
                emptyFieldText: component?.resourceBindings?.funksjon?.emptyFieldText
            }
        },
        {
            dataKey: "beskrivelseAvAnsvarsomraadet",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.beskrivelseAvAnsvarsomraadet?.title,
                emptyFieldText: component?.resourceBindings?.beskrivelseAvAnsvarsomraadet?.emptyFieldText
            }
        },
        {
            dataKey: "tiltaksklasse.kodebeskrivelse",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.tiltaksklasse?.title,
                emptyFieldText: component?.resourceBindings?.tiltaksklasse?.emptyFieldText
            }
        },
        ...(funksjonListe.includes("PRO") || funksjonListe.includes("UTF") || funksjonListe.includes("KONTROLL")
            ? [
                  {
                      dataKey: "faseSamsvarKontrollList.resourceValues.data",
                      tagName: "custom-list-data",
                      hideTitle: true,
                      resourceBindings: {
                          title: titleFaseSamsvarKontroll,
                          emptyFieldText: component?.resourceBindings?.faseSamsvarKontroll?.emptyFieldText
                      },
                      styleOverride: {
                          listStyle: "none",
                          paddingInline: "0"
                      }
                  }
              ]
            : []),
        ...(component?.resourceValues?.simpleBinding == "true" || component?.resourceValues?.simpleBinding === true
            ? [
                  {
                      dataKey: "dekkesOmraadeAvSentralGodkjenning",
                      tagName: "custom-field-boolean-text",
                      hideTitle: true,
                      resourceBindings: {
                          title: component?.resourceBindings?.dekkesOmraadeAvSentralGodkjenning?.title,
                          trueText: component?.resourceBindings?.dekkesOmraadeAvSentralGodkjenning?.trueText,
                          falseText: component?.resourceBindings?.dekkesOmraadeAvSentralGodkjenning?.falseText,
                          defaultText: component?.resourceBindings?.dekkesOmraadeAvSentralGodkjenning?.defaultText
                      }
                  }
              ]
            : [])
    ];

    const htmlAttributes = new CustomElementHtmlAttributes({
        size: component?.size,
        hideIfEmpty: true,
        hideTitle: false,
        isChildComponent: true,
        resourceValues: component?.resourceValues,
        resourceBindings: {
            title:
                component.resourceValues.data.length == 1
                    ? component?.resourceBindings?.ansvarsomraader?.titleSingle
                    : component?.resourceBindings?.ansvarsomraader?.titlePlural,
            emptyFieldText: component?.resourceBindings?.ansvarsomraader?.emptyFieldText
        },
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}

function setErklaeringTitle(component, funksjonListe) {
    let titleFaseSamsvarKontroll = component?.resourceBindings?.faseSamsvarKontroll?.emptyFieldText;

    const hasKontroll = funksjonListe.includes("KONTROLL");
    const hasPro = funksjonListe.includes("PRO");
    const hasUtf = funksjonListe.includes("UTF");

    const onlyKontroll = hasKontroll && !hasPro && !hasUtf;

    const onlyProUtf = !hasKontroll && (hasPro || hasUtf);

    const mixKontrollProUtf = hasKontroll && (hasPro || hasUtf);

    if (onlyKontroll) {
        titleFaseSamsvarKontroll = component?.resourceBindings?.faseSamsvarKontroll?.titleKontroll;
    } else if (onlyProUtf) {
        titleFaseSamsvarKontroll = component?.resourceBindings?.faseSamsvarKontroll?.titleProUtf;
    } else if (mixKontrollProUtf) {
        titleFaseSamsvarKontroll = component?.resourceBindings?.faseSamsvarKontroll?.titleMix;
    }
    return titleFaseSamsvarKontroll;
}

function setFunksjonListe(component) {
    const funksjonListe = [];

    component?.resourceValues?.data?.forEach((element) => {
        funksjonListe.push(element?.funksjon?.kodeverdi.toUpperCase());
    });
    console.log("funksjonListe: ", funksjonListe);
    return funksjonListe;
}
