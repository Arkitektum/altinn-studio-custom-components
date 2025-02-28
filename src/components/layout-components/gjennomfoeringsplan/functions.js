import Gjennomfoeringsplan from "../../../classes/layout-classes/Gjennomfoeringsplan.js";
import { createCustomElement, hasValue } from "../../../functions/helpers.js";

export function getGjennomfoeringsplanData(component) {
    const formData = JSON.parse(component.getAttribute("formdata"));
    return new Gjennomfoeringsplan({
        eiendomByggested: hasValue(formData?.eiendomByggested) ? formData.eiendomByggested : null,
        kommunensSaksnummer: hasValue(formData?.kommunensSaksnummer) ? formData.kommunensSaksnummer : null,
        metadata: hasValue(formData?.metadata) ? formData.metadata : null,
        versjon: formData?.versjon ? formData.versjon : null
    });
}

function getTextResourceFromResourceBinding(textResources, resourceBinding) {
    return textResources?.resources?.find((resource) => resource.id === resourceBinding)?.value;
}

function getTextResourcesFromResourceBindings(textResources, resourceBindings) {
    const texts = {};
    for (const key in resourceBindings) {
        texts[key] = getTextResourceFromResourceBinding(textResources, resourceBindings[key]);
    }
    return texts;
}

function getEiendomTableTexts(textResources) {
    const textResourceBindings = {
        title: "resource.eiendomByggested.eiendom.title",
        "col-1": "resource.eiendomByggested.eiendom.adresse.title",
        "col-2": "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.gaardsnummer.title",
        "col-3": "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.bruksnummer.title",
        "col-4": "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.seksjonsnummer.title",
        "col-5": "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.festenummer.title",
        "col-6": "resource.eiendomByggested.eiendom.bolignummer.title",
        "col-7": "resource.eiendomByggested.eiendom.bygningsnummer.title"
    };
    return getTextResourcesFromResourceBindings(textResources, textResourceBindings);
}

export function renderGjenomfoeringsplanNummer(gjennomfoeringsplan, textResources) {
    return createCustomElement("custom-field-data", {
        formData: { simpleBinding: gjennomfoeringsplan?.versjon },
        text: getTextResourceFromResourceBinding(textResources, "resource.metadata.gjennomfoeringsplanNummer.title"),
        emptyFieldText: "(gjennomfoeringsplanNummer mangler)"
    });
}

export function renderEiendomTable(eiendom, textResources) {
    return createCustomElement("custom-table-data", {
        formData: { data: eiendom },
        text: "Eiendom/Byggested",
        hideIfEmpty: true,
        size: "h3",
        tableColumns: [
            {
                titleResourceKey: "col-1",
                dataKey: "adresse",
                tagName: "custom-field-adresse",
                props: {
                    emptyFieldText: "(adresse mangler)",
                    styleOverride: {}
                }
            },
            {
                titleResourceKey: "col-2",
                dataKey: "eiendomsidentifikasjon.gaardsnummer",
                tagName: "custom-field-data",
                props: {
                    emptyFieldText: "-",
                    styleOverride: {
                        width: "85px"
                    }
                }
            },
            {
                titleResourceKey: "col-3",
                dataKey: "eiendomsidentifikasjon.bruksnummer",
                tagName: "custom-field-data",
                props: {
                    emptyFieldText: "-",
                    styleOverride: {
                        width: "85px"
                    }
                }
            },
            {
                titleResourceKey: "col-4",
                dataKey: "eiendomsidentifikasjon.seksjonsnummer",
                tagName: "custom-field-data",
                props: {
                    emptyFieldText: "-",
                    styleOverride: {
                        width: "96px"
                    }
                }
            },
            {
                titleResourceKey: "col-5",
                dataKey: "eiendomsidentifikasjon.festenummer",
                tagName: "custom-field-data",
                props: {
                    emptyFieldText: "-",
                    styleOverride: {
                        width: "85px"
                    }
                }
            },
            {
                titleResourceKey: "col-6",
                dataKey: "bolignummer",
                tagName: "custom-field-data",
                props: {
                    emptyFieldText: "-",
                    styleOverride: {
                        width: "120px"
                    }
                }
            },
            {
                titleResourceKey: "col-7",
                dataKey: "bygningsnummer",
                tagName: "custom-field-data",
                props: {
                    emptyFieldText: "-",
                    styleOverride: {
                        width: "96px"
                    }
                }
            }
        ],
        texts: getEiendomTableTexts(textResources),
        styleOverride: {
            tableLayout: "fixed"
        }
    });
}

export function renderFeedbackListElement(validationMessages) {
    const feedbackListElement = createCustomElement("custom-feedbacklist-validation-messages", {
        formData: { data: validationMessages }
    });
    return feedbackListElement;
}
