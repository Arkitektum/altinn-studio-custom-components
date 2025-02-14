# altinn-studio-custom-components

Denne pakken inneholder [Altinn 3 custom komponenter](https://docs.altinn.studio/nb/altinn-studio/reference/ux/components/custom/). Les mer om [web components for Altinn 3](https://github.com/Altinn/altinn-studio/issues/8681).

Her finner du gjenbrukbare komponenter som kan vise f.eks. et adresseobjekt eller et parts navn på en standard måte slik som Direktoratet for Byggkvalitet ønsker i Fellestjenester BYGG-plattformen.

## Komponenter

### Titler

- [Text](src/components/data-components/custom-header-text/) - viser tittel med tekst fra ressurs

### Undertitler

- [Text](src/components/data-components/custom-subheader-text) - viser undertittel med tekst fra ressurs

### Paragraf

- [Text](src/components/data-components/custom-paragraph-text/) - viser paragraf med tekst fra ressurs

### Datafelt

- [Data](src/components/data-components/custom-field-data/) - viser et datafelt med label
- [Boolean text](src/components/data-components/custom-field-boolean-text/) - viser et boolsk med gitte tekster for true/false verdier
- [Adresse](src/components/data-components/custom-field-adresse/) - viser et komplett adresseobjekt
- [Part-navn](src/components/data-components/custom-field-part-navn/) - viser parts navn med evt organisasjonsnummer
- [Kommunens saksnummer](src/components/data-components/custom-field-kommunens-saksnummer/) - viser et kommunalt saksnummer sammensatt av saksår og sekvensnummer.
- [Prosjekt](src/components/data-components/custom-field-prosjekt/) - viser prosjektnummer sammensatt av nummer og navn
- [Telefonnummer](src/components/data-components/custom-field-telefonnummer/) - viser alle telefonnummer som er angitt på et parts-objekt
- [Utfallbesvarelse](src/components/data-components/custom-field-utfall-svar-status/) - viser status basert på Utfallsvar-objektet

### Lister

- [Data](src/components/data-components/custom-list-data/) - viser en liste med verdier
- [Vedlegg](src/components/data-components/custom-list-vedlegg/) - viser en liste med vedlegg fra datamodellen

### Gruppelister

- [Utfall svar](src/components/data-components/custom-grouplist-utfall-svar-type/) - viser liste Utfallsvar-komponentgrupper

### Tabeller

- [Data](src/components/data-components/custom-table-data/) - viser en tabell med verdier

### Hvordan ta i bruk altinn-studio-custom-components i en Altinn 3 App

Installer libman cli som et globalt verktøy (kun nødvendig 1 gang pr maskin)

`dotnet tool install -g Microsoft.Web.LibraryManager.Cli`

Initialiser **libman.json** og bruk unpkg.com som default kilde

```bash
C:\dev\src\dibk\ig-v3\App> libman init
DefaultProvider [cdnjs]: unpkg
```

Installer pakken til **wwwroot/ftpb-components**

```bash
C:\dev\src\dibk\ig-v3\App> libman install @arkitektum/altinn-studio-custom-components@1.5.1 -d wwwroot/ftpb-components

wwwroot/ftpb-components/dist/main.js written to disk
wwwroot/ftpb-components/package.json written to disk
wwwroot/ftpb-components/README.md written to disk
Installed library "@arkitektum/altinn-studio-custom-components@1.5.1" to "wwwroot/ftpb-components"
```

Legg til libman i byggeprosessen i dotnet-prosjektet

```bash
C:\dev\src\dibk\ig-v3\App> dotnet add package Microsoft.Web.LibraryManager.Build
```

Kjør bygging på vanlig måte

```bash
C:\dev\src\dibk\ig-v3\App> dotnet build
```

Legg til referanse i **views/Home/index.cshtml**. Legg til link-taggen i head og script-taggen nederst i body. Pass på å bytt ut starten av stien **/dibk/ig-v3** med reel sti for appen.

```html
<!-- Custom components -->
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="/dibk/ig-v3/ftpb-components/dist/main.css" />
    </head>
    <body>
        <script type="module" src="/dibk/ig-v3/ftpb-components/dist/main.js"></script>
    </body>
</html>
```
