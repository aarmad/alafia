'use client'

import { useRef, useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react'

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt?: Date;
}

export default function ChatbotPage() {
    const [chatInput, setChatInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Bonjour ! Je suis votre assistant santé ALAFIA. Comment puis-je vous aider aujourd\'hui ?',
            createdAt: new Date()
        },
    ])
    const [isLoading, setIsLoading] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!chatInput.trim() || isLoading) return

        const userContent = chatInput
        setChatInput('')

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: userContent,
            createdAt: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            })

            const data = await response.json()

            if (data.messages && data.messages.length > 0) {
                const aiMessage: Message = {
                    ...data.messages[0],
                    id: Date.now().toString() + '-ai',
                    createdAt: new Date()
                }
                setMessages(prev => [...prev, aiMessage])
            } else {
                throw new Error("Réponse vide de l'IA")
            }
        } catch (error) {
            console.error("Erreur Chatbot:", error)
            const errorMessage: Message = {
                id: Date.now().toString() + '-error',
                role: 'assistant',
                content: "Désolé, je rencontre une difficulté technique. Veuillez vérifier votre connexion ou réessayer plus tard.",
                createdAt: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

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
                            <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-full shadow-lg">
                                <Bot className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold gradient-text mb-2 text-primary">
                            Assistant Santé ALAFIA
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Propulsé par Mistral AI (Togo)
                        </p>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start space-x-3 shadow-sm">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">
                            <strong>Urgence :</strong> Appelez le 118 (Pompiers) ou le 8200 (SAMU).
                        </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex items-start space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${m.role === 'user' ? 'bg-primary' : 'bg-gradient-to-br from-accent to-primary'}`}>
                                    {m.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                                </div>
                                <div className={`flex-1 px-4 py-3 rounded-lg shadow-sm border ${m.role === 'user' ? 'bg-primary text-white' : 'bg-white'}`}>
                                    <div className="text-sm prose prose-sm max-w-none whitespace-pre-line">
                                        {m.content}
                                    </div>
                                    <div className={`text-[10px] mt-1 ${m.role === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                                        {m.createdAt?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex items-start space-x-3 animate-pulse">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-sm">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="px-4 py-3 rounded-lg bg-white border flex items-center space-x-2 shadow-sm">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    <span className="text-sm text-muted-foreground italic">ALAFIA analyse vos symptômes...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleChatSubmit} className="bg-white rounded-xl border p-4 shadow-xl mb-2">
                        <div className="flex items-end space-x-3">
                            <textarea
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Décrivez comment vous vous sentez..."
                                rows={1}
                                className="flex-1 border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-sm resize-none transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!chatInput.trim() || isLoading}
                                className="bg-primary hover:bg-primary/90 text-white p-3 rounded-lg disabled:opacity-50 transition-all active:scale-95 shadow-md"
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
