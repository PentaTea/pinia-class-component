import { defineStore, Store } from "pinia";
import { UnwrapRef } from "vue";

type S = new () => any;
interface WithDecorators {
  __decorators__?: any[];
}
interface StoreOptions {
  name?: string;
  id?: string;
  state?: Record<string, any>;
  getters?: Record<string, (state: S) => any>;
  actions?: Record<string, (...args: any[]) => any>;
  hydrate?(storeState: UnwrapRef<S>, initialState: UnwrapRef<S>): void;
  [key: string]: any;
}
export function Store(options?: StoreOptions): <C extends S>(target: C) => C;
export function Store<C extends S>(target: C): C;
export function Store<C extends S>(options: StoreOptions | C) {
  if (typeof options === "function") {
    return storeFactory(options);
  }

  return function (Store: C) {
    return storeFactory(Store, options);
  };
}

const $internalHooks: any[] = [];

function storeFactory<C extends S>(Store: C, options: StoreOptions = {}) {
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
    const descriptor = Object.getOwnPropertyDescriptor(proto, key)!;

    if (descriptor.value !== void 0) {
      // methods
      if (typeof descriptor.value === "function") {
        options.actions![key] = descriptor.value;
      } else {
        // typescript decorated data
        options.state![key] = descriptor.value;
      }
    } else if (descriptor.get) {
      // computed properties
      options.getters![key] = descriptor.get;
    }
  });

  const data = new Store();
  Object.keys(data).forEach((key) => {
    options.state![key] = data[key];
  });

  // decorate options
  const decorators = (Store as WithDecorators)["__decorators__"];
  if (decorators) {
    decorators.forEach((fn) => fn(options));
    delete (Store as WithDecorators)["__decorators__"];
  }

  let state = options.state;
  options.state = () => state;
  let useStore = defineStore(options.name, options as any);
  return function () {
    return useStore();
  };
}

export function createDecorator(
  factory: (options: StoreOptions, key: string, index?: number) => void
) {
  return (target: any, key: string, index?: number) => {
    const Ctor = typeof target === "function" ? target : target.constructor;
    if (!Ctor.__decorators__) {
      Ctor.__decorators__ = [];
    }
    if (typeof index !== "number") {
      index = undefined;
    }
    Ctor.__decorators__.push((options: StoreOptions) =>
      factory(options, key, index)
    );
  };
}

export const Pinia = function () {} as unknown as new () => Store;
