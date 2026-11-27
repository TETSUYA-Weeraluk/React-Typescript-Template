# syntax=docker/dockerfile:1

# ---------- Stage 1: build ----------
FROM node:24.15.0-alpine AS builder

WORKDIR /app

# CI=true ป้องกัน pnpm ค้างที่ interactive prompt
ENV CI=true
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

# เวอร์ชันต้องตรงกับ packageManager ใน package.json
RUN npm install -g pnpm@11.10.0

# copy เฉพาะไฟล์ที่ใช้ install ก่อน — layer นี้ cache ได้ตราบใดที่ dependency ไม่เปลี่ยน
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

# ค่า VITE_* ถูกฝังตอน build — ต่าง environment ต้อง build image แยก
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm build

# ---------- Stage 2: serve ----------
FROM nginx:1.29-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
