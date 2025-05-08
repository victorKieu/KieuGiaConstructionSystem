"use server"

import { createEmployee } from "./employee-actions"

export async function createEmployeeAction(formData: FormData) {
  return createEmployee(formData)
}
