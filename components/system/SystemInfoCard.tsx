'use client';

interface SystemInfoCardProps {
  title: string;
  children: React.ReactNode;
}

export default function SystemInfoCard({ title, children }: SystemInfoCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}
