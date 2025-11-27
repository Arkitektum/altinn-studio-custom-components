import Respons from "./Respons";
import Kode from "./Kode";

jest.mock("./Kode");

describe("Respons", () => {
    beforeEach(() => {
        Kode.mockClear();
    });

    it("should set all properties when all props are provided", () => {
        const props = {
            erMerknadMottatt: true,
            erSamtykkeMottatt: false,
            nabovarselSendt: "2024-06-01",
            nabovarselSendtVia: { kode: "EMAIL" },
            samtykkeMottattDato: "2024-06-02"
        };
        const kodeInstance = { some: "kode" };
        Kode.mockImplementation(() => kodeInstance);

        const respons = new Respons(props);

        expect(respons.erMerknadMottatt).toBe(true);
        expect(respons.erSamtykkeMottatt).toBe(false);
        expect(respons.nabovarselSendt).toBe("2024-06-01");
        expect(Kode).toHaveBeenCalledWith(props.nabovarselSendtVia);
        expect(respons.nabovarselSendtVia).toBe(kodeInstance);
        expect(respons.samtykkeMottattDato).toBe("2024-06-02");
    });

    it("should set nabovarselSendtVia to undefined if not provided", () => {
        const props = {
            erMerknadMottatt: false,
            erSamtykkeMottatt: true,
            nabovarselSendt: "2024-06-01",
            samtykkeMottattDato: "2024-06-04"
        };

        const respons = new Respons(props);

        expect(respons.nabovarselSendtVia).toBeUndefined();
        expect(Kode).not.toHaveBeenCalled();
    });

    it("should handle missing props gracefully", () => {
        const respons = new Respons();

        expect(respons.erMerknadMottatt).toBeUndefined();
        expect(respons.erSamtykkeMottatt).toBeUndefined();
        expect(respons.merknadMottattDato).toBeUndefined();
        expect(respons.nabovarselSendtVia).toBeUndefined();
        expect(respons.samtykkeMottattDato).toBeUndefined();
    });

    it("should handle nabovarselSendtVia as a string", () => {
        const props = {
            nabovarselSendtVia: "SMS"
        };
        const kodeInstance = { kode: "SMS" };
        Kode.mockImplementation(() => kodeInstance);

        const respons = new Respons(props);

        expect(Kode).toHaveBeenCalledWith("SMS");
        expect(respons.nabovarselSendtVia).toBe(kodeInstance);
    });
});
