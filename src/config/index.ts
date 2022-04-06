import * as dev from './dev.json';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const env = process.env.APP_ENV || 'local';
const configs = { dev };
const config: Config = configs[env];
config.env = env;
export interface Config {
  env: string;
  cwl: {
    enabled: boolean;
    region: string;
    logLevel: string;
    logGroupName: string;
    uploadRate?: number;
  };
}

export default config;
