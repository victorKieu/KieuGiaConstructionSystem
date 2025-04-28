Write-Host "Đang cài đặt các dependencies cần thiết cho UI components..." -ForegroundColor Green

# Cài đặt các dependencies chính
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate

# Cài đặt các dependencies bổ sung cho shadcn/ui
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-tabs
npm install @radix-ui/react-select @radix-ui/react-dropdown-menu @radix-ui/react-avatar
npm install @radix-ui/react-label @radix-ui/react-scroll-area @radix-ui/react-checkbox

Write-Host "Đã cài đặt xong các dependencies!" -ForegroundColor Green
