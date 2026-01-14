# Mobile Web Component Development (Coursework 2)

## Implementation of Type Model

### Overview

The DKN Platform (Digital Knowledge Network) implements a comprehensive Type Model system using TypeScript interfaces and Mongoose schemas. The system consists of six core models that represent the business entities and their relationships, ensuring type safety, data validation, and proper database structure.

### Model Architecture

The Type Model follows a hierarchical structure with clear relationships:

```
User (Base Entity)
├── KnowledgeResource (Created by User)
│   ├── KnowledgeKeyword (Many-to-Many relationship)
│   └── AIKnowledgeAnalysis (Analyzed by AI)
│
DKNPlatform (Platform Configuration)
└── AIModule (Belongs to Platform)
    └── AIKnowledgeAnalysis (Uses AI Module)
```

### User Model Implementation

The User model serves as the foundation for the authentication and authorization system, supporting six distinct user roles with role-specific attributes.

**File Location:** `lib/db/models/User.ts`

**TypeScript Interface Definition:**
```typescript
export type UserRole = 
  | 'consultant' 
  | 'validator' 
  | 'governance' 
  | 'executive' 
  | 'controller' 
  | 'staff';

export interface IUser extends Document {
  unique_user_id: string;
  full_name: string;
  email: string;
  division: string;
  role: UserRole;
  password: string;
  last_login_at?: Date;
  
  // Role-specific fields
  specialisation_field?: string; // consultant
  assigned_project?: string; // consultant
  approved_submissions?: number; // validator
  compliance_score?: number; // governance (0-100)
  inspection_interval?: string; // governance
  privilege_level?: string; // executive
  control_tier?: number; // controller (1-5)
  access_rights?: string[]; // controller
  training_phase?: string; // staff
  
  matchPassword(enteredPassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}
```

**Figure 1: User Model TypeScript Interface**

**Mongoose Schema Implementation:**
```typescript
const userSchema = new Schema<IUser>(
  {
    unique_user_id: {
      type: String,
      required: true,
      unique: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    division: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['consultant', 'validator', 'governance', 'executive', 'controller', 'staff'],
      default: 'staff',
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    // Role-specific fields with validation
    compliance_score: {
      type: Number,
      min: 0,
      max: 100,
    },
    control_tier: {
      type: Number,
      min: 1,
      max: 5,
    },
    // ... additional fields
  },
  {
    timestamps: true,
  }
);
```

**Figure 2: User Model Mongoose Schema**

**Key Features:**
- Password hashing using bcrypt (pre-save hook)
- Email validation using regex pattern
- Role-based field validation
- Automatic timestamp management
- Password comparison method for authentication

### KnowledgeResource Model Implementation

The KnowledgeResource model represents the core knowledge content within the platform, implementing a state machine for the approval workflow.

**File Location:** `lib/db/models/KnowledgeResource.ts`

