import React, { useCallback } from "react";
import { SqlQueryEditor } from "./components/query-editor";
import { StopWatch } from "./components/stopwatch";
import WriterStatus from "./components/writer-status";
import { mainDatabaseOperator } from "./db/mainOperator";
import "./index.css";
import { generateMockRowData } from "./utils/mock";

const App = () => {
  const handleHealth = useCallback(async () => {
    const isHealthy = await mainDatabaseOperator.checkHealth();
    if (isHealthy) {
      alert("Healthy DB thread");
    } else {
      alert("Unhealthy DB thread");
    }
  }, []);

  const handleAddRows = useCallback(async (n: number) => {
    const mockData = generateMockRowData(n);
    mainDatabaseOperator.writeRows(mockData);
  }, []);

  return (
    <div className="App">
      <h1>SQL JS + Web Workers Demo</h1>
      <button onClick={handleHealth}>Check Health</button>
      <button onClick={() => handleAddRows(1)}>Add 1</button>
      <button onClick={() => handleAddRows(100)}>Add 100</button>
      <button onClick={() => handleAddRows(10000)}>Add 10000</button>

      <p>
        Hitch Detector: <StopWatch />
      </p>

      <SqlQueryEditor />

      <hr />

      <h2>Web Worker Details</h2>

      <WriterStatus />
      <WriterStatus />
      <WriterStatus />
      <WriterStatus />
    </div>
  );
};

export default App;
