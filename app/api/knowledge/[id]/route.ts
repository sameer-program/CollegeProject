import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connect';
import KnowledgeResource from '@/lib/db/models/KnowledgeResource';
import KnowledgeKeyword from '@/lib/db/models/KnowledgeKeyword';

// GET - Get single knowledge resource
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const resource = await KnowledgeResource.findById(params.id).populate(
      'created_by',
      'full_name email role'
    );

    if (!resource) {
      return NextResponse.json(
        { error: 'Knowledge resource not found' },
        { status: 404 }
      );
    }

    // Increment access count
    resource.access_count += 1;
    await resource.save();

    // Get keywords
    const keywords = await KnowledgeKeyword.find({
      knowledge_resource_id: resource._id,
    });

    return NextResponse.json({
      ...resource.toObject(),
      keywords: keywords.map((k) => k.keyword),
    });
  } catch (error: any) {
    console.error('Error fetching knowledge resource:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update knowledge resource
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const resource = await KnowledgeResource.findById(params.id);
    if (!resource) {
      return NextResponse.json(
        { error: 'Knowledge resource not found' },
        { status: 404 }
      );
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    // Only creator or controller can update
    if (
      resource.created_by.toString() !== userId &&
      userRole !== 'controller'
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to update this resource' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { heading, data_body, classification, keywords, user_rating } = body;

    // Validate rating if provided
    if (user_rating !== undefined) {
      if (user_rating < 0 || user_rating > 5) {
        return NextResponse.json(
          { error: 'Rating must be between 0 and 5' },
          { status: 400 }
        );
      }
      resource.user_rating = user_rating;
    }

    if (heading) resource.heading = heading;
    if (data_body) resource.data_body = data_body;
    if (classification) resource.classification = classification;

    // Increment revision if content changed
    if (heading || data_body) {
      resource.revision_number += 1;
    }

    await resource.save();

    // Update keywords if provided
    if (keywords && Array.isArray(keywords)) {
      // Delete existing keywords
      await KnowledgeKeyword.deleteMany({
        knowledge_resource_id: resource._id,
      });

      // Add new keywords
      if (keywords.length > 0) {
        await Promise.all(
          keywords.map((keyword: string) =>
            KnowledgeKeyword.create({
              knowledge_resource_id: resource._id,
              keyword: keyword.trim(),
            })
          )
        );
      }
    }

    const resourceKeywords = await KnowledgeKeyword.find({
      knowledge_resource_id: resource._id,
    });

    return NextResponse.json({
      message: 'Knowledge resource updated successfully',
      resource: {
        ...resource.toObject(),
        keywords: resourceKeywords.map((k) => k.keyword),
      },
    });
  } catch (error: any) {
    console.error('Error updating knowledge resource:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete knowledge resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const resource = await KnowledgeResource.findById(params.id);
    if (!resource) {
      return NextResponse.json(
        { error: 'Knowledge resource not found' },
        { status: 404 }
      );
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    // Only creator or controller can delete
    if (
      resource.created_by.toString() !== userId &&
      userRole !== 'controller'
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this resource' },
        { status: 403 }
      );
    }

    // Delete associated keywords
    await KnowledgeKeyword.deleteMany({
      knowledge_resource_id: resource._id,
    });

    // Delete resource
    await KnowledgeResource.findByIdAndDelete(params.id);

    // Update platform knowledge count
    const DKNPlatform = (await import('@/lib/db/models/DKNPlatform')).default;
    let platform = await DKNPlatform.findOne();
    if (platform) {
      platform.stored_knowledge_count = await KnowledgeResource.countDocuments();
      await platform.save();
    }

    return NextResponse.json({
      message: 'Knowledge resource deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting knowledge resource:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

