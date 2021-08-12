import initSqlJs, { Database, QueryExecResult, SqlJsStatic } from "sql.js";
import { RowData } from "./types";
import { getTableName } from "./utils";

const SQL_JS_WASM =
  "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.5.0/sql-wasm.wasm";

export class SqlJsOperator {
  sql?: SqlJsStatic;
  db?: Database;
  tables: Set<string>;

  constructor() {
    this.sql = undefined;
    this.db = undefined;
    this.tables = new Set<string>();
  }

  health = () => Boolean(this.db);

  setup = async () => {
    this.sql = await initSqlJs({
      // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
      locateFile: () => SQL_JS_WASM,
    });
    this.db = new this.sql.Database();
    return this;
  };

  initializeTable = async (tableName: string) => {
    if (this.tables.has(tableName)) return;

    await this.execSQL(
      `CREATE TABLE IF NOT EXISTS ${tableName} (id char, timestamp double, name char, payload LONGBLOB)`
    );
    this.tables.add(tableName);
  };

  execSQL = (sql: string): Promise<QueryExecResult[]> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("SQL JS DB not initialized.");
        return;
      }
      const result = this.db.exec(sql);
      resolve(result);
    });
  };

  execStructuredQuery = (sql: string, params?: Record<string, any>) => {
    if (!this.db) {
      throw new Error("SQL JS DB not initialized.");
    }

    const stmt = this.db.prepare(sql);

    // Bind values to the parameters and fetch the results of the query
    const result = stmt.getAsObject(params);
    stmt.free();
  };

  insertRows = async (rows: RowData[]) => {
    rows.forEach(async (rowData) => {
      // Determine table that this row should go into.
      const tableName = getTableName(rowData);

      // Possibly create table if doesn't exist.
      await this.initializeTable(tableName);

      const insertStatement = `INSERT INTO ${tableName} (id, timestamp, name, payload) VALUES ($id, $timestamp, $name, $payload)`;

      // Insert the row
      this.execStructuredQuery(insertStatement, {
        $tableName: tableName,
        $id: rowData.id,
        $timestamp: rowData.timestamp,
        $name: rowData.name,
        $payload: rowData.payload,
      });
    });
  };
}
