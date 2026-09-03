# Grasp - Reading Comprehension App

A modern reading-comprehension trainer built with Next.js, featuring timed recall, AI-assisted feedback, and progress tracking.

**Live demo:** [grasp-one.vercel.app](https://grasp-one.vercel.app)

Try the complete training loop without an account at `/demo`: read a passage, hide it, summarize it from memory, and review targeted feedback.

## 🧱 Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript, Tailwind CSS
- **Authentication**: Clerk.dev
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: OpenAI, Anthropic, Local models (Ollama, etc.)
- **UI Components**: Custom components with Radix UI primitives

## 🚀 Features

- **User Authentication**: Secure sign-up/sign-in with Clerk
- **Reading Passages**: Diverse content with difficulty levels and tags
- **Book Discovery**: Search Open Library metadata and select a title as training context
- **AI-Powered Scoring**: Get instant feedback on your summaries
- **Multiple AI Providers**: Support for OpenAI, local models, and more
- **Progress Tracking**: Monitor your improvement over time
- **Admin Panel**: Manage passages and content
- **Responsive Design**: Works on desktop and mobile devices

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 20+
- PostgreSQL database
- npm or yarn package manager

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Grasp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/grasp_db"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

   # AI Services (optional)
   OPENAI_API_KEY=sk-...

   # Encryption key for user API keys
   ENCRYPTION_KEY=your_32_character_encryption_key_here

   # Contact used to identify Grasp's low-volume Open Library requests
   OPEN_LIBRARY_CONTACT_EMAIL=you@example.com
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push database schema
   npm run db:push

   # Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run focused unit tests
- `npm run check` - Run lint, tests, and the production build
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database and reseed

## 🔐 Authentication Setup

1. Create a Clerk account at [clerk.dev](https://clerk.dev)
2. Create a new application
3. Copy your publishable key and secret key to `.env.local`
4. Configure redirect URLs in Clerk dashboard:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`

## 🤖 AI Configuration

### OpenAI Setup
1. Get an API key from [OpenAI](https://platform.openai.com)
2. Add it to your `.env.local` file
3. Users can also configure their own API keys in the app

### Local AI Models
1. Install [Ollama](https://ollama.ai) or similar local AI service
2. Start your local model server
3. Configure the endpoint in the AI connections page (e.g., `http://localhost:11434/api/generate`)

## 📚 Open Library Book Discovery

The `/books` page uses the Open Library Search API for human-initiated title, author, ISBN, and topic searches. Requests go through Grasp's server, request only the catalog fields used by the interface, identify the application with `OPEN_LIBRARY_CONTACT_EMAIL`, and cache responses for one hour with stale revalidation.

This integration provides discovery metadata—not copyrighted book text. Selecting a book stores its title, authors, and Open Library work link in the browser as context for the demo workflow. Users must obtain and read the book through a lawful source; Grasp continues to use its own included passages for training.

The integration is intentionally low-volume: it does not scrape Open Library pages, harvest records, or perform bulk imports. Gutendex/Project Gutenberg is not currently integrated; it remains a possible future source for public-domain reading text.

## 📊 Database Schema

The app uses three main entities:

- **Passages**: Reading comprehension texts with metadata
- **UserAIConnections**: User's AI service configurations
- **ComprehensionResponses**: User summaries with AI feedback

## 🎨 UI Components

The app includes a comprehensive UI component library:
- Buttons, Cards, Inputs, Textareas
- Badges for difficulty levels and tags
- Navigation and layout components
- Responsive design with Tailwind CSS

## 🔒 Security

- API keys are encrypted before storage
- User authentication via Clerk
- Protected routes with middleware
- Input validation and sanitization

## 📱 Pages

- `/` - Landing page
- `/sign-in` - Authentication
- `/sign-up` - Registration
- `/dashboard` - Main dashboard with stats and recent activity
- `/books` - Open Library catalog search and training selection
- `/passage/[id]` - Reading and summary submission
- `/connections` - AI service configuration
- `/admin/passages` - Passage management (admin)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🔮 Future Enhancements

- [ ] Real-time collaboration features
- [ ] Advanced analytics and insights
- [ ] Mobile app with React Native
- [ ] Integration with more AI providers
- [ ] Gamification elements
- [ ] Social features and leaderboards
