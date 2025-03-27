# ----------- Stage 1: Cài dependencies -----------
    FROM node:20-alpine AS deps
    WORKDIR /app
    COPY package.json yarn.lock ./
    RUN yarn install --frozen-lockfile
    
    # ----------- Stage 2: Dành cho Development -----------
    FROM node:20-alpine AS dev
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . . 
    
    # Chạy TypeScript trực tiếp với ts-node (Chạy đúng file trong src)
    CMD ["yarn", "ts-node", "src/server.ts"]
    
    # ----------- Stage 3: Dành cho Production -----------
    FROM node:20-alpine AS prod
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . . 
    
    # Build TypeScript -> JavaScript
    RUN yarn build
    
    # Kiểm tra output có tồn tại không
    RUN ls -l /app/dist/
    
    # Chạy file đã build
    CMD ["node", "/app/dist/server.js"]
    