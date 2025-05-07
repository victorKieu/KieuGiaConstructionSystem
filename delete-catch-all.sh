#!/bin/bash

# Tìm tất cả các thư mục catch-all trong thư mục app/api
echo "Tìm tất cả các thư mục catch-all..."
CATCH_ALL_DIRS=$(find app/api -type d -name "\[\[\*\]\]" -o -name "\[\*\]")

echo "Các thư mục catch-all đã tìm thấy:"
echo "$CATCH_ALL_DIRS"

# Xóa thư mục [[...path]] nếu tồn tại
if [ -d "app/api/[[...path]]" ]; then
  echo "Đang xóa thư mục app/api/[[...path]]..."
  rm -rf "app/api/[[...path]]"
  echo "Đã xóa thành công!"
else
  echo "Thư mục app/api/[[...path]] không tồn tại."
fi

# Kiểm tra xem có còn thư mục catch-all tùy chọn nào khác không
OPTIONAL_CATCH_ALL_DIRS=$(find app/api -type d -name "\[\[\*\]\]")
if [ -n "$OPTIONAL_CATCH_ALL_DIRS" ]; then
  echo "Các thư mục catch-all tùy chọn khác:"
  echo "$OPTIONAL_CATCH_ALL_DIRS"
  
  # Xóa tất cả các thư mục catch-all tùy chọn
  for dir in $OPTIONAL_CATCH_ALL_DIRS; do
    echo "Đang xóa thư mục $dir..."
    rm -rf "$dir"
    echo "Đã xóa thành công!"
  done
fi

echo "Hoàn tất!"
