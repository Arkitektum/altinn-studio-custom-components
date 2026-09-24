# Architecture

This document explains how `@arkitektum/altinn-studio-custom-components` is built, how it behaves at runtime, and how it fits into the wider ecosystem of packages and applications it belongs to.
It is aimed at developers who maintain or extend the package.

For installation and usage instructions, see the [README](./README.md).
For how to contribute, see [CONTRIBUTING](./CONTRIBUTING.md).

---

## 1. What this package is

A collection of reusable **custom HTML elements** (Web Components) for **Altinn Studio** apps.
The components provide consistent, standardized presentation of domain data for digital public services, following standards from **Direktoratet for Byggkvalitet (DiBK)** on the **Fellestjenester BYGG** platform.

The package is distributed as a set of static assets (`main.js`, `main.css`, fonts, and generated resource files) that an Altinn app copies into its `wwwroot` and loads in the browser.
It is **not** a framework or a server component — everything runs client-side in the user's browser, both in the interactive form and in the generated PDF layout.

---

## 2. The ecosystem

This repository is one of several related packages and applications.
Understanding the boundaries between them is the key to understanding the architecture.

Two families of repositories share this directory. The **components family** builds and documents the custom elements an Altinn app renders. The **tooling family** posts and inspects data against a local Altinn. They are separate, and the only thing they have in common is two small packages that each family's backend uses.

**Published libraries**

| Package | Role |
| ------- | ---- |
| **`@arkitektum/altinn-studio-custom-components`** (this repo) | The custom components themselves. |
| **`@arkitektum/altinn-studio-custom-components-utils`** | Shared functions and classes — most importantly `createCustomElement`, `CustomElementHtmlAttributes`, and the **allow-list of valid custom-element tag names**. A runtime dependency of this package. |
| **`@arkitektum/client-logger`** | Helper functions and classes for logging to Elastic from the browser. A runtime dependency of this package. |
| **`@arkitektum/ftpb-testmotor-client`** | Reads example form data from the FtPB testmotor. Used by the statistics API and by the API tools. Nothing in this repository uses it. |
| **`@arkitektum/ftpb-app-catalogue`** | The Altinn Studio apps the tooling knows about, and the data type each one's form data lives under. Used by the statistics API and by the API tools. Nothing in this repository uses it. |

**Applications** (none published)

| Repository | Role |
| ---------- | ---- |
| **`altinn-studio-custom-components-docs`** | A GitHub Pages app showing every component with example data. The public gallery. Consumes this package and `-utils` from npm. |
| **`altinn-studio-custom-components-api`** | A small Node API backing the local **Statistics** dev tool in this repository. Runs on a developer's machine, not deployed. It reports which version of this package each app uses, but does not import it. |
| **`altinn-studio-api-tools`** | A separate tool for posting payloads to a local Altinn and reading them back. Nothing to do with the components; it appears here only because it shares the two FtPB packages with the statistics API. |
| **Altinn apps** (e.g. the example app) | The .NET/Altinn applications that consume this package, reference it in `App/package.json`, and copy it into `App/wwwroot` at build time. |

```text
   client-logger      utils
        │                │
        ▼                ▼
  ┌───────────────────────────────────────┐        ┌──────────────── Altinn Studio ─────────────┐
  │   @arkitektum/altinn-studio-          │        │  Altinn app                                │
  │   custom-components  (THIS PACKAGE) ──┼───────▶│   App/package.json  → dependency           │
  └───────────────────────────────────────┘        │   App/wwwroot       → copied assets        │
        │            │              │              │   App/ui/*.json     → component usage      │
        ▼            ▼              ▼              │   App/config/texts/resource.<lang>.json    │
   devTools.html  statistics.html  docs site       │     → local resources (override globals)   │
                          │           ▲            └────────────────────────────────────────────┘
                       HTTP           └── depends on utils directly as well
                          ▼
                   localhost:9001
              (custom-components-api)
                          │
                          ▼
        ftpb-testmotor-client, ftpb-app-catalogue
                          ▲
                          └── also used by altinn-studio-api-tools, which is
                              otherwise unrelated to the components

  Global resources:  src/data/resources.json ──▶ generated  src/data/resource.<lang>.json
```

See [`temp-data/relations.jpg`](./temp-data/relations.jpg) for the original overview sketch (note: `temp-data/` is working material and is not part of the published package).

---

## 3. Runtime model

The package ships three webpack entry points (`src/components/index.js`, `public/scripts/devTools/index.js`, `public/scripts/statistics/index.js`), but only `main.js` (built from the components entry) is shipped to Altinn apps.
devTools and statistics are development surfaces (see §7).

### Bootstrapping in an Altinn app

