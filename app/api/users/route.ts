import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import DKNPlatform from '@/lib/db/models/DKNPlatform';
import { canManageUsers } from '@/lib/utils/permissions';

// GET - List all users (Controller only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (!canManageUsers(userRole)) {
      return NextResponse.json(
        { error: 'You do not have permission to view users' },
        { status: 403 }
      );
    }

    await connectDB();

    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new user (Controller only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (!canManageUsers(userRole)) {
      return NextResponse.json(
        { error: 'You do not have permission to create users' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const {
      unique_user_id,
      full_name,
      email,
      password,
      division,
      role,
      specialisation_field,
      assigned_project,
      compliance_score,
      inspection_interval,
      privilege_level,
      control_tier,
      access_rights,
      training_phase,
    } = body;

    // Validate required fields
    if (!unique_user_id || !full_name || !email || !password || !division || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: unique_user_id, full_name, email, password, division, role' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { unique_user_id }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or user ID already exists' },
        { status: 400 }
      );
    }

    // Build user data object
    const userData: any = {
      unique_user_id,
      full_name,
      email,
      password,
      division,
      role,
    };

    // Add role-specific fields
    if (role === 'consultant') {
      if (specialisation_field) userData.specialisation_field = specialisation_field;
      if (assigned_project) userData.assigned_project = assigned_project;
    } else if (role === 'governance') {
      if (compliance_score !== undefined) userData.compliance_score = compliance_score;
      if (inspection_interval) userData.inspection_interval = inspection_interval;
    } else if (role === 'executive') {
      if (privilege_level) userData.privilege_level = privilege_level;
    } else if (role === 'controller') {
      if (control_tier !== undefined) userData.control_tier = control_tier;
      if (access_rights && Array.isArray(access_rights)) userData.access_rights = access_rights;
    } else if (role === 'staff') {
      if (training_phase) userData.training_phase = training_phase;
    }

    // Create user
    const user = await User.create(userData);

    // Update platform registered users count
    let platform = await DKNPlatform.findOne();
    if (!platform) {
      platform = await DKNPlatform.create({
        platform_id: 'PLATFORM-1',
        release_version: '1.0.0',
      });
    }
    platform.registered_users = await User.countDocuments();
    await platform.save();

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userObj,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

