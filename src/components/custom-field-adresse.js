import { objectHasValue, renderFieldElement } from "../functions/helpers.js";

customElements.define(
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
            const hideIfEmpty = this.getAttribute("hideIfEmpty") === "true";
            const hideTitle = this.getAttribute("hideTitle") === "true";
            const emptyFieldText = this.getAttribute("emptyFieldText");
            const formdata = JSON.parse(this.getAttribute("formdata"));
            const styleoverride = JSON.parse(this.getAttribute("styleoverride"));
            const title = !hideTitle && this.getAttribute("text");
            if (hideIfEmpty && !objectHasValue(formdata.data)) {
                this.style.display = "none";
            } else {
                const adresseString = this.formatAdresse(formdata.data);
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
