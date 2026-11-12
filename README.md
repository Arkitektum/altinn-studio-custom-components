# altinn-studio-custom-components

![CI](https://github.com/Arkitektum/altinn-studio-custom-components/actions/workflows/ci.yml/badge.svg) ![npm version](https://img.shields.io/npm/v/@arkitektum/altinn-studio-custom-components.svg)

A collection of reusable custom components for **Altinn Studio**, designed to provide consistent, standardized presentation of various data types in digital public services.

---

## Installation

To integrate this package into your Altinn Studio application, follow the steps below.

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

After these steps, npm packages will be installed automatically during the build, and all assets will be copied into `wwwroot/altinn-studio-custom-components`.

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
- **v8 apps** still need `dataModelBindings`. There, `dataType` and `dataKey` are ignored.

---

## Available Components

Components are grouped by category and tailored to display domain-specific data according to standards from **Direktoratet for Byggkvalitet (DiBK)** on the **Fellestjenester BYGG** platform.

For a full list of available components and examples, see the documentation site:

[Component Documentation & Gallery](https://arkitektum.github.io/altinn-studio-custom-components-docs/)

---

## Development & Testing

> For a deeper look at how the package is structured and how it fits into the wider ecosystem, see [ARCHITECTURE.md](./ARCHITECTURE.md). For contribution guidelines (adding components, resources, releases), see [CONTRIBUTING.md](./CONTRIBUTING.md).

### Prerequisites

- **Node.js 24**
- **Yarn 4** (managed via [Corepack](https://nodejs.org/api/corepack.html)). Enable it once with:

    ```bash
    corepack enable
    ```

    The correct Yarn version is then activated automatically from the `packageManager` field in `package.json`.

### Development

1. Clone the repository:

    ```bash
    git clone https://github.com/Arkitektum/altinn-studio-custom-components.git
    ```

2. Move into the project directory:

    ```bash
    cd altinn-studio-custom-components
    ```

3. Install dependencies:

    ```bash
    yarn install
    ```

4. Create a local environment file from the sample:

    ```bash
    cp .env.sample .env
    ```

    The dev server reads this file via `dotenv-webpack`. `PORT` sets the dev server port (default `9000`), while `API_PORT` is only needed for the Statistics dashboard (see below). The Gitea token the dashboard's data comes through belongs to the API, not to this app.

5. Start the development server:

    ```bash
    yarn start
    ```

    Then open [http://localhost:9000](http://localhost:9000). The start page links to the Developer tools page and the Statistics page.

### Building

```bash
yarn build
```

The build writes these files to `dist/`:

| File                                 | Exported as                                  | What it is for                                                                          |
| ------------------------------------ | -------------------------------------------- | --------------------------------------------------------------------------------------- |
| `main.js` and `main.css`             | `.` and `./styles.css`                       | The components, loaded by the app                                                       |
| `resource.nb.json`, `resources.json` | `./resources/nb.json` and `./resources.json` | The default text resources                                                              |
| `dataModelBindingKeys.json`          | `./dataModelBindingKeys.json`                | The `dataModelBindings` keys each component reads, see below                            |
| `layout.schema.json`                 | `./layout.schema.json`                       | The schema for app layout files, see [step 6](#6-optional-editor-help-for-layout-files) |

#### `dataModelBindingKeys.json`

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

The docs gallery checks its examples against it, and the Data model bindings page of the Statistics dashboard checks every app's layouts.

#### `layout.schema.json`

Altinn's layout schema, with the definition of a custom component replaced. Altinn's own allows only Altinn's properties on a custom component, so an editor flags every attribute these components use.

On a custom component, it checks:

- **the tag name**
- **`dataModelBindings`** against the same lists as `dataModelBindingKeys.json`
- **`resourceBindings`** against the keys the component reads, found at build by constructing every component
- **attributes**: the ones every component gets from the base class, such as `hideIfEmpty` and `size`, are allowed everywhere. The ones only some components read, such as `itemKey` and `tableColumns`, are allowed on those alone.
- **expressions**, more lightly than Altinn's schema: an expression must name one of Altinn's functions at every level, but argument counts and types are not checked. Altinn's own expression checking freezes VS Code on real layouts.

It is built from copies of Altinn's layout and expression schemas in `src/data/altinn/`. To refresh them:

```bash
yarn update-altinn-layout-schema
```

### Testing

Run unit tests:

```bash
yarn test
```

### Linting

Check code style and lint rules:

```bash
yarn lint
```

---

## DevTools Mode

DevTools mode adds inspection overlays to all custom components on the page, making it easier to debug and inspect component properties during development.

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

Components that are conditionally hidden are rendered as a visible placeholder (dashed border) with a **hidden** label instead of being invisible, so you can still inspect their properties.

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
- [POC: Use of third party components in apps](https://github.com/Altinn/altinn-studio/issues/8681)

---

## Changelog

The [changelog](https://github.com/Arkitektum/altinn-studio-custom-components/releases) is regularly updated to reflect what's changed in each new release.

---

## Licence

[MIT](./LICENSE)
