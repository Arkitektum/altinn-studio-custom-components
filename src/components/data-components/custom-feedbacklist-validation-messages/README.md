# Validation Messages (feedback list)

| Property               | Type   | Description                                                                                                       | Default value |
| :--------------------- | :----- | :---------------------------------------------------------------------------------------------------------------- | :------------ |
| id                     | string | The unique identifier for the custom field.                                                                       |               |
| type                   | string | The type of the custom field, which is "Custom".                                                                  |               |
| tagName                | string | The tag name for the custom field, which is "custom-feedbacklist-validation-messages".                            |               |
| dataModelBindings.data | string | Reference to a [ValidationMessages](../../classes/system-classes/ValidationMessages.js) object in the data model. |               |

## Example

```json
{
    "id": "validation-messages",
    "type": "Custom",
    "tagName": "custom-feedbacklist-validation-messages",
    "dataModelBindings": {
        "data": "validationMessages"
    }
}
```
