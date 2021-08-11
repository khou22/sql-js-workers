import React, { useCallback } from "react";
import { databaseOperator } from "./db";
import { useWriter } from "./hooks/useWriter";

function App() {
  const { isWriting, start, stop } = useWriter();

  const handleHealth = useCallback(async () => {
    const isHealthy = await databaseOperator.checkHealth();
    console.log(isHealthy);
  }, []);

  return (
    <div className="App">
      <button onClick={handleHealth}>Check Health</button>
      <h2>Writer Worker: {isWriting ? "Writing" : "Paused"}</h2>
      {isWriting ? (
        <button onClick={stop}>Stop Writing</button>
      ) : (
        <button onClick={start}>Start Writing</button>
      )}
    </div>
  );
}

export default App;
