import { proxy, Remote, wrap } from "comlink";
import SqlDatabaseWorker, {
  SqlDatabaseWorkerAPI,
} from "../workers/sql/index.worker";

const worker: SharedWorker = new SqlDatabaseWorker();

class DatabaseOperator {
  workerAPI: Remote<SqlDatabaseWorkerAPI>;
  constructor() {
    this.workerAPI = wrap(worker.port);
  }

  checkHealth = () => this.workerAPI.health();

  writeRows = (numRows: number) => {
    this.workerAPI.writeRows(
      numRows,
      proxy(() => console.log("Successfully wrote", numRows))
    );
  };
}

export const databaseOperator = new DatabaseOperator();
