"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerInstance = void 0;
class ContainerInstance {
    /**
     * Creates a container instance. The constructor is private and new instance
     * has to be created using the static functions so that necessary parameters
     * are loaded during object creation.
     *
     * @param container
     */
    constructor(container) {
        /**
         * Flag to determine if this instance is modifiable or not.
         *
         * @var boolean
         */
        this._singleton = false;
        this._container = container;
    }
    /**
     * Creates an empty instance with no instance/resolver.
     *
     * @param container
     */
    static createEmpty(container) {
        return new ContainerInstance(container);
    }
    /**
     * Creates an instance from an object. There is nothing to resolve in
     * this container instance. The passed instance value is the resolved value.
     *
     * @param container
     * @param instance
     * @param singleton
     */
    static createFromInstance(container, instance, singleton = false) {
        return new ContainerInstance(container).setInstance(instance).setSingleton(singleton);
    }
    /**
     * Creates an instance from resolver callback function.
     *
     * @param container
     * @param resolver
     * @param singleton
     */
    static createFromResolver(container, resolver, singleton = false) {
        return new ContainerInstance(container).setResolver(resolver).setSingleton(singleton);
    }
    /**
     * @inheritdoc
     *
     * @return
     */
    resolve() {
        if (typeof this._resolver === 'function') {
            this._resolved = this._resolver(this._container);
        }
        return this._resolved;
    }
    /**
     * @inheritdoc
     */
    unresolve() {
        if (this._singleton) {
            return;
        }
        this._resolved = undefined;
    }
    /**
     * @inheritdoc
     *
     * @param resolver
     */
    setResolver(resolver) {
        this._resolver = resolver;
        return this;
    }
    /**
     * @inheritdoc
     *
     * @param instance
     */
    setInstance(instance) {
        this._resolved = instance;
        return this;
    }
    /**
     * @inheritdoc
     *
     * @param status
     */
    setSingleton(status) {
        this._singleton = status;
        return this;
    }
    /**
     * @inheritdoc
     *
     * @return
     */
    isSingleton() {
        return this._singleton;
    }
    /**
     * @inheritdoc
     *
     * @return
     */
    getResolved() {
        if (this._resolved !== undefined) {
            return this._resolved;
        }
        return this.resolve();
    }
}
exports.ContainerInstance = ContainerInstance;
