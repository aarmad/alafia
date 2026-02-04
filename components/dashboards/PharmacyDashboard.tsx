"use client"

import { useState } from 'react'
import { Store, ShieldCheck, MapPin, Plus, Trash2, Package, AlertTriangle, Search, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { Modal, ModalContent, ModalTrigger, ModalHeader, ModalTitle, ModalDescription } from '@/components/Modal'

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
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [inventorySearch, setInventorySearch] = useState('')
    const [editingIdx, setEditingIdx] = useState<number | null>(null)
    const [editValue, setEditValue] = useState('')

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
            toast.error("Erreur lors de la mise à jour")
        } finally {
            setLoading(false)
        }
    }

    const toggleDuty = async () => {
        const newState = !isOnDuty
        setIsOnDuty(newState)
        await updateProfile({ isOnDuty: newState })
        if (newState) toast.success("Mode GARDE activé !")
        else toast.info("Mode garde désactivé")
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

        // Reset form & close modal
        setNewMedName('')
        setNewMedQty('')
        setNewMedPrice('')
        setIsModalOpen(false)

        await updateProfile({ medications: newMedsList })
        toast.success(`${newMed.name} ajouté au stock`)
    }

    const removeMedication = async (index: number) => {
        if (!confirm('Supprimer ce médicament du stock ?')) return;
        const newMedsList = medications.filter((_, i) => i !== index)
        setMedications(newMedsList)
        await updateProfile({ medications: newMedsList })
        toast.success("Médicament retiré")
    }

    const adjustQuantity = async (index: number, delta: number) => {
        const newMedsList = [...medications]
        const med = newMedsList[index]
        if (typeof med !== 'string') {
            med.quantity = Math.max(0, med.quantity + delta)
            setMedications(newMedsList)
            await updateProfile({ medications: newMedsList })
        }
    }

    const saveQuantity = async (index: number) => {
        const val = parseInt(editValue)
        if (isNaN(val) || val < 0) {
            setEditingIdx(null)
            return
        }

        const newMedsList = [...medications]
        const med = newMedsList[index]
        if (typeof med !== 'string') {
            med.quantity = val
            setMedications(newMedsList)
            await updateProfile({ medications: newMedsList })
        }
        setEditingIdx(null)
    }

    const filteredMeds = medications.filter(med => {
        const name = typeof med === 'string' ? med : med.name
        return name.toLowerCase().includes(inventorySearch.toLowerCase())
    })

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
                            <div className="flex items-center gap-3">
                                <div className="relative hidden md:block">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Filtrer..."
                                        className="pl-9 pr-4 py-1.5 border rounded-full text-sm focus:ring-2 focus:ring-primary/20 outline-none w-48"
                                        value={inventorySearch}
                                        onChange={e => setInventorySearch(e.target.value)}
                                    />
                                </div>
                                <span className="text-sm bg-white px-3 py-1 rounded-full border text-gray-600 font-medium">
                                    {medications.length} réf.
                                </span>

                                <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                                    <ModalTrigger asChild>
                                        <button className="btn-primary px-4 py-2 flex items-center gap-2 text-sm shadow-md hover:shadow-lg transition-transform active:scale-95">
                                            <Plus className="w-4 h-4" />
                                            Nouveau
                                        </button>
                                    </ModalTrigger>
                                    <ModalContent>
                                        <ModalHeader className="mb-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Package className="w-6 h-6 text-primary" />
                                            </div>
                                            <ModalTitle className="text-xl font-bold text-gray-900 text-center">Ajouter un médicament</ModalTitle>
                                            <ModalDescription className="text-sm text-gray-500 text-center">Remplissez les détails pour mettre à jour le stock.</ModalDescription>
                                        </ModalHeader>

                                        <form onSubmit={addMedication} className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 block mb-1.5">Nom du produit</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ex: Paracétamol 1g"
                                                    className="input-field w-full text-base py-3"
                                                    value={newMedName}
                                                    onChange={e => setNewMedName(e.target.value)}
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Quantité</label>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        className="input-field w-full"
                                                        value={newMedQty}
                                                        onChange={e => setNewMedQty(e.target.value)}
                                                        required
                                                        min="1"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Prix (FCFA)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        className="input-field w-full"
                                                        value={newMedPrice}
                                                        onChange={e => setNewMedPrice(e.target.value)}
                                                        required
                                                        min="0"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-6">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="btn-primary w-full py-3 text-base flex justify-center items-center gap-2"
                                                >
                                                    {loading ? (
                                                        'Ajout en cours...'
                                                    ) : (
                                                        <>
                                                            <Plus className="w-5 h-5" />
                                                            Ajouter au stock
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </ModalContent>
                                </Modal>
                            </div>
                        </div>

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
                                    {filteredMeds.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-gray-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Package className="w-8 h-8 opacity-20" />
                                                    <p>{inventorySearch ? "Aucun résultat pour cette recherche." : "Aucun médicament dans votre stock."}</p>
                                                    {!inventorySearch && (
                                                        <button onClick={() => setIsModalOpen(true)} className="text-primary hover:underline mt-2">
                                                            Ajouter le premier
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredMeds.map((med, idx) => {
                                            const originalIdx = medications.indexOf(med);
                                            return (
                                                <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="p-4 font-medium text-gray-800">
                                                        {typeof med === 'string' ? med : med.name}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {typeof med === 'string' ? (
                                                            <span className="text-gray-400">-</span>
                                                        ) : (
                                                            <div className="flex items-center justify-center gap-3">
                                                                <button
                                                                    onClick={() => adjustQuantity(originalIdx, -1)}
                                                                    className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-100 text-gray-400"
                                                                >-</button>

                                                                {editingIdx === originalIdx ? (
                                                                    <input
                                                                        type="number"
                                                                        className="w-16 text-center border rounded py-1 font-bold text-xs"
                                                                        value={editValue}
                                                                        onChange={e => setEditValue(e.target.value)}
                                                                        onBlur={() => saveQuantity(originalIdx)}
                                                                        onKeyDown={e => e.key === 'Enter' && saveQuantity(originalIdx)}
                                                                        autoFocus
                                                                    />
                                                                ) : (
                                                                    <span
                                                                        onClick={() => {
                                                                            setEditingIdx(originalIdx)
                                                                            setEditValue(med.quantity.toString())
                                                                        }}
                                                                        className={`w-8 font-bold text-xs cursor-pointer hover:underline ${med.quantity < 10 ? 'text-red-600' : 'text-green-700'}`}
                                                                    >
                                                                        {med.quantity}
                                                                    </span>
                                                                )}

                                                                <button
                                                                    onClick={() => adjustQuantity(originalIdx, 1)}
                                                                    className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-100 text-gray-400"
                                                                >+</button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right font-mono text-gray-600">
                                                        {typeof med === 'string' ? '-' : `${med.price.toLocaleString()} F`}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <button
                                                            onClick={() => removeMedication(originalIdx)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
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
                                <label className="text-xs text-gray-400 uppercase font-semibold">Quartier</label>
                                <p className="font-medium">{profile?.quartier || 'Non défini'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-semibold">Adresse</label>
                                <p className="font-medium">{profile?.address}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-semibold">WhatsApp</label>
                                <p className="font-medium">{profile?.whatsapp || profile?.phone}</p>
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
