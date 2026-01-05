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

