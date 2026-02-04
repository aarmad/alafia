"use client"

import { useState, useEffect } from 'react'
import { Calendar, Baby, Activity, Utensils, Droplets, Heart, Edit2, ChevronRight, User, Search, CheckCircle, MessageCircle, BookOpen, X, Send } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import { Modal, ModalContent, ModalTrigger, ModalHeader, ModalTitle, ModalDescription } from '@/components/Modal'

export default function PregnantDashboard({ user }: { user: any }) {
    const [profile, setProfile] = useState(user.profile)
    const [weeksPregnant, setWeeksPregnant] = useState(user.profile?.weeksPregnant || 0)
    const [loading, setLoading] = useState(false)
    const [isWeightModalOpen, setIsWeightModalOpen] = useState(false)

    // Doctor Connection State
    const [doctors, setDoctors] = useState<any[]>([])
    const [isSearchingDoctor, setIsSearchingDoctor] = useState(false)
    const [healthRecords, setHealthRecords] = useState<any[]>([])
    const [isLoadingRecords, setIsLoadingRecords] = useState(true)

    // Chat
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [activeContact, setActiveContact] = useState<any>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')

    // Form
    const [newWeeks, setNewWeeks] = useState(weeksPregnant)

    const dueDate = profile?.dueDate ? new Date(profile.dueDate) : new Date()
    const progress = Math.min((weeksPregnant / 40) * 100, 100)

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
                toast.success("Demande envoyée !")
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
                body: JSON.stringify({ updates: { weeksPregnant: parseInt(newWeeks.toString()) } })
            })
            const data = await res.json()
            if (data.success) {
                setProfile(data.data.user.profile)
                setWeeksPregnant(data.data.user.profile.weeksPregnant)
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
                currentUser.profile = data.data.user.profile
                localStorage.setItem('user', JSON.stringify(currentUser))
                toast.success("Suivi mis à jour !")
                setIsWeightModalOpen(false)
            }
        } catch (e) {
            toast.error("Erreur de mise à jour")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                        <Baby className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Félicitations, {profile?.name || 'Future Maman'} !</h1>
                        <p className="text-gray-600 font-medium">Semaine {weeksPregnant} - {format(dueDate, 'd MMMM yyyy', { locale: fr })}</p>
                    </div>
                </div>
                {profile.treatingDoctorId && (
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="bg-pink-500 hover:bg-pink-600 text-white flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg shadow-pink-200 transition-all font-bold"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Chat Dr. {profile.treatingDoctorName}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Progress Bar */}
                    <div className="bg-white rounded-2xl p-6 border shadow-sm">
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-pink-500" />
                                Ma Progression
                            </h2>

                            <Modal open={isWeightModalOpen} onOpenChange={setIsWeightModalOpen}>
                                <ModalTrigger asChild>
                                    <button className="text-sm bg-pink-50 text-pink-600 px-3 py-1 rounded-full font-medium hover:bg-pink-100 flex items-center gap-2">
                                        Modifier
                                        <Edit2 className="w-3 h-3" />
                                    </button>
                                </ModalTrigger>
                                <ModalContent>
                                    <ModalHeader><ModalTitle>Mise à jour</ModalTitle></ModalHeader>
                                    <form onSubmit={updateWeeks} className="space-y-6 pt-4">
                                        <div className="flex items-center justify-center gap-6">
                                            <button type="button" onClick={() => setNewWeeks(Math.max(0, parseInt(newWeeks.toString()) - 1))} className="w-12 h-12 rounded-full bg-gray-100 text-2xl font-bold">-</button>
                                            <span className="text-4xl font-black text-pink-600">{newWeeks} w</span>
                                            <button type="button" onClick={() => setNewWeeks(Math.min(42, parseInt(newWeeks.toString()) + 1))} className="w-12 h-12 rounded-full bg-gray-100 text-2xl font-bold">+</button>
                                        </div>
                                        <button type="submit" disabled={loading} className="btn-primary w-full bg-pink-500 hover:bg-pink-600 border-none">{loading ? '...' : 'Valider'}</button>
                                    </form>
                                </ModalContent>
                            </Modal>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden mb-2">
                            <div className="bg-gradient-to-r from-pink-400 to-pink-600 h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-center text-sm font-bold text-pink-600">{Math.round(progress)}% complété</p>
                    </div>

                    {/* Carnet de Santé Virtuel */}
                    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-indigo-600">
                                <BookOpen className="w-5 h-5" />
                                Suivi Médical Professionnel
                            </h2>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {isLoadingRecords ? (
                                <div className="p-10 text-center text-gray-400 animate-pulse">Chargement du dossier...</div>
                            ) : healthRecords.length === 0 ? (
                                <div className="p-10 text-center text-gray-400 italic text-sm">Aucun compte-rendu médical pour le moment.</div>
                            ) : (
                                <div className="divide-y">
                                    {healthRecords.map((entry, idx) => (
                                        <div key={idx} className="p-4 hover:bg-gray-50">
                                            <div className="flex justify-between text-xs font-bold mb-1">
                                                <span className="text-indigo-600">Dr. {entry.doctorName}</span>
                                                <span className="text-gray-400">{new Date(entry.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className="font-bold text-gray-800">{entry.diagnosis}</p>
                                            <p className="text-sm text-gray-600 mt-1">{entry.treatment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Mon Docteur */}
                    <div className="bg-white rounded-2xl p-6 border shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-500" />
                            Gynécologue / Docteur
                        </h3>
                        {profile.treatingDoctorId ? (
                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-indigo-700">Dr. {profile.treatingDoctorName}</p>
                                    <p className="text-[10px] text-indigo-400 font-bold uppercase">Spécialiste Affilié</p>
                                </div>
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            </div>
                        ) : (
                            <div className="text-center p-4 border-2 border-dashed rounded-xl">
                                {isSearchingDoctor ? (
                                    <div className="space-y-3">
                                        {doctors.map(doc => (
                                            <button
                                                key={doc._id}
                                                onClick={() => requestDoctor(doc._id)}
                                                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border text-sm transition-colors group"
                                            >
                                                <p className="font-bold group-hover:text-primary">Dr. {doc.profile.name}</p>
                                                <p className="text-[10px] text-gray-400">{doc.profile.specialization}</p>
                                            </button>
                                        ))}
                                        <button onClick={() => setIsSearchingDoctor(false)} className="text-xs text-red-500 mt-2 font-bold underline">Annuler</button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-400 mb-3">Aucun docteur assigné</p>
                                        <button onClick={searchDoctors} className="text-primary font-bold text-sm hover:underline">Trouver mon docteur</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100">
                        <h3 className="font-bold text-pink-800 mb-2 flex items-center gap-2">
                            <Droplets className="w-5 h-5" />
                            Conseil IA
                        </h3>
                        <p className="text-sm text-pink-600 mb-4 leading-relaxed">Pensez à faire votre prochaine échographie vers la semaine 22 !</p>
                        <a href="/chatbot" className="block text-center bg-pink-500 text-white rounded-xl py-3 font-bold shadow-lg shadow-pink-100 hover:scale-105 transition-all">Consulter ALAFIA AI</a>
                    </div>
                </div>
            </div>

            {/* CHAT MODAL */}
            {isChatOpen && activeContact && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col h-[75vh] animate-slide-up">
                        <div className="bg-pink-500 p-5 text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">Dr</div>
                                <div>
                                    <p className="font-bold text-lg">Dr. {activeContact.name}</p>
                                    <p className="text-[10px] opacity-75 font-bold uppercase">Suivi Grossesse</p>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 scrollbar-hide">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === user.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm shadow-sm ${msg.sender === user.id ? 'bg-pink-500 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={sendMessage} className="p-5 bg-white border-t flex gap-3">
                            <input className="flex-1 bg-gray-100 border-none rounded-2xl px-6 py-4 text-sm" placeholder="Message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
                            <button type="submit" className="bg-pink-500 text-white p-4 rounded-2xl hover:scale-105 transition-all"><Send className="w-5 h-5" /></button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
