# Data (feedback list)

| Property               | Type              | Description                                                         | Default value |
| :--------------------- | :---------------- | :------------------------------------------------------------------ | :------------ |
| id                     | string            | The unique identifier for the custom field.                         |               |
| type                   | string            | The type of the custom field, which is "Custom".                    |               |
| tagName                | string            | The tag name for the custom field, which is "custom-feedback-data". |               |
| dataModelBindings.data | string            | Reference to an array in the data model containg string values.     |               |
| feedbackType           | string            | The type of feedback to be displayed (e.g., "error", "warning").    | "default"     |
| styleOverride          | HTMLElement.style | The style override for the custom field.                            |               |

## Example

```json
{
    "id": "warning-message",
    "type": "Custom",
    "tagName": "custom-feedback-data",
    "feedbackType": "warning",
    "dataModelBindings": {
        "data": "warningMessage"
    },
    "styleOverride": {
        "width": "320px"
    }
}
```
