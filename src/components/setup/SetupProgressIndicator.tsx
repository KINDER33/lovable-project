
import React from 'react';

interface SetupProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const SetupProgressIndicator: React.FC<SetupProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="text-center">
      <p className="text-gray-600 mb-4">Étape {currentStep}/{totalSteps}</p>
      
      <div className="flex justify-center">
        <div className="flex space-x-2">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index + 1}
              className={`w-3 h-3 rounded-full ${
                index + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetupProgressIndicator;
