# InterviewReady AI - MVP Implementation Plan

> **For Hermes:** Use expo-react-native-app and subagent-driven-development skills to implement this plan task-by-task.

**Goal:** Build and launch InterviewReady AI MVP mobile app with pre-order capability to validate $3K MRR potential within 90 days.

**Architecture:** React Native + Expo mobile app with Supabase backend, OpenRouter for AI interviews, RevenueCat for payments, and early pre-order landing page.

**Tech Stack:** 
- Frontend: Expo (React Native), TypeScript, NativeWind (Tailwind)
- Backend: Supabase (auth, database, edge functions)
- AI: OpenRouter API (Claude/GPT for interview simulation)
- Payments: RevenueCat (in-app purchases) + Stripe (pre-orders)
- Analytics: PostHog React Native SDK

**Revenue Strategy:** 
- Pre-orders: $29 early bird → $49 regular → $99/year subscription
- Target: 60 pre-orders × $49 = $3K validation milestone

---

## Phase 1: Project Setup & Landing Page (Days 1-7)

### Task 1: Initialize Expo Project Structure

**Objective:** Create the basic React Native app with proper structure

**Files:**
- Create: `~/Projects/interviewready/` (entire project)
- Create: `package.json`, `app.json`, `tsconfig.json`
- Create: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`

**Step 1: Create Expo app**
```bash
cd ~/Projects
npx create-expo-app@latest interviewready --template tabs
cd interviewready
npx expo install expo-router expo-constants expo-linking
```

**Step 2: Add TypeScript and NativeWind**
```bash
npx expo install nativewind tailwindcss
npm install --save-dev @types/react @types/react-native
```

**Step 3: Configure NativeWind**
Create `tailwind.config.js`:
```js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Step 4: Test basic setup**
Run: `npx expo start`
Expected: QR code appears, app loads on phone

**Step 5: Commit initial setup**
```bash
git init
git add .
git commit -m "feat: initial expo app setup with nativewind"
```

### Task 2: Create Pre-Order Landing Page (Web)

**Objective:** Build simple landing page to capture pre-orders before app is ready

**Files:**
- Create: `landing-page/index.html`
- Create: `landing-page/style.css` 
- Create: `landing-page/script.js`

**Step 1: Create landing page directory**
```bash
mkdir -p landing-page
```

**Step 2: Write landing page HTML**
`landing-page/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InterviewReady AI - Ace Your Next Interview</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://js.stripe.com/v3/"></script>
</head>
<body>
    <div class="container">
        <header>
            <h1>🚀 InterviewReady AI</h1>
            <p class="subtitle">AI-Powered Interview Practice That Gets You Hired</p>
        </header>
        
        <section class="hero">
            <div class="features">
                <div class="feature">
                    <h3>🎯 Personalized Practice</h3>
                    <p>AI adapts to your role, experience, and weaknesses</p>
                </div>
                <div class="feature">
                    <h3>🗣️ Real Voice Interaction</h3>
                    <p>Practice speaking out loud, get instant feedback</p>
                </div>
                <div class="feature">
                    <h3>📊 Performance Analytics</h3>
                    <p>Track improvement, identify blind spots</p>
                </div>
            </div>
        </section>
        
        <section class="pricing">
            <div class="price-card early-bird">
                <div class="badge">Early Bird - 50% Off</div>
                <h2>$29 $49</h2>
                <p>One-time payment • Lifetime access</p>
                <button id="preorder-btn" class="cta-button">
                    Pre-Order Now - Save $20
                </button>
                <small>App launches in 30 days. No risk - full refund if unsatisfied.</small>
            </div>
        </section>
        
        <section class="social-proof">
            <p><strong>Join 500+ professionals</strong> already preparing for success</p>
        </section>
    </div>
    
    <script src="script.js"></script>
</body>
</html>
```

**Step 3: Add CSS styling**
`landing-page/style.css`:
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    color: white;
}

header {
    text-align: center;
    margin-bottom: 3rem;
}

h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.subtitle {
    font-size: 1.5rem;
    opacity: 0.9;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
}

.feature {
    background: rgba(255,255,255,0.1);
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
}

.feature h3 {
    margin-bottom: 1rem;
    font-size: 1.3rem;
}

.pricing {
    text-align: center;
    margin: 4rem 0;
}

.price-card {
    background: white;
    color: #333;
    padding: 3rem;
    border-radius: 15px;
    max-width: 400px;
    margin: 0 auto;
    position: relative;
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.badge {
    background: #ff4757;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
}

.price-card h2 {
    font-size: 3rem;
    margin: 1rem 0;
}

.price-card h2::before {
    content: "$49";
    text-decoration: line-through;
    color: #999;
    font-size: 1.5rem;
    margin-right: 1rem;
}

.cta-button {
    background: #667eea;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    margin: 1rem 0;
    width: 100%;
    transition: background 0.3s;
}

.cta-button:hover {
    background: #5a6fd8;
}

.social-proof {
    text-align: center;
    margin-top: 3rem;
    opacity: 0.9;
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }
    
    h1 {
        font-size: 2rem;
    }
    
    .features {
        grid-template-columns: 1fr;
    }
}
```

**Step 4: Add Stripe integration script**
`landing-page/script.js`:
```javascript
// Initialize Stripe (you'll need to add your public key)
const stripe = Stripe('pk_test_your_stripe_public_key_here');

