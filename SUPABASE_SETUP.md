# InterviewReady AI - Supabase Backend Setup

This document describes the Supabase backend setup for InterviewReady AI, including database schema, authentication, and RLS policies.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project called "interviewready"

## Environment Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Supabase credentials from your project dashboard:
   - Go to Settings → API
   - Copy the Project URL and Anon key
   - Update your `.env.local` file

## Database Setup

### Option 1: Manual Setup (Recommended for development)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the migration files in order:
   - First: `supabase/migrations/001_initial_schema.sql`
   - Second: `supabase/migrations/002_rls_policies.sql`

### Option 2: Using Supabase CLI (Optional)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize and link your project:
   ```bash
   supabase init
   supabase link --project-ref your-project-ref
   ```

3. Apply migrations:
   ```bash
   supabase db push
   ```

## Database Schema

### Tables

#### 1. `profiles`
- User profile information
- Linked to Supabase auth users
- Tracks subscription status and interview credits

#### 2. `interview_sessions`
- Stores interview session data
- Tracks progress, scores, and feedback
- Supports behavioral, technical, and system design interviews

#### 3. `preorders`
- Landing page signups and pre-orders
- UTM tracking for marketing analytics
- Conversion tracking to paid users

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Preorders can be inserted by anyone (for landing page)
- Authenticated users can view preorder analytics

## Testing the Setup

1. Start your Expo dev server:
   ```bash
   npm start
   ```

2. Open your app - you should see a Supabase connection test on the home screen
3. The test will show:
   - 🟢 Green: Successfully connected
   - 🟡 Yellow: Connecting...
   - 🔴 Red: Connection error (check your environment variables)

## Usage Examples

### Authentication
```typescript
import { authService } from './lib/database'

// Sign up
const { data, error } = await authService.signUp('user@example.com', 'password', 'Full Name')

// Sign in
const { data, error } = await authService.signIn('user@example.com', 'password')
```

### Profile Management
```typescript
import { profileService } from './lib/database'

// Get user profile
const { data: profile, error } = await profileService.getProfile(userId)

// Update profile
const { data, error } = await profileService.updateProfile(userId, {
  full_name: 'Updated Name',
  subscription_status: 'premium'
})
```

### Interview Sessions
```typescript
import { interviewService } from './lib/database'

// Create new interview
const { data, error } = await interviewService.createInterview({
  user_id: userId,
  interview_type: 'behavioral',
  difficulty_level: 'mid',
  position_title: 'Software Engineer'
})

// Get user's interviews
const { data: interviews, error } = await interviewService.getUserInterviews(userId)
```

### Preorders (for landing page)
```typescript
import { preorderService } from './lib/database'

// Create preorder
const { data, error } = await preorderService.createPreorder({
  email: 'user@example.com',
  full_name: 'John Doe',
  utm_source: 'google',
  interested_features: ['mock-interviews', 'ai-feedback']
})
```

## Security Features

1. **Row Level Security**: All user data is protected
2. **Automatic Profile Creation**: Profiles are created via database trigger on user signup
3. **Type Safety**: Full TypeScript support with generated types
4. **Credit System**: Interview credits tracked per user
5. **Audit Trail**: Created/updated timestamps on all records

## Next Steps

1. Set up authentication UI components
2. Implement interview session workflow
3. Add real-time features (optional)
4. Set up analytics dashboard for preorders
5. Configure email templates in Supabase Auth

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**: Check your environment variables
2. **RLS policy violations**: Ensure user is authenticated before database operations
3. **Migration errors**: Run migrations in the correct order

### Environment Variables Not Loading

Expo uses `EXPO_PUBLIC_` prefix for client-side environment variables. Make sure your variables are:
- Named correctly: `EXPO_PUBLIC_SUPABASE_URL`
- In the right file: `.env.local` (not `.env`)
- Restart your dev server after adding new variables