1. The app loads `main.css` and `main.js` from `wwwroot/altinn-studio-custom-components` (see the README installation steps).
2. `src/functions/init.js` (`initCustomComponents`) runs on startup. It:
   - derives `org`, `app`, and `instanceId` from the URL,
   - fetches the user's profile to determine the preferred language (falling back to `nb`),
   - loads the app's **text resources** and **default text resources** and stores them on `globalThis` (`globalThis.textResources`, `globalThis.defaultTextResources`, `globalThis.selectedLanguage`),
   - dynamically loads the matching `altinn-app-frontend.js` bundle from the Altinn CDN (the version is read from a `meta[data-altinn-app-frontend-version]` tag, with a hard-coded fallback), and
   - dispatches a `DOMContentLoaded` event so the components and the Altinn frontend initialize.
3. Each custom element is registered via `customElements.define(...)` and renders itself in its `connectedCallback`.

### How a component renders

Each component's `index.js` is thin — it defines the custom element and delegates logic to a **component class**.
The typical flow (see `src/components/data-components/custom-field-data/index.js`):

1. `instantiateComponent(this)` builds the component-class instance from the element's attributes.
2. If the component is configured with `hideIfEmpty` and resolves to empty, it is hidden (or shown as a placeholder in DevTools mode).
   What gets hidden is the padded `[data-summary-target]` wrapper that `addContainerElement` puts around the component, when there is one — hiding only the component would leave that wrapper's `0.75rem` block padding behind as an empty band. This matters for child components in particular, whose "container" is the component itself.
   Layout components differ here: `hideIfEmpty` defaults to **true** (opt out with `hideIfEmpty="false"`), and an empty layout is **removed from the document** rather than hidden with `display: none` — a top-level layout usually has no container to hide, and a hidden-but-present tag still leaves a gap in the summary view and the generated PDF.
   Emptiness is checked twice for a layout: once on the data (`isEmpty`) before rendering, and once on the rendered output afterwards, so a layout whose data is present but whose every child resolved to empty is dropped too. Validation feedback counts as content, so a layout that has messages to show is kept.
3. Otherwise the class produces `CustomElementHtmlAttributes`, and `createCustomElement(...)` (from the utils package) renders the underlying base element into the DOM.

---

## 4. Source layout

```text
src/
├── components/            # The custom elements (thin wrappers around component classes)
│   ├── base-components/       # Primitive building blocks. Take literal values; not bound to
│   │                          #   a data model or resources (custom-field, custom-table, ...)
│   ├── data-components/       # Bound to the data model + resource files. The bulk of the package
│   │                          #   (custom-field-data, custom-table-part, custom-group-*, ...)
│   ├── layout-components/     # Whole-form layouts composed of many data/base components
│   │                          #   (dispensasjon, gjennomfoeringsplan, ...)
│   └── index.js               # Registers every component (webpack entry "main")
│
├── classes/
│   ├── system-classes/
│   │   ├── CustomComponent.js         # Base class for all component classes
│   │   ├── ValidationMessages.js      # Validation message container
│   │   ├── component-classes/         # One class per component (PascalCase), holds the logic
│   │   └── data-classes/              # System-level data wrappers
│   ├── data-classes/          # Domain data classes (Adresse, Ansvarsomraade, ...)
│   └── layout-classes/        # Domain classes for layout components
│
├── constants/             # dateTimeFormats, urls (logger endpoints + Altinn origins)
├── data/                  # resources.json (source) + generated resource.<lang>.json (see §5)
├── fonts/                 # Bundled fonts (Roboto Flex, etc.)
├── functions/             # Shared helpers (componentHelpers, helpers, init, clientLoggerHelpers,
│                          #   devToolsHelpers, tableHelpers, validations, ...) + *.test.js
└── styles/                # CSS

public/                    # Dev-only HTML + scripts for the local playground, DevTools, Statistics
scripts/                   # create-symlinks.js, generate-resource-files.js, ResourceGeneratorPlugin.js
```

### Component model

There are three component categories, mirrored by the `base-components` / `data-components` / `layout-components` directories:

- **Base components** — the most primitive building blocks (e.g. `custom-field`, `custom-paragraph`, `custom-table`).
  They accept literal values as props and are not connected to a data model or to resources.
- **Data components** — connected to a data model.
  They read values from the model and text from the resource files.
  The tag name encodes intent: the part after `custom-` (`field`, `paragraph`, `table`, `group`, `grouplist`, …) indicates the rendering shape, and the suffix indicates the concrete class/data type (or generic `data` / `text`).
  A data component's children may be base components or other data components.
- **Layout components** — like a group data component, but represent a complete form layout composed of multiple data and base components.

### Component classes

Every data and layout component has a class in `src/classes/system-classes/component-classes/[ComponentTagName].js` (PascalCase) that extends `CustomComponent`.
By convention these classes implement:

