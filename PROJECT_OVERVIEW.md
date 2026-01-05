# 📚 DKN Platform - Complete Project Overview

## 🎯 Project Description

**DKN Platform (Digital Knowledge Network)** is a comprehensive knowledge management system designed for organizations to create, manage, approve, and distribute knowledge resources through a structured workflow. The platform implements role-based access control with a multi-stage approval process, AI-powered analysis capabilities, and comprehensive analytics.

---

## 🏗️ Architecture & Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts/Visualization**: Recharts
- **UI Components**: Custom components with Lucide React icons

### Backend
- **Runtime**: Node.js 18+
- **API**: Next.js API Routes (RESTful)
- **Authentication**: NextAuth.js v4 (JWT-based)
- **Database**: MongoDB Atlas (Cloud)
- **ORM**: Mongoose

### Security
- **Password Hashing**: bcryptjs (10 salt rounds)
- **Session Management**: JWT tokens
- **Middleware**: Next.js middleware for route protection
- **Role-Based Access Control**: Custom permission system

---

## 👥 User Roles & Permissions

### 1. **Consultant** 👨‍💼
**Purpose**: Create and manage knowledge resources

**Capabilities**:
- Create new knowledge resources
- View own created resources
- Edit own resources
- Add keywords to resources
- View specialization field and assigned projects

**Role-Specific Fields**:
- `specialisation_field`: Area of expertise
- `assigned_project`: Current project assignment

**Dashboard Features**:
- Create knowledge form
- List of own resources
- Resource status tracking
- Edit/update capabilities

---

### 2. **Validator** ✅
**Purpose**: Review and approve/reject knowledge submissions

**Capabilities**:
- View all knowledge resources
- Approve pending resources
- Reject pending resources
- Track approved submissions count

**Role-Specific Fields**:
- `approved_submissions`: Counter for approved items

**Dashboard Features**:
- Pending resources queue
- Approve/Reject actions
- Resource review interface
- Approval statistics

---

### 3. **Governance** 🏛️
**Purpose**: Final authorization of approved content

**Capabilities**:
- View all knowledge resources
- Authorize approved resources (final step)
- View compliance metrics
- Monitor inspection intervals

**Role-Specific Fields**:
- `compliance_score`: 0-100 compliance rating
- `inspection_interval`: Frequency of inspections

**Dashboard Features**:
- Approved resources queue
- Authorization interface
- Compliance dashboard
- Inspection scheduling

---

### 4. **Executive** 📊
**Purpose**: View analytics and platform insights

**Capabilities**:
- View all knowledge resources (read-only)
- Access platform analytics
- View metrics and statistics
- Generate reports

**Role-Specific Fields**:
- `privilege_level`: Access level designation

**Dashboard Features**:
- Analytics charts (Recharts)
- Platform statistics
- User metrics
- Knowledge resource trends
- Performance indicators

---

### 5. **Controller** 🎮
**Purpose**: Full system administration

**Capabilities**:
- **ALL PERMISSIONS** (wildcard access)
- Manage all knowledge resources
- Manage all users
- Access all platform features
- Configure AI modules
- System-wide administration

**Role-Specific Fields**:
- `control_tier`: 1-5 tier level
- `access_rights`: Array of specific permissions

**Dashboard Features**:
- Complete system overview
- User management
- Platform configuration
- AI module management
- System statistics

---

### 6. **Staff** 👤
**Purpose**: Access authorized knowledge resources

**Capabilities**:
- View authorized knowledge resources only
- Access training materials
- View knowledge base

**Role-Specific Fields**:
- `training_phase`: Current training stage

**Dashboard Features**:
- Authorized resources list
- Search and filter
- Training materials
- Knowledge base access

---

## 📋 Knowledge Resource Workflow

### State Machine
```
Pending → Approved → Authorized
   ↓
Rejected (End)
```

### Workflow Steps

1. **Creation (Consultant)**
   - Consultant creates knowledge resource
   - Resource starts in `Pending` state
   - Keywords can be added
   - Classification assigned

2. **Validation (Validator)**
   - Validator reviews pending resources
   - Can **Approve** → moves to `Approved` state
   - Can **Reject** → moves to `Rejected` state (end)

3. **Authorization (Governance)**
   - Governance reviews approved resources
   - Can **Authorize** → moves to `Authorized` state (final)
   - Only authorized resources visible to Staff