document.getElementById('preorder-btn').addEventListener('click', async () => {
    try {
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product: 'interviewready-preorder',
                amount: 2900, // $29 in cents
            }),
        });
        
        const session = await response.json();
        
        // Redirect to Stripe Checkout
        await stripe.redirectToCheckout({
            sessionId: session.id
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Payment error. Please try again.');
    }
});

// Track page visits
if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
        page_title: 'InterviewReady AI Landing',
        page_location: window.location.href
    });
}
```

**Step 5: Test landing page**
Run: `cd landing-page && python -m http.server 8000`
Expected: Landing page displays correctly at localhost:8000

**Step 6: Commit landing page**
```bash
git add landing-page/
git commit -m "feat: add pre-order landing page with stripe integration"
```

### Task 3: Setup Supabase Backend

**Objective:** Configure database and authentication for the mobile app

**Files:**
- Create: `supabase/schema.sql`
- Create: `lib/supabase.ts`
- Modify: `package.json` (add supabase dependencies)

**Step 1: Install Supabase dependencies**
```bash
npx expo install @supabase/supabase-js
npm install react-native-url-polyfill
```

**Step 2: Create Supabase project**
- Visit supabase.com/dashboard
- Create new project: "interviewready"
- Note: URL and anon key

**Step 3: Create database schema**
`supabase/schema.sql`:
```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    target_role TEXT,
    experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (id)
);

-- Interview sessions
CREATE TABLE public.interview_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('behavioral', 'technical', 'case_study', 'general')) NOT NULL,
    role TEXT NOT NULL,
    duration INTEGER, -- in seconds
    score DECIMAL(3,1), -- 0.0 to 10.0
    feedback TEXT,
    questions_data JSONB, -- Array of questions and responses
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Pre-orders tracking
CREATE TABLE public.preorders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    stripe_session_id TEXT,
    amount INTEGER NOT NULL, -- in cents
    status TEXT CHECK (status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own sessions" ON public.interview_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.interview_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
```

**Step 4: Create Supabase client**
`lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: undefined, // We'll use expo-secure-store
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Database types
export interface Profile {
  id: string
  email: string
  full_name: string
  target_role: string
  experience_level: 'entry' | 'mid' | 'senior' | 'executive'
  created_at: string
  updated_at: string
}

export interface InterviewSession {
  id: string
  user_id: string
  type: 'behavioral' | 'technical' | 'case_study' | 'general'
  role: string
  duration?: number
  score?: number
  feedback?: string
  questions_data?: any[]
  created_at: string
}
```

**Step 5: Run schema in Supabase**
- Open Supabase dashboard → SQL editor
- Paste schema.sql content
- Run query

**Step 6: Test Supabase connection**
Add to `app/(tabs)/index.tsx`:
```typescript
import { supabase } from '../../lib/supabase'

// Test connection
useEffect(() => {
  supabase.from('profiles').select('*').limit(1)
    .then(({ data, error }) => {
      console.log('Supabase test:', { data, error })
    })
}, [])
```

**Step 7: Commit Supabase setup**
```bash
git add lib/ supabase/
git commit -m "feat: setup supabase backend with database schema"
```

## Phase 2: Core App Features (Days 8-21)

### Task 4: Implement Authentication Flow

**Objective:** Enable users to sign up, log in, and manage their profiles

**Files:**
- Create: `app/(auth)/_layout.tsx`
- Create: `app/(auth)/login.tsx`
- Create: `app/(auth)/signup.tsx`
- Create: `components/AuthContext.tsx`
- Create: `hooks/useAuth.ts`

**Step 1: Install secure storage for auth tokens**
```bash
npx expo install expo-secure-store
```

**Step 2: Create auth context**
`components/AuthContext.tsx`:
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import * as SecureStore from 'expo-secure-store'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.access_token) {
          await SecureStore.setItemAsync('supabase_token', session.access_token)
        } else {
          await SecureStore.deleteItemAsync('supabase_token')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error

    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
        })

      if (profileError) throw profileError
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

**Step 3: Create login screen**
`app/(auth)/login.tsx`:
```typescript
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { Link, router } from 'expo-router'
import { useAuth } from '../../components/AuthContext'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await signIn(email, password)
      router.replace('/(tabs)')
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 px-6 py-20 bg-white">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-center mb-2">Welcome Back</Text>
        <Text className="text-gray-600 text-center">Sign in to continue your interview prep</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-gray-700 mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-gray-700 mb-2">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-lg mt-6"
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-gray-600">Don't have an account? </Text>
          <Link href="/(auth)/signup" className="text-blue-600 font-semibold">
            Sign Up
          </Link>
        </View>
      </View>
    </View>
  )
}
```

**Step 4: Create signup screen**
`app/(auth)/signup.tsx`:
```typescript
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { Link, router } from 'expo-router'
import { useAuth } from '../../components/AuthContext'

