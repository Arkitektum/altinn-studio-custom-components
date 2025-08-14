# Data (field)

| Property                    | Type              | Description                                                                            | Default value |
| :-------------------------- | :---------------- | :------------------------------------------------------------------------------------- | :------------ |
| id                          | string            | The unique identifier for the custom field.                                            |               |
| type                        | string            | The type of the custom field, which is "Custom".                                       |               |
| tagName                     | string            | The tag name for the custom field, which is "custom-field-data".                       |               |
| hideIfEmpty                 | boolean           | Determines whether the element should be hidden when it contains no content.           | false         |
| dataTitleItemKey            | string            | Key for label that will be searched for in the chosen array.                           |               |
| dataTitleItemKey            | string            | Key for datathat will be searched for in the chosen array.                             |               |
| inline                      | boolean           | A flag indicating whether the title and value should be displayed on the same line.    | false         |
| dataModelBindings.dataTitle | string            | Reference to a list in the data model that will be used to display label for the data. |               |
| dataModelBindings.data      | string            | Reference to a list in the data model that will be used to display data.               |               |
| styleOverride               | HTMLElement.style | The style override for the custom field.                                               |               |

## Example

```json
{
    "id": "gjeldendePlan-andrePlaner",
    "type": "Custom",
    "tagName": "custom-field-list-data",
    "hideIfEmpty": true,
    "dataTitleItemKey": "plantype.kodebeskrivelse",
    "dataItemKey": "navn",
    "dataModelBindings": {
        "dataTitle": "planer.andrePlaner.plan",
        "data": "planer.andrePlaner.plan"
    }
}
```
