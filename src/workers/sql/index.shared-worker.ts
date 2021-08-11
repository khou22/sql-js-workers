import { expose } from "comlink";

var connections = 0;

let totalRows = 0;

const handleHealth = (): boolean => true;

const handleWriteRows = (
  numRows: number,
  onSuccess: (totalRows: number) => void
) => {
  console.log("[Writer] Writing", numRows);
  totalRows += numRows;
  onSuccess(totalRows);
};

const bindWriter = (writerID: string, port: MessagePort) => {
  console.log(`[DB] Binding writer ${writerID}`);
  port.onmessage = (e: MessageEvent) => {
    console.log("[DB] onmessage handler");
    console.log(e);
  };
};

const api = {
  health: handleHealth,
  writeRows: handleWriteRows,
  bindWriter,
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
