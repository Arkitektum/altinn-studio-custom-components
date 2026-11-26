# Architecture

This document explains how `@arkitektum/altinn-studio-custom-components` is built, how it behaves at runtime, and how it relates to the packages and applications around it. It is aimed at developers who maintain or extend the package.

For installation and usage, see the [README](./README.md). For how to contribute, see [CONTRIBUTING](./CONTRIBUTING.md).

## 1. What this package is

A collection of **custom HTML elements** (Web Components) for **Altinn Studio** apps. They present domain data for digital public services, following standards from **Direktoratet for byggkvalitet (DiBK)** on the **Fellestjenester BYGG** platform.

The package is distributed as static assets (`main.js`, `main.css` with the fonts embedded, generated resource files and two generated JSON files for tooling) that an Altinn app copies into its `wwwroot` and loads in the browser. Everything runs client-side, both in the interactive form and in the generated PDF.

## 2. Related repositories

Seven repositories work together. Two families of published packages, each with the applications that use them:

```text
A ──▶ B   A depends on the published package B
A ┄┄▶ B   A calls B over HTTP while running

  altinn-studio-custom-components-docs ───────────────────────────┐
         │                                                        │
         ▼                                                        ▼
  altinn-studio-custom-components ─────────────────▶ altinn-studio-custom-components-utils
     ▲          ┆
     │          ┆ Statistics page
     │          ▼
  Altinn apps   altinn-studio-custom-components-api ──┬──▶ ftpb-app-catalogue    ◀──┬── altinn-studio-api-tools
                                                      └──▶ ftpb-testmotor-client ◀──┘
```

| Repository                              | Published as                                        | Depends on                                                                 | Used by                                                                                                |
| --------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `altinn-studio-custom-components-utils` | `@arkitektum/altinn-studio-custom-components-utils` |                                                                            | `altinn-studio-custom-components` (bundled into its `main.js`), `altinn-studio-custom-components-docs` |
| `altinn-studio-custom-components`       | `@arkitektum/altinn-studio-custom-components`       | `altinn-studio-custom-components-utils`, `@arkitektum/client-logger`       | Altinn apps (copied into `App/wwwroot`), `altinn-studio-custom-components-docs`                        |
| `altinn-studio-custom-components-docs`  | Not published, deployed to GitHub Pages             | `altinn-studio-custom-components`, `altinn-studio-custom-components-utils` |                                                                                                        |
| `altinn-studio-custom-components-api`   | Not published, runs locally                         | `ftpb-app-catalogue`, `ftpb-testmotor-client`                              | The Statistics page in `altinn-studio-custom-components`, over HTTP                                    |
| `altinn-studio-api-tools`               | Not published, runs locally                         | `ftpb-app-catalogue`, `ftpb-testmotor-client`                              |                                                                                                        |
| `ftpb-app-catalogue`                    | `@arkitektum/ftpb-app-catalogue`                    |                                                                            | `altinn-studio-custom-components-api`, `altinn-studio-api-tools`                                       |
| `ftpb-testmotor-client`                 | `@arkitektum/ftpb-testmotor-client`                 |                                                                            | `altinn-studio-custom-components-api`, `altinn-studio-api-tools`                                       |

While running, `altinn-studio-custom-components-api` reads the Altinn apps' files from Altinn Studio and the components package's versions and files from npm, and `altinn-studio-api-tools` posts test data into Altinn apps running in LocalTest. Both read example data from the FtPB testmotor through `ftpb-testmotor-client`.

Every dependency is installed from the registry, so a change that spans repositories is released in dependency order: `altinn-studio-custom-components-utils` before `altinn-studio-custom-components`, both before `altinn-studio-custom-components-docs`, and `ftpb-app-catalogue` or `ftpb-testmotor-client` before the two applications. Each consumer then takes the new version with `yarn up <package>`.

An Altinn app references this package in `App/package.json`, copies it into `App/wwwroot` at build time and uses the components in `App/ui/`. Its texts in `App/config/texts/resource.<lang>.json` override the package's.

## 3. Runtime model