**TypeScript Interface:**
```typescript
export type ApprovalState = 'Pending' | 'Approved' | 'Rejected' | 'Authorized';

export interface IKnowledgeResource extends Document {
  resource_id: string;
  heading: string;
  data_body: string;
  approval_state: ApprovalState;
  classification: string;
  revision_number: number;
  user_rating: number; // 0-5
  access_count: number;
  created_by: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

**Figure 3: KnowledgeResource Model Interface**

**Mongoose Schema:**
```typescript
const knowledgeResourceSchema = new Schema<IKnowledgeResource>(
  {
    resource_id: {
      type: String,
      required: true,
      unique: true,
      default: () => `RES-${Date.now()}`,
    },
    approval_state: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Authorized'],
      default: 'Pending',
    },
    user_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    revision_number: {
      type: Number,
      default: 0,
      min: 0,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // ... additional fields
  },
  {
    timestamps: true,
  }
);
```

**Figure 4: KnowledgeResource Model Schema**

### KnowledgeKeyword Model Implementation

The KnowledgeKeyword model enables many-to-many relationships between knowledge resources and keywords, facilitating advanced search capabilities.

**File Location:** `lib/db/models/KnowledgeKeyword.ts`

**Implementation:**
```typescript
const knowledgeKeywordSchema = new Schema<IKnowledgeKeyword>(
  {
    knowledge_resource_id: {
      type: Schema.Types.ObjectId,
      ref: 'KnowledgeResource',
      required: true,
    },
    keyword: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
knowledgeKeywordSchema.index({ knowledge_resource_id: 1, keyword: 1 });
```

**Figure 5: KnowledgeKeyword Model with Compound Index**

### DKNPlatform Model Implementation

The DKNPlatform model tracks platform-level metrics and configuration.

**File Location:** `lib/db/models/DKNPlatform.ts`

**Implementation:**
```typescript
const dknPlatformSchema = new Schema<IDKNPlatform>(
  {
    platform_id: {
      type: String,
      required: true,
      unique: true,
      default: () => `PLATFORM-${Date.now()}`,
    },
    release_version: {
      type: String,
      required: true,
      default: '1.0.0',
    },
    registered_users: {
      type: Number,
      default: 0,
    },
    stored_knowledge_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
```

**Figure 6: DKNPlatform Model Schema**

### AIModule Model Implementation

The AIModule model represents AI analysis modules within the platform.

**File Location:** `lib/db/models/AIModule.ts`

**Implementation:**
```typescript
const aiModuleSchema = new Schema<IAIModule>(
  {
    module_id: {
      type: String,
      required: true,
      unique: true,
      default: () => `AI-${Date.now()}`,
    },
    algorithm_type: {
      type: String,
      required: true,
    },
    performance_index: {
      type: Number,
      default: 0,
    },
    platform_id: {
      type: Schema.Types.ObjectId,
      ref: 'DKNPlatform',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
```

**Figure 7: AIModule Model Schema**

### AIKnowledgeAnalysis Model Implementation

The AIKnowledgeAnalysis model stores analysis results from AI modules for knowledge resources.

**File Location:** `lib/db/models/AIKnowledgeAnalysis.ts`

**Implementation:**
```typescript
const aiKnowledgeAnalysisSchema = new Schema<IAIKnowledgeAnalysis>(
  {
    ai_module_id: {
      type: Schema.Types.ObjectId,
      ref: 'AIModule',
      required: true,
    },
    knowledge_resource_id: {
      type: Schema.Types.ObjectId,
      ref: 'KnowledgeResource',
      required: true,
    },
    analysis_score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    recommendations: [String],
    tags: [String],
    popularity_score: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
aiKnowledgeAnalysisSchema.index({ knowledge_resource_id: 1, ai_module_id: 1 });
```

**Figure 8: AIKnowledgeAnalysis Model with Compound Index**

### Model Relationships Summary

The following table summarizes the relationships between models:

| Model | Primary Key | Foreign Keys | Indexes | Validation Rules |
|-------|-------------|--------------|---------|------------------|
| User | unique_user_id | - | email (unique) | Password min 6 chars, email regex |
| KnowledgeResource | resource_id | created_by → User | resource_id (unique) | Rating 0-5, revision ≥ 0 |
| KnowledgeKeyword | _id | knowledge_resource_id → KnowledgeResource | Compound (resource_id, keyword) | - |
| DKNPlatform | platform_id | - | platform_id (unique) | - |
| AIModule | module_id | platform_id → DKNPlatform | module_id (unique) | - |
| AIKnowledgeAnalysis | _id | ai_module_id → AIModule, knowledge_resource_id → KnowledgeResource | Compound (resource_id, ai_module_id) | Score 0-100 |

**Figure 9: Model Relationships Summary Table**

---

## Implementation for UI with REST API Connectivity

### Overview

The DKN Platform implements a modern React-based UI using Next.js 14 App Router, connected to server-side components via RESTful API endpoints. The architecture follows a client-server pattern with clear separation of concerns, ensuring maintainability and scalability.

### Architecture

The system architecture demonstrates a three-tier structure:

```
┌─────────────────────────────────┐
│   Client-Side (React/Next.js)   │
│   - UI Components               │
│   - State Management            │
│   - User Interactions            │
└──────────────┬──────────────────┘
               │ HTTP REST API
               │ (JSON)
               ▼
┌─────────────────────────────────┐
│   Server-Side (Next.js API)    │
│   - Authentication              │
│   - Business Logic               │
│   - Data Validation             │
└──────────────┬──────────────────┘
               │ Mongoose ODM
               ▼
┌─────────────────────────────────┐
│   MongoDB Database              │
│   - Data Storage                │
│   - Relationships               │
└─────────────────────────────────┘
```

**Figure 10: System Architecture Diagram**

### REST API Endpoints

#### Authentication APIs

**POST /api/auth/register**
- **Purpose:** Register new user
- **Request Body:**
```json
{
  "unique_user_id": "USER001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "division": "Engineering",
  "role": "consultant"
}
```
- **Response:** `201 Created` with user object

**POST /api/auth/[...nextauth]**
- **Purpose:** NextAuth login endpoint
- **Response:** JWT session token

**Figure 11: Authentication API Endpoints**

#### Knowledge Resource APIs

**GET /api/knowledge**
- **Purpose:** List knowledge resources with filtering
- **Query Parameters:** keyword, classification, approval_state, page, limit
- **Response:** Paginated list of resources with keywords

**POST /api/knowledge**
- **Purpose:** Create new knowledge resource
- **Request Body:** heading, data_body, classification, keywords
- **Response:** Created resource object

**GET /api/knowledge/[id]**
- **Purpose:** Get single knowledge resource
- **Response:** Resource with populated creator and keywords

**PUT /api/knowledge/[id]**
- **Purpose:** Update knowledge resource
- **Response:** Updated resource

**DELETE /api/knowledge/[id]**
- **Purpose:** Delete knowledge resource
- **Response:** Success message

**POST /api/knowledge/[id]/approve**
- **Purpose:** Approve resource (Validator only)

**POST /api/knowledge/[id]/reject**
- **Purpose:** Reject resource (Validator only)

**POST /api/knowledge/[id]/authorize**
- **Purpose:** Authorize resource (Governance only)

**Figure 12: Knowledge Resource API Endpoints**

#### User Management APIs

**GET /api/users**
- **Purpose:** List all users (Controller only)
- **Response:** Array of user objects (password excluded)

**POST /api/users**
- **Purpose:** Create new user (Controller only)
- **Request Body:** User object with role-specific fields
- **Response:** Created user object

**GET /api/users/me**
- **Purpose:** Get current authenticated user
- **Response:** Current user object

**Figure 13: User Management API Endpoints**

#### Platform & AI APIs

**GET /api/platform/stats**
- **Purpose:** Get platform statistics
- **Response:** Platform metrics including user count, knowledge count, operational time

**GET /api/ai/modules**
- **Purpose:** List all AI modules
- **Response:** Array of AI modules with performance metrics

**POST /api/ai/analyze/[resourceId]**
- **Purpose:** Trigger AI analysis for a resource
- **Response:** Analysis results

**Figure 14: Platform & AI API Endpoints**

### UI Component Implementation

#### User Management Page

**File Location:** `app/(dashboard)/dashboard/controller/users/page.tsx`

**Key Implementation:**
```typescript
const fetchUsers = async () => {
  try {
    setLoading(true);
    setError("");
    const response = await fetch("/api/users");
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to fetch users");
    }

    const data = await response.json();
    setUsers(data.users || []);
  } catch (err: any) {
    setError(err.message || "An error occurred while fetching users");
  } finally {
    setLoading(false);
  }
};

const handleCreateUser = async (e: React.FormEvent) => {
  e.preventDefault();
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  // ... error handling and state updates
};
```

**Figure 15: User Management Component - API Integration**

**UI Features:**
- Real-time user list display
- Create user modal with role-specific fields
- Role badges with color coding
- Form validation and error handling
- Automatic list refresh after creation

**Figure 16: User Management Interface Screenshot**

#### Knowledge Resource List Page

**File Location:** `app/knowledge/page.tsx`

**Implementation:**
```typescript
const fetchResources = async () => {
  const params = new URLSearchParams();
  if (selectedState) params.append('approval_state', selectedState);
  if (selectedClassification) params.append('classification', selectedClassification);
  if (searchKeyword) params.append('keyword', searchKeyword);
  
  const response = await fetch(`/api/knowledge?${params.toString()}`);
  const data = await response.json();
  setResources(data.resources || []);
};
```

**Figure 17: Knowledge Resource List - API Integration**

**UI Features:**
- Filter by approval state
- Filter by classification
- Keyword search functionality
- Pagination support
- Resource cards with status badges

**Figure 18: Knowledge Resource List Interface Screenshot**

#### Knowledge Creation Page

**File Location:** `app/knowledge/create/page.tsx`

**Implementation:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const keywords = formData.keywords
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0);

  const response = await fetch("/api/knowledge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      heading: formData.heading,
      data_body: formData.data_body,
      classification: formData.classification,
      keywords: keywords,
    }),
  });
  // ... handle response
};
```

**Figure 19: Knowledge Creation - API Integration**

**UI Features:**
- Form validation
- Keyword input (comma-separated)
- Classification selection
- Rich text content area
- Success/error feedback

**Figure 20: Knowledge Creation Interface Screenshot**

#### Validator Dashboard

**File Location:** `app/(dashboard)/dashboard/validator/page.tsx`

**Implementation:**
```typescript
const handleApprove = async (resourceId: string) => {
  const response = await fetch(`/api/knowledge/${resourceId}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  fetchPendingResources(); // Refresh list
};
```

**Figure 21: Validator Dashboard - Approval Action**

**UI Features:**
- Pending resources queue
- Approve/Reject buttons
- Resource preview
- Approval statistics

**Figure 22: Validator Dashboard Interface Screenshot**

### API Connectivity Pattern

All UI components follow a consistent pattern for API connectivity:

1. **State Management:**
   - `useState` for data, loading, and error states
   - `useEffect` for initial data fetching

2. **API Calls:**
   - Use native `fetch` API
   - Include authentication headers (handled by NextAuth)
   - Handle errors gracefully

3. **Error Handling:**
   - Try-catch blocks
   - User-friendly error messages
   - Loading states during requests

4. **Data Flow:**
   ```
   Component Mount
        ↓
   useEffect Hook
        ↓
   Fetch API Call
        ↓
   Update State
        ↓
   Re-render UI
   ```

**Figure 23: API Connectivity Pattern Flowchart**

### Authentication Integration

**NextAuth Session Provider:**
```typescript
// components/providers/AuthProvider.tsx
"use client";
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

**Using Session in Components:**
```typescript
import { useSession } from "next-auth/react";

export default function MyComponent() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  // API calls automatically include session token
}
```

**Figure 24: Authentication Integration Code**

---

## Non-Functional Requirements

### Performance

#### Overview

The performance of the DKN Platform Knowledge Management System stands as a cornerstone of its design, ensuring that users worldwide, regardless of their geographical locations and varying data speeds, encounter an optimal and consistent user experience. Performance benchmarks have been meticulously established to guarantee that the system delivers unparalleled responsiveness with minimal latency.

#### Global Accessibility

Recognizing the diverse global footprint of organizations using the DKN Platform, the system is architected to transcend geographical boundaries. Whether accessed from high-speed metropolitan locations or areas with lower bandwidth availability, the design prioritizes a uniform and efficient performance.

#### Responsiveness Metrics

Performance benchmarks encompass a spectrum of responsiveness metrics, including but not limited to:

- **Page Load Times:** Optimized Next.js server-side rendering ensures initial page loads under 2 seconds
- **Data Retrieval Speed:** MongoDB indexes and efficient queries ensure API response times under 500ms
- **Real-time Updates:** State management and API polling provide near-instantaneous UI updates
- **Database Query Optimization:** Compound indexes on frequently queried fields reduce query execution time

**Figure 25: Performance Metrics Dashboard**

#### Scalability

The system's architecture is engineered to scale seamlessly, accommodating a growing user base and an expanding volume of knowledge-related data. Scalability ensures that performance remains robust even as usage patterns evolve, and the system undergoes increased demands over time.

**Key Scalability Features:**
- MongoDB Atlas cloud database for horizontal scaling
- Next.js serverless functions for automatic scaling
- Efficient database indexing for query performance
- Pagination for large data sets

**Figure 26: Scalability Architecture Diagram**

### Security

#### Security Protocols

Security is paramount in safeguarding the sensitive knowledge information and user data entrusted to the DKN Platform Knowledge Management System. The implementation adheres to multi-layered security protocols, employing a defense-in-depth strategy to fortify the system against potential threats and vulnerabilities.

#### User Authentication

User authentication is a fundamental security measure, ensuring that only authorized individuals gain access to the system. Robust authentication mechanisms, including secure password policies and JWT-based session management, are implemented to validate user identities.

**Authentication Features:**
- Password hashing using bcrypt with 10 salt rounds
- JWT token-based session management
- Secure password storage (never stored in plain text)
- Session expiration and refresh mechanisms

**Figure 27: Authentication Flow Diagram**

#### Access Control

Access control mechanisms are in place to delineate and enforce user permissions. Role-based access control (RBAC) ensures that each user, based on their role within the system, is granted appropriate access privileges. Fine-grained access controls enable administrators to tailor permissions with precision.

**Role-Based Permissions:**
- **Consultant:** Create and manage own knowledge resources
- **Validator:** Approve/reject pending resources
- **Governance:** Authorize approved resources
- **Executive:** View analytics and reports (read-only)
- **Controller:** Full system administration
- **Staff:** View authorized resources only

**Figure 28: Role-Based Access Control Matrix**

#### Data Validation

All API endpoints implement comprehensive input validation to prevent injection attacks and ensure data integrity:

- **Schema Validation:** Mongoose schema validation for all database operations
- **Type Safety:** TypeScript ensures type checking at compile time
- **Input Sanitization:** All user inputs are validated and sanitized
- **SQL Injection Prevention:** MongoDB ODM prevents SQL injection attacks

**Figure 29: Security Validation Flow**

---

## Deployment

Deployment in software development means getting a software ready for use by people, involving tasks like sharing the code, setting up configurations, and preparing servers so that the application can be used by the intended audience.

### Back End Deployment

The deployment process for the Next.js application involves utilizing Vercel, a platform that provides hosting services for Next.js applications. This entails configuring and setting up the Next.js application on the Vercel platform, ensuring that all necessary files, dependencies, and configurations are properly in place.

**Deployment Steps:**

1. **Build Configuration:**
   - Next.js automatically detects the framework
   - Build command: `npm run build`
   - Output directory: `.next`
   - Install command: `npm install`

2. **Environment Variables:**
   - MongoDB connection string
   - NextAuth secret and URL
   - JWT secret
   - Node environment settings

3. **Database Configuration:**
   - MongoDB Atlas cluster setup
   - Connection string configuration
   - IP whitelist configuration
   - Database initialization

4. **Deployment Process:**
   - Connect GitHub repository to Vercel
   - Configure build settings
   - Set environment variables
   - Deploy application
   - Verify deployment status

**Figure 30: Vercel Deployment Dashboard**

**Figure 31: Back End Server Configuration**

### Front End Deployment

The deployment process for the front-end Next.js components involves leveraging Vercel, a cloud platform designed for deploying and hosting Next.js applications. This encompasses configuring and setting up the Next.js components on the Vercel platform, where they are transformed into a production-ready build.

**Front End Deployment Features:**
- **Automatic Deployments:** Continuous integration and automatic deployments on git push
- **Server-Side Rendering:** Next.js SSR capabilities for optimal performance
- **Static Asset Optimization:** Automatic optimization of images and assets
- **CDN Distribution:** Global CDN for fast content delivery
- **SSL Certificates:** Automatic HTTPS encryption

**Figure 32: Front End Deployment Server Info**

**Figure 33: Vercel Deployment Status**

### Alternative Deployment Options

#### Docker Deployment

For containerized deployment, a Dockerfile can be used:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Figure 34: Dockerfile Configuration**

#### Traditional Server Deployment

For traditional server deployment:
- Deploy to Node.js hosting (AWS, DigitalOcean, etc.)
- Use PM2 for process management
- Set up reverse proxy (Nginx)
- Configure SSL certificates

**Figure 35: Traditional Server Deployment Architecture**

### Database Deployment

**MongoDB Atlas Configuration:**
- Cloud-hosted MongoDB cluster
- Automatic backups and replication
- Connection string management
- IP whitelist configuration
- Database user management

**Figure 36: MongoDB Atlas Dashboard**

**Database Initialization:**
```bash
npm run init-db
```

This script creates:
- 6 sample users (one per role)
- Platform configuration
- Sample knowledge resources
- AI modules
- Initial data setup

**Figure 37: Database Initialization Script**

### Conclusion

In conclusion, the deployment of the Next.js application on the Vercel platform and the MongoDB database on MongoDB Atlas has successfully made both the back end and front-end of the web application accessible to users, providing a seamless and reliable online experience. This deployment ensures the efficient functioning of the application, allowing users to interact with its features and content with ease.

The integrated deployment approach, where both front-end and back-end are deployed together as a full-stack Next.js application, simplifies the deployment process and ensures consistency across the application stack.

---

## References

1. Next.js Documentation (2024) *Next.js Deployment*, Vercel. Available at: https://nextjs.org/docs/deployment (Accessed: [Date]).

2. MongoDB Atlas (2024) *MongoDB Atlas Documentation*, MongoDB. Available at: https://www.mongodb.com/docs/atlas/ (Accessed: [Date]).

3. Mongoose Documentation (2024) *Mongoose Guide*, Mongoose. Available at: https://mongoosejs.com/docs/guide.html (Accessed: [Date]).

4. NextAuth.js Documentation (2024) *NextAuth.js Getting Started*, NextAuth.js. Available at: https://next-auth.js.org/getting-started/introduction (Accessed: [Date]).

5. TypeScript Documentation (2024) *TypeScript Handbook*, Microsoft. Available at: https://www.typescriptlang.org/docs/handbook/intro.html (Accessed: [Date]).

6. React Documentation (2024) *React Documentation*, Meta. Available at: https://react.dev/ (Accessed: [Date]).

7. Cheesman, John., & Daniels, John. (2001). *UML Components, A Simple Process for Specifying Component-Based Software*. Pearson Education Corporation Sales Division.

8. Evans, E. (2003). *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley.

---

## Appendices

### Appendix A: Postman API Testing

**Figure 38: Postman - GET /api/users Request**

**Figure 39: Postman - POST /api/knowledge Request**

**Figure 40: Postman - GET /api/knowledge Response**

**Figure 41: Postman - POST /api/knowledge/[id]/approve Request**

**Figure 42: Postman - GET /api/platform/stats Response**

### Appendix B: Backend Dependencies

**Figure 43: package.json - Dependencies List**

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "mongoose": "^8.0.3",
    "next-auth": "^4.24.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4",
    "recharts": "^2.10.3",
    "lucide-react": "^0.344.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.2.0",
    "tsx": "^4.7.0"
  }
}
```

**Figure 44: Complete Dependency List**

### Appendix C: Type Model Source Code

**Figure 45: User Model Complete Code (lib/db/models/User.ts)**

**Figure 46: KnowledgeResource Model Complete Code (lib/db/models/KnowledgeResource.ts)**

**Figure 47: KnowledgeKeyword Model Complete Code (lib/db/models/KnowledgeKeyword.ts)**

**Figure 48: DKNPlatform Model Complete Code (lib/db/models/DKNPlatform.ts)**

**Figure 49: AIModule Model Complete Code (lib/db/models/AIModule.ts)**

**Figure 50: AIKnowledgeAnalysis Model Complete Code (lib/db/models/AIKnowledgeAnalysis.ts)**

### Appendix D: REST API Route Source Code

**Figure 51: Users API Route (app/api/users/route.ts)**

**Figure 52: Knowledge API Route (app/api/knowledge/route.ts)**

**Figure 53: Knowledge by ID API Route (app/api/knowledge/[id]/route.ts)**

**Figure 54: Platform Stats API Route (app/api/platform/stats/route.ts)**

**Figure 55: AI Modules API Route (app/api/ai/modules/route.ts)**

### Appendix E: UI Component Source Code

**Figure 56: User Management Page (app/(dashboard)/dashboard/controller/users/page.tsx)**

**Figure 57: Knowledge List Page (app/knowledge/page.tsx)**

**Figure 58: Knowledge Creation Page (app/knowledge/create/page.tsx)**

**Figure 59: Validator Dashboard (app/(dashboard)/dashboard/validator/page.tsx)**

**Figure 60: Consultant Dashboard (app/(dashboard)/dashboard/consultant/page.tsx)**

### Appendix F: Application Screenshots

**Figure 61: Application Home Page**

**Figure 62: Login Page**

**Figure 63: User Registration Page**

**Figure 64: Controller Dashboard - User Management**

**Figure 65: Consultant Dashboard - Knowledge Creation**

**Figure 66: Validator Dashboard - Pending Resources**

**Figure 67: Governance Dashboard - Authorization**

**Figure 68: Executive Dashboard - Analytics**

**Figure 69: Staff Dashboard - Authorized Resources**

**Figure 70: Knowledge Resource Detail Page**

**Figure 71: Knowledge Resource Edit Page**

**Figure 72: Platform Statistics Display**

### Appendix G: Database Screenshots

**Figure 73: MongoDB Atlas - Database Collections**

**Figure 74: MongoDB Atlas - Users Collection**

**Figure 75: MongoDB Atlas - KnowledgeResources Collection**

**Figure 76: MongoDB Atlas - KnowledgeKeywords Collection**

**Figure 77: MongoDB Atlas - DKNPlatforms Collection**

**Figure 78: MongoDB Atlas - AIModules Collection**

**Figure 79: MongoDB Atlas - AIKnowledgeAnalyses Collection**

### Appendix H: Deployment Screenshots

**Figure 80: Vercel Deployment Dashboard**

**Figure 81: Vercel Build Logs**

**Figure 82: Vercel Environment Variables Configuration**

**Figure 83: Vercel Domain Configuration**

**Figure 84: Application Running on Production URL**

---

**End of Report**


