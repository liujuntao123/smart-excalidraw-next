# 使用官方 Node.js 运行时作为基础镜像（Debian slim，规避 alpine 拉取问题）
FROM node:20-slim AS base

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制包管理文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 生产阶段（使用 Debian slim）
FROM node:20-slim AS production

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 安装运行时工具（用于健康检查）
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装生产依赖
RUN pnpm install --frozen-lockfile --production

# 复制构建产物
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.mjs ./

# 使用镜像内置的 node 非 root 用户
RUN chown -R node:node /app
USER node

# 暴露端口
EXPOSE 30055

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=30055

# 启动应用
CMD ["pnpm", "start"]
