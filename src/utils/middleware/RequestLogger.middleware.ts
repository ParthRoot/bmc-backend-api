import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    public static handleReponseFinish(res: Response, req: Request, perf: number) {
        const { ip, method, originalUrl } = req;
        const hostname = require('os').hostname();
        const userAgent = req.get('user-agent') || '';
        const referer = req.get('referer') || '';
        const { statusCode } = res;
        const contentLength = res.get('content-length');
        const perfEnd = performance.now() - perf;

        console.log(   
            `hostname=[${hostname}] method=${method} url='${originalUrl}' performance=${perfEnd} statusCode='${statusCode}'  contentLength='${contentLength}'  refer='${referer}' user_agenet='${userAgent}' ip='${ip}'`,
        );
    }

    use(request: Request, response: Response, next: NextFunction): void {
        const perf = performance.now();
        response.on('finish', () => RequestLoggerMiddleware.handleReponseFinish(response, request, perf));
        next();
    }
}
