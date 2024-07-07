import { dataSource } from '../typeorm/typeorm.config';
import { DATA_SOURCE } from '../constants/server';

export const databaseProvider = {
  provide: DATA_SOURCE,
  useFactory: async () => {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      if (process.env.NODE_ENV === 'development') {
        try {
          await dataSource.runMigrations();
        } catch (error) {
          console.log(`Migrations Error: ${error}`);
        }
      }

      return dataSource;
    }
  },
};
