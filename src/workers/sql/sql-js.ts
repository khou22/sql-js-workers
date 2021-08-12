import initSqlJs, { Database, QueryExecResult, SqlJsStatic } from "sql.js";
import { RowData } from "./types";

const SQL_JS_WASM =
  "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.5.0/sql-wasm.wasm";

export class SqlJsOperator {
  sql?: SqlJsStatic;
  db?: Database;

  constructor() {
    this.sql = undefined;
    this.db = undefined;
  }

  setup = async () => {
    this.sql = await initSqlJs({
      // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
      locateFile: () => SQL_JS_WASM,
    });
    this.db = new this.sql.Database();
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

    stmt.run();
    stmt.free();
  };

  insertRows = (rows: RowData[]) => {
    const insertStatement =
      "INSERT INTO data (id, name, payload) VALUES ($id, $name, $payload)";
    rows.forEach((rowData) => {
      this.execStructuredQuery(insertStatement, {
        $id: rowData.id,
        $name: rowData.name,
        $payload: rowData.payload,
      });
    });
  };
}
