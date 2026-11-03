/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://dibk.apps.tt02.altinn.no/dibk/et-v4/instance/510001/0b0c1a2e-3d4f-4a5b-8c6d-7e8f9a0b1c2d/Task_1/DisplayLayout"}
 */

import {
    getAppFormDataForElement,
    getFormDataForComponent,
    getInstanceRoute,
    pickDataElementId,
    requestAppFormData,
    resetAppFormDataCache
} from "./appFormDataHelpers.ts";
import { fetchWithTimeoutAndClientLogger } from "./clientLoggerHelpers.ts";

jest.mock("./clientLoggerHelpers.ts", () => ({ fetchWithTimeoutAndClientLogger: jest.fn() }));

const origin = "https://dibk.apps.tt02.altinn.no";
const instanceGuid = "0b0c1a2e-3d4f-4a5b-8c6d-7e8f9a0b1c2d";
const mainId = "11111111-1111-4111-8111-111111111111";
const dispensasjon1Id = "22222222-2222-4222-8222-222222222222";
const dispensasjon2Id = "33333333-3333-4333-8333-333333333333";
const gjennomfoeringsplanId = "44444444-4444-4444-8444-444444444444";
const foedselsnummerId = "55555555-5555-4555-8555-555555555555";
const instanceUrl = `${origin}/dibk/et-v4/instances/510001/${instanceGuid}`;
const pagePath = `/dibk/et-v4/instance/510001/${instanceGuid}/Task_1/DisplayLayout`;

const dataElements = [
    { id: mainId, dataType: "ET" },
    { id: dispensasjon1Id, dataType: "DispensasjonssoeknadDataV1" },
    { id: dispensasjon2Id, dataType: "DispensasjonssoeknadDataV1" },
    { id: gjennomfoeringsplanId, dataType: "GjennomfoeringsplanDataV7" },
    { id: foedselsnummerId, dataType: "FoedselsnummerTiltakshaver" }
];
const formDataById: Record<string, unknown> = {
    [mainId]: { metadata: { ftbId: "ftb-1" }, eiendomByggested: { eiendom: [{ adresse: "Testveien 1" }] } },
    [dispensasjon1Id]: { dispensasjonsreferanse: "disp-1" },
    [dispensasjon2Id]: { dispensasjonsreferanse: "disp-2" },
    [gjennomfoeringsplanId]: { versjon: "7" }
};

const okResponse = (body: unknown) => ({ ok: true, status: 200, json: async () => body }) as unknown as Response;

/** Answers the instance and its data elements the way the app API does. */
function mockAppApi() {
    jest.mocked(fetchWithTimeoutAndClientLogger).mockImplementation(async (url) => {
        if (url === instanceUrl) return okResponse({ data: dataElements });
        const id = url.split("/data/")[1]!;
        return okResponse(formDataById[id]);
    });
}

const fetchedUrls = () => jest.mocked(fetchWithTimeoutAndClientLogger).mock.calls.map(([url]) => url);

