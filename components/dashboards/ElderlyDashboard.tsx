"use client"

import { useState } from 'react'
import { Pill, Phone, CalendarCheck, HeartPulse, AlertCircle, Plus, Trash2, Edit } from 'lucide-react'
import { toast } from 'sonner'
import { Modal, ModalContent, ModalTrigger, ModalHeader, ModalTitle, ModalDescription } from '@/components/Modal'

export default function ElderlyDashboard({ user }: { user: any }) {
    const [profile, setProfile] = useState(user.profile)
    const [items, setItems] = useState<string[]>(user.profile?.medications || [])
    const [newItem, setNewItem] = useState('')
    const [isEditingContact, setIsEditingContact] = useState(false)
    const [emergencyContact, setEmergencyContact] = useState(user.profile?.emergencyContact || '')
    const [isModalOpen, setIsModalOpen] = useState(false)

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
            toast.error("Erreur technique")
        }
    }

    const addItem = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!newItem.trim()) return

        const newList = [...items, newItem.trim()]
        setItems(newList)
        setNewItem('')
        setIsModalOpen(false) // Close modal

        await updateProfile({ medications: newList })
        toast.success("Traitement ajouté")
    }

    const removeItem = async (index: number) => {
        if (!confirm('Retirer ce médicament ?')) return;
        const newList = items.filter((_, i) => i !== index)
        setItems(newList)
        await updateProfile({ medications: newList })
        toast.success("Traitement retiré")
    }

    const saveContact = async () => {
        setIsEditingContact(false)
        await updateProfile({ emergencyContact })
        toast.success("Contact d'urgence enregistré")
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
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                            <Pill className="w-5 h-5 text-teal-600" />
                            Mes Traitements
                        </h2>

                        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <ModalTrigger asChild>
                                <button className="btn-primary px-4 bg-teal-600 hover:bg-teal-700 border-none flex items-center gap-2 text-sm">
                                    <Plus className="w-4 h-4" />
                                    Ajouter
                                </button>
                            </ModalTrigger>
                            <ModalContent>
                                <ModalHeader className="mb-4">
                                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Pill className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <ModalTitle className="text-lg font-bold text-center">Nouveau médicament</ModalTitle>
                                    <ModalDescription className="text-sm text-gray-500 text-center">Quel traitement devez-vous suivre ?</ModalDescription>
                                </ModalHeader>
                                <form onSubmit={addItem} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Ex: Amlodipine 5mg"
                                        className="input-field w-full"
                                        value={newItem}
                                        onChange={e => setNewItem(e.target.value)}
                                        autoFocus
                                        required
                                    />
                                    <button type="submit" className="btn-primary w-full bg-teal-600 hover:bg-teal-700 border-none">
                                        Enregistrer
                                    </button>
                                </form>
                            </ModalContent>
                        </Modal>
                    </div>

                    <div className="space-y-3">
                        {items.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-400 text-sm">Aucun traitement listé pour le moment.</p>
                            </div>
                        )}

                        {items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 group hover:border-teal-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{item}</p>
                                        <p className="text-xs text-gray-500">Traitement régulier</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeItem(idx)}
                                    className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all"
                                    title="Supprimer"
                                >
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
                            <div className="flex gap-2 mb-4 animate-in fade-in zoom-in duration-200">
                                <input
                                    className="input-field text-sm w-full"
                                    value={emergencyContact}
                                    onChange={(e) => setEmergencyContact(e.target.value)}
                                    placeholder="Numéro..."
                                    autoFocus
                                />
                                <button onClick={saveContact} className="text-green-600 font-bold text-sm bg-green-100 px-3 rounded-lg hover:bg-green-200">OK</button>
                            </div>
                        ) : (
                            <div className="bg-white p-4 rounded-xl border border-red-100 mb-4 flex justify-between items-center group cursor-pointer" onClick={() => setIsEditingContact(true)}>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm uppercase opacity-70">Personne à prévenir</p>
                                    <p className="text-lg font-mono text-gray-900 font-bold">{emergencyContact || '--- --- ---'}</p>
                                </div>
                                <button className="text-gray-300 group-hover:text-teal-600">
                                    <Edit className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <a
                            href={`tel:${emergencyContact}`}
                            className={`w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-colors font-bold shadow-lg shadow-red-200 ${!emergencyContact ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
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
