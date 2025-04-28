export interface Project {
  id: number
  code: string
  name: string
  description?: string
  client: string
  location: string
  startDate: string | Date
  expectedEndDate: string | Date
  actualEndDate?: string | Date
  status: string
  progress: number
  budget: number
  createdAt: string | Date
  updatedAt: string | Date
}

export interface User {
  id: number
  username: string
  name: string
  email?: string
  phone?: string
  role: string
}

export interface Stage {
  id: number
  projectId: number
  name: string
  description?: string
  startDate: string | Date
  endDate: string | Date
  status: string
  completionPercentage: number
}

export interface Task {
  id: number
  projectId: number
  stageId?: number
  name: string
  description?: string
  assignedToId?: number
  startDate: string | Date
  dueDate: string | Date
  status: string
  priority: string
  completionPercentage: number
}

export interface ProjectMember {
  id: number
  projectId: number
  userId: number
  role: string
  startDate: string | Date
  endDate?: string | Date
}

export interface Document {
  id: number
  projectId: number
  name: string
  type: string
  filePath: string
  uploadedAt: string | Date
  description?: string
}

export interface ConstructionLog {
  id: number
  projectId: number
  date: string | Date
  weather?: string
  temperature?: string
  workPerformed: string
  issues?: string
  createdById: number
  createdAt: string | Date
  media?: Media[]
}

export interface Media {
  id: number
  constructionLogId: number
  type: string
  url: string
  description?: string
  uploadedAt: string | Date
}

export interface Warranty {
  id: number
  projectId: number
  itemName: string
  description?: string
  startDate: string | Date
  endDate: string | Date
  status: string
}

export interface Inventory {
  id: number
  name: string
  category: string
  unit: string
  quantity: number
  unitPrice: number
  description?: string
  location?: string
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Supplier {
  id: number
  name: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Equipment {
  id: number
  name: string
  type: string
  serialNumber?: string
  purchaseDate: string | Date
  status: string
  assignedTo?: string
  location?: string
  createdAt: string | Date
  updatedAt: string | Date
}
