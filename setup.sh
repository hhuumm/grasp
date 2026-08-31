#!/bin/bash

echo "🚀 Setting up Grasp Reading Comprehension App..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found. Please create it from .env.example"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Check if database is accessible
echo "🗄️  Checking database connection..."
if npm run db:push > /dev/null 2>&1; then
    echo "✅ Database connection successful"
    
    # Seed the database
    echo "🌱 Seeding database with sample data..."
    npm run db:seed
    
    echo "✅ Database setup complete!"
else
    echo "❌ Database connection failed. Please check your DATABASE_URL in .env.local"
    echo "💡 Make sure PostgreSQL is running and the database exists"
    exit 1
fi

echo ""
echo "🎉 Setup complete! You can now run the application with:"
echo "   npm run dev"
echo ""
echo "📋 Next steps:"
echo "1. Configure Clerk authentication keys in .env.local"
echo "2. Add OpenAI API key (optional) in .env.local"
echo "3. Visit http://localhost:3000 to see your app"
echo ""
echo "📚 For detailed setup instructions, see README.md"
