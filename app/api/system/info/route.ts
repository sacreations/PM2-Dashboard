import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Mark this route as dynamic to fix build errors
export const dynamic = 'force-dynamic';

const execAsync = promisify(exec);

interface SystemInfo {
  cpuUsage: number;
  memoryUsage: {
    total: number;
    free: number;
    used: number;
    percentUsed: number;
  };
  uptime: number;
  platform: string;
  hostname: string;
  cpuInfo: {
    model: string;
    cores: number;
    speed: number;
  };
  osInfo: {
    type: string;
    release: string;
    arch: string;
  };
  loadAverage: number[];
  networkInterfaces: {
    [key: string]: os.NetworkInterfaceInfo[];
  };
}

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
    
    // Get CPU usage - this is more complex and varies by platform
    let cpuUsage = 0;
    try {
      // This is a simplified approach - real production code might use a more robust method
      if (process.platform === 'linux') {
        const { stdout } = await execAsync("top -bn1 | grep '%Cpu' | awk '{print $2 + $4}'");
        cpuUsage = parseFloat(stdout);
      } else if (process.platform === 'darwin') { // macOS
        const { stdout } = await execAsync("ps -A -o %cpu | awk '{s+=$1} END {print s}'");
        cpuUsage = parseFloat(stdout) / os.cpus().length;
      } else if (process.platform === 'win32') { // Windows
        const { stdout } = await execAsync("wmic cpu get LoadPercentage");
        const lines = stdout.split('\r\n').filter(line => line.trim());
        if (lines.length >= 2) {
          cpuUsage = parseInt(lines[1].trim(), 10);
        }
      }
    } catch (err) {
      console.error('Failed to get CPU usage:', err);
      // Default to calculating a rough estimate based on load average
      cpuUsage = (os.loadavg()[0] / os.cpus().length) * 100;
    }

    // Ensure CPU usage is within bounds
    cpuUsage = Math.min(Math.max(cpuUsage, 0), 100);
    
    // Get memory information
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const percentUsed = (usedMem / totalMem) * 100;
    
    // Get CPU information
    const cpus = os.cpus();
    const cpuInfo = {
      model: cpus.length > 0 ? cpus[0].model : 'Unknown',
      cores: cpus.length,
      speed: cpus.length > 0 ? cpus[0].speed : 0
    };
    
    // Get network interfaces and filter out any undefined values
    const rawNetworkInterfaces = os.networkInterfaces();
    const networkInterfaces: { [key: string]: os.NetworkInterfaceInfo[] } = {};
    
    // Convert Dict<NetworkInterfaceInfo[]> to { [key: string]: NetworkInterfaceInfo[] }
    Object.entries(rawNetworkInterfaces).forEach(([key, value]) => {
      if (value !== undefined) {
        networkInterfaces[key] = value;
      }
    });
    
    // Build system info object
    const systemInfo: SystemInfo = {
      cpuUsage,
      memoryUsage: {
        total: totalMem,
        free: freeMem,
        used: usedMem,
        percentUsed
      },
      uptime: os.uptime(),
      platform: process.platform,
      hostname: os.hostname(),
      cpuInfo,
      osInfo: {
        type: os.type(),
        release: os.release(),
        arch: os.arch()
      },
      loadAverage: os.loadavg(),
      networkInterfaces
    };
    
    return NextResponse.json(systemInfo);
  } catch (error) {
    console.error('Failed to get system information:', error);
    return NextResponse.json(
      { error: 'Failed to get system information' },
      { status: 500 }
    );
  }
}
