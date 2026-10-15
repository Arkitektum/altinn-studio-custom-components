# Accessibility

`@arkitektum/altinn-studio-custom-components` presents data in Altinn Studio apps, mostly in PDF and receipt layouts. The components aim to support [WCAG 2.1](https://www.w3.org/TR/WCAG21/) level AA, which the Norwegian regulations on universal design of ICT (universell utforming) require of public digital services, with some exceptions.

That is an aim, not a claim. No accessibility audit has been done, and there are no automated accessibility tests yet. This page describes what the components do today, what they leave to the app, and how to report a problem.

## What the components do

- **Headings** are real `h1` to `h6` elements. The `size` attribute chooses the level, and `h2` is the default.
- **Tables** are real tables, with header cells marked `scope="col"`. A matrix also marks its row headers `scope="row"`. A table or matrix with a title gets it as a `caption`.
- **Lists** are real lists: `ul` and `li` for a list, `dl`, `dt` and `dd` for a description list. A list with a title is labelled by it with `aria-labelledby`.
- **Fields** put the title right before the value, so a screen reader reads them as a pair.
- **Images** take their alt text from the `alt` resource binding, and fall back to the title.
- **Feedback lists** open and close with the native `details` and `summary` elements, which work with the keyboard.
- **Data and text resources** are inserted as text, so any markup in them is shown rather than run. The one exception is `enableLinks`, which turns web addresses in a value into links.

## What is left to the app

- **The page:** its language, title, landmarks, focus order and navigation come from the Altinn app, not from these components.
- **The PDF:** Altinn's PDF generation turns the layout into a PDF. Whether that PDF is tagged and readable with assistive technology is outside this package.
- **The content:** titles, text resources and alt texts are written in the app. A component can only be as clear as the text it is given.
- **`styleOverride`:** styles set in a layout can lower contrast or hide content. The contrast of the package's own stylesheet has not been measured.

## Advice for app developers

- Keep heading levels in order, and use `size` to avoid skipping a level.
- Give every image an `alt` resource binding that says what the image shows.
- Give tables and lists a title, so they get a caption or a label.
- Be careful with `styleOverride` on colours, font sizes and `display`.

## Reporting a problem

Please open an issue at <https://github.com/Arkitektum/altinn-studio-custom-components/issues>, and include:

- the component's tag name, and the part of the layout file that uses it
- what you expected, and what happened instead
- the assistive technology, browser and operating system you used, if any
- whether the problem is on the page, in the PDF, or both

## For contributors

When you change how a component renders:

- use the HTML element that means what the content is, such as a heading, a table or a list, rather than a styled `div`
- keep a title before its value, give tables header cells with `scope`, and label lists with their title
- put data in with `textContent`, so any markup in it is shown rather than run
- check the result with the keyboard, and with a screen reader such as VoiceOver or NVDA

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to work on the package.
