import { expose } from "comlink";

interface InternalState {
  id?: string;
}

let state: InternalState = {
  id: undefined,
};

const init = (id: string) => {
  state.id = id;
};

const handleStart = () => {
  console.log(`[Writer ${state.id}] Starting`);
};

const handleStop = () => {
  console.log(`[Writer ${state.id}] Stopping`);
};

const api = {
  init,
  start: handleStart,
  stop: handleStop,
};

export default {} as typeof Worker & { new (): Worker };
export type WriterWorkerAPI = typeof api;

expose(api);
