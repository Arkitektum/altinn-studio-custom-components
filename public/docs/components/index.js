// Field
import customFieldAdresse from "./field/custom-field-adresse.js";
import customFieldBooleanData from "./field/custom-field-boolean-data.js";
import customFieldBooleanText from "./field/custom-field-boolean-text.js";
import customFieldCountData from "./field/custom-field-count-data.js";
import customFieldData from "./field/custom-field-data.js";
import customFieldKode from "./field/custom-field-kode.js";
import customFieldKommunensSaksnummer from "./field/custom-field-kommunens-saksnummer.js";
import customFieldPartNavn from "./field/custom-field-part-navn.js";
import customFieldProsjekt from "./field/custom-field-prosjekt.js";
import customFieldTelefonnummer from "./field/custom-field-telefonnummer.js";
import customFieldUtfallSvarStatus from "./field/custom-field-utfall-svar-status.js";

// Typography
import customHeaderText from "./typography/custom-header-text.js";
import customSubheaderText from "./typography/custom-subheader-text.js";
import customParagraphText from "./typography/custom-paragraph-text.js";

// List
import customListData from "./list/custom-list-data.js";
import customListPlanlagteLoefteinnretninger from "./list/custom-list-planlagte-loefteinnretninger.js";
import customListVedlegg from "./list/custom-list-vedlegg.js";

// Description list
import customDescriptionListData from "./description-list/custom-description-list-data.js";

// Table
import customTableAnsvarsomraade from "./table/custom-table-ansvarsomraade.js";
import customTableArbeidsplasser from "./table/custom-table-arbeidsplasser.js";
import customTableData from "./table/custom-table-data.js";
import customTableEiendom from "./table/custom-table-eiendom.js";
import customTableNaboGjenboerEiendom from "./table/custom-table-nabo-gjenboer-eiendom.js";
import customTableOmraaderisiko from "./table/custom-table-omraaderisiko.js";
import customTablePart from "./table/custom-table-part.js";
import customTablePlan from "./table/custom-table-plan.js";

// Summation
import customSummationArealdisponering from "./summation/custom-summation-arealdisponering.js";
import customSummationData from "./summation/custom-summation-data.js";

// Group
import customGroupAdkomst from "./group/custom-group-adkomst.js";
import customGroupAvloep from "./group/custom-group-avloep.js";

// Grouplist
import customGrouplistAnsvarsomraadeType from "./grouplist/custom-grouplist-ansvarsomraade-type.js";
import customGrouplistEttersending from "./grouplist/custom-grouplist-ettersending.js";
import customGrouplistNaboGjenboerEiendom from "./grouplist/custom-grouplist-nabo-gjenboer-eiendom.js";
import customGrouplistSjekklistekrav from "./grouplist/custom-grouplist-sjekklistekrav.js";
import customGrouplistUtfallSvarType from "./grouplist/custom-grouplist-utfall-svar-type.js";
import customGrouplistUtfallSvar from "./grouplist/custom-grouplist-utfall-svar.js";

// Layout
import customDispensasjon from "./layout/custom-dispensasjon.js";
import customGjennomfoeringsplan from "./layout/custom-gjennomfoeringsplan.js";
import customGjenpartNabovarsel from "./layout/custom-gjenpart-nabovarsel.js";

export const field = {
    customFieldAdresse,
    customFieldBooleanData,
    customFieldBooleanText,
    customFieldCountData,
    customFieldData,
    customFieldKode,
    customFieldKommunensSaksnummer,
    customFieldPartNavn,
    customFieldProsjekt,
    customFieldTelefonnummer,
    customFieldUtfallSvarStatus
};

export const typography = {
    customHeaderText,
    customSubheaderText,
    customParagraphText
};

export const list = { customListData, customListPlanlagteLoefteinnretninger, customListVedlegg };

export const descriptionList = { customDescriptionListData };

export const table = {
    customTableAnsvarsomraade,
    customTableArbeidsplasser,
    customTableData,
    customTableEiendom,
    customTableNaboGjenboerEiendom,
    customTableOmraaderisiko,
    customTablePart,
    customTablePlan
};

export const summation = { customSummationArealdisponering, customSummationData };

export const group = { customGroupAdkomst, customGroupAvloep };

export const grouplist = {
    customGrouplistAnsvarsomraadeType,
    customGrouplistEttersending,
    customGrouplistNaboGjenboerEiendom,
    customGrouplistSjekklistekrav,
    customGrouplistUtfallSvarType,
    customGrouplistUtfallSvar
};

export const layout = { customDispensasjon, customGjennomfoeringsplan, customGjenpartNabovarsel };

export default {
    typography,
    field,
    list,
    descriptionList,
    table,
    summation,
    group,
    grouplist,
    layout
};
