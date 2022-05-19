import { Store } from "pinia";
import { UnwrapRef } from "vue";
declare type S = new () => any;
interface StoreOptions {
    name?: string;
    id?: string;
    state?: Record<string, any>;
    getters?: Record<string, (state: S) => any>;
    actions?: Record<string, (...args: any[]) => any>;
    hydrate?(storeState: UnwrapRef<S>, initialState: UnwrapRef<S>): void;
    [key: string]: any;
}
export declare function Store(options?: StoreOptions): <C extends S>(target: C) => C;
export declare function Store<C extends S>(target: C): C;
export declare function createDecorator(factory: (options: StoreOptions, key: string, index?: number) => void): (target: any, key: string, index?: number | undefined) => void;
export declare const Pinia: new () => Store;
export {};
