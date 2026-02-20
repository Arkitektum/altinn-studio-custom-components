import VegtypeTillatelseList from "./VegtypeTillatelseList";

describe("VegtypeTillatelseList", () => {
    const kodeKommunal = { kodeverdi: "KommunalVeg", navn: "Kommunal veg" };
    const kodePrivat = { kodeverdi: "PrivatVeg", navn: "Privat veg" };
    const kodeRiksFylkes = { kodeverdi: "RiksFylkesveg", navn: "Riks/Fylkesveg" };
    const kodeUnknown = { kodeverdi: "UkjentVeg", navn: "Ukjent veg" };

    it("should return empty data array if vegtype or vegtype.kode is missing", () => {
        expect(new VegtypeTillatelseList({}).resourceValues.data).toEqual([]);
        expect(new VegtypeTillatelseList({ vegtype: {} }).resourceValues.data).toEqual([]);
        expect(new VegtypeTillatelseList({ vegtype: { kode: [] } }).resourceValues.data).toEqual([]);
    });

    it("should map permissions correctly for each kode", () => {
        const props = {
            vegtype: { kode: [kodeKommunal, kodePrivat, kodeRiksFylkes] },
            erTillatelseGittKommunalVeg: true,
            erTillatelseGittPrivatVeg: false,
            erTillatelseGittRiksFylkesveg: true
        };
        const list = new VegtypeTillatelseList(props).resourceValues.data;
        expect(list).toEqual([
            { kode: kodeKommunal, erTillatelseGitt: true },
            { kode: kodePrivat, erTillatelseGitt: false },
            { kode: kodeRiksFylkes, erTillatelseGitt: true }
        ]);
    });

    it("should return null for unknown kodeverdi", () => {
        const props = {
            vegtype: { kode: [kodeUnknown] },
            erTillatelseGittKommunalVeg: true,
            erTillatelseGittPrivatVeg: false,
            erTillatelseGittRiksFylkesveg: true
        };
        const list = new VegtypeTillatelseList(props).resourceValues.data;
        expect(list).toEqual([{ kode: kodeUnknown, erTillatelseGitt: null }]);
    });

    it("should handle missing permission flags gracefully", () => {
        const props = {
            vegtype: { kode: [kodeKommunal, kodePrivat, kodeRiksFylkes] }
            // No permission flags provided
        };
        const list = new VegtypeTillatelseList(props).resourceValues.data;
        expect(list).toEqual([
            { kode: kodeKommunal, erTillatelseGitt: undefined },
            { kode: kodePrivat, erTillatelseGitt: undefined },
            { kode: kodeRiksFylkes, erTillatelseGitt: undefined }
        ]);
    });

    describe("getBooleanValueForErTillatelseGitt", () => {
        const instance = new VegtypeTillatelseList({});
        const props = {
            erTillatelseGittKommunalVeg: true,
            erTillatelseGittPrivatVeg: false,
            erTillatelseGittRiksFylkesveg: null
        };

        it("returns correct boolean for KommunalVeg", () => {
            expect(instance.getBooleanValueForErTillatelseGitt(props, "KommunalVeg")).toBe(true);
        });

        it("returns correct boolean for PrivatVeg", () => {
            expect(instance.getBooleanValueForErTillatelseGitt(props, "PrivatVeg")).toBe(false);
        });

        it("returns correct value for RiksFylkesveg", () => {
            expect(instance.getBooleanValueForErTillatelseGitt(props, "RiksFylkesveg")).toBeNull();
        });

        it("returns null for unknown kodeverdi", () => {
            expect(instance.getBooleanValueForErTillatelseGitt(props, "UkjentVeg")).toBeNull();
        });
    });
});
