
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install || true
COPY . .
RUN npm run prisma:generate
RUN npm run build
EXPOSE 8080
CMD ["node","dist/index.js"]
