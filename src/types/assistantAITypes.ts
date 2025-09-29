export interface DiagnosticRequest {
  sintomas: string[];
  edad?: number;
  genero?: string;
}

export interface DiagnosticResponse {
  sintomas: string[];
  posibles_diagnosticos: string;
  recomendaciones: string;
  urgencia: string;
  timestamp: string;
}