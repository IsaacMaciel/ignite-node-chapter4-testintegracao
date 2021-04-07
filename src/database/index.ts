import { Connection, getConnectionOptions,createConnection } from "typeorm";

export default async (host = "database"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host: "localhost",
      database: process.env.NODE_ENV === 'test' ? "fin_api_test" : defaultOptions.database
    })
  );
};
