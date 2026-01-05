import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connect';
import KnowledgeResource from '@/lib/db/models/KnowledgeResource';
import { canApprove } from '@/lib/utils/permissions';

// POST - Reject knowledge resource
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (!canApprove(userRole)) {
      return NextResponse.json(
        { error: 'You do not have permission to reject resources' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { reason } = body;

    const resource = await KnowledgeResource.findById(params.id);
    if (!resource) {
      return NextResponse.json(
        { error: 'Knowledge resource not found' },
        { status: 404 }
      );
    }

    if (resource.approval_state !== 'Pending') {
      return NextResponse.json(
        { error: 'Resource is not in Pending state' },
        { status: 400 }
      );
    }

    resource.approval_state = 'Rejected';
    await resource.save();

    return NextResponse.json({
      message: 'Knowledge resource rejected',
      resource,
      reason: reason || 'No reason provided',
    });
  } catch (error: any) {
    console.error('Error rejecting knowledge resource:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

