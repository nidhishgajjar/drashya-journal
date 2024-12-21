import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TimeSection } from './components/TimeSection';
import { HealthTracking } from './components/HealthTracking';
import { Achievements } from './components/Achievements';
import { useJournal } from './hooks/useJournal';
import { Toast } from './components/Toast';
import { useDebounce } from './hooks/useDebounce';

function App() {
  const [date, setDate] = useState(new Date());
  const [mood, setMood] = useState('Okay');
  const [moodExplanation, setMoodExplanation] = useState('');

  const [morning, setMorning] = useState({
    time: '',
    medicine: { timeTaken: '', taken: false },
    meal: { time: '', items: '', amount: 'All' as const },
    activities: [],
    activityNotes: {},
  });

  const [afternoon, setAfternoon] = useState({
    time: '',
    medicine: { timeTaken: '', taken: false },
    meal: { time: '', items: '', amount: 'All' as const },
    activities: [],
    activityNotes: {},
  });

  const [evening, setEvening] = useState({
    time: '',
    medicine: { timeTaken: '', taken: false },
    meal: { time: '', items: '', amount: 'All' as const },
    activities: [],
    activityNotes: {},
  });

  const [health, setHealth] = useState({
    seizures: {
      count: 0,
      times: '',
      duration: 'Short' as const,
    },
    falls: {
      count: 0,
      times: '',
      injuries: false,
      description: '',
    },
  });

  const [achievements, setAchievements] = useState({
    learned: '',
    proud: '',
    help: '',
    notes: '',
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { saveJournalEntry, loadJournalEntry } = useJournal();

  const debouncedMood = useDebounce(mood, 1000);
  const debouncedMoodExplanation = useDebounce(moodExplanation, 1000);
  const debouncedMorning = useDebounce(morning, 1000);
  const debouncedAfternoon = useDebounce(afternoon, 1000);
  const debouncedEvening = useDebounce(evening, 1000);
  const debouncedHealth = useDebounce(health, 1000);

  useEffect(() => {
    const loadData = async () => {
      const journalData = await loadJournalEntry(date);
      if (journalData) {
        // Update state with loaded data
        setMood(journalData.mood);
        setMoodExplanation(journalData.mood_explanation || '');
        
        // Update time sections
        const sections = journalData.time_sections;
        sections.forEach((section: any) => {
          const sectionData = {
            time: section.time || '',
            medicine: {
              timeTaken: section.medicine_time || '',
              taken: section.medicine_taken,
            },
            meal: {
              time: section.meal_time || '',
              items: section.meal_items || '',
              amount: section.meal_amount || 'All',
            },
            activities: section.activities || [],
            activityNotes: section.activity_notes || {},
          };

          if (section.section_type === 'morning') setMorning(sectionData);
          if (section.section_type === 'afternoon') setAfternoon(sectionData);
          if (section.section_type === 'evening') setEvening(sectionData);
        });

        // Update health data
        const healthRecord = journalData.health_records[0];
        if (healthRecord) {
          setHealth({
            seizures: {
              count: healthRecord.seizure_count,
              times: healthRecord.seizure_times || '',
              duration: healthRecord.seizure_duration || 'Short',
            },
            falls: {
              count: healthRecord.fall_count,
              times: healthRecord.fall_times || '',
              injuries: healthRecord.fall_injuries,
              description: healthRecord.injury_description || '',
            },
          });
        }
      }
    };

    loadData();
  }, [date]);

  useEffect(() => {
    const autoSave = async () => {
      try {
        const saved = await saveJournalEntry(
          date,
          debouncedMood,
          debouncedMoodExplanation,
          debouncedMorning,
          debouncedAfternoon,
          debouncedEvening,
          debouncedHealth,
          achievements
        );
        if (saved) {
          setToastMessage('Changes saved automatically');
        } else {
          setToastMessage('Error saving changes');
        }
        setShowToast(true);
      } catch (error) {
        console.error('Auto-save error:', error);
        setToastMessage('Error saving changes');
        setShowToast(true);
      }
    };

    autoSave();
  }, [
    date,
    debouncedMood,
    debouncedMoodExplanation,
    debouncedMorning,
    debouncedAfternoon,
    debouncedEvening,
    debouncedHealth,
    achievements,
  ]);

  const handleActivityChange = (
    section: 'morning' | 'afternoon' | 'evening',
    field: string,
    value: any
  ) => {
    const setSection =
      section === 'morning'
        ? setMorning
        : section === 'afternoon'
        ? setAfternoon
        : setEvening;

    const fields = field.split('.');
    setSection((prev: any) => {
      const newState = { ...prev };
      let current = newState;
      for (let i = 0; i < fields.length - 1; i++) {
        current = current[fields[i]];
      }
      current[fields[fields.length - 1]] = value;
      return newState;
    });
  };

  const handleHealthChange = (field: string, value: any) => {
    const fields = field.split('.');
    setHealth((prev) => {
      const newState = { ...prev };
      let current: any = newState;
      for (let i = 0; i < fields.length - 1; i++) {
        current = current[fields[i]];
      }
      current[fields[fields.length - 1]] = value;
      return newState;
    });
  };

  const handleDateChange = async (newDate: Date) => {
    setDate(newDate);
    const journalData = await loadJournalEntry(newDate);
    
    if (journalData) {
      // Update state with loaded data
      setMood(journalData.mood);
      setMoodExplanation(journalData.mood_explanation || '');
      
      // Update time sections
      const sections = journalData.time_sections;
      sections.forEach((section: any) => {
        const sectionData = {
          time: section.time || '',
          medicine: {
            timeTaken: section.medicine_time || '',
            taken: section.medicine_taken,
          },
          meal: {
            time: section.meal_time || '',
            items: section.meal_items || '',
            amount: section.meal_amount || 'All',
          },
          activities: section.activities || [],
          activityNotes: section.activity_notes || {},
        };

        if (section.section_type === 'morning') setMorning(sectionData);
        if (section.section_type === 'afternoon') setAfternoon(sectionData);
        if (section.section_type === 'evening') setEvening(sectionData);
      });

      // Update health data
      const healthRecord = journalData.health_records[0];
      if (healthRecord) {
        setHealth({
          seizures: {
            count: healthRecord.seizure_count,
            times: healthRecord.seizure_times || '',
            duration: healthRecord.seizure_duration || 'Short',
          },
          falls: {
            count: healthRecord.fall_count,
            times: healthRecord.fall_times || '',
            injuries: healthRecord.fall_injuries,
            description: healthRecord.injury_description || '',
          },
        });
      }

      // Update achievements
      const achievement = journalData.achievements[0];
      if (achievement) {
        setAchievements({
          learned: achievement.learned || '',
          proud: achievement.proud || '',
          help: achievement.help || '',
          notes: achievement.notes || '',
        });
      }
    } else {
      // Reset form if no data exists
      setMood('Okay');
      setMoodExplanation('');
      setMorning({
        time: '',
        medicine: { timeTaken: '', taken: false },
        meal: { time: '', items: '', amount: 'All' },
        activities: [],
        activityNotes: {},
      });
      setAfternoon({
        time: '',
        medicine: { timeTaken: '', taken: false },
        meal: { time: '', items: '', amount: 'All' },
        activities: [],
        activityNotes: {},
      });
      setEvening({
        time: '',
        medicine: { timeTaken: '', taken: false },
        meal: { time: '', items: '', amount: 'All' },
        activities: [],
        activityNotes: {},
      });
      setHealth({
        seizures: { count: 0, times: '', duration: 'Short' },
        falls: { count: 0, times: '', injuries: false, description: '' },
      });
      setAchievements({ learned: '', proud: '', help: '', notes: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Hi Drashya,</h1>
        
        <Header 
          date={date}
          onDateChange={handleDateChange}
          mood={mood}
          onMoodChange={setMood}
          moodExplanation={moodExplanation}
          onMoodExplanationChange={setMoodExplanation}
        />
        
        <TimeSection
          icon="🌅"
          title="Morning Activities (6 AM - 12 PM)"
          bgColor="bg-gradient-to-br from-yellow-50 to-orange-50"
          activity={morning}
          onActivityChange={(field, value) =>
            handleActivityChange('morning', field, value)
          }
        />

        <TimeSection
          icon="☀️"
          title="Afternoon Activities (12 PM - 5 PM)"
          bgColor="bg-gradient-to-br from-orange-50 to-amber-50"
          activity={afternoon}
          onActivityChange={(field, value) =>
            handleActivityChange('afternoon', field, value)
          }
        />

        <TimeSection
          icon="🌙"
          title="Evening Activities (5 PM - Bedtime)"
          bgColor="bg-gradient-to-br from-purple-50 to-indigo-50"
          activity={evening}
          onActivityChange={(field, value) =>
            handleActivityChange('evening', field, value)
          }
        />

        <HealthTracking
          health={health}
          onHealthChange={handleHealthChange}
        />

        <Achievements
          achievements={achievements}
          onAchievementChange={(field, value) =>
            setAchievements((prev) => ({ ...prev, [field]: value }))
          }
        />

        {showToast && (
          <Toast 
            message={toastMessage} 
            onClose={() => setShowToast(false)} 
          />
        )}
      </div>
    </div>
  );
}

export default App;