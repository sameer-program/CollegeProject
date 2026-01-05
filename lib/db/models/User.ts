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

