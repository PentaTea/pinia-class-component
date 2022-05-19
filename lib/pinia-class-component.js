/**
  * pinia-class-component v0.9.2
  * (c) 2022-present PentaTea
  * @license MIT
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('pinia')) :
    typeof define === 'function' && define.amd ? define(['exports', 'pinia'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PiniaClassComponent = {}, global.Pinia));
})(this, (function (exports, pinia) { 'use strict';

    function Store(options) {
      if (typeof options === "function") {
        return storeFactory(options);
      }

      return function (Store) {
        return storeFactory(Store, options);
      };
    }
    var $internalHooks = [];

    function storeFactory(Store) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      options.name = options.name || options.id || Store["name"];
      options.state || (options.state = {});
      options.actions || (options.actions = {});
      options.getters || (options.getters = {}); // prototype props.

      var proto = Store.prototype;
      Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === "constructor") {
          return;
        } // hooks


        if ($internalHooks.indexOf(key) > -1) {
          options[key] = proto[key];
          return;
        }

        var descriptor = Object.getOwnPropertyDescriptor(proto, key);

        if (descriptor.value !== void 0) {
          // methods
          if (typeof descriptor.value === "function") {
            options.actions[key] = descriptor.value;
          } else {
            // typescript decorated data
            options.state[key] = descriptor.value;
          }
        } else if (descriptor.get) {
          // computed properties
          options.getters[key] = descriptor.get;
        }
      });
      var data = new Store();
      Object.keys(data).forEach(function (key) {
        options.state[key] = data[key];
      }); // decorate options

      var decorators = Store["__decorators__"];

      if (decorators) {
        decorators.forEach(function (fn) {
          return fn(options);
        });
        delete Store["__decorators__"];
      }

      var state = options.state;

      options.state = function () {
        return state;
      };

      var useStore = pinia.defineStore(options.name, options);
      return function () {
        return useStore();
      };
    }

    function createDecorator(factory) {
      return function (target, key, index) {
        var Ctor = typeof target === "function" ? target : target.constructor;

        if (!Ctor.__decorators__) {
          Ctor.__decorators__ = [];
        }

        if (typeof index !== "number") {
          index = undefined;
        }

        Ctor.__decorators__.push(function (options) {
          return factory(options, key, index);
        });
      };
    }
    var Pinia = function Pinia() {};

    exports.Pinia = Pinia;
    exports.Store = Store;
    exports.createDecorator = createDecorator;

    Object.defineProperty(exports, '__esModule', { value: true });

}));