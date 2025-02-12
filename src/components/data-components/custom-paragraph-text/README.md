# Text (paragraph)

| Property                   | Type              | Description                                                       | Default value |
| :------------------------- | :---------------- | :---------------------------------------------------------------- | :------------ |
| id                         | string            | The unique identifier for the custom field.                       |               |
| type                       | string            | The type of the custom field, which is "Custom".                  |               |
| tagName                    | string            | The tag name for the custom field, which is "custom-header-text". |               |
| textResourceBindings.title | string            | The title text resource binding.                                  |               |
| styleOverride              | HTMLElement.style | The style override for the custom field.                          |               |

## Example

```json
{
    "id": "soeknadenGjelder-description",
    "type": "Custom",
    "tagName": "custom-paragraph-text",
    "textResourceBindings": {
        "title": "resource.soeknadenGjelder.description"
    },
    "styleOverride": {
        "color": "#FF00FF"
    }
}
```
