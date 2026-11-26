import { UserButton } from '@clerk/nextjs';

export default function MemberPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow text-center">
        <div className="flex justify-center mb-4">
          <UserButton />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome to your Gym!</h1>
        <p className="mt-2 text-gray-600">Your membership registration is complete and active.</p>
      </div>
    </div>
  );
}
