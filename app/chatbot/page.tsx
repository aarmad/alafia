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

    const generateResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase()

        // --- URGENCES VITALES (Priorité absolue) ---

        // AVC
        if (lowerMessage.includes('avc') || (lowerMessage.includes('visage') && lowerMessage.includes('paralysé')) || (lowerMessage.includes('parler') && lowerMessage.includes('impossible'))) {
            return `🚨 SUSPICION D'AVC - AGISSEZ VITE (VITE) !
            
⚠️ Appelez immédiatement le SAMU (8200) ou les Pompiers (118).

Signes d'alerte (VITE) :
- **V**isage paralysé (une lèvre tombe ?)
- **I**nertie d'un membre (bras ou jambe qui ne bouge plus ?)
- **T**rouble de la parole (difficulté à parler ?)
- **E**n urgence, appelez le 118 !

Ne donnez rien à manger ni à boire. Allongez la personne en attendant les secours.`
        }

        // --- MALADIES COURANTES AU TOGO ---

        // Paludisme (Malaria) - Très complet car critique
        if (lowerMessage.includes('palu') || lowerMessage.includes('malaria') || (lowerMessage.includes('fièvre') && lowerMessage.includes('frisson'))) {
            return `🦟 **Suspicion de Paludisme**

Le paludisme est la première cause de consultation au Togo. C'est une urgence.

**Symptômes fréquents :**
- Fièvre élevée (> 38°C) par accès
- Frissons intenses et sueurs
- Maux de tête et courbatures
- Nausées ou vomissements
- Fatigue extrême

**🚑 ACTION IMMÉDIATE :**
1. **Ne prenez pas de médicaments au hasard.**
2. Rendez-vous au centre de santé le plus proche pour un **TDR (Test Rapide)** ou une Goutte Épaisse.
3. Si le test est positif, suivez le traitement (Artémisinine) prescrit jusqu'au bout.

**⚠️ DANGER :**
Chez l'enfant ou la femme enceinte, le paludisme tue rapidement. Consultez dès les premiers signes de fièvre.`
        }

        // Typhoïde
        if (lowerMessage.includes('typho') || (lowerMessage.includes('fièvre') && lowerMessage.includes('ventre') && lowerMessage.includes('dure'))) {
            return `🦠 **Fièvre Typhoïde ?**

Si vous avez une fièvre qui dure depuis plusieurs jours avec des maux de ventre, cela peut être la typhoïde.

**Signes :**
- Fièvre qui monte progressivement (en "plateau")
- Maux de tête intenses
- Douleurs abdominales, diarrhée ou constipation
- Fatigue extrême (tuphos)

**Conseil :**
Consultez un médecin pour une analyse de sang (Widal) et de selles. Ne vous soignez pas seul, des antibiotiques spécifiques sont nécessaires.`
        }

        // Choléra (Diarrhée eau de riz)
        if (lowerMessage.includes('choléra') || (lowerMessage.includes('diarrhée') && lowerMessage.includes('eau') && lowerMessage.includes('riz'))) {
            return `🚨 **ALERTE CHOLÉRA / DIARRHÉE SÉVÈRE**

Si vous avez des diarrhées très liquides (comme de l'eau de riz) et abondantes :

1. **URGENCE : Risque de décès par déshydratation en quelques heures.**
2. Buvez immédiatement et continuellement (SRO - Sels de Réhydratation Orale, ou eau + sucre + sel).
3. Rendez-vous immédiatement à l'hôpital.
4. Isolez le malade et lavez-vous les mains à l'eau de javel diluée.`
        }

        // --- SYMPTÔMES COURANTS ---

        // Maux de tête
        if (lowerMessage.includes('tête') || lowerMessage.includes('migraine')) {
            return `� **Maux de tête / Migraine**

**Pour soulager :**
1. Repos au calme et dans le noir.
2. Hydratation (buvez 2 verres d'eau).
3. Paracétamol (Doliprane/Efferalgan) : 500mg ou 1g (selon poids).

**⚠️ Consultez si :**
- "Le pire mal de tête de votre vie" (soudain)
- Raideur de la nuque + Fièvre (Méningite ?)
- Après un choc à la tête`
        }

        // Fièvre (Distinction Enfant/Adulte)
        if (lowerMessage.includes('fièvre') || lowerMessage.includes('chaud')) {
            if (lowerMessage.includes('bébé') || lowerMessage.includes('enfant')) {
                return `👶 **Fièvre chez l'enfant**

1. **Découvrez l'enfant** (body ou couche simple).
2. **Faites-le boire** souvent (eau ou SRO).
3. **Paracétamol** : Dose poids toutes les 6h.
4. **Bain** : 2°C en dessous de sa température (tiède, jamais froid).

**🏥 HOPITAL IMMÉDIAT SI :**
- Bébé de moins de 3 mois
- Convulsions
- Taches sur la peau
- Enfant mou qui ne réagit pas`
            }
            return `🌡️ **Fièvre Adulte**

- Repos et hydratation maximum.
- Paracétamol 1g toutes les 6h si besoin.
- Surveillez l'apparition d'autres signes (toux, brûlures urinaires, maux de ventre) pour identifier la cause (Palu ? Grippe ? Infection ?).

Si la fièvre dépasse 48h, consultez un médecin.`
        }

        // Maux de ventre
        if (lowerMessage.includes('ventre') || lowerMessage.includes('estomac')) {
            if (lowerMessage.includes('règle') || lowerMessage.includes('menstru')) {
                return `🌸 **Douleurs menstruelles**
                
- Chaleur sur le ventre (bouillotte).
- Antispasmodique (Spasfon) + Ibuprofène.
- Repos.`
            }
            return `🤢 **Maux de ventre**

- **Brûlures (estomac) ?** Anti-acide (Maalox, Gaviscon). Évitez piment/café.
- **Crampes + Diarrhée ?** SRO + Smecta. Mangez du riz/banane.
- **Douleur bas droite + Fièvre ?** Possible Appendicite -> Urgences.

Si la douleur est insupportable, contactez un médecin.`
        }

        // Rhume / Grippe
        if (lowerMessage.includes('rhume') || lowerMessage.includes('nez') || lowerMessage.includes('grippe') || lowerMessage.includes('courbature')) {
            return `🤧 **Syndrome Grippal / Rhume**

C'est probablement viral. Les antibiotiques sont inutiles.

**Traitement :**
- Lavage de nez (sérum phy ou eau de mer).
- Paracétamol pour la fièvre/douleurs.
- Repos et Vitamine C (Oranges, Citrons).
- Miel pour la gorge.

Consultez si vous avez du mal à respirer.`
        }

        // --- QUESTIONS PRATIQUES ---

        // Pharmacies de garde
        if (lowerMessage.includes('garde') || lowerMessage.includes('ouverte') || lowerMessage.includes('nuit')) {
            return `🌙 **Pharmacies de Garde**

Vous pouvez voir les pharmacies de garde directement sur la **page d'accueil** d'ALAFIA.
Elles sont indiquées par un badge vert "DE GARDE".

Voulez-vous que je vous donne le lien vers la liste ?`
        }

        // --- DÉFAUT ---
        return `Je suis un assistant médical intelligent, mais je ne suis pas un docteur.

Je peux vous aider sur :
- 🦟 Le Paludisme
- 🌡️ La Fièvre (Enfant/Adulte)
- 🤕 Les migraines
- 🤰 La grossesse
- 📍 Les pharmacies de garde

Décrivez simplement ce que vous ressentez (exemple : *"J'ai de la fièvre et je tremble"*).

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
                                    <p className="whitespace-pre-line text-sm leading-relaxed">
                                        {message.content}
                                    </p>
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
