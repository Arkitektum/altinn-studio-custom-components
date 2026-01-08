// Base components
import customDescriptionList from "./base-components/custom-description-list/index.js";
import customDivider from "./base-components/custom-divider/index.js";
import customFeedback from "./base-components/custom-feedback/index.js";
import customField from "./base-components/custom-field/index.js";
import customHeader from "./base-components/custom-header/index.js";
import customList from "./base-components/custom-list/index.js";
import customParagraph from "./base-components/custom-paragraph/index.js";
import customSummation from "./base-components/custom-summation/index.js";
import customTable from "./base-components/custom-table/index.js";

// Data components
import customDescriptionListData from "./data-components/custom-description-list-data/index.js";
import customFeedbackData from "./data-components/custom-feedback-data/index.js";
import customFeedbacklistData from "./data-components/custom-feedbacklist-data/index.js";
import customFeedbacklistValidationMessages from "./data-components/custom-feedbacklist-validation-messages/index.js";
import customFieldAdresse from "./data-components/custom-field-adresse/index.js";
import customFieldPartNavn from "./data-components/custom-field-part-navn/index.js";
import customFieldBooleanData from "./data-components/custom-field-boolean-data/index.js";
import customFieldBooleanText from "./data-components/custom-field-boolean-text/index.js";
import customFieldCountData from "./data-components/custom-field-count-data/index.js";
import customFieldData from "./data-components/custom-field-data/index.js";
import customFieldListData from "./data-components/custom-field-list-data/index.js";
import customFieldKode from "./data-components/custom-field-kode/index.js";
import customFieldKommunensSaksnummer from "./data-components/custom-field-kommunens-saksnummer/index.js";
import customFieldProsjekt from "./data-components/custom-field-prosjekt/index.js";
import customFieldTelefonnummer from "./data-components/custom-field-telefonnummer/index.js";
import customFieldUtfallSvarStatus from "./data-components/custom-field-utfall-svar-status/index.js";
import customGrouplistAnsvarsomraadeType from "./data-components/custom-grouplist-ansvarsomraade-type/index.js";
import customGrouplistEttersending from "./data-components/custom-grouplist-ettersending/index.js";
import customGrouplistNaboGjenboerEiendom from "./data-components/custom-grouplist-nabo-gjenboer-eiendom/index.js";
import customGrouplistSjekklistekrav from "./data-components/custom-grouplist-sjekklistekrav/index.js";
import customGrouplistUtfallSvar from "./data-components/custom-grouplist-utfall-svar-type/custom-group-utfall-svar-type/custom-grouplist-utfall-svar/index.js";
import customGrouplistUtfallSvarType from "./data-components/custom-grouplist-utfall-svar-type/index.js";
import customGroupAdkomst from "./data-components/custom-group-adkomst/index.js";
import customGroupAvloep from "./data-components/custom-group-avloep/index.js";
import customGroupEttersending from "./data-components/custom-grouplist-ettersending/custom-group-ettersending/index.js";
import customGroupLoefteinnretninger from "./data-components/custom-group-loefteinnretninger/index.js";
import customGroupNaboGjenboerEiendom from "./data-components/custom-grouplist-nabo-gjenboer-eiendom/custom-group-nabo-gjenboer-eiendom/index.js";
import customGroupOvervann from "./data-components/custom-group-overvann/index.js";
import customGroupRammebetingelserTilknytninger from "./data-components/custom-group-rammebetingelser-tilknytninger/index.js";
import customGroupSjekklistekrav from "./data-components/custom-grouplist-sjekklistekrav/custom-group-sjekklistekrav/index.js";
import customGroupUtfallSvar from "./data-components/custom-grouplist-utfall-svar-type/custom-group-utfall-svar-type/custom-grouplist-utfall-svar/custom-group-utfall-svar/index.js";
import customGroupUtfallSvarType from "./data-components/custom-grouplist-utfall-svar-type/custom-group-utfall-svar-type/index.js";
import customGroupVannforsyning from "./data-components/custom-group-vannforsyning/index.js";
import customHeaderText from "./data-components/custom-header-text/index.js";
import customHeaderTextData from "./data-components/custom-header-text-data/index.js";
import customListData from "./data-components/custom-list-data/index.js";
import customListPlanlagteLoefteinnretninger from "./data-components/custom-list-planlagte-loefteinnretninger/index.js";
import customListVedlegg from "./data-components/custom-list-vedlegg/index.js";
import customParagraphText from "./data-components/custom-paragraph-text/index.js";
import customSubheaderText from "./data-components/custom-subheader-text/index.js";
import customSummationArealdisponering from "./data-components/custom-summation-arealdisponering/index.js";
import customSummationData from "./data-components/custom-summation-data/index.js";
import customTableAnsvarsomraade from "./data-components/custom-table-ansvarsomraade/index.js";
import customTableArbeidsplasser from "./data-components/custom-table-arbeidsplasser/index.js";
import customTableData from "./data-components/custom-table-data/index.js";
import customTableEiendom from "./data-components/custom-table-eiendom/index.js";
import customTableNaboGjenboerEiendom from "./data-components/custom-table-nabo-gjenboer-eiendom/index.js";
import customTableOmraaderisiko from "./data-components/custom-table-omraaderisiko/index.js";
import customTablePart from "./data-components/custom-table-part/index.js";
import customTablePlan from "./data-components/custom-table-plan/index.js";

// Layout components
import dispensasjon from "./layout-components/dispensasjon/index.js";
import gjennomfoeringsplan from "./layout-components/gjennomfoeringsplan/index.js";
import gjenpartNabovarsel from "./layout-components/gjenpart-nabovarsel/index.js";

// Global functions
import initCustomComponents from "../functions/init.js";

// Stylesheet
import "../styles/main.css" with { type: "css" };

initCustomComponents();

export {
    customDescriptionList,
    customDivider,
    customFeedback,
    customField,
    customHeader,
    customList,
    customParagraph,
    customTable,
    customDescriptionListData,
    customFeedbackData,
    customFeedbacklistData,
    customFeedbacklistValidationMessages,
    customFieldAdresse,
    customFieldPartNavn,
    customFieldBooleanData,
    customFieldBooleanText,
    customFieldCountData,
    customFieldData,
    customFieldListData,
    customFieldKode,
    customFieldKommunensSaksnummer,
    customFieldProsjekt,
    customFieldTelefonnummer,
    customFieldUtfallSvarStatus,
    customGrouplistAnsvarsomraadeType,
    customGrouplistEttersending,
    customGrouplistNaboGjenboerEiendom,
    customGrouplistSjekklistekrav,
    customGrouplistUtfallSvar,
    customGrouplistUtfallSvarType,
    customGroupAdkomst,
    customGroupAvloep,
    customGroupEttersending,
    customGroupLoefteinnretninger,
    customGroupNaboGjenboerEiendom,
    customGroupOvervann,
    customGroupRammebetingelserTilknytninger,
    customGroupSjekklistekrav,
    customGroupUtfallSvar,
    customGroupUtfallSvarType,
    customGroupVannforsyning,
    customHeaderText,
    customHeaderTextData,
    customListData,
    customListPlanlagteLoefteinnretninger,
    customListVedlegg,
    customParagraphText,
    customSubheaderText,
    customSummation,
    customSummationArealdisponering,
    customSummationData,
    customTableAnsvarsomraade,
    customTableArbeidsplasser,
    customTableData,
    customTableEiendom,
    customTableNaboGjenboerEiendom,
    customTableOmraaderisiko,
    customTablePart,
    customTablePlan,
    dispensasjon,
    gjennomfoeringsplan,
    gjenpartNabovarsel
};
