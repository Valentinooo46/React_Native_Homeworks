#!/bin/bash
BASE_URL="https://p32-native.itstep.click"
PATHS=(
  "/api/auth"
  "/api/auth/login"
  "/api/auth/register"
  "/api/account"
  "/api/account/login"
  "/api/account/register"
  "/api/users"
  "/api/profile"
  "/api/books"
  "/api/products"
  "/api/orders"
  "/api/cart"
  "/api/categories"
  "/api/admin"
  "/api/settings"
  "/api/health"
  "/api/status"
  "/swagger"
  "/swagger/index.html"
  "/swagger/v1/swagger.json"
  "/v3/api-docs"
)


for path in "${PATHS[@]}"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path")
  echo "$path -> $code"
done