export default function SignUpScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  const handleSignUp = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password, fullName)
      Alert.alert('Success', 'Account created! Please check your email to verify your account.')
      router.replace('/(auth)/login')
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 px-6 py-20 bg-white">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-center mb-2">Create Account</Text>
        <Text className="text-gray-600 text-center">Start your interview prep journey</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-gray-700 mb-2">Full Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="John Doe"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View>
          <Text className="text-gray-700 mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-gray-700 mb-2">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-lg mt-6"
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">Create Account</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-gray-600">Already have an account? </Text>
          <Link href="/(auth)/login" className="text-blue-600 font-semibold">
            Sign In
          </Link>
        </View>
      </View>
    </View>
  )
}
```

**Step 5: Update root layout with auth**
`app/_layout.tsx`:
```typescript
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { AuthProvider } from '../components/AuthContext'
import '../global.css'

export {
  ErrorBoundary,
} from 'expo-router'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  )
}
```

**Step 6: Test authentication flow**
Run: `npx expo start`
Navigate to auth screens, test signup/login flow
Expected: Users can create accounts and sign in

**Step 7: Commit authentication**
```bash
git add app/ components/
git commit -m "feat: implement authentication with supabase auth"
```

### Task 5: Create Interview Practice Screen

**Objective:** Build the core interview simulation interface with AI integration

**Files:**
- Create: `app/(tabs)/interview.tsx`
- Create: `components/InterviewSession.tsx`
- Create: `lib/openrouter.ts`
- Create: `hooks/useInterview.ts`

**Step 1: Install speech and audio dependencies**
```bash
npx expo install expo-speech expo-av @react-native-voice/voice
```

**Step 2: Create OpenRouter API client**
`lib/openrouter.ts`:
```typescript
const OPENROUTER_API_KEY = 'YOUR_OPENROUTER_API_KEY' // From your existing setup

interface InterviewQuestion {
  question: string
  type: 'behavioral' | 'technical' | 'situational'
  difficulty: 'easy' | 'medium' | 'hard'
}

interface InterviewResponse {
  question: string
  answer: string
  feedback: string
  score: number
}

export class InterviewAI {
  private apiKey: string

  constructor(apiKey: string = OPENROUTER_API_KEY) {
    this.apiKey = apiKey
  }

  async generateQuestions(role: string, level: string, count: number = 5): Promise<InterviewQuestion[]> {
    const prompt = `Generate ${count} interview questions for a ${level} level ${role} position. 
    Include a mix of behavioral, technical, and situational questions appropriate for the role.
    
    Return ONLY a JSON array with this structure:
    [
      {
        "question": "Tell me about a time when...",
        "type": "behavioral",
        "difficulty": "medium"
      }
    ]`

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://interviewready.ai',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
        }),
      })

      const data = await response.json()
      const content = data.choices[0].message.content
      
      // Parse JSON response
      const questions = JSON.parse(content)
      return questions

    } catch (error) {
      console.error('Error generating questions:', error)
      throw new Error('Failed to generate interview questions')
    }
  }

  async evaluateAnswer(question: string, answer: string, role: string): Promise<InterviewResponse> {
    const prompt = `You are an expert interview coach. Evaluate this interview answer:

    Question: "${question}"
    Role: ${role}
    Answer: "${answer}"
    
    Provide:
    1. Constructive feedback on the answer quality
    2. A score from 1-10
    3. Specific suggestions for improvement
    4. What the candidate did well
    
    Return ONLY JSON:
    {
      "question": "${question}",
      "answer": "${answer}",
      "feedback": "Detailed feedback with specific suggestions...",
      "score": 8.5
    }`

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://interviewready.ai',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
        }),
      })

      const data = await response.json()
      const content = data.choices[0].message.content
      
      return JSON.parse(content)

    } catch (error) {
      console.error('Error evaluating answer:', error)
      throw new Error('Failed to evaluate answer')
    }
  }
}

export const interviewAI = new InterviewAI()
```

**Step 3: Create interview hook**
`hooks/useInterview.ts`:
```typescript
import { useState, useCallback } from 'react'
import { interviewAI } from '../lib/openrouter'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthContext'
import * as Speech from 'expo-speech'

interface Question {
  id: string
  text: string
  type: string
  difficulty: string
}

interface Answer {
  questionId: string
  text: string
  score?: number
  feedback?: string
}

