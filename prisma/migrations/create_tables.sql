-- Tạo bảng User
CREATE TABLE IF NOT EXISTS "User" (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  role VARCHAR(50) NOT NULL,
  department VARCHAR(100),
  position VARCHAR(100),
  avatar VARCHAR(255),
  "isActive" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Department
CREATE TABLE IF NOT EXISTS "Department" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Position
CREATE TABLE IF NOT EXISTS "Position" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Client
CREATE TABLE IF NOT EXISTS "Client" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  "contactName" VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Project
CREATE TABLE IF NOT EXISTS "Project" (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  "clientId" INTEGER NOT NULL,
  location VARCHAR(255),
  "startDate" TIMESTAMP NOT NULL,
  "expectedEndDate" TIMESTAMP NOT NULL,
  "actualEndDate" TIMESTAMP,
  status VARCHAR(50) NOT NULL,
  progress FLOAT DEFAULT 0,
  budget FLOAT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("clientId") REFERENCES "Client" (id)
);

-- Tạo bảng ProjectMember
CREATE TABLE IF NOT EXISTS "ProjectMember" (
  id SERIAL PRIMARY KEY,
  "projectId" INTEGER NOT NULL,
  "userId" INTEGER NOT NULL,
  role VARCHAR(50) NOT NULL,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("projectId") REFERENCES "Project" (id),
  FOREIGN KEY ("userId") REFERENCES "User" (id),
  UNIQUE ("projectId", "userId")
);

-- Tạo bảng ProjectStage
CREATE TABLE IF NOT EXISTS "ProjectStage" (
  id SERIAL PRIMARY KEY,
  "projectId" INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL,
  "completionPercentage" FLOAT DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("projectId") REFERENCES "Project" (id)
);

-- Tạo bảng Task
CREATE TABLE IF NOT EXISTS "Task" (
  id SERIAL PRIMARY KEY,
  "projectId" INTEGER NOT NULL,
  "stageId" INTEGER,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  "assignedToId" INTEGER,
  "startDate" TIMESTAMP NOT NULL,
  "dueDate" TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL,
  priority VARCHAR(50) NOT NULL,
  "completionPercentage" FLOAT DEFAULT 0,
  "createdById" INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("projectId") REFERENCES "Project" (id),
  FOREIGN KEY ("stageId") REFERENCES "ProjectStage" (id),
  FOREIGN KEY ("assignedToId") REFERENCES "User" (id),
  FOREIGN KEY ("createdById") REFERENCES "User" (id)
);

-- Tạo bảng Document
CREATE TABLE IF NOT EXISTS "Document" (
  id SERIAL PRIMARY KEY,
  "projectId" INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  "fileType" VARCHAR(50) NOT NULL,
  url VARCHAR(255) NOT NULL,
  size INTEGER NOT NULL,
  version VARCHAR(50),
  "uploadedById" INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("projectId") REFERENCES "Project" (id)
);

-- Tạo bảng ConstructionLog
CREATE TABLE IF NOT EXISTS "ConstructionLog" (
  id SERIAL PRIMARY KEY,
  "projectId" INTEGER NOT NULL,
  date TIMESTAMP NOT NULL,
  weather VARCHAR(100),
  temperature VARCHAR(50),
  "workPerformed" TEXT NOT NULL,
  issues TEXT,
  "createdById" INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("projectId") REFERENCES "Project" (id),
  FOREIGN KEY ("createdById") REFERENCES "User" (id)
);

-- Tạo bảng ConstructionLogMedia
CREATE TABLE IF NOT EXISTS "ConstructionLogMedia" (
  id SERIAL PRIMARY KEY,
  "constructionLogId" INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  url VARCHAR(255) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  size INTEGER NOT NULL,
  "mimeType" VARCHAR(100) NOT NULL,
  "createdById" INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("constructionLogId") REFERENCES "ConstructionLog" (id),
  FOREIGN KEY ("createdById") REFERENCES "User" (id)
);

-- Tạo bảng Financial
CREATE TABLE IF NOT EXISTS "Financial" (
  id SERIAL PRIMARY KEY,
  "projectId" INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  amount FLOAT NOT NULL,
  date TIMESTAMP NOT NULL,
  description TEXT NOT NULL,
  reference VARCHAR(255),
  "paymentMethod" VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  "createdById" INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("projectId") REFERENCES "Project" (id),
  FOREIGN KEY ("createdById") REFERENCES "User" (id)
);

-- Tạo bảng Warranty
CREATE TABLE IF NOT EXISTS "Warranty" (
  id SERIAL PRIMARY KEY,
  "projectId" INTEGER NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("projectId") REFERENCES "Project" (id)
);

-- Tạo bảng Warehouse
CREATE TABLE IF NOT EXISTS "Warehouse" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Supplier
CREATE TABLE IF NOT EXISTS "Supplier" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  "contactPerson" VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  "taxCode" VARCHAR(100),
  "bankAccount" VARCHAR(100),
  "bankName" VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng InventoryItem
CREATE TABLE IF NOT EXISTS "InventoryItem" (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  "warehouseId" INTEGER NOT NULL,
  "currentQuantity" FLOAT NOT NULL,
  "minimumQuantity" FLOAT NOT NULL,
  "unitPrice" FLOAT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("warehouseId") REFERENCES "Warehouse" (id)
);

-- Tạo bảng InventoryTransaction
CREATE TABLE IF NOT EXISTS "InventoryTransaction" (
  id SERIAL PRIMARY KEY,
  "itemId" INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  quantity FLOAT NOT NULL,
  "unitPrice" FLOAT NOT NULL,
  "totalPrice" FLOAT NOT NULL,
  date TIMESTAMP NOT NULL,
  "projectId" INTEGER,
  "supplierId" INTEGER,
  reference VARCHAR(255),
  notes TEXT,
  "createdById" INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("itemId") REFERENCES "InventoryItem" (id),
  FOREIGN KEY ("projectId") REFERENCES "Project" (id),
  FOREIGN KEY ("supplierId") REFERENCES "Supplier" (id)
);

-- Tạo bảng Equipment
CREATE TABLE IF NOT EXISTS "Equipment" (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  "serialNumber" VARCHAR(100),
  manufacturer VARCHAR(255),
  "purchaseDate" TIMESTAMP NOT NULL,
  "purchasePrice" FLOAT NOT NULL,
  "currentLocation" VARCHAR(255),
  "assignedToId" INTEGER,
  status VARCHAR(50) NOT NULL,
  "lastMaintenanceDate" TIMESTAMP,
  "nextMaintenanceDate" TIMESTAMP,
  "maintenanceCycle" INTEGER,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
