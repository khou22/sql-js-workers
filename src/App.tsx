import React, { useCallback } from "react";
import { databaseOperator } from "./db";

function App() {
  const handleHealth = useCallback(async () => {
    const isHealthy = databaseOperator.checkHealth();
    console.log(isHealthy);
  }, []);

  return (
    <div className="App">
      <button onClick={handleHealth}>Check Health</button>
    </div>
  );
}

export default App;
