'use client'

import { useRef, useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Send, Bot, User, Loader2, AlertCircle, Phone } from 'lucide-react'

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
            content: 'Bonjour ! Je suis ALAFIA, votre assistant santé. Comment puis-je vous aider aujourd\'hui ?',
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
                throw new Error("Réponse vide")
            }
        } catch (error) {
            console.error("Chat Error:", error)
            const errorMsg: Message = {
                id: Date.now().toString() + '-err',
                role: 'assistant',
                content: "Désolé, je rencontre un problème de connexion. Vérifiez votre clé API ou réessayez.",
                createdAt: new Date()
            }
            setMessages(prev => [...prev, errorMsg])
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
                    <div className="text-center mb-4">
                        <div className="flex items-center justify-center mb-3">
                            <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-full shadow-lg">
                                <Bot className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-primary">ALAFIA AI</h1>
                        <p className="text-muted-foreground text-xs">Assistant Santé Intégré (Togo)</p>
                    </div>

                    {/* Emergency Info */}
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 shadow-sm flex items-start space-x-3">
                        <Phone className="w-5 h-5 text-red-600 flex-shrink-0 animate-pulse" />
                        <div className="text-xs text-red-900 leading-tight">
                            <strong>URGENCES TOGO :</strong> Pompiers: <b>118</b> | Police: <b>177</b> | Gendarmerie: <b>117</b> | Violences: <b>1014</b>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/50 shadow-inner">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                <div className={`flex items-start max-w-[85%] space-x-2 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-primary' : 'bg-gradient-to-br from-accent to-primary shadow-sm'}`}>
                                        {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                    </div>
                                    <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border text-foreground rounded-tl-none'}`}>
                                        <div className="prose prose-sm max-w-none whitespace-pre-line leading-relaxed">
                                            {m.content}
                                        </div>
                                        <div className={`text-[10px] mt-1 opacity-60 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                                            {m.createdAt?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex items-center space-x-2 bg-white/80 border px-4 py-2 rounded-2xl shadow-sm">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    <span className="text-xs text-muted-foreground italic">ALAFIA rédige une réponse...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleChatSubmit} className="bg-white rounded-2xl border p-2 shadow-xl flex items-center space-x-2">
                        <textarea
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Comment vous sentez-vous ?"
                            rows={1}
                            className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-sm resize-none"
                        />
                        <button
                            type="submit"
                            disabled={!chatInput.trim() || isLoading}
                            className="bg-primary hover:bg-primary/90 text-white p-3 rounded-xl disabled:opacity-40 transition-all shadow-md active:scale-90"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
