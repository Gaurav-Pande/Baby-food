import { useState, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { saveAnalysisResult, fetchAnalysisHistory } from '../services/mcpService';

export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export const useAnalysisHistory = (): [
  AnalysisResult[],
  (result: AnalysisResult) => Promise<void>,
  () => Promise<void>
] => {
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  // Fetch history from MCP server on mount
  useEffect(() => {
    fetchAnalysisHistory()
      .then(setHistory)
      .catch(() => setHistory([]));
  }, []);

  const addToHistory = async (result: AnalysisResult) => {
    await saveAnalysisResult(result);
    // Refresh history after saving
    const updated = await fetchAnalysisHistory();
    setHistory(updated);
  };

  const clearHistory = async () => {
    // Optionally, implement a delete endpoint in MCP server for full clear
    setHistory([]);
  };

  return [history, addToHistory, clearHistory];
};