4. **Consumption (Staff)**
   - Staff can only view `Authorized` resources
   - Can rate resources (0-5 stars)
   - Access count tracked

---

## 🗄️ Database Schema

### Collections

#### 1. **users**
```typescript
{
  unique_user_id: string (unique, required)
  full_name: string (required)
  email: string (unique, required, validated)
  division: string (required)
  role: UserRole (enum, required)
  password: string (hashed, min 6 chars)
  last_login_at: Date (optional)
  
  // Role-specific fields (optional)
  specialisation_field?: string
  assigned_project?: string
  approved_submissions?: number
  compliance_score?: number (0-100)
  inspection_interval?: string
  privilege_level?: string
  control_tier?: number (1-5)
  access_rights?: string[]
  training_phase?: string
  
  createdAt: Date
  updatedAt: Date
}
```

#### 2. **knowledgeresources**
```typescript
{
  resource_id: string (unique, auto-generated)
  heading: string (required)
  data_body: string (required)
  approval_state: 'Pending' | 'Approved' | 'Rejected' | 'Authorized'
  classification: string (required)
  revision_number: number (min 0, default 0)
  user_rating: number (0-5, default 0)
  access_count: number (default 0)
  created_by: ObjectId (ref: User, required)
  createdAt: Date
  updatedAt: Date
}
```

#### 3. **knowledgekeywords**
```typescript
{
  knowledge_resource_id: ObjectId (ref: KnowledgeResource)
  keyword: string (required)
  createdAt: Date
  updatedAt: Date
}
// Compound index on (knowledge_resource_id, keyword)
```

#### 4. **dknplatforms**
```typescript
{
  platform_id: string (unique, required)
  release_version: string (required, default '1.0.0')
  operational_time: number (seconds)
  registered_users: number (auto-updated)
  stored_knowledge_count: number (auto-updated)
  createdAt: Date
  updatedAt: Date
}
```

#### 5. **aimodules**
```typescript
{
  module_id: string (unique, auto-generated)
  algorithm_type: string (required)
  performance_index: number (default 0)
  model_updated_on: Date
  platform_id: ObjectId (ref: DKNPlatform, required)
  createdAt: Date
  updatedAt: Date
}
```

