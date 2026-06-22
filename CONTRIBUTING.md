# Contributing

Thanks for contributing to `@arkitektum/altinn-studio-custom-components`!
This guide covers local setup, the development workflow, and the conventions for adding components and resources.

For a high-level picture of how the package and its sibling repositories fit together, read [ARCHITECTURE.md](./ARCHITECTURE.md) first.

---

## Prerequisites

- **Node.js 24**
- **Yarn 4**, managed via [Corepack](https://nodejs.org/api/corepack.html). Enable it once:

  ```bash
  corepack enable
  ```

  The correct Yarn version is then activated automatically from the `packageManager` field in `package.json`.
  (The CI removes any preinstalled Yarn 1 and uses Corepack — do the same locally if `yarn --version` does not report `4.x`.)

---

## Getting started

1. **Clone and install**

   ```bash
   git clone https://github.com/Arkitektum/altinn-studio-custom-components.git
   cd altinn-studio-custom-components
   yarn install
   ```

2. **Create your `.env`**

   ```bash
   cp .env.sample .env
   ```

   - `PORT` — dev server port (default `9000`).
   - `API_PORT` and `GITEA_TOKEN` — **only** needed for the local **Statistics** dashboard, which talks to the `altinn-studio-custom-components-api`.
     You can skip these for ordinary component work.

   To use the Statistics dashboard, generate a Gitea token:
   - Go to <https://altinn.studio/repos/user/settings/applications>
   - Create a token with the **`read:repository`** scope
   - Put it in `.env` as `GITEA_TOKEN` (replacing `your_token_here`)

   > ⚠️ `.env` is git-ignored. Never commit tokens or secrets.

3. **Start the dev server**

   ```bash
   yarn start
   ```

   Open <http://localhost:9000>.
   The playground links to a component tester, the **Developer tools** page, and the **Statistics** page.

---

## Everyday commands

| Command | What it does |
| ------- | ------------ |
| `yarn start` | Start the webpack dev server / playground. |
| `yarn test` | Run the Jest unit tests. |
| `yarn lint` | Run ESLint over `src`. |
| `yarn build` | Produce the publishable bundle in `dist/`. |

Before opening a pull request, make sure `yarn test`, `yarn lint`, and `yarn build` all pass — CI runs the same checks.

---

## Adding a new component

1. **Create the element directory** under `src/components/<component-type>/<component-tag-name>/` and add the files it needs (`index.js`, plus `README.md`, `styles.css`, etc. as appropriate).
   `<component-type>` is one of:
   - `base-components` — primitive building blocks; accept literal values; not bound to a data model or resources.
   - `data-components` — bound to the data model and resources.
     The first segment after `custom-` (`field`, `paragraph`, `table`, `group`, `grouplist`, …) signals the rendering shape; the suffix names the class/data type (or generic `data` / `text`).
     Children may be base components or other data components.
   - `layout-components` — a complete form layout composed of multiple data and base components.

2. **Register the element** by importing it in `src/components/index.js`.

3. **Add the component class** in `src/classes/system-classes/component-classes/<ComponentTagName>.js` (PascalCase), extending `CustomComponent`.
   Data and layout components should implement:

   - `getValueFromFormData` — resolve the value from `resourceValues` or the data-model binding; often instantiate a domain data class from `src/classes/data-classes` or `src/classes/system-classes/data-classes`.
   - `getResourceBindings` — return all resource bindings; each must have a default value and be overridable.
   - `getComponentUsage` — return the tag names of the component's direct children (used by the Statistics tool).
   - `getValidationMessages` — return a `ValidationMessages` object (often via `hasMissingTextResources`, passing the bindings from `getResourceBindings`).
   - `hasContent` — drive the `isEmpty` / `hideIfEmpty` behavior.
     Return `true` **only** if the component will actually render something (e.g. if it has data but nothing is rendered, return `false`).

4. **Register the tag name in the allow-list.**
   Add the new tag name to `customElementTagNames.js` in the [`altinn-studio-custom-components-utils`](https://github.com/Arkitektum/altinn-studio-custom-components-utils) package.
   This is required for security reasons — `createCustomElement` throws for any tag name not on the list, so the component will not render until it is added (and the updated utils version is released and bumped here).

5. **Add tests.**
   Place `*.test.js` next to the class/functions you add and cover the logic with Jest.

6. **Document it.**
   Add an example with dummy data to the [`altinn-studio-custom-components-docs`](https://github.com/Arkitektum/altinn-studio-custom-components-docs) gallery.

---

## Adding, removing, or changing a resource

- Edit **`src/data/resources.json`** — the single source of truth. Each entry:

  ```json
  {
    "id": "resource_id",
    "values": { "nb": "Bokmål", "nn": "Nynorsk", "en": "English" }
  }
  ```

  To add a resource, append a new object with a unique `id` and a value per supported language.
  While the dev server runs, saving the file re-sorts entries by `id` automatically.

- **Do not edit `src/data/resource.<lang>.json` by hand.**
  Those per-language files are generated from `resources.json` and are regenerated on save / build.

- **Overrides:** a consuming Altinn app may define the same `id` in its own `App/config/texts/resource.<lang>.json`; the app's local value takes precedence over the value shipped here.

---

## Coding conventions

- **Web standards first** — components are native custom elements; there is no UI framework runtime.
- **Thin elements, fat classes** — keep element `index.js` files limited to registration and delegation; put logic in the component class.
- **JSDoc** on classes and exported functions.
- **Formatting & linting** via Prettier (`.prettierrc`) and ESLint (`eslint.config.mjs`).
  Run `yarn lint` before pushing.
- **Tests** colocated as `*.test.js` and run with Jest.

---

## Pull requests

1. Branch off `main`.
2. Keep changes focused; update or add tests and documentation.
3. Ensure `yarn test`, `yarn lint`, and `yarn build` pass locally.
4. Open a PR against `main`. CI (`ci.yml` and the ESLint scan) must be green before merge.

---

## Versioning & releases

- Releases are **triggered by creating a GitHub Release**.
  The publish workflows then install, test, build, and publish to **npm** (with provenance) and to **GitHub Packages**.
- The npm **dist-tag** is derived from the release tag: a tag containing a hyphen (e.g. `1.2.3-beta.1`) is published under that prerelease tag; otherwise it goes to `latest`.
- Bump the version in `package.json` as part of the change that warrants a release, following semantic versioning.

> Only maintainers can publish releases.
