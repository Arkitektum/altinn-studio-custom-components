# Part navn (field)

| Property                            | Type              | Description                                                                          | Default value |
| :---------------------------------- | :---------------- | :----------------------------------------------------------------------------------- | :------------ |
| id                                  | string            | The unique identifier for the custom field.                                          |               |
| type                                | string            | The type of the custom field, which is "Custom".                                     |               |
| tagName                             | string            | The tag name for the custom field, which is "custom-field-ansvarlig-soeker".         |               |
| hideTitle                           | boolean           | A flag indicating whether the title should be hidden.                                | false         |
| hideIfEmpty                         | boolean           | Determines whether the element should be hidden when it contains no content.         | false         |
| hideOrgNr                           | boolean           | Organization number is not appended after the name when set to true                  | false         |
| inline                              | boolean           | A flag indicating whether the title and value should be displayed on the same line.  | false         |
| dataModelBindings.data              | string            | Reference to an [Part](../../classes/data-classes/Part.js) object in the data model. |               |
| textResourceBindings.title          | string            | The title text resource binding.                                                     |               |
| textResourceBindings.emptyFieldText | string            | The resource binding for the text to display when the field is empty.                |               |
| styleOverride                       | HTMLElement.style | The style override for the custom field.                                             |               |

## Example

Rendered HTML

```html
<div class="field" style="display: flex; flex-direction: column;">
    <span class="fds-paragraph fds-paragraph--md" style="white-space: pre-line;">HUSNES OG OPPDAL Organisasjonsnummer: 910598023</span>
</div>
```

DisplayLayout.json

```json
{
    "id": "ansvarligSoeker-navn",
    "type": "Custom",
    "tagName": "custom-field-part-navn",
    "hideTitle": true,
    "hideIfEmpty": false,
    "hideOrgNr": false,
    "inline": false,
    "dataModelBindings": {
        "data": "ansvarligSoeker"
    },
    "textResourceBindings": {
        "title": "resource.ansvarligSoeker",
        "emptyFieldText": "resource.emptyFieldText.default"
    },
    "styleOverride": {
        "width": "300px"
    }
}
```
