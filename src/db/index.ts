import "reflect-metadata";
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { getEnv, loadEnv } from "../utils";
export const entityFolder = path.join(__dirname, '../entity/*.{ts,js}');
export const migrationFolder = path.join(__dirname, '../migrations/**/*.{ts,js}');
loadEnv();

export const databaseConf = {
    DB_TYPE: () => getEnv('DB_TYPE', 'postgres') as any,
    DB_HOST: () => getEnv('DB_HOST', 'localhost'),
    DB_PORT: () => parseInt(getEnv('DB_PORT', '5432')),
    DB_USERNAME: () => getEnv('DB_USERNAME', 'postgres'),
    DB_PASSWORD: () => getEnv('DB_PASSWORD', 'root'),
    DB_NAME: () => getEnv('DB_NAME', 'cryptoAcademy'),
    LOG_LEVEL: () => getEnv('DB_LOG_LEVEL', 'debug'),
};

export const ormConfig: DataSourceOptions = {
    replication: {
        master: {
            host: databaseConf.DB_HOST(),
            port: databaseConf.DB_PORT(),
            username: databaseConf.DB_USERNAME(),
            password: databaseConf.DB_PASSWORD(),
            database: databaseConf.DB_NAME(),
        },
        slaves: [],
    },
    type: databaseConf.DB_TYPE(),
    // entities: [Photo, Product],
    entities: [entityFolder],
    migrations: [migrationFolder],
    migrationsTableName: 'migrations',
    logging: 'all',
    logger: databaseConf.LOG_LEVEL() as any,
};

export const AppDataSource = new DataSource(ormConfig);