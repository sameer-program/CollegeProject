import connectDB from '@/lib/db/connect';
import DKNPlatform from '@/lib/db/models/DKNPlatform';
import User from '@/lib/db/models/User';
import KnowledgeResource from '@/lib/db/models/KnowledgeResource';

/**
 * Initialize platform with default values
 * Updates platform metrics based on actual counts
 */
export async function initializePlatform() {
  try {
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

    // Calculate operational time
    const firstUser = await User.findOne().sort({ createdAt: 1 });
    const startTime = firstUser?.createdAt || platform.createdAt;
    const operationalTime = Math.floor((Date.now() - startTime.getTime()) / 1000);

    platform.registered_users = userCount;
    platform.stored_knowledge_count = knowledgeCount;
    platform.operational_time = operationalTime;
    await platform.save();

    return platform;
  } catch (error) {
    console.error('Error initializing platform:', error);
    throw error;
  }
}

/**
 * Update platform metrics (can be called periodically)
 */
export async function updatePlatformMetrics() {
  return initializePlatform();
}

