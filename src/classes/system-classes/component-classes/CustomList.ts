import type { ComponentProps } from "../../../types.ts";
// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.ts";

export default class CustomList extends CustomComponent {
    constructor(props: ComponentProps) {
        super(props);
        this.isEmpty = props?.isEmpty !== undefined ? props.isEmpty : !this.hasContent(props);
        this.resourceValues = props?.resourceValues || {};
    }

    hasContent(props?: ComponentProps): boolean {
        return hasValue(props?.resourceValues?.data);
    }
}
