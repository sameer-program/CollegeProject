import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connect';
import AIModule from '@/lib/db/models/AIModule';
import { getAIModulePerformance } from '@/lib/ai/analysis-service';

// GET - List all AI modules with performance metrics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const modules = await AIModule.find().populate('platform_id');

    const modulesWithPerformance = await Promise.all(
      modules.map(async (module) => {
        const performance = await getAIModulePerformance(module._id.toString());
        return {
          ...module.toObject(),
          performance,
        };
      })
    );

    return NextResponse.json({ modules: modulesWithPerformance });
  } catch (error: any) {
    console.error('Error fetching AI modules:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

