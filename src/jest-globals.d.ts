/**
 * The jest globals, typed without importing them at runtime.
 *
 * Importing them from `@jest/globals` does not work in this repository: jest hoists every `jest.mock(...)` call
 * above the imports, so a factory that calls `jest.fn()` runs before the import has initialised and fails with
 * "Cannot read properties of undefined". Declaring them as the ambient globals they already are types the tests
 * without adding anything that has to exist at runtime.
 */
import type { FunctionLike } from "jest-mock";

declare global {
    const jest: typeof import("@jest/globals").jest;
    const describe: typeof import("@jest/globals").describe;
    const it: typeof import("@jest/globals").it;
    const test: typeof import("@jest/globals").test;
    const expect: typeof import("@jest/globals").expect;
    const beforeEach: typeof import("@jest/globals").beforeEach;
    const afterEach: typeof import("@jest/globals").afterEach;
    const beforeAll: typeof import("@jest/globals").beforeAll;
    const afterAll: typeof import("@jest/globals").afterAll;

    /** Node's `global`, which the tests reach for when they stand in a window or a text-resource collection. */
    const global: typeof globalThis;

    /**
     * `require`, which the mock factories use.
     *
     * A factory runs before the imports, so it cannot reach one; requiring the module inside the factory is how
     * jest expects that to be written. What comes back is whatever the module exports, so it is left open rather
     * than restated here for every module a factory reaches for.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function require(moduleName: string): any;

    /** The mock types, which are written as `jest.Mock` rather than imported. */
    namespace jest {
        type Mock<T extends FunctionLike = FunctionLike> = import("jest-mock").Mock<T>;
        type Mocked<T extends object> = import("jest-mock").Mocked<T>;
        type MockedFunction<T extends FunctionLike> = import("jest-mock").MockedFunction<T>;
        type SpiedFunction<T extends FunctionLike> = import("jest-mock").SpiedFunction<T>;
    }
}
