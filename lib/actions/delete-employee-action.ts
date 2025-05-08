"use server"

import { deleteEmployee } from "./employee-actions"

export async function deleteEmployeeAction(id: string) {
  return deleteEmployee(id)
}
