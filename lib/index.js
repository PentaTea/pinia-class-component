import { defineStore } from "pinia";
export function Store(options) {
    if (typeof options === "function") {
        return storeFactory(options);
    }
    return function (Store) {
        return storeFactory(Store, options);
    };
}
const $internalHooks = [];
function storeFactory(Store, options = {}) {
    options.name = options.name || options.id || Store["name"];
    options.state || (options.state = {});
    options.actions || (options.actions = {});
    options.getters || (options.getters = {});
    // prototype props.
    const proto = Store.prototype;
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === "constructor") {
            return;
        }
        // hooks
        if ($internalHooks.indexOf(key) > -1) {
            options[key] = proto[key];
            return;
        }
        const descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (descriptor.value !== void 0) {
            // methods
            if (typeof descriptor.value === "function") {
                options.actions[key] = descriptor.value;
            }
            else {
                // typescript decorated data
                options.state[key] = descriptor.value;
            }
        }
        else if (descriptor.get) {
            // computed properties
            options.getters[key] = descriptor.get;
        }
    });
    const data = new Store();
    Object.keys(data).forEach((key) => {
        options.state[key] = data[key];
    });
    // decorate options
    const decorators = Store["__decorators__"];
    if (decorators) {
        decorators.forEach((fn) => fn(options));
        delete Store["__decorators__"];
    }
    let state = options.state;
    options.state = () => state;
    let useStore = defineStore(options.name, options);
    return function () {
        return useStore();
    };
}
export function createDecorator(factory) {
    return (target, key, index) => {
        const Ctor = typeof target === "function" ? target : target.constructor;
        if (!Ctor.__decorators__) {
            Ctor.__decorators__ = [];
        }
        if (typeof index !== "number") {
            index = undefined;
        }
        Ctor.__decorators__.push((options) => factory(options, key, index));
    };
}
export const Pinia = function () { };
