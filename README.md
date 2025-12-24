<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Agri-Fields - AI-Powered Agricultural Management

An AI-powered application for agricultural field management featuring AI Teacher and Crop Doctor capabilities powered by Google's Gemini AI.

View your app in AI Studio: https://ai.studio/apps/temp/1

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jvm-indian/agri-fields1)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jvm-indian/agri-fields1)

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions** including Docker, Firebase, GitHub Pages, and cloud platforms.

## 🏃 Run Locally

**Prerequisites:** Node.js 18 or higher

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key:
   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 🌐 Deployment Options

This application can be deployed to multiple platforms:

- **Vercel** (Recommended) - Zero configuration deployment
- **Netlify** - Automatic deployments from Git
- **Docker** - Containerized deployment for any platform
- **Firebase Hosting** - Integrated with Firebase backend
- **GitHub Pages** - Simple static hosting
- **Cloud Platforms** - AWS, Google Cloud, Azure, DigitalOcean

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions for each platform.

## 🔐 Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key (required)

## 📚 Features

- 🌾 Agricultural field management dashboard
- 🤖 AI Teacher for farming knowledge
- 🏥 Crop Doctor for disease diagnosis
- 👤 User authentication with Firebase
- 🌓 Dark mode support
- 🌍 Multi-language support
- 📊 Data visualization with charts

## 🛠️ Tech Stack

- React 19
- TypeScript
- Vite
- Firebase
- Google Gemini AI
- Framer Motion
- Recharts

## 📄 License

This project is for educational and demonstration purposes.
