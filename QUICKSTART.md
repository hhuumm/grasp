# 🚀 Quick Start Guide

Get the Grasp Reading Comprehension App running in 5 minutes!

## Prerequisites

- ✅ Node.js 18+ (you have v20.10.0)
- ✅ npm (you have v10.8.1)
- 🔲 PostgreSQL database (see options below)

## 🏃‍♂️ Quick Setup Options

### Option 1: Docker Database (Easiest)

```bash
# 1. Start PostgreSQL with Docker
docker run --name grasp-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=grasp_db -p 5432:5432 -d postgres:15

# 2. Update .env.local (DATABASE_URL line)
DATABASE_URL="postgresql://postgres:password@localhost:5432/grasp_db?schema=public"

# 3. Setup database
npm run db:push
npm run db:seed

# 4. Start the app
npm run dev
```

### Option 2: Cloud Database (Supabase - Free)

```bash
# 1. Go to https://supabase.com and create a free project
# 2. Get your database URL from Settings > Database
# 3. Update .env.local with your Supabase URL
# 4. Setup database
npm run db:push
npm run db:seed

# 5. Start the app
npm run dev
```

### Option 3: Skip Database (Frontend Only)

```bash
# 1. Comment out database-dependent features temporarily
# 2. Start the app
npm run dev

# You'll see the landing page and UI, but no data persistence
```

## 🔐 Authentication Setup (Optional for Testing)

For full functionality, set up Clerk:

1. **Create free account**: [https://clerk.dev](https://clerk.dev)
2. **Create application** and get API keys
3. **Update `.env.local`**:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
   CLERK_SECRET_KEY=sk_test_your_key
   ```

## 🎯 What You'll See

### Without Authentication
- ✅ Beautiful landing page
- ✅ UI components working
- ✅ Responsive design
- ❌ Can't access dashboard/features

### With Authentication
- ✅ Full sign-up/sign-in flow
- ✅ Protected dashboard
- ✅ User-specific features
- ✅ Complete app functionality

### With Database
- ✅ Reading passages loaded
- ✅ Data persistence
- ✅ Progress tracking
- ✅ AI integration ready

## 🚀 Start the App

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## 🔧 Available Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed with sample data
npm run db:studio    # Open database GUI
npm run db:reset     # Reset and reseed database

# Code Quality
npm run lint         # Run ESLint
```

## 🎨 Features to Test

1. **Landing Page** - Modern design with hero section
2. **Authentication** - Sign up/sign in (if Clerk configured)
3. **Dashboard** - Stats and recent activity
4. **Reading Interface** - Passage reading with timer
5. **AI Connections** - Configure AI services
6. **Admin Panel** - Manage passages
7. **Responsive Design** - Test on mobile/tablet

## 🐛 Common Issues & Solutions

### Port Already in Use
```bash
# App will automatically use next available port (3001, 3002, etc.)
# Or kill the process using port 3000
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
# Verify DATABASE_URL in .env.local
# Try: npm run db:push
```

### Clerk Authentication Error
```bash
# Verify API keys in .env.local
# Check Clerk dashboard settings
# Ensure redirect URLs are configured
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

## 📱 Mobile Testing

The app is fully responsive. Test on:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🎯 Next Steps

1. **Configure Clerk** for authentication
2. **Set up database** for data persistence
3. **Add OpenAI key** for AI features
4. **Customize passages** in admin panel
5. **Deploy to production** (Vercel recommended)

## 📚 Need Help?

- 📖 **Full docs**: See `README.md`
- ⚙️ **Configuration**: See `CONFIGURATION.md`
- 🛠️ **Development**: See `DEVELOPMENT.md`
- 🐛 **Issues**: Check the console for error messages

---

**🎉 You're ready to go! The app should be running at http://localhost:3000**
