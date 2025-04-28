// Mô hình dữ liệu cho hệ thống

// Người dùng
export interface User {
  id: number
  username: string
  password: string // Trong thực tế sẽ được mã hóa
  name: string
  email?: string
  phone?: string
  role: string // ADMIN, PROJECT_MANAGER, STAFF, ACCOUNTANT, etc.
  department?: string
  position?: string
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Dự án
export interface Project {
  id: number
  code: string
  name: string
  description?: string
  client: string
  location: string
  startDate: string
  expectedEndDate: string
  actualEndDate?: string
  status: string // PREPARING, IN_PROGRESS, COMPLETED, PAUSED
  progress: number
  budget: number
  createdAt: string
  updatedAt: string
  members?: ProjectMember[]
  stages?: ProjectStage[]
  tasks?: Task[]
  documents?: Document[]
  constructionLogs?: ConstructionLog[]
  financials?: Financial[]
  warranties?: Warranty[]
}

// Thành viên dự án
export interface ProjectMember {
  id: number
  projectId: number
  userId: number
  role: string // PROJECT_MANAGER, ENGINEER, ACCOUNTANT, etc.
  startDate: string
  endDate?: string
  createdAt: string
  updatedAt: string
  project?: Project
  user?: User
}

// Giai đoạn dự án
export interface ProjectStage {
  id: number
  projectId: number
  name: string
  description?: string
  startDate: string
  endDate: string
  status: string // NOT_STARTED, IN_PROGRESS, COMPLETED, PAUSED
  completionPercentage: number
  createdAt: string
  updatedAt: string
  project?: Project
  tasks?: Task[]
}

// Công việc
export interface Task {
  id: number
  projectId: number
  stageId?: number
  name: string
  description?: string
  assignedToId?: number
  startDate: string
  dueDate: string
  status: string // NOT_STARTED, IN_PROGRESS, COMPLETED, PAUSED
  priority: string // LOW, MEDIUM, HIGH
  completionPercentage: number
  createdById: number
  createdAt: string
  updatedAt: string
  project?: Project
  stage?: ProjectStage
  assignedTo?: User
  createdBy?: User
}

// Tài liệu
export interface Document {
  id: number
  projectId: number
  name: string
  description?: string
  category: string // DESIGN, CONTRACT, REPORT, etc.
  fileType: string
  url: string
  size: number
  version?: string
  uploadedById: number
  createdAt: string
  updatedAt: string
  project?: Project
}

// Nhật ký công trình
export interface ConstructionLog {
  id: number
  projectId: number
  date: string
  weather?: string
  temperature?: string
  workPerformed: string
  issues?: string
  createdById: number
  createdAt: string
  updatedAt: string
  project?: Project
  createdBy?: User
  media?: ConstructionLogMedia[]
}

// Media nhật ký công trình
export interface ConstructionLogMedia {
  id: number
  constructionLogId: number
  type: string // IMAGE, VIDEO
  url: string
  filename: string
  size: number
  mimeType: string
  createdById: number
  createdAt: string
  constructionLog?: ConstructionLog
  createdBy?: User
}

// Tài chính
export interface Financial {
  id: number
  projectId: number
  type: string // INCOME, EXPENSE
  amount: number
  date: string
  description: string
  reference?: string
  paymentMethod: string
  status: string // PENDING, COMPLETED
  createdById: number
  createdAt: string
  updatedAt: string
  project?: Project
}

// Bảo hành
export interface Warranty {
  id: number
  projectId: number
  type: string
  description?: string
  startDate: string
  endDate: string
  status: string // NOT_STARTED, IN_PROGRESS, EXPIRED
  createdAt: string
  updatedAt: string
  project?: Project
}

// Kho
export interface Warehouse {
  id: number
  name: string
  location: string
  description?: string
  createdAt: string
  updatedAt: string
  items?: InventoryItem[]
}

// Vật tư trong kho
export interface InventoryItem {
  id: number
  code: string
  name: string
  description?: string
  category: string
  unit: string
  warehouseId: number
  currentQuantity: number
  minimumQuantity: number
  unitPrice: number
  createdAt: string
  updatedAt: string
  warehouse?: Warehouse
  transactions?: InventoryTransaction[]
}

// Giao dịch nhập xuất kho
export interface InventoryTransaction {
  id: number
  itemId: number
  type: string // IN, OUT
  quantity: number
  unitPrice: number
  totalPrice: number
  date: string
  projectId?: number
  supplierId?: number
  reference?: string
  notes?: string
  createdById: number
  createdAt: string
  item?: InventoryItem
}

// Nhà cung cấp
export interface Supplier {
  id: number
  name: string
  contactPerson?: string
  phone?: string
  email?: string
  address?: string
  taxCode?: string
  bankAccount?: string
  bankName?: string
  status: string // ACTIVE, INACTIVE
  createdAt: string
  updatedAt: string
}

// Thiết bị
export interface Equipment {
  id: number
  code: string
  name: string
  description?: string
  category: string
  serialNumber?: string
  manufacturer?: string
  purchaseDate: string
  purchasePrice: number
  currentLocation?: string
  assignedToId?: number
  status: string // AVAILABLE, IN_USE, MAINTENANCE, BROKEN
  lastMaintenanceDate?: string
  nextMaintenanceDate?: string
  maintenanceCycle?: number
  createdAt: string
  updatedAt: string
}
