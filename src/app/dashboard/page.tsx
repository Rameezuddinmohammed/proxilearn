import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      <p className="mt-2 text-gray-600">This is your main control panel after logging in.</p>
      
      <div className="mt-8">
        <Link href="/dashboard/tasks/new">
          <button className="rounded bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700">
            Create New Task
          </button>
        </Link>
      </div>
    </div>
  );
}