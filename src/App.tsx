import React, { useState } from 'react';
import Header from './components/Header';
import ImageCapture from './components/ImageCapture';
import AnalysisResults from './components/AnalysisResults';
import BabyProfile from './components/BabyProfile';
import History from './components/History';
import { AnalysisResult, Baby } from './types';
import { useAnalysisHistory, useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [history, addToHistory, clearHistory] = useAnalysisHistory();
  const [baby, setBaby] = useLocalStorage<Baby>('baby_profile', {
    age: 24, // Default to 2 years (24 months)
    allergies: [],
  });

  const handleAnalysisComplete = async (result: AnalysisResult) => {
    setCurrentResult(result);
    await addToHistory(result);
    setIsAnalyzing(false);
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setCurrentResult(null);
  };

  const updateBabyProfile = (updatedBaby: Baby) => {
    setBaby(updatedBaby);
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your analysis history?')) {
      await clearHistory();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-lightest">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* App Description */}
        {!currentResult && !isAnalyzing && (
          <div className="text-center mb-8 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 text-gray-800">
              Healthy Food Choices Made Simple
            </h2>
            <p className="text-gray-600 mb-6">
              Upload a photo of any food ingredient label and get instant analysis 
              of whether it's suitable for your little one. We'll highlight potential concerns
              and suggest healthier alternatives.
            </p>
            <div className="flex justify-center space-x-3">
              <span className="flex items-center text-sm text-gray-500">
                <svg className="w-5 h-5 text-accent mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Fast Analysis
              </span>
              <span className="flex items-center text-sm text-gray-500">
                <svg className="w-5 h-5 text-accent mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Scientific Sources
              </span>
              <span className="flex items-center text-sm text-gray-500">
                <svg className="w-5 h-5 text-accent mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Personalized Results
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            {!currentResult ? (
              <ImageCapture 
                onStartAnalysis={handleStartAnalysis}
                onAnalysisComplete={handleAnalysisComplete}
                isAnalyzing={isAnalyzing}
                babyProfile={baby}
              />
            ) : (
              <AnalysisResults 
                result={currentResult} 
                onReset={() => setCurrentResult(null)}
              />
            )}
          </div>
          
          <div className="lg:col-span-4 space-y-8">
            <BabyProfile 
              baby={baby} 
              onUpdate={updateBabyProfile} 
            />
            
            {history.length > 0 && (
              <History 
                items={history} 
                onItemSelect={setCurrentResult}
                onClearHistory={handleClearHistory}
              />
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-8 mt-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <circle cx="20" cy="20" r="20" fill="#0EA5E9" fillOpacity="0.2" />
                  <circle cx="20" cy="20" r="16" fill="#0EA5E9" fillOpacity="0.4" />
                  <path d="M14,12 C14,8.6862915 16.6862915,6 20,6 C23.3137085,6 26,8.6862915 26,12 C26,15.3137085 23.3137085,18 20,18 C16.6862915,18 14,15.3137085 14,12 Z" fill="#0EA5E9" />
                  <path d="M28,26 C28,26 28,24 20,24 C12,24 12,26 12,26 L12,28 C12,28 12,34 20,34 C28,34 28,28 28,28 L28,26 Z" fill="#0EA5E9" />
                </svg>
                <span className="font-display font-bold text-xl text-primary">NutriTot</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Baby Food Analyzer &copy; {new Date().getFullYear()}
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500">
                This app is for informational purposes only and should not replace professional medical advice.
              </p>
              <div className="flex justify-center md:justify-end mt-2 space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-primary">Terms</a>
                <a href="#" className="text-gray-400 hover:text-primary">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
