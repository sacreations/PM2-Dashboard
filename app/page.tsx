import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/dashboard');
  }
  
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold mb-8">PM2 Dashboard</h1>
      <p className="text-xl mb-8 max-w-md">
        A beautiful, responsive web dashboard for managing PM2 processes
      </p>
      <Link href="/login" className="btn btn-primary">
        Get Started
      </Link>
    </main>
  );
}
