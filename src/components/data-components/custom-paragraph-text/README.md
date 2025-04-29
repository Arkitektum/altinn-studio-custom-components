# Text (paragraph)

| Property                   | Type              | Description                                                          | Default value |
| :------------------------- | :---------------- | :------------------------------------------------------------------- | :------------ |
| id                         | string            | The unique identifier for the custom field.                          |               |
| type                       | string            | The type of the custom field, which is "Custom".                     |               |
| tagName                    | string            | The tag name for the custom field, which is "custom-paragraph-text". |               |
| textResourceBindings.title | string            | The title text resource binding.                                     |               |
| styleOverride              | HTMLElement.style | The style override for the custom field.                             |               |

## Example

```json
{
    "id": "soeknadGjelder-description",
    "type": "Custom",
    "tagName": "custom-paragraph-text",
    "textResourceBindings": {
        "title": "resource.soeknadGjelder.description"
    },
    "styleOverride": {
        "color": "#FF00FF"
    }
}
```
