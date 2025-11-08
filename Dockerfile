# 基础镜像
FROM node:22-alpine AS base

# 依赖安装
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# 新增国内源，加速构建
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories && apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi
  
# Next.js 构建打包
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js 会收集完全匿名的使用数据用于分析。
# 详情查看：https://nextjs.org/telemetry
# 若要在构建时禁用数据收集，请取消注释以下行：
ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 构建最终运行镜像
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
# 若要在运行时禁用数据收集，请取消注释以下行：
ENV NEXT_TELEMETRY_DISABLED=1


# 创建非 root 用户 （以用户名 app 为例）
RUN addgroup -S app && adduser -S app -G app
USER app 

# 从构建阶段复制 output 及静态文件
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/public ./public
COPY --from=builder --chown=app:app /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000

# server.js 启动
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]