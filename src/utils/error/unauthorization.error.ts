import { HttpException } from '@nestjs/common';

/**
 * Unautherization error.
 */
export class UnautherizationError extends HttpException {
    constructor(message: string) {
        super(message, 401);
    }
}

export class DeviceOrVersionNotFoundError extends HttpException {
    constructor(message: string) {
        super(message, 404);
    }
}

export class DeviceTokenNotFoundError extends HttpException {
    constructor(message: string) {
        super(message, 404);
    }
}
