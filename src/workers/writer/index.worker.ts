import { expose } from "comlink";

const handleStart = () => {
  console.log("[Writer] Starting");
};

const api = {
  start: handleStart,
};

export default {} as typeof Worker & { new (): Worker };
export type WriterWorkerAPI = typeof api;

expose(api);
