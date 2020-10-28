import { Container } from '../src/container';
import { ContainerInstance } from '../src/containerInstance';

describe('container instances', () => {
    const containerInstance = ContainerInstance.createFromResolver(
        new Container(),
        () => new Container(),
        true,
    );

    /**
     * When an empty container instance is created, it should not be a singleton,
     * and since a resolver or instance value is not set, resolved values should 
     * return undefined.
     */
    it('should return an empty container instance', () => {
        const containerInstance = ContainerInstance.createEmpty(new Container());

        expect(containerInstance.isSingleton()).toEqual(false);
        expect(containerInstance.getResolved()).toEqual(undefined);
        expect(containerInstance.resolve()).toEqual(undefined);
    });

    /**
     * Singleton functions should only be resolved once. We will create a singleton
     * object and check if the same object is returned when resolved multiple times.
     */
    it('should resolve singleton functions only once', () => {
        const resolvedContainer = containerInstance.getResolved();

        expect(resolvedContainer).toEqual(containerInstance.getResolved());
    });

    /**
     * Tests if the unresolve call does not affect a singleton binding.
     * Even after unresolving, the container instance should have the resolved
     * value and return it.
     */
    it('should not unresolve singleton', () => {
        const resolvedContainer = containerInstance.getResolved();
        containerInstance.unresolve();

        expect(resolvedContainer).toEqual(containerInstance.getResolved());
    });

    /**
     * Resolved value should be undefined after unresolving. We will register an
     * instance with a value other than undefined to check the changes are working as
     * expected.
     */
    it('should unresolve non-singleton bindings', () => {
        const containerInstance = ContainerInstance.createFromInstance(new Container(), true);

        expect(containerInstance.resolve()).toEqual(true);

        containerInstance.unresolve();

        expect(containerInstance.resolve()).toEqual(undefined);
    });

    /**
     * Non-singleton resolvers should be resolved each time the resolve function
     * is called. To check this we will first create a non-singleton binding, resolve it
     * and initialize it with some value. Then we will resolve it again to see if the
     * initial value is present in the latest resolved value. It should not be present for
     * the test to pass.
     */
    it('should re-resolve non singleton functions', () => {
        const containerInstance = ContainerInstance.createFromResolver(
            new Container(),
            () => new Container(),
        );
        const resolvedContainer: Container = containerInstance.getResolved();
        resolvedContainer.instance('initial', true);

        expect(resolvedContainer).not.toEqual(containerInstance.getResolved());
    });

    /**
     * Checks if the singleton flags are set correctly.
     */
    it('should return singleton flag correctly', () => {
        let containerInstance = ContainerInstance.createFromInstance(new Container(), true);
        expect(containerInstance.isSingleton()).toEqual(false);

        containerInstance = ContainerInstance.createFromInstance(new Container(), true, true);
        expect(containerInstance.isSingleton()).toEqual(true);
    });
});
