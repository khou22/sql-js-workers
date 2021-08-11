import { expose } from "comlink";
import { DatabaseOperator } from "../../db";

interface InternalState {
  id?: string;
  dbWorkerPort?: MessagePort;
  currentTimer?: NodeJS.Timeout;
}

let state: InternalState = {
  id: undefined,
  currentTimer: undefined,
};

const init = (id: string, dbWorkerPort: MessagePort) => {
  state.id = id;
  state.dbWorkerPort = dbWorkerPort;
};

const handleStart = () => {
  console.log(`[Writer ${state.id}] Starting`);

  state.currentTimer = setInterval(async () => {
    if (!state.dbWorkerPort) {
      console.log(`[Writer ${state.id}] DB Port Not Defined!`);
      return;
    }

    console.log("Creating db operator from port", state.dbWorkerPort);
    const db = new DatabaseOperator(state.dbWorkerPort);
    const isHealthy = await db.checkHealth();
    console.log("healthy", isHealthy);
    db.writeRows(5);
  }, 3000);
};

const handleStop = () => {
  console.log(`[Writer ${state.id}] Stopping`);

  if (state.currentTimer) {
    clearInterval(state.currentTimer);
  }
};

const api = {
  init,
  start: handleStart,
  stop: handleStop,
};

export default {} as typeof Worker & { new (): Worker };
export type WriterWorkerAPI = typeof api;

expose(api);
