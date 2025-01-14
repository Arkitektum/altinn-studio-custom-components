# altinn-studio-custom-components

Denne pakken inneholder [Altinn 3 custom komponenter](https://docs.altinn.studio/nb/altinn-studio/reference/ux/components/custom/). Les mer om [web components for Altinn 3](https://github.com/Altinn/altinn-studio/issues/8681).

Her finner du gjenbrukbare komponenter som kan vise f.eks. et adresseobjekt eller et parts navn på en standard måte slik som Direktoratet for Byggkvalitet ønsker i Fellestjenester BYGG-plattformen.

## Komponenter

### Tekstfelt

- [Data](src/components/custom-field-data/) - viser et datafelt med label
- [Boolean text](src/components/custom-field-boolean-text/) - viser et boolsk med gitte tekster for true/false verdier
- [Adresse](src/components/custom-field-adresse/) - viser et komplett adresseobjekt
- [Part-navn](src/components/custom-field-part-navn/) - viser parts navn med evt organisasjonsnummer
- [Kommunens saksnummer](src/components/custom-field-kommunens-saksnummer/) - viser et kommunalt saksnummer sammensatt av saksår og sekvensnummer.
- [Prosjekt](src/components/custom-field-prosjekt/) - viser prosjektnummer sammensatt av nummer og navn
- [Telefonnummer](src/components/custom-field-telefonnummer/) - viser alle telefonnummer som er angitt på et parts-objekt
- [Utfallbesvarelse](src/components/custom-field-utfall-svar-status/) - viser status basert på Utfallsvar-objektet

### Lister

- [Data](src/components/custom-list-data/) - viser en liste med verdier
- [Vedlegg](src/components/custom-list-vedlegg/) - viser en liste med vedlegg fra datamodellen


### Hvordan ta i bruk altinn-studio-custom-components i en Altinn 3 App

Installer libman cli som et globalt verktøy (kun nødvendig 1 gang pr maskin)

```dotnet tool install -g Microsoft.Web.LibraryManager.Cli```

Initialiser __libman.json__ og bruk unpkg.com som default kilde

```bash
C:\dev\src\dibk\ig-v3\App> libman init
DefaultProvider [cdnjs]: unpkg
```

Installer pakken til __wwwroot/components__

```bash
C:\dev\src\dibk\ig-v3\App> libman install @arkitektum/altinn-studio-custom-components@1.5.1 -d wwwroot/components

wwwroot/components/dist/main.js written to disk
wwwroot/components/package.json written to disk
wwwroot/components/README.md written to disk
Installed library "@arkitektum/altinn-studio-custom-components@1.5.1" to "wwwroot/components"
```

Legg til libman i byggeprosessen i dotnet-prosjektet

```bash
C:\dev\src\dibk\ig-v3\App> dotnet add package Microsoft.Web.LibraryManager.Build
```

Kjør bygging på vanlig måte

```bash
C:\dev\src\dibk\ig-v3\App> dotnet build
```

Legg til referanse i __views/Home/index.cshtml__. Legg til script-taggen i head.

```html
<!-- Custom components -->
<script type="module" src="/dibk/ig-v3/components/dist/main.js"></script>
```
