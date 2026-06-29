# Security Policy

## Supported versions

Security fixes are released against the **latest published version** of `@arkitektum/altinn-studio-custom-components` on npm.
Please make sure you can reproduce an issue on the latest release before reporting it, and upgrade to the latest version to receive fixes.

| Version | Supported |
|---------|-----------|
| Latest release | ✅ |
| Older releases | ❌ (please upgrade) |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues, pull requests, or discussions.**

Instead, report them privately through GitHub's private vulnerability reporting:

1. Go to the repository's **Security** tab: <https://github.com/Arkitektum/altinn-studio-custom-components/security>
2. Click **Report a vulnerability** to open a private advisory.

Please include as much of the following as you can:

- A description of the vulnerability and its potential impact.
- The affected version(s) and the environment (e.g. Altinn app, the standalone dev playground).
- Step-by-step instructions to reproduce, including a minimal proof of concept if possible.
- Any suggested remediation.

### What to expect

- We will acknowledge your report and begin investigating.
- We will keep you informed of progress and let you know when a fix is released.
- Please give us a reasonable amount of time to release a fix before any public disclosure.
  We are happy to credit reporters who wish to be acknowledged.

## Scope and security model

This package renders standardized presentation components inside **Altinn Studio** apps.
A few properties of the design are relevant when assessing security:

- **Tag-name allow-list.**
  Custom elements are only created through `createCustomElement`, which rejects any tag name not present in the `customElementTagNames` allow-list maintained in [`@arkitektum/altinn-studio-custom-components-utils`](https://github.com/Arkitektum/altinn-studio-custom-components-utils).
  This is an intentional guard against arbitrary element injection; changes to it deserve extra scrutiny.
- **Data sources.**
  Components read data from the Altinn app's data model and from text resources.
  Treat all such data as untrusted and validate/escape appropriately when rendering.
- **Logging.**
  The package logs to Elastic via [`@arkitektum/client-logger`](https://github.com/Arkitektum/client-logger).
  Avoid logging personal data (PII) or secrets.
  Log messages should contain only what is needed for diagnostics.
- **Secrets.**
  No secrets belong in this repository.
  The only token used during development is a Gitea `read:repository` token for the local **Statistics** dashboard; it lives in a git-ignored `.env` file and is never bundled or published.
  See [CONTRIBUTING.md](./CONTRIBUTING.md).
- **Published surface.**
  Only `dist/` and `README.md` are published to npm.
  Development surfaces (the playground, DevTools, and Statistics pages under `public/`) are **not** part of the published package.

## Dependencies

Runtime dependencies are limited to other Arkitektum packages (`@arkitektum/altinn-studio-custom-components-utils`, `@arkitektum/client-logger`).
Static analysis of the source runs in CI via ESLint (`.github/workflows/eslint.yml`), which uploads results to the GitHub Security tab.
If you find a vulnerability in a dependency, please report it to that project as well.
