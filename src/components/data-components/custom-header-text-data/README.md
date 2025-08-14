# Text (header)

| Property                    | Type              | Description                                                       | Default value |
| :-------------------------- | :---------------- | :---------------------------------------------------------------- | :------------ |
| id                          | string            | The unique identifier for the custom field.                       |               |
| type                        | string            | The type of the custom field, which is "Custom".                  |               |
| tagName                     | string            | The tag name for the custom field, which is "custom-header-text". |               |
| size                        | string            | The size of the header text (e.g., "h2", "h3", "h4").             | "h2"          |
| textResourceBindings.title  | string            | The title text resource binding.                                  |               |
| dataModelBindings.dataTitle | string            | The title text formData binding.                                  |               |
| styleOverride               | HTMLElement.style | The style override for the custom field.                          |               |

## Example

```json
{
    "id": "Dispensasjon-eller-tillatelse-header",
    "type": "Custom",
    "tagName": "custom-header-text-data",
    "size": "h3",
    "resourceBindings": {
        "title": "resource.dispensasjon.eller.tillatelse.header"
    },
    "dataModelBindings": {
        "dataTitle": "soeknadensHjemmeside"
    }
}
```
