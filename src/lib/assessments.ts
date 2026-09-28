
export type Assessment = {
  id: string;
  crop: string;
  date: string;
  location: string;
  irrigation: string;
  soil: string;
  symptoms: string;
  image: string;
  status: "Pending AI analysis";
};

const STORAGE_KEY = "cropsense-assessments";

export function getAssessments(): Assessment[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveAssessment(
  assessment: Assessment
): void {
  const existing = getAssessments();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([assessment, ...existing])
  );
}

export function deleteAssessment(id: string): void {
  const remaining = getAssessments().filter(
    (assessment) => assessment.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(remaining)
  );
}