#### 6. **aiknowledgeanalyses**
```typescript
{
  ai_module_id: ObjectId (ref: AIModule, required)
  knowledge_resource_id: ObjectId (ref: KnowledgeResource, required)
  analysis_score: number (0-100, required)
  recommendations?: string[]
  tags?: string[]
  popularity_score?: number (0-100)
  createdAt: Date
  updatedAt: Date
}
// Compound index on (knowledge_resource_id, ai_module_id)
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth login
- `GET /api/auth/[...nextauth]` - NextAuth session check

### Knowledge Resources
- `GET /api/knowledge` - List resources (with filters: state, classification, search)
- `GET /api/knowledge/[id]` - Get single resource
- `POST /api/knowledge` - Create new resource (Consultant only)
- `PUT /api/knowledge/[id]` - Update resource (Creator or Controller)
- `DELETE /api/knowledge/[id]` - Delete resource (Creator or Controller)
- `POST /api/knowledge/[id]/approve` - Approve resource (Validator only)
- `POST /api/knowledge/[id]/reject` - Reject resource (Validator only)
- `POST /api/knowledge/[id]/authorize` - Authorize resource (Governance only)

### AI & Analysis
- `GET /api/ai/modules` - List all AI modules
- `POST /api/ai/analyze/[resourceId]` - Trigger AI analysis
- `GET /api/ai/analyze/[resourceId]` - Get analysis results

### Platform
- `GET /api/platform/stats` - Get platform statistics (users, knowledge count, operational time)

### Users
- `GET /api/users` - List all users (Controller only)
- `GET /api/users/me` - Get current authenticated user

---

## 🎨 Frontend Pages & Routes

### Public Routes
- `/` - Home (redirects to login or dashboard)
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Require Authentication)

#### Dashboard Routes
- `/dashboard` - Redirects to role-specific dashboard
- `/dashboard/consultant` - Consultant dashboard
- `/dashboard/validator` - Validator dashboard
- `/dashboard/governance` - Governance dashboard
- `/dashboard/executive` - Executive dashboard (with charts)
- `/dashboard/controller` - Controller dashboard (full admin)
- `/dashboard/staff` - Staff dashboard

#### Knowledge Routes
- `/knowledge` - Knowledge resources list
- `/knowledge/create` - Create new resource (Consultant)
- `/knowledge/[id]` - View single resource
- `/knowledge/[id]/edit` - Edit resource (Creator or Controller)

---

## 🔐 Security Features

### Authentication
- **Password Hashing**: bcryptjs with 10 salt rounds
- **Session Management**: JWT tokens via NextAuth
- **Password Validation**: Minimum 6 characters
- **Email Validation**: Regex pattern validation

### Authorization
- **Middleware Protection**: All protected routes require authentication
- **Role-Based Access**: Permission system based on user roles
- **Route Guards**: Middleware redirects based on role
- **API Protection**: All API routes check authentication and permissions

### Data Validation
- **Input Validation**: All API routes validate input
- **Schema Validation**: Mongoose schema validation
- **Type Safety**: TypeScript throughout
- **Enum Validation**: Role and state enums enforced

---

## 🤖 AI Features

### AI Modules
- **Multiple AI Modules**: Support for different algorithm types
- **Performance Tracking**: Performance index per module
- **Module Management**: Controller can manage AI modules

### AI Analysis
- **Analysis Score**: 0-100 score for knowledge resources
- **Recommendations**: AI-generated recommendations array
- **Tags**: Auto-generated tags
- **Popularity Score**: 0-100 popularity metric

### Current Implementation
- Mock AI analysis (can be replaced with real AI/ML services)
- Analysis triggered via API
- Results stored in database
- Historical analysis tracking

---

## 📊 Analytics & Metrics

### Platform Metrics
- **Registered Users**: Auto-counted from users collection
- **Stored Knowledge**: Auto-counted from knowledge resources
- **Operational Time**: Calculated from first user creation
- **Release Version**: Platform version tracking

### Executive Dashboard
- **Charts**: Recharts visualization
- **User Statistics**: User count by role
- **Knowledge Statistics**: Resources by state
- **Trend Analysis**: Growth metrics
- **Performance Indicators**: Key metrics

---

## 🛠️ Key Features

### ✅ Implemented Features

1. **User Management**
   - Registration with role selection
   - Login/Logout
   - Profile management
   - Last login tracking

2. **Knowledge Management**
   - CRUD operations
   - Multi-stage approval workflow
   - Keyword tagging
   - Classification system
   - Revision tracking
   - Rating system (0-5 stars)
   - Access count tracking

3. **Workflow Management**
   - State-based approval process
   - Role-based actions
   - Audit trail (timestamps)

4. **Search & Filter**
   - Filter by approval state
   - Filter by classification
   - Search by keywords
   - Search by heading/content

5. **Dashboard System**
   - Role-specific dashboards
   - Real-time statistics
   - Quick actions
   - Resource lists

6. **AI Integration**
   - AI module management
   - Analysis triggering
   - Analysis results storage
   - Recommendations system

7. **Platform Administration**
   - Platform metrics
   - User management (Controller)
   - System configuration

---

## 📁 Project Structure

```
CollegeProject/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/              # Dashboard routes
│   │   ├── dashboard/
│   │   │   ├── consultant/page.tsx
│   │   │   ├── validator/page.tsx
│   │   │   ├── governance/page.tsx
│   │   │   ├── executive/page.tsx
│   │   │   ├── controller/page.tsx
│   │   │   ├── staff/page.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   └── register/route.ts
│   │   ├── knowledge/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── approve/route.ts
│   │   │       ├── reject/route.ts
│   │   │       └── authorize/route.ts
│   │   ├── ai/
│   │   │   ├── modules/route.ts
│   │   │   └── analyze/[resourceId]/route.ts
│   │   ├── platform/
│   │   │   └── stats/route.ts
│   │   └── users/
│   │       ├── route.ts
│   │       └── me/route.ts
│   ├── knowledge/                # Knowledge pages
│   │   ├── page.tsx
│   │   ├── create/page.tsx
│   │   ├── [id]/page.tsx
│   │   ├── [id]/edit/page.tsx
│   │   └── layout.tsx
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── providers/
│   │   └── AuthProvider.tsx      # NextAuth SessionProvider
│   └── shared/
│       ├── Header.tsx            # Navigation header
│       └── Sidebar.tsx           # Sidebar navigation
├── lib/
│   ├── auth/
│   │   ├── config.ts             # NextAuth configuration
│   │   └── env-init.ts           # Environment variables init
│   ├── db/
│   │   ├── connect.ts           # MongoDB connection
│   │   └── models/
│   │       ├── User.ts
│   │       ├── KnowledgeResource.ts
│   │       ├── KnowledgeKeyword.ts
│   │       ├── DKNPlatform.ts
│   │       ├── AIModule.ts
│   │       └── AIKnowledgeAnalysis.ts
│   ├── utils/
│   │   ├── permissions.ts         # Permission system
│   │   └── platform-init.ts      # Platform initialization
│   └── ai/
│       └── analysis-service.ts   # AI analysis service
├── scripts/
│   └── init-db.ts                # Database initialization script
├── types/
│   └── next-auth.d.ts            # NextAuth type definitions
├── middleware.ts                 # Next.js middleware
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── CREDENTIALS.md                # Login credentials
├── SETUP_COMPLETE.md             # Setup instructions
└── README.md                      # Main documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure MongoDB**
   - MongoDB URI is hardcoded in `lib/db/connect.ts`
   - Whitelist your IP in MongoDB Atlas

