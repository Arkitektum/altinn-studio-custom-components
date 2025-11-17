import CustomDivider from "./CustomDivider";
import CustomComponent from "../CustomComponent";

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
