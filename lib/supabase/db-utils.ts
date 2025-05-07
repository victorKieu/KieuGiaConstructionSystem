/**
 * Utility functions for database operations
 * Các hàm tiện ích cho thao tác với cơ sở dữ liệu
 */

import { createServerSupabaseClient } from "./server"

/**
 * Thực hiện truy vấn SELECT an toàn
 * @param table Tên bảng
 * @param columns Các cột cần select
 * @param options Các tùy chọn truy vấn
 * @returns Kết quả truy vấn hoặc lỗi
 */
export async function safeSelect(
  table: string,
  columns: string = "*",
  options?: {
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    offset?: number;
  }
) {
  try {
    const supabase = createServerSupabaseClient()
    let query = supabase.from(table).select(columns)

    // Áp dụng các bộ lọc
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    // Áp dụng sắp xếp
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending ?? true 
      })
    }

    // Áp dụng giới hạn và offset
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error(`Error selecting from ${table}:`, error)
      return { error: error.message, data: null }
    }

    return { data, error: null }
  } catch (error: any) {
    console.error(`Exception in safeSelect from ${table}:`, error)
    return { error: error.message, data: null }
  }
}

/**
 * Thực hiện thêm dữ liệu an toàn
 * @param table Tên bảng
 * @param data Dữ liệu cần thêm
 * @returns Kết quả hoặc lỗi
 */
export async function safeInsert(table: string, data: any) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()

    if (error) {
      console.error(`Error inserting into ${table}:`, error)
      return { error: error.message, data: null }
    }

    return { data: result, error: null }
  } catch (error: any) {
    console.error(`Exception in safeInsert into ${table}:`, error)
    return { error: error.message, data: null }
  }
}

/**
 * Thực hiện cập nhật dữ liệu an toàn
 * @param table Tên bảng
 * @param id ID của bản ghi cần cập nhật
 * @param data Dữ liệu cần cập nhật
 * @param idField Tên trường ID (mặc định là "id")
 * @returns Kết quả hoặc lỗi
 */
export async function safeUpdate(table: string, id: string | number, data: any, idField: string = "id") {
  try {
    const supabase = createServerSupabaseClient()
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq(idField, id)
      .select()

    if (error) {
      console.error(`Error updating ${table}:`, error)
      return { error: error.message, data: null }
    }

    return { data: result, error: null }
  } catch (error: any) {
    console.error(`Exception in safeUpdate ${table}:`, error)
    return { error: error.message, data: null }
  }
}

/**
 * Thực hiện xóa dữ liệu an toàn
 * @param table Tên bảng
 * @param id ID của bản ghi cần xóa
 * @param idField Tên trường ID (mặc định là "id")
 * @returns Kết quả hoặc lỗi
 */
export async function safeDelete(table: string, id: string | number, idField: string = "id") {
  try {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from(table)
      .delete()
      .eq(idField, id)

    if (error) {
      console.error(`Error deleting from ${table}:`, error)
      return { error: error.message, success: false }
    }

    return { error: null, success: true }
  } catch (error: any) {
    console.error(`Exception in safeDelete from ${table}:`, error)
    return { error: error.message, success: false }
  }
}