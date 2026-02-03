'use client'

import { useState, useRef, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react'
import type { ChatMessage } from '@/types'

export default function ChatbotPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Bonjour ! Je suis votre assistant santé ALAFIA. Je peux vous aider avec des conseils de santé de base, des informations sur les symptômes courants et vous orienter si nécessaire. Comment puis-je vous aider aujourd\'hui ?',
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const [diseasesData, setDiseasesData] = useState<any[]>([])

    // Charger les connaissances médicales
    useEffect(() => {
        fetch('/api/diseases')
            .then(res => res.json())
            .then(data => {
                if (data.success) setDiseasesData(data.data)
            })
            .catch(err => console.error('Erreur chargement maladies:', err))
    }, [])

    const generateResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase()

        // 1. Recherche dans la base de données de maladies
        const match = diseasesData.find(disease =>
            disease.keywords.some((kw: string) => lowerMessage.includes(kw.toLowerCase()))
        )

        if (match) {
            let response = `${match.title}\n\n${match.description}\n\n`

            if (match.advice) response += `✅ **Conseils :**\n${match.advice}\n\n`
            if (match.symptoms) response += `📝 **Symptômes :**\n${match.symptoms.map((s: string) => `- ${s}`).join('\n')}\n\n`
            if (match.warning) response += `⚠️ **Attention :**\n${match.warning}\n\n`

            if (match.emergency) {
                response += `🚨 **URGENCE : Appelez immédiatement le 118 (Pompiers) ou le 8200 (SAMU).**`
            }

            return response
        }

        // 2. Gestion des salutations
        if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
            return `Bonjour ! Comment puis-je vous aider aujourd'hui ? Vous pouvez me parler de vos symptômes ou me demander des conseils de santé.`
        }

        // 3. Défaut
        return `Je ne suis pas sûr de comprendre votre demande spécifique. Je suis un assistant santé formé pour vous aider avec les maladies courantes au Togo et les premiers soins.
        
Pouvez-vous décrire vos symptômes ? (Exemple : "J'ai mal à la gorge", "fièvre", "paludisme", etc.)

*En cas d'urgence vitale, appelez le 118 ou le 8200.*`
    }

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        // Simuler un délai de réponse
        setTimeout(() => {
            const response = generateResponse(input)
            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, assistantMessage])
            setIsLoading(false)
        }, 1000)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
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
                            Posez vos questions santé, je suis là pour vous aider
                        </p>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">
                            <strong>Important :</strong> Je fournis des conseils de santé généraux et ne remplace pas un médecin.
                            En cas d'urgence ou de symptômes graves, consultez immédiatement un professionnel de santé.
                        </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                        {messages.map((message) => (
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
                                    className={`flex-1 px-4 py-3 rounded-lg ${message.role === 'user'
                                        ? 'bg-primary text-white'
                                        : 'bg-white border border-border'
                                        }`}
                                >
                                    <div className="text-sm leading-relaxed whitespace-pre-line">
                                        {message.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>
                                            }
                                            return part
                                        })}
                                    </div>
                                    <p
                                        className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                                            }`}
                                    >
                                        {message.timestamp.toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex items-start space-x-3 animate-fade-in">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 px-4 py-3 rounded-lg bg-white border border-border">
                                    <div className="flex items-center space-x-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        <span className="text-sm text-muted-foreground">En train de réfléchir...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="bg-white rounded-xl border border-border p-4 shadow-lg">
                        <div className="flex items-end space-x-3">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Décrivez vos symptômes ou posez votre question..."
                                rows={2}
                                className="flex-1 resize-none border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-12 h-12 rounded-lg"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
