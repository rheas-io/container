import { Container } from '../src';

describe('Container class', () => {
    /**
     * Singleton key bindings should not be allowed to re-register. We will 
     * register a singleton binding and check if the same value is returned after
     * re-registering with a different value.
     */
    it('should not re-register singleton keys', () => {
        const container = new Container();

        container.instance('test_binding', 'initial_value', true);
        expect(container.get('test_binding')).toStrictEqual('initial_value');

        container.instance('test_binding', 'retried_value', true);
        expect(container.get('test_binding')).toStrictEqual('initial_value');
        expect(container.get('test_binding')).not.toStrictEqual('retried_value');
    });

    /**
     * A singleton binding should always return the same object when called.
     * Tested by making multiple calls to a singleton binding key and checks the
     * returned binding is same.
     */
    it('should return same binding for singleton', () => {
        const container = new Container();

        container.singleton('test_binding', () => {
            return { initial_value: 1 };
        });

        const resolved_value = container.get('test_binding');
        expect(resolved_value.initial_value).toStrictEqual(1);

        // Update the initial_value and check if the updation is reflected
        // when we call the binding again from the container. Singleton should
        // always return the same binding.
        resolved_value.initial_value = 2;
        expect(container.get('test_binding').initial_value).toStrictEqual(2);
    });

    /**
     * A non-singleton binding will be resolved again and again when
     * fetched from the container ie, each binding fetch will return 
     * a new object.
     */
    it('should resolve repeatedly for non singleton bindings', () => {
        const container = new Container();

        container.tie('test_binding', () => {
            return { initial_value: 1 };
        });

        const resolved_value = container.get('test_binding');
        expect(resolved_value.initial_value).toStrictEqual(1);

        // Update the initial_value to check if the same object is returned
        // everytime container key is called. Since the binding is non-singleton
        // the resolver will be called everytime resulting in a new binding for
        // each calls.
        resolved_value.initial_value = 2;
        expect(container.get('test_binding').initial_value).toStrictEqual(1);
    });

    /**
     * A singleton instance registration should always return the same 
     * object.
     */
    it('should return the same instance when bound as singleton instance', () => {
        const container = new Container();
        container.instance('singleton_instance', { initial_value: 1 }, true);

        const resolved_value = container.get('singleton_instance');
        expect(resolved_value.initial_value).toStrictEqual(1);

        // Update the initial_value to check if the same object is returned
        // everytime container key is called.
        resolved_value.initial_value = 2;
        expect(container.get('singleton_instance').initial_value).toStrictEqual(2);
    });

    /**
     * A non-singleton instance registration should also return the same 
     * object when called multiple times from the container because we have nothing 
     * to resolve again and again when a binding is registered as instance.
     */
    it('should return the same instance when bound as non-singleton instance', () => {
        const container = new Container();
        container.instance('singleton_false_instance', { initial_value: 1 });

        const resolved_value = container.get('singleton_false_instance');
        expect(resolved_value.initial_value).toStrictEqual(1);

        // Update the initial_value to check if the same object is returned
        // everytime container key is called.
        resolved_value.initial_value = 2;
        expect(container.get('singleton_false_instance').initial_value).toStrictEqual(2);
    });

    /**
     * The container should throw an error when a binding for a key is not found.
     */
    it('should throw an exception when no key binding found', () => {
        const container = new Container();
        container.singleton('test_binding', () => new Container());

        expect(() => container.get('test_binding')).not.toThrow();

        expect(() => container.get('invalid_binding')).toThrow();
    });
});
