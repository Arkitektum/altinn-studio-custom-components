import customField from "./base-components/custom-field/index.js";
import customHeader from "./base-components/custom-header/index.js";
import customList from "./base-components/custom-list/index.js";
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

import { addGlobalStylesheet } from "../functions/helpers.js";
import styles from "../styles/main.css" with { type: "css" };

addGlobalStylesheet("main-styles", styles);

export {
    customField,
    customHeader,
    customList,
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
    customListVedlegg
};
