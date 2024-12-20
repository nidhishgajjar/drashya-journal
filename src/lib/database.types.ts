export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      journals: {
        Row: {
          id: string
          user_id: string
          date: string
          mood: string
          mood_explanation: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          mood: string
          mood_explanation?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          mood?: string
          mood_explanation?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      time_sections: {
        Row: {
          id: string
          journal_id: string
          section_type: 'morning' | 'afternoon' | 'evening'
          time: string | null
          medicine_time: string | null
          medicine_taken: boolean
          meal_time: string | null
          meal_items: string | null
          meal_amount: 'All' | 'Most' | 'Half' | 'Little' | null
          activities: string[]
        }
        Insert: {
          id?: string
          journal_id: string
          section_type: 'morning' | 'afternoon' | 'evening'
          time?: string | null
          medicine_time?: string | null
          medicine_taken?: boolean
          meal_time?: string | null
          meal_items?: string | null
          meal_amount?: 'All' | 'Most' | 'Half' | 'Little' | null
          activities?: string[]
        }
        Update: {
          id?: string
          journal_id?: string
          section_type?: 'morning' | 'afternoon' | 'evening'
          time?: string | null
          medicine_time?: string | null
          medicine_taken?: boolean
          meal_time?: string | null
          meal_items?: string | null
          meal_amount?: 'All' | 'Most' | 'Half' | 'Little' | null
          activities?: string[]
        }
      }
      health_records: {
        Row: {
          id: string
          journal_id: string
          seizure_count: number
          seizure_times: string | null
          seizure_duration: 'Short' | 'Medium' | 'Long' | null
          fall_count: number
          fall_times: string | null
          fall_injuries: boolean
          injury_description: string | null
        }
        Insert: {
          id?: string
          journal_id: string
          seizure_count?: number
          seizure_times?: string | null
          seizure_duration?: 'Short' | 'Medium' | 'Long' | null
          fall_count?: number
          fall_times?: string | null
          fall_injuries?: boolean
          injury_description?: string | null
        }
        Update: {
          id?: string
          journal_id?: string
          seizure_count?: number
          seizure_times?: string | null
          seizure_duration?: 'Short' | 'Medium' | 'Long' | null
          fall_count?: number
          fall_times?: string | null
          fall_injuries?: boolean
          injury_description?: string | null
        }
      }
      achievements: {
        Row: {
          id: string
          journal_id: string
          learned: string | null
          proud: string | null
          help: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          journal_id: string
          learned?: string | null
          proud?: string | null
          help?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          journal_id?: string
          learned?: string | null
          proud?: string | null
          help?: string | null
          notes?: string | null
        }
      }
    }
  }
}