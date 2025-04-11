import Vedlegg from "./Vedlegg";
import Kode from "./Kode";

jest.mock("./Kode");

describe("Vedlegg", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create an instance of Vedlegg with filnavn and vedleggstype as Kode instance", () => {
        const props = {
            filnavn: "example.txt",
            vedleggstype: { type: "document" }
        };

        const vedlegg = new Vedlegg(props);

        expect(vedlegg.filnavn).toBe("example.txt");
        expect(Kode).toHaveBeenCalledWith({ type: "document" });
        expect(vedlegg.vedleggstype).toBeInstanceOf(Kode);
    });

    it("should create an instance of Vedlegg with undefined filnavn and vedleggstype if props are not provided", () => {
        const vedlegg = new Vedlegg();

        expect(vedlegg.filnavn).toBeUndefined();
        expect(vedlegg.vedleggstype).toBeUndefined();
        expect(Kode).not.toHaveBeenCalled();
    });

    it("should create an instance of Vedlegg with only filnavn if vedleggstype is not provided", () => {
        const props = {
            filnavn: "example.txt"
        };

        const vedlegg = new Vedlegg(props);

        expect(vedlegg.filnavn).toBe("example.txt");
        expect(vedlegg.vedleggstype).toBeUndefined();
        expect(Kode).not.toHaveBeenCalled();
    });

    it("should create an instance of Vedlegg with only vedleggstype if filnavn is not provided", () => {
        const props = {
            vedleggstype: { type: "image" }
        };

        const vedlegg = new Vedlegg(props);

        expect(vedlegg.filnavn).toBeUndefined();
        expect(Kode).toHaveBeenCalledWith({ type: "image" });
        expect(vedlegg.vedleggstype).toBeInstanceOf(Kode);
    });
});