/** Lets the fetches the module started run to the end. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("getInstanceRoute", () => {
    const at = (path: string) => {
        const url = new URL(path, origin);
        return getInstanceRoute({ origin: url.origin, pathname: url.pathname, search: url.search });
    };

    it("reads the instance from a page in the main form", () => {
        expect(at(pagePath)).toEqual({ appPath: `${origin}/dibk/et-v4`, instanceId: `510001/${instanceGuid}` });
    });

    it("reads the subform entry from its route", () => {
        expect(at(`${pagePath}/subform-DispensasjonssoeknadDataV1/${dispensasjon2Id}/DispensasjonssoeknadDataV1`)?.dataElementId).toBe(
            dispensasjon2Id
        );
    });

    it("reads the subform entry of a PDF from its search parameters", () => {
        const route = at(`/dibk/et-v4/instance/510001/${instanceGuid}/Task_1?pdf=1&subformUiFolder=x&subformDataElementId=${dispensasjon1Id}`);
        expect(route?.dataElementId).toBe(dispensasjon1Id);
    });

    it("answers null for a page that shows no instance", () => {
        expect(at("/dibk/et-v4/")).toBeNull();
        expect(at("/dibk/et-v4/instance/510001/not-a-guid/Task_1")).toBeNull();
    });
});

describe("pickDataElementId", () => {
    it("picks the subform entry the page shows when it has the type", () => {
        expect(pickDataElementId(dataElements, "DispensasjonssoeknadDataV1", dispensasjon2Id)).toBe(dispensasjon2Id);
    });

    it("picks the only element of the type", () => {
        expect(pickDataElementId(dataElements, "ET", dispensasjon2Id)).toBe(mainId);
    });

    it("picks none when there are several of the type and the page does not say which", () => {
        expect(pickDataElementId(dataElements, "DispensasjonssoeknadDataV1")).toBeUndefined();
    });

    it("picks none when there is none of the type", () => {
        expect(pickDataElementId(dataElements, "Ukjent")).toBeUndefined();
    });
});

describe("getFormDataForComponent", () => {
    it("hands over the whole form data when no path is named", () => {
        expect(getFormDataForComponent(formDataById[mainId])).toBe(formDataById[mainId]);
    });

    it("hands over the value at the path as formData.data", () => {
        expect(getFormDataForComponent(formDataById[mainId], "eiendomByggested.eiendom")).toEqual({ data: [{ adresse: "Testveien 1" }] });
    });
});

describe("requestAppFormData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        resetAppFormDataCache();
        globalThis.history.replaceState(null, "", pagePath);
        mockAppApi();
    });

    it("answers pending, then ready once the data has arrived, calling back once", async () => {
        const onSettled = jest.fn();
        expect(requestAppFormData("ET", {}, onSettled)).toEqual({ status: "pending" });
        await settle();
        expect(onSettled).toHaveBeenCalledTimes(1);
        expect(requestAppFormData("ET", {}, jest.fn())).toEqual({ status: "ready", formData: formDataById[mainId] });
    });

    it("calls a waiter that asked several times back once", async () => {
        const waiter = {};
        const first = jest.fn();
        const second = jest.fn();
        requestAppFormData("ET", waiter, first);
        requestAppFormData("ET", waiter, second);
        await settle();
        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledTimes(1);
    });

    it("fetches the instance once, and only the data types asked for", async () => {
        requestAppFormData("ET", {}, jest.fn());
        requestAppFormData("GjennomfoeringsplanDataV7", {}, jest.fn());
        await settle();
        expect(fetchedUrls().sort()).toEqual([instanceUrl, `${instanceUrl}/data/${gjennomfoeringsplanId}`, `${instanceUrl}/data/${mainId}`].sort());
        expect(fetchedUrls().some((url) => url.includes(foedselsnummerId))).toBe(false);
    });

    it("answers unavailable without fetching data when the page does not say which entry", async () => {
        requestAppFormData("DispensasjonssoeknadDataV1", {}, jest.fn());
        await settle();
        expect(requestAppFormData("DispensasjonssoeknadDataV1", {}, jest.fn())).toEqual({ status: "unavailable" });
        expect(fetchedUrls()).toEqual([instanceUrl]);
    });

    it("reads the subform entry the page shows", async () => {
        globalThis.history.replaceState(null, "", `${pagePath}/subform-DispensasjonssoeknadDataV1/${dispensasjon2Id}/DispensasjonssoeknadDataV1`);
        requestAppFormData("DispensasjonssoeknadDataV1", {}, jest.fn());
        await settle();
        expect(requestAppFormData("DispensasjonssoeknadDataV1", {}, jest.fn())).toEqual({
            status: "ready",
            formData: formDataById[dispensasjon2Id]
        });
    });

    it("fetches again once the page has changed, since the frontend saves before it navigates", async () => {
        requestAppFormData("ET", {}, jest.fn());
        await settle();
        globalThis.history.replaceState(null, "", `/dibk/et-v4/instance/510001/${instanceGuid}/Task_1/Oppsummering`);
        expect(requestAppFormData("ET", {}, jest.fn())).toEqual({ status: "pending" });
        await settle();
        expect(fetchedUrls().filter((url) => url === `${instanceUrl}/data/${mainId}`)).toHaveLength(2);
    });

    it("answers unavailable and logs the address, never the data, when a fetch fails", async () => {
        const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        jest.mocked(fetchWithTimeoutAndClientLogger).mockImplementation(async (url) =>
            url === instanceUrl ? okResponse({ data: dataElements }) : ({ ok: false, status: 500 } as Response)
        );
        requestAppFormData("ET", {}, jest.fn());
        await settle();
        expect(requestAppFormData("ET", {}, jest.fn())).toEqual({ status: "unavailable" });
        expect(errorSpy).toHaveBeenCalledWith(`Could not fetch ${instanceUrl}/data/${mainId}. HTTP status: 500`);
        errorSpy.mockRestore();
    });

    it("answers unavailable on a page that shows no instance", () => {
        globalThis.history.replaceState(null, "", "/dibk/et-v4/");
        expect(requestAppFormData("ET", {}, jest.fn())).toEqual({ status: "unavailable" });
        expect(fetchWithTimeoutAndClientLogger).not.toHaveBeenCalled();
    });
});

describe("getAppFormDataForElement", () => {
    const element = (attributes: Record<string, string>) => {
        const host = document.createElement("custom-test");
        Object.entries(attributes).forEach(([name, value]) => host.setAttribute(name, value));
        return host;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        resetAppFormDataCache();
        globalThis.history.replaceState(null, "", pagePath);
        mockAppApi();
        globalThis.altinnAppGlobalData = {};
    });

    afterEach(() => {
        delete globalThis.altinnAppGlobalData;
    });

    it("answers none for an element that names no data type", () => {
        expect(getAppFormDataForElement(element({}), jest.fn())).toEqual({ status: "none" });
        expect(fetchWithTimeoutAndClientLogger).not.toHaveBeenCalled();
    });

    it("answers none on a page the v9 backend did not generate", () => {
        delete globalThis.altinnAppGlobalData;
        expect(getAppFormDataForElement(element({ dataType: "ET" }), jest.fn())).toEqual({ status: "none" });
    });

    it("hands over the value at the element's dataKey once ready", async () => {
        const host = element({ dataType: "ET", dataKey: "metadata.ftbId" });
        getAppFormDataForElement(host, jest.fn());
        await settle();
        expect(getAppFormDataForElement(host, jest.fn())).toEqual({ status: "ready", formData: { data: "ftb-1" } });
    });
});
