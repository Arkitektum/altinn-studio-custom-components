# Custom Field Address

| Property                   | Type              | Description                                                                                   | Default value |
| :------------------------- | :---------------- | :-------------------------------------------------------------------------------------------- | :------------ |
| id                         | string            | The unique identifier for the custom field.                                                   |               |
| type                       | string            | The type of the custom field, which is "Custom".                                              |               |
| tagName                    | string            | The tag name for the custom field, which is "custom-field-adresse".                           |               |
| hideTitle                  | boolean           | A flag indicating whether the title should be hidden.                                         | false         |
| hideIfEmpty                | boolean           | Determines whether the element should be hidden when it contains no content.                  | false         |
| emptyFieldText             | string            | The text to display when the field is empty.                                                  |               |
| dataModelBindings.data     | string            | Reference to an [Adresse](../../classes/Adresse.js) object in the data model with an address. |               |
| textResourceBindings.title | string            | The title text resource binding.                                                              |               |
| styleOverride              | HTMLElement.style | The style override for the custom field.                                                      |               |

## Example

```json
{
    "id": "eiendomByggested-eiendom-eiendomsidentifikasjon-adresse",
    "type": "Custom",
    "tagName": "custom-field-adresse",
    "hideTitle": true,
    "hideIfEmpty": false,
    "emptyFieldText": "-",
    "dataModelBindings": {
        "data": "eiendomByggested.eiendom.adresse"
    },
    "textResourceBindings": {
        "title": "Adresse"
    },
    "styleOverride": {
        "width": "120px"
    }
}
```
