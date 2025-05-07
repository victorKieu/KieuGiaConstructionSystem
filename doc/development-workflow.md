# Quy trình phát triển

## Quy trình phát triển tính năng mới

1. **Phân tích yêu cầu**
   - Xác định rõ yêu cầu và phạm vi của tính năng
   - Xác định các thành phần cần thay đổi

2. **Thiết kế**
   - Thiết kế UI/UX (nếu cần)
   - Thiết kế cấu trúc dữ liệu và API

3. **Phát triển**
   - Tuân thủ cấu trúc dự án hiện tại
   - Sử dụng các utility functions đã chuẩn hóa
   - Viết unit tests (nếu có)

4. **Kiểm thử**
   - Kiểm thử tính năng mới
   - Kiểm thử hồi quy để đảm bảo không ảnh hưởng đến các tính năng hiện có

5. **Triển khai**
   - Tạo pull request
   - Review code
   - Merge và deploy

## Quy trình sửa lỗi

1. **Xác định lỗi**
   - Mô tả chi tiết lỗi
   - Xác định các bước để tái hiện lỗi

2. **Phân tích nguyên nhân**
   - Sử dụng các công cụ debug
   - Xác định nguồn gốc của lỗi

3. **Sửa lỗi**
   - Thực hiện các thay đổi tối thiểu cần thiết
   - Không thay đổi cấu trúc dự án

4. **Kiểm thử**
   - Kiểm tra lỗi đã được sửa
   - Kiểm tra không gây ra lỗi mới

5. **Triển khai**
   - Tạo pull request
   - Review code
   - Merge và deploy

## Quy tắc chung

- **Không thay đổi cấu trúc dự án** mà không có sự đồng thuận
- **Sử dụng các utility functions** đã chuẩn hóa
- **Ghi log lỗi** một cách nhất quán
- **Viết code có thể tái sử dụng**
- **Tài liệu hóa** các thay đổi quan trọng
\`\`\`

### 6. Công cụ hỗ trợ phát triển
