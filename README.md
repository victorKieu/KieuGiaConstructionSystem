# Kieu Gia Construction - Hệ thống Quản lý Xây dựng

## Yêu cầu hệ thống

- Node.js 18.x trở lên
- npm 9.x trở lên
- PostgreSQL 14.x trở lên

## Cài đặt

1. Clone repository:
\`\`\`bash
git clone https://github.com/your-username/kieu-gia-construction.git
cd kieu-gia-construction
\`\`\`

2. Cài đặt các gói phụ thuộc:
\`\`\`bash
npm install
\`\`\`

3. Tạo file .env trong thư mục gốc và cấu hình các biến môi trường:
\`\`\`
DATABASE_URL="postgresql://username:password@localhost:5432/kieu_gia_construction"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
APP_URL="http://localhost:3000"
\`\`\`

4. Tạo cơ sở dữ liệu:
\`\`\`bash
npx prisma migrate dev
\`\`\`

5. Tạo dữ liệu mẫu (tùy chọn):
\`\`\`bash
npm run seed
\`\`\`

## Khởi động ứng dụng

### Môi trường phát triển

\`\`\`bash
# Sử dụng script
chmod +x start-dev.sh
./start-dev.sh

# Hoặc chạy trực tiếp
npm run dev
\`\`\`

### Môi trường sản xuất

\`\`\`bash
# Sử dụng script
chmod +x start-prod.sh
./start-prod.sh

# Hoặc chạy từng bước
npm run build
npx prisma migrate deploy
npm run start
\`\`\`

## Tài khoản mặc định

- Email: admin@kieugia.com
- Mật khẩu: admin123

## Cấu trúc dự án

\`\`\`
kieu-gia-construction/
├── app/                  # Thư mục chứa các route và layout
├── components/           # Các component React
├── contexts/             # Context API
├── lib/                  # Thư viện và tiện ích
├── prisma/               # Schema và migration Prisma
├── public/               # Tài nguyên tĩnh
└── ...
