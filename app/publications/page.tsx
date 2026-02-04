"use client"

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import PublicationCard from '@/components/PublicationCard'
import { Loader2, Search, Newspaper, Filter } from 'lucide-react'

export default function PublicationsPage() {
    const [publications, setPublications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        fetchPublications()
    }, [])

    const fetchPublications = async () => {
        try {
            const res = await fetch('/api/publications')
            const data = await res.json()
            if (data.success) {
                setPublications(data.data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const filteredPubs = publications.filter(pub => {
        const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pub.content.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filter === 'all' || pub.type === filter
        return matchesSearch && matchesFilter
    })

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                            Toutes les <span className="text-primary">Publications</span>
                        </h1>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                            Retrouvez tous les conseils santé, alertes et informations médicales publiés par nos docteurs certifiés.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border shadow-sm mb-12">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une publication..."
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 text-gray-700"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-6 py-4 rounded-2xl font-bold transition-all ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    Tout
                                </button>
                                <button
                                    onClick={() => setFilter('alert')}
                                    className={`px-6 py-4 rounded-2xl font-bold transition-all ${filter === 'alert' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    Alertes
                                </button>
                                <button
                                    onClick={() => setFilter('health-tip')}
                                    className={`px-6 py-4 rounded-2xl font-bold transition-all ${filter === 'health-tip' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    Conseils
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        </div>
                    ) : filteredPubs.length === 0 ? (
                        <div className="bg-white rounded-3xl p-20 text-center border border-dashed">
                            <Newspaper className="w-16 h-16 mx-auto mb-6 text-gray-200" />
                            <h3 className="text-xl font-bold text-gray-800">Aucune publication trouvée</h3>
                            <p className="text-gray-500">Essayez de modifier vos filtres ou votre recherche.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPubs.map((pub, idx) => (
                                <PublicationCard key={idx} pub={pub} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
