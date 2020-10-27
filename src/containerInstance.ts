import { IContainerInstance, IContainer, InstanceHandler } from '@rheas/contracts/container';
import { assert } from 'console';

export class ContainerInstance implements IContainerInstance {
    /**
     * The parent container. Required to resolve the callback/resolver function.
     * Passed as argument to the callback.
     *
     * @var IContainer
     */
    private _container: IContainer;

    /**
     * Flag to determine if this instance is modifiable or not.
     *
     * @var boolean
     */
    private _singleton: boolean = false;

    /**
     * The service resolver callback function.
     *
     * @var InstanceHandler
     */
    private _resolver: InstanceHandler | undefined;

    /**
     * The resolved value. Either the result of the resolver or the instance
     * value itself.
     *
     * @var any
     */
    private _resolved: any;

    /**
     * Creates a container instance. The constructor is private and new instance
     * has to be created using the static functions so that necessary parameters
     * are loaded during object creation.
     *
     * @param container
     */
    private constructor(container: IContainer) {
        this._container = container;
    }

    /**
     * Creates an empty instance with no instance/resolver.
     *
     * @param container
     */
    public static createEmpty(container: IContainer) {
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
    public static createFromInstance(
        container: IContainer,
        instance: any,
        singleton: boolean = false,
    ) {
        return new ContainerInstance(container).setInstance(instance).setSingleton(singleton);
    }

    /**
     * Creates an instance from resolver callback function.
     *
     * @param container
     * @param resolver
     * @param singleton
     */
    public static createFromResolver(
        container: IContainer,
        resolver: any,
        singleton: boolean = false,
    ) {
        return new ContainerInstance(container).setResolver(resolver).setSingleton(singleton);
    }

    /**
     * Executes the service provider callback and returns the callback return.
     *
     * @return
     */
    public resolve(): any {
        if (typeof this._resolver === 'function') {
            this._resolved = this._resolver(this._container);
        }
        return this._resolved;
    }

    /**
     * Removes the resolved instance.
     */
    public unresolve() {        
        if (this._singleton) {
            return;
        }
        this._resolved = undefined;
    }

    /**
     * Sets new resolver for the key.
     *
     * @param resolver
     */
    public setResolver(resolver: InstanceHandler): IContainerInstance {
        this._resolver = resolver;

        return this;
    }

    /**
     * Sets new instance for the key.
     *
     * @param instance
     */
    public setInstance(instance: any): IContainerInstance {
        this._resolved = instance;

        return this;
    }

    /**
     * Sets the singleton status of the key. Once singleton set, resolver or instance 
     * can't be modified.
     *
     * @param status
     */
    public setSingleton(status: boolean): IContainerInstance {
        this._singleton = status;

        return this;
    }

    /**
     * Returns binding singleton status.
     *
     * @return
     */
    public isSingleton(): boolean {
        return this._singleton;
    }

    /**
     * Returns the resolved instance of this binding. If an instance already exists, 
     * then that value is returned. Otherwise the binding is resolved and returned.
     *
     * @return
     */
    public getResolved(): any {
        if (this._resolved !== undefined) {
            return this._resolved;
        }
        return this.resolve();
    }
}
