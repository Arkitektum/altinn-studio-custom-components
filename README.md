# altinn-studio-custom-components

This repository provides a collection of reusable custom components designed for Altinn Studio, enabling standardized presentation of various data types in digital public services.

---

## 📦 Installation

To integrate these components into your Altinn Studio application, follow these steps:

1. Init NPM:

   ```bash
   npm init -y
   ```

2. Install the package via npm:

   ```bash
   npm install @arkitektum/altinn-studio-custom-components --save
   ```

3. Add the following configuration to your `/App/App.csproj` file to ensure proper installation and asset copying during build:

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

4. Add the following configuration to your `/views/Home/index.cshtml` file:

   Make sure you replace `[ORG NAME]` and `[APP NAME]` with the actual names

   ```html
   <html>
     <head>
       <link rel="stylesheet" type="text/css" href="/[ORG NAME]/[APP NAME]/altinn-studio-custom-components/main.css">
     </head>
     <body>
       <script type="module" src="/[ORG NAME]/[APP NAME]/altinn-studio-custom-components/main.js"></script>
     </body>
   </html>
   ```

5. Add npm to `Dockerfile`

   ```dockerfile
   WORKDIR /App

   RUN apk add --no-cache npm
   ```

This will handle the installation of the necessary npm packages and copy the assets to the `wwwroot/altinn-studio-custom-components` directory during the build process.

---

## 🧩 Available Components

These components are tailored to display specific data types consistently across Altinn Studio applications:

- **Typography**
  - [Header](src/components/data-components/custom-header-text/) – Displays a title with text from a resource.
  - [Subheader](src/components/data-components/custom-subheader-text) – Displays a title with text from a resource.
  - [Paragraph](src/components/data-components/custom-paragraph-text/) – Displays a paragraph with text from a resource.
  - [Paragraph Text Data](src/components/data-components/custom-paragraph-text-data/) – Displays a paragraph with text from a resource combined with text from data.
- **Fields**
  - [Data](src/components/data-components/custom-field-data/) – Displays a data field with a label.
  - [Boolean Data](src/components/data-components/custom-field-boolean-data/) – Displays different data model values based on a boolean value.
  - [Boolean Text](src/components/data-components/custom-field-boolean-text/) – Displays different text resources based on a boolean value.
  - [Count Data](src/components/data-components/custom-field-count-data/) – Displays the number of items in an array.
  - [Feedback](src/components/data-components/custom-feedback-data/) – Displays a single feedback message.
  - [Adresse](src/components/data-components/custom-field-adresse/) – Displays a complete address object
  - [Part-navn](src/components/data-components/custom-field-part-navn/) – Displays a part's name, optionally with an organization number.
  - [Kode](src/components/data-components/custom-field-kode/) – Displays a code value from the data model, typically used for standardized codes or identifiers.
  - [Kommunens saksnummer](src/components/data-components/custom-field-kommunens-saksnummer/) – Displays a municipal case number composed of the case year and sequence number.
  - [Prosjekt](src/components/data-components/custom-field-prosjekt/) – Displays a project number composed of a number and name.
  - [Telefonnummer](src/components/data-components/custom-field-telefonnummer/) – Displays all phone numbers associated with a part object.
  - [Utfallbesvarelse](src/components/data-components/custom-field-utfall-svar-status/) – Displays the status based on the 'Utfallbesvarelse' object.
- **Lists**
  - [Data](src/components/data-components/custom-list-data/) – Displays a list of values from an array.
  - [Planlagte løfteinnretninger](src/components/data-components/custom-list-planlagte-loefteinnretninger/) – Displays a list containing [`PlanlagteLoefteinnretningerList`](src/classes/system-classes/data-classes/PlanlagteLoefteinnretningerList.js) from a [`Loefteinnretninger`](src/classes/data-classes/Loefteinnretninger.js) object.
  - [Vedlegg](src/components/data-components/custom-list-vedlegg/) – Displays a list of attachments.
  - [Feedback](src/components/data-components/custom-feedbacklist-data/) – Displays a list of feedback messages for a feedback type.
  - [ValidationMessages](src/components/data-components/custom-feedbacklist-validation-messages/) – Displays lists of feedback messages for all feedback types.
- **Group lists**
  - [Ettersending](src/components/data-components/custom-grouplist-ettersending/) – Displays a list of [`Ettersending`](src/classes/data-classes/Ettersending.js) component groups.
  - [Sjekklistekrav](src/components/data-components/custom-grouplist-sjekklistekrav/) – Displays a list of [`Sjekklistekrav`](src/classes/data-classes/Sjekklistekrav.js) component groups.
  - [Utfall svar](src/components/data-components/custom-grouplist-utfall-svar-type/) – Displays a list of [`Utfallsvar`](src/classes/data-classes/UtfallSvar.js) component groups.
- **Summation**
  - [Data](src/components/data-components/custom-summation-data/) - Displays the summation of numeric values from a specified data array.
  - [Arealdisponering](src/components/data-components/custom-summation-arealdisponering) – Displays the summation of area allocation values from an [`Arealdisponering`](src/classes/data-classes/Arealdisponering.js) object.
- **Tables**
  - [Data](src/components/data-components/custom-table-data/) – Displays data table with customizable columns and rows.
  - [Arbeidsplasser](src/components/data-components/custom-table-arbeidsplasser/) – Displays table with data from an array with [`Arbeidsplasser`](src/classes/data-classes/Arbeidsplasser.js) objects.
  - [Eiendom](src/components/data-components/custom-table-eiendom/) – Displays table with data from an array with [`Eiendom`](src/classes/data-classes/Eiendom.js) objects.
  - [Områderisiko](src/components/data-components/custom-table-omraaderisiko/) – Displays table with data from an array with [`Omraaderisiko`](src/classes/data-classes/Omraaderisiko.js) objects.
  - [Part](src/components/data-components/custom-table-part/) – Displays table with data from an array with [`Part`](src/classes/data-classes/Part.js) objects for `part`.
  - [Plan](src/components/data-components/custom-table-plan/) – Displays table with data from an array with [`Plan`](src/classes/data-classes/Plan.js) objects for `andrePlaner`.

These components adhere to the standards set by the Norwegian Building Authority (Direktoratet for Byggkvalitet) within the Fellestjenester BYGG platform.

---

## 🧪 Development & Testing

To set up a local development environment for testing these components:

### Run development environment

1. Clone the repository:

   ```bash
   git clone https://github.com/Arkitektum/altinn-studio-custom-components.git
   ```

2. Navigate into the project directory:

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

   This will launch a local server where you can preview and test the components in isolation.

### Run unit tests

To ensure everything is working as expected, run the tests:

```bash
yarn test
```

This will execute the test suite and help validate that the components behave as intended.

---

## 🔗 Resources

- [Altinn Studio Documentation](https://docs.altinn.studio/)
- [Altinn Studio GitHub Repository](https://github.com/Altinn/altinn-studio)
- [Altinn Studio Customm Component Documentation](https://docs.altinn.studio/altinn-studio/reference/ux/components/custom/)
- [POC: Use of third party components in apps](https://github.com/Altinn/altinn-studio/issues/8681)

---

## 📝 Changelog

The [changelog](https://github.com/Arkitektum/altinn-studio-custom-components/releases) is regularly updated to reflect what's changed in each new release.
