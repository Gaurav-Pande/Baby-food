export interface Baby {
  age: number; // Age in months
  allergies: string[];
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  imageUrl: string;
  ingredients: string[];
  isHealthy: boolean;
  concerns: Concern[];
  nutritionalInfo: NutritionalInfo;
  alternatives: Alternative[];
}

export interface Concern {
  ingredient: string;
  reason: string;
  citations: Citation[];
}

export interface Citation {
  title: string;
  source: string;
  url?: string;
}

export interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  sugars?: number;
  fat?: number;
  sodium?: number;
  additionalInfo?: string;
}

export interface Alternative {
  original: string;
  suggestion: string;
  benefits: string;
}
