import React, { useState } from 'react';
import { AnalysisResult, Concern, Alternative } from '../types';

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisResults: React.FC<Props> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'alternatives'>('summary');
  const [expandedConcern, setExpandedConcern] = useState<string | null>(null);
  
  const toggleConcern = (ingredient: string) => {
    if (expandedConcern === ingredient) {
      setExpandedConcern(null);
    } else {
      setExpandedConcern(ingredient);
    }
  };
  
  // Helper function to render nutrition info as a progress bar
  const renderNutritionBar = (label: string, value: number | undefined, max: number, unit: string, color: string) => {
    if (value === undefined) return null;
    
    const percentage = Math.min((value / max) * 100, 100);
    
    return (
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{value}{unit}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  // Function to render a concern card
  const renderConcernCard = (concern: Concern) => {
    const isExpanded = expandedConcern === concern.ingredient;
    
    return (
      <div 
        key={concern.ingredient}
        className={`border rounded-xl transition-all duration-300 overflow-hidden ${
          isExpanded ? 'border-red-300 shadow-md' : 'border-gray-200 hover:border-red-200'
        }`}
      >
        <div 
          className="p-4 cursor-pointer flex justify-between items-start"
          onClick={() => toggleConcern(concern.ingredient)}
        >
          <div>
            <h4 className="font-medium text-red-700">{concern.ingredient}</h4>
            <p className="text-sm text-gray-600 mt-1">{concern.reason}</p>
          </div>
          <button className="mt-1 text-gray-400">
            <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {isExpanded && concern.citations.length > 0 && (
          <div className="px-4 pb-4 pt-0 bg-red-50">
            <div className="text-xs text-gray-500 mb-2">Scientific Sources:</div>
            <ul className="space-y-2">
              {concern.citations.map((citation, index) => (
                <li key={index} className="text-sm">
                  <a 
                    href={citation.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {citation.title}
                  </a>
                  <p className="text-xs text-gray-500">{citation.source}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  // Function to render an alternative card
  const renderAlternativeCard = (alternative: Alternative) => {
    return (
      <div key={alternative.original} className="border border-gray-200 rounded-xl p-4 hover:border-accent transition-all duration-200">
        <div className="flex items-start">
          <div className="mr-3 mt-1">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
          <div>
            <div className="flex items-center">
              <span className="text-red-600 line-through mr-2">{alternative.original}</span>
              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="text-accent-dark font-medium">{alternative.suggestion}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{alternative.benefits}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className={`p-6 ${result.isHealthy ? 'bg-green-50' : 'bg-red-50'} border-b border-gray-200`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold font-display">Analysis Results</h2>
          <button
            onClick={onReset}
            className="btn-outline py-1 px-3 text-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New Analysis
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-4 md:mb-0 md:pr-6">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <img 
                src={result.imageUrl} 
                alt="Food ingredients" 
                className="w-full h-40 object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-2/3">
            <div className="flex items-center mb-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                result.isHealthy 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {result.isHealthy ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  )}
                </svg>
                {result.isHealthy ? 'Healthy for your baby' : 'Concerns Found'}
              </span>
              <span className="ml-3 text-sm text-gray-500">
                {new Date(result.timestamp).toLocaleString()}
              </span>
            </div>
            
            <h3 className="text-lg font-medium">
              Analysis Summary
            </h3>
            
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Ingredients</p>
                <p className="text-xl font-bold">{result.ingredients.length}</p>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Concerns</p>
                <p className={`text-xl font-bold ${result.concerns.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {result.concerns.length}
                </p>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Alternatives</p>
                <p className="text-xl font-bold">{result.alternatives.length}</p>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Calories</p>
                <p className="text-xl font-bold">{result.nutritionalInfo.calories || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex">
          {(['summary', 'details', 'alternatives'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'details' && result.ingredients.length > 0 && (
                <span className="ml-1 bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">
                  {result.ingredients.length}
                </span>
              )}
              {tab === 'summary' && result.concerns.length > 0 && (
                <span className="ml-1 bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full text-xs">
                  {result.concerns.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-6">
        {activeTab === 'summary' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Summary</h3>
              {result.isHealthy ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-green-700">
                        This food appears to be healthy for your baby. No concerning ingredients were detected.
                      </p>
                      <p className="text-green-600 text-sm mt-2">
                        {result.nutritionalInfo.additionalInfo}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">                      <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-red-700">
                        This food contains ingredients that may not be suitable for your baby.
                      </p>
                      {result.concerns.length > 0 && (
                        <p className="text-red-600 text-sm mt-2">
                          Found {result.concerns.length} ingredient{result.concerns.length !== 1 ? 's' : ''} of concern.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {result.concerns.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Concerns</h3>
                <div className="space-y-3">
                  {result.concerns.map((concern) => renderConcernCard(concern))}
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Nutritional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  {renderNutritionBar('Calories', result.nutritionalInfo.calories, 200, '', 'bg-blue-500')}
                  {renderNutritionBar('Protein', result.nutritionalInfo.protein, 10, 'g', 'bg-green-500')}
                  {renderNutritionBar('Carbs', result.nutritionalInfo.carbs, 30, 'g', 'bg-yellow-500')}
                  {renderNutritionBar('Sugars', result.nutritionalInfo.sugars, 15, 'g', 'bg-red-500')}
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  {renderNutritionBar('Fat', result.nutritionalInfo.fat, 10, 'g', 'bg-purple-500')}
                  {renderNutritionBar('Sodium', result.nutritionalInfo.sodium, 500, 'mg', 'bg-indigo-500')}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'details' && (
          <div>
            <h3 className="text-lg font-medium mb-3">Ingredients</h3>
            <div className="bg-white border border-gray-200 rounded-lg">
              <ul className="divide-y divide-gray-200">
                {result.ingredients.map((ingredient, index) => (
                  <li key={index} className="p-3 flex items-start">
                    <span className="mr-2 mt-0.5 text-gray-400">•</span>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {activeTab === 'alternatives' && (
          <div>
            <h3 className="text-lg font-medium mb-3">Healthier Alternatives</h3>
            {result.alternatives.length > 0 ? (
              <div className="space-y-3">
                {result.alternatives.map((alternative) => renderAlternativeCard(alternative))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-gray-500">No alternatives needed for this product.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
                   