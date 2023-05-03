import { TransformInterceptor } from './transform.dispatchers';

describe('Transform dispatcher', () => {
    const interceptor = new TransformInterceptor();

    const executionContext = {
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnThis(),
    };

    const callHandler = {
        handle: jest.fn(),
    };

    it('should be defined', () => {
        expect(interceptor).toBeDefined();
    });

    it('should transform the message', () => {
        callHandler.handle.mockReturnValue({
            pipe: () => ({
                is_error: false,
                message: 'fake message',
                data: null,
            }),
        });
        const call = interceptor.intercept(executionContext as any, callHandler as any);
        expect(call).toBeDefined();
        expect(call).toHaveProperty('is_error');
        expect(call).toHaveProperty('message');
        expect(call).toHaveProperty('data');
    });
});
