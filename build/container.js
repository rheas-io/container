"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const containerInstance_1 = require("./containerInstance");
class Container {
    constructor() {
        /**
         * KeyValue mapping of container bindings.
         *
         * @var object
         */
        this._instances = {};
    }
    /**
     * Creates a singleton binding for the key with a resolver.
     *
     * @param name
     * @param resolver
     */
    singleton(name, resolver) {
        return this.bind(name, resolver, true);
    }
    /**
     * Creates a binding for the key with a resolver. The resolver will be run only
     * when the binding is requested.
     *
     * @param name
     * @param resolver
     * @param singleton
     */
    bind(name, resolver, singleton = false) {
        return this.createInstance(name, () => {
            return containerInstance_1.ContainerInstance.createFromResolver(this, resolver, singleton);
        });
    }
    /**
     * Creates a binding for the key with an object. The passed in object will be returned
     * when the binding is requested.
     *
     * @param name
     * @param instance
     * @param singleton
     */
    instance(name, instance, singleton = false) {
        return this.createInstance(name, () => {
            return containerInstance_1.ContainerInstance.createFromInstance(this, instance, singleton);
        });
    }
    /**
     * Creates a container instance and adds it to the binding list only if
     * a binding does not exists or it is not singleton.
     *
     * @param name
     * @param callback
     */
    createInstance(name, callback) {
        let instance = this._instances[name];
        if (instance === undefined || !instance.isSingleton()) {
            instance = callback();
        }
        return this._instances[name] = instance;
    }
    /**
     * Returns the rheas binding of the specified key. Or returns null when
     * no binding is found or the defaultValue is not
     *
     * @param key The binding key to retreive
     */
    get(key, defaultValue = null) {
        if (!this._instances.hasOwnProperty(key)) {
            return defaultValue;
        }
        return this._instances[key].getResolved();
    }
}
exports.Container = Container;
