import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connect';
import AIModule from '@/lib/db/models/AIModule';
import AIKnowledgeAnalysis from '@/lib/db/models/AIKnowledgeAnalysis';
import DKNPlatform from '@/lib/db/models/DKNPlatform';
import { analyzeKnowledgeResource } from '@/lib/ai/analysis-service';

// POST - Trigger AI analysis for a knowledge resource
export async function POST(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get or create default AI module
    let aiModule = await AIModule.findOne();
    if (!aiModule) {
      // Get platform
      let platform = await DKNPlatform.findOne();
      if (!platform) {
        platform = await DKNPlatform.create({
          platform_id: 'PLATFORM-1',
          release_version: '1.0.0',
        });
      }

      aiModule = await AIModule.create({
        module_id: 'AI-MODULE-1',
        algorithm_type: 'NLP Analysis',
        platform_id: platform._id,
      });
    }

    // Check if analysis already exists
    const existingAnalysis = await AIKnowledgeAnalysis.findOne({
      knowledge_resource_id: params.resourceId,
      ai_module_id: aiModule._id,
    });

    if (existingAnalysis) {
      return NextResponse.json({
        message: 'Analysis already exists',
        analysis: existingAnalysis,
      });
    }

    // Perform analysis
    const analysisResult = await analyzeKnowledgeResource(
      params.resourceId,
      aiModule._id.toString()
    );

    // Save analysis
    const analysis = await AIKnowledgeAnalysis.create({
      ai_module_id: aiModule._id,
      knowledge_resource_id: params.resourceId,
      analysis_score: analysisResult.analysis_score,
      recommendations: analysisResult.recommendations,
      tags: analysisResult.tags,
      popularity_score: analysisResult.popularity_score,
    });

    // Update AI module performance index
    const { getAIModulePerformance } = await import('@/lib/ai/analysis-service');
    const performance = await getAIModulePerformance(aiModule._id.toString());
    aiModule.performance_index = performance.average_score;
    aiModule.model_updated_on = new Date();
    await aiModule.save();

    return NextResponse.json({
      message: 'Analysis completed successfully',
      analysis,
    });
  } catch (error: any) {
    console.error('Error analyzing knowledge resource:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get analysis for a knowledge resource
export async function GET(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const analysis = await AIKnowledgeAnalysis.findOne({
      knowledge_resource_id: params.resourceId,
    })
      .populate('ai_module_id')
      .populate('knowledge_resource_id');

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

