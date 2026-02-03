'use client'

import { useRef, useEffect, useState } from 'react'
import { useChat } from 'ai/react'
import Navbar from '@/components/Navbar'
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react'

export default function ChatbotPage() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        initialMessages: [
            {
                id: '1',
                role: 'assistant',
                content: 'Bonjour ! Je suis votre assistant santé ALAFIA. Je peux vous aider avec des conseils de santé de base, des informations sur les symptômes courants et vous orienter si nécessaire. Comment puis-je vous aider aujourd\'hui ?',
            },
        ],
    })

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            const form = (e.target as HTMLTextAreaElement).form
            if (form) form.requestSubmit()
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            <Navbar />

            <main className="pt-20 pb-4 px-4 sm:px-6 lg:px-8 h-screen flex flex-col">
                <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
                    {/* Header */}
                    <div className="text-center mb-6 animate-slide-up">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-full">
                                <Bot className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold gradient-text mb-2">
                            Assistant Santé ALAFIA
                        </h1>
                        <p className="text-muted-foreground">
                            Propulsé par une IA Open Source (Mistral)
                        </p>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">
                            <strong>Important :</strong> Je suis une IA de conseil santé. Mes réponses ne remplacent pas un médecin.
                            En cas d'urgence, appelez le 118 ou le 8200.
                        </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                        {messages.map((message: any) => (
                            <div
                                key={message.id}
                                className={`flex items-start space-x-3 animate-fade-in ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                                    }`}
                            >
                                <div
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                                        ? 'bg-primary'
                                        : 'bg-gradient-to-br from-accent to-primary'
                                        }`}
                                >
                                    {message.role === 'user' ? (
                                        <User className="w-5 h-5 text-white" />
                                    ) : (
                                        <Bot className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                <div
                                    className={`flex-1 px-4 py-3 rounded-lg shadow-sm ${message.role === 'user'
                                        ? 'bg-primary text-white'
                                        : 'bg-white border border-border'
                                        }`}
                                >
                                    <div className="text-sm leading-relaxed whitespace-pre-line prose prose-sm max-w-none">
                                        {message.content.split(/(\*\*.*?\*\*)/).map((part: string, i: number) => {
                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>
                                            }
                                            return part
                                        })}
                                    </div>
                                    <p
                                        className={`text-[10px] mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                                            }`}
                                    >
                                        {message.createdAt?.toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }) || 'En cours...'}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && messages[messages.length - 1]?.role === 'user' && (
                            <div className="flex items-start space-x-3 animate-fade-in">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 px-4 py-3 rounded-lg bg-white border border-border shadow-sm">
                                    <div className="flex items-center space-x-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        <span className="text-sm text-muted-foreground">L'IA réfléchit...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-4 shadow-lg">
                        <div className="flex items-end space-x-3">
                            <textarea
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                placeholder="Décrivez vos symptômes..."
                                rows={2}
                                className="flex-1 resize-none border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-12 h-12 rounded-lg transition-all active:scale-95"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
