import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Mark this route as dynamic to fix build errors
export const dynamic = 'force-dynamic';

const execAsync = promisify(exec);

const allowedActions = ['start', 'stop', 'restart', 'delete'];

export async function POST(
  request: NextRequest,
  { params }: { params: { action: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { action } = params;
    
    // Validate action
    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { pm_id } = body;
    
    if (pm_id === undefined) {
      return NextResponse.json(
        { error: 'Process ID is required' },
        { status: 400 }
      );
    }
    
    // Execute the action
    const { stdout, stderr } = await execAsync(`pm2 ${action} ${pm_id}`);
    
    return NextResponse.json({ 
      success: true,
      message: `Process ${action} successful`,
      stdout,
      stderr 
    });
  } catch (error) {
    console.error(`Failed to ${params.action} PM2 process:`, error);
    return NextResponse.json(
      { error: `Failed to ${params.action} PM2 process` },
      { status: 500 }
    );
  }
}
