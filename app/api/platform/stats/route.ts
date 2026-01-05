import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connect';
import DKNPlatform from '@/lib/db/models/DKNPlatform';
import User from '@/lib/db/models/User';
import KnowledgeResource from '@/lib/db/models/KnowledgeResource';

// GET - Get platform statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get or create platform
    let platform = await DKNPlatform.findOne();
    if (!platform) {
      platform = await DKNPlatform.create({
        platform_id: 'PLATFORM-1',
        release_version: '1.0.0',
      });
    }

    // Update metrics
    const userCount = await User.countDocuments();
    const knowledgeCount = await KnowledgeResource.countDocuments();
    
    // Calculate operational time (time since first user registration or platform creation)
    const firstUser = await User.findOne().sort({ createdAt: 1 });
    const startTime = firstUser?.createdAt || platform.createdAt;
    const operationalTime = Math.floor((Date.now() - startTime.getTime()) / 1000); // in seconds

    platform.registered_users = userCount;
    platform.stored_knowledge_count = knowledgeCount;
    platform.operational_time = operationalTime;
    await platform.save();

    // Get additional stats
    const pendingCount = await KnowledgeResource.countDocuments({ approval_state: 'Pending' });
    const approvedCount = await KnowledgeResource.countDocuments({ approval_state: 'Approved' });
    const authorizedCount = await KnowledgeResource.countDocuments({ approval_state: 'Authorized' });
    const rejectedCount = await KnowledgeResource.countDocuments({ approval_state: 'Rejected' });

    // Role distribution
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    // Knowledge by classification
    const knowledgeByClassification = await KnowledgeResource.aggregate([
      { $group: { _id: '$classification', count: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      platform: {
        platform_id: platform.platform_id,
        release_version: platform.release_version,
        operational_time: platform.operational_time,
        registered_users: platform.registered_users,
        stored_knowledge_count: platform.stored_knowledge_count,
      },
      knowledge_stats: {
        total: knowledgeCount,
        pending: pendingCount,
        approved: approvedCount,
        authorized: authorizedCount,
        rejected: rejectedCount,
      },
      user_stats: {
        total: userCount,
        role_distribution: roleDistribution,
      },
      knowledge_by_classification: knowledgeByClassification,
    });
  } catch (error: any) {
    console.error('Error fetching platform stats:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

