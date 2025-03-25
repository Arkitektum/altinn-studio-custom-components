import customDivider from "./base-components/custom-divider/index.js";
import customFeedback from "./base-components/custom-feedback/index.js";
import customField from "./base-components/custom-field/index.js";
import customHeader from "./base-components/custom-header/index.js";
import customList from "./base-components/custom-list/index.js";
import customParagraph from "./base-components/custom-paragraph/index.js";
import customTable from "./base-components/custom-table/index.js";
import customFeedbackData from "./data-components/custom-feedback-data/index.js";
import customFeedbacklistData from "./data-components/custom-feedbacklist-data/index.js";
import customFeedbacklistValidationMessages from "./data-components/custom-feedbacklist-validation-messages/index.js";
import customFieldAdresse from "./data-components/custom-field-adresse/index.js";
import customFieldPartNavn from "./data-components/custom-field-part-navn/index.js";
import customFieldBooleanText from "./data-components/custom-field-boolean-text/index.js";
import customFieldData from "./data-components/custom-field-data/index.js";
import customFieldKommunensSaksnummer from "./data-components/custom-field-kommunens-saksnummer/index.js";
import customFieldProsjekt from "./data-components/custom-field-prosjekt/index.js";
import customFieldTelefonnummer from "./data-components/custom-field-telefonnummer/index.js";
import customFieldUtfallSvarStatus from "./data-components/custom-field-utfall-svar-status/index.js";
import customGrouplistUtfallSvarType from "./data-components/custom-grouplist-utfall-svar-type/index.js";
import customGroupUtfallSvarType from "./data-components/custom-grouplist-utfall-svar-type/custom-group-utfall-svar-type/index.js";
import customGrouplistUtfallSvar from "./data-components/custom-grouplist-utfall-svar-type/custom-group-utfall-svar-type/custom-grouplist-utfall-svar/index.js";
import customGroupUtfallSvar from "./data-components/custom-grouplist-utfall-svar-type/custom-group-utfall-svar-type/custom-grouplist-utfall-svar/custom-group-utfall-svar/index.js";
import customHeaderText from "./data-components/custom-header-text/index.js";
import customListData from "./data-components/custom-list-data/index.js";
import customListVedlegg from "./data-components/custom-list-vedlegg/index.js";
import customParagraphText from "./data-components/custom-paragraph-text/index.js";
import customSubheaderText from "./data-components/custom-subheader-text/index.js";
import customTableData from "./data-components/custom-table-data/index.js";

import dispensasjon from "./layout-components/dispensasjon/index.js";
import gjennomfoeringsplan from "./layout-components/gjennomfoeringsplan/index.js";

import "../styles/main.css" with { type: "css" };

import initCustomComponents from "../functions/init.js";
initCustomComponents();

export {
    customDivider,
    customFeedback,
    customField,
    customHeader,
    customList,
    customParagraph,
    customTable,
    customFeedbackData,
    customFeedbacklistData,
    customFeedbacklistValidationMessages,
    customFieldAdresse,
    customFieldPartNavn,
    customFieldBooleanText,
    customFieldData,
    customFieldKommunensSaksnummer,
    customFieldProsjekt,
    customFieldTelefonnummer,
    customFieldUtfallSvarStatus,
    customGrouplistUtfallSvarType,
    customGroupUtfallSvarType,
    customGrouplistUtfallSvar,
    customGroupUtfallSvar,
    customHeaderText,
    customListData,
    customListVedlegg,
    customParagraphText,
    customSubheaderText,
    customTableData,
    dispensasjon,
    gjennomfoeringsplan
};
