import Adresse from "../../classes/Adresse.js";
import { getCustomComponentProps, objectHasValue, renderFieldElement } from "../../functions/helpers.js";

export default customElements.define(
    "custom-field-adresse",
    class extends HTMLElement {
        formatAdresselinje(adresse) {
            const adresseLinjer = [adresse.adresselinje1, adresse.adresselinje2, adresse.adresselinje3];
            return adresseLinjer.filter((adresselinje) => adresselinje?.length).join("\n");
        }
        formatZipCity(adresse) {
            const zipCity = [adresse.postnr, adresse.poststed];
            return zipCity.filter((zipCity) => zipCity?.length).join(" ");
        }
        formatAdresse(adresse) {
            const adresseLinje = this.formatAdresselinje(adresse);
            const zipCity = this.formatZipCity(adresse);
            return adresseLinje?.length ? `${adresseLinje}\n${zipCity}` : zipCity;
        }
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const address = new Adresse(data);
            const title = !hideTitle && text;
            if (hideIfEmpty && !objectHasValue(address)) {
                this.style.display = "none";
            } else {
                const adresseString = this.formatAdresse(address);
                this.innerHTML = renderFieldElement(
                    title,
                    adresseString?.length ? adresseString : emptyFieldText,
                    true,
                    styleoverride
                );
            }
        }
    }
);
