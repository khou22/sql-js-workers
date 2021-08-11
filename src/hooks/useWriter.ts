import { wrap } from "comlink";
import { useCallback, useEffect, useRef, useState } from "react";
import WriterWorker, { WriterWorkerAPI } from "../workers/writer/index.worker";

export const useWriter = () => {
  const [isWriting, setIsWriting] = useState(false);

  const workerInstance = useRef<Worker | null>(null);
  const workerAPI = useRef<WriterWorkerAPI | null>(null);

  useEffect(() => {
    if (workerInstance.current) return;

    workerInstance.current = new WriterWorker();
    workerAPI.current = wrap(workerInstance.current);
  });

  const handleStart = useCallback(() => {
    setIsWriting(true);
    workerAPI.current?.start();
  }, [setIsWriting]);

  const handleStop = useCallback(() => {
    setIsWriting(false);
    workerAPI.current?.stop();
  }, [setIsWriting]);

  return {
    isWriting,
    start: handleStart,
    stop: handleStop,
  };
};
