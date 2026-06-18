import React from 'react';
import { Sparkles } from 'lucide-react';

interface AIFloatingButtonProps {
  onClick?: () => void;
  variant?: 1 | 2 | 3;
}

export function AIFloatingButton({ onClick, variant = 1 }: AIFloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 z-50 rounded-2xl shadow-2xl transition-transform hover:scale-110 active:scale-95 flex flex-col items-center justify-center overflow-hidden ${
        variant === 2 
          ? 'bg-gradient-to-br from-[#f9cdd5] to-[#f472b6] text-white shadow-pink-500/20 w-16 h-16' // Matcha/Pink variant
          : 'bg-gradient-to-br from-[#818cf8] to-[#c084fc] text-white shadow-indigo-500/20 p-4' // Dark variant
      }`}
    >
      {variant === 2 ? (
        <img src="/mascot-ai.png" alt="AI Mentor" className="w-12 h-12 object-contain" />
      ) : (
        <Sparkles className="w-8 h-8" />
      )}
    </button>
  );
}
