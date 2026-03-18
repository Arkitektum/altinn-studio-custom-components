// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.js";

export default class CustomList extends CustomComponent {
    constructor(props) {
        super(props);
        this.isEmpty = props?.isEmpty !== undefined ? props.isEmpty : !this.hasContent(props);
        this.resourceValues = props?.resourceValues || {};
    }

    hasContent(props) {
        return hasValue(props?.resourceValues?.data);
    }
}
