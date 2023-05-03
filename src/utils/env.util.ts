// export * from '@scaletech/backend-env';

import * as fs from 'fs';

export class EnvError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export enum availableEnv {
    PRODUCTION = 'production',
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    LOCAL = 'local',
}

/**
 * Will returns the environment variables from the machine you can also return the default property if not found
 * @param name {string}
 * @param def string
 * @param suppress boolean
 * @returns string
 */
export const getEnv = (name: string, def = '', suppress = false): string => {
    const upperName = name.toUpperCase();
    const env = process.env[upperName] ?? def;
    if (!env && !suppress) {
        const envPath = envFile();
        throw new EnvError(`in ${envPath} file '${upperName}' not found.`);
    }
    return env;
};

export const currentEnv = () => getEnv('APP_ENV', availableEnv.DEVELOPMENT) as availableEnv;

export const isProduction = () => currentEnv() === availableEnv.PRODUCTION;

export const isStaging = () => currentEnv() === availableEnv.STAGING;

export const isDevelopment = () => currentEnv() === availableEnv.DEVELOPMENT;
export const isLocal = () => currentEnv() === availableEnv.LOCAL;

/**
 * @warning To load please set {APP_ENV_FILE_PATH=/path/to/file.env} on your machine
 * @returns string
 */
export const envFile = () => process.env['APP_ENV_FILE_PATH'] ?? `${process.env['INIT_CWD']}/.env`;

/**
 * It will load the .env file and set the environment variables
 */
export const loadEnv = () => {
    const envFilePath = envFile();

    if (!fs.existsSync(envFilePath)) {
        // logger.error(`${envFilePath} does not exist.`);
        console.log(`${envFilePath} does not exist.`);
        process.exit(0);
    }
    console.log(`Loading ${envFilePath}`);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config({ path: envFilePath, override: true });
};

/**
 * It will load environment based on ENV
 */

export const setEnv = (key: string, val: string) => {
    process.env[key.toUpperCase()] = val;
};

