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

### **Typography**

- **Header** -- Displays a header text from a resource.
- **Subheader** -- Displays a subheader from a resource.
- **Paragraph** -- Displays a paragraph from a resource.
- **Paragraph Text Data** -- Combines resource text with data text.

### **Fields**

- **Data** -- Field with label and value.
- **Boolean Data** -- Displays model values based on boolean.
- **Boolean Text** -- Displays resource text based on boolean.
- **Count Data** -- Counts items in an array.
- **Feedback** -- Single feedback message.
- **Adresse** -- Full address object.
- **Part-navn** -- Part name, optionally with org number.
- **Kode** -- Standardized code value.
- **Kommunens saksnummer** -- Composite case number (year + sequence).
- **Prosjekt** -- Composite project number and name.
- **Telefonnummer** -- All phone numbers for a part object.
- **Utfallbesvarelse** -- Displays status from an `Utfallbesvarelse` object.

### **Lists**

- **Data** -- Values from an array.
- **Planlagte løfteinnretninger** -- List of `PlanlagteLoefteinnretningerList`.
- **Vedlegg** -- Attachment list.
- **Feedback** -- List of feedback messages by type.
- **ValidationMessages** -- Combined validation feedback.

### **Description Lists**

- **Data** -- Produces a description list from array values.

### **Group Lists**

- **Ansvarsområde** -- Displays `Ansvarsomraade` groups.
- **Ettersending** -- Displays `Ettersending` groups.
- **Sjekklistekrav** -- Displays `Sjekklistekrav` groups.
- **Utfall svar** -- Displays `Utfallsvar` groups.

### **Summation**

- **Data** -- Sums numerical values from an array.
- **Arealdisponering** -- Sums area allocation values from an `Arealdisponering` object.

### **Tables**

- **Data** -- Configurable data table.
- **Ansvarsområde** -- Table displaying responsibility areas.
- **Arbeidsplasser** -- Table listing workplaces.
- **Eiendom** -- Table showing property information.
- **Områderisiko** -- Table for area risk assessments.
- **Part** -- Table of parties involved.
- **Plan** -- Table of plans.

---

## 🧪 Development & Testing

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

4. Start the development server:

    ```bash
    yarn start
    ```

5. Start the documentation site (for local docs development):

    ```bash
    yarn start-docs
    ```

6. Build the documentation site (static output):

    ```bash
    yarn build-docs
    ```

### Testing

Run unit tests:

```bash
yarn test
```

---

## 🔗 Resources

- [Altinn Studio Documentation](https://docs.altinn.studio/)
- [Altinn Studio GitHub Repository](https://github.com/Altinn/altinn-studio)
- [Altinn Studio Customm Component Documentation](https://docs.altinn.studio/altinn-studio/reference/ux/components/custom/)
- [POC: Use of third party components in apps](https://github.com/Altinn/altinn-studio/issues/8681)

---

## 📝 Changelog

The [changelog](https://github.com/Arkitektum/altinn-studio-custom-components/releases) is regularly updated to reflect what's changed in each new release.
