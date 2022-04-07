import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as httpContext from 'express-http-context';
import * as crypto from 'crypto';
import { getLogger } from '../shares/utils/cwl';
import { EHttpContextKey } from '../shares/enums/http';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private cwLogger = getLogger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const correlationId = getCorrelationId();

    this.cwLogger.info(`HTTP Request: ${correlationId}`, {
      correlationId,
      level: 'info',
      user: (req as any)?.user, // This is user object which has been injected by auth middleware
      request: {
        ip: req.ip,
        ips: req.ips,
        method: req.method,
        url: req.url,
        originalUrl: req.originalUrl,
        body: req.body,
        query: req.query,
        headers: req.headers,
      },
    });

    const originalWrite = res.write;
    const originalEnd = res.end;
    let responseBody = '';

    const chunks = [];
    res.write = (...args) => {
      const chunk = args[0];
      chunks.push(chunk);
      return originalWrite.apply(res, args);
    };

    res.end = (...args) => {
      const chunk = args[0];
      if (chunk) chunks.push(chunk);
      responseBody = Buffer.concat(chunks).toString('utf8');
      return originalEnd.apply(res, args);
    };

    res.on('finish', () => {
      // Push log to CWL
      let responseBodyJson = null;
      try {
        responseBodyJson = JSON.parse(responseBody);
      } catch (e) {
        // the body is not in json format, just keep it as string
        responseBodyJson = responseBody;
      }

      this.cwLogger.info(`HTTP Response: ${correlationId}`, {
        correlationId,
        level: 'info',
        user: (req as any)?.user, // This is user object which has been injected by auth middleware
        request: {
          ip: req.ip,
          ips: req.ips,
          method: req.method,
          url: req.url,
          originalUrl: req.originalUrl,
          body: req.body,
          query: req.query,
          headers: req.headers,
        },
        response: {
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.getHeaders(),
          body: responseBodyJson,
        },
      });
    });

    next();
  }
}

/**
 * Middleware to initiate the correlation information of the request
 * If the header `x-correlation-id` is specified, means the request is come from
 * another internal service. We'll just set it into the context's correlationId.
 */
export function setCorrelationId(req: Request, res: Response, next) {
  httpContext.ns.bindEmitter(req);
  httpContext.ns.bindEmitter(res);
  const xCorrelationId = req.get(EHttpContextKey.X_CORRELATION_ID);
  const correlationId = xCorrelationId || crypto.randomUUID();

  httpContext.set(EHttpContextKey.CORRELATION_ID, correlationId);
  httpContext.set(EHttpContextKey.TIMESTAMP, Date.now());
  next();
}

/**
 * To retrieve the correlationId, firstly lookup at the http context
 * If the context is not set, try to generate a brand new one
 */
export function getCorrelationId(): string {
  let correlationId = httpContext.get(EHttpContextKey.CORRELATION_ID);
  if (!correlationId) {
    correlationId = crypto.randomUUID();
    httpContext.set(EHttpContextKey.CORRELATION_ID, correlationId);
  }
  return correlationId;
}
