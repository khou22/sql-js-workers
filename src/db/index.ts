import { proxy, Remote, transfer, wrap } from "comlink";
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
}
