import { expose } from "comlink";
import { DatabaseOperator } from "../../db";

interface InternalState {
  id?: string;
  dbWorkerPort?: MessagePort;
  currentTimer?: NodeJS.Timeout;
  dbOperator?: DatabaseOperator;
}

let state: InternalState = {
  id: undefined,
  currentTimer: undefined,
};

const init = (id: string, dbWorkerPort: MessagePort) => {
  state.id = id;
  state.dbWorkerPort = dbWorkerPort;

  state.dbOperator = new DatabaseOperator(state.dbWorkerPort);
};

const handleStart = () => {
  console.log(`[Writer ${state.id}] Starting`);

  state.currentTimer = setInterval(async () => {
    if (!state.dbOperator) {
      console.log(`[Writer ${state.id}] DB Operator!`);
      return;
    }

    state.dbOperator?.writeRows(5);
  }, 1000);
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
