// src/services/mcpService.ts
import { AnalysisResult, Baby } from '../types';

const MCP_API = 'http://localhost:3001';

export const saveAnalysisResult = async (result: AnalysisResult) => {
  const response = await fetch(`${MCP_API}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  });
  if (!response.ok) throw new Error('Failed to save analysis result');
  return response.json();
};

export const fetchAnalysisHistory = async (userId?: string): Promise<AnalysisResult[]> => {
  const url = userId ? `${MCP_API}/history?userId=${encodeURIComponent(userId)}` : `${MCP_API}/history`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch analysis history');
  return response.json();
};
