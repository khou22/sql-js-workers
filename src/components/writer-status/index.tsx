import React from "react";
import { useWriter } from "../../hooks/useWriter";

const WriterStatus = () => {
  const { id, isWriting, start, stop } = useWriter();

  return (
    <div style={{ border: "1px solid black", padding: 8, margin: 12 }}>
      <h2>Writer: {id}</h2>
      <h6>{isWriting ? "Writing" : "Paused"}</h6>
      {isWriting ? (
        <button onClick={stop}>Stop Writing</button>
      ) : (
        <button onClick={start}>Start Writing</button>
      )}
    </div>
  );
};

export default WriterStatus;
