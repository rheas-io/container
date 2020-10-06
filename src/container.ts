import { KeyValue } from '@rheas/contracts';
import { ContainerInstance } from './containerInstance';
import { BindingNotFoundException } from '@rheas/errors/bindingNotFound';
import { IContainer, InstanceHandler, IContainerInstance } from '@rheas/contracts/container';

export class Container implements IContainer {
    /**
     * The container instance that has to be passed when resolving
     * bindings. Default is `this`. This is helpful when classes are 
     * unable to extend this class.
     *
     * @var IContainer
     */
    protected _container: IContainer;

    /**
     * KeyValue mapping of container bindings.
     *
     * @var object
     */
    protected _instances: KeyValue<IContainerInstance> = {};

    /**
     * Creates a new container.
     *
     * @param instance
     */
    constructor(instance?: IContainer) {
        this._container = instance || this;
    }

    /**
     * Creates a singleton binding for the key with a resolver.
     *
     * @param name
     * @param resolver
     */
    public singleton(name: string, resolver: InstanceHandler): IContainerInstance {
        return this.tie(name, resolver, true);
    }

    /**
     * Creates a binding for the key with a resolver. The resolver will be run only
     * when the binding is requested.
     *
     * @param name
     * @param resolver
     * @param singleton
     */
    public tie(
        name: string,
        resolver: InstanceHandler,
        singleton: boolean = false,
    ): IContainerInstance {
        return this.createInstance(name, () => {
            return ContainerInstance.createFromResolver(this._container, resolver, singleton);
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
    public instance(name: string, instance: any, singleton: boolean = false): IContainerInstance {
        return this.createInstance(name, () => {
            return ContainerInstance.createFromInstance(this._container, instance, singleton);
        });
    }

    /**
     * Creates a container instance and adds it to the binding list only if
     * a binding does not exists or it is not singleton.
     *
     * @param name
     * @param callback
     */
    protected createInstance(name: string, callback: () => IContainerInstance) {
        let instance: IContainerInstance = this._instances[name];

        if (instance === undefined || !instance.isSingleton()) {
            instance = callback();
        }
        return (this._instances[name] = instance);
    }

    /**
     * Returns the binding on the specified key. If no binding is found, an
     * exception is thrown.
     *
     * @param key The binding key to retreive
     */
    public get(key: string) {
        if (this._instances.hasOwnProperty(key)) {
            return this._instances[key].getResolved();
        }
        throw new BindingNotFoundException(key);
    }
}
