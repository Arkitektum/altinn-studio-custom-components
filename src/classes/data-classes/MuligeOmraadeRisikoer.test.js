import MuligeOmraadeRisikoer from "./MuligeOmraadeRisikoer";
import Omraaderisiko from "./Omraaderisiko";

describe("MuligeOmraadeRisikoer", () => {
    it("should initialize with null if no omraadeRisiko is provided", () => {
        const instance = new MuligeOmraadeRisikoer({});
        expect(instance.omraadeRisiko).toBeNull();
    });

    it("should initialize with null if omraadeRisiko is not an array", () => {
        const instance = new MuligeOmraadeRisikoer({ omraadeRisiko: "not-an-array" });
        expect(instance.omraadeRisiko).toBeNull();
    });

    it("should initialize with Omraaderisiko instances if omraadeRisiko is an array", () => {
        const data = [
            { risikotype: { kodeverdi: "A", kodebeskrivelse: "Alpha" }, sikkerhetsklasse: { kodeverdi: "1", kodebeskrivelse: "Low" } },
            { risikotype: { kodeverdi: "B", kodebeskrivelse: "Beta" }, sikkerhetsklasse: { kodeverdi: "2", kodebeskrivelse: "Medium" } }
        ];
        const instance = new MuligeOmraadeRisikoer({ omraadeRisiko: data });
        expect(Array.isArray(instance.omraadeRisiko)).toBe(true);
        expect(instance.omraadeRisiko).toHaveLength(2);
        instance.omraadeRisiko.forEach((item, idx) => {
            expect(item).toBeInstanceOf(Omraaderisiko);
            expect(item.risikotype.kodeverdi).toBe(data[idx].risikotype.kodeverdi);
            expect(item.sikkerhetsklasse.kodebeskrivelse).toBe(data[idx].sikkerhetsklasse.kodebeskrivelse);
        });
    });

    it("should initialize with null if omraadeRisiko is an empty array", () => {
        const instance = new MuligeOmraadeRisikoer({ omraadeRisiko: [] });
        expect(instance.omraadeRisiko).toBeNull();
    });
});
