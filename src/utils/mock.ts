import { RowData } from "../workers/sql/types";

const possibleNames = ["apple", "banana", "clementine", "dragonfruit"];

export const generateRandomArray = (n: number): number[] =>
  Array.from({ length: n }, () => Math.floor(Math.random() * n));

// Unmasked planner_viz is 430,000 bytes or so
const MAX_PAYLOAD_SIZE = 500000;

export const generateMockRowData = (n: number): RowData[] => {
  const mockData: RowData[] = [];

  // Payload only instantiated once
  const payloadSize = Math.floor(Math.random() * MAX_PAYLOAD_SIZE);
  const mockPayload = new Uint8Array(generateRandomArray(payloadSize));

  for (let i = 0; i < n; i++) {
    const timestamp = performance.now();
    mockData.push({
      id: `${i}`,
      timestamp,
      name: possibleNames[Math.floor(Math.random() * possibleNames.length)],
      payload: mockPayload,
    });
  }

  return mockData;
};
