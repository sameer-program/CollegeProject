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

