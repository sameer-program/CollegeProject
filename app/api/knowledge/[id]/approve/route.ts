import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connect';
import KnowledgeResource from '@/lib/db/models/KnowledgeResource';
import User from '@/lib/db/models/User';
import { canApprove } from '@/lib/utils/permissions';

// POST - Approve knowledge resource
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
        { error: 'You do not have permission to approve resources' },
        { status: 403 }
      );
    }

    await connectDB();

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

    resource.approval_state = 'Approved';
    await resource.save();

    // Update validator's approved submissions count
    if (userRole === 'validator') {
      const validator = await User.findById((session.user as any).id);
      if (validator) {
        validator.approved_submissions = (validator.approved_submissions || 0) + 1;
        await validator.save();
      }
    }

    return NextResponse.json({
      message: 'Knowledge resource approved successfully',
      resource,
    });
  } catch (error: any) {
    console.error('Error approving knowledge resource:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

