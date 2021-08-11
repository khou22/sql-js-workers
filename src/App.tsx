import React, { useCallback } from "react";
import WriterStatus from "./components/writer-status";
import { mainDatabaseOperator } from "./db/mainOperator";

function App() {
  const handleHealth = useCallback(async () => {
    const isHealthy = await mainDatabaseOperator.checkHealth();
    if (isHealthy) {
      console.log("Healthy DB thread");
    } else {
      console.log("Unhealthy DB thread");
    }
  }, []);

  const handleAddRows = useCallback(async () => {
    mainDatabaseOperator.writeRows(100);
  }, []);

  return (
    <div className="App">
      <button onClick={handleHealth}>Check Health</button>
      <button onClick={handleAddRows}>Main Thread Add Rows</button>
      <WriterStatus />
      <WriterStatus />
    </div>
  );
}

export default App;
