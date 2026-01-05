import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import DKNPlatform from '@/lib/db/models/DKNPlatform';

export async function POST(request: NextRequest) {
  try {
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
    } = body;

    // Validate required fields
    if (!unique_user_id || !full_name || !email || !password || !division || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Create user
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
    }

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

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user._id,
          unique_user_id: user.unique_user_id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

