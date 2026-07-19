/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChatTurn {
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export type DepartmentType = "Otology" | "Rhinology" | "Laryngology" | "Endoscopy";

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  department: DepartmentType;
  doctorName: string;
  date: string;
  time: string;
  notes?: string;
  status: "Confirmed" | "Completed" | "Pending";
}

export interface BrainGameScore {
  reactionTime: number; // of reaction test in ms
  memoryScore: number;  // matched count
  accuracy: number;     // percentage
  finalPoints: number;  // absolute computed points
}

export interface LiverScoreAnswers {
  processedFood: number;      // 1 to 5 index
  antioxidantBeverages: number; // 1 to 5 index
  fatigueIndex: "none" | "mild" | "frequent" | "severe";
  exerciseDays: number;       // days per week
  fastFoodRatio: number;      // 1 to 5 index
}

export interface KidneyCalculatorAnswers {
  waterVolume: number;        // liters per day
  sodiumIntake: "low" | "moderate" | "high";
  coffeeCups: number;         // cups daily
  activityFactor: "low" | "moderate" | "vigorous";
  weightKg: number;
}

export interface DnaTestProfile {
  firstName: string;
  lastName: string;
  testType: "Endoskopik tekshiruv" | "Audiometriya" | "Timpanometriya" | "Fibrinoskopiya";
  markerSelection: "Eshitish pasayishi" | "Surunkali rinit" | "Tinnitus" | "Tomoqdagi yallig'lanish";
  sampleStatus: "Under Scan" | "Gene Separation" | "Matching Sequence" | "Analysis Report Complete";
  progressPercent: number;
}
