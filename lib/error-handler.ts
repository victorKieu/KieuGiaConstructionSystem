// Các loại lỗi
export enum ErrorType {
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  VALIDATION = "VALIDATION",
  DATABASE = "DATABASE",
  SERVER = "SERVER",
  NOT_FOUND = "NOT_FOUND",
  EXTERNAL_SERVICE = "EXTERNAL_SERVICE",
}

// Interface cho lỗi
export interface AppError {
  type: ErrorType
  message: string
  code?: string
  details?: any
}

// Hàm tạo lỗi
export function createError(type: ErrorType, message: string, code?: string, details?: any): AppError {
  return {
    type,
    message,
    code,
    details: process.env.NODE_ENV === "development" ? details : undefined,
  }
}

// Hàm xử lý lỗi từ Supabase
export function handleSupabaseError(error: any): AppError {
  console.error("Supabase error:", error)

  // Xác định loại lỗi dựa trên mã lỗi Supabase
  if (error?.code === "PGRST301") {
    return createError(ErrorType.AUTHENTICATION, "Không có quyền truy cập", error?.code)
  }

  if (error?.code === "42P01") {
    return createError(ErrorType.DATABASE, "Lỗi cơ sở dữ liệu", error?.code)
  }

  if (error?.code === "23505") {
    return createError(ErrorType.VALIDATION, "Dữ liệu đã tồn tại", error?.code)
  }

  // Mặc định là lỗi server
  return createError(
    ErrorType.SERVER,
    "Đã xảy ra lỗi khi xử lý yêu cầu của bạn",
    error?.code,
    process.env.NODE_ENV === "development" ? error : undefined,
  )
}

// Hàm xử lý lỗi chung
export function handleError(error: any): AppError {
  console.error("Application error:", error)

  // Nếu đã là AppError, trả về luôn
  if (error.type && Object.values(ErrorType).includes(error.type)) {
    return error as AppError
  }

  // Mặc định là lỗi server
  return createError(
    ErrorType.SERVER,
    "Đã xảy ra lỗi không mong muốn",
    undefined,
    process.env.NODE_ENV === "development" ? error : undefined,
  )
}

// Hàm tạo thông báo lỗi an toàn cho client
export function createSafeErrorMessage(error: AppError): string {
  // Các thông báo lỗi thân thiện với người dùng
  const userFriendlyMessages = {
    [ErrorType.AUTHENTICATION]: "Vui lòng đăng nhập để tiếp tục",
    [ErrorType.AUTHORIZATION]: "Bạn không có quyền thực hiện hành động này",
    [ErrorType.VALIDATION]: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại",
    [ErrorType.DATABASE]: "Lỗi khi truy cập dữ liệu",
    [ErrorType.SERVER]: "Đã xảy ra lỗi, vui lòng thử lại sau",
    [ErrorType.NOT_FOUND]: "Không tìm thấy thông tin yêu cầu",
    [ErrorType.EXTERNAL_SERVICE]: "Không thể kết nối đến dịch vụ bên ngoài",
  }

  return userFriendlyMessages[error.type] || "Đã xảy ra lỗi không mong muốn"
}
