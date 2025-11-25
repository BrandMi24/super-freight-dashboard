# dashboard/Dockerfile

# 1) Instalar dependencias
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2) Build de Next
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) Imagen final para producción
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copiamos solo lo necesario
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package*.json ./

# Instalar solo deps necesarias para arrancar Next
RUN npm install next react react-dom

EXPOSE 3000

# Iniciar Next
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
