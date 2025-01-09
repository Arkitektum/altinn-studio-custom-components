# altinn-studio-custom-components



## Hvordan ta i bruk altinn-studio-custom-componenents i en Altinn 3 App

### Installer libman cli som et globalt verktøy (kun nødvendig 1 gang pr maskin)

```dotnet tool install -g Microsoft.Web.LibraryManager.Cli```

### initialiser libman.json og bruk unpkg.com som default kilde
```
C:\dev\src\dibk\ig-v3\App> libman init
DefaultProvider [cdnjs]: unpkg
```

### installer pakken til wwwroot/components
```
C:\dev\src\dibk\ig-v3\App> libman install @arkitektum/altinn-studio-custom-components@1.1.0 -d wwwroot/components

wwwroot/components/dist/main.js written to disk
wwwroot/components/package.json written to disk
wwwroot/components/README.md written to disk
Installed library "@arkitektum/altinn-studio-custom-components@1.1.0" to "wwwroot/components"
```

### legg til libman i byggeprosessen i dotnet-prosjektet
```
C:\dev\src\dibk\ig-v3\App> dotnet add package Microsoft.Web.LibraryManager.Build
```

### kjør bygging på vanlig måte
```
C:\dev\src\dibk\ig-v3\App> dotnet build
```

## Legg til referanse i views/Home/index.cshtml

Legg til script-taggen i head.
```
<!-- Custom components -->
<script type="module" src="/dibk/ig-v3/components/dist/main.js"></script>
```