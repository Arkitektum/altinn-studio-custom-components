import Stedfesting from "./Stedfesting";
import Posisjon from "./Posisjon";
import Kode from "./Kode";

jest.mock("./Posisjon");
jest.mock("./Kode");

describe("Stedfesting", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize posisjon with a Posisjon instance when props.posisjon is provided", () => {
        const posisjonData = { lat: 60.0, lon: 10.0 };
        const props = { posisjon: posisjonData };

        const stedfesting = new Stedfesting(props);

        expect(Posisjon).toHaveBeenCalledWith(posisjonData);
        expect(stedfesting.posisjon).toBeInstanceOf(Posisjon);
    });

    it("should set posisjon to undefined when props.posisjon is not provided", () => {
        const props = {};

        const stedfesting = new Stedfesting(props);

        expect(Posisjon).not.toHaveBeenCalled();
        expect(stedfesting.posisjon).toBeUndefined();
    });

    it("should initialize vertikalnivaa with a Kode instance when props.vertikalnivaa is provided", () => {
        const vertikalnivaaData = { code: "123", description: "Test code" };
        const props = { vertikalnivaa: vertikalnivaaData };

        const stedfesting = new Stedfesting(props);

        expect(Kode).toHaveBeenCalledWith(vertikalnivaaData);
        expect(stedfesting.vertikalnivaa).toBeInstanceOf(Kode);
    });

    it("should set vertikalnivaa to undefined when props.vertikalnivaa is not provided", () => {
        const props = {};

        const stedfesting = new Stedfesting(props);

        expect(Kode).not.toHaveBeenCalled();
        expect(stedfesting.vertikalnivaa).toBeUndefined();
    });
});
