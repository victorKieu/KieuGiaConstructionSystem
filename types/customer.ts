export interface Customer {
  id: string
  name: string
  type: "company" | "individual" | "government"
  contact_person?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  tax_code?: string | null
  status: "active" | "potential" | "inactive"
  notes?: string | null
  created_at?: string
  updated_at?: string
  code?: string | null
  position?: string | null
  birthday?: string | null
  sales_channel?: string | null
  geocode?: string | null
}

export interface CustomerFormData {
  name: string
  type: "company" | "individual" | "government"
  contact_person?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  tax_code?: string | null
  status: "active" | "potential" | "inactive"
  notes?: string | null
  code?: string | null
  position?: string | null
  birthday?: string | null
  sales_channel?: string | null
  geocode?: string | null
}
