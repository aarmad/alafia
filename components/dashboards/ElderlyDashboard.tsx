"use client"

import { useState, useEffect } from 'react'
import { Pill, Phone, HeartPulse, AlertCircle, Plus, Trash2, Edit, User, Search, CheckCircle, MessageCircle, BookOpen, X, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Modal, ModalContent, ModalTrigger, ModalHeader, ModalTitle, ModalDescription } from '@/components/Modal'

export default function ElderlyDashboard({ user }: { user: any }) {
    const [profile, setProfile] = useState(user.profile)
    const [items, setItems] = useState<string[]>(user.profile?.medications || [])
    const [newItem, setNewItem] = useState('')
    const [isEditingContact, setIsEditingContact] = useState(false)
    const [emergencyContact, setEmergencyContact] = useState(user.profile?.emergencyContact || '')
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Doctor Management
    const [doctors, setDoctors] = useState<any[]>([])
    const [isSearchingDoctor, setIsSearchingDoctor] = useState(false)
    const [healthRecords, setHealthRecords] = useState<any[]>([])
    const [isLoadingRecords, setIsLoadingRecords] = useState(true)

    // Chat
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [activeContact, setActiveContact] = useState<any>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')

    useEffect(() => {
        fetchHealthRecords()
        if (profile.treatingDoctorId) {
            setActiveContact({ _id: profile.treatingDoctorId, name: profile.treatingDoctorName })
        }
    }, [])

    const fetchHealthRecords = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/health-record', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) setHealthRecords(data.data)
        } catch (err) {
        } finally {
            setIsLoadingRecords(false)
        }
    }

    const searchDoctors = async () => {
        setIsSearchingDoctor(true)
        try {
            const res = await fetch('/api/doctors')
            const data = await res.json()
            if (data.success) setDoctors(data.data)
        } catch (err) {
            toast.error("Erreur recherche médecins")
        }
    }

    const requestDoctor = async (doctorId: string) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/connections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ targetId: doctorId, action: 'request' })
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Demande de suivi envoyée !")
                setIsSearchingDoctor(false)
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error("Erreur d'envoi")
        }
    }

    const fetchMessages = async () => {
        if (!activeContact) return
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/messages?contactId=${activeContact._id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) setMessages(data.data)
        } catch (err) { }
    }

    useEffect(() => {
        if (isChatOpen) {
            fetchMessages()
            const interval = setInterval(fetchMessages, 5000)
            return () => clearInterval(interval)
        }
    }, [isChatOpen, activeContact])

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !activeContact) return
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ receiverId: activeContact._id, content: newMessage })
            })
            const data = await res.json()
            if (data.success) {
                setMessages([...messages, data.data])
                setNewMessage('')
            }
        } catch (err) { }
    }

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
            toast.error("Erreur technique")
        }
    }

    const addItem = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!newItem.trim()) return
        const newList = [...items, newItem.trim()]
        setItems(newList)
        setNewItem('')
        setIsModalOpen(false)
        await updateProfile({ medications: newList })
        toast.success("Traitement enregistré")
    }

    const removeItem = async (index: number) => {
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
            <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-3xl p-8 border border-teal-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md border border-teal-50">
                        <HeartPulse className="w-10 h-10 text-teal-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-800">Bonjour, {profile?.name || 'Cher Patient'}</h1>
                        <p className="text-teal-600 font-bold uppercase tracking-widest text-xs">Suivi Santé Personnel Actif</p>
                    </div>
                </div>
                {profile.treatingDoctorId && (
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-3 px-8 py-4 rounded-2xl shadow-lg shadow-teal-100 transition-all font-black uppercase tracking-wider text-sm"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Docteur en ligne
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Traitements */}
                    <div className="bg-white rounded-3xl p-8 border shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold flex items-center gap-3 text-gray-800">
                                <Pill className="w-6 h-6 text-teal-600" />
                                Mes Traitements
                            </h2>
                            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                                <ModalTrigger asChild>
                                    <button className="bg-teal-50 text-teal-700 px-6 py-3 rounded-2xl font-black text-xs hover:bg-teal-100 transition-all">AJOUTER</button>
                                </ModalTrigger>
                                <ModalContent>
                                    <ModalHeader><ModalTitle>Nouveau traitement</ModalTitle></ModalHeader>
                                    <form onSubmit={addItem} className="space-y-4 pt-4">
                                        <input className="input-field w-full" placeholder="Nom du médicament..." value={newItem} onChange={e => setNewItem(e.target.value)} required />
                                        <button type="submit" className="btn-primary w-full bg-teal-600 border-none">Enregistrer</button>
                                    </form>
                                </ModalContent>
                            </Modal>
                        </div>
                        <div className="space-y-4">
                            {items.length === 0 ? (
                                <p className="text-center py-10 text-gray-400 italic">Aucun traitement répertorié.</p>
                            ) : (
                                items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-teal-200 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center font-bold text-teal-600 shadow-sm">{idx + 1}</div>
                                            <p className="font-bold text-gray-800 text-lg">{item}</p>
                                        </div>
                                        <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Carnet de Santé Virtuel */}
                    <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
                        <div className="p-8 border-b bg-gray-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-3 italic">
                                <BookOpen className="w-6 h-6 text-indigo-600" />
                                Historique Médical
                            </h2>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Accès Médecins Affiliés</span>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {isLoadingRecords ? (
                                <div className="p-20 text-center text-gray-400">Accès au dossier...</div>
                            ) : healthRecords.length === 0 ? (
                                <div className="p-20 text-center text-gray-400 italic">Dossier médical vierge pour le moment.</div>
                            ) : (
                                <div className="divide-y">
                                    {healthRecords.map((entry, idx) => (
                                        <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg text-gray-900">{entry.diagnosis}</h3>
                                                <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">Dr. {entry.doctorName}</span>
                                            </div>
                                            <p className="text-gray-600 text-sm">{entry.treatment}</p>
                                            <p className="text-[10px] text-gray-400 mt-2 font-bold">{new Date(entry.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Urgence */}
                    <div className="bg-red-50 rounded-3xl p-8 border border-red-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><AlertCircle className="w-20 h-20" /></div>
                        <h3 className="font-bold text-red-800 flex items-center gap-2 mb-6 uppercase tracking-tighter italic">S.O.S Urgence</h3>
                        {isEditingContact ? (
                            <div className="flex gap-2 mb-6">
                                <input className="input-field w-full border-red-200" value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} />
                                <button onClick={saveContact} className="bg-red-600 text-white px-4 rounded-xl font-bold">OK</button>
                            </div>
                        ) : (
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-red-100 mb-6 cursor-pointer" onClick={() => setIsEditingContact(true)}>
                                <p className="text-xs font-bold text-red-400 uppercase mb-1">À contacter</p>
                                <p className="text-2xl font-black text-gray-900">{emergencyContact || 'Non défini'}</p>
                            </div>
                        )}
                        <a href={`tel:${emergencyContact}`} className={`w-full flex items-center justify-center gap-3 bg-red-600 py-5 rounded-2xl text-white font-black text-lg transition-all hover:bg-red-700 shadow-xl shadow-red-100 ${!emergencyContact && 'opacity-30 pointer-events-none'}`}>
                            <Phone className="w-6 h-6 animate-pulse" />
                            APPELER
                        </a>
                    </div>

                    {/* Mon Docteur */}
                    <div className="bg-white rounded-3xl p-8 border shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <User className="w-6 h-6 text-teal-600" />
                            Médecin de famille
                        </h3>
                        {profile.treatingDoctorId ? (
                            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 flex items-center justify-between">
                                <div>
                                    <p className="font-black text-teal-800 text-lg">Dr. {profile.treatingDoctorName}</p>
                                    <p className="text-[10px] text-teal-400 font-bold uppercase italic">Alafia Certifié</p>
                                </div>
                                <CheckCircle className="w-6 h-6 text-teal-600" />
                            </div>
                        ) : (
                            <div className="text-center p-6 border-2 border-dashed rounded-2xl">
                                {isSearchingDoctor ? (
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                                        {doctors.map(doc => (
                                            <button
                                                key={doc._id}
                                                onClick={() => requestDoctor(doc._id)}
                                                className="w-full text-left p-4 hover:bg-gray-50 rounded-xl border transition-all"
                                            >
                                                <p className="font-bold text-sm">Dr. {doc.profile.name}</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-black">{doc.profile.specialization}</p>
                                            </button>
                                        ))}
                                        <button onClick={() => setIsSearchingDoctor(false)} className="text-xs text-red-500 font-bold underline mt-4">Fermer</button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-gray-400 text-sm mb-4 italic">Aucun suivi doctoral actif.</p>
                                        <button onClick={searchDoctors} className="text-teal-600 font-black text-sm hover:underline">RECHERCHER UN SPÉCIALISTE</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CHAT MODAL */}
            {isChatOpen && activeContact && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col h-[85vh] overflow-hidden border">
                        <div className="bg-teal-600 p-8 text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center font-black text-2xl">Dr</div>
                                <div>
                                    <p className="font-black text-2xl">Dr. {activeContact.name}</p>
                                    <p className="text-xs opacity-70 font-bold uppercase tracking-widest">Consultation Privée • Alafia Connect</p>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-10 space-y-6 bg-gray-50 scrollbar-hide">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === user.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-6 rounded-[2rem] text-sm shadow-xl ${msg.sender === user.id ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={sendMessage} className="p-8 bg-white border-t flex gap-4">
                            <input className="flex-1 bg-gray-100 border-none rounded-[1.5rem] px-8 py-5 text-sm focus:ring-2 focus:ring-teal-200" placeholder="Décrivez votre état..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
                            <button type="submit" className="bg-teal-600 text-white p-5 rounded-2xl hover:scale-110 transition-all shadow-xl shadow-teal-100"><Send className="w-6 h-6" /></button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
