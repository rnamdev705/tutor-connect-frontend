import { mockTutors } from "./mock-data";
import type { TutorProfile } from "./types";

export function getTutorById(id: string): TutorProfile | undefined {
  return mockTutors.find((t) => t.id === id);
}
