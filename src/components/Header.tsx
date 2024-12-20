import React from 'react';
import { DateSelector } from './DateSelector';
import { Save } from 'lucide-react';

interface HeaderProps {
  date: Date;
  onDateChange: (date: Date) => void;
  mood: string;
  onMoodChange: (mood: string) => void;
  moodExplanation: string;
  onMoodExplanationChange: (explanation: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  date,
  onDateChange,
  mood,
  onMoodChange,
  moodExplanation,
  onMoodExplanationChange,
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Daily Journal</h2>
          <DateSelector selectedDate={date} onDateChange={onDateChange} />
        </div>
        
        <div className="bg-white/50 rounded-lg p-6 backdrop-blur-sm space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">💗</span>
              <span className="font-medium text-gray-700">How I Feel Today:</span>
            </div>
            <div className="flex gap-4 ml-8">
              {[
                { emoji: '😊', label: 'Great', color: 'bg-green-500' },
                { emoji: '😐', label: 'Okay', color: 'bg-yellow-500' },
                { emoji: '😔', label: 'Not Good', color: 'bg-red-500' },
              ].map(({ emoji, label, color }) => (
                <button
                  key={label}
                  onClick={() => onMoodChange(label)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all transform hover:scale-105 ${
                    mood === label
                      ? `${color} text-white shadow-lg`
                      : 'bg-white hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why do you feel this way today?
            </label>
            <textarea
              value={moodExplanation}
              onChange={(e) => onMoodExplanationChange(e.target.value)}
              placeholder="Share your thoughts and feelings..."
              className="w-full px-4 py-3 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};