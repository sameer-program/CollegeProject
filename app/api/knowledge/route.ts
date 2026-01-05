import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connect';
import KnowledgeResource from '@/lib/db/models/KnowledgeResource';
import KnowledgeKeyword from '@/lib/db/models/KnowledgeKeyword';
import { canCreateKnowledge } from '@/lib/utils/permissions';

// GET - List knowledge resources with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const classification = searchParams.get('classification');
    const approval_state = searchParams.get('approval_state');
    const created_by = searchParams.get('created_by');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = {};

    if (keyword) {
      const keywordDocs = await KnowledgeKeyword.find({
        keyword: { $regex: keyword, $options: 'i' },
      });
      const resourceIds = keywordDocs.map((k) => k.knowledge_resource_id);
      query._id = { $in: resourceIds };
    }

    if (classification) {
      query.classification = classification;
    }

    if (approval_state) {
      query.approval_state = approval_state;
    }

    if (created_by) {
      query.created_by = created_by;
    }

    const skip = (page - 1) * limit;

    const resources = await KnowledgeResource.find(query)
      .populate('created_by', 'full_name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get keywords for each resource
    const resourcesWithKeywords = await Promise.all(
      resources.map(async (resource) => {
        const keywords = await KnowledgeKeyword.find({
          knowledge_resource_id: resource._id,
        });
        return {
          ...resource.toObject(),
          keywords: keywords.map((k) => k.keyword),
        };
      })
    );

    const total = await KnowledgeResource.countDocuments(query);

    return NextResponse.json({
      resources: resourcesWithKeywords,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching knowledge resources:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new knowledge resource
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (!canCreateKnowledge(userRole)) {
      return NextResponse.json(
        { error: 'You do not have permission to create knowledge resources' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { heading, data_body, classification, keywords } = body;

    if (!heading || !data_body || !classification) {
      return NextResponse.json(
        { error: 'Missing required fields: heading, data_body, classification' },
        { status: 400 }
      );
    }

    // Validate rating if provided
    if (body.user_rating !== undefined) {
      if (body.user_rating < 0 || body.user_rating > 5) {
        return NextResponse.json(
          { error: 'Rating must be between 0 and 5' },
          { status: 400 }
        );
      }
    }

    const resource = await KnowledgeResource.create({
      heading,
      data_body,
      classification,
      user_rating: body.user_rating || 0,
      created_by: (session.user as any).id,
      approval_state: 'Pending',
    });

    // Add keywords if provided
    if (keywords && Array.isArray(keywords) && keywords.length > 0) {
      await Promise.all(
        keywords.map((keyword: string) =>
          KnowledgeKeyword.create({
            knowledge_resource_id: resource._id,
            keyword: keyword.trim(),
          })
        )
      );
    }

    // Update platform knowledge count
    const DKNPlatform = (await import('@/lib/db/models/DKNPlatform')).default;
    let platform = await DKNPlatform.findOne();
    if (platform) {
      platform.stored_knowledge_count = await KnowledgeResource.countDocuments();
      await platform.save();
    }

    const resourceKeywords = await KnowledgeKeyword.find({
      knowledge_resource_id: resource._id,
    });

    return NextResponse.json(
      {
        message: 'Knowledge resource created successfully',
        resource: {
          ...resource.toObject(),
          keywords: resourceKeywords.map((k) => k.keyword),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating knowledge resource:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

