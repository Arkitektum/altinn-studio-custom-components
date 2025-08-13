# Data (feedback list)

| Property               | Type              | Description                                                             | Default value |
| :--------------------- | :---------------- | :---------------------------------------------------------------------- | :------------ |
| id                     | string            | The unique identifier for the custom field.                             |               |
| type                   | string            | The type of the custom field, which is "Custom".                        |               |
| tagName                | string            | The tag name for the custom field, which is "custom-feedbacklist-data". |               |
| dataModelBindings.data | string            | Reference to an array in the data model containing string values.       |               |
| feedbackType           | string            | The type of feedback to be displayed (e.g., "error", "warning").        | "default"     |
| resourceValues.title   | string            | The list title.                                                         |               |
| resourceValues.data    | string            | Array of list items containing string values                            |               |
| styleOverride          | HTMLElement.style | The style override for the custom field.                                |               |

## Example

```json
{
    "id": "feedback-list",
    "type": "Custom",
    "tagName": "custom-feedbacklist-data",
    "feedbackType": "warning",
    "dataModelBindings": {
        "data": "validationMessages.warning"
    },
    "resourceValues": {
        "title": "Messages",
        "data": ["Please check your input.", "Field cannot be empty."]
    },
    "styleOverride": {
        "width": "320px"
    }
}
```
