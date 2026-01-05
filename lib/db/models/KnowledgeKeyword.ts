import mongoose, { Document, Schema } from 'mongoose';

export interface IKnowledgeKeyword extends Document {
  knowledge_resource_id: mongoose.Types.ObjectId;
  keyword: string;
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

