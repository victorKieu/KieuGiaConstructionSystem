export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          address: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone: string
          address: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          notes?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          start_date: string
          end_date: string | null
          status: string
          customer_id: string | null
          budget: number | null
          location: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          start_date: string
          end_date?: string | null
          status: string
          customer_id?: string | null
          budget?: number | null
          location?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          start_date?: string
          end_date?: string | null
          status?: string
          customer_id?: string | null
          budget?: number | null
          location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          username: string
          password: string
          role: string
          full_name: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          username: string
          password: string
          role?: string
          full_name?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          username?: string
          password?: string
          role?: string
          full_name?: string | null
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
