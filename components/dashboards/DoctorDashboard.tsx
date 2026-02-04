"use client"

import { useState, useEffect } from 'react'
import { User, Users, FileText, Bell, Plus, Search, Activity, Calendar, ExternalLink, MessageCircle, BookOpen, Send, X, Check, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Modal, ModalContent, ModalTrigger, ModalHeader, ModalTitle } from '@/components/Modal'

export default function DoctorDashboard({ user }: { user: any }) {
    const profile = user.profile
    const [publications, setPublications] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isPubModalOpen, setIsPubModalOpen] = useState(false)

    // Connections state
    const [pendingRequests, setPendingRequests] = useState<any[]>([])
    const [connections, setConnections] = useState<any[]>([])
    const [selectedPatient, setSelectedPatient] = useState<any>(null)
    const [healthRecords, setHealthRecords] = useState<any[]>([])

    // New health record form
    const [diag, setDiag] = useState('')
    const [treat, setTreat] = useState('')
    const [notes, setNotes] = useState('')
    const [isAddingRecord, setIsAddingRecord] = useState(false)

    // Chat
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')

    // Pub form state
    const [pubTitle, setPubTitle] = useState('')
    const [pubContent, setPubContent] = useState('')
    const [pubType, setPubType] = useState('info')

    const fetchMyInfo = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/connections', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) {
                setPendingRequests(data.data.pendingRequests || [])
                setConnections(data.data.connections || [])
            }
        } catch (e) { }
    }

    const fetchMyPublications = async () => {
        try {
            const res = await fetch('/api/publications')
            const data = await res.json()
            if (data.success) {
                setPublications(data.data)
            }
        } catch (e) { }
    }

    useEffect(() => {
        fetchMyInfo()
        fetchMyPublications()
    }, [])

    const handleAction = async (targetId: string, action: 'accept' | 'reject') => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/connections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ targetId, action })
            })
            const data = await res.json()
            if (data.success) {
                toast.success(action === 'accept' ? "Patient accepté !" : "Demande rejetée")
                fetchMyInfo()
            }
        } catch (e) { }
    }

    const viewHealthRecord = async (patient: any) => {
        setSelectedPatient(patient)
        setHealthRecords([])
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/health-record?patientId=${patient._id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) setHealthRecords(data.data)
        } catch (e) { }
    }

    const addHealthEntry = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedPatient) return
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/health-record', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    patientId: selectedPatient._id,
                    diagnosis: diag,
                    treatment: treat,
                    notes: notes
                })
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Carnet de santé mis à jour !")
                setDiag(''); setTreat(''); setNotes('');
                setIsAddingRecord(false)
                viewHealthRecord(selectedPatient)
            }
        } catch (e) { } finally { setLoading(false) }
    }

    const fetchMessages = async () => {
        if (!selectedPatient) return
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/messages?contactId=${selectedPatient._id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) setMessages(data.data)
        } catch (e) { }
    }

    useEffect(() => {
        if (isChatOpen && selectedPatient) {
            fetchMessages()
            const interval = setInterval(fetchMessages, 5000)
            return () => clearInterval(interval)
        }
    }, [isChatOpen, selectedPatient])

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedPatient) return
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ receiverId: selectedPatient._id, content: newMessage })
            })
            const data = await res.json()
            if (data.success) {
                setMessages([...messages, data.data])
                setNewMessage('')
            }
        } catch (e) { }
    }

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/publications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: pubTitle, content: pubContent, type: pubType })
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Publication réussie !")
                setPubTitle(''); setPubContent('');
                setIsPubModalOpen(false)
                fetchMyPublications()
            }
        } catch (e) { } finally { setLoading(false) }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Dr. {profile.name}</h1>
                        <p className="text-gray-500 font-medium">{profile.specialization} • {profile.hospital}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Modal open={isPubModalOpen} onOpenChange={setIsPubModalOpen}>
                        <ModalTrigger asChild>
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all">
                                <Plus className="w-5 h-5" />
                                Alerte / Publication
                            </button>
                        </ModalTrigger>
                        <ModalContent className="max-w-2xl">
                            <ModalHeader><ModalTitle>Nouvelle Publication</ModalTitle></ModalHeader>
                            <form onSubmit={handlePublish} className="space-y-4 pt-4">
                                <input className="input-field w-full" placeholder="Titre" value={pubTitle} onChange={e => setPubTitle(e.target.value)} required />
                                <select className="input-field w-full" value={pubType} onChange={e => setPubType(e.target.value)}>
                                    <option value="info">Information</option>
                                    <option value="alert">Alerte Santé</option>
                                    <option value="health-tip">Conseil Santé</option>
                                </select>
                                <textarea className="input-field w-full min-h-[150px]" placeholder="Contenu..." value={pubContent} onChange={e => setPubContent(e.target.value)} required />
                                <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? '...' : 'Publier'}</button>
                            </form>
                        </ModalContent>
                    </Modal>

                    {pendingRequests.length > 0 && (
                        <div className="relative">
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-bounce">
                                {pendingRequests.length}
                            </div>
                            <Modal>
                                <ModalTrigger asChild>
                                    <button className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 hover:bg-red-100 transition-all font-bold flex items-center gap-2">
                                        <Bell className="w-5 h-5" />
                                        Demandes
                                    </button>
                                </ModalTrigger>
                                <ModalContent>
                                    <ModalHeader><ModalTitle>Demandes de suivi ({pendingRequests.length})</ModalTitle></ModalHeader>
                                    <div className="space-y-4 mt-6">
                                        {pendingRequests.map(req => (
                                            <div key={req._id} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between border">
                                                <div>
                                                    <p className="font-bold text-gray-900">{req.profile.name} <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded ml-2 uppercase opacity-60">{req.role}</span></p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                                        {req.role === 'chronic' ? req.profile.disease :
                                                            req.role === 'pregnant' ? `Grossesse: ${req.profile.weeksPregnant} sem.` :
                                                                req.role === 'elderly' ? `Âge: ${req.profile.age} ans` : 'Patient'}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleAction(req._id, 'accept')} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><Check className="w-4 h-4" /></button>
                                                    <button onClick={() => handleAction(req._id, 'reject')} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"><X className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ModalContent>
                            </Modal>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Liste des patients connectés */}
                    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
                            <h2 className="text-lg font-bold flex items-center gap-2 italic">
                                <Users className="w-5 h-5 text-indigo-500" />
                                Patientèle Alafia Connect
                            </h2>
                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{connections.length} PATIENTS</div>
                        </div>
                        <div className="divide-y">
                            {connections.length === 0 ? (
                                <div className="p-12 text-center text-gray-400">Aucun patient affilié pour le moment.</div>
                            ) : (
                                connections.map(pat => (
                                    <div key={pat._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-xl">
                                                {pat.profile.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{pat.profile.name} <span className="text-[10px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded ml-1 uppercase">{pat.role}</span></p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-black uppercase">
                                                        {pat.role === 'chronic' ? pat.profile.disease :
                                                            pat.role === 'pregnant' ? `Grossesse: ${pat.profile.weeksPregnant} sem.` :
                                                                pat.role === 'elderly' ? `Âge: ${pat.profile.age} ans` : 'Patient'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-medium italic">{pat.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => viewHealthRecord(pat)}
                                                className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:border-primary hover:text-primary transition-all shadow-sm"
                                                title="Carnet de santé"
                                            >
                                                <BookOpen className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedPatient(pat); setIsChatOpen(true); }}
                                                className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:border-primary hover:text-primary transition-all shadow-sm"
                                                title="Discuter"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Zone d'action Patients (Health Record) */}
                    {selectedPatient && !isChatOpen && (
                        <div className="bg-white rounded-2xl border-2 border-primary/20 shadow-xl overflow-hidden animate-slide-up">
                            <div className="p-6 border-b bg-primary flex justify-between items-center">
                                <div>
                                    <h3 className="text-white font-black text-xl uppercase italic">Dossier Médical : {selectedPatient.profile.name}</h3>
                                    <p className="text-white/70 text-xs font-bold uppercase tracking-tighter">Accès spécialisé - Carnet Virtuel Alafia</p>
                                </div>
                                <button onClick={() => setSelectedPatient(null)} className="text-white/50 hover:text-white"><X className="w-6 h-6" /></button>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        Nouvelle Prescription/Entrée
                                    </h4>
                                    <form onSubmit={addHealthEntry} className="space-y-3">
                                        <input className="input-field w-full" placeholder="Diagnostic / Motif (Ex: Contrôle tension)" value={diag} onChange={e => setDiag(e.target.value)} required />
                                        <input className="input-field w-full" placeholder="Traitement / Recommandation" value={treat} onChange={e => setTreat(e.target.value)} required />
                                        <textarea className="input-field w-full min-h-[100px]" placeholder="Observations complémentaires..." value={notes} onChange={e => setNotes(e.target.value)} />
                                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 shadow-lg shadow-primary/30 uppercase font-black tracking-widest">
                                            {loading ? '...' : 'Enregistrer au carnet'}
                                        </button>
                                    </form>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Activity className="w-4 h-4" />
                                        Historique du Patient
                                    </h4>
                                    <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                                        {healthRecords.length === 0 && <p className="text-xs text-gray-400 italic text-center py-10">Carnet vide.</p>}
                                        {healthRecords.map((entry, i) => (
                                            <div key={i} className="p-3 bg-gray-50 rounded-lg border text-sm">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-primary">{entry.diagnosis}</span>
                                                    <span className="text-[10px] text-gray-400">{new Date(entry.date).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-gray-600 text-xs">{entry.treatment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border shadow-sm">
                        <h3 className="font-bold mb-4 flex items-center gap-2 uppercase tracking-tighter">
                            <Bell className="w-5 h-5 text-yellow-500" />
                            Activités Récentes
                        </h3>
                        <div className="space-y-3">
                            <p className="text-[10px] text-gray-300 italic">Aucune alerte pour Lomé aujourd'hui...</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CHAT INTERFACE OVERLAY */}
            {isChatOpen && selectedPatient && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
                        <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                                    {selectedPatient.profile.name[0]}
                                </div>
                                <div>
                                    <p className="font-bold">Chat avec {selectedPatient.profile.name}</p>
                                    <p className="text-[10px] opacity-70">Patient • {selectedPatient.profile.disease}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === user.userId ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-3xl text-sm shadow-sm ${msg.sender === user.userId
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 rounded-tl-none border'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-gray-100 border-none rounded-2xl px-5 py-3.5 text-sm"
                                placeholder="Instructions médicales..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                            />
                            <button type="submit" className="bg-indigo-600 text-white p-4 rounded-2xl hover:scale-105 transition-all">
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
