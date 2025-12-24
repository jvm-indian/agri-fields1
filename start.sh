#!/bin/bash

# Agri-Fields Quick Start Script

echo "🌾 Agri-Fields Quick Start Setup"
echo "================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo "⚠️  Please edit .env.local and add your GEMINI_API_KEY"
    else
        echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local
        echo "⚠️  .env.local created. Please add your GEMINI_API_KEY"
    fi
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Edit .env.local and add your GEMINI_API_KEY"
    echo "   2. Run 'npm run dev' to start the development server"
    echo "   3. Open http://localhost:3000 in your browser"
    echo ""
    echo "📖 For deployment instructions, see DEPLOYMENT.md"
    echo ""
    
    # Ask if user wants to start the dev server
    read -p "Would you like to start the development server now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Starting development server..."
        npm run dev
    fi
else
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi
