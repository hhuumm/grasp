import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function Page() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--background)] to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-[var(--primary)] hover:opacity-80 transition-opacity">
            Grasp
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-6">Join Grasp</h1>
          <p className="text-gray-600 mt-2">Create your account to start improving your reading comprehension</p>
        </div>
        <div className="flex justify-center">
          {clerkEnabled ? <SignUp
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-2xl rounded-3xl",
                headerTitle: "text-2xl font-bold",
                headerSubtitle: "text-gray-600",
                socialButtonsBlockButton: "rounded-full border-2 hover:scale-105 transition-all",
                formButtonPrimary: "rounded-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 hover:scale-105 transition-all",
                formFieldInput: "rounded-2xl border-2 focus:border-[var(--primary)]",
                footerActionLink: "text-[var(--primary)] hover:text-[var(--primary)]/80",
              }
            }}
          /> : (
            <div className="rounded-2xl bg-white p-6 text-center shadow-lg">
              <p className="text-gray-700">Account creation is not configured for this demo deployment.</p>
              <Link href="/demo" className="mt-4 inline-block font-semibold text-[var(--primary)]">
                Continue to the demo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
