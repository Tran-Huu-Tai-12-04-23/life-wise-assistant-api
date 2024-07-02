// src/database/dataSource.ts
import { resolve } from 'path';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: process.env.DB_LOGGING === 'true',
  entities: [resolve(__dirname, '../entities/*.entity{.ts,.js}')],
  migrations: [resolve(__dirname, '../migrations/*{.ts,.js}')],
  connectTimeout: 5000000,
  synchronize: false,
  migrationsRun: true,
});
