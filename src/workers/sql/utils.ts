import { SqlJsOperator } from "./sql-js";

export const getTableName = () => "data";

export const initializeTable = (sql: SqlJsOperator, tableName: string) => {
  sql.execSQL(
    `CREATE TABLE IF NOT EXISTS ${tableName} (id char, timestamp double, name char, payload LONGBLOB)`
  );
};
