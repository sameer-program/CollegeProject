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

