"use server"

import { updateEmployee } from "./employee-actions"

export async function updateEmployeeAction(id: string, formData: FormData) {
  return updateEmployee(id, formData)
}
