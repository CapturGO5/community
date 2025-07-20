'use client';

import React from 'react';
import Image from 'next/image';
import { useState } from 'react';

interface Step {
  title: string;
  description: string;
  image?: string;
}

const steps: Step[] = [
  {
    title: 'Step 1: Create a Capture',
    description: 'Install the CapturGO extension and capture your first moment. Make sure to follow our guidelines for a perfect capture.',
  },
  {
    title: 'Step 2: Share on Twitter',
    description: 'Take a screenshot or photo that captures your favorite moment in the ecosystem.',
  },
  {
    title: 'Step 3: Submit Entry',
    description: 'Submit your image through this page. Add a description to tell your story and inspire others.',
  },
  {
    title: 'Prizes 🏆',
    description: '🥇 1st Place: 1 SOL + Featured on Twitter\n🥈 2nd Place: 10 SUI + 20 ADA\n🥉 3rd Place: 20 ADA\n\nContest ends August 18th, 2025',
  },
];

interface ChallengeStepsCarouselProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChallengeStepsCarousel({ isOpen, onClose }: ChallengeStepsCarouselProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const nextStep = () => {
    setCurrentStep((prev) => (prev === steps.length - 1 ? prev : prev + 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev === 0 ? prev : prev - 1));
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 p-6 rounded-xl border border-white/10 max-w-md w-full mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Carousel content */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold mb-4">{steps[currentStep].title}</h3>
          <p className="text-gray-300">{steps[currentStep].description}</p>
          {steps[currentStep].image && (
            <Image
              width={800}
              height={450}
              src={steps[currentStep].image}
              alt={`Step ${currentStep + 1}`}
              className="mt-4 rounded-lg w-full object-cover"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
