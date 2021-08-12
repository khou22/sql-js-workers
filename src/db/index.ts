import { proxy, Remote, transfer, wrap } from "comlink";
import { QueryExecResult } from "sql.js";
import SqlDatabaseWorker, {
  SqlDatabaseWorkerAPI,
} from "../workers/sql/index.shared-worker";
import { RowData } from "../workers/sql/types";

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

  writeRows = (rows: RowData[], onComplete?: (totalRows: number) => void) => {
    this.workerAPI.writeRows(
      rows,
      proxy((totalRows) => onComplete && onComplete(totalRows))
    );
  };

  exec = async (
    sql: string
  ): Promise<{
    results: QueryExecResult[];
    meta: { start: number; end: number; durationMS: number };
  }> => {
    const startTime = Date.now();
    const results = await this.workerAPI.exec(sql);
    const endTime = Date.now();
    return {
      results,
      meta: {
        start: startTime,
        end: endTime,
        durationMS: endTime - startTime,
      },
    };
  };
}
