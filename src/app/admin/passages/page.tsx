'use client'

import { useState } from 'react'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react'

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

type Passage = (typeof mockPassages)[number]

export default function AdminPassagesPage() {
  const [passages, setPassages] = useState(mockPassages)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    text: '',
    source: '',
    difficulty: 'beginner',
    tags: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    
    if (editingId) {
      // Update existing passage
      setPassages(passages.map(passage => 
        passage.id === editingId 
          ? { ...passage, ...formData, tags: tagsArray }
          : passage
      ))
    } else {
      // Create new passage
      const newPassage = {
        id: Date.now().toString(),
        text: formData.text,
        source: formData.source,
        difficulty: formData.difficulty,
        tags: tagsArray,
        createdAt: new Date(),
      }
      setPassages([...passages, newPassage])
    }
    
    setFormData({ text: '', source: '', difficulty: 'beginner', tags: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (passage: Passage) => {
    setFormData({
      text: passage.text,
      source: passage.source,
      difficulty: passage.difficulty,
      tags: passage.tags.join(', '),
    })
    setEditingId(passage.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setPassages(passages.filter(passage => passage.id !== id))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success' as const
      case 'intermediate': return 'warning' as const
      case 'advanced': return 'error' as const
      default: return 'zinc' as const
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Passages</h1>
            <p className="text-gray-600 mt-2">Create and manage reading comprehension passages</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Passage
          </Button>
        </div>

        {/* Add/Edit Passage Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Passage' : 'Add New Passage'}</CardTitle>
              <CardDescription>
                {editingId ? 'Update the passage details' : 'Create a new reading comprehension passage'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Source</label>
                    <Input
                      placeholder="e.g., Scientific American, The Economist"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <Input
                    placeholder="e.g., science, technology, environment (comma-separated)"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Passage Text</label>
                  <Textarea
                    placeholder="Enter the full passage text here..."
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="min-h-[200px]"
                    required
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingId ? 'Update Passage' : 'Add Passage'}
                  </Button>
                  <Button 
                    type="button" 
                    outline 
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                      setFormData({ text: '', source: '', difficulty: 'beginner', tags: '' })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Passages List */}
        <div className="space-y-4">
          {passages.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No passages created yet</h3>
                <p className="text-gray-600 mb-4">Create your first reading comprehension passage</p>
                <Button onClick={() => setShowForm(true)}>Add Passage</Button>
              </CardContent>
            </Card>
          ) : (
            passages.map((passage) => (
              <Card key={passage.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge color={getDifficultyColor(passage.difficulty)}>
                          {passage.difficulty}
                        </Badge>
                        {passage.tags.map((tag) => (
                          <Badge key={tag} color="zinc">{tag}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Source: {passage.source}</p>
                      <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                        {passage.text}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created {passage.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        outline
                        className="px-3 py-1.5"
                        onClick={() => handleEdit(passage)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        outline
                        className="px-3 py-1.5 text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(passage.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}
