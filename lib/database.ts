import { supabase } from './supabase'
import { Database } from '../types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

type InterviewSession = Database['public']['Tables']['interview_sessions']['Row']
type InterviewSessionInsert = Database['public']['Tables']['interview_sessions']['Insert']
type InterviewSessionUpdate = Database['public']['Tables']['interview_sessions']['Update']

type Preorder = Database['public']['Tables']['preorders']['Row']
type PreorderInsert = Database['public']['Tables']['preorders']['Insert']

// Profile operations
export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  },

  async updateProfile(userId: string, updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    return { data, error }
  },

  async createProfile(profile: ProfileInsert) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()
    
    return { data, error }
  }
}

// Interview session operations
export const interviewService = {
  async getUserInterviews(userId: string, limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    return { data, error }
  },

  async getInterview(sessionId: string) {
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()
    
    return { data, error }
  },

  async createInterview(interview: InterviewSessionInsert) {
    const { data, error } = await supabase
      .from('interview_sessions')
      .insert(interview)
      .select()
      .single()
    
    return { data, error }
  },

  async updateInterview(sessionId: string, updates: InterviewSessionUpdate) {
    const { data, error } = await supabase
      .from('interview_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single()
    
    return { data, error }
  },

  async deleteInterview(sessionId: string) {
    const { error } = await supabase
      .from('interview_sessions')
      .delete()
      .eq('id', sessionId)
    
    return { error }
  },

  async getInterviewStats(userId: string) {
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('status, score, interview_type')
      .eq('user_id', userId)
    
    if (error) return { data: null, error }

    const stats = {
      total: data.length,
      completed: data.filter(i => i.status === 'completed').length,
      averageScore: data
        .filter(i => i.score !== null)
        .reduce((acc, i) => acc + (i.score || 0), 0) / 
        data.filter(i => i.score !== null).length || 0,
      byType: {
        behavioral: data.filter(i => i.interview_type === 'behavioral').length,
        technical: data.filter(i => i.interview_type === 'technical').length,
        system_design: data.filter(i => i.interview_type === 'system_design').length,
      }
    }

    return { data: stats, error: null }
  }
}

// Preorder operations
export const preorderService = {
  async createPreorder(preorder: PreorderInsert) {
    const { data, error } = await supabase
      .from('preorders')
      .insert(preorder)
      .select()
      .single()
    
    return { data, error }
  },

  async getPreorders(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('preorders')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    return { data, error }
  },

  async markAsConverted(email: string) {
    const { data, error } = await supabase
      .from('preorders')
      .update({ 
        converted_to_user: true, 
        converted_at: new Date().toISOString() 
      })
      .eq('email', email)
      .select()
      .single()
    
    return { data, error }
  }
}

// Auth utilities
export const authService = {
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })
    
    return { data, error }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export type { 
  Profile, 
  ProfileInsert, 
  ProfileUpdate,
  InterviewSession, 
  InterviewSessionInsert, 
  InterviewSessionUpdate,
  Preorder,
  PreorderInsert 
}