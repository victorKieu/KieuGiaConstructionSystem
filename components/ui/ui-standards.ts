/**
 * Các tiêu chuẩn UI và hằng số
 */

// Màu sắc chính của ứng dụng
export const COLORS = {
  primary: "blue",
  secondary: "gray",
  accent: "indigo",
  success: "green",
  warning: "yellow",
  error: "red",
  info: "sky",
}

// Kích thước tiêu chuẩn
export const SIZES = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
}

// Các biến thể của button
export const BUTTON_VARIANTS = {
  primary: "default",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
  link: "link",
  destructive: "destructive",
}

// Các biến thể của card
export const CARD_VARIANTS = {
  default: "",
  bordered: "border",
  elevated: "shadow-md",
}

// Các lớp CSS cho trạng thái
export const STATUS_CLASSES = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
}

// Các lớp CSS cho độ ưu tiên
export const PRIORITY_CLASSES = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
}

// Các kích thước trang
export const PAGE_SIZES = [10, 20, 50, 100]

// Các định dạng ngày tháng
export const DATE_FORMATS = {
  short: "dd/MM/yyyy",
  long: "dd/MM/yyyy HH:mm",
  time: "HH:mm",
}