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
    health: any
  ) => {
    try {
      // First check if an entry exists for this date
      const { data: existingJournal } = await supabase
        .from('journals')
        .select('id')
        .eq('date', date.toISOString().split('T')[0])
        .single();

      // Start a transaction by using multiple operations
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

      if (!journal) {
        console.error('No journal data returned after save');
        return false;
      }

      console.log('Journal saved:', journal);

      // Save time sections
      const timeSections = [
        { ...morning, section_type: 'morning' },
        { ...afternoon, section_type: 'afternoon' },
        { ...evening, section_type: 'evening' },
      ];

      for (const section of timeSections) {
        const { error: sectionError } = await supabase
          .from('time_sections')
          .upsert({
            journal_id: journal.id,
            section_type: section.section_type,
            time: section.time || null,
            medicine_time: section.medicine.timeTaken || null,
            medicine_taken: section.medicine.taken,
            meal_time: section.meal.time || null,
            meal_items: section.meal.items || null,
            meal_amount: section.meal.amount || null,
            activities: section.activities || [],
          });

        if (sectionError) {
          console.error('Error saving time section:', sectionError);
          throw sectionError;
        }
      }

      // Save health record
      const { error: healthError } = await supabase
        .from('health_records')
        .upsert({
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