#!/bin/bash

# ===============================
# Smart Excalidraw Docker 部署脚本
# ===============================

set -e

echo "🚀 Smart Excalidraw Docker 部署脚本"
echo "======================================="

# 检查 Docker 和 Docker Compose
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ 错误: Docker Compose 未安装"
    echo "请先安装 Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# 设置默认变量
PROJECT_NAME="smart-excalidraw"
ENV_FILE=".env"
USE_NGINX="false"

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --nginx)
            USE_NGINX="true"
            shift
            ;;
        --env)
            ENV_FILE="$2"
            shift 2
            ;;
        --project)
            PROJECT_NAME="$2"
            shift 2
            ;;
        -h|--help)
            echo "用法: $0 [选项]"
            echo "选项:"
            echo "  --nginx      使用 nginx 反向代理"
            echo "  --env FILE   指定环境变量文件 (默认: .env)"
            echo "  --project    指定项目名称"
            echo "  -h, --help   显示此帮助信息"
            exit 0
            ;;
        *)
            echo "未知选项: $1"
            echo "使用 -h 或 --help 查看帮助"
            exit 1
            ;;
    esac
done

echo "📋 部署配置:"
echo "  项目名称: $PROJECT_NAME"
echo "  环境变量: $ENV_FILE"
echo "  使用 nginx: $USE_NGINX"
echo ""

# 检查环境变量文件
if [[ ! -f "$ENV_FILE" ]]; then
    echo "⚠️  警告: 环境变量文件 $ENV_FILE 不存在"
    echo "创建默认的 .env 文件..."
    cp .env.example .env
    echo "请编辑 .env 文件并配置必要的环境变量"
    echo ""
    read -p "是否继续部署? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "部署已取消"
        exit 0
    fi
fi

# 拉取最新代码（如果是 Git 仓库）
if [[ -d "../.git" ]]; then
    echo "📥 拉取最新代码..."
    cd ..
    git pull
    cd smart-excalidraw-docker
fi

# 创建环境变量文件
if [[ -f "../.env.example" ]]; then
    echo "📄 复制环境变量文件..."
    cp ../.env.example ../.env
fi

# 停止并删除现有容器
echo "🛑 停止现有容器..."
docker-compose down

# 构建并启动服务
echo "🔨 构建 Docker 镜像..."
docker-compose build --no-cache

echo "🚀 启动服务..."
if [[ "$USE_NGINX" == "true" ]]; then
    docker-compose --profile nginx up -d
    echo "✅ 服务已启动 (端口: 80/443)"
else
    docker-compose up -d
    echo "✅ 服务已启动 (端口: 30055)"
fi

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ 服务运行正常!"
    
    if [[ "$USE_NGINX" == "true" ]]; then
        echo "🌐 访问地址: http://localhost"
    else
        echo "🌐 访问地址: http://localhost:30055"
    fi
    
    echo "📊 查看日志: docker-compose logs -f"
    echo "🛑 停止服务: docker-compose down"
else
    echo "❌ 服务启动失败，请检查日志:"
    echo "   docker-compose logs"
    exit 1
fi

echo ""
echo "🎉 部署完成!"
echo "📖 更多配置请查看 README.md"
