import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

// Mark this route as dynamic to fix build errors
export const dynamic = 'force-dynamic';

const execAsync = promisify(exec);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Process ID is required' },
        { status: 400 }
      );
    }
    
    // Get process info to find the log path
    const { stdout } = await execAsync(`pm2 jlist`);
    const processes = JSON.parse(stdout);
    const process = processes.find((p: any) => p.pm_id.toString() === id);
    
    if (!process) {
      return NextResponse.json(
        { error: 'Process not found' },
        { status: 404 }
      );
    }
    
    // Get the log file path
    const logPath = process.pm2_env.pm_out_log_path;
    const errorLogPath = process.pm2_env.pm_err_log_path;
    
    // Read both log files
    let logs = '';
    
    try {
      const outLogs = await fs.readFile(logPath, 'utf-8');
      logs += outLogs;
    } catch (err) {
      console.error(`Failed to read out logs for process ${id}:`, err);
    }
    
    try {
      const errLogs = await fs.readFile(errorLogPath, 'utf-8');
      
      if (logs && errLogs) {
        logs += '\n\n--- ERROR LOGS ---\n\n';
      }
      
      logs += errLogs;
    } catch (err) {
      console.error(`Failed to read error logs for process ${id}:`, err);
    }
    
    // Limit log size to prevent performance issues
    const maxLogSize = 100000; // ~100KB
    if (logs.length > maxLogSize) {
      logs = '... (truncated) ...\n' + logs.slice(-maxLogSize);
    }
    
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Failed to get logs:', error);
    return NextResponse.json(
      { error: 'Failed to get logs' },
      { status: 500 }
    );
  }
}
