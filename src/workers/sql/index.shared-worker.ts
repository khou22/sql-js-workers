import { expose } from "comlink";
import { QueryExecResult } from "sql.js";
import { SqlJsOperator } from "./sql-js";
import { RowData } from "./types";
import { getTableName, initializeTable } from "./utils";

const sqlOperator = new SqlJsOperator();

sqlOperator.setup().then((sql) => {
  initializeTable(sql, getTableName());
});

var connections = 0;

let totalRows = 0;

const handleHealth = (): boolean => true;

const handleWriteRows = (
  rows: RowData[],
  onSuccess: (totalRows: number) => void
) => {
  console.log("[Writer] Writing", rows.length);
  sqlOperator.insertRows(rows);
  totalRows += rows.length;
  onSuccess(totalRows);
};

const handleRawSQL = (sql: string): Promise<QueryExecResult[]> =>
  sqlOperator.execSQL(sql);

const bindWriter = (writerID: string, port: MessagePort) => {
  console.log(`[DB] Binding writer ${writerID}`);

  /**
   * Optionally intercept messages manually, but this requires a manual port.start()
   */
  // port.onmessage = (e: MessageEvent) => {
  //   console.log("[DB] onmessage handler", e);
  // };
  // port.start();

  // Expose the SharedWorker on the port by binding the API to all ports that Writer's are publishing to.
  expose(api, port);
};

const api = {
  health: handleHealth,
  writeRows: handleWriteRows,
  bindWriter,
  exec: handleRawSQL,
};

// @ts-ignore
onconnect = (event) => {
  const port = event.ports[0];
  connections++;
  console.log(`[DB] Connection #${connections}`);
  console.log("[DB] Using port", port);

  expose(api, port);
};

export default {} as typeof SharedWorker & { new (): SharedWorker };
export type SqlDatabaseWorkerAPI = typeof api;
