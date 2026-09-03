'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookMarked, BookOpen, Home, Settings, Users } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Discover', href: '/books', icon: BookMarked },
  { name: 'Passages', href: '/passages', icon: BookOpen },
  { name: 'Connections', href: '/connections', icon: Settings },
  { name: 'Admin', href: '/admin', icon: Users },
]

export function Navbar() {
  const pathname = usePathname()
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-[var(--primary)]">
                Grasp
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                      pathname === item.href
                        ? 'border-[var(--primary)] text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center">
            {clerkEnabled ? <AuthenticatedUser /> : (
              <Link href="/demo" className="text-sm font-medium text-[var(--primary)]">
                Try the demo
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function AuthenticatedUser() {
  const { user } = useUser()

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-700">
        Welcome, {user?.firstName || 'User'}
      </span>
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}