| Method | Responsibility |
| ------ | -------------- |
| `getValueFromFormData` | Resolve the value — from `resourceValues` or by reading the binding from the data model. Often wraps the value in a domain data class. |
| `getResourceBindings` | Return all resource bindings the component needs. Every binding has a default and can be overridden. |
| `getComponentUsage` | List the tag names of the component's direct children. Used by the Statistics tool to know which components are used indirectly. |
| `getValidationMessages` | Apply the component's validation rules and return a `ValidationMessages` object (often via `hasMissingTextResources`). |
| `hasContent` | Decide whether the component actually renders anything; drives `isEmpty` and therefore `hideIfEmpty`. Returns `true` only if something will actually be rendered. For layout components this is the data-level check; the rendered output is verified separately by `hasRenderedContent` (see §3). |

---

## 5. Resource (i18n) system

Text resources are multilingual and live in **`src/data/resources.json`**, the single source of truth.
Each entry has an `id` and a `values` map keyed by language code:

```json
{
  "id": "resource_id",
  "values": { "nb": "Bokmål", "nn": "Nynorsk", "en": "English" }
}
```

- The **`ResourceGeneratorPlugin`** (webpack) and `scripts/generate-resource-files.js` read `resources.json` and emit one file per language, `src/data/resource.<lang>.json`, containing only that language's values.
  **These generated files must not be edited by hand** — change `resources.json` and they are regenerated (the dev server regenerates and re-sorts by `id` on save).
- `create-symlinks.js` links the generated files into `public/data/` for the dev playground.
- `copy-dist-resources` (in the `build` script) copies the resource files into `dist/` for publishing.

### Override behavior in Altinn apps

A consuming Altinn app keeps its **own** `App/config/texts/resource.<lang>.json` with app-specific resources.
If a local resource shares an `id` with one shipped by this package, **the app's local value wins**.
This lets apps override a global/common resource value.

---

## 6. Security model: the tag-name allow-list

Custom elements are only rendered through `createCustomElement(tagName, attributes)` in the utils package, which throws `Invalid tag name` unless `tagName` is present in `customElementTagNames` (`isValidTagName`).
This allow-list — maintained in `@arkitektum/altinn-studio-custom-components-utils` — is the central guard that prevents arbitrary element names from being injected at render time.
**A new component's tag name must be added to that list or it will not render.**
See [SECURITY.md](./SECURITY.md) for the threat model.

---

## 7. Development surfaces

The dev server (`yarn start`, webpack-dev-server) serves a local playground in addition to the shipped bundle:

- **`index.html`** — the component playground / tester.
- **`devTools.html`** — DevTools overlay mode (also reachable in a real app via `?devtools=true`).
  Each component gets an inspection badge color-coded by category (Base / Data / Layout).
  See the README for details.
- **`statistics.html`** — a dashboard that analyzes component usage and resource coverage across apps.
  It calls the local **`altinn-studio-custom-components-api`** on `API_PORT` (default `9001`) and therefore requires a Gitea token in `.env` (see [CONTRIBUTING](./CONTRIBUTING.md)).

These surfaces are development-only and are not part of the published `dist/`.

---

## 8. Logging

Browser-side logging goes through `@arkitektum/client-logger` (wrapped in `src/functions/clientLoggerHelpers.js`).
API/fetch calls log result, errors, warnings, and response time to **Elastic**.
The target endpoint is environment-aware — `src/constants/urls.js` maps the current Altinn app origin (local / test / production) to the matching `frontendlogger.*.dibk.no` URL.

---

## 9. Build & release pipeline

The `build` script runs three steps:

```text
yarn symlinks            # create-symlinks.js   → link generated resources into public/data
NODE_ENV=production webpack   # bundle to dist/  (uses webpack.config.js)
yarn copy-dist-resources # copy src/data/resource.*.json + resources.json into dist/
```

Only `dist/` and `README.md` are published (`package.json#files`).
`dist/main.js` is the package entry (`main` / `module`).

**Tooling:** Node.js 24, Yarn 4 via Corepack (pinned through `packageManager`), Webpack 5, Babel, Jest (jsdom), ESLint (flat config) and Prettier.

**CI** (`.github/workflows/`):

- `ci.yml` — install, `yarn test`, `yarn build` on push/PR to `main`.
- `eslint.yml` — ESLint scan, uploads SARIF to the GitHub Security tab (also on a weekly schedule).
- `build-and-publish-to-npm.yml` / `build-and-publish-to-github.yml` — on GitHub **release created**: install, test, build, then publish to npm (with `--provenance`) and to GitHub Packages.
  The dist-tag is derived from the release tag — a tag containing `-` (e.g. `1.2.3-beta.1`) publishes under that prerelease tag, otherwise `latest`.

---

## 10. Conventions

- **Web standards first.** Components are native custom elements; there is no UI framework runtime.
- **Thin elements, fat classes.** Element `index.js` files only register and delegate; logic lives in the component class.
- **JSDoc** on classes and exported functions.
- **Tests** are colocated as `*.test.js` next to the unit under test and run with Jest.
- **Formatting/linting** via Prettier (`.prettierrc`) and ESLint (`eslint.config.mjs`).
