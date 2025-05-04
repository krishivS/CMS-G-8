// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iyrgeilmqudqrvpchsek.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cmdlaWxtcXVkcXJ2cGNoc2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNjIxNzIsImV4cCI6MjA2MTkzODE3Mn0.b_Yl0LOXXpfHpEfIq0tGj3kPEJ41z3QuoAfMMmabBJU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
