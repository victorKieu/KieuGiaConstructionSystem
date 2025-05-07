/**
 * Script kiểm tra cấu trúc dự án
 * Chạy: npx ts-node scripts/check-project-structure.ts
 */

import fs from 'fs'
import path from 'path'

// Cấu trúc dự án chuẩn
const expectedStructure = {
  app: {
    api: true,
    dashboard: true,
    login: true,
    'page.tsx': true,
    'layout.tsx': true,
    'error.tsx': true,
    'global-error.tsx': true,
    'loading.tsx': true,
    'not-found.tsx': true,
  },
  components: {
    dashboard: true,
    ui: true,
  },
  lib: {
    actions: true,
    supabase: {
      'client.ts': true,
      'server.ts': true,
    },
    'debug.ts': true,
    'error-handler.ts': true,
  },
  types: {
    'supabase.ts': true,
  },
}

// Kiểm tra cấu trúc
function checkStructure(basePath: string, structure: any, path = '') {
  const issues: string[] = []

  for (const [key, value] of Object.entries(structure)) {
    const fullPath = path ? `${path}/${key}` : key
    const absolutePath = `${basePath}/${fullPath}`

    if (typeof value === 'boolean') {
      if (!fs.existsSync(absolutePath)) {
        issues.push(`Missing: ${fullPath}`)
      }
    } else if (typeof value === 'object') {
      if (!fs.existsSync(absolutePath)) {
        issues.push(`Missing directory: ${fullPath}`)
      } else {
        issues.push(...checkStructure(basePath, value, fullPath))
      }
    }
  }

  return issues
}

// Kiểm tra exports
function checkExports(filePath: string, expectedExports: string[]) {
  const issues: string[] = []
  
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    
    for (const exportName of expectedExports) {
      const regex = new RegExp(`export\\s+(const|function|class|type|interface)\\s+${exportName}\\b`, 'g')
      if (!regex.test(content)) {
        issues.push(`Missing export: ${exportName} in ${filePath}`)
      }
    }
  } catch (error) {
    issues.push(`Error reading file: ${filePath}`)
  }
  
  return issues
}

// Chạy kiểm tra
function runChecks() {
  const basePath = process.cwd()
  
  console.log('Checking project structure...')
  const structureIssues = checkStructure(basePath, expectedStructure)
  
  console.log('Checking required exports...')
  const exportIssues = [
    ...checkExports(
      path.join(basePath, 'lib/supabase/client.ts'), 
      ['createClient', 'supabase', 'isSupabaseReady', 'getUser', 'getSession']
    ),
    ...checkExports(
      path.join(basePath, 'lib/actions/inventory-actions.ts'),
      ['getInventoryItems', 'getInventoryItemById', 'createInventoryItem', 
       'updateInventoryItem', 'deleteInventoryItem', 'getMaterials', 'getWarehouses']
    ),
  ]
  
  const allIssues = [...structureIssues, ...exportIssues]
  
  if (allIssues.length === 0) {
    console.log('✅ All checks passed!')
  } else {
    console.log('❌ Found issues:')
    allIssues.forEach(issue => console.log(`  - ${issue}`))
  }
}

runChecks()