# Contributing to Agri-Fields

Thank you for your interest in contributing to Agri-Fields! This document provides guidelines and information for contributors.

## 🛠️ Development Setup

### Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)
- Git
- A Gemini API key from [Google AI Studio](https://ai.google.dev/)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jvm-indian/agri-fields1.git
   cd agri-fields1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your GEMINI_API_KEY
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
agri-fields1/
├── components/          # React components
│   ├── Navigation.tsx   # Navigation component
│   ├── LandingPage.tsx  # Landing page
│   ├── Dashboard.tsx    # User dashboard
│   ├── AITeacher.tsx    # AI teacher feature
│   ├── CropDoctor.tsx   # Crop doctor feature
│   └── ...
├── services/           # Service layer
│   └── authService.ts  # Firebase authentication
├── public/             # Static assets
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── types.ts            # TypeScript type definitions
├── translations.ts     # Multi-language support
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies and scripts

## 🚀 Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally

## 🎨 Code Style

- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Use functional components over class components
- Keep components small and focused
- Use meaningful variable and function names

## 🔄 Development Workflow

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write clean, readable code
   - Add comments for complex logic
   - Follow existing code patterns

3. **Test your changes:**
   - Run the development server and test manually
   - Ensure no console errors
   - Test in different browsers if possible

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

5. **Push to GitHub:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request:**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Describe your changes clearly
   - Wait for review

## 🐛 Bug Reports

When reporting bugs, please include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser and OS information

## 💡 Feature Requests

We welcome feature requests! Please:
- Check if the feature already exists
- Describe the feature clearly
- Explain why it would be useful
- Provide examples or mockups if possible

## 🔐 Security

- Never commit API keys or secrets
- Always use environment variables for sensitive data
- Follow Firebase security best practices
- Report security issues privately to maintainers

## 🧪 Testing

Currently, the project doesn't have automated tests. If you'd like to contribute by adding tests:
- Consider using Jest and React Testing Library
- Focus on critical user flows
- Test component rendering and interactions

## 📦 Dependencies

Main dependencies:
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Firebase** - Authentication and backend
- **Google Gemini AI** - AI features
- **Framer Motion** - Animations
- **Recharts** - Data visualization

## 🌍 Internationalization

The app supports multiple languages. To add a new language:
1. Open `translations.ts`
2. Add translations for your language
3. Update the language selector in components

## 📝 Documentation

- Update README.md if you change functionality
- Update DEPLOYMENT.md if you change build/deployment process
- Add inline comments for complex code
- Update type definitions in types.ts as needed

## ✅ Pull Request Checklist

Before submitting a PR, ensure:
- [ ] Code follows project style
- [ ] Changes are tested locally
- [ ] No console errors or warnings
- [ ] Environment variables are documented
- [ ] README/docs are updated if needed
- [ ] Commit messages are clear and descriptive

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 💬 Questions?

If you have questions:
- Open an issue on GitHub
- Check existing issues and discussions
- Review the documentation

Thank you for contributing to Agri-Fields! 🌾
