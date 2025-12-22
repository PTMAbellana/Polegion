# 🎮 Polegion - Interactive Geometry Learning Platform

**Polegion** is a gamified learning platform designed to make geometry education engaging and interactive through castle-themed adventures, competitive challenges, and real-time collaboration features.

---

## 📋 Table of Contents

1. [Introduction](#1-introduction)
   - 1.1. [Project Overview](#11-project-overview)
   - 1.2. [Purpose and Objectives](#12-purpose-and-objectives)
   - 1.3. [Target Audience](#13-target-audience)
   - 1.4. [Key Features](#14-key-features)
2. [System Architecture](#2-system-architecture)
   - 2.1. [Tech Stack](#21-tech-stack)
   - 2.2. [System Components](#22-system-components)
   - 2.3. [Infrastructure and Services](#23-infrastructure-and-services)
3. [Local Development Setup](#3-local-development-setup)
   - 3.1. [Prerequisites](#31-prerequisites)
   - 3.2. [Installation Steps](#32-installation-steps)
   - 3.3. [Environment Configuration](#33-environment-configuration)
   - 3.4. [Database Setup](#34-database-setup)
4. [Deployment Guide](#4-deployment-guide)
   - 4.1. [Backend Deployment (Railway)](#41-backend-deployment-railway)
   - 4.2. [Frontend Deployment (Vercel)](#42-frontend-deployment-vercel)
5. [User Guide](#5-user-guide)
   - 5.1. [User Roles and Access](#51-user-roles-and-access)
   - 5.2. [Sample Credentials](#52-sample-credentials)
   - 5.3. [Student Features](#53-student-features)
   - 5.4. [Teacher Features](#54-teacher-features)
6. [Project Structure](#6-project-structure)
   - 6.1. [Directory Organization](#61-directory-organization)
   - 6.2. [Frontend Structure](#62-frontend-structure)
   - 6.3. [Backend Structure](#63-backend-structure)
7. [API Documentation](#7-api-documentation)
   - 7.1. [Authentication Endpoints](#71-authentication-endpoints)
   - 7.2. [Core API Routes](#72-core-api-routes)
   - 7.3. [Interactive API Explorer](#73-interactive-api-explorer)
8. [Troubleshooting](#8-troubleshooting)
   - 8.1. [Common Issues](#81-common-issues)
   - 8.2. [Debugging Tips](#82-debugging-tips)
   - 8.3. [Support Resources](#83-support-resources)
9. [Appendices](#9-appendices)
   - 9.1. [Additional Documentation](#91-additional-documentation)
   - 9.2. [License Information](#92-license-information)
   - 9.3. [Acknowledgments](#93-acknowledgments)

---

## 1. Introduction

### 1.1. Project Overview

**Polegion** is a comprehensive web-based learning platform that transforms geometry education into an engaging, interactive experience. Built with modern web technologies, the platform combines educational content with gamification elements to enhance student motivation and learning outcomes.

The platform features a castle-themed progression system where students advance through various geometry topics, from basic concepts to advanced theorems. Each castle represents a major topic area, with chapters breaking down complex concepts into manageable learning units.

**Key Highlights:**
- **Gamified Learning**: Castle-based progression with XP and achievements
- **Interactive Assessments**: Dynamic problem sets with instant feedback
- **Real-time Competitions**: Live leaderboards and collaborative challenges
- **Teacher Tools**: Comprehensive classroom management and analytics
- **Modern Architecture**: Built with Next.js 15, React 19, and Express 5

### 1.2. Purpose and Objectives

**Primary Purpose:**
Polegion aims to address the challenge of engaging students in geometry education by creating an immersive, game-like learning environment that makes abstract mathematical concepts tangible and enjoyable.

**Core Objectives:**

1. **Enhance Student Engagement**
   - Transform traditional geometry lessons into interactive adventures
   - Use gamification to increase motivation and participation
   - Provide immediate feedback and progress tracking

2. **Support Differentiated Learning**
   - Offer content at various difficulty levels
   - Allow students to progress at their own pace
   - Provide practice problems for skill reinforcement

3. **Facilitate Teacher Management**
   - Enable creation of virtual classrooms and competitions
   - Provide detailed analytics on student performance
   - Streamline assessment and grading processes

4. **Foster Competitive Learning**
   - Create healthy competition through leaderboards
   - Enable real-time collaborative problem-solving
   - Build community through shared challenges

5. **Ensure Accessibility and Scalability**
   - Responsive design for all devices
   - Cloud-based deployment for global access
   - Robust infrastructure to handle multiple concurrent users

### 1.3. Target Audience

**Primary Users:**

1. **Students (Ages 13-18)**
   - Middle school and high school students studying geometry
   - Learners seeking supplementary practice and enrichment
   - Students preparing for standardized tests or competitions
   - Self-directed learners exploring geometry concepts

2. **Teachers and Educators**
   - Geometry teachers seeking interactive teaching tools
   - Educators managing multiple classes or student groups
   - Instructors wanting detailed performance analytics
   - Teachers organizing classroom competitions and activities

3. **Educational Institutions**
   - Schools implementing blended learning approaches
   - After-school programs and tutoring centers
   - Educational organizations offering online geometry courses
   - Institutions seeking scalable digital learning solutions

**User Characteristics:**
- Basic computer literacy and internet access
- Familiarity with web browsers and online platforms
- For students: Enrolled in or studying geometry
- For teachers: Experience with classroom management and geometry curriculum

### 1.4. Key Features

**For Students:**

🏰 **Castle-Based Learning System**
- Progress through themed geometry castles
- Unlock new chapters and content sequentially
- Visual progress tracking and achievement badges

🎮 **Interactive Mini-Games**
- Hands-on geometry concept exploration
- Engaging problem-solving activities
- Visual and kinesthetic learning opportunities

📊 **Comprehensive Assessment System**
- Pre-tests to gauge initial knowledge
- Chapter quizzes for concept reinforcement
- Post-tests to measure learning outcomes
- Instant feedback and detailed explanations

🏆 **Real-time Leaderboards**
- Compete with classmates in live challenges
- Track rankings across different problem categories
- View historical performance and improvements

🎯 **XP and Progress Tracking**
- Earn experience points for completed activities
- Unlock achievements and milestones
- Visualize learning journey and mastery levels

👥 **Virtual Room Participation**
- Join teacher-created learning environments
- Access curated problem sets and competitions
- Collaborate with peers in shared challenges

**For Teachers:**

📝 **Virtual Room Management**
- Create and customize learning environments
- Invite students via unique room codes
- Organize content by topic or difficulty

🏆 **Competition Creation and Management**
- Design timed competitions with custom problems
- Set difficulty levels and scoring rules
- Monitor active participation in real-time

📈 **Student Progress Analytics**
- View individual student performance metrics
- Track class-wide statistics and trends
- Identify struggling students needing support
- Export reports for assessment documentation

📊 **Comprehensive Dashboard**
- Real-time active participant monitoring
- Competition results and leaderboard displays
- Performance distribution visualizations
- Historical data and trend analysis

👥 **Classroom Administration**
- Manage multiple virtual rooms simultaneously
- Archive completed competitions
- Access student submission history

**Platform Features:**

🔐 **Secure Authentication System**
- JWT-based authentication with Supabase
- Role-based access control (Student/Teacher/Admin)
- Secure password hashing with bcrypt
- Optional Google OAuth integration

🔄 **Real-time Capabilities**
- Live leaderboard updates during competitions
- Active participant tracking
- Instant submission feedback
- Real-time ranking adjustments

📱 **Responsive Design**
- Optimized for desktop, tablet, and mobile devices
- Consistent user experience across platforms
- Touch-friendly interfaces for mobile users

🎨 **Modern User Interface**
- Clean, intuitive design with TailwindCSS
- Smooth animations and transitions
- Accessible color schemes and typography
- Interactive canvas-based visualizations

🚀 **Performance Optimized**
- Fast page loads with Next.js 15 SSR
- Intelligent caching strategies
- Image optimization and lazy loading
- Efficient API response handling

📄 **Interactive API Documentation**
- Swagger/OpenAPI documentation
- Try-it-out functionality for endpoints
- Request/response schema references
- Authentication flow examples

---

## 2. System Architecture

### 2.1. Tech Stack

#### **Frontend Technologies**

#### Core Framework & Runtime
- **Next.js**: `15.3.8` - React framework with SSR and routing
- **React**: `19.1.0` - UI library
- **React DOM**: `19.1.0` - React rendering
- **TypeScript**: `5.8.3` - Type-safe JavaScript
- **Node.js**: `20.17.47` (development types)

#### State Management & Data Fetching
- **Zustand**: `5.0.8` - Lightweight state management
- **SWR**: `2.3.8` - Data fetching and caching
- **React Hook Form**: `7.56.3` - Form management
- **@hookform/resolvers**: `5.0.1` - Form validation resolvers

#### UI Components & Visualization
- **Lucide React**: `0.508.0` - Modern icon library
- **React Icons**: `5.5.0` - Popular icon sets
- **Lottie React**: `2.4.1` - Animation library
- **React Konva**: `19.0.7` - Canvas-based graphics
- **Konva**: `9.3.22` - 2D canvas framework
- **Recharts**: `3.5.0` - Chart library
- **SweetAlert2**: `11.22.4` - Beautiful alert/modal system

#### Backend Integration
- **Axios**: `1.13.2` - HTTP client
- **Axios Cache Interceptor**: `1.8.3` - Request caching
- **@supabase/supabase-js**: `2.50.0` - Supabase client

#### Utilities & Tools
- **Yup**: `1.6.1` - Schema validation
- **React Hot Toast**: `2.5.2` - Toast notifications
- **HTML2Canvas**: `1.4.1` - Screenshot generation
- **Canvas**: `3.1.2` - Canvas API polyfill
- **React to Print**: `3.2.0` - Print functionality

#### Styling
- **TailwindCSS**: `4.1.7` - Utility-first CSS framework
- **PostCSS**: `8.5.3` - CSS transformer
- **Autoprefixer**: `10.4.21` - CSS vendor prefixing
- **Next Themes**: `0.4.6` - Theme management

#### Development Tools
- **ESLint**: `9` - Code linting
- **ESLint Config Next**: `15.3.2` - Next.js ESLint config
- **Sharp**: `0.34.5` - Image optimization

---

#### **Backend Technologies**

#### Runtime & Framework
- **Node.js**: Latest LTS - JavaScript runtime
- **Express**: `5.1.0` - Web application framework

#### Database & Authentication
- **@supabase/supabase-js**: `2.49.4` - Supabase client library
- **JSONWebToken**: `9.0.2` - JWT authentication
- **BCryptJS**: `3.0.2` - Password hashing

#### API Documentation
- **Swagger JSDoc**: `6.2.8` - API documentation generator
- **Swagger UI Express**: `5.0.1` - Interactive API documentation UI

#### Middleware & Security
- **CORS**: `2.8.5` - Cross-Origin Resource Sharing
- **Body Parser**: `2.2.0` - Request body parsing
- **Helmet**: `8.1.0` - Security headers
- **Express Rate Limit**: `8.1.0` - Rate limiting
- **Compression**: `1.8.1` - Response compression
- **Morgan**: `1.10.1` - HTTP request logger

#### File Handling & Utilities
- **Multer**: `2.0.1` - File upload middleware
- **Dotenv**: `16.5.0` / `17.2.3` - Environment variable management

#### External Services
- **Google APIs**: `150.0.1` / `152.0.0` - Google OAuth integration
- **Nodemailer**: `7.0.5` / `7.0.11` - Email sending
- **Nodemailer Express Handlebars**: `7.0.0` - Email templates

#### Template Engine
- **Handlebars (HBS)**: `4.2.0` - Template engine
- **Express Handlebars**: `8.0.3` - Handlebars for Express
- **Handlebars**: `4.7.8` - Template compiler

#### Real-time Communication
- **Socket.io Client**: `4.8.1` - Real-time bidirectional communication

#### Validation
- **Joi**: `18.0.1` - Object schema validation

#### Development Tools
- **Nodemon**: `3.1.10` - Auto-restart on file changes
- **Concurrently**: `9.1.2` - Run multiple commands simultaneously

---

### 2.2. System Components

**Frontend Application (Next.js)**

The frontend is built on Next.js 15 with React 19, leveraging the latest features of server-side rendering and the App Router architecture.

**Key Components:**
- **Page Components**: Route-based pages using Next.js App Router
- **UI Components**: Reusable React components for consistency
- **State Management**: Zustand stores for global application state
- **API Integration**: Axios client with caching interceptors
- **Real-time Features**: SWR for data fetching and revalidation
- **Canvas Rendering**: React Konva for interactive geometry visualizations

**Frontend Architecture Layers:**
1. **Presentation Layer**: UI components and pages
2. **Application Layer**: Business logic and state management
3. **Data Layer**: API clients and data fetching hooks
4. **Infrastructure Layer**: Authentication, routing, caching

**Backend Application (Express.js)**

The backend follows a clean architecture pattern with clear separation of concerns.

**Architectural Layers:**

1. **Presentation Layer** (`presentation/`)
   - **Controllers**: Handle HTTP requests and responses
   - **Routes**: Define API endpoints and route middleware
   - **Middleware**: Authentication, validation, error handling

2. **Application Layer** (`application/`)
   - **Services**: Business logic and use case implementations
   - **Cache**: Response caching for performance optimization

3. **Domain Layer** (`domain/`)
   - **Models**: Data models and entity definitions
   - **Business Rules**: Domain-specific logic and validation

4. **Infrastructure Layer** (`infrastructure/`)
   - **Repository**: Data access layer for database operations
   - **Migrations**: Database schema version control
   - **Seeds**: Initial data population scripts

**Core Services:**
- Authentication Service (JWT-based)
- User Management Service
- Castle & Chapter Service
- Assessment Service
- Competition Service
- Leaderboard Service
- Virtual Room Service

**Database (Supabase/PostgreSQL)**

Supabase provides a managed PostgreSQL database with additional features:

**Key Features:**
- **Row Level Security (RLS)**: Fine-grained access control
- **Real-time Subscriptions**: Live data updates
- **Built-in Authentication**: User management and sessions
- **RESTful API**: Auto-generated from database schema
- **Storage**: File and asset management

**Database Tables:**
- Users (students, teachers, admins)
- Castles & Chapters (content structure)
- Assessments & Questions
- Student Progress & Submissions
- Virtual Rooms & Participants
- Competitions & Leaderboards
- Problem Sets & Practice Problems

### 2.3. Infrastructure and Services

**Cloud Services & Platforms:**

- **Supabase** - PostgreSQL database with real-time capabilities and authentication
- **Vercel** - Frontend hosting and deployment platform with automatic CI/CD
- **Railway** / **Heroku** - Backend hosting platform with container orchestration
- **GitHub** - Version control and CI/CD integration

**External Integrations:**

- **Google OAuth**: Optional third-party authentication
- **Nodemailer**: Email delivery for notifications and invitations
- **Swagger/OpenAPI**: API documentation and testing interface

**Development Tools:**

- **ESLint**: Code quality and style enforcement
- **Nodemon**: Automatic server restart on file changes
- **Sharp**: Image processing and optimization
- **TypeScript**: Static type checking for frontend

---

## 3. Local Development Setup

### 3.1. Prerequisites

**Required Software:**

- **Node.js**: Version 20.x or higher (LTS recommended)
- **npm**: Version 10.x or higher (comes with Node.js)
- **Git**: Latest version for version control
- **Code Editor**: VS Code, WebStorm, or similar

**Required Accounts:**

- **Supabase Account**: For database and authentication services
- **GitHub Account**: For repository access and version control
- **Google Account** (Optional): For OAuth integration
- **Email Account** (Optional): For nodemailer integration

**System Requirements:**

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 1GB free space for dependencies
- **Internet Connection**: Required for package installation and API calls

### 3.2. Installation Steps

**Step 1: Clone Repository**

```bash
git clone https://github.com/PTMAbellana/Polegion.git
cd Polegion
```

**Step 2: Install Dependencies**

Option A - Install All at Once (Recommended):
```bash
npm run install-all
```

Option B - Install Manually:
```bash
# Install root dependencies (if any)
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
cd ..
```

**Step 3: Verify Installation**

Check that all dependencies are installed correctly:
```bash
# Check Node.js version
node --version  # Should be 20.x or higher

# Check npm version
npm --version   # Should be 10.x or higher

# Verify frontend dependencies
cd frontend && npm list --depth=0

# Verify backend dependencies
cd ../backend && npm list --depth=0
```

### 3.3. Environment Configuration

**Backend Environment Variables**

Create a file named `.env` in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration (CRITICAL: Use SERVICE ROLE KEY for backend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# ⚠️ WARNING: This is the SERVICE ROLE KEY, not the anon key!
# Find this in: Supabase Dashboard → Settings → API → Service Role Key

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_please
# Generate a secure random string, e.g., using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# CORS Configuration
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Google OAuth (Optional - Remove if not using)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Email Service (Optional - Remove if not using)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
# For Gmail, generate an App Password: Google Account → Security → 2-Step Verification → App Passwords
```

**Frontend Environment Variables**

Create a file named `.env.local` in the `frontend/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
# ⚠️ Must point to your backend API endpoint

# Supabase Configuration (Use ANON KEY for frontend)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# ⚠️ WARNING: This is the ANON/PUBLIC KEY, NOT the service role key!
# Find this in: Supabase Dashboard → Settings → API → Anon Public Key

# Optional: Feature Flags
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true
NEXT_PUBLIC_ENABLE_EMAIL_INVITES=true
```

**Environment Variable Security Notes:**

1. ✅ **DO**: Use service role key in backend (server-side only)
2. ✅ **DO**: Use anon key in frontend (client-side)
3. ❌ **DON'T**: Put service role key in frontend
4. ❌ **DON'T**: Commit `.env` files to Git
5. ✅ **DO**: Add `.env` and `.env.local` to `.gitignore`

**How to Get Supabase Keys:**

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to: **Settings** → **API**
4. Copy:
   - **URL**: Your project URL (e.g., `https://xyz.supabase.co`)
   - **anon/public key**: For frontend (safe to expose)
   - **service_role key**: For backend (keep secret!)

### 3.4. Database Setup

**Step 1: Create Supabase Project**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: Polegion
   - **Database Password**: Strong password (save this!)
   - **Region**: Choose closest to your location
4. Wait for project creation (2-3 minutes)

**Step 2: Run Database Migrations**

Execute the following SQL files in order through the Supabase SQL Editor:

1. Navigate to: **SQL Editor** → **New Query**

2. **Main Schema** (Required):
   ```sql
   -- Copy and paste contents from:
   docs/sql/DATABASE_COMPLETE_SCHEMA.sql
   ```
   - Creates all tables, indexes, and relationships
   - Sets up user roles and permissions
   - Initializes castle and chapter structure

3. **RLS Policies** (Required):
   ```sql
   -- Copy and paste contents from:
   docs/sql/FIX_ASSESSMENT_RLS_FOR_BACKEND.sql
   ```
   - Configures Row Level Security policies
   - Enables backend service role access
   - Sets up student/teacher access controls

4. **Real-time Features** (Required):
   ```sql
   -- Copy and paste contents from:
   docs/sql/ENABLE_REALTIME_PUBLICATION.sql
   ```
   - Enables real-time subscriptions
   - Configures publication for leaderboards
   - Sets up active participant tracking

5. **Optional: Seed Data**
   ```sql
   -- For development/testing, copy from:
   docs/sql/CASTLE_0_6_ASSESSMENT_SEED.sql
   ```
   - Populates sample castles and chapters
   - Adds practice problems
   - Creates test assessment questions

**Step 3: Verify Database Setup**

1. Go to **Table Editor** in Supabase Dashboard
2. Verify these tables exist:
   - `users`
   - `castles`
   - `chapters`
   - `assessments`
   - `assessment_questions`
   - `student_progress`
   - `virtual_rooms`
   - `competitions`
   - `leaderboards`
   - `problem_submissions`

3. Check **Database** → **Replication** → Ensure `supabase_realtime` is enabled

**Step 4: Test Database Connection**

Run this test from your backend:

```bash
cd backend
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
supabase.from('castles').select('count').then(r => console.log('✅ Database connected:', r));
"
```

Expected output: `✅ Database connected: { data: [...], count: X }`

**Step 5: Run Development Servers**

Option A - Run Both Servers Concurrently (Recommended):
```bash
# From project root
npm run dev
```

Option B - Run Separately in Different Terminals:

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

**Step 6: Access the Application**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

**Verification Checklist:**

✅ Both servers start without errors  
✅ Frontend loads in browser  
✅ No CORS errors in browser console  
✅ API health endpoint returns `{"status":"ok"}`  
✅ Can navigate to registration page  
✅ Database tables visible in Supabase dashboard  

---

## 4. Deployment Guide

### Deployment Prerequisites

Before deploying to production, ensure you have:

✅ **Completed Database Setup**: All migrations run in Supabase  
✅ **Railway Account**: For backend hosting (or Heroku alternative)  
✅ **Vercel Account**: For frontend hosting  
✅ **GitHub Repository**: Code pushed to GitHub  
✅ **Environment Variables**: All secrets and keys ready  
✅ **Domain Names** (Optional): Custom domains configured  

### 4.1. Backend Deployment (Railway)

#### Step 1: Prepare Supabase Database

1. **Run Database Migrations**
   - Go to your Supabase Dashboard → SQL Editor
   - Execute the following SQL files in order:
     - `docs/sql/DATABASE_COMPLETE_SCHEMA.sql`
     - `docs/sql/FIX_ASSESSMENT_RLS_FOR_BACKEND.sql`
     - `docs/sql/ENABLE_REALTIME_PUBLICATION.sql`

2. **Get API Keys**
   - Go to Settings → API
   - Copy **Service Role Key** (secret) - **IMPORTANT: Not the anon key!**
   - Copy your project URL: `https://your-project.supabase.co`

#### Step 2: Deploy to Railway

1. **Create New Project**
   - Go to [Railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - **Important**: Set root directory to `backend`

2. **Configure Environment Variables**
   
   Add the following in Railway Dashboard → Variables:
   ```bash
   PORT=5000
   NODE_ENV=production
   
   # Supabase - CRITICAL: Use SERVICE ROLE KEY
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbG...  # Service role key (long JWT token)
   
   # JWT Authentication
   JWT_SECRET=your_jwt_secret_minimum_32_characters_long
   
   # CORS Configuration
   FRONTEND_URL=https://your-app.vercel.app
   
   # Optional: Keep-alive for health checks
   BACKEND_URL=https://your-backend.railway.app
   
   # Optional: Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=https://your-backend.railway.app/api/auth/google/callback
   
   # Optional: Email Service
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

3. **Configure Build Settings**
   - Build Command: (leave empty, uses default `npm install`)
   - Start Command: `node server.js`
   - Watch Paths: `backend/**`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (2-5 minutes)
   - Copy your Railway URL: `https://your-backend.railway.app`

5. **Test Backend**
   ```bash
   curl https://your-backend.railway.app/health
   ```
   
   Expected response:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-...",
     "uptime": 123.45,
     "environment": "production"
   }
   ```

---

### 4.2. Frontend Deployment (Vercel)

#### Step 1: Import Project to Vercel

1. **Create New Project**
   - Go to [Vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - **Important**: Set root directory to `frontend`

2. **Configure Framework Settings**
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

#### Step 2: Set Environment Variables

Add the following in Vercel Dashboard → Settings → Environment Variables:

```bash
# API Configuration - Use your Railway backend URL
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api

# Supabase Configuration - Use ANON KEY (public key)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...  # Anon/public key (different from service role!)
```

**⚠️ CRITICAL NOTES:**
- Frontend uses **ANON KEY** (public), NOT service role key
- All `NEXT_PUBLIC_*` variables are exposed to the browser
- Never put sensitive keys in frontend environment variables

#### Step 3: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Copy your Vercel URL: `https://your-app.vercel.app`

#### Step 4: Update Backend CORS

Go back to Railway → Backend → Variables:
- Update `FRONTEND_URL` to your Vercel deployment URL
- Click "Redeploy" to apply changes

---

### Post-Deployment Verification

#### Test Critical Features:

1. **✅ Backend Health Check**
   ```bash
   curl https://your-backend.railway.app/health
   ```

2. **✅ Frontend Loads**
   - Open `https://your-app.vercel.app`
   - Check browser console for errors

3. **✅ User Authentication**
   - Register a new account
   - Login with credentials
   - Verify token refresh works

4. **✅ Core Features**
   - Castle list loads
   - Assessment questions appear
   - Can submit answers
   - Leaderboards display
   - No RLS (Row Level Security) errors in Network tab

5. **✅ Check Deployment Logs**
   - Railway: Service → Deployments → View Logs
   - Vercel: Project → Deployments → Functions

---

## 5. User Guide

### 5.1. User Roles and Access

The Polegion platform supports three distinct user roles, each with specific capabilities and access levels:

**1. Student Role**
- **Primary Purpose**: Learning and skill development
- **Access Level**: Limited to student-specific features
- **Key Capabilities**:
  - Browse and access castle content
  - Take assessments and quizzes
  - Submit problem solutions
  - Join virtual rooms via room codes
  - Participate in competitions
  - View personal leaderboards and rankings
  - Track individual progress and XP

**2. Teacher Role**
- **Primary Purpose**: Classroom management and student monitoring
- **Access Level**: Administrative features for room and competition management
- **Key Capabilities**:
  - Create and manage virtual rooms
  - Design custom competitions
  - Set problem sets for students
  - Monitor student progress in real-time
  - View class-wide analytics and reports
  - Generate room codes for student invitations
  - Export performance data

**3. Admin Role** (Optional)
- **Primary Purpose**: Full system access and platform administration
- **Access Level**: Combined student and teacher capabilities plus system controls
- **Key Capabilities**:
  - All student features (can test learning paths)
  - All teacher features (can manage all rooms)
  - System-wide user management
  - Content administration
  - Platform configuration

**Role Comparison Table:**

| Feature | Student | Teacher | Admin |
|---------|---------|---------|-------|
| View Castles & Chapters | ✅ | ❌ | ✅ |
| Take Assessments | ✅ | ❌ | ✅ |
| Submit Problem Solutions | ✅ | ❌ | ✅ |
| Join Virtual Rooms | ✅ | ❌ | ✅ |
| Create Virtual Rooms | ❌ | ✅ | ✅ |
| Design Competitions | ❌ | ✅ | ✅ |
| View Student Progress | Own Only | All Students | All Students |
| Access Analytics Dashboard | ❌ | ✅ | ✅ |
| Manage Platform Content | ❌ | ❌ | ✅ |
| User Administration | ❌ | ❌ | ✅ |

### 5.2. Sample Credentials

**Pre-configured Demo Accounts:**

For testing and demonstration purposes, use these pre-configured accounts:

#### 1. **Student Account**
- **Purpose**: Access learning content, complete challenges, compete in leaderboards
- **Registration**: `/student/auth/register`
- **Login**: `/student/auth/login`
- **Sample Account**:
  ```
  Email: student.demo@polegion.com
  Password: StudentDemo2024!
  Role: student
  ```

#### 2. **Teacher Account**
- **Purpose**: Create virtual rooms, manage competitions, view student progress
- **Registration**: `/teacher/auth/register`
- **Login**: `/teacher/auth/login`
- **Sample Account**:
  ```
  Email: teacher.demo@polegion.com
  Password: TeacherDemo2024!
  Role: teacher
  ```

#### 3. **Admin Account** (Optional)
- **Purpose**: Full system access with both student and teacher capabilities
- **Note**: Admin accounts have elevated privileges
- **Sample Account**:
  ```
  Email: admin.demo@polegion.com
  Password: AdminDemo2024!
  Role: admin
  ```

### Creating Test Accounts

You can create new test accounts by:

1. **Via Registration Page**:
   - Navigate to `/auth/register`
   - Select role (Student or Teacher)
   - Fill in registration form:
     - Email (must be valid format)
     - Password (minimum 6 characters)
     - First Name
     - Last Name
     - Gender (Male/Female/Other)
     - Phone (optional)

2. **Via API** (For Development):
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "newuser@example.com",
       "password": "SecurePass123",
       "firstName": "John",
       "lastName": "Doe",
       "gender": "male",
       "phone": "+1234567890",
       "role": "student"
     }'
   ```

**Password Requirements:**
- Minimum 6 characters
- Recommended: Include uppercase, lowercase, numbers, and special characters
- Example strong password: `GeomPro2024!@`

**Security Best Practices:**
- Change default passwords after first login
- Never share admin credentials
- Use unique passwords for different accounts
- Enable two-factor authentication when available

### 5.3. Student Features

**Getting Started as a Student:**

1. **Registration and Login**
   - Navigate to `/student/auth/register`
   - Create account with email and password
   - Verify email (if email service configured)
   - Login at `/student/auth/login`

2. **Dashboard Overview**
   - View available castles and learning paths
   - See progress metrics and XP earned
   - Access recent activities and achievements
   - Check leaderboard rankings

3. **Castle Exploration**
   - Browse geometry topics organized by castle themes
   - View castle descriptions and learning objectives
   - Track completion status per castle
   - Unlock new castles upon completing prerequisites

4. **Chapter Learning**
   - Access chapter content within castles
   - Read explanations and view examples
   - Complete interactive mini-games
   - Take chapter assessments

5. **Assessment Taking**
   - **Pre-tests**: Gauge initial knowledge before starting
   - **Chapter Quizzes**: Reinforce concepts after learning
   - **Post-tests**: Measure overall mastery
   - Receive instant feedback on submissions
   - Review correct answers and explanations

6. **Problem Solving**
   - Access practice problem sets
   - Submit solutions for grading
   - View submission history
   - Track accuracy and improvement

7. **Virtual Room Participation**
   - Enter room codes provided by teachers
   - Join classroom competitions
   - Access room-specific problem sets
   - Collaborate with classmates

8. **Competition Features**
   - Participate in timed challenges
   - View real-time leaderboards
   - Track personal rankings
   - Compare performance with peers

9. **Progress Tracking**
   - Monitor XP accumulation
   - View achievement badges earned
   - Track completion percentages
   - Analyze performance trends

### 5.4. Teacher Features

**Getting Started as a Teacher:**

1. **Registration and Login**
   - Navigate to `/teacher/auth/register`
   - Create educator account
   - Login at `/teacher/auth/login`
   - Access teacher dashboard

2. **Virtual Room Management**
   - **Creating Rooms**:
     - Click "Create New Room"
     - Set room name and description
     - Configure room settings
     - Generate unique room code
   - **Managing Rooms**:
     - View list of active rooms
     - Edit room settings
     - View participant lists
     - Archive completed rooms

3. **Competition Creation**
   - **Setup Competition**:
     - Select virtual room
     - Choose problem set
     - Set time limit and difficulty
     - Configure scoring rules
   - **During Competition**:
     - Monitor active participants in real-time
     - View live leaderboard updates
     - Track submission rates
     - Address technical issues
   - **After Competition**:
     - Review final standings
     - Export results and reports
     - Share leaderboards with students
     - Archive competition data

4. **Student Progress Monitoring**
   - View individual student performance
   - Analyze class-wide statistics
   - Identify struggling students
   - Track improvement over time
   - Export performance reports

5. **Analytics Dashboard**
   - **Overview Metrics**:
     - Total students enrolled
     - Active competitions
     - Completion rates
     - Average scores
   - **Visualizations**:
     - Performance distribution charts
     - Progress trend graphs
     - Leaderboard displays
     - Participation heatmaps

6. **Content Management**
   - Access castle and chapter library
   - Review available problems
   - Create custom problem sets
   - Assign specific content to rooms

7. **Communication Tools**
   - Share room codes with students
   - Send invitations via email (if configured)
   - Post announcements
   - Provide feedback on submissions

---

## 6. Project Structure

### 6.1. Directory Organization

The Polegion project follows a monorepo structure with clear separation between frontend and backend:

```
Polegion/
├── frontend/                  # Next.js frontend application
├── backend/                   # Express.js backend application
├── docs/                      # Documentation and guides
├── package.json              # Root package.json for workspace scripts
└── README.md                 # This documentation file
```

### 6.2. Frontend Structure

**Next.js 15 Application with App Router:**

```
frontend/
├── app/                      # Next.js 15 App Router (pages & layouts)
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Home page
│   ├── student/             # Student-specific routes
│   │   ├── auth/           # Student authentication pages
│   │   ├── dashboard/      # Student dashboard
│   │   ├── castles/        # Castle browsing and chapters
│   │   ├── assessments/    # Assessment taking interface
│   │   └── rooms/          # Virtual room participation
│   ├── teacher/             # Teacher-specific routes
│   │   ├── auth/           # Teacher authentication pages
│   │   ├── dashboard/      # Teacher dashboard
│   │   ├── rooms/          # Virtual room management
│   │   ├── competitions/   # Competition management
│   │   └── analytics/      # Student progress analytics
│   └── auth/                # General authentication pages
│
├── components/               # Reusable React components
│   ├── ui/                  # Base UI components (buttons, inputs, cards)
│   ├── layout/              # Layout components (header, footer, sidebar)
│   ├── forms/               # Form components
│   ├── castles/             # Castle-specific components
│   ├── assessments/         # Assessment UI components
│   ├── leaderboards/        # Leaderboard displays
│   └── shared/              # Shared utility components
│
├── api/                      # API client functions and hooks
│   ├── auth.ts              # Authentication API calls
│   ├── castles.ts           # Castle-related API calls
│   ├── assessments.ts       # Assessment API calls
│   ├── rooms.ts             # Virtual room API calls
│   └── competitions.ts      # Competition API calls
│
├── store/                    # Zustand state management
│   ├── authStore.ts         # Authentication state
│   ├── userStore.ts         # User profile state
│   ├── castleStore.ts       # Castle data state
│   └── competitionStore.ts  # Competition state
│
├── types/                    # TypeScript type definitions
│   ├── user.ts              # User-related types
│   ├── castle.ts            # Castle and chapter types
│   ├── assessment.ts        # Assessment types
│   └── api.ts               # API response types
│
├── hooks/                    # Custom React hooks
│   ├── useAuth.ts           # Authentication hook
│   ├── useApi.ts            # API calling hook
│   └── useRealtime.ts       # Real-time subscription hook
│
├── lib/                      # Utility libraries
│   ├── supabase.ts          # Supabase client configuration
│   ├── axios.ts             # Axios instance with interceptors
│   └── validators.ts        # Input validation utilities
│
├── styles/                   # CSS modules and global styles
│   ├── globals.css          # Global styles and Tailwind imports
│   └── [component].module.css  # Component-specific styles
│
├── public/                   # Static assets
│   ├── images/              # Image assets
│   ├── icons/               # Icon files
│   └── animations/          # Lottie animation files
│
├── schemas/                  # Validation schemas (Yup)
│   ├── authSchema.ts        # Authentication form schemas
│   └── assessmentSchema.ts  # Assessment validation schemas
│
├── scripts/                  # Build and utility scripts
├── constants/                # Application constants
├── context/                  # React context providers
├── utils/                    # Utility functions
│
├── next.config.js           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── package.json             # Frontend dependencies
└── .env.local               # Frontend environment variables (not in git)
```

**Key Frontend Directories:**

- **`app/`**: Next.js App Router with file-based routing
- **`components/`**: Modular, reusable React components
- **`api/`**: Centralized API communication layer
- **`store/`**: Global state management with Zustand
- **`types/`**: TypeScript interfaces and type definitions
- **`hooks/`**: Custom React hooks for shared logic

### 6.3. Backend Structure

**Express.js Application with Clean Architecture:**

```
backend/
├── presentation/             # HTTP layer (routes, controllers, middleware)
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── castleController.js
│   │   ├── assessmentController.js
│   │   ├── roomController.js
│   │   ├── competitionController.js
│   │   └── leaderboardController.js
│   │
│   ├── routes/              # API route definitions
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── castleRoutes.js
│   │   ├── assessmentRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── competitionRoutes.js
│   │   └── index.js         # Route aggregation
│   │
│   └── middleware/          # Express middleware
│       ├── authMiddleware.js      # JWT verification
│       ├── roleMiddleware.js      # Role-based access control
│       ├── validationMiddleware.js # Request validation
│       ├── errorHandler.js        # Global error handling
│       └── rateLimiter.js         # Rate limiting
│
├── application/              # Business logic layer
│   ├── services/            # Business logic services
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── castleService.js
│   │   ├── assessmentService.js
│   │   ├── roomService.js
│   │   ├── competitionService.js
│   │   └── leaderboardService.js
│   │
│   ├── services.js          # Service container/registry
│   └── cache.js             # Response caching logic
│
├── domain/                   # Business domain layer
│   └── models/              # Domain models and entities
│       ├── User.js
│       ├── Castle.js
│       ├── Assessment.js
│       └── Competition.js
│
├── infrastructure/           # External services and data access
│   ├── repository/          # Data access layer
│   │   ├── userRepository.js
│   │   ├── castleRepository.js
│   │   ├── assessmentRepository.js
│   │   └── competitionRepository.js
│   │
│   ├── migrations/          # Database migration scripts
│   │   └── [timestamp]_migration_name.sql
│   │
│   └── seeds/               # Database seed data
│       └── initial_data.sql
│
├── config/                   # Configuration files
│   ├── supabase.js          # Supabase client configuration
│   ├── jwt.js               # JWT configuration
│   └── swagger.js           # Swagger/OpenAPI configuration
│
├── utils/                    # Utility functions
│   ├── GoogleAuth.js        # Google OAuth helper
│   ├── Mailer.js            # Email sending utility
│   ├── logger.js            # Logging utility
│   └── validators.js        # Input validation
│
├── views/                    # Template views (Handlebars)
│   └── invite.handlebars    # Email invitation template
│
├── server.js                 # Express server entry point
├── container.js              # Dependency injection container
├── package.json              # Backend dependencies
├── Procfile                  # Heroku deployment configuration
└── .env                      # Backend environment variables (not in git)
```

**Backend Architecture Layers:**

1. **Presentation Layer** (`presentation/`):
   - Handles HTTP requests and responses
   - Route definitions and middleware
   - Input validation and error handling

2. **Application Layer** (`application/`):
   - Business logic implementation
   - Service orchestration
   - Caching strategies

3. **Domain Layer** (`domain/`):
   - Core business models
   - Domain-specific logic
   - Business rules enforcement

4. **Infrastructure Layer** (`infrastructure/`):
   - Database access via repositories
   - External service integrations
   - Data persistence logic

**Key Backend Patterns:**

- **Clean Architecture**: Separation of concerns across layers
- **Dependency Injection**: Via `container.js`
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic encapsulation
- **Middleware Chain**: Request processing pipeline

---

## 7. API Documentation

### 7.1. Authentication Endpoints

**Base URL:**
- Development: `http://localhost:5000/api`
- Production: `https://your-backend.railway.app/api`

**Authentication Flow:**

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

**User Registration:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "gender": "male",
  "phone": "+1234567890",
  "role": "student"  // or "teacher"
}

Response 201:
{
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**User Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response 200:
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Token Refresh:**
```http
POST /api/auth/refresh
Authorization: Bearer <current_token>

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

**Logout:**
```http
POST /api/auth/logout
Authorization: Bearer <token>

Response 200:
{
  "message": "Logout successful"
}
```

### 7.2. Core API Routes

**Castle Endpoints:**

```http
# Get all castles
GET /api/castles
Authorization: Bearer <token>

Response 200:
{
  "castles": [
    {
      "id": "uuid",
      "name": "Castle of Basic Shapes",
      "description": "Introduction to geometry fundamentals",
      "order": 1,
      "isLocked": false
    }
  ]
}

# Get castle details with chapters
GET /api/castles/:castleId
Authorization: Bearer <token>

Response 200:
{
  "castle": {
    "id": "uuid",
    "name": "Castle of Basic Shapes",
    "chapters": [
      {
        "id": "uuid",
        "title": "Introduction to Points and Lines",
        "order": 1,
        "isCompleted": false
      }
    ]
  }
}
```

**Assessment Endpoints:**

```http
# Get assessment questions
GET /api/assessments/:assessmentId/questions
Authorization: Bearer <token>

Response 200:
{
  "questions": [
    {
      "id": "uuid",
      "questionText": "What is the sum of angles in a triangle?",
      "type": "multiple_choice",
      "options": ["90°", "180°", "270°", "360°"],
      "points": 10
    }
  ]
}

# Submit assessment answers
POST /api/assessments/:assessmentId/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": [
    {
      "questionId": "uuid",
      "answer": "180°"
    }
  ]
}

Response 200:
{
  "score": 85,
  "totalPoints": 100,
  "correctAnswers": 17,
  "totalQuestions": 20,
  "passed": true
}
```

**Virtual Room Endpoints:**

```http
# Create virtual room (Teacher only)
POST /api/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Geometry Class 2024",
  "description": "First semester geometry",
  "capacity": 30
}

Response 201:
{
  "room": {
    "id": "uuid",
    "name": "Geometry Class 2024",
    "roomCode": "ABC123",
    "teacherId": "uuid"
  }
}

# Join room (Student)
POST /api/rooms/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "roomCode": "ABC123"
}

Response 200:
{
  "message": "Successfully joined room",
  "room": {
    "id": "uuid",
    "name": "Geometry Class 2024"
  }
}
```

**Competition Endpoints:**

```http
# Create competition (Teacher only)
POST /api/competitions
Authorization: Bearer <token>
Content-Type: application/json

{
  "roomId": "uuid",
  "title": "Chapter 1 Challenge",
  "problemSetId": "uuid",
  "duration": 3600,  // seconds
  "startTime": "2024-12-20T10:00:00Z"
}

Response 201:
{
  "competition": {
    "id": "uuid",
    "title": "Chapter 1 Challenge",
    "status": "scheduled"
  }
}

# Get leaderboard
GET /api/competitions/:competitionId/leaderboard
Authorization: Bearer <token>

Response 200:
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "uuid",
      "name": "John Doe",
      "score": 950,
      "problemsSolved": 19,
      "timeSpent": 2845
    }
  ]
}
```

**Student Progress Endpoints:**

```http
# Get student progress
GET /api/students/:studentId/progress
Authorization: Bearer <token>

Response 200:
{
  "progress": {
    "totalXP": 1500,
    "castlesCompleted": 3,
    "chaptersCompleted": 15,
    "assessmentsPassed": 12,
    "averageScore": 87.5
  }
}
```

### 7.3. Interactive API Explorer

**Swagger UI Documentation:**

When the backend server is running, access comprehensive interactive API documentation:

- **Local Development**: http://localhost:5000/api-docs
- **Production**: https://your-backend.railway.app/api-docs

**Features:**
- 📖 Complete endpoint documentation
- 🧪 Try-it-out functionality for testing
- 📋 Request/response schema references
- 🔐 Built-in authentication testing
- 💾 Export OpenAPI/Swagger specification

**Using Swagger UI:**

1. Navigate to the API docs URL
2. Click "Authorize" button
3. Enter your JWT token: `Bearer <your_token>`
4. Expand any endpoint to view details
5. Click "Try it out" to test the endpoint
6. Fill in parameters and request body
7. Click "Execute" to send the request
8. View the response below

**API Response Codes:**

- `200 OK`: Successful request
- `201 Created`: Resource successfully created
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server-side error

---

## 8. Troubleshooting

### 8.1. Common Issues

**Issue 1: CORS Errors in Browser Console**

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 
'http://localhost:3000' has been blocked by CORS policy
```

**Solutions:**
1. Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
2. Ensure both frontend and backend servers are running
3. Check that CORS middleware is properly configured in backend
4. Clear browser cache and cookies
5. Try in incognito/private browsing mode

**Fix:**
```bash
# Backend .env
FRONTEND_URL=http://localhost:3000  # Must match exactly

# Restart backend server
cd backend
npm run dev
```

**Issue 2: Authentication Failures / Token Errors**

**Symptoms:**
- "Invalid token" or "Token expired" errors
- Automatic logout after page refresh
- 401 Unauthorized responses

**Solutions:**
1. **Verify Supabase Keys**:
   - Backend uses SERVICE ROLE KEY
   - Frontend uses ANON KEY (different keys!)
   - Check keys in Supabase Dashboard → Settings → API

2. **Check JWT Secret**:
   - Ensure `JWT_SECRET` in backend `.env` is set
   - Must be at least 32 characters long
   - Same secret must be used consistently

3. **Token Expiration**:
   - Tokens expire after 1 hour by default
   - Implement token refresh logic
   - Clear localStorage and re-login

**Fix:**
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to backend/.env
JWT_SECRET=<generated_secret>
```

**Issue 3: Database Connection Issues**

**Symptoms:**
- "Cannot connect to Supabase" errors
- RLS policy errors in network tab
- Empty data responses

**Solutions:**
1. **Verify Supabase Configuration**:
   ```bash
   # Check Supabase URL format
   SUPABASE_URL=https://xxx.supabase.co  # Must include https://
   ```

2. **Check RLS Policies**:
   - Ensure all RLS migration scripts have been run
   - Verify service role has bypass RLS permissions
   - Check policy configurations in Supabase Dashboard

3. **Run Missing Migrations**:
   ```sql
   -- In Supabase SQL Editor
   -- Run: docs/sql/DATABASE_COMPLETE_SCHEMA.sql
   -- Run: docs/sql/FIX_ASSESSMENT_RLS_FOR_BACKEND.sql
   ```

**Issue 4: Build Failures**

**Symptoms:**
- "Module not found" errors
- TypeScript compilation errors
- Dependency resolution failures

**Solutions:**
1. **Clean Install**:
   ```bash
   # Remove all node_modules
   rm -rf node_modules frontend/node_modules backend/node_modules
   
   # Remove lock files
   rm package-lock.json frontend/package-lock.json backend/package-lock.json
   
   # Reinstall
   npm run install-all
   ```

2. **Check Node Version**:
   ```bash
   node --version  # Should be 20.x or higher
   ```

3. **Clear Build Cache**:
   ```bash
   # Frontend
   cd frontend
   rm -rf .next
   npm run build
   
   # Backend (no build step, but clear cache)
   cd backend
   rm -rf .cache
   ```

**Issue 5: Port Already in Use**

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

**Windows:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port
# In backend/.env
PORT=5001
```

**Issue 6: Environment Variables Not Loading**

**Symptoms:**
- `undefined` values for environment variables
- Configuration errors on startup

**Solutions:**
1. **Check File Names**:
   - Backend: `.env` (not `.env.local`)
   - Frontend: `.env.local` (not `.env`)

2. **Verify File Location**:
   - Backend `.env` must be in `backend/` directory
   - Frontend `.env.local` must be in `frontend/` directory

3. **Restart Servers**:
   - Changes to `.env` files require server restart
   - Kill and restart both servers

4. **Check Variable Names**:
   - Frontend variables must start with `NEXT_PUBLIC_`
   - Backend variables have no prefix

### 8.2. Debugging Tips

**Enable Debug Logging:**

**Backend:**
```javascript
// In server.js or relevant file
console.log('Environment:', process.env.NODE_ENV);
console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Frontend URL:', process.env.FRONTEND_URL);
```

**Frontend:**
```typescript
// In any component
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

**Check API Responses:**

Use browser DevTools Network tab:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by XHR/Fetch
4. Click on any request to view details
5. Check Response tab for error messages

**Test Backend Independently:**

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test authentication (should get error)
curl http://localhost:5000/api/castles

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Database Query Testing:**

In Supabase SQL Editor:
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Test user query
SELECT * FROM users LIMIT 5;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'users';
```

### 8.3. Support Resources

**Documentation:**
- [Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md)
- [Environment Variables Guide](docs/DEPLOYMENT_ENV_VARS.md)
- [Project Documentation](docs/PROJECT_DOCUMENTATION.md)
- [Production Debugging](docs/PRODUCTION_DEBUGGING.md)
- [Login Troubleshooting](docs/LOGIN_TROUBLESHOOTING.md)

**External Resources:**
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)

**Getting Help:**

1. **Check Logs**:
   - Railway: Service → Deployments → View Logs
   - Vercel: Project → Deployments → Functions
   - Local: Check terminal output

2. **Review Error Messages**:
   - Read the full error stack trace
   - Look for specific error codes
   - Check line numbers in stack trace

3. **Search Documentation**:
   - Use the docs/ folder in this repository
   - Check framework-specific docs
   - Search for specific error messages

4. **Contact Development Team**:
   - For critical issues or bugs
   - For deployment assistance
   - For feature requests

---

## 9. Appendices

### 9.1. Additional Documentation

**Complete Documentation Set:**

1. **Setup and Installation**:
   - [README.md](README.md) - This file (comprehensive guide)
   - [DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md) - Step-by-step deployment verification
   - [DEPLOYMENT_ENV_VARS.md](docs/DEPLOYMENT_ENV_VARS.md) - Complete environment variable reference

2. **Development Guides**:
   - [PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md) - Detailed project specifications
   - [CSS_ARCHITECTURE_GUIDE.md](docs/CSS_ARCHITECTURE_GUIDE.md) - Styling conventions
   - [PITCH_PRESENTATION.md](docs/PITCH_PRESENTATION.md) - Project overview presentation

3. **Troubleshooting**:
   - [PRODUCTION_DEBUGGING.md](docs/PRODUCTION_DEBUGGING.md) - Production issue resolution
   - [LOGIN_TROUBLESHOOTING.md](docs/LOGIN_TROUBLESHOOTING.md) - Authentication problems
   - [ASSESSMENT_RLS_FIX.md](docs/ASSESSMENT_RLS_FIX.md) - Database security fixes
   - [FIX_PROBLEM_SUBMISSION_RLS_ERROR.md](docs/FIX_PROBLEM_SUBMISSION_RLS_ERROR.md) - Submission issues

4. **Feature Documentation**:
   - [PROBLEM_GRADING_IMPLEMENTATION.md](docs/PROBLEM_GRADING_IMPLEMENTATION.md) - Grading system
   - [REALTIME_IMPLEMENTATION_COMPLETE.md](docs/REALTIME_IMPLEMENTATION_COMPLETE.md) - Real-time features
   - [TERMS_AND_CONDITIONS_IMPLEMENTATION.md](docs/TERMS_AND_CONDITIONS_IMPLEMENTATION.md) - Legal compliance

5. **Performance**:
   - [PERFORMANCE_OPTIMIZATION.md](PERFORMANCE_OPTIMIZATION.md) - Speed improvements
   - [OPTIMIZATION_AND_COMPLIANCE_AUDIT.md](OPTIMIZATION_AND_COMPLIANCE_AUDIT.md) - Code quality

6. **Academic**:
   - [ACM_PAPER_RECOMMENDATIONS.md](docs/ACM_PAPER_RECOMMENDATIONS.md) - Research references
   - [PRETEST_ANALYSIS_DEC18_2025.md](docs/PRETEST_ANALYSIS_DEC18_2025.md) - Assessment analytics
   - [SAMPLE_PROBLEMS.md](docs/SAMPLE_PROBLEMS.md) - Example problem sets

7. **Database**:
   - SQL scripts in [docs/sql/](docs/sql/) directory
   - Migration files for schema updates
   - Seed data for development

### 9.2. License Information

**License:** Proprietary and Confidential

This project and its source code are proprietary and confidential. All rights reserved.

**Copyright © 2024-2025 Polegion Development Team**

**Restrictions:**
- ❌ No public distribution or sharing
- ❌ No commercial use without authorization
- ❌ No modification or derivative works
- ❌ No reverse engineering

**Permitted Use:**
- ✅ Educational purposes within the development team
- ✅ Academic evaluation by instructors
- ✅ Portfolio demonstration (with permission)
- ✅ Internal development and testing

**Disclaimer:**

This software is provided "as is" without warranty of any kind, express or implied. The developers assume no responsibility for any damages arising from the use of this software.

### 9.3. Acknowledgments

**Development Team:**

**Project Name**: Polegion - Interactive Geometry Learning Platform  
**Repository**: PTMAbellana/Polegion  
**Institution**: BSCS-3, Second Semester, Software Engineering Course  
**Academic Year**: 2024-2025

**Course Information:**
- **Course**: Software Engineering
- **Semester**: Second Semester
- **Program**: Bachelor of Science in Computer Science (BSCS-3)

**Technologies & Frameworks:**

We acknowledge and thank the open-source community for the following technologies that made this project possible:

- **Next.js** by Vercel - React framework
- **React** by Meta - UI library
- **Express.js** - Backend framework
- **Supabase** - Backend-as-a-Service platform
- **TailwindCSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Database system
- **Node.js** - JavaScript runtime

**Third-Party Services:**
- **Railway** - Backend hosting platform
- **Vercel** - Frontend hosting platform
- **GitHub** - Version control and collaboration

**Special Thanks:**
- Course instructors and teaching assistants
- Beta testers and early users
- All contributors to the open-source libraries used

**Contact Information:**

For inquiries, support, or collaboration opportunities:
- **Repository**: https://github.com/PTMAbellana/Polegion
- **Issues**: https://github.com/PTMAbellana/Polegion/issues

---

**Last Updated**: December 19, 2025  
**Version**: 1.0.0  
**Document Revision**: 2.0

---

<div align="center">

**🎮 Polegion - Making Geometry Education Engaging and Interactive 🎮**

*Built with ❤️ by the Polegion Development Team*

</div>
