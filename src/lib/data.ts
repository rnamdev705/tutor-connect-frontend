import { mockCases } from "./mock-data";
import type { Case } from "./types";

export function getCaseById(id: string): Case | undefined {
  return mockCases.find((c) => c.id === id);
}
