import React from "react";
import { useWriter } from "../../hooks/useWriter";

const WriterStatus = () => {
  const { id, isWriting, start, stop } = useWriter();

  return (
    <div style={{ border: "1px solid black", padding: 8, margin: 12 }}>
      <h2>Writer: {id}</h2>
      <p>
        {isWriting
          ? "Writing 50 messages per second"
          : "Click to write 50 messages per second"}
      </p>
      {isWriting ? (
        <button onClick={stop}>Stop Writing</button>
      ) : (
        <button onClick={start}>Start Writing</button>
      )}
    </div>
  );
};

export default WriterStatus;
