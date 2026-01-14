# Mobile Web Component Development (Coursework 2)

## Implementation of Type Model

The DKN Platform (Digital Knowledge Network) implements a comprehensive Type Model system using TypeScript interfaces and Mongoose schemas. The system consists of six core models that represent the business entities and their relationships, ensuring type safety, data validation, and proper database structure.

### User Model Implementation

The User model serves as the foundation for the authentication and authorization system, supporting six distinct user roles with role-specific attributes.

**File Location:** `lib/db/models/User.ts`

**TypeScript Interface:**
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
  specialisation_field?: string;
  assigned_project?: string;
  approved_submissions?: number;
  compliance_score?: number;
  inspection_interval?: string;
  privilege_level?: string;
  control_tier?: number;
  access_rights?: string[];
  training_phase?: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}
```

**Figure 1: User Model TypeScript Interface**

**Mongoose Schema:**
```typescript
const userSchema = new Schema<IUser>({
  unique_user_id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    required: true,
    enum: ['consultant', 'validator', 'governance', 'executive', 'controller', 'staff'],
  },
  // Role-specific fields
  compliance_score: { type: Number, min: 0, max: 100 },
  control_tier: { type: Number, min: 1, max: 5 },
  // ... additional fields
}, { timestamps: true });
```

**Figure 2: User Model Mongoose Schema**

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
  user_rating: number;
  access_count: number;
  created_by: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

**Figure 3: KnowledgeResource Model Interface**

**Mongoose Schema:**
```typescript
const knowledgeResourceSchema = new Schema<IKnowledgeResource>({
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
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // ... additional fields
}, { timestamps: true });
```

**Figure 4: KnowledgeResource Model Schema**

### KnowledgeKeyword Model Implementation

The KnowledgeKeyword model enables many-to-many relationships between knowledge resources and keywords, facilitating advanced search capabilities.

**File Location:** `lib/db/models/KnowledgeKeyword.ts`

**Implementation:**
```typescript
const knowledgeKeywordSchema = new Schema<IKnowledgeKeyword>({
  knowledge_resource_id: {
    type: Schema.Types.ObjectId,
    ref: 'KnowledgeResource',
    required: true,
  },
  keyword: {
    type: String,
    required: true,
  },
}, { timestamps: true });

knowledgeKeywordSchema.index({ knowledge_resource_id: 1, keyword: 1 });
```

**Figure 5: KnowledgeKeyword Model with Compound Index**

### DKNPlatform Model Implementation

The DKNPlatform model tracks platform-level metrics and configuration.

**File Location:** `lib/db/models/DKNPlatform.ts`

**Implementation:**
```typescript
const dknPlatformSchema = new Schema<IDKNPlatform>({
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
  registered_users: { type: Number, default: 0 },
  stored_knowledge_count: { type: Number, default: 0 },
  operational_time: { type: Number, default: 0 },
}, { timestamps: true });
```

**Figure 6: DKNPlatform Model Schema**

### AIModule Model Implementation

The AIModule model represents AI analysis modules within the platform.

**File Location:** `lib/db/models/AIModule.ts`

**Implementation:**
```typescript
const aiModuleSchema = new Schema<IAIModule>({
  module_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `AI-${Date.now()}`,
  },
  algorithm_type: { type: String, required: true },
  performance_index: { type: Number, default: 0 },
  platform_id: {
    type: Schema.Types.ObjectId,
    ref: 'DKNPlatform',
    required: true,
  },
}, { timestamps: true });
```

**Figure 7: AIModule Model Schema**

### AIKnowledgeAnalysis Model Implementation

The AIKnowledgeAnalysis model stores analysis results from AI modules for knowledge resources.

**File Location:** `lib/db/models/AIKnowledgeAnalysis.ts`

**Implementation:**
```typescript
const aiKnowledgeAnalysisSchema = new Schema<IAIKnowledgeAnalysis>({
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
  popularity_score: { type: Number, min: 0, max: 100 },
}, { timestamps: true });

