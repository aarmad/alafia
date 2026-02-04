"use client"

import { useState, useEffect } from 'react'
import { User, Users, FileText, Bell, Plus, Search, Activity, Calendar, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Modal, ModalContent, ModalTrigger, ModalHeader, ModalTitle } from '@/components/Modal'

export default function DoctorDashboard({ user }: { user: any }) {
    const profile = user.profile
    const [publications, setPublications] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isPubModalOpen, setIsPubModalOpen] = useState(false)

    // Pub form state
    const [pubTitle, setPubTitle] = useState('')
    const [pubContent, setPubContent] = useState('')
    const [pubType, setPubType] = useState('info')

    const fetchMyPublications = async () => {
        try {
            const res = await fetch('/api/publications')
            const data = await res.json()
            if (data.success) {
                // Filtrer par auteur si on avait l'ID, mais ici on prend tout pour l'instant
                setPublications(data.data)
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchMyPublications()
    }, [])

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/publications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: pubTitle,
                    content: pubContent,
                    type: pubType
                })
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Publication réussie !")
                setPubTitle('')
                setPubContent('')
                setIsPubModalOpen(false)
                fetchMyPublications()
            } else {
                toast.error(data.message)
            }
        } catch (e) {
            toast.error("Erreur lors de la publication")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Dr. {profile.name}</h1>
                        <p className="text-gray-500">{profile.specialization} - {profile.hospital}</p>
                    </div>
                </div>

                <Modal open={isPubModalOpen} onOpenChange={setIsPubModalOpen}>
                    <ModalTrigger asChild>
                        <button className="btn-primary px-6 py-3 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                            <Plus className="w-5 h-5" />
                            Nouvelle Publication
                        </button>
                    </ModalTrigger>
                    <ModalContent className="max-w-2xl">
                        <ModalHeader>
                            <ModalTitle className="text-2xl font-bold">Créer une publication / alerte</ModalTitle>
                        </ModalHeader>
                        <form onSubmit={handlePublish} className="space-y-4 pt-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Titre</label>
                                <input
                                    className="input-field w-full"
                                    placeholder="Ex: Alerte Épidémie de Grippe"
                                    value={pubTitle}
                                    onChange={e => setPubTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Type</label>
                                <select
                                    className="input-field w-full"
                                    value={pubType}
                                    onChange={e => setPubType(e.target.value)}
                                >
                                    <option value="info">Information</option>
                                    <option value="alert">Alerte Santé</option>
                                    <option value="health-tip">Conseil Santé</option>
                                    <option value="event">Événement / Campagne</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Contenu</label>
                                <textarea
                                    className="input-field w-full min-h-[200px]"
                                    placeholder="Décrivez votre message ici..."
                                    value={pubContent}
                                    onChange={e => setPubContent(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-4 text-lg"
                            >
                                {loading ? 'Publication en cours...' : 'Publier maintenant'}
                            </button>
                        </form>
                    </ModalContent>
                </Modal>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patients Suivis */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Patients en Maladie Chronique
                            </h2>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                        <div className="p-0">
                            <div className="bg-blue-50/50 p-8 text-center">
                                <Activity className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                                <h3 className="text-gray-500 font-medium">Aucun patient n'a encore rejoint votre liste.</h3>
                                <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                                    Partagez votre ID docteur pour permettre à vos patients de synchroniser leur état de santé.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mes Publications */}
                    <div className="bg-white rounded-2xl border shadow-sm p-6">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-orange-500" />
                            Mes Dernières Publications
                        </h2>
                        <div className="space-y-4">
                            {publications.slice(0, 3).map((pub, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-xl border hover:bg-gray-50 transition-colors">
                                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${pub.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900">{pub.title}</h3>
                                            <span className="text-[10px] text-gray-400">{new Date(pub.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{pub.content}</p>
                                    </div>
                                </div>
                            ))}
                            {publications.length === 0 && (
                                <p className="text-center py-10 text-gray-400 italic">Vous n'avez pas encore publié.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Doctor */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border shadow-sm">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-yellow-500" />
                            Notifications
                        </h3>
                        <div className="space-y-3">
                            <div className="text-sm p-3 bg-gray-50 rounded-lg text-gray-600 border-l-4 border-primary">
                                Bienvenue sur Alafia ! Commencez à publier des alertes santé.
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Agenda Médical
                        </h3>
                        <p className="text-xs opacity-80 mb-4">Gérez vos rendez-vous et votre disponibilité.</p>
                        <button className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2">
                            Voir le planning
                            <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
