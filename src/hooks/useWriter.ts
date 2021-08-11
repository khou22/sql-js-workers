import { wrap } from "comlink";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import WriterWorker, { WriterWorkerAPI } from "../workers/writer/index.worker";

export const useWriter = () => {
  const [isWriting, setIsWriting] = useState(false);

  const [workerID, setWorkerID] = useState<string | null>(null);
  const workerInstance = useRef<Worker | null>(null);
  const workerAPI = useRef<WriterWorkerAPI | null>(null);

  useEffect(() => {
    if (workerAPI.current) return;

    const id = uuidv4();
    workerInstance.current = new WriterWorker();
    workerAPI.current = wrap(workerInstance.current);

    workerAPI.current.init(id);

    setWorkerID(id);
  }, [setWorkerID]);

  const handleStart = useCallback(() => {
    setIsWriting(true);
    workerAPI.current?.start();
  }, [setIsWriting]);

  const handleStop = useCallback(() => {
    setIsWriting(false);
    workerAPI.current?.stop();
  }, [setIsWriting]);

  return {
    id: workerID,
    isWriting,
    start: handleStart,
    stop: handleStop,
  };
};
