import { IDBFactory } from "fake-indexeddb";

/**
 * Gives a test a fresh, empty IndexedDB. Only for tests: jest runs in jsdom, which has no IndexedDB.
 *
 * fake-indexeddb copies values with `structuredClone`, which jsdom does not have either, so it is defined here from
 * Node's own serializer, which follows the same structured clone rules and throws on what cannot be cloned.
 */
export function useFakeIndexedDb() {
    // Through jest rather than an import, since this repository has no Node type definitions.
    const { deserialize, serialize } = jest.requireActual("node:v8") as {
        serialize: (value: unknown) => Uint8Array;
        deserialize: (buffer: Uint8Array) => unknown;
    };
    globalThis.structuredClone ??= ((value: unknown) => deserialize(serialize(value))) as typeof structuredClone;
    globalThis.indexedDB = new IDBFactory();
}
