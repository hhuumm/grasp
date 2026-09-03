import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, TrendingUp, Clock, Target } from 'lucide-react'
import Link from 'next/link'

// Mock data - will be replaced with real data from database
const mockPassages = [
  {
    id: '1',
    text: 'The rapid advancement of artificial intelligence has transformed various industries...',
    source: 'Tech Weekly',
    difficulty: 'intermediate',
    tags: ['technology', 'AI'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    text: 'Climate change continues to be one of the most pressing issues of our time...',
    source: 'Environmental Science Journal',
    difficulty: 'advanced',
    tags: ['environment', 'science'],
    createdAt: new Date('2024-01-10'),
  },
]

const mockResponses = [
  {
    id: '1',
    passageId: '1',
    summaryText: 'AI is changing industries rapidly...',
    aiScore: 85,
    aiFeedback: 'Good summary, but could include more specific examples.',
    timestamp: new Date('2024-01-16'),
  },
]

export default async function DashboardPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
  const user = clerkEnabled ? await currentUser() : null
  
  if (clerkEnabled && !user) {
    redirect('/sign-in')
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName || 'Reader'}!
          </h1>
          <p className="text-blue-100">
            Continue your reading comprehension journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Passages</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPassages.length}</div>
              <p className="text-xs text-muted-foreground">Available to read</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockResponses.length}</div>
              <p className="text-xs text-muted-foreground">Passages completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5h</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Passages</CardTitle>
              <CardDescription>Start reading and practicing comprehension</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockPassages.map((passage) => (
                <div key={passage.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">{passage.source}</p>
                    <p className="text-sm line-clamp-2">{passage.text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge color={passage.difficulty === 'beginner' ? 'success' : passage.difficulty === 'intermediate' ? 'warning' : 'error'}>
                        {passage.difficulty}
                      </Badge>
                      {passage.tags.map((tag) => (
                        <Badge key={tag} color="zinc">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <Link href={`/passage/${passage.id}`}>
                    <Button className="px-3 py-1.5">Read</Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Responses</CardTitle>
              <CardDescription>Your latest comprehension attempts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockResponses.map((response) => (
                <div key={response.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Passage #{response.passageId}</span>
                    <Badge color={response.aiScore >= 80 ? 'success' : response.aiScore >= 60 ? 'warning' : 'error'}>
                      {response.aiScore}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{response.summaryText}</p>
                  <p className="text-xs text-muted-foreground">{response.aiFeedback}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
