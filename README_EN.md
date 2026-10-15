# Smart Excalidraw

> **Draw Professional Charts with Natural Language**

## 🌐 Online Website
Visit our online website to use directly: https://smart-excalidraw.aizhi.site/

## 📸 Preview
Operation Interface
<img width="2330" height="1255" alt="Smart Excalidraw Preview" src="https://github.com/user-attachments/assets/5319ad5c-c507-42e0-b67a-e9dfb2d7ecfa" />
Technical Architecture Diagram
<img width="1920" height="1134" alt="Untitled-2025-11-03-1105" src="https://github.com/user-attachments/assets/d2e01c4e-d300-4c20-bd98-d056e4f02102" />
Infographic
<img width="2183" height="828" alt="Untitled-2025-11-03-1054" src="https://github.com/user-attachments/assets/0e46e8da-fe64-40a9-911b-f6c0e5589bae" />

## ✨ Core Features

### 🎯 AI-Powered, Outstanding Results
Powered by advanced large language models to understand your requirements and generate professional-grade charts with clear structure and logical layout.

### 🔗 Innovative Connection Algorithm
Featuring a proprietary intelligent arrow optimization algorithm that automatically calculates optimal connection points, ensuring charts are well-organized and logically clear, eliminating messy line crossings.

### 📊 Rich Chart Types
Supports 20+ chart types, including flowcharts, architecture diagrams, sequence diagrams, ER diagrams, mind maps, and more. AI can also automatically select the most suitable chart type based on your description.

### 🎨 Perfect Excalidraw Integration
Generated charts are fully based on Excalidraw format, allowing free editing, style adjustments, and detail additions on the canvas—achieving the perfect combination of AI generation and manual refinement.

### ⚡ Ready to Use
Simply configure an AI API key to get started, no complex environment setup required. All configurations are stored locally in your browser for privacy and security.

### 🌍 Multi-Language Support
Now supports both Chinese and English interfaces, making it accessible to a global audience.

## 🚀 Quick Start

### One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fliujuntao123%2Fsmart-excalidraw-next&project-name=smart-excalidraw-next&repository-name=smart-excalidraw-next&env=ACCESS_PASSWORD,SERVER_LLM_TYPE,SERVER_LLM_BASE_URL,SERVER_LLM_API_KEY,SERVER_LLM_MODEL&envDescription=Optional%20server-side%20LLM%20settings%20%28leave%20blank%20to%20use%20client%20keys%29)

Follow the setup flow after clicking the button. If you don't need server-side LLM, leave the env vars empty and configure your API key in the UI after deployment.

### Option 1: Use Access Password

If the server administrator has configured an access password, you can directly use the server-side LLM configuration without providing your own API Key:

1. Click the **"Access Password"** button in the top right corner
2. Enter the access password provided by the administrator
3. Click **"Validate Password"** to test the connection
4. Check **"Enable Access Password"** and save

Once enabled, the application will prioritize the server-side configuration, and you can start creating without configuring your own API Key!

### Option 2: Configure Your Own AI

1. Click the **"Configure LLM"** button in the top right corner
2. Select provider type (OpenAI or Anthropic)
3. Enter your API Key
4. Select model (**Highly recommend claude-sonnet-4.5** for best results)
5. Save configuration

That's it! You're ready to start creating.

### Step 2: Create Charts

Describe your needs in natural language in the input box, for example:
- "Draw a user login flowchart"
- "Create a microservices architecture diagram including gateway, authentication service, and business services"
- "Design a database ER diagram for an e-commerce system"

AI will automatically generate the chart, which you can directly edit and adjust on the canvas.

## 💻 Local Deployment

If you want to run the project locally:

```bash
# Clone the project
git clone https://github.com/liujuntao123/smart-excalidraw-next.git
cd smart-excalidraw-next

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit http://localhost:3000 to start using.

### Configure Server-Side LLM (Optional)

If you want to provide a unified LLM configuration for users and avoid requiring them to obtain their own API Keys, you can configure the server-side access password feature:

1. Copy the environment variables example file:
```bash
cp .env.example .env
```

2. Configure the following variables in `.env`:
```bash
# Access password (users need to enter this password to use server-side LLM)
ACCESS_PASSWORD=your-secure-password

# LLM provider type (openai or anthropic)
SERVER_LLM_TYPE=anthropic

# API base URL
SERVER_LLM_BASE_URL=https://api.anthropic.com/v1

# API key
SERVER_LLM_API_KEY=sk-ant-your-key-here

# Model name
SERVER_LLM_MODEL=claude-sonnet-4-5-20250929
```

3. Restart the development server, and users can use the server-configured LLM through the access password.

**Benefits:**
- Users don't need to apply for and configure their own API Keys
- Centralized management of API usage and costs
- Suitable for team or organizational internal use
- Provide free trial experience to users

## 🔧 Configuration

### Supported LLM Providers
- **OpenAI**: GPT-4, GPT-3.5 and other compatible models
- **Anthropic**: Claude-3.5-Sonnet, Claude-3-Opus and other compatible models

### API Configuration
1. Get API keys from your chosen provider
2. Configure base URL (use default or custom endpoint)
3. Select appropriate model
4. All configurations are stored locally and securely

## ❓ Frequently Asked Questions

**Q: Which AI model is recommended?**
A: **claude-sonnet-4.5** is highly recommended for best performance in understanding requirements and generating charts.

**Q: Is data secure?**
A: All configuration information is stored only in your local browser and never uploaded to any servers.

**Q: What chart types are supported?**
A: Supports 20+ types including flowcharts, architecture diagrams, sequence diagrams, ER diagrams, mind maps, network topology diagrams, etc. AI will automatically select the most suitable type.

**Q: Can generated charts be modified?**
A: Absolutely! After generation, you can freely edit on the Excalidraw canvas, including adjusting positions, modifying styles, adding elements, and more.

**Q: What is the access password feature?**
A: The access password feature allows server administrators to configure a unified LLM. Users only need to enter the password to use it, without needing to apply for their own API Key. When access password is enabled, the server-side configuration takes priority over local configuration.

**Q: What is the priority between access password and local configuration?**
A: If access password is enabled, the system will prioritize the server-side LLM configuration. Local configured API Keys will only be used when access password is not enabled.

**Q: Does it support multiple languages?**
A: Yes! The interface now supports both Chinese and English, with automatic language detection based on browser settings.

## 🛠️ Tech Stack

Next.js 16 · React 19 · Excalidraw · Tailwind CSS 4 · Monaco Editor · next-intl

## 🌐 Internationalization

This project supports multiple languages:
- 🇨🇳 Chinese (Simplified) - Default
- 🇺🇸 English

Language is automatically detected based on your browser settings, or you can access different language versions:
- Chinese: `http://localhost:3000/zh`
- English: `http://localhost:3000/en`

## 📄 License

MIT License

---

**Draw Professional Charts with Natural Language** - Making visual creation simple again
