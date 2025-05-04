// File: src/api/teachers.ts
import { supabase } from '../utils/supabaseClient'
import { Teacher } from '../types'

export const addTeacher = async (teacher: Teacher) => {
  try {
    const { data, error } = await supabase
      .from('Teachers')
      .insert([teacher])
      .select()
    
    if (error) {
      console.error('Supabase error:', JSON.stringify(error, null, 2))
      throw error
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Error in addTeacher:', JSON.stringify(error, null, 2))
    return { data: null, error }
  }
}

export const getTeachers = async (): Promise<{ data: Teacher[] | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
    
    console.log(data, error)
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Error in getTeachers:', error)
    return { data: null, error }
  }
}

export const updateTeacher = async (
  id: string,
  updates: Partial<Teacher>
): Promise<{ data: Teacher[] | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Error in updateTeacher:', error)
    return { data: null, error }
  }
}

export const deleteTeacher = async (
  id: string
): Promise<{ data: Teacher[] | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Error in deleteTeacher:', error)
    return { data: null, error }
  }
}