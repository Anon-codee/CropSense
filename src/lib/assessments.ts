
export type Prediction = {
  label: string;
  score: number;
};

export type Assessment = {
  id: string;
  crop: string;
  date: string;
  location: string;
  irrigation: string;
  soil: string;
  symptoms: string;
  image: string;
  status: string;

  // Optional so older saved assessments still work.
  predictions?: Prediction[];
  model?: string;
};

const STORAGE_KEY = "cropsense-assessments";

export function getAssessments(): Assessment[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed)
      ? (parsed as Assessment[])
      : [];
  } catch {
    return [];
  }
}

export function saveAssessment(
  assessment: Assessment
): void {
  const assessments = getAssessments();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([assessment, ...assessments])
  );
}

export function deleteAssessment(id: string): void {
  const assessments = getAssessments();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      assessments.filter(
        (assessment) => assessment.id !== id
      )
    )
  );
}