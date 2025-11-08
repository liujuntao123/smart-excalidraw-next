# Smart Excalidraw

> **用自然语言，绘制专业图表**

## 在线网站
进入在线网站直接使用：https://smart-excalidraw.aizhi.site/

🚀🚀🚀 限时福利

添加底部作者微信进群可领取免费claude-4.5-sonnet key

## English Version
Read the English version: [README_EN.md](README_EN.md)

## 效果预览
操作界面
<img width="2330" height="1255" alt="PixPin_2025-10-31_17-14-27" src="https://github.com/user-attachments/assets/5319ad5c-c507-42e0-b67a-e9dfb2d7ecfa" />
技术架构图
<img width="1920" height="1134" alt="Untitled-2025-11-03-1105" src="https://github.com/user-attachments/assets/d2e01c4e-d300-4c20-bd98-d056e4f02102" />
信息图
<img width="2183" height="828" alt="Untitled-2025-11-03-1054" src="https://github.com/user-attachments/assets/0e46e8da-fe64-40a9-911b-f6c0e5589bae" />



## ✨ 核心特性

### 🎯 AI 驱动，效果出众
通过先进的大语言模型理解你的需求，生成结构清晰、布局合理的专业级图表。

### 🔗 独创连接算法
采用独创的智能箭头优化算法，自动计算最佳连接点，确保图表井然有序、逻辑清晰，告别混乱的线条交叉。

### 📊 丰富图表类型
支持 20+ 种图表类型，包括流程图、架构图、时序图、ER 图、思维导图等。也可以让AI根据你的描述自动选择最合适的图表类型。

### 🎨 完美 Excalidraw 集成
生成的图表完全基于 Excalidraw 格式，可以在画布上自由编辑、调整样式、添加细节，实现 AI 生成与手动精修的完美结合。

### ⚡ 开箱即用
只需配置一个 AI API 密钥即可开始使用，无需复杂的环境搭建。所有配置保存在本地浏览器，隐私安全有保障。



## 🚀 快速开始

### 方式一：使用访问密码

如果服务器管理员已配置访问密码，你可以直接使用服务器端的 LLM 配置，无需自己提供 API Key：

1. 点击右上角的 **"访问密码"** 按钮
2. 输入管理员提供的访问密码
3. 点击 **"验证密码"** 测试连接
4. 勾选 **"启用访问密码"** 并保存

启用后，应用将优先使用服务器端配置，你无需配置自己的 API Key 即可开始创作！

### 方式二：配置自己的 AI

1. 点击右上角的 **"配置 LLM"** 按钮
2. 选择提供商类型（OpenAI 或 Anthropic）
3. 填入你的 API Key
4. 选择模型（**推荐使用 claude-sonnet-4.5**，效果最佳）
5. 保存配置

就这么简单！现在你可以开始创作了。

### 第二步：创建图表

在输入框中用自然语言描述你的需求，例如：
- "画一个用户登录的流程图"
- "创建一个微服务架构图，包含网关、认证服务和业务服务"
- "设计一个电商系统的数据库 ER 图"

AI 会自动生成图表，你可以在画布上直接编辑和调整。

## 💻 本地部署

如果你想在本地运行项目：

```bash
# 克隆项目
git clone <your-repo-url>
cd smart-excalidraw-next

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000 即可使用。

## Docker compose 部署
```bash
# 克隆项目
git clone <your-repo-url>
cd smart-excalidraw-next
#启动项目
docker compose up -d
```
访问 http://localhost:3000 即可使用。

### 配置服务器端 LLM（可选）

如果你想为用户提供统一的 LLM 配置，避免他们自己申请 API Key，可以配置服务器端访问密码功能：

1. 复制环境变量示例文件：
```bash
cp .env.example 
```

2. 在 `.env` 中配置以下变量：
```bash
# 访问密码（用户需要输入此密码才能使用服务器端 LLM）
ACCESS_PASSWORD=your-secure-password

# LLM 提供商类型（openai 或 anthropic）
SERVER_LLM_TYPE=anthropic

# API 基础 URL
SERVER_LLM_BASE_URL=https://api.anthropic.com/v1

# API 密钥
SERVER_LLM_API_KEY=sk-ant-your-key-here

# 模型名称
SERVER_LLM_MODEL=claude-sonnet-4-5-20250929
```

3. 重启开发服务器，用户即可通过访问密码使用服务器端配置的 LLM。

**优势：**
- 用户无需自己申请和配置 API Key
- 统一管理 API 使用和成本
- 适合团队或组织内部使用
- 提供免费体验给用户

## ❓ 常见问题

**Q: 推荐使用哪个 AI 模型？**
A: 强烈推荐使用 **claude-sonnet-4.5**，它在理解需求和生成图表方面表现最佳。

**Q: 数据安全吗？**
A: 所有配置信息仅保存在你的浏览器本地，不会上传到任何服务器。

**Q: 支持哪些图表类型？**
A: 支持流程图、架构图、时序图、ER 图、思维导图、网络拓扑图等 20+ 种类型，AI 会自动选择最合适的类型。

**Q: 生成的图表可以修改吗？**
A: 当然可以！生成后可以在 Excalidraw 画布上自由编辑，包括调整位置、修改样式、添加元素等。

**Q: 什么是访问密码功能？**
A: 访问密码功能允许服务器管理员配置统一的 LLM，用户只需输入密码即可使用，无需自己申请 API Key。启用访问密码后，将优先使用服务器端配置，忽略本地配置。

**Q: 访问密码和本地配置的优先级是什么？**
A: 如果启用了访问密码，系统将优先使用服务器端的 LLM 配置。只有在未启用访问密码时，才会使用本地配置的 API Key。

## 🛠️ 技术栈

Next.js 16 · React 19 · Excalidraw · Tailwind CSS 4 · Monaco Editor

## 📄 许可证

MIT License

## 联系作者
微信号： liujuntaoljt

<img width="200"  alt="微信图片_20251103110224_44_85" src="https://github.com/user-attachments/assets/6d8c4da2-af27-4213-b929-0d47fa51e9b5" />

## 💖 赞助

感谢以下赞助者对本项目的支持：

<!-- 赞助者名单 -->
- API中转站：[AI 网关｜插件世界](https://ai-router.plugins-world.cn)

如果这个项目对你有帮助，欢迎通过以下方式支持：
- ⭐ 给项目点个 Star
- 💬 分享给更多需要的人
- 💰 成为赞助者（联系作者微信）

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=liujuntao123/smart-excalidraw-next&type=date&legend=top-left)](https://www.star-history.com/#liujuntao123/smart-excalidraw-next&type=date&legend=top-left)

**用自然语言，绘制专业图表** - 让可视化创作回归简单
