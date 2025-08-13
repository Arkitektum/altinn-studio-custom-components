# Data (table)

| Property                                            | Type              | Description                                                                            | Default value |
| :-------------------------------------------------- | :---------------- | :------------------------------------------------------------------------------------- | :------------ |
| id                                                  | string            | The unique identifier for the custom field.                                            |               |
| type                                                | string            | The type of the custom field, which is "Custom".                                       |               |
| tagName                                             | string            | The tag name for the custom field, which is "custom-table-data".                       |               |
| hideTitle                                           | boolean           | A flag indicating whether the title should be hidden.                                  | false         |
| hideIfEmpty                                         | boolean           | Determines whether the element should be hidden when it contains no content.           | false         |
| size                                                | string            | The size of the header text (e.g., "h2", "h3", "h4").                                  | "h2"          |
| dataModelBindings.data                              | string            | Reference to an array or object in the data model containing values for the table      |               |
| tableColumns                                        | array             | An array of column definitions for the table.                                          |               |
| tableColumns[index].dataKey                         | string            | Property name or property path in data object containing the value for the table cell. |               |
| tableColumns[index].tagName                         | string            | The tag name for the custom component in the table cell.                               |               |
| tableColumns[index].format                          | string            | The format of the data value, e.g., "date", "time", etc.                               |               |
| tableColumns[index].resourceBindings.title          | string            | The resource binding for the column title.                                             |               |
| tableColumns[index].resourceBindings.emptyFieldText | string            | The resource binding for the text to display when the field is empty.                  |               |
| resourceBindings.title                              | string            | The title text resource binding.                                                       |               |
| resourceBindings.emptyFieldText                     | string            | The resource binding for the text to display when the field is empty.                  |               |
| styleOverride                                       | HTMLElement.style | The style override for the custom field.                                               |               |

## Example

```json
{
    "id": "delsoeknader-delsoeknad",
    "type": "Custom",
    "tagName": "custom-table-data",
    "hideTitle": false,
    "hideIfEmpty": false,
    "size": "h2",
    "dataModelBindings": {
        "data": "delsoeknader.delsoeknad"
    },
    "tableColumns": [
        {
            "dataKey": "delsoeknadsnummer",
            "tagName": "custom-field-data",
            "resourceBindings": {
                "title": "resource.delsoeknader.delsoeknad.delsoeknadsnummer.title",
                "emptyFieldText": "resource.emptyFieldText.default"
            }
        },
        {
            "dataKey": "delAvTiltaket",
            "tagName": "custom-field-data",
            "resourceBindings": {
                "title": "resource.delsoeknader.delsoeknad.delAvTiltaket.title",
                "emptyFieldText": "resource.emptyFieldText.default"
            }
        },
        {
            "dataKey": "tillatelsedato",
            "tagName": "custom-field-data",
            "format": "date",
            "resourceBindings": {
                "title": "resource.delsoeknader.delsoeknad.tillatelsedato.title",
                "emptyFieldText": "resource.emptyFieldText.default"
            }
        },
        {
            "dataKey": "kommentar",
            "tagName": "custom-field-data",
            "resourceBindings": {
                "title": "resource.delsoeknader.delsoeknad.kommentar.title",
                "emptyFieldText": "resource.emptyFieldText.default"
            }
        }
    ],
    "resourceBindings": {
        "title": "resource.soeknadGjelder.header",
        "emptyFieldText": "resource.eiendomByggested.eiendom.emptyFieldText"
    },
    "styleOverride": {
        "width": "400px"
    }
}
```