aiKnowledgeAnalysisSchema.index({ knowledge_resource_id: 1, ai_module_id: 1 });
```

**Figure 8: AIKnowledgeAnalysis Model with Compound Index**

---

## Implementation for UI with REST API Connectivity

The DKN Platform implements a modern React-based UI using Next.js 14 App Router, connected to server-side components via RESTful API endpoints. The architecture follows a client-server pattern with clear separation of concerns.

### REST API Endpoints

#### Authentication APIs

**POST /api/auth/register** - Register new user
**POST /api/auth/[...nextauth]** - NextAuth login endpoint

**Figure 9: Authentication API Endpoints**

#### Knowledge Resource APIs

**GET /api/knowledge** - List knowledge resources with filtering
**POST /api/knowledge** - Create new knowledge resource
**GET /api/knowledge/[id]** - Get single knowledge resource
**PUT /api/knowledge/[id]** - Update knowledge resource
**DELETE /api/knowledge/[id]** - Delete knowledge resource
**POST /api/knowledge/[id]/approve** - Approve resource (Validator only)
**POST /api/knowledge/[id]/reject** - Reject resource (Validator only)
**POST /api/knowledge/[id]/authorize** - Authorize resource (Governance only)

**Figure 10: Knowledge Resource API Endpoints**

#### User Management APIs

**GET /api/users** - List all users (Controller only)
**POST /api/users** - Create new user (Controller only)
**GET /api/users/me** - Get current authenticated user

**Figure 11: User Management API Endpoints**

#### Platform & AI APIs

**GET /api/platform/stats** - Get platform statistics
**GET /api/ai/modules** - List all AI modules
**POST /api/ai/analyze/[resourceId]** - Trigger AI analysis

**Figure 12: Platform & AI API Endpoints**

### UI Component Implementation

#### User Management Page

**File Location:** `app/(dashboard)/dashboard/controller/users/page.tsx`

**Key Implementation:**
```typescript
const fetchUsers = async () => {
  try {
    setLoading(true);
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await response.json();
    setUsers(data.users || []);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const handleCreateUser = async (e: React.FormEvent) => {
  e.preventDefault();
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  // ... error handling
};
```

**Figure 13: User Management Component - API Integration**

**Figure 14: User Management Interface Screenshot**

#### Knowledge Resource List Page

**File Location:** `app/knowledge/page.tsx`

**Implementation:**
```typescript
const fetchResources = async () => {
  const params = new URLSearchParams();
  if (selectedState) params.append('approval_state', selectedState);
  if (searchKeyword) params.append('keyword', searchKeyword);
  
  const response = await fetch(`/api/knowledge?${params.toString()}`);
  const data = await response.json();
  setResources(data.resources || []);
};
```

**Figure 15: Knowledge Resource List - API Integration**

**Figure 16: Knowledge Resource List Interface Screenshot**

#### Knowledge Creation Page

**File Location:** `app/knowledge/create/page.tsx`

**Implementation:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const keywords = formData.keywords.split(',').map(k => k.trim());
  
  const response = await fetch("/api/knowledge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      heading: formData.heading,
      data_body: formData.data_body,
      classification: formData.classification,
      keywords: keywords,
    }),
  });
};
```

**Figure 17: Knowledge Creation - API Integration**

**Figure 18: Knowledge Creation Interface Screenshot**

#### Validator Dashboard

**File Location:** `app/(dashboard)/dashboard/validator/page.tsx`

**Implementation:**
```typescript
const handleApprove = async (resourceId: string) => {
  const response = await fetch(`/api/knowledge/${resourceId}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  fetchPendingResources();
};
```

**Figure 19: Validator Dashboard - Approval Action**

**Figure 20: Validator Dashboard Interface Screenshot**

---

## Non-Functional Requirements

### Performance

#### Overview

The performance of the DKN Platform Knowledge Management System stands as a cornerstone of its design, ensuring that users worldwide, regardless of their geographical locations and varying data speeds, encounter an optimal and consistent user experience. Performance benchmarks have been meticulously established to guarantee that the system delivers unparalleled responsiveness with minimal latency.

#### Global Accessibility

Recognizing the diverse global footprint of organizations using the DKN Platform, the system is architected to transcend geographical boundaries. Whether accessed from high-speed metropolitan locations or areas with lower bandwidth availability, the design prioritizes a uniform and efficient performance.

#### Responsiveness Metrics

Performance benchmarks encompass a spectrum of responsiveness metrics, including but not limited to page load times, data retrieval speed, and real-time collaboration responsiveness within collaborative workspaces. These metrics are continuously monitored and fine-tuned to meet or exceed predefined performance standards.

**Figure 21: Performance Metrics Dashboard**

#### Scalability

The system's architecture is engineered to scale seamlessly, accommodating a growing user base and an expanding volume of project-related data. Scalability ensures that performance remains robust even as usage patterns evolve, and the system undergoes increased demands over time.

**Figure 22: Scalability Architecture Diagram**

### Security

#### Security Protocols

Security is paramount in safeguarding the sensitive project information and client data entrusted to the DKN Platform Knowledge Management System. The implementation adheres to multi-layered security protocols, employing a defense-in-depth strategy to fortify the system against potential threats and vulnerabilities.

#### User Authentication

User authentication is a fundamental security measure, ensuring that only authorized individuals gain access to the system. Robust authentication mechanisms, including secure password policies and multi-factor authentication where applicable, are implemented to validate user identities.

**Figure 23: Authentication Flow Diagram**

#### Access Control

Access control mechanisms are in place to delineate and enforce user permissions. Role-based access control (RBAC) ensures that each user, based on their role within the system, is granted appropriate access privileges. Fine-grained access controls enable administrators to tailor permissions with precision.

**Figure 24: Role-Based Access Control Matrix**

---

## Deployment

Deployment in software development means getting a software ready for use by people, involving tasks like sharing the code, setting up configurations, and preparing servers so that the application can be used by the intended audience.

### Back End Deployment

The deployment process for the Next.js application involved utilizing the Vercel platform, a cloud platform that provides hosting services for Next.js applications. This entailed configuring and setting up the Next.js application on the Vercel server, ensuring that all necessary files, dependencies, and configurations were properly in place. Once deployed, the Next.js application became accessible and operational through the Vercel server, allowing users to interact with the application online.

**Figure 25: Back End Server Info 1**

**Figure 26: Back End Server Info 2**

### Front End Deployment

The deployment process for the front-end Next.js components involved leveraging Vercel, a cloud platform designed for deploying and hosting web applications. This encompassed configuring and setting up the Next.js components on the Vercel platform, where they were transformed into a production-ready build. The deployment on Vercel ensured that the front-end components became publicly accessible on the internet, allowing users to interact with the web application seamlessly. Vercel provides features such as continuous integration and automatic deployments, simplifying the process of updating and maintaining the deployed Next.js components.

**Figure 27: Front End Deployment Server Info**

### Conclusion

In conclusion, the deployment of the Next.js application on the Vercel platform and the MongoDB database on MongoDB Atlas has successfully made both the back end and front-end of the web application accessible to users, providing a seamless and reliable online experience. This deployment ensures the efficient functioning of the application, allowing users to interact with its features and content with ease.

---

## References

1. Vercel Documentation (2024) *Deploying Next.js Applications*, Vercel. Available at: https://vercel.com/docs/frameworks/nextjs (Accessed: [Date]).

2. MongoDB Atlas (2024) *MongoDB Atlas Documentation*, MongoDB. Available at: https://www.mongodb.com/docs/atlas/ (Accessed: [Date]).

3. Cheesman, John., & Daniels, John. (2001). *UML Components, A Simple Process for Specifying Component-Based Software*. Pearson Education Corporation Sales Division.

4. Evans, E. (2003). *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley.

5. Mongoose Documentation (2024) *Mongoose Guide*, Mongoose. Available at: https://mongoosejs.com/docs/guide.html (Accessed: [Date]).

---

## Appendices

### Postman Reference

**Figure 28: Postman API Testing**

### Backend Dependencies

**Figure 29: Next.js Dependency List**


