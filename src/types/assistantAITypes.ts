export interface DiagnosticRequest {
  symptoms: string;
  age?: number;
  gender?: string;
}

export interface DiagnosticResponse {
  diagnosis: string;
  possible_conditions: string[];
  recommendations: string[];
  urgency_level: string;
}