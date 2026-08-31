'use client'

import { useState } from 'react'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Settings, Trash2, Eye, EyeOff } from 'lucide-react'

// Mock data - will be replaced with real data from database
const mockConnections = [
  {
    id: '1',
    provider: 'openai',
    model: 'gpt-4',
    endpoint: null,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    provider: 'local',
    model: 'llama2',
    endpoint: 'http://localhost:11434/api/generate',
    createdAt: new Date('2024-01-15'),
  },
]

export default function ConnectionsPage() {
  const [connections, setConnections] = useState(mockConnections)
  const [showForm, setShowForm] = useState(false)
  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    provider: 'openai',
    model: '',
    apiKey: '',
    endpoint: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // In real implementation, this would save to database
    const newConnection = {
      id: Date.now().toString(),
      provider: formData.provider,
      model: formData.model,
      endpoint: formData.endpoint || null,
      createdAt: new Date(),
    }
    
    setConnections([...connections, newConnection])
    setFormData({ provider: 'openai', model: '', apiKey: '', endpoint: '' })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setConnections(connections.filter(conn => conn.id !== id))
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'openai': return 'bg-green-100 text-green-800'
      case 'local': return 'bg-blue-100 text-blue-800'
      case 'anthropic': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Connections</h1>
            <p className="text-gray-600 mt-2">Manage your AI model configurations for scoring summaries</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Connection
          </Button>
        </div>

        {/* Add Connection Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New AI Connection</CardTitle>
              <CardDescription>Configure a new AI model for scoring your summaries</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Provider</label>
                    <select
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="local">Local Model</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Model</label>
                    <Input
                      placeholder="e.g., gpt-4, claude-3, llama2"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                {formData.provider !== 'local' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">API Key</label>
                    <Input
                      type="password"
                      placeholder="Your API key"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      required
                    />
                  </div>
                )}
                
                {formData.provider === 'local' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Endpoint URL</label>
                    <Input
                      placeholder="http://localhost:11434/api/generate"
                      value={formData.endpoint}
                      onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                      required
                    />
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button type="submit">Add Connection</Button>
                  <Button type="button" outline onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Connections List */}
        <div className="space-y-4">
          {connections.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No AI connections configured</h3>
                <p className="text-gray-600 mb-4">Add your first AI connection to start getting feedback on your summaries</p>
                <Button onClick={() => setShowForm(true)}>Add Connection</Button>
              </CardContent>
            </Card>
          ) : (
            connections.map((connection) => (
              <Card key={connection.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getProviderColor(connection.provider)}>
                            {connection.provider}
                          </Badge>
                          <span className="font-medium">{connection.model}</span>
                        </div>
                        {connection.endpoint && (
                          <p className="text-sm text-gray-600">
                            Endpoint: {connection.endpoint}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Added {connection.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {connection.provider !== 'local' && (
                        <Button
                          outline
                          className="px-3 py-1.5"
                          onClick={() => setShowApiKey(showApiKey === connection.id ? null : connection.id)}
                        >
                          {showApiKey === connection.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      )}
                      <Button
                        outline
                        className="px-3 py-1.5 text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(connection.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {showApiKey === connection.id && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium mb-1">API Key:</p>
                      <p className="text-sm font-mono text-gray-600">sk-...****</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}
