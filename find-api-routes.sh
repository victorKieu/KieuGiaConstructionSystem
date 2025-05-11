#!/bin/bash
# Script để tìm tất cả các API route

echo "Tìm tất cả các API route..."
find app/api -type f -name "*.ts" -o -name "*.js" | grep -v "env-check" | grep -v "system-check"

echo "Hoàn thành!"
