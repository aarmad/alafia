"use client"

import { useState } from 'react'
import { Calendar, Baby, Activity, Utensils, Droplets, Heart, Edit2, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import { Modal, ModalContent, ModalTrigger, ModalHeader, ModalTitle, ModalDescription } from '@/components/Modal'

export default function PregnantDashboard({ user }: { user: any }) {
    const [profile, setProfile] = useState(user.profile)
    const [weeksPregnant, setWeeksPregnant] = useState(user.profile?.weeksPregnant || 0)
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Form
    const [newWeeks, setNewWeeks] = useState(weeksPregnant)

    const dueDate = profile?.dueDate ? new Date(profile.dueDate) : new Date()
    const progress = Math.min((weeksPregnant / 40) * 100, 100)

    const updateWeeks = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ updates: { weeksPregnant: parseInt(newWeeks) } })
            })
            const data = await res.json()
            if (data.success) {
                setProfile(data.data.user.profile)
                setWeeksPregnant(data.data.user.profile.weeksPregnant)
                // Update local storage
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
                currentUser.profile = data.data.user.profile
                localStorage.setItem('user', JSON.stringify(currentUser))

                toast.success("Suivi mis à jour avec succès !")
                setIsModalOpen(false)
            }
        } catch (e) {
            toast.error("Erreur de mise à jour")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Félicitations, {profile?.name || 'Future Maman'} !</h1>
                    <p className="text-gray-600">Suivi de votre grossesse</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-pink-100 flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-pink-500" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Date prévue</p>
                        <p className="font-bold text-gray-800">{format(dueDate, 'd MMMM yyyy', { locale: fr })}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Progress Bar Interactive */}
                    <div className="bg-white rounded-2xl p-6 border shadow-sm">
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                <Baby className="w-5 h-5 text-pink-500" />
                                Ma Progression
                            </h2>

                            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                                <ModalTrigger asChild>
                                    <button
                                        className="text-sm bg-pink-50 text-pink-600 px-3 py-1 rounded-full font-medium hover:bg-pink-100 transition-colors flex items-center gap-2"
                                        onClick={() => setNewWeeks(weeksPregnant)} // Reset to current on open
                                    >
                                        Semaine {weeksPregnant}
                                        <Edit2 className="w-3 h-3" />
                                    </button>
                                </ModalTrigger>
                                <ModalContent>
                                    <ModalHeader className="mb-4">
                                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Baby className="w-6 h-6 text-pink-500" />
                                        </div>
                                        <ModalTitle className="text-lg font-bold text-center">Mettre à jour ma grossesse</ModalTitle>
                                        <ModalDescription className="text-sm text-gray-500 text-center">Où en êtes-vous aujourd'hui ?</ModalDescription>
                                    </ModalHeader>
                                    <form onSubmit={updateWeeks} className="space-y-6">
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-2 text-center">
                                                Nombre de semaines (aménorrhée)
                                            </label>
                                            <div className="flex items-center justify-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setNewWeeks(Math.max(0, parseInt(newWeeks) - 1))}
                                                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    className="text-3xl font-bold text-center w-20 bg-transparent border-none focus:ring-0 text-pink-600"
                                                    value={newWeeks}
                                                    onChange={(e) => setNewWeeks(e.target.value)}
                                                    min="0" max="42"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setNewWeeks(Math.min(42, parseInt(newWeeks) + 1))}
                                                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary w-full bg-pink-500 hover:bg-pink-600 border-pink-600 text-white"
                                        >
                                            {loading ? 'Mise à jour...' : 'Valider'}
                                        </button>
                                    </form>
                                </ModalContent>
                            </Modal>
                        </div>

                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden mb-2">
                            <div
                                className="bg-gradient-to-r from-pink-400 to-pink-600 h-full rounded-full transition-all duration-1000"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-center text-sm font-medium text-pink-600">
                            {Math.round(progress)}% du chemin parcouru !
                        </p>
                    </div>

                    {/* Conseils du jour (Statique pour l'instant) */}
                    <div className="bg-white rounded-2xl p-6 border shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4">Vos Conseils Santé</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                                <Droplets className="w-5 h-5 text-blue-500 mt-1" />
                                <div>
                                    <p className="font-bold text-blue-800">Hydratation</p>
                                    <p className="text-sm text-blue-600">Buvez au moins 2L d'eau aujourd'hui.</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3">
                                <Utensils className="w-5 h-5 text-green-500 mt-1" />
                                <div>
                                    <p className="font-bold text-green-800">Alimentation</p>
                                    <p className="text-sm text-green-600">Privilégiez les aliments riches en fer.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Heart className="w-5 h-5 text-purple-600" />
                            <h3 className="font-bold text-purple-800">Besoin d'aide ?</h3>
                        </div>
                        <p className="text-sm text-purple-600 mb-4">Posez vos questions à notre IA médicale.</p>
                        <a href="/chatbot" className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 transition-colors">
                            Parler au mini-docteur
                        </a>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-pink-500" />
                            Prochain RDV
                        </h3>
                        <div className="text-center py-4 text-gray-400 text-sm">
                            Aucun rendez-vous prévu.
                        </div>
                        <button className="w-full mt-2 text-pink-600 text-sm font-medium hover:underline flex items-center justify-center gap-1">
                            Planifier <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
