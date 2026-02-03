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

    // Système de réponses basé sur des règles (simple chatbot)
    const generateResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase()

        // Maux de tête
        if (lowerMessage.includes('tête') || lowerMessage.includes('migraine') || lowerMessage.includes('céphalée')) {
            return `Pour un mal de tête :\n\n✅ Conseils immédiats :\n- Reposez-vous dans un endroit calme et sombre\n- Buvez beaucoup d'eau (déshydratation fréquente)\n- Appliquez une compresse froide sur le front\n- Évitez les écrans\n\n💊 Médicaments courants :\n- Paracétamol (500mg-1g)\n- Ibuprofène (si pas de contre-indication)\n\n⚠️ Consultez un médecin si :\n- Le mal de tête est soudain et très intense\n- Accompagné de fièvre, raideur de nuque\n- Troubles de la vision\n- Dure plus de 3 jours\n\nVoulez-vous que je vous aide à trouver une pharmacie proche ?`
        }

        // Fièvre
        if (lowerMessage.includes('fièvre') || lowerMessage.includes('température') || lowerMessage.includes('chaud')) {
            return `Pour la fièvre :\n\n🌡️ Mesures immédiates :\n- Prenez votre température\n- Buvez beaucoup d'eau et de liquides\n- Portez des vêtements légers\n- Reposez-vous\n\n💊 Traitement :\n- Paracétamol toutes les 6h (max 4g/jour)\n- Bain tiède (pas froid)\n\n⚠️ Allez à l'hôpital si :\n- Fièvre > 39°C persistante\n- Convulsions\n- Difficultés respiratoires\n- Confusion ou somnolence excessive\n- Chez un nourrisson < 3 mois\n\nLa fièvre est souvent le signe que le corps combat une infection. Voulez-vous localiser une pharmacie ?`
        }

        // Toux
        if (lowerMessage.includes('toux') || lowerMessage.includes('tousse')) {
            return `Pour la toux :\n\n✅ Conseils :\n- Buvez beaucoup d'eau chaude avec du miel et citron\n- Humidifiez l'air de votre chambre\n- Évitez les irritants (fumée, poussière)\n- Dormez avec la tête surélevée\n\n💊 Selon le type :\n- Toux sèche : sirop antitussif\n- Toux grasse : expectorant, hydratation\n\n⚠️ Consultez si :\n- Toux avec sang\n- Difficultés respiratoires\n- Fièvre élevée persistante\n- Dure plus de 3 semaines\n- Douleur thoracique\n\nPuis-je vous aider à trouver une pharmacie ?`
        }

        // Douleurs abdominales
        if (lowerMessage.includes('ventre') || lowerMessage.includes('abdomen') || lowerMessage.includes('estomac') || lowerMessage.includes('diarrhée')) {
            return `Pour les douleurs abdominales :\n\n✅ Mesures générales :\n- Hydratation importante (eau, SRO)\n- Alimentation légère (riz, banane, pain grillé)\n- Évitez les aliments gras et épicés\n- Repos\n\n💊 Selon les symptômes :\n- Diarrhée : SRO, probiotiques\n- Constipation : fibres, eau\n- Brûlures d'estomac : antiacides\n\n🚨 URGENCE - Allez à l'hôpital si :\n- Douleur intense et soudaine\n- Sang dans les selles\n- Vomissements persistants\n- Fièvre élevée\n- Abdomen dur et gonflé\n- Signes de déshydratation\n\nVoulez-vous que je vous oriente vers une pharmacie ou un hôpital ?`
        }

        // Grossesse
        if (lowerMessage.includes('enceinte') || lowerMessage.includes('grossesse') || lowerMessage.includes('bébé')) {
            return `Conseils pour la grossesse :\n\n✅ Suivi essentiel :\n- Consultations prénatales régulières\n- Échographies aux trimestres recommandés\n- Suppléments : acide folique, fer, calcium\n\n🥗 Alimentation :\n- Repas équilibrés et variés\n- Beaucoup d'eau (2-3L/jour)\n- Évitez : alcool, tabac, viandes crues\n\n⚠️ Signaux d'alerte - Consultez immédiatement :\n- Saignements vaginaux\n- Douleurs abdominales intenses\n- Maux de tête sévères\n- Gonflement soudain des mains/visage\n- Diminution des mouvements du bébé\n- Fièvre élevée\n\n💡 ALAFIA propose un suivi de grossesse personnalisé ! Créez un compte pour bénéficier de rappels et conseils adaptés à votre terme.\n\nVoulez-vous créer un profil de suivi de grossesse ?`
        }

        // Paludisme (très courant au Togo)
        if (lowerMessage.includes('palu') || lowerMessage.includes('malaria') || lowerMessage.includes('moustique')) {
            return `Concernant le paludisme :\n\n🦟 Symptômes typiques :\n- Fièvre élevée avec frissons\n- Maux de tête intenses\n- Douleurs musculaires\n- Nausées et vomissements\n- Fatigue extrême\n\n⚠️ IMPORTANT :\nLe paludisme est une URGENCE MÉDICALE au Togo.\nConsultez IMMÉDIATEMENT un centre de santé pour :\n- Test de diagnostic rapide (TDR)\n- Traitement antipaludéen approprié\n\n🛡️ Prévention :\n- Moustiquaire imprégnée\n- Répulsifs anti-moustiques\n- Vêtements longs le soir\n- Éliminer les eaux stagnantes\n\n❌ NE VOUS AUTO-MÉDICAMENTEZ PAS\nUn traitement inadapté peut être dangereux.\n\nVoulez-vous que je vous indique l'hôpital le plus proche ?`
        }

        // Diabète
        if (lowerMessage.includes('diabète') || lowerMessage.includes('sucre') || lowerMessage.includes('glycémie')) {
            return `Gestion du diabète :\n\n📊 Suivi essentiel :\n- Contrôle régulier de la glycémie\n- Consultations médicales régulières\n- Respect du traitement prescrit\n\n🥗 Alimentation :\n- Limitez les sucres rapides\n- Privilégiez les fibres (légumes, céréales complètes)\n- Repas réguliers et équilibrés\n- Hydratation suffisante\n\n💪 Activité physique :\n- 30 minutes de marche quotidienne\n- Exercices réguliers adaptés\n\n⚠️ Signes d'urgence :\n- Hypoglycémie : tremblements, sueurs, confusion\n- Hyperglycémie : soif intense, urines fréquentes\n- Plaies qui ne guérissent pas\n\n💡 ALAFIA propose un suivi personnalisé pour les personnes âgées avec gestion des traitements et rappels !\n\nVoulez-vous créer un profil de suivi santé ?`
        }

        // Hypertension
        if (lowerMessage.includes('tension') || lowerMessage.includes('hypertension') || lowerMessage.includes('pression')) {
            return `Gestion de la tension artérielle :\n\n📊 Surveillance :\n- Contrôlez régulièrement votre tension\n- Notez les valeurs (matin et soir)\n- Consultations médicales régulières\n\n🥗 Hygiène de vie :\n- Réduisez le sel dans l'alimentation\n- Alimentation riche en fruits et légumes\n- Évitez l'alcool et le tabac\n- Gestion du stress\n\n💪 Activité physique :\n- Marche quotidienne\n- Exercices modérés réguliers\n\n⚠️ Consultez en urgence si :\n- Maux de tête sévères\n- Troubles de la vision\n- Douleur thoracique\n- Essoufflement important\n- Saignement de nez persistant\n\n💊 Prenez vos médicaments comme prescrits, même si vous vous sentez bien !\n\nVoulez-vous un rappel pour vos médicaments ?`
        }

        // Don de sang
        if (lowerMessage.includes('sang') || lowerMessage.includes('don') || lowerMessage.includes('donneur')) {
            return `Don de sang :\n\n✅ Conditions pour donner :\n- Âge : 18-65 ans\n- Poids : > 50 kg\n- Bonne santé générale\n- Pas de maladie transmissible\n\n📅 Fréquence :\n- Hommes : tous les 3 mois\n- Femmes : tous les 4 mois\n\n🏥 Où donner à Lomé :\n- Centre National de Transfusion Sanguine (CNTS)\n- CHU Sylvanus Olympio\n- Hôpitaux régionaux lors de collectes\n\n💡 ALAFIA propose un profil donneur de sang !\nVous serez alerté quand votre groupe sanguin est recherché.\n\nVoulez-vous créer un profil donneur ?`
        }

        // Médicaments généraux
        if (lowerMessage.includes('médicament') || lowerMessage.includes('pharmacie') || lowerMessage.includes('acheter')) {
            return `Concernant les médicaments :\n\n✅ Conseils importants :\n- Respectez toujours les prescriptions médicales\n- Ne partagez pas vos médicaments\n- Vérifiez les dates de péremption\n- Conservez-les correctement (à l'abri de la chaleur)\n\n⚠️ Auto-médication :\nCertains médicaments peuvent être dangereux sans avis médical.\nEn cas de doute, consultez un professionnel de santé.\n\n💊 Médicaments courants disponibles sans ordonnance :\n- Paracétamol (douleurs, fièvre)\n- Ibuprofène (douleurs, inflammation)\n- Antiacides (brûlures d'estomac)\n- SRO (réhydratation)\n\n🔍 Je peux vous aider à :\n- Trouver une pharmacie proche\n- Localiser un médicament spécifique\n- Trouver une pharmacie de garde\n\nQue recherchez-vous exactement ?`
        }

        // Urgences
        if (lowerMessage.includes('urgence') || lowerMessage.includes('grave') || lowerMessage.includes('hôpital')) {
            return `🚨 URGENCES MÉDICALES :\n\n📞 Numéros d'urgence au Togo :\n- SAMU : 8200\n- Pompiers : 118\n- Police : 117\n\n🏥 Hôpitaux principaux à Lomé :\n- CHU Sylvanus Olympio (Tokoin)\n- CHU Campus (Université de Lomé)\n- Clinique Biasa\n- Polyclinique Internationale\n\n⚠️ Situations d'urgence :\n- Difficultés respiratoires sévères\n- Douleur thoracique\n- Perte de conscience\n- Saignements importants\n- Traumatisme grave\n- Convulsions\n- Brûlures étendues\n\n👉 EN CAS D'URGENCE VITALE :\nAPPELEZ IMMÉDIATEMENT LE 8200 OU RENDEZ-VOUS AUX URGENCES !\n\nVoulez-vous que je vous aide à localiser l'hôpital le plus proche ?`
        }

        // Réponse par défaut
        return `Je comprends votre préoccupation. Pour vous aider au mieux, pourriez-vous me donner plus de détails sur :\n\n- Vos symptômes précis\n- Depuis quand vous les ressentez\n- Leur intensité (légère, modérée, sévère)\n- D'autres signes associés\n\n💡 Je peux vous aider avec :\n✅ Conseils santé de base\n✅ Orientation vers les soins appropriés\n✅ Recherche de pharmacies et médicaments\n✅ Informations sur les maladies courantes\n\n⚠️ Rappel important :\nJe ne remplace pas un médecin. En cas de symptômes graves ou persistants, consultez un professionnel de santé.\n\nComment puis-je vous aider ?`
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