export function useInterview() {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)

  const startInterview = useCallback(async (role: string, level: string) => {
    setIsLoading(true)
    try {
      const generatedQuestions = await interviewAI.generateQuestions(role, level, 5)
      
      const questionsWithIds = generatedQuestions.map((q, index) => ({
        id: `q_${index}`,
        text: q.question,
        type: q.type,
        difficulty: q.difficulty
      }))
      
      setQuestions(questionsWithIds)
      setCurrentQuestionIndex(0)
      setAnswers([])
      setSessionActive(true)
      
      // Speak first question
      if (questionsWithIds.length > 0) {
        Speech.speak(questionsWithIds[0].text, {
          language: 'en-US',
          pitch: 1.0,
          rate: 0.8,
        })
      }
      
    } catch (error) {
      console.error('Failed to start interview:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const submitAnswer = useCallback(async (answerText: string, role: string) => {
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return

    setIsLoading(true)
    try {
      // Evaluate answer with AI
      const evaluation = await interviewAI.evaluateAnswer(
        currentQuestion.text,
        answerText,
        role
      )

      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        text: answerText,
        score: evaluation.score,
        feedback: evaluation.feedback
      }

      setAnswers(prev => [...prev, newAnswer])

      // Move to next question or end interview
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1
        setCurrentQuestionIndex(nextIndex)
        
        // Speak next question
        Speech.speak(questions[nextIndex].text, {
          language: 'en-US',
          pitch: 1.0,
          rate: 0.8,
        })
      } else {
        // Interview complete
        await endInterview(role)
      }

    } catch (error) {
      console.error('Failed to submit answer:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [questions, currentQuestionIndex])

  const endInterview = useCallback(async (role: string) => {
    if (!user || answers.length === 0) return

    try {
      // Calculate overall score
      const totalScore = answers.reduce((sum, answer) => sum + (answer.score || 0), 0)
      const averageScore = totalScore / answers.length

      // Save session to database
      const { error } = await supabase
        .from('interview_sessions')
        .insert({
          user_id: user.id,
          type: 'general',
          role: role,
          score: averageScore,
          questions_data: questions.map((q, index) => ({
            question: q.text,
            answer: answers[index]?.text || '',
            score: answers[index]?.score || 0,
            feedback: answers[index]?.feedback || ''
          }))
        })

      if (error) throw error

      setSessionActive(false)

    } catch (error) {
      console.error('Failed to save interview session:', error)
      throw error
    }
  }, [user, questions, answers])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? (currentQuestionIndex + 1) / questions.length : 0

  return {
    questions,
    currentQuestion,
    currentQuestionIndex,
    answers,
    isLoading,
    sessionActive,
    progress,
    startInterview,
    submitAnswer,
    endInterview,
  }
}
```

**Step 4: Create interview session component**
`components/InterviewSession.tsx`:
```typescript
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native'
import { useInterview } from '../hooks/useInterview'
import * as Speech from 'expo-speech'

interface Props {
  role: string
  level: string
  onComplete: () => void
}

export default function InterviewSession({ role, level, onComplete }: Props) {
  const {
    currentQuestion,
    currentQuestionIndex,
    questions,
    isLoading,
    sessionActive,
    progress,
    startInterview,
    submitAnswer,
    endInterview,
  } = useInterview()

  const [answer, setAnswer] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  const handleStart = async () => {
    try {
      await startInterview(role, level)
    } catch (error) {
      Alert.alert('Error', 'Failed to start interview. Please try again.')
    }
  }

  const handleSubmit = async () => {
    if (!answer.trim()) {
      Alert.alert('Error', 'Please provide an answer before continuing.')
      return
    }

    try {
      await submitAnswer(answer.trim(), role)
      setAnswer('')
    } catch (error) {
      Alert.alert('Error', 'Failed to submit answer. Please try again.')
    }
  }

  const handleRepeatQuestion = () => {
    if (currentQuestion) {
      Speech.speak(currentQuestion.text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
      })
    }
  }

  if (!sessionActive) {
    return (
      <View className="flex-1 justify-center items-center px-6 bg-white">
        <View className="text-center mb-8">
          <Text className="text-3xl font-bold mb-4">Ready for Your Interview?</Text>
          <Text className="text-gray-600 text-lg mb-2">Position: {role}</Text>
          <Text className="text-gray-600 text-lg mb-6">Level: {level}</Text>
          <Text className="text-gray-500">
            You'll receive 5 questions tailored to your role. Take your time and speak naturally.
          </Text>
        </View>

        <TouchableOpacity
          className="bg-blue-600 py-4 px-8 rounded-lg"
          onPress={handleStart}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">Start Interview</Text>
          )}
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-8">
        {/* Progress Bar */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</Text>
            <Text className="text-gray-600">{Math.round(progress * 100)}%</Text>
          </View>
          <View className="bg-gray-200 h-2 rounded-full">
            <View 
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
          </View>
        </View>

        {/* Current Question */}
        {currentQuestion && (
          <View className="bg-gray-50 p-6 rounded-lg mb-6">
            <Text className="text-lg font-semibold mb-4">{currentQuestion.text}</Text>
            
            <TouchableOpacity
              className="bg-gray-200 py-2 px-4 rounded-lg self-start"
              onPress={handleRepeatQuestion}
            >
              <Text className="text-gray-700">🔊 Repeat Question</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Answer Input */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-semibold">Your Answer</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-base min-h-32"
            placeholder="Type your answer here or use the voice recording feature..."
            value={answer}
            onChangeText={setAnswer}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          
          <View className="flex-row items-center mt-3">
            <Text className="text-gray-500 text-sm flex-1">
              Tip: Structure your answer using the STAR method (Situation, Task, Action, Result)
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 bg-gray-200 py-4 rounded-lg"
            onPress={() => setAnswer('')}
          >
            <Text className="text-gray-700 text-center font-semibold">Clear</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-blue-600 py-4 rounded-lg"
            onPress={handleSubmit}
            disabled={isLoading || !answer.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold">
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
```

**Step 5: Update interview tab**
`app/(tabs)/interview.tsx`:
```typescript
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useAuth } from '../../components/AuthContext'
import { router } from 'expo-router'
import InterviewSession from '../../components/InterviewSession'

const ROLE_OPTIONS = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'Marketing Manager',
  'Sales Representative',
  'UX Designer',
  'Business Analyst',
  'Project Manager',
]

const LEVEL_OPTIONS = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior Level (6-10 years)' },
  { value: 'executive', label: 'Executive Level (10+ years)' },
]

export default function InterviewScreen() {
  const { user } = useAuth()
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [showSession, setShowSession] = useState(false)

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center px-6 bg-white">
        <Text className="text-xl text-gray-600 mb-4">Please log in to start practicing</Text>
        <TouchableOpacity
          className="bg-blue-600 py-3 px-6 rounded-lg"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (showSession && selectedRole && selectedLevel) {
    return (
      <InterviewSession
        role={selectedRole}
        level={selectedLevel}
        onComplete={() => {
          setShowSession(false)
          setSelectedRole('')
          setSelectedLevel('')
        }}
      />
    )
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-8">
        <Text className="text-2xl font-bold mb-2">AI Interview Practice</Text>
        <Text className="text-gray-600 mb-8">
          Practice with AI-powered interviews tailored to your target role and experience level.
        </Text>

        {/* Role Selection */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Select Your Target Role</Text>
          <View className="grid grid-cols-2 gap-3">
            {ROLE_OPTIONS.map((role) => (
              <TouchableOpacity
                key={role}
                className={`p-4 rounded-lg border-2 ${
                  selectedRole === role
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
                onPress={() => setSelectedRole(role)}
              >
                <Text className={`text-center font-medium ${
                  selectedRole === role ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Level Selection */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-3">Experience Level</Text>
          <View className="space-y-2">
            {LEVEL_OPTIONS.map((level) => (
              <TouchableOpacity
                key={level.value}
                className={`p-4 rounded-lg border-2 ${
                  selectedLevel === level.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
                onPress={() => setSelectedLevel(level.value)}
              >
                <Text className={`font-medium ${
                  selectedLevel === level.value ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          className={`py-4 px-6 rounded-lg ${
            selectedRole && selectedLevel
              ? 'bg-blue-600'
              : 'bg-gray-300'
          }`}
          onPress={() => setShowSession(true)}
          disabled={!selectedRole || !selectedLevel}
        >
          <Text className={`text-center font-semibold text-lg ${
            selectedRole && selectedLevel ? 'text-white' : 'text-gray-500'
          }`}>
            Start Interview Practice
          </Text>
        </TouchableOpacity>

        {(!selectedRole || !selectedLevel) && (
          <Text className="text-gray-500 text-center mt-3">
            Please select both role and experience level to continue
          </Text>
        )}
      </View>
    </ScrollView>
  )
}
```

**Step 6: Test interview flow**
Run: `npx expo start`
Navigate to interview tab, test question generation and flow
Expected: Users can select role/level and receive AI-generated questions

**Step 7: Commit interview features**
```bash
git add app/ components/ lib/ hooks/
git commit -m "feat: implement ai-powered interview practice with openrouter"
```

## Phase 3: Monetization & Launch (Days 22-30)

### Task 6: Implement In-App Purchases

**Objective:** Add RevenueCat for subscription management and payment processing

**Files:**
- Create: `lib/purchases.ts`
- Create: `components/PaywallModal.tsx`
- Create: `hooks/usePurchases.ts`
- Modify: `app/(tabs)/interview.tsx` (add paywall)

**Step 1: Install RevenueCat**
```bash
npm install react-native-purchases
npx expo install expo-dev-client
```

**Step 2: Configure RevenueCat**
`lib/purchases.ts`:
```typescript
import Purchases, { CustomerInfo, Offerings, PurchasesOffering } from 'react-native-purchases'
import { Platform } from 'react-native'

const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_your_ios_key',
  android: 'goog_your_android_key',
}) as string

export const initializePurchases = async (userId: string) => {
  try {
    await Purchases.configure({ apiKey: REVENUECAT_API_KEY })
    await Purchases.logIn(userId)
    console.log('RevenueCat initialized successfully')
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error)
  }
}

export const getOfferings = async (): Promise<Offerings | null> => {
  try {
    const offerings = await Purchases.getOfferings()
    return offerings
  } catch (error) {
    console.error('Failed to get offerings:', error)
    return null
  }
}

export const purchaseOffering = async (offering: PurchasesOffering): Promise<CustomerInfo> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(offering.availablePackages[0])
    return customerInfo
  } catch (error) {
    console.error('Purchase failed:', error)
    throw error
  }
}

export const restorePurchases = async (): Promise<CustomerInfo> => {
  try {
    const customerInfo = await Purchases.restorePurchases()
    return customerInfo
  } catch (error) {
    console.error('Restore failed:', error)
    throw error
  }
}

export const getCustomerInfo = async (): Promise<CustomerInfo> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo()
    return customerInfo
  } catch (error) {
    console.error('Failed to get customer info:', error)
    throw error
  }
}

// Entitlement constants
export const ENTITLEMENTS = {
  PRO: 'pro_access',
  UNLIMITED_INTERVIEWS: 'unlimited_interviews',
} as const
```

**Step 3: Create purchases hook**
`hooks/usePurchases.ts`:
```typescript
import { useState, useEffect, useCallback } from 'react'
import { CustomerInfo, Offerings } from 'react-native-purchases'
import { 
  initializePurchases, 
  getOfferings, 
  getCustomerInfo, 
  purchaseOffering,
  restorePurchases,
  ENTITLEMENTS 
} from '../lib/purchases'
import { useAuth } from '../components/AuthContext'

export function usePurchases() {
  const { user } = useAuth()
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [offerings, setOfferings] = useState<Offerings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState(false)

  const isPro = customerInfo?.entitlements.active[ENTITLEMENTS.PRO] != null
  const hasUnlimitedInterviews = customerInfo?.entitlements.active[ENTITLEMENTS.UNLIMITED_INTERVIEWS] != null

  useEffect(() => {
    if (user) {
      initializeRevenueCat()
    }
  }, [user])

  const initializeRevenueCat = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      await initializePurchases(user.id)
      
      const [customerData, offeringsData] = await Promise.all([
        getCustomerInfo(),
        getOfferings()
      ])
      
      setCustomerInfo(customerData)
      setOfferings(offeringsData)
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const makePurchase = useCallback(async (offeringId: string) => {
    if (!offerings?.current) return

    setIsPurchasing(true)
    try {
      const offering = offerings.current
      const updatedCustomerInfo = await purchaseOffering(offering)
      setCustomerInfo(updatedCustomerInfo)
      return true
    } catch (error) {
      console.error('Purchase failed:', error)
      return false
    } finally {
      setIsPurchasing(false)
    }
  }, [offerings])

  const restore = useCallback(async () => {
    setIsLoading(true)
    try {
      const updatedCustomerInfo = await restorePurchases()
      setCustomerInfo(updatedCustomerInfo)
      return true
    } catch (error) {
      console.error('Restore failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    customerInfo,
    offerings,
    isLoading,
    isPurchasing,
    isPro,
    hasUnlimitedInterviews,
    makePurchase,
    restore,
  }
}
```

**Step 4: Create paywall modal**
`components/PaywallModal.tsx`:
```typescript
import React from 'react'
import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { usePurchases } from '../hooks/usePurchases'

interface Props {
  visible: boolean
  onClose: () => void
  onPurchaseComplete: () => void
}

export default function PaywallModal({ visible, onClose, onPurchaseComplete }: Props) {
  const { offerings, isPurchasing, makePurchase, restore } = usePurchases()

  const handlePurchase = async () => {
    const success = await makePurchase('pro')
    if (success) {
      Alert.alert('Success!', 'Welcome to InterviewReady AI Pro!')
      onPurchaseComplete()
      onClose()
    } else {
      Alert.alert('Purchase Failed', 'Please try again or contact support.')
    }
  }

  const handleRestore = async () => {
    const success = await restore()
    if (success) {
      Alert.alert('Restored!', 'Your purchases have been restored.')
      onPurchaseComplete()
      onClose()
    } else {
      Alert.alert('Nothing to Restore', 'No previous purchases found.')
    }
  }

  const currentOffering = offerings?.current

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ScrollView className="flex-1 bg-white">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold mb-2">🚀 Upgrade to Pro</Text>
            <Text className="text-gray-600 text-center text-lg">
              Unlock unlimited AI interviews and advanced feedback
            </Text>
          </View>

          {/* Features */}
          <View className="mb-8">
            <View className="bg-gray-50 p-6 rounded-lg mb-4">
              <Text className="text-xl font-semibold mb-4">Pro Features:</Text>
              
              <View className="space-y-3">
                <View className="flex-row items-center">
                  <Text className="text-green-600 text-xl mr-3">✓</Text>
                  <Text className="text-gray-700 flex-1">Unlimited AI interview sessions</Text>
                </View>
                
                <View className="flex-row items-center">
                  <Text className="text-green-600 text-xl mr-3">✓</Text>
                  <Text className="text-gray-700 flex-1">Advanced performance analytics</Text>
                </View>
                
                <View className="flex-row items-center">
                  <Text className="text-green-600 text-xl mr-3">✓</Text>
                  <Text className="text-gray-700 flex-1">Detailed AI feedback & improvement tips</Text>
                </View>
                
                <View className="flex-row items-center">
                  <Text className="text-green-600 text-xl mr-3">✓</Text>
                  <Text className="text-gray-700 flex-1">Custom interview scenarios</Text>
                </View>
                
                <View className="flex-row items-center">
                  <Text className="text-green-600 text-xl mr-3">✓</Text>
                  <Text className="text-gray-700 flex-1">Priority support</Text>
                </View>
              </View>
            </View>

            {/* Free vs Pro comparison */}
            <View className="bg-red-50 p-4 rounded-lg">
              <Text className="text-red-800 font-medium mb-2">Free Plan Limitations:</Text>
              <Text className="text-red-700">• Only 3 interview sessions per month</Text>
              <Text className="text-red-700">• Basic feedback only</Text>
              <Text className="text-red-700">• No performance tracking</Text>
            </View>
          </View>

          {/* Pricing */}
          {currentOffering && (
            <View className="mb-8">
              <View className="border-2 border-blue-600 bg-blue-50 p-6 rounded-lg">
                <View className="text-center mb-4">
                  <Text className="text-blue-800 font-bold text-sm">🔥 LIMITED TIME</Text>
                  <Text className="text-2xl font-bold text-blue-900">
                    {currentOffering.availablePackages[0]?.storeProduct.priceString || '$4.99'}
                  </Text>
                  <Text className="text-blue-700">One-time payment • Lifetime access</Text>
                </View>
                
                <TouchableOpacity
                  className="bg-blue-600 py-4 rounded-lg mb-3"
                  onPress={handlePurchase}
                  disabled={isPurchasing}
                >
                  {isPurchasing ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-center font-bold text-lg">
                      Upgrade Now - Save 90%
                    </Text>
                  )}
                </TouchableOpacity>
                
                <Text className="text-center text-blue-700 text-sm">
                  Regular price: $49.99 • Launch special: {currentOffering.availablePackages[0]?.storeProduct.priceString}
                </Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="space-y-3">
            <TouchableOpacity
              className="bg-gray-200 py-3 rounded-lg"
              onPress={handleRestore}
            >
              <Text className="text-gray-700 text-center font-medium">Restore Purchases</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="py-3"
              onPress={onClose}
            >
              <Text className="text-gray-500 text-center">Maybe Later</Text>
            </TouchableOpacity>
          </View>

          {/* Fine Print */}
          <View className="mt-8 pt-4 border-t border-gray-200">
            <Text className="text-xs text-gray-500 text-center leading-4">
              Payment will be charged to your App Store account. 
              No subscription required - one-time purchase gives you lifetime access to Pro features.
              Terms of Service and Privacy Policy available at interviewready.ai
            </Text>
          </View>
        </View>
      </ScrollView>
    </Modal>
  )
}
```

**Step 5: Add usage limits to interview screen**
Update `app/(tabs)/interview.tsx` to include paywall logic:
```typescript
// Add to imports
import PaywallModal from '../../components/PaywallModal'
import { usePurchases } from '../../hooks/usePurchases'
import { supabase } from '../../lib/supabase'

// Add state and hooks
const { isPro, hasUnlimitedInterviews } = usePurchases()
const [showPaywall, setShowPaywall] = useState(false)
const [sessionCount, setSessionCount] = useState(0)

// Add effect to check usage
useEffect(() => {
  if (user) {
    checkSessionCount()
  }
}, [user])

const checkSessionCount = async () => {
  if (!user) return
  
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const { count } = await supabase
    .from('interview_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', thirtyDaysAgo.toISOString())
  
  setSessionCount(count || 0)
}

// Modify start button logic
const handleStartSession = () => {
  // Check if user has reached limit
  if (!isPro && sessionCount >= 3) {
    setShowPaywall(true)
    return
  }
  
  setShowSession(true)
}

// Add paywall modal before closing View tag
<PaywallModal
  visible={showPaywall}
  onClose={() => setShowPaywall(false)}
  onPurchaseComplete={() => {
    checkSessionCount() // Refresh count
  }}
/>
```

**Step 6: Test purchase flow**
Run: `npx expo start`
Test paywall appearance and purchase flow
Expected: Users see paywall after 3 sessions, can purchase pro access

**Step 7: Commit monetization features**
```bash
git add lib/ components/ hooks/ app/
git commit -m "feat: implement in-app purchases with revenuecat"
```

### Task 7: Deploy Landing Page and App

**Objective:** Launch the pre-order landing page and prepare app for store submission

**Files:**
- Create: `landing-page/netlify.toml`
- Create: `app.json` (update for store submission)
- Create: `eas.json` (Expo build config)

**Step 1: Deploy landing page to Netlify**
`landing-page/netlify.toml`:
```toml
[build]
  publish = "."

[context.production.environment]
  NODE_ENV = "production"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Deploy steps:
1. Create GitHub repo for landing page
2. Connect to Netlify
3. Deploy to custom domain (optional)

**Step 2: Configure app for store submission**
Update `app.json`:
```json
{
  "expo": {
    "name": "InterviewReady AI",
    "slug": "interviewready-ai",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#667eea"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.thothfounder.interviewready",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#667eea"
      },
      "package": "com.thothfounder.interviewready",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id"
      }
    },
    "plugins": [
      "expo-router",
      [
        "expo-build-properties",
        {
          "ios": {
            "newArchEnabled": false
          },
          "android": {
            "newArchEnabled": false
          }
        }
      ]
    ],
    "scheme": "interviewready"
  }
}
```

**Step 3: Configure EAS Build**
`eas.json`:
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

**Step 4: Build and submit to stores**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login and configure
eas login
eas build:configure

# Build for both platforms
eas build --platform all

# Submit to stores (after build completes)
eas submit --platform all
```

**Step 5: Create app store assets**
Required assets:
- App icon (1024x1024)
- App screenshots for various device sizes
- App Store description
- Privacy policy URL
- Terms of service URL

App Store Description:
```
🚀 InterviewReady AI - Your Personal Interview Coach

Ace your next job interview with AI-powered practice sessions tailored to your role and experience level.

✨ KEY FEATURES:
• Personalized AI interview questions based on your target role
• Real-time feedback and scoring on your answers
• Voice interaction for realistic practice
• Performance analytics to track improvement
• Comprehensive question database covering behavioral, technical, and situational scenarios

🎯 PERFECT FOR:
• Job seekers preparing for upcoming interviews
• Recent graduates entering the job market
• Professionals switching careers or seeking promotions
• Anyone looking to boost their interview confidence

💡 HOW IT WORKS:
1. Select your target role and experience level
2. Receive AI-generated questions tailored to your profile  
3. Practice answering out loud or in writing
4. Get instant feedback and improvement suggestions
5. Track your progress over time

🔥 LAUNCH SPECIAL: Get lifetime Pro access for just $4.99 (regular price $49.99)

Pro features include unlimited interviews, advanced analytics, and priority support.

Download now and land your dream job faster!

Privacy Policy: https://interviewready.ai/privacy
Terms of Service: https://interviewready.ai/terms
```

**Step 6: Test final build**
```bash
# Create development build for testing
eas build --profile development --platform ios

# Install on device via EAS CLI
eas device:create
eas build:run -p ios
```

**Step 7: Commit deployment configs**
```bash
git add app.json eas.json landing-page/netlify.toml
git commit -m "feat: configure app for store submission and deploy landing page"
```

## Phase 4: Launch & Validation (Days 31-90)

### Task 8: Marketing & User Acquisition

**Objective:** Drive traffic to landing page and app downloads to validate $3K MRR potential

**Step 1: Launch sequence**
1. Deploy landing page with pre-order capability
2. Submit app to App Store (Apple) and Google Play
3. Create social media accounts (@InterviewReadyAI)
4. Launch on Product Hunt, Hacker News, Reddit
5. Reach out to career coaches and job search communities

**Step 2: Track key metrics**
- Landing page conversions
- Pre-order revenue
- App downloads  
- User activation (completed first interview)
- Conversion to paid subscriptions

**Step 3: Revenue validation milestones**
- Week 1: $300 in pre-orders (10 sales × $29)
- Week 2: $600 total (20 sales)
- Week 4: $1,500 total (50 sales)
- Week 8: $3,000 total (100+ sales) = MRR validation ✅

## Success Metrics & Next Steps

**MVP Success Criteria:**
- [ ] App successfully submitted to both app stores
- [ ] Landing page live and collecting pre-orders
- [ ] Core interview flow working end-to-end
- [ ] Payment processing functional
- [ ] AI question generation and feedback working
- [ ] $3K in pre-orders/revenue within 90 days

**If successful, Phase 5 roadmap:**
- Advanced analytics dashboard
- Voice recording and speech analysis
- Company-specific interview prep
- Group coaching features
- API for career coaches
- White-label solutions

**Risk Mitigation:**
- If technical issues arise, prioritize landing page + manual coaching
- If AI costs are too high, implement usage limits and optimize prompts
- If store approval delays, focus on web app version
- If conversion is low, pivot to B2B coaching platform

This plan balances speed-to-market with technical quality, focusing on revenue validation rather than feature completeness. The goal is to prove market demand quickly, then iterate based on user feedback and revenue data.