// Field
import customFieldAdresse from "./custom-field/custom-field-adresse.js";
import customFieldBooleanData from "./custom-field/custom-field-boolean-data.js";
import customFieldBooleanText from "./custom-field/custom-field-boolean-text.js";
import customFieldCountData from "./custom-field/custom-field-count-data.js";
import customFieldData from "./custom-field/custom-field-data.js";
import customFieldKode from "./custom-field/custom-field-kode.js";
import customFieldKommunensSaksnummer from "./custom-field/custom-field-kommunens-saksnummer.js";

// Table
import customTableEiendom from "./custom-table/custom-table-eiendom.js";
import customTablePart from "./custom-table/custom-table-part.js";

export const field = {
    customFieldAdresse,
    customFieldBooleanData,
    customFieldBooleanText,
    customFieldCountData,
    customFieldData,
    customFieldKode,
    customFieldKommunensSaksnummer
};
export const table = { customTableEiendom, customTablePart };

export default {
    field,
    table
};
