import { RowData } from "../workers/sql/types";

const possibleNames = ["apple", "banana", "clementine", "dragonfruit"];

export const generateRandomArray = (n: number): number[] =>
  Array.from({ length: n }, () => Math.floor(Math.random() * n));

export const generateMockRowData = (n: number): RowData[] => {
  const mockData: RowData[] = [];
  for (let i = 0; i < n; i++) {
    const mockPayload = new Uint8Array(generateRandomArray(5000));
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
