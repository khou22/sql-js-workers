import { RowData } from "./types";

export const MIN_TIMESTAMP = 1000;
export const TABLE_TIMESTAMP_CHUNK_SIZE = 10 * 1000; // Every 10s

export const getTableName = (row: RowData): string => {
  const timestampChunk = Math.floor(
    (row.timestamp - MIN_TIMESTAMP) / TABLE_TIMESTAMP_CHUNK_SIZE
  );
  return `data_${timestampChunk}`;
};