The production build (`webpack.config.js`) has one entry, `src/components/index.ts`, which becomes `main.js`. The dev server (`webpack.config.dev.js`) adds two more for the development pages, `public/scripts/devTools/index.ts` and `public/scripts/statistics/index.ts` (see §7).

### Bootstrapping in an Altinn app

1. The app loads `main.css` and `main.js` (see the README installation steps).
2. `initCustomComponents` in `src/functions/init.ts` runs on startup. On a page not served from an Altinn app origin (`https://*.apps.altinn.no`, `https://*.apps.tt02.altinn.no` or `local.altinn.cloud`) it stops there, so a page that only renders the components, such as the docs site, boots nothing. Otherwise it:
    - derives `org` and `app` from the path, and the instance id from the hash (app frontend v4) or the path (v9),
    - determines the language the way app frontend does: a `language` or `lang` in the address, else the choice saved by app frontend's language picker, else the user's profile. It takes the first of these the app has texts for, as listed by `api/v1/applicationlanguages` (one `App/config/texts/resource.<lang>.json` each), else `nb`, `nn`, `en` or the app's first language,
    - loads the app's text resources (`api/v1/texts/<lang>`) and the package's default text resources (`altinn-studio-custom-components/resource.<lang>.json` from the app's `wwwroot`), plus both in `nb` when another language is chosen, and stores them on `globalThis` (`textResources`, `defaultTextResources`, `fallbackTextResources`, `fallbackDefaultTextResources`, `selectedLanguage`),
    - on a v8 app, loads `altinn-app-frontend.js` from the Altinn CDN, in the version named by a `meta[data-altinn-app-frontend-version]` tag or a hard-coded fallback. On a v9 app, which generates its own index page with the frontend bundled (detected by `globalThis.altinnAppGlobalData`), it holds back the browser's own `DOMContentLoaded` until the text resources are in place,
    - dispatches a `DOMContentLoaded` event so the components and the Altinn frontend initialize.
3. Each custom element is registered with `customElements.define(...)` and renders itself in its `connectedCallback`.

### How a component renders

Each component's `index.ts` is thin: it defines the custom element and calls `renderCustomComponent` (`src/functions/componentRenderHelpers.ts`), which delegates the logic to a **component class**:

1. `instantiateComponent` builds the component class instance from the element's attributes, or from form data the component fetched from the app when its layout names a `dataType` (see the README, and `src/functions/appFormDataHelpers.ts`). While that fetch is under way the element carries `data-loading`. On a v9 app, an element placed by the frontend is drawn once the frontend has set its `formData` property, and again whenever its properties change.
2. If the component resolves to empty and `hideIfEmpty` applies, it is not rendered:
    - Data components show when empty unless the layout sets `hideIfEmpty`. Tables and matrices (`custom-table-data`, `custom-matrix-data` and the nine `custom-table-*` wrapper tables) hide when empty unless the layout sets `hideIfEmpty="false"`. A child component drawn inside another takes its parent's decision.
    - What is hidden is the padded `[data-summary-target]` wrapper that `addContainerElement` puts around the component, when there is one, else the component's container.
    - For layout components `hideIfEmpty` is always true, and an empty layout is removed from the document. Emptiness is checked on the data (`isEmpty`) before rendering and on the rendered output (`hasRenderedContent`) afterwards. Validation feedback counts as content.
    - In DevTools mode a hidden component is drawn as a placeholder instead.
3. Otherwise the class produces `CustomElementHtmlAttributes`, and `createCustomElement(...)` from the utils package renders the underlying base element into the DOM.
4. If any of this throws, typically because the data has an unexpected shape, the component is replaced by a short notice (`resource.componentRenderError`, "Denne delen kunne ikke vises.") so a reader of the PDF can tell something is missing. The client logger gets the component's tag, id and the error's name, never the error message, which can quote form data.

## 4. Source layout

```text
src/
├── components/            # The custom elements (thin wrappers around component classes)
│   ├── base-components/       # Primitive building blocks that take literal values
│   │                          #   (custom-field, custom-table, ...)
│   ├── data-components/       # Bound to the data model and resources. The bulk of the package
│   │                          #   (custom-field-data, custom-table-part, custom-group-*, ...)
│   │   └── shared/            # Renderers several data components draw: the group heading and empty
│   │                          #   text (childElements.ts), the eiendom table (eiendomTable.ts)
│   ├── layout-components/     # Whole-form layouts composed of many data and base components
│   │                          #   (dispensasjon, gjennomfoeringsplan, ...)
│   └── index.ts               # Registers every component (the webpack entry)
│
├── classes/
│   ├── system-classes/
│   │   ├── CustomComponent.ts         # Base class for all component classes
│   │   ├── ValidationMessages.ts      # Validation message container
│   │   ├── component-classes/         # One class per component (PascalCase), holds the logic
│   │   └── data-classes/              # System-level data wrappers
│   ├── data-classes/          # Domain data classes (Adresse, Ansvarsomraade, ...)
│   └── layout-classes/        # Domain classes for layout components
│
├── constants/             # Shared binding key lists, layout attribute schemas, date formats,
│                          #   logger endpoints and Altinn origins
├── data/                  # resources.json (source) + generated resource.<lang>.json (see §5),
│                          #   altinn/ (copies of Altinn's layout and expression schemas)
├── fonts/                 # Roboto Flex, embedded in main.css
├── functions/             # Shared helpers (init, componentHelpers, componentRenderHelpers,
│                          #   appFormDataHelpers, clientLoggerHelpers, devToolsHelpers, ...) + *.test.ts
└── styles/                # CSS

public/                    # HTML and scripts for the development pages (start page, Developer tools, Statistics)
scripts/                   # Build helpers: symlinks, resource generation, binding keys, layout schema,
                           #   refreshing the Altinn schema copies
```

### Component model

There are three component categories, mirrored by the `base-components`, `data-components` and `layout-components` directories:

- **Base components**: the most primitive building blocks (e.g. `custom-field`, `custom-paragraph`, `custom-table`). They take literal values and are not connected to a data model or to resources.
- **Data components**: connected to a data model. They read values from the model and text from the resource files. The part of the tag name after `custom-` (`field`, `paragraph`, `table`, `group`, `grouplist`, ...) indicates the rendering shape, and the suffix the concrete class or data type (or generic `data` / `text`). A data component's children may be base components or other data components.
- **Layout components**: like a group data component, but represent a complete form layout composed of multiple data and base components.

### Component classes

Every data and layout component has a class in `src/classes/system-classes/component-classes/<ComponentTagName>.ts` (PascalCase) that extends `CustomComponent`, and is mapped to its tag name in `componentMap` in `src/functions/componentHelpers.ts`. By convention these classes implement:

| Method                  | Responsibility                                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getValueFromFormData`  | Resolve the value, from `resourceValues` or by reading the binding from the data model. Often wraps the value in a domain data class.                                                                   |
| `getResourceBindings`   | Return all resource bindings the component needs. Every binding has a default and can be overridden.                                                                                                    |
| `getComponentUsage`     | List the tag names of the component's direct children. Used by the Statistics pages to know which components are used indirectly.                                                                       |
| `getValidationMessages` | Apply the component's validation rules and return a `ValidationMessages` object (often via `hasMissingTextResources`).                                                                                  |
| `hasContent`            | Return `true` only if something will be rendered. Drives `isEmpty` and therefore `hideIfEmpty`. For layout components this is the data-level check, and the rendered output is checked separately (§3). |

A class that reads `dataModelBindings` declares the keys in a `static dataModelBindingKeys` (`expected`, `oneOf`, `optional`, `deprecated`). That declaration is what `dist/dataModelBindingKeys.json` and the layout schema are generated from, and tests check that it matches what the class reads.

## 5. Resource (i18n) system

Text resources live in **`src/data/resources.json`**, the single source of truth. Each entry has an `id` and a `values` map keyed by language code:

```json
{
    "id": "resource_id",
    "values": { "nb": "Bokmål", "nn": "Nynorsk", "en": "English" }
}
```

- The **`ResourceGeneratorPlugin`** (`scripts/ResourceGeneratorPlugin.js`, run by webpack) sorts `resources.json` by `id` and writes one file per language, `src/data/resource.<lang>.json`. These generated files are not edited by hand.
- `create-symlinks.js` links the generated files into `public/data/` for the development pages.
- `copy-dist-resources` (in the `build` script) copies the resource files into `dist/`.

### Lookup order in Altinn apps

A consuming app keeps its own texts in `App/config/texts/resource.<lang>.json`. A resource binding is looked up (by `getTextResourceFromResourceBinding` in the utils package) in this order:

1. the app's texts in the chosen language
2. the package's texts in the chosen language
3. the app's texts in `nb`
4. the package's texts in `nb`

When none has it, the binding itself is shown. So an app overrides one of the package's texts by defining the same `id`.

## 6. Security model: the tag-name allow-list

Custom elements are only rendered through `createCustomElement(tagName, attributes)` in the utils package, which throws `Invalid tag name` unless `tagName` is in `customElementTagNames` (`isValidTagName`). This allow-list is the central guard against arbitrary element names being injected at render time. **A new component's tag name must be added to that list or it will not render.** See [SECURITY.md](./SECURITY.md).

## 7. Development pages

The dev server (`yarn start`) serves these pages, which are not part of the published `dist/`:

- **`index.html`**, at `/`: a start page linking to the two below.
- **`devTools.html`**, at `/devTools`: a playground. Paste layout code, data models and the app's text resources into its editors, and the components are drawn from them in a preview, with the layout checked against what each component reads and the text resources validated. It has a language picker, and the workspace can be exported and imported as a JSON file.
- **`statistics.html`**, at `/statistics`: pages over the apps in the shared catalogue: resource usage, component usage, data model bindings, subform data models, package versions, display layouts (every app's layouts drawn with its example data), render health, unshown data and an upgrade check. Each page has its own address, `/statistics/<page>` with its filter choices as a query, e.g. `/statistics/component-usage?app=et-v4`. The **Synchronize data** button fetches the data from the local **`altinn-studio-custom-components-api`** on `API_PORT` (default `9001`) and keeps it in the browser's IndexedDB. The API needs a Gitea token in its own environment (see [CONTRIBUTING](./CONTRIBUTING.md)).

DevTools mode (`?devtools=true`, see the README) is part of `main.js` and works in any page that loads the components.

## 8. Logging

Browser-side logging goes through `@arkitektum/client-logger`, wrapped in `src/functions/clientLoggerHelpers.ts`. Fetch calls log their result, errors, warnings and response time to **Elastic**. `getClientLoggerApiUrl` maps the current origin (DiBK's app origins on LocalTest, tt02 and production, listed in `src/constants/urls.ts`) to the matching `frontendlogger.*.dibk.no` URL. Any other origin gets no logger, and nothing is logged.

## 9. Build and release pipeline

The `build` script runs five steps:

```text
yarn symlinks                          # create-symlinks.js   → link generated resources into public/data
NODE_ENV=production webpack            # bundle to dist/  (uses webpack.config.js)
yarn copy-dist-resources               # copy src/data/resource.*.json + resources.json into dist/
yarn generate-data-model-binding-keys  # write dist/dataModelBindingKeys.json
yarn generate-layout-schema            # write dist/layout.schema.json
```

Only `dist/` and `README.md` are published (`package.json#files`). `dist/main.js` is the package entry (`main` / `module`).

**Tooling:** Node.js 24, Yarn 4 via Corepack (pinned through `packageManager`), Webpack 5, Babel, Jest (jsdom), ESLint (flat config), Prettier and TypeScript (`tsc --noEmit`).

**CI** (`.github/workflows/`):

- `ci.yml`: install, `yarn lint`, `yarn format:check`, `yarn typecheck`, `yarn test` and `yarn build` on push and pull request to `main`.
- `eslint.yml`: ESLint scan that uploads SARIF to the GitHub Security tab, on push and pull request to `main` and weekly.
- `build-and-publish-to-npm.yml` and `build-and-publish-to-github.yml`: when a GitHub release is created, check that the tag matches the version, then install, typecheck, test, build and publish to npm (with provenance) and to GitHub Packages. See [CONTRIBUTING](./CONTRIBUTING.md#versioning-and-releases).
