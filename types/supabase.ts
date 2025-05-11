export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      // Bảng dự án
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          location: string | null
          start_date: string | null
          end_date: string | null
          status: string
          progress: number
          customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          location?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          progress?: number
          customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          location?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          progress?: number
          customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // Bảng mốc dự án
      project_milestones: {
        Row: {
          id: string
          project_id: string
          name: string
          description: string | null
          due_date: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          description?: string | null
          due_date?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          description?: string | null
          due_date?: string | null
          status?: string
          created_at?: string
        }
      }

      // Bảng vấn đề dự án
      project_issues: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          status: string
          priority: string
          reported_by: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: string
          priority?: string
          reported_by?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          reported_by?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // Bảng tài chính dự án
      project_finances: {
        Row: {
          id: string
          project_id: string
          budget: number
          expenses: number
          revenue: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          budget: number
          expenses?: number
          revenue?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          budget?: number
          expenses?: number
          revenue?: number
          created_at?: string
          updated_at?: string
        }
      }

      // Bảng nhóm dự án
      project_team: {
        Row: {
          id: string
          project_id: string
          employee_id: string
          role: string
          start_date: string | null
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          employee_id: string
          role: string
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          employee_id?: string
          role?: string
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
      }

      // Bảng tài liệu dự án
      project_documents: {
        Row: {
          id: string
          project_id: string
          name: string
          file_path: string
          file_type: string
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          file_path: string
          file_type: string
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          file_path?: string
          file_type?: string
          uploaded_by?: string
          created_at?: string
        }
      }

      // Bảng khách hàng
      customers: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          type: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          type?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          type?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }

      // Bảng liên hệ khách hàng
      customer_contacts: {
        Row: {
          id: string
          customer_id: string
          name: string
          position: string | null
          phone: string | null
          email: string | null
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          name: string
          position?: string | null
          phone?: string | null
          email?: string | null
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          name?: string
          position?: string | null
          phone?: string | null
          email?: string | null
          is_primary?: boolean
          created_at?: string
        }
      }

      // Bảng giao dịch khách hàng
      customer_transactions: {
        Row: {
          id: string
          customer_id: string
          project_id: string | null
          amount: number
          type: string
          status: string
          date: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          project_id?: string | null
          amount: number
          type: string
          status: string
          date: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          project_id?: string | null
          amount?: number
          type?: string
          status?: string
          date?: string
          description?: string | null
          created_at?: string
        }
      }

      // Bảng vật tư
      materials: {
        Row: {
          id: string
          name: string
          code: string
          category: string
          unit: string
          price: number | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          category: string
          unit: string
          price?: number | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          category?: string
          unit?: string
          price?: number | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // Bảng kho
      warehouses: {
        Row: {
          id: string
          name: string
          location: string
          manager_id: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          manager_id?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          manager_id?: string | null
          status?: string
          created_at?: string
        }
      }

      // Bảng tồn kho
      warehouse_inventory: {
        Row: {
          id: string
          warehouse_id: string
          material_id: string
          quantity: number
          min_quantity: number | null
          max_quantity: number | null
          last_updated: string
        }
        Insert: {
          id?: string
          warehouse_id: string
          material_id: string
          quantity: number
          min_quantity?: number | null
          max_quantity?: number | null
          last_updated?: string
        }
        Update: {
          id?: string
          warehouse_id?: string
          material_id?: string
          quantity?: number
          min_quantity?: number | null
          max_quantity?: number | null
          last_updated?: string
        }
      }

      // Bảng giao dịch kho
      inventory_transactions: {
        Row: {
          id: string
          warehouse_id: string
          material_id: string
          quantity: number
          type: string
          reference_id: string | null
          reference_type: string | null
          date: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          warehouse_id: string
          material_id: string
          quantity: number
          type: string
          reference_id?: string | null
          reference_type?: string | null
          date: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          warehouse_id?: string
          material_id?: string
          quantity?: number
          type?: string
          reference_id?: string | null
          reference_type?: string | null
          date?: string
          created_by?: string
          created_at?: string
        }
      }

      // Bảng nhà cung cấp
      suppliers: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          contact_person: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          contact_person?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          contact_person?: string | null
          status?: string
          created_at?: string
        }
      }

      // Bảng yêu cầu vật tư
      material_requests: {
        Row: {
          id: string
          project_id: string | null
          requested_by: string
          status: string
          priority: string
          required_date: string | null
          approved_by: string | null
          approved_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          requested_by: string
          status?: string
          priority?: string
          required_date?: string | null
          approved_by?: string | null
          approved_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          requested_by?: string
          status?: string
          priority?: string
          required_date?: string | null
          approved_by?: string | null
          approved_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // Bảng chi tiết yêu cầu vật tư
      material_request_items: {
        Row: {
          id: string
          request_id: string
          material_id: string
          quantity: number
          unit: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          material_id: string
          quantity: number
          unit: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          material_id?: string
          quantity?: number
          unit?: string
          status?: string
          created_at?: string
        }
      }

      // Bảng nhân viên
      employees: {
        Row: {
          id: string
          name: string
          position: string
          department: string
          phone: string | null
          email: string | null
          address: string | null
          join_date: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          position: string
          department: string
          phone?: string | null
          email?: string | null
          address?: string | null
          join_date: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          position?: string
          department?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          join_date?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }

      // Bảng chấm công
      attendance: {
        Row: {
          id: string
          employee_id: string
          date: string
          time_in: string | null
          time_out: string | null
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          date: string
          time_in?: string | null
          time_out?: string | null
          status: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          date?: string
          time_in?: string | null
          time_out?: string | null
          status?: string
          notes?: string | null
          created_at?: string
        }
      }

      // Bảng tài sản
      assets: {
        Row: {
          id: string
          name: string
          type: string
          status: string
          purchase_date: string | null
          purchase_price: number | null
          current_location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          status: string
          purchase_date?: string | null
          purchase_price?: number | null
          current_location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          status?: string
          purchase_date?: string | null
          purchase_price?: number | null
          current_location?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // Bảng phân công tài sản
      asset_assignments: {
        Row: {
          id: string
          asset_id: string
          employee_id: string | null
          project_id: string | null
          start_date: string
          end_date: string | null
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          asset_id: string
          employee_id?: string | null
          project_id?: string | null
          start_date: string
          end_date?: string | null
          status: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          asset_id?: string
          employee_id?: string | null
          project_id?: string | null
          start_date?: string
          end_date?: string | null
          status?: string
          notes?: string | null
          created_at?: string
        }
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
  }
}
