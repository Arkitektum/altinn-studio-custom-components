# Contributing

This guide covers local setup, the development workflow, and the conventions for adding components and resources to `@arkitektum/altinn-studio-custom-components`. For how the package and its related repositories fit together, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Prerequisites

- **Node.js 24**
- **Yarn 4**, managed via [Corepack](https://nodejs.org/api/corepack.html). Enable it once:

    ```bash
    corepack enable
    ```

    The Yarn version is then taken from the `packageManager` field in `package.json`. If `yarn --version` does not report `4.x`, remove any globally installed Yarn 1 and enable Corepack again.

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

    - `PORT`: dev server port (default `9000`).
    - `API_PORT`: the port of the API behind the **Statistics** pages (default `9001`). Not needed for ordinary component work.

    The Statistics pages call the [`altinn-studio-custom-components-api`](https://github.com/Arkitektum/altinn-studio-custom-components-api) on `http://localhost:<API_PORT>`. To use them, clone that repository and run it (`yarn start`) with a matching port. The Gitea token it needs goes in the API's environment, not this repository's. Its README says how to create one.

    `.env` is git-ignored. Never commit tokens or secrets.

3. **Start the dev server**

    ```bash
    yarn start
    ```

    Open <http://localhost:9000>. The start page links to the **Developer tools** page and the **Statistics** pages (see [ARCHITECTURE.md §7](./ARCHITECTURE.md#7-development-pages)).

## Everyday commands

| Command                             | What it does                                                                        |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| `yarn start`                        | Start the webpack dev server with the development pages.                            |
| `yarn test`                         | Run the Jest unit tests.                                                            |
| `yarn lint`                         | Run ESLint over the repository.                                                     |
| `yarn format` / `yarn format:check` | Format with Prettier, or only check the formatting.                                 |
| `yarn typecheck`                    | Type-check with `tsc --noEmit`.                                                     |
| `yarn build`                        | Produce the publishable bundle in `dist/`.                                          |
| `yarn update-altinn-layout-schema`  | Refresh the copies of Altinn's layout and expression schemas in `src/data/altinn/`. |

Before opening a pull request, make sure `yarn lint`, `yarn format:check`, `yarn typecheck`, `yarn test` and `yarn build` all pass. CI runs the same checks.

## Adding a new component

1. **Create the element directory** under `src/components/<component-type>/<component-tag-name>/`, with an `index.ts` and, as needed, `renderers.ts` and `styles.css`. `<component-type>` is `base-components`, `data-components` or `layout-components` (see [ARCHITECTURE.md §4](./ARCHITECTURE.md#component-model)).

2. **Register the element** by importing it in `src/components/index.ts`.

3. **Add the component class** in `src/classes/system-classes/component-classes/<ComponentTagName>.ts` (PascalCase), extending `CustomComponent`, and map the tag name to it in `componentMap` in `src/functions/componentHelpers.ts`. Data and layout components implement `getValueFromFormData`, `getResourceBindings`, `getComponentUsage`, `getValidationMessages` and `hasContent` (see the [table in ARCHITECTURE.md](./ARCHITECTURE.md#component-classes)). Every resource binding must have a default value and be overridable. `hasContent` returns `true` only if the component will render something. A component that reads `dataModelBindings` declares the keys in `static dataModelBindingKeys`.

4. **Register the tag name in the allow-list.** Add it to `customElementTagNames.ts` in [`altinn-studio-custom-components-utils`](https://github.com/Arkitektum/altinn-studio-custom-components-utils), release that package, and bump the dependency here. `createCustomElement` throws for any tag name not on the list, so the component does not render until then.

5. **Add tests.** Place `*.test.ts` next to the class and functions you add.

6. **Document it.** Add the component, with an example using dummy data, to the [`altinn-studio-custom-components-docs`](https://github.com/Arkitektum/altinn-studio-custom-components-docs) gallery.

## Adding, removing, or changing a resource

- Edit **`src/data/resources.json`**, the single source of truth. Each entry:

    ```json
    {
        "id": "resource_id",
        "values": { "nb": "Bokmål", "nn": "Nynorsk", "en": "English" }
    }
    ```

    To add a resource, append an object with a unique `id` and a value for each language. While the dev server runs, saving the file sorts the entries by `id`.

- **Do not edit `src/data/resource.<lang>.json` by hand.** They are generated from `resources.json` on save and on build.

- A consuming app can override a resource by defining the same `id` in its own `App/config/texts/resource.<lang>.json` (see [ARCHITECTURE.md §5](./ARCHITECTURE.md#lookup-order-in-altinn-apps)).

## Coding conventions

- **Web standards first**: components are native custom elements, with no UI framework runtime.
- **Thin elements, fat classes**: keep element `index.ts` files limited to registration and delegation, and put logic in the component class.
- **JSDoc** on classes and exported functions.
- **Formatting and linting** via Prettier (`.prettierrc`) and ESLint (`eslint.config.mjs`).
- **Tests** colocated as `*.test.ts` and run with Jest.
- **Accessibility**: see [ACCESSIBILITY.md](./ACCESSIBILITY.md#for-contributors) when you change how a component renders.

## Pull requests

1. Branch off `main`.
2. Keep changes focused, and update or add tests.
3. Make sure the checks above pass locally.
4. Open a PR against `main`. CI (`ci.yml`) must be green before merge.

## Versioning and releases

- Bump the version in `package.json` as part of the change that warrants a release, following semantic versioning.
- A release is published by creating a GitHub Release. Its tag must be the version with a `v` in front (e.g. `v1.2.3`), or the publish workflows stop. They then install, typecheck, test, build, and publish to **npm** (with provenance) and to **GitHub Packages**.
- The npm **dist-tag** follows the release tag: a tag containing a hyphen is published under the prerelease name (`v1.2.3-beta.1` under `beta`), any other under `latest`.
- Only maintainers can publish releases.
