# Coursework 2 - Implementation Report

## DKN Platform (Digital Knowledge Network)

**Student Name:** [Your Name]  
**Course:** Mobile Web Components  
**Date:** [Current Date]

---

## Table of Contents

1. [Implementation of Type Model](#1-implementation-of-type-model)
2. [Implementation for UI with REST API Connectivity](#2-implementation-for-ui-with-rest-api-connectivity)
3. [Deployment](#3-deployment)
4. [Conclusion](#conclusion)

---

## 1. Implementation of Type Model

### 1.1 Overview

The DKN Platform implements a comprehensive Type Model system using TypeScript interfaces and Mongoose schemas. The system consists of 6 core models that represent the business entities and their relationships.

### 1.2 Model Architecture

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

### 1.3 Model Implementations

#### 1.3.1 User Model

**File:** `lib/db/models/User.ts`

**TypeScript Interface:**

```typescript
export type UserRole =
  | "consultant"
  | "validator"
  | "governance"
  | "executive"
  | "controller"
  | "staff";

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
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    division: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: [
        "consultant",
        "validator",
        "governance",
        "executive",
        "controller",
        "staff",
      ],
      default: "staff",
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    last_login_at: {
      type: Date,
      default: null,
    },
    // Role-specific fields
    specialisation_field: String,
    assigned_project: String,
    approved_submissions: { type: Number, default: 0 },
    compliance_score: { type: Number, min: 0, max: 100 },
    inspection_interval: String,
    privilege_level: String,
    control_tier: { type: Number, min: 1, max: 5 },
    access_rights: [String],
    training_phase: String,
  },
  {
    timestamps: true,
  }
);
```

**Key Features:**

- Password hashing using bcrypt (pre-save hook)
- Password comparison method
- Email validation using regex
- Role-based field validation
- Automatic timestamps

**Diagram:**

```
┌─────────────────────────────────┐
│           User Model            │
├─────────────────────────────────┤
│ unique_user_id: string (PK)     │
│ full_name: string               │
│ email: string (unique)          │
│ division: string                 │
│ role: UserRole (enum)            │
│ password: string (hashed)        │
│ last_login_at: Date?             │
│                                 │
│ Role-Specific Fields:           │
│ ├─ consultant:                  │
│ │  ├─ specialisation_field      │
│ │  └─ assigned_project          │
│ ├─ validator:                   │
│ │  └─ approved_submissions      │
│ ├─ governance:                  │
│ │  ├─ compliance_score (0-100)  │
│ │  └─ inspection_interval       │
│ ├─ executive:                   │
│ │  └─ privilege_level           │
│ ├─ controller:                  │
│ │  ├─ control_tier (1-5)        │
│ │  └─ access_rights[]           │
│ └─ staff:                       │
│    └─ training_phase            │
│                                 │
│ Methods:                        │
│ └─ matchPassword()              │
│                                 │
│ Timestamps:                     │
│ ├─ createdAt                    │
│ └─ updatedAt                    │
└─────────────────────────────────┘
```

---

#### 1.3.2 KnowledgeResource Model

**File:** `lib/db/models/KnowledgeResource.ts`

**TypeScript Interface:**

```typescript
export type ApprovalState = "Pending" | "Approved" | "Rejected" | "Authorized";

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

**Mongoose Schema Implementation:**

```typescript
const knowledgeResourceSchema = new Schema<IKnowledgeResource>(
  {
    resource_id: {
      type: String,
      required: true,
      unique: true,
      default: () => `RES-${Date.now()}`,
    },
    heading: {
      type: String,
      required: true,
    },
    data_body: {
      type: String,
      required: true,
    },
    approval_state: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Authorized"],
      default: "Pending",
    },
    classification: {
      type: String,
      required: true,
    },
    revision_number: {
      type: Number,
      default: 0,
      min: 0,
    },
    user_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    access_count: {
      type: Number,
      default: 0,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
```

**Key Features:**

- Auto-generated resource_id
- State machine for approval workflow
- Reference to User model
- Rating validation (0-5)
- Revision tracking
- Access count tracking

---

#### 1.3.3 KnowledgeKeyword Model

**File:** `lib/db/models/KnowledgeKeyword.ts`

**TypeScript Interface:**

```typescript
export interface IKnowledgeKeyword extends Document {
  knowledge_resource_id: mongoose.Types.ObjectId;
  keyword: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Mongoose Schema Implementation:**

```typescript
const knowledgeKeywordSchema = new Schema<IKnowledgeKeyword>(
  {
    knowledge_resource_id: {
      type: Schema.Types.ObjectId,
      ref: "KnowledgeResource",
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

**Key Features:**

- Many-to-many relationship with KnowledgeResource
- Compound index for query optimization
- Enables keyword-based search

---

#### 1.3.4 DKNPlatform Model

**File:** `lib/db/models/DKNPlatform.ts`

**TypeScript Interface:**

```typescript
export interface IDKNPlatform extends Document {
  platform_id: string;
  release_version: string;
  operational_time: number; // in seconds
  registered_users: number;
  stored_knowledge_count: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Mongoose Schema Implementation:**

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
      default: "1.0.0",
    },
    operational_time: {
      type: Number,
      default: 0,
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

**Key Features:**

- Platform-level metrics tracking
- Auto-updated user and knowledge counts
- Version tracking

---

#### 1.3.5 AIModule Model

**File:** `lib/db/models/AIModule.ts`

**TypeScript Interface:**

```typescript
export interface IAIModule extends Document {
  module_id: string;
  algorithm_type: string;
  performance_index: number;
  model_updated_on: Date;
  platform_id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

**Mongoose Schema Implementation:**

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
    model_updated_on: {
      type: Date,
      default: Date.now,
    },
    platform_id: {
      type: Schema.Types.ObjectId,
      ref: "DKNPlatform",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
```

**Key Features:**

- Reference to DKNPlatform
- Performance tracking
- Auto-generated module_id

---

#### 1.3.6 AIKnowledgeAnalysis Model

**File:** `lib/db/models/AIKnowledgeAnalysis.ts`

**TypeScript Interface:**

```typescript
export interface IAIKnowledgeAnalysis extends Document {
  ai_module_id: mongoose.Types.ObjectId;
  knowledge_resource_id: mongoose.Types.ObjectId;
  analysis_score: number;
  recommendations?: string[];
  tags?: string[];
  popularity_score?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Mongoose Schema Implementation:**

```typescript
const aiKnowledgeAnalysisSchema = new Schema<IAIKnowledgeAnalysis>(
  {
    ai_module_id: {
      type: Schema.Types.ObjectId,
      ref: "AIModule",
      required: true,
    },
    knowledge_resource_id: {
      type: Schema.Types.ObjectId,
      ref: "KnowledgeResource",
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

**Key Features:**

- Many-to-many relationship between AI Modules and Knowledge Resources
- Compound index for query optimization
- Score validation (0-100)

---

### 1.4 Model Relationships Diagram

```
┌─────────────┐
│    User     │
│             │
│ _id (PK)    │
└──────┬──────┘
       │
       │ 1:N
       │
       ▼
┌─────────────────────┐
│ KnowledgeResource   │
│                     │
│ _id (PK)            │
│ created_by (FK)     │
└──────┬──────────────┘
       │
       │ 1:N                    │ 1:N
       │                        │
       ▼                        ▼
┌──────────────────┐   ┌──────────────────────┐
│ KnowledgeKeyword │   │ AIKnowledgeAnalysis │
│                  │   │                      │
│ resource_id (FK) │   │ resource_id (FK)     │
│ keyword          │   │ ai_module_id (FK)    │
└──────────────────┘   └──────────┬───────────┘
                                   │
                                   │ N:1
                                   │
                                   ▼
                          ┌─────────────────┐
                          │   AIModule      │
                          │                 │
                          │ _id (PK)        │
                          │ platform_id(FK) │
                          └────────┬────────┘
                                   │
                                   │ N:1
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  DKNPlatform    │
                          │                 │
                          │ _id (PK)        │
                          └─────────────────┘
```

---

### 1.5 Type Model Summary

| Model               | Primary Key    | Foreign Keys                                                       | Indexes                              | Validation Rules                  |
| ------------------- | -------------- | ------------------------------------------------------------------ | ------------------------------------ | --------------------------------- |
| User                | unique_user_id | -                                                                  | email (unique)                       | Password min 6 chars, email regex |
| KnowledgeResource   | resource_id    | created_by → User                                                  | resource_id (unique)                 | Rating 0-5, revision ≥ 0          |
| KnowledgeKeyword    | \_id           | knowledge_resource_id → KnowledgeResource                          | Compound (resource_id, keyword)      | -                                 |
| DKNPlatform         | platform_id    | -                                                                  | platform_id (unique)                 | -                                 |
| AIModule            | module_id      | platform_id → DKNPlatform                                          | module_id (unique)                   | -                                 |
| AIKnowledgeAnalysis | \_id           | ai_module_id → AIModule, knowledge_resource_id → KnowledgeResource | Compound (resource_id, ai_module_id) | Score 0-100                       |

---

## 2. Implementation for UI with REST API Connectivity

### 2.1 Overview

The DKN Platform implements a modern React-based UI using Next.js 14 App Router, connected to server-side components via RESTful API endpoints. The architecture follows a client-server pattern with clear separation of concerns.

### 2.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Client-Side (UI)                     │
├─────────────────────────────────────────────────────────┤
│  React Components (Next.js Pages)                       │
│  ├─ Dashboard Pages                                     │
│  ├─ Knowledge Management Pages                          │
│  ├─ User Management Pages                               │
│  └─ Authentication Pages                                 │
│                                                         │
│  State Management:                                      │
│  ├─ React Hooks (useState, useEffect)                  │
│  ├─ NextAuth Session Management                        │
│  └─ Fetch API for HTTP Requests                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP REST API
                     │ (JSON)
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Server-Side (API Routes)                │
├─────────────────────────────────────────────────────────┤
│  Next.js API Routes (app/api/*/route.ts)               │
│  ├─ Authentication & Authorization                      │
│  ├─ Business Logic                                      │
│  ├─ Data Validation                                     │
│  └─ Database Operations                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Mongoose ODM
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    MongoDB Database                     │
└─────────────────────────────────────────────────────────┘
```

---

### 2.3 REST API Endpoints

#### 2.3.1 Authentication APIs

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

- **Response:** `201 Created` with user object (password excluded)

**POST /api/auth/[...nextauth]**

- **Purpose:** NextAuth login endpoint
- **Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response:** JWT session token

---

#### 2.3.2 Knowledge Resource APIs

**GET /api/knowledge**

- **Purpose:** List knowledge resources with filtering
- **Query Parameters:**
  - `keyword`: Search by keyword
  - `classification`: Filter by classification
  - `approval_state`: Filter by state (Pending/Approved/Rejected/Authorized)
  - `created_by`: Filter by creator ID
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Response:**

```json
{
  "resources": [
    {
      "_id": "...",
      "resource_id": "RES-1234567890",
      "heading": "Sample Knowledge",
      "data_body": "Content...",
      "approval_state": "Pending",
      "classification": "Technical",
      "keywords": ["keyword1", "keyword2"],
      "created_by": {
        "full_name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

**POST /api/knowledge**

- **Purpose:** Create new knowledge resource
- **Request Body:**

```json
{
  "heading": "New Knowledge",
  "data_body": "Content here...",
  "classification": "Technical",
  "keywords": ["tag1", "tag2"]
}
```

- **Response:** `201 Created` with created resource

**GET /api/knowledge/[id]**

- **Purpose:** Get single knowledge resource
- **Response:** Resource object with populated creator and keywords

**PUT /api/knowledge/[id]**

- **Purpose:** Update knowledge resource
- **Request Body:** Partial resource object
- **Response:** Updated resource

**DELETE /api/knowledge/[id]**

- **Purpose:** Delete knowledge resource
- **Response:** `200 OK` with success message

**POST /api/knowledge/[id]/approve**

- **Purpose:** Approve resource (Validator only)
- **Response:** Updated resource with "Approved" state

**POST /api/knowledge/[id]/reject**

- **Purpose:** Reject resource (Validator only)
- **Response:** Updated resource with "Rejected" state

**POST /api/knowledge/[id]/authorize**

- **Purpose:** Authorize resource (Governance only)
- **Response:** Updated resource with "Authorized" state

---

#### 2.3.3 User Management APIs

**GET /api/users**

- **Purpose:** List all users (Controller only)
- **Response:**

```json
{
  "users": [
    {
      "_id": "...",
      "unique_user_id": "USER001",
      "full_name": "John Doe",
      "email": "john@example.com",
      "role": "consultant",
      "division": "Engineering"
    }
  ]
}
```

**POST /api/users**

- **Purpose:** Create new user (Controller only)
- **Request Body:** User object with role-specific fields
- **Response:** `201 Created` with user object

**GET /api/users/me**

- **Purpose:** Get current authenticated user
- **Response:** Current user object

---

#### 2.3.4 Platform & AI APIs

**GET /api/platform/stats**

- **Purpose:** Get platform statistics
- **Response:**

```json
{
  "platform": {
    "platform_id": "PLATFORM-1",
    "release_version": "1.0.0",
    "registered_users": 50,
    "stored_knowledge_count": 200,
    "operational_time": 86400
  }
}
```

**GET /api/ai/modules**

- **Purpose:** List all AI modules
- **Response:** Array of AI modules with performance metrics

**POST /api/ai/analyze/[resourceId]**

- **Purpose:** Trigger AI analysis for a resource
- **Response:** Analysis results

---

### 2.4 UI Implementation Examples

#### 2.4.1 User Management Page

**File:** `app/(dashboard)/dashboard/controller/users/page.tsx`

**Key Features:**

- Fetches users from `/api/users` endpoint
- Displays users in a table format
- Create user modal with form
- Role-specific field handling
- Real-time updates after creation

**Code Example - Fetching Users:**

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
    console.error("Error fetching users:", err);
    setError(err.message || "An error occurred while fetching users");
  } finally {
    setLoading(false);
  }
};
```

**Code Example - Creating User:**

```typescript
const handleCreateUser = async (e: React.FormEvent) => {
  e.preventDefault();
  setCreateError("");
  setCreating(true);

  try {
    const userData: any = {
      unique_user_id: formData.unique_user_id,
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
      division: formData.division,
      role: formData.role,
    };

    // Add role-specific fields
    if (formData.role === "consultant") {
      if (formData.specialisation_field)
        userData.specialisation_field = formData.specialisation_field;
      if (formData.assigned_project)
        userData.assigned_project = formData.assigned_project;
    }
    // ... other role-specific fields

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create user");
    }

    // Reset form and refresh list
    setShowCreateForm(false);
    fetchUsers();
  } catch (err: any) {
    setCreateError(err.message || "An error occurred while creating user");
  } finally {
    setCreating(false);
  }
};
```

**UI Screenshot Description:**

- Table displaying user ID, name, email, role, division, and creation date
- "Create User" button opens modal form
- Role badges with color coding
- Form dynamically shows role-specific fields based on selected role

---

#### 2.4.2 Knowledge Resource List Page

**File:** `app/knowledge/page.tsx`

**Key Features:**

- Fetches knowledge resources from `/api/knowledge`
- Supports filtering by state, classification, and keyword search
- Pagination support
- Displays resources with approval state badges

**Code Example - Fetching with Filters:**

```typescript
const fetchResources = async () => {
  try {
    setLoading(true);

    // Build query parameters
    const params = new URLSearchParams();
    if (selectedState) params.append("approval_state", selectedState);
    if (selectedClassification)
      params.append("classification", selectedClassification);
    if (searchKeyword) params.append("keyword", searchKeyword);
    params.append("page", currentPage.toString());
    params.append("limit", "10");

    const response = await fetch(`/api/knowledge?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch resources");
    }

    const data = await response.json();
    setResources(data.resources || []);
    setPagination(data.pagination);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

#### 2.4.3 Knowledge Creation Page

**File:** `app/knowledge/create/page.tsx`

**Key Features:**

- Form for creating new knowledge resources
- POST request to `/api/knowledge`
- Keyword input (comma-separated)
- Validation and error handling

**Code Example:**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  setError("");

  try {
    // Parse keywords
    const keywords = formData.keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create resource");
    }

    // Redirect to resource page
    router.push(`/knowledge/${data.resource._id}`);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setSubmitting(false);
  }
};
```

---

#### 2.4.4 Validator Dashboard

**File:** `app/(dashboard)/dashboard/validator/page.tsx`

**Key Features:**

- Lists pending resources
- Approve/Reject actions
- POST requests to `/api/knowledge/[id]/approve` and `/api/knowledge/[id]/reject`

**Code Example - Approve Action:**

```typescript
const handleApprove = async (resourceId: string) => {
  try {
    const response = await fetch(`/api/knowledge/${resourceId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to approve");
    }

    // Refresh the list
    fetchPendingResources();
  } catch (err: any) {
    alert(err.message);
  }
};
```

---

### 2.5 API Connectivity Pattern

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

---

### 2.6 Authentication Integration

**NextAuth Session Provider:**

```typescript
// components/providers/AuthProvider.tsx
"use client";
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

**Using Session in Components:**

```typescript
import { useSession } from "next-auth/react";

export default function MyComponent() {
  const { data: session } = useSession();

  // Session contains user info including role
  const userRole = (session?.user as any)?.role;

  // API calls automatically include session token
  const response = await fetch("/api/knowledge");
}
```

---

### 2.7 UI Component Structure

```
app/
├── (auth)/
│   ├── login/page.tsx          → POST /api/auth/[...nextauth]
│   └── register/page.tsx       → POST /api/auth/register
│
├── (dashboard)/
│   └── dashboard/
│       ├── consultant/page.tsx  → GET/POST /api/knowledge
│       ├── validator/page.tsx  → GET /api/knowledge, POST /api/knowledge/[id]/approve
│       ├── governance/page.tsx  → GET /api/knowledge, POST /api/knowledge/[id]/authorize
│       ├── executive/page.tsx  → GET /api/platform/stats
│       ├── controller/
│       │   ├── page.tsx         → GET /api/platform/stats
│       │   └── users/page.tsx   → GET/POST /api/users
│       └── staff/page.tsx       → GET /api/knowledge?approval_state=Authorized
│
└── knowledge/
    ├── page.tsx                 → GET /api/knowledge
    ├── create/page.tsx          → POST /api/knowledge
    └── [id]/
        ├── page.tsx             → GET /api/knowledge/[id]
        └── edit/page.tsx        → PUT /api/knowledge/[id]
```

---

## 3. Deployment

### 3.1 Deployment Overview

The DKN Platform is deployed as a Next.js application with MongoDB Atlas as the database backend. The deployment follows a modern cloud-based architecture.

### 3.2 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                       │
│                  (User Interface)                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js Application Server                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Frontend (React Components)                      │  │
│  │  - Dashboard Pages                                │  │
│  │  - Knowledge Management                           │  │
│  │  - User Interface                                 │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Backend (API Routes)                            │  │
│  │  - REST API Endpoints                            │  │
│  │  - Authentication (NextAuth)                      │  │
│  │  - Business Logic                                 │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ MongoDB Driver
                     ▼
┌─────────────────────────────────────────────────────────┐
│              MongoDB Atlas (Cloud Database)             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Collections:                                     │  │
│  │  - users                                          │  │
│  │  - knowledgeresources                             │  │
│  │  - knowledgekeywords                              │  │
│  │  - dknplatforms                                   │  │
│  │  - aimodules                                       │  │
│  │  - aiknowledgeanalyses                            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

### 3.3 Deployment Components

#### 3.3.1 Frontend Components

**1. Next.js Application**

- **Framework:** Next.js 14.2.0
- **Runtime:** Node.js 18+
- **Build Tool:** Next.js built-in bundler
- **Output:** Server-side rendered (SSR) and static pages

**2. React Components**

- **Library:** React 18.3.0
- **Type System:** TypeScript 5.3.3
- **Styling:** Tailwind CSS 3.4.1
- **Icons:** Lucide React 0.344.0

**3. Client-Side Libraries**

- **Charts:** Recharts 2.10.3 (for Executive dashboard)
- **Utilities:** clsx, tailwind-merge, class-variance-authority

---

#### 3.3.2 Backend Components

**1. API Server**

- **Framework:** Next.js API Routes
- **Authentication:** NextAuth.js 4.24.5
- **Session:** JWT tokens
- **Password Hashing:** bcryptjs 2.4.3

**2. Database Layer**

- **ODM:** Mongoose 8.0.3
- **Database:** MongoDB Atlas (Cloud)
- **Connection:** MongoDB connection string

**3. Server Utilities**

- **Validation:** Zod 3.22.4
- **JWT:** jsonwebtoken 9.0.2

---

#### 3.3.3 Database Components

**1. MongoDB Atlas**

- **Type:** Cloud-hosted MongoDB
- **Collections:** 6 collections as per schema
- **Indexes:** Unique indexes and compound indexes for optimization

**2. Database Models**

- User model with role-based fields
- KnowledgeResource model with approval workflow
- KnowledgeKeyword model for tagging
- DKNPlatform model for platform metrics
- AIModule model for AI configuration
- AIKnowledgeAnalysis model for analysis results

---

### 3.4 Deployment Steps

#### Step 1: Environment Setup

**Prerequisites:**

- Node.js 18+ installed
- MongoDB Atlas account
- Git (for version control)

**Installation:**

```bash
# Clone or navigate to project directory
cd CollegeProject

# Install dependencies
npm install
```

---

#### Step 2: Database Configuration

**MongoDB Atlas Setup:**

1. Create MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Whitelist IP addresses
5. Update connection string in `lib/db/connect.ts`

**Database Initialization:**

```bash
# Run initialization script
npm run init-db
```

This script:

- Creates 6 sample users (one per role)
- Creates platform configuration
- Creates sample knowledge resources
- Creates AI modules
- Sets up initial data

---

#### Step 3: Environment Variables

**Create `.env.local` file:**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/CollegeProject
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-in-production
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

**Note:** For production, use secure environment variables and never commit secrets to version control.

---

#### Step 4: Build Application

**Development Build:**

```bash
npm run dev
```

**Production Build:**

```bash
# Build the application
npm run build

# Start production server
npm start
```

**Build Output:**

- `.next/` directory contains compiled application
- Static assets optimized
- Server-side code bundled
- API routes compiled

---

#### Step 5: Deployment Options

**Option 1: Vercel (Recommended for Next.js)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set environment variables
# - Deploy
```

**Option 2: Docker Deployment**

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Option 3: Traditional Server**

- Deploy to Node.js hosting (AWS, DigitalOcean, etc.)
- Use PM2 for process management
- Set up reverse proxy (Nginx)
- Configure SSL certificates

---

### 3.5 Program Listing Explanation

#### 3.5.1 Project Structure

```
CollegeProject/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   │   └── page.tsx         # Login page component
│   │   └── register/
│   │       └── page.tsx         # Registration page component
│   │
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/
│   │   │   ├── consultant/
│   │   │   │   └── page.tsx     # Consultant dashboard
│   │   │   ├── validator/
│   │   │   │   └── page.tsx     # Validator dashboard
│   │   │   ├── governance/
│   │   │   │   └── page.tsx     # Governance dashboard
│   │   │   ├── executive/
│   │   │   │   └── page.tsx     # Executive dashboard
│   │   │   ├── controller/
│   │   │   │   ├── page.tsx     # Controller main dashboard
│   │   │   │   └── users/
│   │   │   │       └── page.tsx # User management page
│   │   │   └── staff/
│   │   │       └── page.tsx     # Staff dashboard
│   │   └── layout.tsx            # Dashboard layout wrapper
│   │
│   ├── api/                      # REST API endpoints
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts     # NextAuth endpoints
│   │   │   └── register/
│   │   │       └── route.ts     # User registration API
│   │   │
│   │   ├── knowledge/
│   │   │   ├── route.ts         # GET/POST /api/knowledge
│   │   │   └── [id]/
│   │   │       ├── route.ts     # GET/PUT/DELETE /api/knowledge/[id]
│   │   │       ├── approve/
│   │   │       │   └── route.ts # POST /api/knowledge/[id]/approve
│   │   │       ├── reject/
│   │   │       │   └── route.ts # POST /api/knowledge/[id]/reject
│   │   │       └── authorize/
│   │   │           └── route.ts # POST /api/knowledge/[id]/authorize
│   │   │
│   │   ├── users/
│   │   │   ├── route.ts         # GET/POST /api/users
│   │   │   └── me/
│   │   │       └── route.ts     # GET /api/users/me
│   │   │
│   │   ├── platform/
│   │   │   └── stats/
│   │   │       └── route.ts     # GET /api/platform/stats
│   │   │
│   │   └── ai/
│   │       ├── modules/
│   │       │   └── route.ts     # GET /api/ai/modules
│   │       └── analyze/
│   │           └── [resourceId]/
│   │               └── route.ts # POST/GET /api/ai/analyze/[resourceId]
│   │
│   ├── knowledge/                # Knowledge resource pages
│   │   ├── page.tsx             # Knowledge list page
│   │   ├── create/
│   │   │   └── page.tsx         # Create knowledge page
│   │   ├── [id]/
│   │   │   ├── page.tsx         # View knowledge page
│   │   │   └── edit/
│   │   │       └── page.tsx     # Edit knowledge page
│   │   └── layout.tsx            # Knowledge section layout
│   │
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
│
├── components/                   # Reusable React components
│   ├── providers/
│   │   └── AuthProvider.tsx     # NextAuth SessionProvider wrapper
│   └── shared/
│       ├── Header.tsx            # Navigation header component
│       └── Sidebar.tsx           # Sidebar navigation component
│
├── lib/                          # Library code
│   ├── auth/
│   │   ├── config.ts            # NextAuth configuration
│   │   └── env-init.ts          # Environment variable initialization
│   │
│   ├── db/
│   │   ├── connect.ts           # MongoDB connection utility
│   │   └── models/              # Mongoose models
│   │       ├── User.ts          # User model
│   │       ├── KnowledgeResource.ts # Knowledge resource model
│   │       ├── KnowledgeKeyword.ts  # Keyword model
│   │       ├── DKNPlatform.ts   # Platform model
│   │       ├── AIModule.ts      # AI module model
│   │       └── AIKnowledgeAnalysis.ts # AI analysis model
│   │
│   ├── utils/
│   │   ├── permissions.ts       # Permission checking utilities
│   │   └── platform-init.ts     # Platform initialization
│   │
│   └── ai/
│       └── analysis-service.ts  # AI analysis service
│
├── scripts/
│   ├── init-db.ts               # Database initialization script
│   └── verify-db.ts             # Database verification script
│
├── types/
│   └── next-auth.d.ts          # NextAuth TypeScript definitions
│
├── middleware.ts                # Next.js middleware for route protection
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

---

#### 3.5.2 Key Files Explanation

**1. Entry Point: `app/page.tsx`**

- Root page component
- Redirects to login or dashboard based on authentication status
- Entry point for the application

**2. API Routes: `app/api/*/route.ts`**

- RESTful API endpoints
- Handle HTTP methods (GET, POST, PUT, DELETE)
- Authentication and authorization checks
- Database operations
- Response formatting

**3. Database Models: `lib/db/models/*.ts`**

- Mongoose schema definitions
- TypeScript interfaces
- Validation rules
- Relationships and indexes
- Pre/post hooks (e.g., password hashing)

**4. Authentication: `lib/auth/config.ts`**

- NextAuth configuration
- Credentials provider setup
- Session management
- JWT token handling

**5. Middleware: `middleware.ts`**

- Route protection
- Authentication checks
- Role-based redirects
- Session validation

**6. Components: `components/**/\*.tsx`\*\*

- Reusable UI components
- Shared layouts
- Context providers

---

#### 3.5.3 Dependencies Explanation

**Production Dependencies:**

```json
{
  "next": "^14.2.0", // Next.js framework
  "react": "^18.3.0", // React library
  "react-dom": "^18.3.0", // React DOM rendering
  "mongoose": "^8.0.3", // MongoDB ODM
  "next-auth": "^4.24.5", // Authentication library
  "bcryptjs": "^2.4.3", // Password hashing
  "jsonwebtoken": "^9.0.2", // JWT token handling
  "zod": "^3.22.4", // Schema validation
  "recharts": "^2.10.3", // Chart library
  "lucide-react": "^0.344.0", // Icon library
  "tailwindcss": "^3.4.1" // CSS framework
}
```

**Development Dependencies:**

```json
{
  "typescript": "^5.3.3", // TypeScript compiler
  "@types/node": "^20.11.0", // Node.js type definitions
  "@types/react": "^18.2.48", // React type definitions
  "eslint": "^8.56.0", // Code linting
  "tsx": "^4.7.0" // TypeScript execution
}
```

---

#### 3.5.4 Build Process

**1. TypeScript Compilation**

- Type checking
- Interface validation
- Type safety enforcement

**2. Next.js Build**

- Page compilation
- API route bundling
- Static asset optimization
- Code splitting
- Server-side rendering setup

**3. Output Structure**

```
.next/
├── static/          # Static assets
├── server/          # Server-side code
│   ├── app/        # Compiled pages
│   └── api/        # Compiled API routes
└── cache/           # Build cache
```

---

### 3.6 Deployment Checklist

- [x] **Database Setup**

  - [x] MongoDB Atlas cluster created
  - [x] Connection string configured
  - [x] IP whitelist configured
  - [x] Database initialized with sample data

- [x] **Application Build**

  - [x] Dependencies installed
  - [x] TypeScript compilation successful
  - [x] Next.js build completed
  - [x] No build errors

- [x] **Environment Configuration**

  - [x] Environment variables set
  - [x] Secrets configured securely
  - [x] Database connection tested

- [x] **Security**

  - [x] Passwords hashed
  - [x] JWT tokens configured
  - [x] API routes protected
  - [x] Input validation implemented

- [x] **Testing**
  - [x] User registration works
  - [x] User login works
  - [x] API endpoints functional
  - [x] Role-based access working
  - [x] Knowledge workflow functional

---

### 3.7 Deployment Screenshots

**Note:** Include screenshots of:

1. Application running in browser
2. User management interface
3. Knowledge resource creation
4. Dashboard views for different roles
5. API responses (using browser DevTools)
6. Database collections in MongoDB Atlas

---

### 3.8 Access Information

**Development URL:** `http://localhost:3000`

**Default Credentials:**

- All users: Password `password123`
- Consultant: `consultant@dkn.com`
- Validator: `validator@dkn.com`
- Governance: `governance@dkn.com`
- Executive: `executive@dkn.com`
- Controller: `controller@dkn.com`
- Staff: `staff@dkn.com`

---

## Conclusion

### Summary

This coursework demonstrates a complete implementation of:

1. **Type Model Implementation (15 marks)**

   - 6 comprehensive Mongoose models with TypeScript interfaces
   - Proper relationships and indexes
   - Validation rules and constraints
   - Role-based field handling

2. **UI with REST API Connectivity (15 marks)**

   - Modern React/Next.js UI
   - Complete RESTful API implementation
   - Proper authentication and authorization
   - Real-time data fetching and updates
   - Error handling and user feedback

3. **Deployment (20 marks)**
   - Successful deployment architecture
   - Complete component listing
   - Program structure explanation
   - Build and deployment process
   - Environment configuration

### Key Achievements

- ✅ Full Type Model implementation with 6 models
- ✅ Complete REST API with 15+ endpoints
- ✅ Role-based access control system
- ✅ Multi-stage approval workflow
- ✅ Modern UI with Tailwind CSS
- ✅ Authentication and session management
- ✅ Database relationships and indexes
- ✅ Error handling and validation
- ✅ Production-ready deployment setup

### Technical Highlights

- **Type Safety:** Full TypeScript implementation
- **Security:** Password hashing, JWT tokens, role-based access
- **Performance:** Database indexes, efficient queries
- **User Experience:** Modern UI, real-time updates, error handling
- **Scalability:** Modular architecture, separation of concerns

---

**End of Report**
