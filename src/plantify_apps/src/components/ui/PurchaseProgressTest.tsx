import React, { useState, useEffect } from 'react';

import PurchaseProgress, {
  createPurchaseSteps,
  PurchaseStep,
} from './PurchaseProgress';

export default function PurchaseProgressTest() {
  const [steps, setSteps] = useState<PurchaseStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const initialSteps = createPurchaseSteps();
    setSteps(initialSteps);
  }, []);

  const simulatePurchase = () => {
    const steps = createPurchaseSteps();
    setSteps(steps);
    setCurrentStep(0);

    // Simulate step progression
    const stepIds = ['validate', 'transfer', 'confirm', 'mint', 'complete'];

    stepIds.forEach((stepId, index) => {
      setTimeout(() => {
        setSteps(prev =>
          prev.map(step =>
            step.id === stepId ? { ...step, status: 'in_progress' } : step
          )
        );
        setCurrentStep(index);
      }, index * 1000);

      setTimeout(
        () => {
          setSteps(prev =>
            prev.map(step =>
              step.id === stepId ? { ...step, status: 'completed' } : step
            )
          );
        },
        index * 1000 + 800
      );
    });
  };

  const resetProgress = () => {
    const steps = createPurchaseSteps();
    setSteps(steps);
    setCurrentStep(0);
  };

  return (
    <div className='p-8 max-w-2xl mx-auto'>
      <h2 className='text-2xl font-bold mb-6'>Purchase Progress Test</h2>

      <div className='space-y-4 mb-6'>
        <button
          onClick={simulatePurchase}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          Simulate Purchase
        </button>

        <button
          onClick={resetProgress}
          className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-4'
        >
          Reset
        </button>
      </div>

      <PurchaseProgress
        steps={steps}
        currentStep={currentStep}
        className='border p-4 rounded-lg'
      />
    </div>
  );
}