3. **Initialize Database**
   ```bash
   npm run init-db
   ```
   This creates:
   - 6 users (one per role)
   - Platform configuration
   - 6 sample knowledge resources
   - 3 AI modules
   - Sample keywords and analyses

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access Application**
   - URL: http://localhost:3000
   - Login with credentials from `CREDENTIALS.md`

---

## 🔑 Default Credentials

All users have password: `password123`

| Role | Email | Dashboard |
|------|-------|-----------|
| Consultant | consultant@dkn.com | `/dashboard/consultant` |
| Validator | validator@dkn.com | `/dashboard/validator` |
| Governance | governance@dkn.com | `/dashboard/governance` |
| Executive | executive@dkn.com | `/dashboard/executive` |
| Controller | controller@dkn.com | `/dashboard/controller` |
| Staff | staff@dkn.com | `/dashboard/staff` |

---

## 🎯 Use Cases

### 1. Knowledge Creation Workflow
1. Consultant logs in
2. Creates knowledge resource with heading, content, classification
3. Adds keywords
4. Submits → Resource in "Pending" state
5. Validator reviews and approves
6. Governance authorizes
7. Staff can now view the authorized resource

### 2. Analytics & Reporting
1. Executive logs in
2. Views dashboard with charts
3. Analyzes platform metrics
4. Reviews user statistics
5. Monitors knowledge resource trends

### 3. System Administration
1. Controller logs in
2. Manages all users
3. Views all knowledge resources
4. Configures AI modules
5. Monitors platform health
6. Performs system-wide operations

---

## 🔮 Future Enhancements

- [ ] Email verification system
- [ ] Password reset functionality
- [ ] File upload capabilities
- [ ] Real AI/ML integration (OpenAI, etc.)
- [ ] Advanced analytics dashboard
- [ ] Audit logging system
- [ ] Notification system (email, in-app)
- [ ] Export functionality (PDF, CSV)
- [ ] Version control for knowledge resources
- [ ] Comments and discussions
- [ ] Bookmarking system
- [ ] Advanced search with full-text search
- [ ] Multi-language support
- [ ] Mobile responsive improvements
- [ ] Real-time collaboration
- [ ] API rate limiting
- [ ] Caching layer (Redis)

---

## 📝 Development Notes

### Hardcoded Configuration
- MongoDB URI: Hardcoded in `lib/db/connect.ts`
- NextAuth Secret: Hardcoded in `lib/auth/env-init.ts`
- NextAuth URL: Hardcoded as `http://localhost:3000`

### Environment Variables
All environment variables are set programmatically in `lib/auth/env-init.ts` to avoid requiring `.env.local` file.

### Database Initialization
Run `npm run init-db` to populate the database with sample data including users, knowledge resources, AI modules, and platform configuration.

---

## 📞 Support & Documentation

- **Main README**: `README.md`
- **Quick Start**: `QUICKSTART.md`
- **Setup Guide**: `SETUP_COMPLETE.md`
- **Credentials**: `CREDENTIALS.md`

---

## 📄 License

This project is for academic/educational purposes.

---

**Built with ❤️ using Next.js 14, TypeScript, MongoDB, and Tailwind CSS**

