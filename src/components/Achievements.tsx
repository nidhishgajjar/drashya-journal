import React from 'react';
import { Star } from 'lucide-react';

interface AchievementsData {
  learned: string;
  proud: string;
  help: string;
  notes: string;
}

interface AchievementsProps {
  achievements: AchievementsData;
  onAchievementChange: (field: string, value: string) => void;
}

export const Achievements: React.FC<AchievementsProps> = ({
  achievements,
  onAchievementChange,
}) => {
  return (
    <div className="bg-green-50 rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-semibold">Today's Achievements</h3>
          </div>
        </div>
        <div className="space-y-4 ml-8">
          {[
            { field: 'learned', label: 'New thing I learned' },
            { field: 'proud', label: 'I felt proud when' },
            { field: 'help', label: 'I need help with' },
            { field: 'notes', label: 'Notes for tomorrow' },
          ].map(({ field, label }) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1">{label}:</label>
              <input
                type="text"
                value={achievements[field as keyof AchievementsData]}
                onChange={(e) => onAchievementChange(field, e.target.value)}
                className="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};