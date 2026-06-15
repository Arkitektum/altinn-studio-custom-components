# altinn-studio-custom-components

![CI](https://github.com/Arkitektum/altinn-studio-custom-components/actions/workflows/ci.yml/badge.svg) ![npm version](https://img.shields.io/npm/v/@arkitektum/altinn-studio-custom-components.svg)

A collection of reusable custom components for **Altinn Studio**, designed to provide consistent, standardized presentation of various data types in digital public services.

---

## 📦 Installation

To integrate this package into your Altinn Studio application, follow
the steps below.

### 1. Initialize npm

```bash
npm init -y
```

### 2. Install the package

```bash
npm install @arkitektum/altinn-studio-custom-components --save
```

### 3. Configure asset handling in `/App/App.csproj`

Add the following snippet to ensure npm packages are installed and
copied to `wwwroot` during the build:

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

### 4. Include the scripts and styles in `/views/Home/index.cshtml`

Replace `[ORG NAME]` and `[APP NAME]` with the correct values:

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

After these steps, npm packages will be installed automatically during
the build, and all assets will be copied into
`wwwroot/altinn-studio-custom-components`.

---

## 🧩 Available Components

Components are grouped by category and tailored to display domain-specific data according to standards from **Direktoratet for Byggkvalitet (DiBK)** on the **Fellestjenester BYGG** platform.

For a full list of available components and examples, see the documentation site:

[Component Documentation & Gallery](https://arkitektum.github.io/altinn-studio-custom-components-docs/)

---

## 🧪 Development & Testing

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

    The dev server reads this file via `dotenv-webpack`. `PORT` sets the dev server port (default `9000`), while `API_PORT` and `GITEA_TOKEN` are only needed for the Statistics dashboard (see below).

5. Start the development server:

    ```bash
    yarn start
    ```

    Then open [http://localhost:9000](http://localhost:9000). The local playground links to a component tester, the [Developer tools](#️-devtools-mode) page, and a Statistics page.

### Building

Produce a production build in `dist/`:

```bash
yarn build
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

## 🛠️ DevTools Mode

DevTools mode adds inspection overlays to all custom components on the page, making it easier to debug and inspect component properties during development.

### Activating DevTools Mode

Add `?devtools=true` to the URL of your Altinn Studio app:

```text
http://local.altinn.cloud/[ORG NAME]/[APP NAME]?devtools=true/#/instance/.../PdfLayout
```

### What It Shows

Each custom component gets a small badge button in its top-right corner. Clicking it opens an inspection panel showing the component's tag name, `id`, and all non-empty properties.

Components are color-coded by category:

| Badge | Category |        Description         |
|-------|----------|----------------------------|
| **B** | Base     | Base components (blue)     |
| **D** | Data     | Data components (green)    |
| **L** | Layout   | Layout components (purple) |

Components that are conditionally hidden are rendered as a visible placeholder (dashed border) with a **hidden** label instead of being invisible, so you can still inspect their properties.

Clicking anywhere outside a panel closes it.

---

## 🔗 Resources

- [Altinn Studio Documentation](https://docs.altinn.studio/)
- [Altinn Studio GitHub Repository](https://github.com/Altinn/altinn-studio)
- [Altinn Studio Custom Component Documentation](https://docs.altinn.studio/altinn-studio/reference/ux/components/custom/)
- [POC: Use of third party components in apps](https://github.com/Altinn/altinn-studio/issues/8681)

---

## 📝 Changelog

The [changelog](https://github.com/Arkitektum/altinn-studio-custom-components/releases) is regularly updated to reflect what's changed in each new release.
