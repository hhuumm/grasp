@echo off
echo 🚀 Setting up Grasp Reading Comprehension App...

REM Check if .env.local exists
if not exist .env.local (
    echo ❌ .env.local file not found. Please create it from .env.example
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Generate Prisma client
echo 🔧 Generating Prisma client...
call npm run db:generate

REM Check if database is accessible
echo 🗄️  Checking database connection...
call npm run db:push >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Database connection successful
    
    REM Seed the database
    echo 🌱 Seeding database with sample data...
    call npm run db:seed
    
    echo ✅ Database setup complete!
) else (
    echo ❌ Database connection failed. Please check your DATABASE_URL in .env.local
    echo 💡 Make sure PostgreSQL is running and the database exists
    pause
    exit /b 1
)

echo.
echo 🎉 Setup complete! You can now run the application with:
echo    npm run dev
echo.
echo 📋 Next steps:
echo 1. Configure Clerk authentication keys in .env.local
echo 2. Add OpenAI API key (optional) in .env.local
echo 3. Visit http://localhost:3000 to see your app
echo.
echo 📚 For detailed setup instructions, see README.md
pause
