# Text (header)

| Property               | Type              | Description                                                       | Default value |
| :--------------------- | :---------------- | :---------------------------------------------------------------- | :------------ |
| id                     | string            | The unique identifier for the custom field.                       |               |
| type                   | string            | The type of the custom field, which is "Custom".                  |               |
| tagName                | string            | The tag name for the custom field, which is "custom-header-text". |               |
| size                   | string            | The size of the header text (e.g., "h2", "h3", "h4").             | "h2"          |
| resourceBindings.title | string            | The title text resource binding.                                  |               |
| styleOverride          | HTMLElement.style | The style override for the custom field.                          |               |

## Example

```json
{
    "id": "soeknadGjelder-header",
    "type": "Custom",
    "tagName": "custom-header-text",
    "size": "h2",
    "resourceBindings": {
        "title": "resource.soeknadGjelder.title"
    },
    "styleOverride": {
        "color": "#FF00FF"
    }
}
```
