export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_status: 'free' | 'premium'
          subscription_expires_at: string | null
          interview_credits: number
          total_interviews: number
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_status?: 'free' | 'premium'
          subscription_expires_at?: string | null
          interview_credits?: number
          total_interviews?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_status?: 'free' | 'premium'
          subscription_expires_at?: string | null
          interview_credits?: number
          total_interviews?: number
        }
        Relationships: []
      }
      interview_sessions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          interview_type: 'behavioral' | 'technical' | 'system_design'
          difficulty_level: 'entry' | 'mid' | 'senior'
          position_title: string | null
          company_name: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          score: number | null
          feedback: Json | null
          duration_minutes: number | null
          questions_asked: Json | null
          responses_given: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          interview_type: 'behavioral' | 'technical' | 'system_design'
          difficulty_level: 'entry' | 'mid' | 'senior'
          position_title?: string | null
          company_name?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          score?: number | null
          feedback?: Json | null
          duration_minutes?: number | null
          questions_asked?: Json | null
          responses_given?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          interview_type?: 'behavioral' | 'technical' | 'system_design'
          difficulty_level?: 'entry' | 'mid' | 'senior'
          position_title?: string | null
          company_name?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          score?: number | null
          feedback?: Json | null
          duration_minutes?: number | null
          questions_asked?: Json | null
          responses_given?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      preorders: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          phone: string | null
          source: string | null
          utm_campaign: string | null
          utm_source: string | null
          utm_medium: string | null
          interested_features: string[] | null
          expected_launch_interest: number | null
          converted_to_user: boolean
          converted_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          full_name?: string | null
          phone?: string | null
          source?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          interested_features?: string[] | null
          expected_launch_interest?: number | null
          converted_to_user?: boolean
          converted_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          source?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          interested_features?: string[] | null
          expected_launch_interest?: number | null
          converted_to_user?: boolean
          converted_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}