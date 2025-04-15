# Data (table)

| Property                                      | Type              | Description                                                                            | Default value |
| :-------------------------------------------- | :---------------- | :------------------------------------------------------------------------------------- | :------------ |
| id                                            | string            | The unique identifier for the custom field.                                            |               |
| type                                          | string            | The type of the custom field, which is "Custom".                                       |               |
| tagName                                       | string            | The tag name for the custom field, which is "custom-table-data".                       |               |
| hideTitle                                     | boolean           | A flag indicating whether the title should be hidden.                                  | false         |
| hideIfEmpty                                   | boolean           | Determines whether the element should be hidden when it contains no content.           | false         |
| size                                          | string            | The size of the header text (e.g., "h2", "h3", "h4").                                  | "h2"          |
| dataModelBindings.data                        | string            | Reference to an array or object in the data model containing values for the table      |               |
| tableColumns                                  | array             | An array of column definitions for the table.                                          |               |
| tableColumns[index].titleResourceKey          | string            | The resource key for the column title.                                                 |               |
| tableColumns[index].emptyFieldTextResourceKey | string            | The resource key for the text to display when the field is empty.                      |               |
| tableColumns[index].dataKey                   | string            | Property name or property path in data object containing the value for the table cell. |               |
| tableColumns[index].tagName                   | string            | The tag name for the custom component in the table cell.                               |               |
| tableColumns[index].props                     | object            | Additional properties for the custom component in the table cell.                      |               |
| textResourceBindings.title                    | string            | The title text resource binding.                                                       |               |
| textResourceBindings.emptyFieldText           | string            | The resource binding for the text to display when the field is empty.                  |               |
| styleOverride                                 | HTMLElement.style | The style override for the custom field.                                               |               |

## Example

```json
{
    "id": "eiendomByggested-eiendom",
    "type": "Custom",
    "tagName": "custom-table-data",
    "hideTitle": true,
    "hideIfEmpty": false,
    "size": "h2",
    "dataModelBindings": {
        "data": "eiendomByggested.eiendom"
    },
    "tableColumns": [
        {
            "titleResourceKey": "col-1",
            "emptyFieldTextResourceKey": "emptyFieldText-address",
            "dataKey": "adresse",
            "tagName": "custom-field-adresse",
            "props": {
                "styleOverride": {
                    "width": "200px"
                }
            }
        },
        {
            "titleResourceKey": "col-2",
            "emptyFieldTextResourceKey": "emptyFieldText-default",
            "dataKey": "eiendomsidentifikasjon.gaardsnummer",
            "tagName": "custom-field-data"
        },
        {
            "titleResourceKey": "col-3",
            "emptyFieldTextResourceKey": "emptyFieldText-default",
            "dataKey": "eiendomsidentifikasjon.bruksnummer",
            "tagName": "custom-field-data"
        },
        {
            "titleResourceKey": "col-4",
            "emptyFieldTextResourceKey": "emptyFieldText-default",
            "dataKey": "eiendomsidentifikasjon.seksjonsnummer",
            "tagName": "custom-field-data"
        },
        {
            "titleResourceKey": "col-5",
            "emptyFieldTextResourceKey": "emptyFieldText-default",
            "dataKey": "eiendomsidentifikasjon.festenummer",
            "tagName": "custom-field-data"
        },
        {
            "titleResourceKey": "col-6",
            "emptyFieldTextResourceKey": "emptyFieldText-default",
            "dataKey": "bolignummer",
            "tagName": "custom-field-data"
        },
        {
            "titleResourceKey": "col-7",
            "emptyFieldTextResourceKey": "emptyFieldText-default",
            "dataKey": "bygningsnummer",
            "tagName": "custom-field-data"
        }
    ],
    "textResourceBindings": {
        "title": "resource.soeknadenGjelder.header",
        "col-1": "resource.eiendomByggested.eiendom.adresse.title",
        "col-2": "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.gaardsnummer.title",
        "col-3": "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.bruksnummer.title",
        "col-4": "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.seksjonsnummer.title",
        "col-5": "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.festenummer.title",
        "col-6": "resource.eiendomByggested.eiendom.bolignummer.title",
        "col-7": "resource.eiendomByggested.eiendom.bygningsnummer.title",
        "emptyFieldText": "resource.eiendomByggested.eiendom.emptyFieldText",
        "emptyFieldText-address": "resource.eiendomByggested.eiendom.adresse.emptyFieldText",
        "emptyFieldText-default": "-"
    },
    "styleOverride": {
        "width": "400px"
    }
}
```
