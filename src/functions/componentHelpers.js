// Classes
import CustomDispensasjon from "../classes/system-classes/component-classes/CustomDispensasjon.js";
import CustomFeedback from "../classes/system-classes/component-classes/CustomFeedback.js";
import CustomFeedbackData from "../classes/system-classes/component-classes/CustomFeedbackData.js";
import CustomFeedbacklistData from "../classes/system-classes/component-classes/CustomFeedbacklistData.js";
import CustomFeedbacklistValidationMessages from "../classes/system-classes/component-classes/CustomFeedbacklistValidationMessages.js";
import CustomField from "../classes/system-classes/component-classes/CustomField.js";
import CustomFieldAdresse from "../classes/system-classes/component-classes/CustomFieldAdresse.js";
import CustomFieldBooleanData from "../classes/system-classes/component-classes/CustomFieldBooleanData.js";
import CustomFieldBooleanText from "../classes/system-classes/component-classes/CustomFieldBooleanText.js";
import CustomFieldCountData from "../classes/system-classes/component-classes/CustomFieldCountData.js";
import CustomFieldData from "../classes/system-classes/component-classes/CustomFieldData.js";
import CustomFieldKommunensSaksnummer from "../classes/system-classes/component-classes/CustomFieldKommunensSaksnummer.js";
import CustomFieldListData from "../classes/system-classes/component-classes/CustomFieldListData.js";
import CustomFieldPartNavn from "../classes/system-classes/component-classes/CustomFieldPartNavn.js";
import CustomFieldProsjekt from "../classes/system-classes/component-classes/CustomFieldProsjekt.js";
import CustomFieldTelefonnummer from "../classes/system-classes/component-classes/CustomFieldTelefonnummer.js";
import CustomFieldUtfallSvarStatus from "../classes/system-classes/component-classes/CustomFieldUtfallSvarStatus.js";
import CustomGrouplistEttersending from "../classes/system-classes/component-classes/CustomGrouplistEttersending.js";
import CustomGrouplistUtfallSvar from "../classes/system-classes/component-classes/CustomGrouplistUtfallSvar.js";
import CustomGrouplistUtfallSvarType from "../classes/system-classes/component-classes/CustomGrouplistUtfallSvarType.js";
import CustomGroupUtfallSvar from "../classes/system-classes/component-classes/CustomGroupUtfallSvar.js";
import CustomGroupUtfallSvarType from "../classes/system-classes/component-classes/CustomGroupUtfallSvarType.js";
import CustomHeader from "../classes/system-classes/component-classes/CustomHeader.js";
import CustomHeaderText from "../classes/system-classes/component-classes/CustomHeaderText.js";
import CustomList from "../classes/system-classes/component-classes/CustomList.js";
import CustomListData from "../classes/system-classes/component-classes/CustomListData.js";
import CustomListVedlegg from "../classes/system-classes/component-classes/CustomListVedlegg.js";
import CustomParagraph from "../classes/system-classes/component-classes/CustomParagraph.js";
import CustomParagraphText from "../classes/system-classes/component-classes/CustomParagraphText.js";
import CustomParagraphTextData from "../classes/system-classes/component-classes/CustomParagraphTextData.js";
import CustomSubHeaderText from "../classes/system-classes/component-classes/CustomSubheaderText.js";
import CustomTable from "../classes/system-classes/component-classes/CustomTable.js";
import CustomTableData from "../classes/system-classes/component-classes/CustomTableData.js";
import CustomTableEiendom from "../classes/system-classes/component-classes/CustomTableEiendom.js";
import CustomTablePart from "../classes/system-classes/component-classes/CustomTablePart.js";
import CustomComponent from "../classes/system-classes/CustomComponent.js";

// Global functions
import { getPropsFromElementAttributes } from "./htmlElementHelpers.js";

export function instantiateComponent(element) {
    const component = element instanceof HTMLElement ? getPropsFromElementAttributes(element) : element;
    const tagName = component?.tagName || component?.getAttribute("tagname") || "custom-component";
    switch (tagName?.toLowerCase()) {
        case "custom-component":
            return new CustomComponent(component);
        case "custom-dispensasjon":
            return new CustomDispensasjon(component);
        case "custom-feedback":
            return new CustomFeedback(component);
        case "custom-feedback-data":
            return new CustomFeedbackData(component);
        case "custom-feedbacklist-data":
            return new CustomFeedbacklistData(component);
        case "custom-feedbacklist-validation-messages":
            return new CustomFeedbacklistValidationMessages(component);
        case "custom-field":
            return new CustomField(component);
        case "custom-field-adresse":
            return new CustomFieldAdresse(component);
        case "custom-field-boolean-data":
            return new CustomFieldBooleanData(component);
        case "custom-field-boolean-text":
            return new CustomFieldBooleanText(component);
        case "custom-field-count-data":
            return new CustomFieldCountData(component);
        case "custom-field-data":
            return new CustomFieldData(component);
        case "custom-field-list-data":
            return new CustomFieldListData(component);
        case "custom-field-kommunens-saksnummer":
            return new CustomFieldKommunensSaksnummer(component);
        case "custom-field-part-navn":
            return new CustomFieldPartNavn(component);
        case "custom-field-prosjekt":
            return new CustomFieldProsjekt(component);
        case "custom-field-telefonnummer":
            return new CustomFieldTelefonnummer(component);
        case "custom-field-utfall-svar-status":
            return new CustomFieldUtfallSvarStatus(component);
        case "custom-group-utfall-svar":
            return new CustomGroupUtfallSvar(component);
        case "custom-group-utfall-svar-type":
            return new CustomGroupUtfallSvarType(component);
        case "custom-grouplist-ettersending":
            return new CustomGrouplistEttersending(component);
        case "custom-grouplist-utfall-svar":
            return new CustomGrouplistUtfallSvar(component);
        case "custom-grouplist-utfall-svar-type":
            return new CustomGrouplistUtfallSvarType(component);
        case "custom-header":
            return new CustomHeader(component);
        case "custom-header-text":
            return new CustomHeaderText(component);
        case "custom-list":
            return new CustomList(component);
        case "custom-list-data":
            return new CustomListData(component);
        case "custom-list-vedlegg":
            return new CustomListVedlegg(component);
        case "custom-paragraph":
            return new CustomParagraph(component);
        case "custom-paragraph-text":
            return new CustomParagraphText(component);
        case "custom-paragraph-text-data":
            return new CustomParagraphTextData(component);
        case "custom-subheader-text":
            return new CustomSubHeaderText(component);
        case "custom-table":
            return new CustomTable(component);
        case "custom-table-data":
            return new CustomTableData(component);
        case "custom-table-eiendom":
            return new CustomTableEiendom(component);
        case "custom-table-part":
            return new CustomTablePart(component);
        default:
            console.warn(`Unknown component type: ${tagName}`);
            return null;
    }
}
