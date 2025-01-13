# altinn-studio-custom-components

## Hvordan ta i bruk altinn-studio-custom-componenents i en Altinn 3 App

### Installer libman cli som et globalt verktøy (kun nødvendig 1 gang pr maskin)

```dotnet tool install -g Microsoft.Web.LibraryManager.Cli```

### Initialiser libman.json og bruk unpkg.com som default kilde

```bash
C:\dev\src\dibk\ig-v3\App> libman init
DefaultProvider [cdnjs]: unpkg
```

### Installer pakken til wwwroot/components

```bash
C:\dev\src\dibk\ig-v3\App> libman install @arkitektum/altinn-studio-custom-components@1.1.0 -d wwwroot/components

wwwroot/components/dist/main.js written to disk
wwwroot/components/package.json written to disk
wwwroot/components/README.md written to disk
Installed library "@arkitektum/altinn-studio-custom-components@1.1.0" to "wwwroot/components"
```

### Legg til libman i byggeprosessen i dotnet-prosjektet

```bash
C:\dev\src\dibk\ig-v3\App> dotnet add package Microsoft.Web.LibraryManager.Build
```

### Kjør bygging på vanlig måte

```bash
C:\dev\src\dibk\ig-v3\App> dotnet build
```

### Legg til referanse i views/Home/index.cshtml

Legg til script-taggen i head.

```html
<!-- Custom components -->
<script type="module" src="/dibk/ig-v3/components/dist/main.js"></script>
```

## Komponenter

### Tekstfelt

- [Data](src/components/custom-field-data/)
- [Boolean text](src/components/custom-field-boolean-text/)
- [Adresse](src/components/custom-field-adresse/)
- [Ansvarlig søker](src/components/custom-field-ansvarlig-soeker/)
- [Kommunens saksnummer](src/components/custom-field-kommunens-saksnummer/)
- [Prosjekt](src/components/custom-field-prosjekt/)
- [Telefonnummer](src/components/custom-field-telefonnummer/)
- [Utfallbesvarelse](src/components/custom-field-utfall-svar-status/)

### Lister

- [Data](src/components/custom-list-data/)
- [Vedlegg](src/components/custom-list-vedlegg/)
