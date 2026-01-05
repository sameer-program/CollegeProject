import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connect';
import KnowledgeResource from '@/lib/db/models/KnowledgeResource';
import { canAuthorize } from '@/lib/utils/permissions';

// POST - Authorize knowledge resource (Governance)
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
    if (!canAuthorize(userRole)) {
      return NextResponse.json(
        { error: 'You do not have permission to authorize resources' },
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

    if (resource.approval_state !== 'Approved') {
      return NextResponse.json(
        { error: 'Resource must be Approved before authorization' },
        { status: 400 }
      );
    }

    resource.approval_state = 'Authorized';
    await resource.save();

    return NextResponse.json({
      message: 'Knowledge resource authorized successfully',
      resource,
    });
  } catch (error: any) {
    console.error('Error authorizing knowledge resource:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

