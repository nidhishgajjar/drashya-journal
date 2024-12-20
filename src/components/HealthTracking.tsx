import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface HealthData {
  seizures: {
    count: number;
    times: string;
    duration: 'Short' | 'Medium' | 'Long';
  };
  falls: {
    count: number;
    times: string;
    injuries: boolean;
    description: string;
  };
}

interface HealthTrackingProps {
  health: HealthData;
  onHealthChange: (field: string, value: any) => void;
}

export const HealthTracking: React.FC<HealthTrackingProps> = ({
  health,
  onHealthChange,
}) => {
  return (
    <div className="bg-red-50 rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold">Health Tracking</h3>
          </div>
        </div>
        <div className="space-y-4 ml-8">
          <div className="border-b pb-4">
            <div className="font-medium mb-2">Seizures:</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">Number of seizures</label>
                <input
                  type="number"
                  min="0"
                  value={health.seizures.count}
                  onChange={(e) =>
                    onHealthChange('seizures.count', parseInt(e.target.value))
                  }
                  className="px-2 py-1 rounded border"
                />
              </div>
              <div>
                <label className="block text-sm">Times occurred</label>
                <input
                  type="text"
                  value={health.seizures.times}
                  onChange={(e) =>
                    onHealthChange('seizures.times', e.target.value)
                  }
                  className="px-2 py-1 rounded border"
                />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm">Duration:</span>
              <div className="flex gap-2 mt-1">
                {['Short', 'Medium', 'Long'].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => onHealthChange('seizures.duration', duration)}
                    className={`px-3 py-1 rounded ${
                      health.seizures.duration === duration
                        ? 'bg-red-500 text-white'
                        : 'bg-white'
                    }`}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="font-medium mb-2">Falls:</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">Number of falls</label>
                <input
                  type="number"
                  min="0"
                  value={health.falls.count}
                  onChange={(e) =>
                    onHealthChange('falls.count', parseInt(e.target.value))
                  }
                  className="px-2 py-1 rounded border"
                />
              </div>
              <div>
                <label className="block text-sm">Times occurred</label>
                <input
                  type="text"
                  value={health.falls.times}
                  onChange={(e) => onHealthChange('falls.times', e.target.value)}
                  className="px-2 py-1 rounded border"
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={health.falls.injuries}
                  onChange={(e) =>
                    onHealthChange('falls.injuries', e.target.checked)
                  }
                  className="rounded"
                />
                Any injuries?
              </label>
              {health.falls.injuries && (
                <input
                  type="text"
                  value={health.falls.description}
                  onChange={(e) =>
                    onHealthChange('falls.description', e.target.value)
                  }
                  placeholder="Describe injuries..."
                  className="w-full px-2 py-1 mt-1 rounded border"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};