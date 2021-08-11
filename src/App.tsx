import React, { useCallback } from "react";
import WriterStatus from "./components/writer-status";
import { databaseOperator } from "./db";

function App() {
  const handleHealth = useCallback(async () => {
    const isHealthy = await databaseOperator.checkHealth();
    if (isHealthy) {
      console.log("Healthy DB thread");
    } else {
      console.log("Unhealthy DB thread");
    }
  }, []);

  return (
    <div className="App">
      <button onClick={handleHealth}>Check Health</button>
      <WriterStatus />
      <WriterStatus />
    </div>
  );
}

export default App;
