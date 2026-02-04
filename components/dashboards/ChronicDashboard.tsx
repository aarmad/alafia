"use client"

import { useState } from 'react'
import { Activity, Pill, User, Phone, Calendar, Heart, ShieldAlert } from 'lucide-react'

export default function ChronicDashboard({ user }: { user: any }) {
    const profile = user.profile
    const [meds, setMeds] = useState(profile.medications || [])

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Suivi Maladie Chronique</h1>
                        <p className="text-gray-500">{profile.disease}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section Médicaments */}
                <div className="bg-white rounded-2xl p-6 border shadow-sm">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Pill className="w-5 h-5 text-green-500" />
                        Traitement en cours
                    </h2>
                    <div className="space-y-3">
                        {meds.length > 0 ? (
                            meds.map((med: string, i: number) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border">
                                    <span className="font-medium">{med}</span>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Actif</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic text-sm">Aucun médicament enregistré.</p>
                        )}
                    </div>
                </div>

                {/* Section Docteur & Suivi */}
                <div className="bg-white rounded-2xl p-6 border shadow-sm">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Mon Docteur référent
                    </h2>
                    {profile.treatingDoctor ? (
                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <p className="font-bold text-primary">{profile.treatingDoctor}</p>
                            <p className="text-sm text-gray-600 mt-1">Contact partagé pour le suivi régulier.</p>
                        </div>
                    ) : (
                        <div className="text-center py-6 border-2 border-dashed rounded-xl">
                            <p className="text-gray-400 text-sm mb-3">Aucun docteur assigné</p>
                            <button className="text-primary text-sm font-bold hover:underline">Rechercher un spécialiste</button>
                        </div>
                    )}

                    <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-3 p-3 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Prochaine visite suggérée : <b>Dans 3 mois</b></span>
                        </div>
                        <div className="flex items-center gap-3 p-3 text-sm text-gray-600">
                            <ShieldAlert className="w-4 h-4 text-orange-500" />
                            <span>Alerte : N'oubliez pas de renouveler votre stock.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rappels & Santé */}
            <div className="bg-gradient-to-r from-blue-600 to-primary rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="max-w-md">
                        <h2 className="text-2xl font-bold mb-2">Prenez soin de vous</h2>
                        <p className="opacity-90">Une gestion régulière de votre {profile.disease} est la clé d'une vie sereine. Signalez tout nouveau symptôme sur votre carnet de santé digital.</p>
                    </div>
                    <button className="bg-white text-primary px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform whitespace-nowrap">
                        Ouvrir mon carnet
                    </button>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-10">
                    <Heart className="w-64 h-64" />
                </div>
            </div>
        </div>
    )
}
