"use client"

import { useState } from 'react'
import { Store, ShieldCheck, MapPin, Plus, Trash2, Package, AlertTriangle, Search, Clock } from 'lucide-react'

// Type local pour le médicament
interface Medication {
    name: string;
    quantity: number;
    price: number;
    expiryDate?: string;
}

export default function PharmacyDashboard({ user }: { user: any }) {
    const [profile, setProfile] = useState(user.profile)
    const [isOnDuty, setIsOnDuty] = useState(user.profile?.isOnDuty || false)
    const [medications, setMedications] = useState<Medication[]>(user.profile?.medications || [])
    const [loading, setLoading] = useState(false)

    // Form state
    const [newMedName, setNewMedName] = useState('')
    const [newMedQty, setNewMedQty] = useState('')
    const [newMedPrice, setNewMedPrice] = useState('')

    const updateProfile = async (updates: any) => {
        try {
            setLoading(true)
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
                // Mettre à jour le localStorage
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
                currentUser.profile = data.data.user.profile
                localStorage.setItem('user', JSON.stringify(currentUser))
            }
        } catch (e) {
            console.error(e)
            alert("Erreur lors de la mise à jour")
        } finally {
            setLoading(false)
        }
    }

    const toggleDuty = async () => {
        const newState = !isOnDuty
        setIsOnDuty(newState)
        await updateProfile({ isOnDuty: newState })
    }

    const addMedication = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMedName.trim() || !newMedQty || !newMedPrice) return

        const newMed: Medication = {
            name: newMedName.trim(),
            quantity: parseInt(newMedQty),
            price: parseInt(newMedPrice)
        }

        const newMedsList = [...medications, newMed]
        setMedications(newMedsList)

        // Reset form
        setNewMedName('')
        setNewMedQty('')
        setNewMedPrice('')

        await updateProfile({ medications: newMedsList })
    }

    const removeMedication = async (index: number) => {
        if (!confirm('Supprimer ce médicament du stock ?')) return;
        const newMedsList = medications.filter((_, i) => i !== index)
        setMedications(newMedsList)
        await updateProfile({ medications: newMedsList })
    }

    return (
        <div className="space-y-6">
            {/* Header avec Statut de Garde */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Bonjour, {profile?.pharmacyName || 'Pharmacien'}</h1>
                    <p className="text-gray-500">Gestion de l'officine</p>
                </div>

                <button
                    onClick={toggleDuty}
                    disabled={loading}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full cursor-pointer transition-all ${isOnDuty ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200'}`}
                >
                    <div className={`w-3 h-3 rounded-full ${isOnDuty ? 'bg-green-600 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className={`font-semibold ${isOnDuty ? 'text-green-800' : 'text-gray-600'}`}>
                        {isOnDuty ? 'PHARMACIE DE GARDE' : 'Mode Normal'}
                    </span>
                    <ShieldCheck className={`w-5 h-5 ${isOnDuty ? 'text-green-600' : 'text-gray-400'}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Gestionaire de Stock (Large) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                                <Package className="w-5 h-5 text-primary" />
                                Inventaire du Stock
                            </h2>
                            <span className="text-sm bg-white px-3 py-1 rounded-full border text-gray-600 font-medium">
                                {medications.length} références
                            </span>
                        </div>

                        {/* Formulaire d'ajout rapide */}
                        <form onSubmit={addMedication} className="p-4 bg-blue-50/50 border-b border-blue-100 flex flex-col md:flex-row gap-3 items-end">
                            <div className="flex-1 w-full">
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Nom du médicament</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Paracétamol 1g"
                                    className="input-field bg-white"
                                    value={newMedName}
                                    onChange={e => setNewMedName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="w-full md:w-32">
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Qté</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="input-field bg-white"
                                    value={newMedQty}
                                    onChange={e => setNewMedQty(e.target.value)}
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="w-full md:w-40">
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Prix (FCFA)</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="input-field bg-white"
                                    value={newMedPrice}
                                    onChange={e => setNewMedPrice(e.target.value)}
                                    required
                                    min="0"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto btn-primary h-11 flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Ajouter
                            </button>
                        </form>

                        {/* Tableau des médicaments */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Médicament</th>
                                        <th className="p-4 text-center">Quantité</th>
                                        <th className="p-4 text-right">Prix Unit.</th>
                                        <th className="p-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {medications.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-gray-400">
                                                Aucun médicament dans votre stock actuellement.
                                            </td>
                                        </tr>
                                    ) : (
                                        medications.map((med, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                                <td className="p-4 font-medium text-gray-800">
                                                    {typeof med === 'string' ? med : med.name} {/* Support legacy */}
                                                </td>
                                                <td className="p-4 text-center">
                                                    {typeof med === 'string' ? (
                                                        <span className="text-gray-400">-</span>
                                                    ) : (
                                                        <span className={`px-3 py-1 rounded-full font-bold ${med.quantity < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                                            {med.quantity}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right font-mono text-gray-600">
                                                    {typeof med === 'string' ? '-' : `${med.price} F`}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() => removeMedication(idx)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <div className={`rounded-2xl p-6 border transition-colors ${isOnDuty ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
                        <h3 className={`font-bold mb-2 ${isOnDuty ? 'text-green-800' : 'text-gray-600'}`}>Statut de Garde</h3>
                        <p className="text-sm mb-4">
                            {isOnDuty
                                ? "Votre pharmacie est visible comme DE GARDE."
                                : "Activez le mode garde pour définir vos horaires."}
                        </p>

                        {isOnDuty && (
                            <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm animate-fade-in">
                                <label className="text-xs font-bold text-green-700 uppercase mb-2 block flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Horaires de cette garde
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="input-field text-sm"
                                        placeholder="Ex: 8h00 - 20h00"
                                        defaultValue={profile?.hours}
                                        onBlur={(e) => updateProfile({ hours: e.target.value })}
                                    />
                                </div>
                                <p className="text-xs text-green-600 mt-2">
                                    Modifiez pour mettre à jour instantanément.
                                </p>
                            </div>
                        )}
                    </div>
                    {/* Sidebar Infos */}
                    <div className="bg-white rounded-2xl p-6 border shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Store className="w-5 h-5 text-gray-500" />
                            Infos Publiques
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-semibold">Pharmacie</label>
                                <p className="font-medium">{profile?.pharmacyName}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-semibold">Adresse</label>
                                <p className="font-medium">{profile?.address}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-semibold">Licence</label>
                                <p className="font-medium font-mono bg-gray-100 px-2 py-1 rounded inline-block">{profile?.license}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 text-orange-800">
                        <h3 className="font-bold flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5" />
                            Stock Faible
                        </h3>
                        <p className="text-sm opacity-80 mb-4">
                            Les médicaments avec une quantité inférieure à 10 sont automatiquement signalés.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
