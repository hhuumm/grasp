# Development Guide

This guide provides detailed information for developers working on the Grasp reading comprehension app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── passage/           # Passage reading pages
│   ├── connections/       # AI connections management
│   ├── admin/            # Admin pages
│   ├── sign-in/          # Authentication pages
│   └── sign-up/
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── layout/           # Layout components
├── lib/                  # Utility functions and services
│   ├── ai/              # AI integration services
│   ├── utils.ts         # General utilities
│   ├── encryption.ts    # Encryption utilities
│   └── prisma.ts        # Prisma client
├── providers/           # React context providers
└── middleware.ts        # Next.js middleware

prisma/
├── schema.prisma        # Database schema
└── seed.ts             # Database seeding script
```

## Database Design

### Core Entities

1. **Passage**
   - Stores reading comprehension texts
   - Includes metadata like source, difficulty, tags
   - Related to multiple ComprehensionResponses

2. **UserAIConnection**
   - Stores user's AI service configurations
   - API keys are encrypted before storage
   - Supports multiple providers per user

3. **ComprehensionResponse**
   - Links users, passages, and AI feedback
   - Stores summary text and AI-generated scores
   - Tracks timestamp for progress analysis

### Relationships
- One-to-many: Passage → ComprehensionResponses
- One-to-many: UserAIConnection → ComprehensionResponses
- User identification via Clerk userId (string)

## AI Integration Architecture

### Service Pattern
The AI integration uses a service pattern with:
- `AIService` interface for consistent API
- Provider-specific implementations (OpenAI, Local, etc.)
- `AIRouter` for routing requests to appropriate services

### Supported Providers
1. **OpenAI**: GPT-4, GPT-3.5-turbo
2. **Local Models**: Ollama, LM Studio, custom endpoints
3. **Anthropic**: Claude models (using OpenAI-compatible format)

### Adding New Providers
1. Implement the `AIService` interface
2. Add to `AIRouter` services map
3. Update UI to support new provider options

## Authentication Flow

1. User visits protected route
2. Middleware checks authentication status
3. Redirects to sign-in if not authenticated
4. Clerk handles authentication process
5. User redirected to dashboard on success

### Protected Routes
- `/dashboard/*`
- `/passage/*`
- `/connections/*`
- `/admin/*`

## API Routes

### `/api/score-summary`
- **POST**: Submit summary for AI scoring
- Validates user authentication
- Fetches AI connection and decrypts API key
- Routes to appropriate AI service
- Saves response to database

### `/api/ai-connections`
- **GET**: Fetch user's AI connections
- **POST**: Create new AI connection
- **DELETE**: Remove AI connection
- Handles API key encryption/decryption

## Component Architecture

### UI Components (`src/components/ui/`)
- Built with Radix UI primitives
- Styled with Tailwind CSS
- Use `class-variance-authority` for variants
- Consistent with shadcn/ui patterns

### Layout Components
- `Navbar`: Main navigation with user menu
- `Layout`: Page wrapper with navigation
- Responsive design with mobile support

## Styling System

### Tailwind Configuration
- Custom color palette in `globals.css`
- Dark mode support
- Responsive breakpoints
- Custom utility classes

### Design Tokens
- Primary: Blue (#2563eb)
- Success: Green for beginner difficulty
- Warning: Yellow for intermediate difficulty
- Error: Red for advanced difficulty

## Development Workflow

### Local Development
1. Start PostgreSQL database
2. Run `npm run dev` for development server
3. Use `npm run db:studio` for database GUI
4. Check `npm run lint` for code quality

### Database Changes
1. Modify `prisma/schema.prisma`
2. Run `npm run db:push` for development
3. Run `npm run db:migrate` for production migrations
4. Update seed script if needed

### Testing Strategy
- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user flows
- Manual testing for AI integrations

## Environment Variables

### Required
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public key
- `CLERK_SECRET_KEY`: Clerk secret key
- `ENCRYPTION_KEY`: 32-character key for API key encryption

### Optional
- `OPENAI_API_KEY`: Default OpenAI key
- `NODE_ENV`: Environment (development/production)

## Security Considerations

### API Key Storage
- User API keys encrypted with AES-256-GCM
- Encryption key stored in environment variables
- Keys never returned in API responses

### Authentication
- All protected routes require valid Clerk session
- API routes validate user authentication
- User data isolated by Clerk userId

### Input Validation
- Validate all user inputs
- Sanitize data before database storage
- Rate limiting on AI API calls

## Performance Optimization

### Database
- Indexed foreign keys for relationships
- Pagination for large result sets
- Connection pooling with Prisma

### Frontend
- Next.js App Router for optimal loading
- Component lazy loading where appropriate
- Image optimization with Next.js Image

### AI Services
- Request timeout handling
- Error retry logic
- Response caching for repeated requests

## Deployment Checklist

1. Set all environment variables
2. Run database migrations
3. Seed database with initial data
4. Configure Clerk redirect URLs
5. Test AI integrations
6. Verify SSL certificates
7. Set up monitoring and logging

## Troubleshooting

### Common Issues
1. **Database connection errors**: Check DATABASE_URL format
2. **Clerk authentication fails**: Verify keys and redirect URLs
3. **AI service timeouts**: Check API keys and endpoints
4. **Build failures**: Ensure all dependencies installed

### Debug Tools
- Prisma Studio for database inspection
- Clerk Dashboard for user management
- Browser DevTools for frontend debugging
- Server logs for API issues

## Contributing Guidelines

1. Follow TypeScript strict mode
2. Use Prettier for code formatting
3. Write meaningful commit messages
4. Add JSDoc comments for complex functions
5. Update documentation for new features
6. Test AI integrations thoroughly
