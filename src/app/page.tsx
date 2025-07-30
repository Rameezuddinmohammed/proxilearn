import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Proxilearn
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          The future of school coordination.
        </p>

        <div className="mt-8">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center justify-center gap-4">
               <Link href="/dashboard">
                <button className="rounded bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700">
                  Go to Dashboard
                </button>
              </Link>
              <div className="absolute top-5 right-5">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
    </main>
  );
}