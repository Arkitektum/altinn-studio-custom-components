import { altinnAppOrigins, clientLoggerApiUrls } from "../constants/urls.ts";
import { fetchWithTimeoutAndClientLogger, getClientLoggerApiUrl, getClientLoggerInstance } from "./clientLoggerHelpers.ts";

/** A client logger that records what it is asked to post, without posting it anywhere. */
function fakeLogger() {
    const entries: { level: string; message: string; custom_fields: { key: string; value: string }[] }[] = [];
    return { entries, logger: { postLogData: (data: typeof entries) => entries.push(...data) } };
}

/** A fetch that never answers on its own, only rejecting when its request is aborted, as the real one does. */
function hangingFetch(): typeof fetch {
    return ((_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => reject(Object.assign(new Error("The operation was aborted."), { name: "AbortError" })));
        })) as typeof fetch;
}

describe("fetchWithTimeoutAndClientLogger", () => {
    const originalFetch = globalThis.fetch;
    let errorSpy: ReturnType<typeof jest.spyOn>;

    beforeEach(() => {
        errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
        errorSpy.mockRestore();
    });

    it("answers the response and logs the status and how long it took, with the caller's fields", async () => {
        const response = { ok: true, status: 200 } as unknown as Response;
        globalThis.fetch = (async () => response) as typeof fetch;
        const { entries, logger } = fakeLogger();

        const answer = await fetchWithTimeoutAndClientLogger("https://example.test/x", {}, 1000, logger as never, [{ key: "app", value: "a" }]);

        expect(answer).toBe(response);
        expect(entries).toHaveLength(1);
        expect(entries[0]!.level).toBe("Information");
        expect(entries[0]!.message).toBe("Fetched URL: https://example.test/x with status: 200");
        expect(entries[0]!.custom_fields[0]).toEqual({ key: "app", value: "a" });
        expect(entries[0]!.custom_fields[1]!.key).toBe("duration");
        expect(Number.isNaN(Number(entries[0]!.custom_fields[1]!.value))).toBe(false);
    });

    it("answers a response that is not ok as it is, leaving the status to the caller", async () => {
        globalThis.fetch = (async () => ({ ok: false, status: 404 }) as unknown as Response) as typeof fetch;

        const answer = await fetchWithTimeoutAndClientLogger("https://example.test/x");

        expect(answer!.status).toBe(404);
    });

    it("passes the caller's options through, with its own abort signal added", async () => {
        let seen: RequestInit | undefined;
        globalThis.fetch = (async (_url: string, init?: RequestInit) => {
            seen = init;
            return { ok: true, status: 200 } as unknown as Response;
        }) as typeof fetch;

        await fetchWithTimeoutAndClientLogger("https://example.test/x", { headers: { accept: "application/json" } });

        expect(seen!.headers).toEqual({ accept: "application/json" });
        expect(seen!.signal).toBeInstanceOf(AbortSignal);
    });

    it("gives up after the timeout, answering nothing and logging that it timed out", async () => {
        globalThis.fetch = hangingFetch();
        const { entries, logger } = fakeLogger();

        const answer = await fetchWithTimeoutAndClientLogger("https://example.test/slow", {}, 20, logger as never, [{ key: "app", value: "a" }]);

        expect(answer).toBeUndefined();
        expect(entries).toEqual([
            { level: "Error", message: "Request to https://example.test/slow timed out after 20ms", custom_fields: [{ key: "app", value: "a" }] }
        ]);
        expect(errorSpy).toHaveBeenCalledWith("Request to https://example.test/slow timed out after 20ms");
    });

    it("gives up on a body that stalls after the headers, within the same timeout", async () => {
        // Headers arrive at once, then the body never finishes, as with a server that stops mid-response.
        globalThis.fetch = (async (_url: string, init?: RequestInit) => ({
            ok: true,
            status: 200,
            json: () =>
                new Promise((_resolve, reject) => {
                    init?.signal?.addEventListener("abort", () =>
                        reject(Object.assign(new Error("The operation was aborted."), { name: "AbortError" }))
                    );
                })
        })) as unknown as typeof fetch;

        const answer = await fetchWithTimeoutAndClientLogger("https://example.test/stalls", {}, 20);
        const outcome = await Promise.race([
            answer!.json().then(
                () => "read",
                (error: Error) => error.name
            ),
            new Promise((resolve) => setTimeout(() => resolve("still waiting"), 500))
        ]);

        expect(outcome).toBe("AbortError");
    });

    it("answers nothing for a request that failed outright, logging why", async () => {
        globalThis.fetch = (async () => {
            throw new TypeError("Failed to fetch");
        }) as typeof fetch;
        const { entries, logger } = fakeLogger();

        const answer = await fetchWithTimeoutAndClientLogger("https://example.test/down", {}, 1000, logger as never);

        expect(answer).toBeUndefined();
        expect(entries).toEqual([
            { level: "Error", message: "Request to https://example.test/down failed with error: Failed to fetch", custom_fields: [] }
        ]);
    });

    it("works without a client logger", async () => {
        globalThis.fetch = (async () => {
            throw new TypeError("Failed to fetch");
        }) as typeof fetch;

        await expect(fetchWithTimeoutAndClientLogger("https://example.test/down")).resolves.toBeUndefined();
    });
});

describe("getClientLoggerApiUrl", () => {
    it("logs to the environment the app is served from", () => {
        expect(getClientLoggerApiUrl(altinnAppOrigins.local)).toBe(clientLoggerApiUrls.local);
        expect(getClientLoggerApiUrl(altinnAppOrigins.test)).toBe(clientLoggerApiUrls.test);
        expect(getClientLoggerApiUrl(altinnAppOrigins.production)).toBe(clientLoggerApiUrls.production);
    });

    it("falls back to the default for an origin it does not know, and says so", () => {
        const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

        expect(getClientLoggerApiUrl("https://somewhere.else")).toBe(clientLoggerApiUrls.default);
        expect(warnSpy).toHaveBeenCalledTimes(1);
        warnSpy.mockRestore();
    });
});

describe("getClientLoggerInstance", () => {
    it("logs as the PDF app, to the URL for the page's own origin", () => {
        const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

        const logger = getClientLoggerInstance() as unknown as { logApiUrl: string; appName: string };

        expect(logger.appName).toBe("a3-pdf");
        expect(logger.logApiUrl).toBe(getClientLoggerApiUrl(globalThis.location.origin));
        warnSpy.mockRestore();
    });
});
