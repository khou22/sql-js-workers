import { expose } from "comlink";

const handleStart = () => {
  console.log("[Writer] Starting");
};

const handleStop = () => {
  console.log("[Writer] Stopping");
};

const api = {
  start: handleStart,
  stop: handleStop,
};

export default {} as typeof Worker & { new (): Worker };
export type WriterWorkerAPI = typeof api;

expose(api);
