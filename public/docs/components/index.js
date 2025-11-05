// Field
import customFieldAdresse from "./custom-field/custom-field-adresse.js";
import customFieldBooleanData from "./custom-field/custom-field-boolean-data.js";
import customFieldBooleanText from "./custom-field/custom-field-boolean-text.js";
import customFieldCountData from "./custom-field/custom-field-count-data.js";
import customFieldData from "./custom-field/custom-field-data.js";
import customFieldKode from "./custom-field/custom-field-kode.js";
import customFieldKommunensSaksnummer from "./custom-field/custom-field-kommunens-saksnummer.js";
import customFieldPartNavn from "./custom-field/custom-field-part-navn.js";
import customFieldProsjekt from "./custom-field/custom-field-prosjekt.js";
import customFieldTelefonnummer from "./custom-field/custom-field-telefonnummer.js";
import customFieldUtfallSvarStatus from "./custom-field/custom-field-utfall-svar-status.js";

// Typography
import customHeaderText from "./custom-typography/custom-header-text.js";
import customSubheaderText from "./custom-typography/custom-subheader-text.js";
import customParagraphText from "./custom-typography/custom-paragraph-text.js";

// List
import customListData from "./custom-list/custom-list-data.js";
import customListPlanlagteLoefteinnretninger from "./custom-list/custom-list-planlagte-loefteinnretninger.js";
import customListVedlegg from "./custom-list/custom-list-vedlegg.js";

// Table
import customTableEiendom from "./custom-table/custom-table-eiendom.js";
import customTablePart from "./custom-table/custom-table-part.js";

// Summation
import customSummationArealdisponering from "./custom-summation/custom-summation-arealdisponering.js";

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

export const table = { customTableEiendom, customTablePart };

export const summation = { customSummationArealdisponering };

export default {
    typography,
    field,
    list,
    table,
    summation
};
