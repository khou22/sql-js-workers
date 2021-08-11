import { expose } from "comlink";

var connections = 0;

const handleHealth = (): boolean => true;

const handleWriteRows = (numRows: number, onSuccess: () => void) => {
  console.log("[Writer] Writing", numRows);
  onSuccess();
};

const api = {
  health: handleHealth,
  writeRows: handleWriteRows,
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
