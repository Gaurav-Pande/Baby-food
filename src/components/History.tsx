import React from 'react';
import { AnalysisResult } from '../types';

interface Props {
  items: AnalysisResult[];
  onItemSelect: (result: AnalysisResult) => void;
  onClearHistory: () => void;
}

const History: React.FC<Props> = ({ items, onItemSelect, onClearHistory }) => {
  // Helper function to format timestamp
  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if the date is today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
    
    // Check if the date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
    
    // Otherwise return full date
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  };

  return (
    <div className="card">
      <div className="card-gradient-header">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold font-display">Analysis History</h2>
            <p className="text-primary-100 text-sm mt-0.5">
              {items.length > 0 
                ? `${items.length} previous ${items.length === 1 ? 'analysis' : 'analyses'}` 
                : 'No previous analyses'}
            </p>
          </div>
          {items.length > 0 && (
            <button 
              onClick={onClearHistory}
              className="text-xs py-1 px-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all flex items-center"
              title="Clear history"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {items.length > 0 ? (
          <ul className="space-y-3">
            {items.map((item) => (
              <li 
                key={item.id}
                className="border border-neutral rounded-xl overflow-hidden cursor-pointer hover:border-primary transition-all duration-200 card-hover bg-white"
                onClick={() => onItemSelect(item)}
              >
                <div className="flex items-center p-3">
                  <div className="relative">
                    <img 
                      src={item.imageUrl} 
                      alt="Food" 
                      className="w-16 h-16 object-cover rounded-lg" 
                    />
                    <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.isHealthy 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {item.concerns.length}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0 ml-3">
                    <div className="flex items-center justify-between">
                      <span className={`badge ${
                        item.isHealthy 
                          ? 'badge-success' 
                          : 'badge-warning'
                      }`}>
                        {item.isHealthy ? 'Healthy' : 'Concerns'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    
                    <div className="mt-1 flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <span className="truncate">
                        {item.ingredients.length} ingredients
                      </span>
                      
                      {item.concerns.length > 0 && (
                        <span className="flex items-center ml-3 text-red-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {item.concerns.length} {item.concerns.length === 1 ? 'concern' : 'concerns'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <svg className="w-20 h-20 text-primary-100" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <div className="absolute top-0 right-0 w-8 h-8 bg-primary-light rounded-full flex items-center justify-center animate-pulse-slow">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-700">No analysis history yet</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
              Once you analyze some food ingredients, your history will appear here for easy reference
            </p>
            <div className="mt-4">
              <div className="inline-flex items-center text-primary-dark text-sm">
                <svg className="w-5 h-5 mr-1 text-primary animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Start by analyzing a food label
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
