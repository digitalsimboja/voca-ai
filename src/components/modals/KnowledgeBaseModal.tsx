'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Upload, FileText, Database, X } from 'lucide-react'

interface KnowledgeBaseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (knowledgeBase: Record<string, unknown>) => void
  agentName: string
  currentKnowledgeBase?: Record<string, unknown>
}

export default function KnowledgeBaseModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  agentName, 
  currentKnowledgeBase 
}: KnowledgeBaseModalProps) {
  const [knowledgeBase, setKnowledgeBase] = useState<{
    name: string
    description: string
    content: string
    files: Array<{ name: string; size: number; type: string }>
    sources: Array<{ url: string; description: string }>
  }>({
    name: (currentKnowledgeBase?.name as string) || '',
    description: (currentKnowledgeBase?.description as string) || '',
    content: (currentKnowledgeBase?.content as string) || '',
    files: (currentKnowledgeBase?.files as Array<{ name: string; size: number; type: string }>) || [],
    sources: (currentKnowledgeBase?.sources as Array<{ url: string; description: string }>) || []
  })


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    // Add file info to knowledge base
    const fileInfo = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    }))
    
    setKnowledgeBase(prev => ({
      ...prev,
      files: [...prev.files, ...fileInfo]
    }))
  }

  const handleRemoveFile = (index: number) => {
    setKnowledgeBase(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const handleAddSource = () => {
    setKnowledgeBase(prev => ({
      ...prev,
      sources: [...prev.sources, { url: '', description: '' }]
    }))
  }

  const handleRemoveSource = (index: number) => {
    setKnowledgeBase(prev => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index)
    }))
  }

  const handleSourceChange = (index: number, field: 'url' | 'description', value: string) => {
    setKnowledgeBase(prev => ({
      ...prev,
      sources: prev.sources.map((source, i) => 
        i === index ? { ...source, [field]: value } : source
      )
    }))
  }

  const handleSubmit = () => {
    onSubmit({
      ...knowledgeBase,
      lastUpdated: new Date().toISOString(),
      fileCount: knowledgeBase.files.length,
      sourceCount: knowledgeBase.sources.length
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Knowledge Base Management</h2>
            <p className="text-sm text-gray-600">Configure knowledge base for {agentName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Basic Information
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Knowledge Base Name
                  </label>
                  <input
                    type="text"
                    value={knowledgeBase.name}
                    onChange={(e) => setKnowledgeBase({
                      ...knowledgeBase,
                      name: e.target.value
                    })}
                    placeholder="Enter knowledge base name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={knowledgeBase.description}
                    onChange={(e) => setKnowledgeBase({
                      ...knowledgeBase,
                      description: e.target.value
                    })}
                    placeholder="Brief description of the knowledge base"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Input */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Knowledge Content
              </h3>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (Text Input)
                </label>
                <textarea
                  value={knowledgeBase.content}
                  onChange={(e) => setKnowledgeBase({
                    ...knowledgeBase,
                    content: e.target.value
                  })}
                  placeholder="Enter knowledge base content, FAQs, product information, policies, etc..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  You can paste text content, FAQs, product information, company policies, or any relevant information here.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                File Upload
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Files
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop files here, or click to select files
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      Choose Files
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: PDF, DOC, DOCX, TXT, CSV, XLSX, XLS
                    </p>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {knowledgeBase.files.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h4>
                    <div className="space-y-2">
                      {knowledgeBase.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* External Sources */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  External Sources
                </h3>
                <button
                  onClick={handleAddSource}
                  className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700"
                >
                  Add Source
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {knowledgeBase.sources.map((source, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1 space-y-2">
                      <input
                        type="url"
                        value={source.url}
                        onChange={(e) => handleSourceChange(index, 'url', e.target.value)}
                        placeholder="Enter URL (e.g., https://example.com/docs)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={source.description}
                        onChange={(e) => handleSourceChange(index, 'description', e.target.value)}
                        placeholder="Description of this source"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveSource(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {knowledgeBase.sources.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No external sources added yet. Click &quot;Add Source&quot; to include web pages, documentation, or other online resources.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Knowledge Base Summary</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {knowledgeBase.content.length > 0 ? Math.ceil(knowledgeBase.content.length / 100) : 0}
                  </p>
                  <p className="text-gray-600">Content Blocks</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">{knowledgeBase.files.length}</p>
                  <p className="text-gray-600">Files Uploaded</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{knowledgeBase.sources.length}</p>
                  <p className="text-gray-600">External Sources</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Save Knowledge Base
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
