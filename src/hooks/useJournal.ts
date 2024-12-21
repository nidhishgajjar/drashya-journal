import { useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useJournal = () => {
  const saveJournalEntry = useCallback(async (
    date: Date,
    mood: string,
    moodExplanation: string,
    morning: any,
    afternoon: any,
    evening: any,
    health: any,
    achievements: any
  ) => {
    try {
      // First check if an entry exists for this date
      const { data: existingJournal } = await supabase
        .from('journals')
        .select(`
          id, 
          time_sections(id, section_type),
          health_records(id),
          achievements(id)
        `)
        .eq('date', date.toISOString().split('T')[0])
        .single();

      // Save or update journal
      const { data: journal, error: journalError } = await supabase
        .from('journals')
        .upsert({
          id: existingJournal?.id,
          date: date.toISOString().split('T')[0],
          mood,
          mood_explanation: moodExplanation,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (journalError) {
        console.error('Error saving journal:', journalError);
        throw journalError;
      }

      // Map existing time sections to their types
      const existingSections = existingJournal?.time_sections?.reduce((acc: any, section: any) => {
        acc[section.section_type] = section.id;
        return acc;
      }, {}) || {};

      // Save time sections with their existing IDs if available
      const timeSections = [
        { ...morning, section_type: 'morning', id: existingSections['morning'] },
        { ...afternoon, section_type: 'afternoon', id: existingSections['afternoon'] },
        { ...evening, section_type: 'evening', id: existingSections['evening'] },
      ];

      for (const section of timeSections) {
        const { error: sectionError } = await supabase
          .from('time_sections')
          .upsert({
            id: section.id,
            journal_id: journal.id,
            section_type: section.section_type,
            time: section.time || null,
            medicine_time: section.medicine.timeTaken || null,
            medicine_taken: section.medicine.taken,
            meal_time: section.meal.time || null,
            meal_items: section.meal.items || null,
            meal_amount: section.meal.amount || null,
            activities: section.activities || [],
            activity_notes: section.activityNotes || {},
          });

        if (sectionError) {
          console.error('Error saving time section:', sectionError);
          throw sectionError;
        }
      }

      // Get existing health record ID if it exists
      const existingHealthId = existingJournal?.health_records?.[0]?.id;

      // Save health record with existing ID if available
      const { error: healthError } = await supabase
        .from('health_records')
        .upsert({
          id: existingHealthId,
          journal_id: journal.id,
          seizure_count: health.seizures.count || 0,
          seizure_times: health.seizures.times || null,
          seizure_duration: health.seizures.duration || 'Short',
          fall_count: health.falls.count || 0,
          fall_times: health.falls.times || null,
          fall_injuries: health.falls.injuries || false,
          injury_description: health.falls.description || null,
        });

      if (healthError) {
        console.error('Error saving health record:', healthError);
        throw healthError;
      }

      // Get existing achievement ID if it exists
      const existingAchievementId = existingJournal?.achievements?.[0]?.id;

      // Save achievement with existing ID if available
      const { error: achievementError } = await supabase
        .from('achievements')
        .upsert({
          id: existingAchievementId,
          journal_id: journal.id,
          learned: achievements.learned || null,
          proud: achievements.proud || null,
          help: achievements.help || null,
          notes: achievements.notes || null,
        });

      if (achievementError) {
        console.error('Error saving achievements:', achievementError);
        throw achievementError;
      }

      console.log('All data saved successfully');
      return true;

    } catch (error) {
      console.error('Error in saveJournalEntry:', error);
      throw error;
    }
  }, []);

  const loadJournalEntry = useCallback(async (date: Date) => {
    try {
      const { data: journal, error: journalError } = await supabase
        .from('journals')
        .select(`
          *,
          time_sections (*),
          health_records (*)
        `)
        .eq('date', date.toISOString().split('T')[0])
        .single();

      if (journalError) {
        if (journalError.code === 'PGRST116') {
          // No data found for today
          return null;
        }
        console.error('Error loading journal:', journalError);
        return null;
      }

      return journal;
    } catch (error) {
      console.error('Error loading journal:', error);
      return null;
    }
  }, []);

  return {
    saveJournalEntry,
    loadJournalEntry,
  };
};