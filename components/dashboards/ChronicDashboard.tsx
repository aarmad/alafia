"use client"

import { useState, useEffect } from 'react'
import { Activity, Pill, User, Phone, Calendar, Heart, ShieldAlert, BookOpen, Search, MessageCircle, Send, X, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function ChronicDashboard({ user }: { user: any }) {
    const profile = user.profile
    const [meds, setMeds] = useState(profile.medications || [])
    const [healthRecords, setHealthRecords] = useState<any[]>([])
    const [doctors, setDoctors] = useState<any[]>([])
    const [isSearchingDoctor, setIsSearchingDoctor] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [activeContact, setActiveContact] = useState<any>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isLoadingRecords, setIsLoadingRecords] = useState(true)
    const [docSearchQuery, setDocSearchQuery] = useState('')
    const [docSpecialtyFilter, setDocSpecialtyFilter] = useState('')

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
            console.error(err)
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
            toast.error("Erreur lors de la recherche des médecins")
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
                toast.success("Demande envoyée au médecin !")
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

    return (
        <div className="space-y-6 relative">
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Suivi Maladie Chronique</h1>
                            <p className="text-gray-500">{profile.disease}</p>
                        </div>
                    </div>
                    {profile.treatingDoctorId && (
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="btn-primary flex items-center gap-2 px-6 py-2 shadow-lg shadow-primary/20"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Discuter avec Dr. {profile.treatingDoctorName}
                        </button>
                    )}
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
                    {profile.treatingDoctorId ? (
                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-primary">Dr. {profile.treatingDoctorName}</p>
                                <p className="text-sm text-gray-600 mt-1">Connecté via Alafia Connect.</p>
                            </div>
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                    ) : (
                        <div className="text-center py-6 border-2 border-dashed rounded-xl">
                            {isSearchingDoctor ? (
                                <div className="space-y-4 max-h-80 overflow-y-auto px-4 pb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-xs font-bold text-gray-500">MÉDECINS DISPONIBLES</p>
                                        <button onClick={() => setIsSearchingDoctor(false)} className="text-xs text-red-500 hover:underline font-bold">Annuler</button>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Rechercher par nom..."
                                            className="w-full text-xs p-2.5 bg-gray-50 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                                            value={docSearchQuery}
                                            onChange={(e) => setDocSearchQuery(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Spécialité (ex: Cardiologue)..."
                                            className="w-full text-xs p-2.5 bg-gray-50 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                                            value={docSpecialtyFilter}
                                            onChange={(e) => setDocSpecialtyFilter(e.target.value)}
                                        />
                                    </div>

                                    {doctors.filter(doc => {
                                        const nameMatch = doc.profile.name.toLowerCase().includes(docSearchQuery.toLowerCase());
                                        const specMatch = doc.profile.specialization.toLowerCase().includes(docSpecialtyFilter.toLowerCase());
                                        return nameMatch && specMatch;
                                    }).length === 0 && <p className="text-xs text-gray-400 py-4 italic">Aucun médecin ne correspond à votre recherche.</p>}

                                    {doctors.filter(doc => {
                                        const nameMatch = doc.profile.name.toLowerCase().includes(docSearchQuery.toLowerCase());
                                        const specMatch = doc.profile.specialization.toLowerCase().includes(docSpecialtyFilter.toLowerCase());
                                        return nameMatch && specMatch;
                                    }).map(doc => (
                                        <div key={doc._id} className="p-3 bg-white rounded-lg text-left border shadow-sm hover:border-primary transition-colors group">
                                            <p className="font-bold text-sm">Dr. {doc.profile.name}</p>
                                            <p className="text-[10px] text-primary uppercase font-bold">{doc.profile.specialization}</p>
                                            <p className="text-[9px] text-gray-400">{doc.profile.hospital}</p>
                                            <button
                                                onClick={() => requestDoctor(doc._id)}
                                                className="mt-3 w-full text-[10px] bg-primary text-white py-2 rounded-md font-bold hover:bg-primary-dark transition-all shadow-md active:scale-95"
                                            >
                                                Demander le suivi
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-400 text-sm mb-3">Aucun docteur affilié</p>
                                    <button
                                        onClick={searchDoctors}
                                        className="text-primary text-sm font-bold hover:underline"
                                    >
                                        Rechercher un spécialiste
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-3 p-3 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Prochaine visite suggérée : <b>Dans 3 mois</b></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Carnet de Santé Virtuel */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-500" />
                        Carnet de Santé Digital
                    </h2>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">HISTORIQUE MÉDICAL</span>
                </div>
                <div className="p-0 max-h-[400px] overflow-y-auto">
                    {isLoadingRecords ? (
                        <div className="p-12 text-center text-gray-400 animate-pulse">Chargement de votre dossier...</div>
                    ) : healthRecords.length === 0 ? (
                        <div className="p-12 text-center">
                            <BookOpen className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                            <p className="text-gray-400 text-sm italic">Aucune entrée pour le moment. Votre docteur affilié pourra ajouter vos traitements ici.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {healthRecords.map((entry, idx) => (
                                <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex gap-4 items-start">
                                        <div className="min-w-[80px] text-center">
                                            <p className="text-xs font-black text-primary uppercase">{new Date(entry.date).toLocaleDateString('fr-FR', { month: 'short' })}</p>
                                            <p className="text-2xl font-black text-gray-900">{new Date(entry.date).getDate()}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{new Date(entry.date).getFullYear()}</p>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-gray-900">{entry.diagnosis}</h3>
                                                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-black">Dr. {entry.doctorName}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                                <span className="font-bold text-gray-400 mr-2 uppercase text-[10px]">Traitement:</span>
                                                {entry.treatment}
                                            </p>
                                            {entry.notes && (
                                                <p className="text-xs bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-100 italic">
                                                    Note: {entry.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* CHAT INTERFACE OVERLAY */}
            {isChatOpen && activeContact && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col h-[80vh]">
                        <div className="bg-primary p-4 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                                    {activeContact.name?.[0]}
                                </div>
                                <div>
                                    <p className="font-bold">Dr. {activeContact.name}</p>
                                    <p className="text-[10px] opacity-70 italic">En ligne - Suivi Alafia</p>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === user.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === user.id
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 rounded-tl-none border'
                                        }`}>
                                        {msg.content}
                                        <p className={`text-[10px] mt-1 opacity-50 text-right ${msg.sender === user.id ? 'text-white' : 'text-gray-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary"
                                placeholder="Écrivez votre message..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                            />
                            <button type="submit" className="bg-primary text-white p-3 rounded-xl hover:bg-primary-dark transition-all">
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
