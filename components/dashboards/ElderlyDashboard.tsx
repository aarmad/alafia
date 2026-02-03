"use client"

import { useState } from 'react'
import { Pill, Phone, CalendarCheck, HeartPulse, AlertCircle, Plus, Trash2, Edit } from 'lucide-react'

export default function ElderlyDashboard({ user }: { user: any }) {
    const [profile, setProfile] = useState(user.profile)
    const [items, setItems] = useState<string[]>(user.profile?.medications || []) // Réutilise le champ medications
    const [newItem, setNewItem] = useState('')
    const [isEditingContact, setIsEditingContact] = useState(false)
    const [emergencyContact, setEmergencyContact] = useState(user.profile?.emergencyContact || '')

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

    const addItem = async () => {
        if (!newItem.trim()) return
        const newList = [...items, newItem.trim()]
        setItems(newList)
        setNewItem('')
        await updateProfile({ medications: newList })
    }

    const removeItem = async (index: number) => {
        const newList = items.filter((_, i) => i !== index)
        setItems(newList)
        await updateProfile({ medications: newList })
    }

    const saveContact = async () => {
        setIsEditingContact(false)
        await updateProfile({ emergencyContact })
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-2xl p-6 border border-teal-100 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Bonjour, {profile?.name || 'Cher Patient'}</h1>
                    <p className="text-gray-600">Votre suivi santé personnel</p>
                </div>
                <div className="bg-white p-3 rounded-full shadow-sm border border-teal-100">
                    <HeartPulse className="w-8 h-8 text-teal-600" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Rappel Médicaments / Traitements */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border shadow-sm">
                    <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                        <Pill className="w-5 h-5 text-teal-600" />
                        Mes Traitements
                    </h2>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="Ajouter un médicament..."
                            className="flex-1 input-field"
                            onKeyDown={(e) => e.key === 'Enter' && addItem()}
                        />
                        <button onClick={addItem} className="btn-primary px-4 bg-teal-600 hover:bg-teal-700 border-none">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {items.length === 0 && <p className="text-gray-400 text-sm text-center">Aucun traitement listé</p>}

                        {items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{item}</p>
                                        <p className="text-xs text-gray-500">N'oubliez pas votre prise</p>
                                    </div>
                                </div>
                                <button onClick={() => removeItem(idx)} className="text-gray-400 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Urgence */}
                <div className="space-y-6">
                    <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                        <h3 className="font-bold text-red-800 flex items-center gap-2 mb-4">
                            <AlertCircle className="w-5 h-5" />
                            Urgence
                        </h3>

                        {isEditingContact ? (
                            <div className="flex gap-2 mb-4">
                                <input
                                    className="input-field text-sm"
                                    value={emergencyContact}
                                    onChange={(e) => setEmergencyContact(e.target.value)}
                                />
                                <button onClick={saveContact} className="text-green-600 font-bold text-sm">OK</button>
                            </div>
                        ) : (
                            <div className="bg-white p-4 rounded-xl border border-red-100 mb-4 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-gray-800">Personne à prévenir</p>
                                    <p className="text-lg font-mono text-gray-600">{emergencyContact || 'Non Défini'}</p>
                                </div>
                                <button onClick={() => setIsEditingContact(true)} className="text-gray-400 hover:text-gray-600">
                                    <Edit className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <a
                            href={`tel:${emergencyContact}`}
                            className={`w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-colors font-bold ${!emergencyContact ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                        >
                            <Phone className="w-5 h-5" />
                            Appeler Maintenant
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
