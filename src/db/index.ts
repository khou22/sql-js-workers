import { proxy, Remote, transfer, wrap } from "comlink";
import { QueryExecResult } from "sql.js";
import SqlDatabaseWorker, {
  SqlDatabaseWorkerAPI,
} from "../workers/sql/index.shared-worker";

export class DatabaseOperator {
  port?: MessagePort;
  workerAPI: Remote<SqlDatabaseWorkerAPI>;

  constructor(port: MessagePort) {
    this.port = port;
    this.workerAPI = wrap(port);
  }

  static newWorker = (): DatabaseOperator => {
    const worker: SharedWorker = new SqlDatabaseWorker();
    return new DatabaseOperator(worker.port);
  };

  checkHealth = () => this.workerAPI.health();

  bindWriter = (id: string, port: MessagePort) => {
    this.workerAPI.bindWriter(id, transfer(port, [port]));
  };

  writeRows = (numRows: number) => {
    this.workerAPI.writeRows(
      numRows,
      proxy((totalRows) => console.log("Total rows", totalRows))
    );
  };

  exec = async (
    sql: string
  ): Promise<{ results: QueryExecResult[]; meta: { durationMS: number } }> => {
    const startTime = performance.now();
    const results = await this.workerAPI.exec(sql);
    const endTime = performance.now();
    return { results, meta: { durationMS: endTime - startTime } };
  };
}
