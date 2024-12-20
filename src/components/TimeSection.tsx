import React from 'react';
import { Clock, Save } from 'lucide-react';

// Define questions for each activity type
const activityQuestions: Record<string, string[]> = {
  Exercise: [
    "What exercises did you do today?",
    "How long did you exercise for?",
    "How did you feel during the exercise?",
    "Did you try any new exercises?",
    "What was your favorite part of the workout?",
    "Did you achieve any fitness goals today?"
  ],
  TV: [
    "What did you watch?",
    "What was your favorite part?",
    "Would you recommend it to others? Why?",
    "How did it make you feel?",
    "Did you learn anything new from what you watched?",
    "Who was your favorite character and why?"
  ],
  Reading: [
    "What are you reading?",
    "What's the most interesting thing you've read so far?",
    "How does the story make you feel?",
    "Would you recommend this book/article?",
    "What have you learned from your reading?",
    "Who is your favorite character and why?"
  ],
  Learning: [
    "What did you learn about today?",
    "What was the most interesting thing you learned?",
    "How will you apply what you learned?",
    "What made you choose this topic?",
    "Would you like to learn more about this subject?",
    "Did anything surprise you while learning?"
  ],
  Other: [
    "What activity did you do?",
    "How long did you spend on this activity?",
    "Why did you choose to do this activity?",
    "How did it make you feel?",
    "Would you do this activity again?",
    "What did you enjoy most about it?"
  ]
};

// Helper function to get random questions
const getRandomQuestions = (questions: string[], count: number = 3) => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

interface Activity {
  time: string;
  medicine: {
    timeTaken: string;
    taken: boolean;
  };
  meal: {
    time: string;
    items: string;
    amount: 'All' | 'Most' | 'Half' | 'Little';
  };
  activities: string[];
  activityNotes: Record<string, string>; // Add this new field
}

interface TimeSectionProps {
  icon: string;
  title: string;
  bgColor: string;
  activity: Activity;
  onActivityChange: (field: string, value: any) => void;
}

export const TimeSection: React.FC<TimeSectionProps> = ({
  icon,
  title,
  bgColor,
  activity,
  onActivityChange,
}) => {
  const amounts = ['All', 'Most', 'Half', 'Little'];
  const availableActivities = ['Exercise', 'TV', 'Reading', 'Learning', 'Other'];

  const handleActivityToggle = (act: string, checked: boolean) => {
    const newActivities = checked
      ? [...activity.activities, act]
      : activity.activities.filter(a => a !== act);
    
    onActivityChange('activities', newActivities);
    
    // Initialize notes for new activity with empty strings
    if (checked) {
      const questions = getRandomQuestions(activityQuestions[act]);
      const newNotes = { ...activity.activityNotes };
      questions.forEach((q, i) => {
        newNotes[`${act}_${i}`] = '';
      });
      onActivityChange('activityNotes', newNotes);
    }
  };

  return (
    <div className={`${bgColor} rounded-lg shadow-md`}>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          </div>
        </div>
        <div className="space-y-6 ml-8">
          <div className="flex items-center gap-3 bg-white/60 p-3 rounded-lg backdrop-blur-sm">
            <Clock className="w-5 h-5 text-gray-600" />
            <input
              type="time"
              value={activity.time}
              onChange={(e) => onActivityChange('time', e.target.value)}
              className="px-3 py-2 rounded-md border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="bg-white/60 p-4 rounded-lg backdrop-blur-sm">
            <div className="font-medium text-gray-700 mb-3">Medicine:</div>
            <div className="ml-4 space-y-3">
              <input
                type="time"
                value={activity.medicine.timeTaken}
                onChange={(e) =>
                  onActivityChange('medicine.timeTaken', e.target.value)
                }
                className="px-3 py-2 rounded-md border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={activity.medicine.taken}
                  onChange={(e) =>
                    onActivityChange('medicine.taken', e.target.checked)
                  }
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span>Taken</span>
              </label>
            </div>
          </div>

          <div className="bg-white/60 p-4 rounded-lg backdrop-blur-sm">
            <div className="font-medium text-gray-700 mb-3">Meal:</div>
            <div className="ml-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Time:</span>
                <input
                  type="time"
                  value={activity.meal.time}
                  onChange={(e) =>
                    onActivityChange('meal.time', e.target.value)
                  }
                  className="px-3 py-2 rounded-md border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <span className="text-gray-600">Food items:</span>
                <input
                  type="text"
                  value={activity.meal.items}
                  onChange={(e) =>
                    onActivityChange('meal.items', e.target.value)
                  }
                  className="w-full px-3 py-2 mt-1 rounded-md border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What did you eat?"
                />
              </div>
              <div>
                <span className="text-gray-600">Amount eaten:</span>
                <div className="flex gap-2 mt-2">
                  {amounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => onActivityChange('meal.amount', amount)}
                      className={`px-4 py-2 rounded-md transition-all ${
                        activity.meal.amount === amount
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/60 p-4 rounded-lg backdrop-blur-sm">
            <div className="font-medium text-gray-700 mb-3">Activities:</div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {availableActivities.map((act) => (
                  <label key={act} className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm">
                    <input
                      type="checkbox"
                      checked={activity.activities.includes(act)}
                      onChange={(e) => handleActivityToggle(act, e.target.checked)}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{act}</span>
                  </label>
                ))}
              </div>

              {/* Activity-specific questions */}
              {activity.activities.map((act) => (
                <div key={act} className="mt-4 space-y-3">
                  <h4 className="font-medium text-gray-700">{act} Notes:</h4>
                  {getRandomQuestions(activityQuestions[act]).map((question, idx) => (
                    <div key={`${act}_${idx}`} className="ml-4">
                      <label className="block text-sm text-gray-600 mb-1">{question}</label>
                      <textarea
                        value={activity.activityNotes?.[`${act}_${idx}`] || ''}
                        onChange={(e) => {
                          const newNotes = { ...activity.activityNotes };
                          newNotes[`${act}_${idx}`] = e.target.value;
                          onActivityChange('activityNotes', newNotes);
                        }}
                        className="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};