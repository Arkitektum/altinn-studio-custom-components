/**
 * Keeps what a synchronization fetched between page loads, in IndexedDB.
 *
 * IndexedDB rather than localStorage, which holds about 5 MB per site: the example data alone can pass that, with one
 * example file reaching about 3 MB. IndexedDB allows far more, and stores the values as they are, without turning
 * them into JSON first.
 */

const DATABASE_NAME = "altinn-studio-custom-components-dev-tools";
const DATABASE_VERSION = 1;
const STORE_NAME = "apiData";

/**
 * Keys an older version of the dev tools wrote to localStorage. Removed on load, so they do not take up the space the
 * dev tools page's own values (the layout code, data models and text resources) share with them.
 */
export const LEGACY_LOCAL_STORAGE_KEYS = [
    "displayLayouts",
    "packageVersions",
    "latestPackageVersions",
    "multilingualAppResourceValues",
    "exampleData",
    "applicationMetadata",
    "subformDataModels",
    "defaultTextResources",
    "multilingualDefaultTextResources",
    "appResourceValues",
    "lastUpdated"
];

/**
 * Opens the database, creating its one store the first time.
 *
 * @returns {Promise<IDBDatabase>} The open database.
 */
function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
        request.onupgradeneeded = () => {
            request.result.createObjectStore(STORE_NAME);
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Replaces everything stored with the given values, keyed by name.
 *
 * All of it is written in one transaction, so a failure part of the way, such as running out of space, saves nothing
 * and leaves what was stored before as it was.
 *
 * @param {Object} values - The values to store, keyed by name.
 * @returns {Promise<void>} Resolves once the values are stored, rejects when they could not be.
 */
export async function saveApiData(values: Record<string, unknown>): Promise<void> {
    const database = await openDatabase();
    try {
        const saved: Promise<void> = new Promise((resolve, reject) => {
            const transaction = database.transaction(STORE_NAME, "readwrite");
            transaction.oncomplete = () => resolve();
            transaction.onabort = () => reject(transaction.error ?? new Error("Storing the synchronized data was aborted"));
            const store = transaction.objectStore(STORE_NAME);
            try {
                store.clear();
                for (const [key, value] of Object.entries(values)) {
                    store.put(value, key);
                }
            } catch (error) {
                // A value that cannot be stored throws here rather than failing the transaction, so without the abort
                // the clear and the values before it would still be committed.
                transaction.abort();
                reject(error);
            }
        });
        await saved;
    } finally {
        database.close();
    }
}

/**
 * Reads the stored values for the given names. A name with nothing stored reads as undefined.
 *
 * @param {string[]} keys - The names to read.
 * @returns {Promise<Object>} The stored values, keyed by name.
 */
export async function loadApiData(keys: string[]): Promise<Record<string, unknown>> {
    const database = await openDatabase();
    try {
        const loaded: Promise<Record<string, unknown>> = new Promise((resolve, reject) => {
            const transaction = database.transaction(STORE_NAME, "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const values: Record<string, unknown> = {};
            for (const key of keys) {
                const request = store.get(key);
                request.onsuccess = () => {
                    values[key] = request.result;
                };
            }
            transaction.oncomplete = () => resolve(values);
            transaction.onabort = () => reject(transaction.error ?? new Error("Reading the stored data was aborted"));
        });
        return await loaded;
    } finally {
        database.close();
    }
}

/**
 * Removes the keys in LEGACY_LOCAL_STORAGE_KEYS from localStorage, leaving every other key alone.
 */
export function removeLegacyLocalStorage() {
    for (const key of LEGACY_LOCAL_STORAGE_KEYS) {
        localStorage.removeItem(key);
    }
}
