# Security Policy

## Supported versions

Security fixes are released against the **latest published version** of `@arkitektum/altinn-studio-custom-components` on npm. Please make sure you can reproduce an issue on the latest release before reporting it, and upgrade to the latest version to receive fixes.

| Version        | Supported           |
| -------------- | ------------------- |
| Latest release | Yes                 |
| Older releases | No (please upgrade) |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues, pull requests, or discussions.**

Instead, report them privately through GitHub's private vulnerability reporting:

1. Go to the repository's **Security** tab: <https://github.com/Arkitektum/altinn-studio-custom-components/security>
2. Click **Report a vulnerability** to open a private advisory.

Please include as much of the following as you can:

- A description of the vulnerability and its potential impact.
- The affected version(s) and the environment (e.g. an Altinn app, or the development pages).
- Step-by-step instructions to reproduce, including a minimal proof of concept if possible.
- Any suggested remediation.

### What to expect

- We will acknowledge your report and begin investigating.
- We will keep you informed of progress and let you know when a fix is released.
- Please give us a reasonable amount of time to release a fix before any public disclosure. We are happy to credit reporters who wish to be acknowledged.

## Scope and security model

This package renders presentation components inside **Altinn Studio** apps. These properties of the design matter when assessing security:

- **Tag-name allow-list.** Custom elements are only created through `createCustomElement`, which rejects any tag name not in the `customElementTagNames` allow-list maintained in [`@arkitektum/altinn-studio-custom-components-utils`](https://github.com/Arkitektum/altinn-studio-custom-components-utils). This is a guard against arbitrary element injection, and changes to it deserve extra scrutiny.
- **Data sources.** Components read data from the app's data model, from the app's form data API (when a layout names a `dataType`) and from text resources. All of it is treated as untrusted and inserted as text. The one exception is the `enableLinks` attribute, which turns web addresses in a value into links through `injectAnchorElements` in `src/functions/dataFormatHelpers.ts`.
- **Requests.** The components call the app's own API and files, with the user's own login, and the client logger. On a v8 app they also load the Altinn app frontend from the Altinn CDN. Initialization runs only on Altinn app origins (`https://*.apps.altinn.no`, `https://*.apps.tt02.altinn.no` and `local.altinn.cloud`).
- **Logging.** The package logs to Elastic via [`@arkitektum/client-logger`](https://github.com/Arkitektum/client-logger), and only on DiBK's own app origins. Log entries must not contain personal data or secrets, only what is needed for diagnostics.
- **Secrets.** No secrets belong in this repository. The only token used in development is a Gitea `read:repository` token for the separate statistics API, which lives in that API's environment and is never bundled or published. See [CONTRIBUTING.md](./CONTRIBUTING.md).
- **Published surface.** Only `dist/` and `README.md` are published to npm. The development pages under `public/` (the start page, Developer tools and Statistics) are not part of the published package. DevTools mode (`?devtools=true`) is part of `main.js`.

## Dependencies

Runtime dependencies are limited to other Arkitektum packages (`@arkitektum/altinn-studio-custom-components-utils`, `@arkitektum/client-logger`). Static analysis of the source runs in CI via ESLint (`.github/workflows/eslint.yml`), which uploads results to the GitHub Security tab. Dependabot keeps the GitHub Actions in the workflows up to date. If you find a vulnerability in a dependency, please report it to that project as well.
