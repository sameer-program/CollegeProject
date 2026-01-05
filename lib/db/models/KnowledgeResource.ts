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

