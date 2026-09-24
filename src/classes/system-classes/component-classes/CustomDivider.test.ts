import CustomComponent from "../CustomComponent.ts";
import CustomDivider from "./CustomDivider.ts";

describe("CustomDivider", () => {
    it("should be an instance of CustomDivider", () => {
        const divider = new CustomDivider({});
        expect(divider).toBeInstanceOf(CustomDivider);
    });

    it("should extend CustomComponent", () => {
        const divider = new CustomDivider({});
        expect(divider).toBeInstanceOf(CustomComponent);
    });
});
