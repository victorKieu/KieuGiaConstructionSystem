# Cấu trúc dự án Kiều Gia Construction

## Cấu trúc thư mục

- `/app`: Chứa các trang và route của ứng dụng (Next.js App Router)
  - `/api`: API routes
  - `/dashboard`: Các trang dashboard
  - `/login`: Trang đăng nhập
- `/components`: Các component React
  - `/ui`: UI components (shadcn/ui)
  - `/dashboard`: Components cho dashboard
- `/lib`: Thư viện và utilities
  - `/actions`: Server actions
  - `/supabase`: Kết nối Supabase
- `/types`: Type definitions

## Quy ước đặt tên

- Tên file: kebab-case (ví dụ: `project-progress.tsx`)
- Component React: PascalCase (ví dụ: `ProjectProgress`)
- Functions: camelCase (ví dụ: `getInventoryItems`)
- Types/Interfaces: PascalCase (ví dụ: `InventoryItem`)

## Luồng dữ liệu

1. Client components gọi server actions từ `/lib/actions`
2. Server actions kết nối với Supabase thông qua `/lib/supabase/server.ts`
3. Client components có thể kết nối trực tiếp với Supabase thông qua `/lib/supabase/client.ts`
\`\`\`

### 2. Chuẩn hóa kết nối cơ sở dữ liệu
