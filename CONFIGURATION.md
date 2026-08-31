# Configuration Guide

This guide walks you through configuring the Grasp Reading Comprehension App step by step.

## 🗄️ Database Setup

### Option A: Docker PostgreSQL (Recommended)

1. **Install Docker** if you haven't already
2. **Run PostgreSQL container:**
   ```bash
   docker run --name grasp-postgres \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=grasp_db \
     -p 5432:5432 \
     -d postgres:15
   ```
3. **Update DATABASE_URL in `.env.local`:**
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/grasp_db?schema=public"
   ```

### Option B: Local PostgreSQL

1. **Install PostgreSQL** on your system
2. **Create database:**
   ```bash
   createdb grasp_db
   ```
3. **Update DATABASE_URL in `.env.local`:**
   ```env
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/grasp_db?schema=public"
   ```

### Option C: Cloud Database

1. **Create a PostgreSQL database** on:
   - [Supabase](https://supabase.com) (Free tier available)
   - [Railway](https://railway.app) (Free tier available)
   - [Neon](https://neon.tech) (Free tier available)
   - [PlanetScale](https://planetscale.com) (MySQL alternative)

2. **Copy the connection string** and update `.env.local`

## 🔐 Clerk Authentication Setup

### Step 1: Create Clerk Account

1. Go to [https://clerk.dev](https://clerk.dev)
2. Sign up for a free account
3. Click "Add application"
4. Choose a name for your app (e.g., "Grasp Reading App")
5. Select "Next.js" as the framework

### Step 2: Get API Keys

1. In your Clerk dashboard, go to "API Keys"
2. Copy the **Publishable key** (starts with `pk_test_`)
3. Copy the **Secret key** (starts with `sk_test_`)

### Step 3: Configure Redirect URLs

1. In Clerk dashboard, go to "Paths"
2. Set the following paths:
   - **Sign-in URL**: `/sign-in`
   - **Sign-up URL**: `/sign-up`
   - **After sign-in URL**: `/dashboard`
   - **After sign-up URL**: `/dashboard`

### Step 4: Update Environment Variables

Update your `.env.local` file:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_key_here
```

## 🤖 AI Services Setup (Optional)

### OpenAI Setup

1. **Get API Key:**
   - Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key (starts with `sk-`)

2. **Update `.env.local`:**
   ```env
   OPENAI_API_KEY=sk-your_actual_openai_key_here
   ```

### Local AI Setup (Ollama)

1. **Install Ollama:**
   - Download from [https://ollama.ai](https://ollama.ai)
   - Install and start the service

2. **Pull a model:**
   ```bash
   ollama pull llama2
   ```

3. **Configure in the app:**
   - Users can add local connections in `/connections`
   - Use endpoint: `http://localhost:11434/api/generate`
   - Model name: `llama2` (or your chosen model)

## 🔑 Encryption Key

Generate a secure encryption key for storing user API keys:

```bash
# On macOS/Linux:
openssl rand -hex 16

# On Windows (PowerShell):
[System.Web.Security.Membership]::GeneratePassword(32, 0)

# Or use any 32-character random string
```

Update `.env.local`:
```env
ENCRYPTION_KEY=your_32_character_random_string_here
```

## 📋 Complete `.env.local` Example

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/grasp_db?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Clerk URLs (don't change these)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# OpenAI (optional)
OPENAI_API_KEY=sk-your_openai_key_here

# Encryption key (32 characters)
ENCRYPTION_KEY=abcdef1234567890abcdef1234567890
```

## ✅ Verification Checklist

Before running the app, verify:

- [ ] PostgreSQL database is running and accessible
- [ ] DATABASE_URL is correct in `.env.local`
- [ ] Clerk keys are added to `.env.local`
- [ ] Clerk redirect URLs are configured
- [ ] Encryption key is set (32 characters)
- [ ] OpenAI key is added (optional)

## 🚨 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists
- Check firewall/network settings

### Clerk Authentication Issues
- Verify API keys are correct
- Check redirect URLs in Clerk dashboard
- Ensure environment variables are loaded

### Build/Runtime Errors
- Run `npm install` to ensure all dependencies
- Clear `.next` folder: `rm -rf .next`
- Restart development server

## 🔄 Next Steps

After configuration, proceed to run the application:

1. **Set up database:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Visit [http://localhost:3000](http://localhost:3000)
   - Test sign-up/sign-in functionality
   - Explore the dashboard and features
