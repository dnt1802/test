import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

interface StageWrapperProps {
  title: string;
  description: string;
  score: number;
  children: React.ReactNode;
  onNext?: () => void;
  showNext?: boolean;
  bgClass?: string;
}

export const StageWrapper: React.FC<StageWrapperProps> = ({
  title,
  description,
  score,
  children,
  onNext,
  showNext,
  bgClass = "bg-gradient-to-b from-sky-300 to-sky-100"
}) => {
  return (
    <div className={`min-h-screen w-full flex flex-col ${bgClass} relative overflow-hidden`}>
      {/* Header */}
      <div className="p-4 flex justify-between items-center z-10 bg-white/30 backdrop-blur-sm shadow-sm border-b border-white/40">
        <div>
          <h1 className="text-2xl font-hand font-bold text-blue-900">{title}</h1>
          <p className="text-sm text-blue-800">{description}</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-full shadow-md text-yellow-900 font-bold">
          <Star className="w-5 h-5 fill-current" />
          <span>{score}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10 w-full max-w-4xl mx-auto">
        {children}
      </main>

      {/* Footer / Next Button */}
      <div className="p-6 flex justify-center z-20">
        {showNext && onNext && (
          <button 
            onClick={onNext}
            className="animate-bounce bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold text-xl shadow-xl flex items-center gap-2 border-b-4 border-green-700 transition-all"
          >
            Tiếp tục hành trình <ArrowRight />
          </button>
        )}
      </div>
    </div>
  );
};