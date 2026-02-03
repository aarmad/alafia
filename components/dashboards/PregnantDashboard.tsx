"use client"

import { useState } from 'react'
import { Calendar, Baby, Activity, Utensils, Droplets, Heart, Save } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function PregnantDashboard({ user }: { user: any }) {
    const [profile, setProfile] = useState(user.profile)
    const [weeksPregnant, setWeeksPregnant] = useState(user.profile?.weeksPregnant || 0)
    const [loading, setLoading] = useState(false)

    const dueDate = profile?.dueDate ? new Date(profile.dueDate) : new Date()
    const progress = Math.min((weeksPregnant / 40) * 100, 100)

    const updateWeeks = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ updates: { weeksPregnant: parseInt(weeksPregnant) } })
            })
            const data = await res.json()
            if (data.success) {
                setProfile(data.data.user.profile)
                // Update local storage
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
                currentUser.profile = data.data.user.profile
                localStorage.setItem('user', JSON.stringify(currentUser))
                alert("Semaine mise à jour !")
            }
        } catch (e) {
            alert("Erreur de mise à jour")
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
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-500">Semaine actuelle :</label>
                                <input
                                    type="number"
                                    min="0" max="42"
                                    value={weeksPregnant}
                                    onChange={(e) => setWeeksPregnant(e.target.value)}
                                    className="w-16 p-1 border rounded text-center font-bold text-pink-600"
                                />
                                <button
                                    onClick={updateWeeks}
                                    disabled={loading}
                                    className="p-1 bg-pink-100 text-pink-600 rounded hover:bg-pink-200"
                                    title="Sauvegarder"
                                >
                                    <Save className="w-4 h-4" />
                                </button>
                            </div>
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
                </div>
            </div>
        </div>
    )
}
