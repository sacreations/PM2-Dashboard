import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Mark this route as dynamic to fix build errors
export const dynamic = 'force-dynamic';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Execute PM2 list command
    const { stdout } = await execAsync('pm2 jlist');
    const processes = JSON.parse(stdout);
    
    return NextResponse.json(processes);
  } catch (error) {
    console.error('Failed to get PM2 process list:', error);
    return NextResponse.json(
      { error: 'Failed to get PM2 process list' },
      { status: 500 }
    );
  }
}
