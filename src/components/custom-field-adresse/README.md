# Custom Field Address

## Example

```json
{
    "id": string, // The unique identifier for the custom field.
    "type": "Custom", // The type of the custom field, which is "Custom".
    "tagName": "custom-field-adresse", // The tag name for the custom field, which is "custom-field-adresse".
    "hideTitle": boolean, // A flag indicating whether the title should be hidden.
    "emptyFieldText": string, // The text to display when the field is empty.
    "dataModelBindings": {
        "data": DataModelRef<Adresse> // The data model reference for the address.
    },
    "textResourceBindings": {
        "title": string // The title text resource binding.
    },
    "styleOverride": HTMLElement.style // The style override for the custom field.
```
