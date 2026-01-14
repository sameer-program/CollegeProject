# Coursework 2 - Complete Code Listings
## DKN Platform - Source Code Documentation

---

## Table of Contents

1. [Type Model Implementations](#type-model-implementations)
2. [REST API Route Implementations](#rest-api-route-implementations)
3. [UI Component Implementations](#ui-component-implementations)
4. [Configuration Files](#configuration-files)

---

## Type Model Implementations

### 1. User Model (`lib/db/models/User.ts`)

```typescript
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

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
  access_rights?: string[]; // controller (JSON array)
  training_phase?: string; // staff
  
  matchPassword(enteredPassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

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
    last_login_at: {
      type: Date,
      default: null,
    },
    // Consultant fields
    specialisation_field: String,
    assigned_project: String,
    // Validator fields
    approved_submissions: {
      type: Number,
      default: 0,
    },
    // Governance fields
    compliance_score: {
      type: Number,
      min: 0,
      max: 100,
    },
    inspection_interval: String,
    // Executive fields
    privilege_level: String,
    // Controller fields
    control_tier: {
      type: Number,
      min: 1,
      max: 5,
    },
    access_rights: [String],
    // Staff fields
    training_phase: String,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
```

---

### 2. KnowledgeResource Model (`lib/db/models/KnowledgeResource.ts`)

```typescript
import mongoose, { Document, Schema } from 'mongoose';

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
      enum: ['Pending', 'Approved', 'Rejected', 'Authorized'],
      default: 'Pending',
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
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const KnowledgeResource = mongoose.models.KnowledgeResource || 
  mongoose.model<IKnowledgeResource>('KnowledgeResource', knowledgeResourceSchema);

export default KnowledgeResource;
```

---

### 3. KnowledgeKeyword Model (`lib/db/models/KnowledgeKeyword.ts`)

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IKnowledgeKeyword extends Document {
  knowledge_resource_id: mongoose.Types.ObjectId;
  keyword: string;
  createdAt: Date;
  updatedAt: Date;
}

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

const KnowledgeKeyword = mongoose.models.KnowledgeKeyword || 
  mongoose.model<IKnowledgeKeyword>('KnowledgeKeyword', knowledgeKeywordSchema);

export default KnowledgeKeyword;
```

---

### 4. DKNPlatform Model (`lib/db/models/DKNPlatform.ts`)

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IDKNPlatform extends Document {
  platform_id: string;
  release_version: string;
  operational_time: number; // in seconds or milliseconds
  registered_users: number;
  stored_knowledge_count: number;
  createdAt: Date;
  updatedAt: Date;
}

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

const DKNPlatform = mongoose.models.DKNPlatform || 
  mongoose.model<IDKNPlatform>('DKNPlatform', dknPlatformSchema);

export default DKNPlatform;
```

---

### 5. AIModule Model (`lib/db/models/AIModule.ts`)

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IAIModule extends Document {
  module_id: string;
  algorithm_type: string;
  performance_index: number;
  model_updated_on: Date;
  platform_id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

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
      ref: 'DKNPlatform',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AIModule = mongoose.models.AIModule || 
  mongoose.model<IAIModule>('AIModule', aiModuleSchema);

export default AIModule;
```

---

### 6. AIKnowledgeAnalysis Model (`lib/db/models/AIKnowledgeAnalysis.ts`)

```typescript
import mongoose, { Document, Schema } from 'mongoose';

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

const AIKnowledgeAnalysis = mongoose.models.AIKnowledgeAnalysis || 
  mongoose.model<IAIKnowledgeAnalysis>('AIKnowledgeAnalysis', aiKnowledgeAnalysisSchema);

export default AIKnowledgeAnalysis;
```

---

## REST API Route Implementations

### 1. Users API (`app/api/users/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import DKNPlatform from '@/lib/db/models/DKNPlatform';
import { canManageUsers } from '@/lib/utils/permissions';

// GET - List all users (Controller only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (!canManageUsers(userRole)) {
      return NextResponse.json(
        { error: 'You do not have permission to view users' },
        { status: 403 }
      );
    }

    await connectDB();

    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new user (Controller only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (!canManageUsers(userRole)) {
      return NextResponse.json(
        { error: 'You do not have permission to create users' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const {
      unique_user_id,
      full_name,
      email,
      password,
      division,
      role,
      specialisation_field,
      assigned_project,
      compliance_score,
      inspection_interval,
      privilege_level,
      control_tier,
      access_rights,
      training_phase,
    } = body;

    // Validate required fields
    if (!unique_user_id || !full_name || !email || !password || !division || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: unique_user_id, full_name, email, password, division, role' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { unique_user_id }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or user ID already exists' },
        { status: 400 }
      );
    }

    // Build user data object
    const userData: any = {
      unique_user_id,
      full_name,
      email,
      password,
      division,
      role,
    };

    // Add role-specific fields
    if (role === 'consultant') {
      if (specialisation_field) userData.specialisation_field = specialisation_field;
      if (assigned_project) userData.assigned_project = assigned_project;
    } else if (role === 'governance') {
      if (compliance_score !== undefined) userData.compliance_score = compliance_score;
      if (inspection_interval) userData.inspection_interval = inspection_interval;
    } else if (role === 'executive') {
      if (privilege_level) userData.privilege_level = privilege_level;
    } else if (role === 'controller') {
      if (control_tier !== undefined) userData.control_tier = control_tier;
      if (access_rights && Array.isArray(access_rights)) userData.access_rights = access_rights;
    } else if (role === 'staff') {
      if (training_phase) userData.training_phase = training_phase;
    }

    // Create user
    const user = await User.create(userData);

    // Update platform registered users count
    let platform = await DKNPlatform.findOne();
    if (!platform) {
      platform = await DKNPlatform.create({
        platform_id: 'PLATFORM-1',
        release_version: '1.0.0',
      });
    }
    platform.registered_users = await User.countDocuments();
    await platform.save();

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userObj,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

### 2. Knowledge Resources API (`app/api/knowledge/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connect';
import KnowledgeResource from '@/lib/db/models/KnowledgeResource';
import KnowledgeKeyword from '@/lib/db/models/KnowledgeKeyword';
import { canCreateKnowledge } from '@/lib/utils/permissions';

// GET - List knowledge resources with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const classification = searchParams.get('classification');
    const approval_state = searchParams.get('approval_state');
    const created_by = searchParams.get('created_by');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = {};

    if (keyword) {
      const keywordDocs = await KnowledgeKeyword.find({
        keyword: { $regex: keyword, $options: 'i' },
      });
      const resourceIds = keywordDocs.map((k) => k.knowledge_resource_id);
      query._id = { $in: resourceIds };
    }

    if (classification) {
      query.classification = classification;
    }

    if (approval_state) {
      query.approval_state = approval_state;
    }

    if (created_by) {
      query.created_by = created_by;
    }

    const skip = (page - 1) * limit;

    const resources = await KnowledgeResource.find(query)
      .populate('created_by', 'full_name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get keywords for each resource
    const resourcesWithKeywords = await Promise.all(
      resources.map(async (resource) => {
        const keywords = await KnowledgeKeyword.find({
          knowledge_resource_id: resource._id,
        });
        return {
          ...resource.toObject(),
          keywords: keywords.map((k) => k.keyword),
        };
      })
    );

    const total = await KnowledgeResource.countDocuments(query);

    return NextResponse.json({
      resources: resourcesWithKeywords,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching knowledge resources:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new knowledge resource
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (!canCreateKnowledge(userRole)) {
      return NextResponse.json(
        { error: 'You do not have permission to create knowledge resources' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { heading, data_body, classification, keywords } = body;

    if (!heading || !data_body || !classification) {
      return NextResponse.json(
        { error: 'Missing required fields: heading, data_body, classification' },
        { status: 400 }
      );
    }

    // Validate rating if provided
    if (body.user_rating !== undefined) {
      if (body.user_rating < 0 || body.user_rating > 5) {
        return NextResponse.json(
          { error: 'Rating must be between 0 and 5' },
          { status: 400 }
        );
      }
    }

    const resource = await KnowledgeResource.create({
      heading,
      data_body,
      classification,
      user_rating: body.user_rating || 0,
      created_by: (session.user as any).id,
      approval_state: 'Pending',
    });

    // Add keywords if provided
    if (keywords && Array.isArray(keywords) && keywords.length > 0) {
      await Promise.all(
        keywords.map((keyword: string) =>
          KnowledgeKeyword.create({
            knowledge_resource_id: resource._id,
            keyword: keyword.trim(),
          })
        )
      );
    }

    // Update platform knowledge count
    const DKNPlatform = (await import('@/lib/db/models/DKNPlatform')).default;
    let platform = await DKNPlatform.findOne();
    if (platform) {
      platform.stored_knowledge_count = await KnowledgeResource.countDocuments();
      await platform.save();
    }

    const resourceKeywords = await KnowledgeKeyword.find({
      knowledge_resource_id: resource._id,
    });

    return NextResponse.json(
      {
        message: 'Knowledge resource created successfully',
        resource: {
          ...resource.toObject(),
          keywords: resourceKeywords.map((k) => k.keyword),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating knowledge resource:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

### 3. Knowledge Resource by ID API (`app/api/knowledge/[id]/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connect';
import KnowledgeResource from '@/lib/db/models/KnowledgeResource';
import KnowledgeKeyword from '@/lib/db/models/KnowledgeKeyword';

// GET - Get single knowledge resource
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const resource = await KnowledgeResource.findById(params.id).populate(
      'created_by',
      'full_name email role'
    );

    if (!resource) {
      return NextResponse.json(
        { error: 'Knowledge resource not found' },
        { status: 404 }
      );
    }

    // Increment access count
    resource.access_count += 1;
    await resource.save();

    // Get keywords
    const keywords = await KnowledgeKeyword.find({
      knowledge_resource_id: resource._id,
    });

    return NextResponse.json({
      ...resource.toObject(),
      keywords: keywords.map((k) => k.keyword),
    });
  } catch (error: any) {
    console.error('Error fetching knowledge resource:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update knowledge resource
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const resource = await KnowledgeResource.findById(params.id);
    if (!resource) {
      return NextResponse.json(
        { error: 'Knowledge resource not found' },
        { status: 404 }
      );
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    // Only creator or controller can update
    if (
      resource.created_by.toString() !== userId &&
      userRole !== 'controller'
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to update this resource' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { heading, data_body, classification, keywords, user_rating } = body;

    // Validate rating if provided
    if (user_rating !== undefined) {
      if (user_rating < 0 || user_rating > 5) {
        return NextResponse.json(
          { error: 'Rating must be between 0 and 5' },
          { status: 400 }
        );
      }
      resource.user_rating = user_rating;
    }

    if (heading) resource.heading = heading;
    if (data_body) resource.data_body = data_body;
    if (classification) resource.classification = classification;

    // Increment revision if content changed
    if (heading || data_body) {
      resource.revision_number += 1;
    }

    await resource.save();

    // Update keywords if provided
    if (keywords && Array.isArray(keywords)) {
      // Delete existing keywords
      await KnowledgeKeyword.deleteMany({
        knowledge_resource_id: resource._id,
      });

      // Add new keywords
      if (keywords.length > 0) {
        await Promise.all(
          keywords.map((keyword: string) =>
            KnowledgeKeyword.create({
              knowledge_resource_id: resource._id,
              keyword: keyword.trim(),
            })
          )
        );
      }
    }

    const resourceKeywords = await KnowledgeKeyword.find({
      knowledge_resource_id: resource._id,
    });

    return NextResponse.json({
      message: 'Knowledge resource updated successfully',
      resource: {
        ...resource.toObject(),
        keywords: resourceKeywords.map((k) => k.keyword),
      },
    });
  } catch (error: any) {
    console.error('Error updating knowledge resource:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete knowledge resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const resource = await KnowledgeResource.findById(params.id);
    if (!resource) {
      return NextResponse.json(
        { error: 'Knowledge resource not found' },
        { status: 404 }
      );
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    // Only creator or controller can delete
    if (
      resource.created_by.toString() !== userId &&
      userRole !== 'controller'
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this resource' },
        { status: 403 }
      );
    }

    // Delete associated keywords
    await KnowledgeKeyword.deleteMany({
      knowledge_resource_id: resource._id,
    });

    // Delete resource
    await KnowledgeResource.findByIdAndDelete(params.id);

    // Update platform knowledge count
    const DKNPlatform = (await import('@/lib/db/models/DKNPlatform')).default;
    let platform = await DKNPlatform.findOne();
    if (platform) {
      platform.stored_knowledge_count = await KnowledgeResource.countDocuments();
      await platform.save();
    }

    return NextResponse.json({
      message: 'Knowledge resource deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting knowledge resource:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## UI Component Implementations

### User Management Component (Excerpt)

**Key Functions:**

```typescript
// Fetch users from API
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

// Create user via API
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

    // Add role-specific fields based on role
    if (formData.role === "consultant") {
      if (formData.specialisation_field) 
        userData.specialisation_field = formData.specialisation_field;
      if (formData.assigned_project) 
        userData.assigned_project = formData.assigned_project;
    }
    // ... similar for other roles

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

    setShowCreateForm(false);
    fetchUsers(); // Refresh the list
  } catch (err: any) {
    setCreateError(err.message || "An error occurred while creating user");
  } finally {
    setCreating(false);
  }
};
```

---

## Configuration Files

### package.json

```json
{
  "name": "dkn-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "init-db": "tsx scripts/init-db.ts"
  },
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

---

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

**End of Code Listings**


