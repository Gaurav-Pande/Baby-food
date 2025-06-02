import React, { useState } from 'react';
import { Baby } from '../types';

interface Props {
  baby: Baby;
  onUpdate: (baby: Baby) => void;
}

const BabyProfile: React.FC<Props> = ({ baby, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [age, setAge] = useState(baby.age);
  const [allergyInput, setAllergyInput] = useState('');
  const [allergies, setAllergies] = useState<string[]>(baby.allergies);
  
  const handleSave = () => {
    onUpdate({
      age,
      allergies
    });
    setIsEditing(false);
  };
  
  const handleAddAllergy = () => {
    if (allergyInput.trim()) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };
  
  const handleRemoveAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  // Function to get a friendly description of the age
  const getAgeDescription = (months: number): string => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${months} months`;
    } else if (remainingMonths === 0) {
      return years === 1 ? '1 year' : `${years} years`;
    } else {
      return `${years} year${years > 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
  };

  // Function to get a development stage for the current age
  const getDevelopmentStage = (months: number): string => {
    if (months < 12) {
      return "Infant";
    } else if (months < 24) {
      return "Young Toddler";
    } else if (months < 36) {
      return "Toddler";
    } else {
      return "Preschooler";
    }
  };
  
  return (
    <div className="card">
      <div className="bg-gradient-to-r from-secondary to-secondary-dark p-4 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-display">Baby Profile</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs py-1 px-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="text-xs py-1 px-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age (months)
              </label>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <input
                    type="range"
                    min="12"
                    max="36"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-secondary"
                  />
                  <span className="ml-3 w-14 text-sm font-medium">{age} mo</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                  <span>1yr</span>
                  <span>2yr</span>
                  <span>3yr</span>
                </div>
              </div>
              <div className="mt-2 bg-secondary-50 p-2 rounded-md">
                <span className="text-xs font-medium text-secondary-dark">
                  {getDevelopmentStage(age)}: {getAgeDescription(age)}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allergies
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  placeholder="Add an allergy"
                  className="input-field rounded-r-none flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
                />
                <button
                  onClick={handleAddAllergy}
                  className="bg-accent text-white px-3 py-2 rounded-r-lg hover:bg-accent-dark"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
            
            {allergies.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-2">Current allergies:</p>
                <div className="flex flex-wrap gap-2">
                  {allergies.map((allergy, index) => (
                    <div 
                      key={index}
                      className="flex items-center bg-red-50 px-3 py-1 rounded-full"
                    >
                      <span className="text-sm text-red-700">{allergy}</span>
                      <button
                        onClick={() => handleRemoveAllergy(index)}
                        className="ml-1.5 text-red-400 hover:text-red-600"
                        aria-label={`Remove ${allergy} allergy`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center">
              <div className="relative mr-4">
                <div className="w-14 h-14 bg-secondary-light rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-secondary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {Math.floor(baby.age / 12)}
                </div>
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-800">Your Little One</h3>
                  <span className="ml-2 badge bg-secondary-50 text-secondary">
                    {getDevelopmentStage(baby.age)}
                  </span>
                </div>
                <p className="text-gray-600">{getAgeDescription(baby.age)}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Allergies</h3>
              {baby.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {baby.allergies.map((allergy, index) => (
                    <span 
                      key={index}
                      className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-sm inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  No allergies added
                </div>
              )}
            </div>
            
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Analysis results will be personalized based on your baby's age and allergies
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BabyProfile;
