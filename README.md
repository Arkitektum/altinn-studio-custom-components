# altinn-studio-custom-components

![CI](https://github.com/Arkitektum/altinn-studio-custom-components/actions/workflows/ci.yml/badge.svg) ![npm version](https://img.shields.io/npm/v/@arkitektum/altinn-studio-custom-components.svg)

Custom web components for **Altinn Studio** apps that present form data in a consistent, standardized way, following the standards of **Direktoratet for byggkvalitet (DiBK)** on the **Fellestjenester BYGG** platform.

---

## Installation

### 1. Initialize npm

```bash
npm init -y
```

### 2. Install the package

```bash
npm install @arkitektum/altinn-studio-custom-components --save
```

### 3. Configure asset handling in `/App/App.csproj`

Add the following snippet to ensure npm packages are installed and copied to `wwwroot` during the build:

```xml
<Target Name="NpmInstall" Inputs="package.json" Outputs="node_modules/.install-stamp">
  <Exec Command="npm ci"      Condition="'$(RestorePackagesWithLockFile)' == 'true'" />
  <Exec Command="npm install" Condition="'$(RestorePackagesWithLockFile)' != 'true'" />
  <Touch Files="node_modules/.install-stamp" AlwaysCreate="true" />
</Target>

<ItemGroup>
  <MyAssets Include="node_modules/@arkitektum/altinn-studio-custom-components/**/*.*" />
</ItemGroup>

<Target Name="CopyAssetsToWwwroot" DependsOnTargets="NpmInstall" AfterTargets="Build">
  <Message Text="Copying assets to wwwroot..." Importance="High" />
  <MakeDir Directories="wwwroot/altinn-studio-custom-components" />
  <Copy
    SourceFiles="@(MyAssets)"
    DestinationFolder="wwwroot/altinn-studio-custom-components"
    SkipUnchangedFiles="true" />
</Target>
```

### 4. Include the scripts and styles

#### Apps on Altinn.App v9

The app generates its own index page, and includes every file in `wwwroot/custom-js` and `wwwroot/custom-css`. Add this to the `CopyAssetsToWwwroot` target from step 3, and delete `/views/Home/Index.cshtml` if the app has one:

```xml
<ItemGroup>
  <CustomJsAssets Include="node_modules/@arkitektum/altinn-studio-custom-components/dist/main.js" />
  <CustomCssAssets Include="node_modules/@arkitektum/altinn-studio-custom-components/dist/main.css" />
</ItemGroup>
<MakeDir Directories="wwwroot/custom-js;wwwroot/custom-css" />
<Copy SourceFiles="@(CustomJsAssets)" DestinationFolder="wwwroot/custom-js" SkipUnchangedFiles="true" />
<Copy SourceFiles="@(CustomCssAssets)" DestinationFolder="wwwroot/custom-css" SkipUnchangedFiles="true" />
```

Only `main.css` goes in `custom-css`, since the page loads every file there as a stylesheet. The fonts are embedded in it.

#### Apps on Altinn.App v8

Include them in `/views/Home/index.cshtml`. Replace `[ORG NAME]` and `[APP NAME]` with the correct values:

```html
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="/[ORG NAME]/[APP NAME]/altinn-studio-custom-components/main.css" />
    </head>
    <body>
        <script type="module" src="/[ORG NAME]/[APP NAME]/altinn-studio-custom-components/main.js"></script>
    </body>
</html>
```

### 5. Add npm support in your Dockerfile

```dockerfile
WORKDIR /App

RUN apk add --no-cache npm
```

After these steps, npm packages are installed during the build, and all assets are copied into `wwwroot/altinn-studio-custom-components`. The components load their default text resources (`resource.<lang>.json`) from that folder at runtime, so the copy from step 3 is needed on v9 apps as well.

### 6. Optional: editor help for layout files

At the top of each layout file in `App/ui/<form>/layouts/`, point `$schema` at the schema this package ships:

```json
"$schema": "../../../wwwroot/altinn-studio-custom-components/layout.schema.json"
```

VS Code then:

- suggests the tag names, and for each component its `dataModelBindings` keys, `resourceBindings` keys and attributes
- describes each of them on hover
- warns about a missing, deprecated or unknown key

Good to know:

- The file comes with `dotnet build` (step 3), so it always matches the package version the app installs. In a fresh clone, VS Code cannot load it until the app has been built once.
- A `json.schemas` setting in VS Code does not work for this, because VS Code uses the file's own `$schema`.
- To use the schema without a build, point `$schema` at `https://cdn.jsdelivr.net/npm/@arkitektum/altinn-studio-custom-components/dist/layout.schema.json` instead. That is the latest published version, which can take a while to catch up after a release.

---

## Reading form data from the app

On apps on Altinn.App v9, a component can read its form data from the app instead of through `dataModelBindings`. Name the data type in the layout:

```json
{
    "id": "dispensasjon",
    "type": "Custom",
    "tagName": "custom-dispensasjon",
    "dataType": "DispensasjonssoeknadDataV1"
}
```

- A layout component, such as `custom-dispensasjon`, gets the whole form data of that data type, so it needs no binding for each root property.
- A data component names the value it shows with `dataKey`, a dot-separated path from the root of the form data:

```json
{
    "id": "eiendom",
    "type": "Custom",
    "tagName": "custom-table-eiendom",
    "dataType": "ET",
    "dataKey": "eiendomByggested.eiendom"
}
```

Objects and lists arrive as they are in the data model, also in Summary2 and the PDF.

### Which data element is read

1. The subform entry the page shows, when it has that data type. That covers a subform's own pages and its own PDF.
2. Otherwise the only data element of that data type in the instance.
3. Otherwise none. With several entries of the same subform type, a summary that lists them all doesn't say which entry a component belongs to. The component then draws from its `dataModelBindings`, if it has any, and is otherwise empty.

So always set `dataType` on components in subform layouts. Without it, a subform layout shown inside the main form's summary can't tell its data apart from the main form's.

### Good to know

- **Only what is named is fetched.** The components fetch the instance's list of data elements, and the form data of the data types named on the page, with the user's own login. Other form data in the instance is never fetched.
- **The PDF waits.** A component carries `data-loading` while it fetches, which holds back the PDF until it is drawn.
- **Data is refreshed per page.** The data is fetched again after the user moves to another page, so a summary shows what the user just entered.
- **v8 apps** need `dataModelBindings`. There, `dataType` and `dataKey` are ignored.

---

## Available Components

For the full list of components, with examples, see the documentation site:

[Component Documentation & Gallery](https://arkitektum.github.io/altinn-studio-custom-components-docs/)

---

## Package contents

`yarn build` writes these files to `dist/`, and the package exports them:

| File                                                                 | Exported as                                      | What it is for                                                                          |
| -------------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `main.js` and `main.css`                                             | `.` and `./styles.css`                           | The components, loaded by the app                                                       |
| `resource.<lang>.json` for `nb`, `nn` and `en`, and `resources.json` | `./resources/<lang>.json` and `./resources.json` | The default text resources, per language and all languages in one file                  |
| `dataModelBindingKeys.json`                                          | `./dataModelBindingKeys.json`                    | The `dataModelBindings` keys each component reads, see below                            |
| `layout.schema.json`                                                 | `./layout.schema.json`                           | The schema for app layout files, see [step 6](#6-optional-editor-help-for-layout-files) |

### `dataModelBindingKeys.json`

One entry for each component that declares the keys it reads:

- `expected`: keys that must all be bound
- `oneOf`: groups where one key should be bound. When more are, the first one in the group is read.
- `optional`: keys that may be left out
- `deprecated`: keys no longer read, each with a hint saying what replaced it

```json
{
    "custom-field-data": {
        "expected": [],
        "oneOf": [["simpleBinding", "data"]],
        "optional": ["dataTitle"],
        "deprecated": {}
    }
}
```

The docs gallery checks its examples against it, and the Data model bindings page of the Statistics dashboard checks every app's layouts against the same keys.

### `layout.schema.json`

Altinn's layout schema, with the definition of a custom component replaced so that the attributes these components read are allowed.

On a custom component, it checks:

- **the tag name**
- **`dataModelBindings`** against the same lists as `dataModelBindingKeys.json`
- **`resourceBindings`** against the keys the component reads, found at build by constructing every component
- **attributes**: the ones every component gets from the base class, such as `hideIfEmpty` and `size`, are allowed everywhere. The ones only some components read, such as `itemKey` and `tableColumns`, are allowed on those alone.
- **expressions**, more lightly than Altinn's schema: an expression must name one of Altinn's functions at every level. Argument counts and types are left to Altinn.

It is built from copies of Altinn's layout and expression schemas in `src/data/altinn/`. To refresh them:

```bash
yarn update-altinn-layout-schema
```

---

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local setup, commands and how to add components and resources, and [ARCHITECTURE.md](./ARCHITECTURE.md) for how the package is structured.

---

## DevTools Mode

DevTools mode adds an inspection overlay to every custom component on the page, showing the properties each component was given.

### Activating DevTools Mode

Add `?devtools=true` to the URL of your Altinn Studio app:

```text
http://local.altinn.cloud/[ORG NAME]/[APP NAME]?devtools=true/#/instance/.../PdfLayout
```

### What It Shows

Each custom component gets a small badge button in its top-right corner. Clicking it opens an inspection panel showing the component's tag name, `id`, and all non-empty properties.

Components are color-coded by category:

| Badge | Category | Description                |
| ----- | -------- | -------------------------- |
| **B** | Base     | Base components (blue)     |
| **D** | Data     | Data components (green)    |
| **L** | Layout   | Layout components (purple) |

Components hidden because they are empty (`hideIfEmpty`) are drawn as a placeholder with a dashed border and a **hidden** label, so their properties can still be inspected.

Clicking anywhere outside a panel closes it.

---

## Resources

- [Architecture overview](./ARCHITECTURE.md)
- [Contributing guide](./CONTRIBUTING.md)
- [Security policy](./SECURITY.md)
- [Accessibility](./ACCESSIBILITY.md)
- [Altinn Studio Documentation](https://docs.altinn.studio/)
- [Altinn Studio GitHub Repository](https://github.com/Altinn/altinn-studio)
- [Altinn Studio Custom Component Documentation](https://docs.altinn.studio/altinn-studio/reference/ux/components/custom/)

---

## Changelog

See the [releases](https://github.com/Arkitektum/altinn-studio-custom-components/releases) for what changed in each version.

---

## Licence

[MIT](./LICENSE)
