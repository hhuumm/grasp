// import { currentUser } from '@clerk/nextjs/server'
// import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, TrendingUp, Zap } from 'lucide-react'

export default function Home() {
  // const user = await currentUser()

  // if (user) {
  //   redirect('/dashboard')
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Grasp</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/demo">
                <Button outline>View Demo</Button>
              </Link>
              <Link href="/sign-in">
                <Button outline>Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button color="primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Master Reading
            <span className="text-[var(--primary)]"> Comprehension</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Improve your reading comprehension skills with AI-powered feedback.
            Read passages, write summaries, and get personalized insights to enhance your understanding.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 gap-4">
            <Link href="/demo">
              <Button outline className="w-full sm:w-auto px-8 py-3 text-lg">
                View Demo
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button color="primary" className="w-full sm:w-auto px-8 py-3 text-lg">
                Start Learning Today
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:scale-105 transition-transform duration-200">
              <CardHeader>
                <div className="bg-[var(--primary)]/10 p-3 rounded-2xl w-fit mb-4">
                  <BookOpen className="h-8 w-8 text-[var(--primary)]" />
                </div>
                <CardTitle>Diverse Passages</CardTitle>
                <CardDescription>
                  Read from a variety of topics and difficulty levels to challenge yourself
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:scale-105 transition-transform duration-200">
              <CardHeader>
                <div className="bg-[var(--accent)]/10 p-3 rounded-2xl w-fit mb-4">
                  <Zap className="h-8 w-8 text-[var(--accent)]" />
                </div>
                <CardTitle>AI-Powered Feedback</CardTitle>
                <CardDescription>
                  Get instant, personalized feedback on your summaries from advanced AI models
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:scale-105 transition-transform duration-200">
              <CardHeader>
                <div className="bg-[var(--primary)]/10 p-3 rounded-2xl w-fit mb-4">
                  <TrendingUp className="h-8 w-8 text-[var(--primary)]" />
                </div>
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Monitor your improvement over time with detailed analytics and scoring
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-3xl px-8 py-16 text-center shadow-2xl">
          <h2 className="text-4xl font-bold text-white">
            Ready to improve your reading skills?
          </h2>
          <p className="mt-4 text-xl text-white/90">
            Join thousands of learners who are already enhancing their comprehension abilities.
          </p>
          <div className="mt-8">
            <Link href="/sign-up">
              <Button color="secondary" className="shadow-lg hover:shadow-xl">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
