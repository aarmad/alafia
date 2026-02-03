"use client"

import { useState } from 'react'
import { Droplet, Calendar, Award, MapPin, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function DonorDashboard({ user }: { user: any }) {
    const [profile, setProfile] = useState(user.profile)
    const [isAvailable, setIsAvailable] = useState(user.profile?.isAvailable ?? true)

    const lastDonation = profile?.lastDonation ? new Date(profile.lastDonation) : null

    const updateProfile = async (updates: any) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ updates })
            })
            const data = await res.json()
            if (data.success) {
                setProfile(data.data.user.profile)
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
                currentUser.profile = data.data.user.profile
                localStorage.setItem('user', JSON.stringify(currentUser))
            }
        } catch (e) {
            console.error(e)
        }
    }

    const toggleAvailability = async () => {
        const newState = !isAvailable
        setIsAvailable(newState)
        await updateProfile({ isAvailable: newState })
    }

    const setDonationToday = async () => {
        if (confirm("Confirmez-vous avoir fait un don aujourd'hui ?")) {
            await updateProfile({ lastDonation: new Date() })
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className="text-red-100 uppercase tracking-wider text-sm font-semibold mb-1">Carte de Donneur</p>
                        <h1 className="text-2xl font-bold">{profile?.name || 'Donneur Bénévole'}</h1>
                        <p className="opacity-90">{profile?.location || 'Lomé'}</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30">
                            <span className="text-3xl font-black">{profile?.bloodType || '?'}</span>
                        </div>
                        <p className="text-xs mt-1 opacity-80">Groupe Sanguin</p>
                    </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Droplet className="w-5 h-5 text-red-500" />
                                Mon Statut
                            </h2>
                            <button
                                onClick={toggleAvailability}
                                className={`text-sm px-3 py-1 rounded-full border ${isAvailable ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-500'}`}
                            >
                                {isAvailable ? 'Modifier' : 'Modifier'}
                            </button>
                        </div>

                        <div
                            onClick={toggleAvailability}
                            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${isAvailable ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-70'}`}
                        >
                            {isAvailable ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            ) : (
                                <XCircle className="w-6 h-6 text-gray-400" />
                            )}
                            <div>
                                <p className={`font-bold ${isAvailable ? 'text-green-800' : 'text-gray-700'}`}>
                                    {isAvailable ? 'Je suis DISPONIBLE' : 'Indisponible temporairement'}
                                </p>
                                <p className="text-xs text-gray-500">Pour recevoir des alertes d'urgence</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm text-gray-500">Dernier don</p>
                                <button onClick={setDonationToday} className="text-xs text-red-600 hover:text-red-700 font-medium underline">
                                    J'ai donné aujourd'hui
                                </button>
                            </div>
                            <p className="font-medium text-gray-800 flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {lastDonation ? format(lastDonation, 'd MMMM yyyy', { locale: fr }) : 'Aucun don enregistré'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border shadow-sm h-full">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-500" />
                        Lieux de Collecte
                    </h2>
                    <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-gray-50 text-sm">
                            <span className="font-bold block text-gray-800">CNTS Lomé (Tokoin)</span>
                            <span className="text-gray-500">7h30 - 17h00 • <a target="_blank" href="https://maps.google.com/?q=CNTS+Lome" className="text-red-600 underline">Voir Carte</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
