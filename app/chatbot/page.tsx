'use client'

import { useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import Navbar from '@/components/Navbar'
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react'

export default function ChatbotPage() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        // On force l'utilisation du protocole texte pour éviter les erreurs de flux
        streamProtocol: 'text',
        initialMessages: [
            {
                id: '1',
                role: 'assistant',
                content: 'Bonjour ! Je suis votre assistant santé ALAFIA. Comment puis-je vous aider aujourd\'hui ?',
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
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-full">
                                <Bot className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold gradient-text mb-2">
                            Assistant Santé ALAFIA
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Propulsé par Mistral AI
                        </p>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start space-x-3">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">
                            <strong>Urgence :</strong> Appelez le 118 ou le 8200.
                        </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex items-start space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-primary' : 'bg-accent'}`}>
                                    {m.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                                </div>
                                <div className={`flex-1 px-4 py-3 rounded-lg shadow-sm border ${m.role === 'user' ? 'bg-primary text-white' : 'bg-white'}`}>
                                    <div className="text-sm prose prose-sm max-w-none whitespace-pre-line">
                                        {m.content}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && messages[messages.length - 1]?.role === 'user' && (
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="px-4 py-3 rounded-lg bg-white border flex items-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    <span className="text-sm text-muted-foreground italic">ALAFIA réfléchit...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-4 shadow-lg">
                        <div className="flex items-end space-x-3">
                            <textarea
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                placeholder="Posez votre question de santé..."
                                rows={1}
                                className="flex-1 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-sm resize-none"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="bg-primary text-white p-3 rounded-lg disabled:opacity-50"
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
