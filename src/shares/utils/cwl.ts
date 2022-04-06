import _ from 'lodash';
import * as winston from 'winston';
import Transport from 'winston-transport';
import util from 'util';
import * as crypto from 'crypto';
import * as os from 'os';
import * as WinstonCloudWatch from 'winston-cloudwatch';
import * as AWS from 'aws-sdk';
import config from '../../config';
import * as httpContext from 'express-http-context';

AWS.config.update({
  region: config.cwl?.enabled ? config.cwl?.region : 'ap-southeast-1',
});

const { combine, timestamp, colorize, printf } = winston.format;
const randomSuffix = crypto.randomBytes(8).toString('hex');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    const output = Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info,
    );

    return output;
  }

  return info;
});

export function safeToString(json: any): string {
  if (isEmpty(json)) {
    return null;
  }

  try {
    return JSON.stringify(json);
  } catch (ex) {
    return util.inspect(json);
  }
}

export function isEmpty(obj: any): boolean {
  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object') return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

export function getLogger(name: string): winston.Logger {
  const isLoggerExisted = winston.loggers.has(name);
  if (!isLoggerExisted) {
    createLogger(name);
  }

  return winston.loggers.get(name);
}

function createLogger(name: string) {
  const transports: Transport[] = [];

  // Console is default logger
  const consoleTransport = _createConsoleTransport();
  transports.push(consoleTransport);

  // If CloudWatch log is enabled, add them to transports list
  if (config.cwl.enabled) {
    const cwlTransport = _createCwlTransport(name);
    transports.push(cwlTransport);
  }

  winston.loggers.add(name, {
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(timestamp(), enumerateErrorFormat()),
    transports,
    silent: process.env.NODE_ENV === 'test', // clear log in test environment
  });
}

function _createConsoleTransport(): Transport {
  return new winston.transports.Console({
    format: combine(
      colorize(),
      printf((info) => {
        const { timestamp, level, message, ...extra } = info;
        return `${timestamp} [${level}]: ${message}` + (isEmpty(extra) ? '' : ` | ${safeToString(extra)}`);
      }),
    ),
    stderrLevels: ['error'],
  });
}

function _createCwlTransport(name: string): Transport {
  const logStreamPrefix = os.hostname();
  const createdDate = new Date().toISOString().split('T')[0];
  const logStreamName = `${logStreamPrefix}-${createdDate}-${randomSuffix}`;

  return new WinstonCloudWatch({
    name,
    level: config.cwl.logLevel,
    logGroupName: config.cwl.logGroupName,
    logStreamName,
    jsonMessage: false,
    uploadRate: config.cwl.uploadRate,
    cloudWatchLogs: new AWS.CloudWatchLogs(),
    messageFormatter: function (log: winston.LogEntry): string {
      const { timestamp, level, message, ...meta } = log;
      const correlationId = httpContext.get('correlationId');
      return safeToString({ timestamp, correlationId, level, message, ...meta });
    },
  });
}
