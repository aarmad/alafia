'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import PharmacyCard from '@/components/PharmacyCard'
import SearchBar from '@/components/SearchBar'
import PublicationCard from '@/components/PublicationCard'
import { MapPin, AlertCircle, Filter, Loader2, MessageSquare, Droplets, ArrowRight, ShieldCheck, Activity } from 'lucide-react'
import type { Pharmacy } from '@/types'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [publications, setPublications] = useState<any[]>([])
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isLoadingPharmacies, setIsLoadingPharmacies] = useState(true)
  const [isLoadingPubs, setIsLoadingPubs] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOnDuty, setFilterOnDuty] = useState(false)

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pharmRes, pubRes] = await Promise.all([
          fetch('/api/pharmacies'),
          fetch('/api/publications')
        ])

        const pharmData = await pharmRes.json()
        if (pharmData.success) {
          setPharmacies(pharmData.data)
          setFilteredPharmacies(pharmData.data)
        }

        const pubData = await pubRes.json()
        if (pubData.success) {
          setPublications(pubData.data)
        }
      } catch (error) {
        console.error('Erreur chargement données:', error)
      } finally {
        setIsLoadingPharmacies(false)
        setIsLoadingPubs(false)
      }
    }
    fetchData()
  }, [])

  // Demander la localisation
  const requestLocation = () => {
    setIsLoadingLocation(true)
    setLocationError(null)

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsLoadingLocation(false)
        },
        (error) => {
          setLocationError('Géolocalisation refusée.')
          setIsLoadingLocation(false)
        }
      )
    } else {
      setLocationError('Non supporté.')
      setIsLoadingLocation(false)
    }
  }

  // Filtrer les pharmacies
  useEffect(() => {
    let filtered = [...pharmacies]
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.medications?.some((m) => {
          const medName = typeof m === 'string' ? m : m.name;
          return medName.toLowerCase().includes(searchQuery.toLowerCase());
        }) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.quartier.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (filterOnDuty) {
      filtered = filtered.filter((p) => p.isOnDuty)
    }
    if (userLocation) {
      filtered.sort((a, b) => {
        const distA = Math.sqrt(Math.pow(a.latitude - userLocation.lat, 2) + Math.pow(a.longitude - userLocation.lng, 2))
        const distB = Math.sqrt(Math.pow(b.latitude - userLocation.lat, 2) + Math.pow(b.longitude - userLocation.lng, 2))
        return distA - distB
      })
    }
    setFilteredPharmacies(filtered)
  }, [searchQuery, filterOnDuty, userLocation, pharmacies])

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <main className="pb-20">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none hidden lg:block"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6">
                <ShieldCheck className="w-4 h-4" />
                PLATEFORME SANTÉ N°1 AU TOGO
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
                Votre santé, <br />
                Notre <span className="gradient-text">Priorité</span> Absolue.
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
                Trouvez une pharmacie de garde en un clic, discutez avec notre assistant IA médical ou rejoignez notre communauté de donneurs de sang.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => router.push('/chatbot')}
                  className="btn-primary px-8 py-4 text-lg flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all active:scale-95"
                >
                  <MessageSquare className="w-6 h-6" />
                  Consulter ALAFIA AI
                </button>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={requestLocation}
                    className="bg-white border-2 border-gray-100 hover:border-primary/30 px-6 py-4 rounded-2xl flex items-center gap-3 text-gray-700 font-bold transition-all"
                  >
                    <MapPin className={`w-5 h-5 ${userLocation ? 'text-green-500' : 'text-primary'}`} />
                    {isLoadingLocation ? 'Localisation...' : userLocation ? 'Position Activée' : 'Pharmacies Proches'}
                  </button>
                </div>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 font-medium">Rejoint par +10,000 utilisateurs au Togo</p>
              </div>
            </div>

            <div className="hidden lg:block animate-fade-in">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-[2rem] rotate-3 blur-2xl"></div>
                <img src="/medical_hero_bg.png" alt="Healthcare" className="relative rounded-[2rem] shadow-2xl border-8 border-white object-cover aspect-video bg-blue-100" />

                {/* Floating cards */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg text-red-600">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Don de Sang</p>
                      <p className="text-sm font-black text-gray-900">Besoin Urgent O+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- PUBLICATIONS & ALERTS SECTION --- */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Actualités & <span className="text-red-500">Alertes</span></h2>
                <p className="text-gray-500">Informations de santé vérifiées par des médecins togolais.</p>
              </div>
              <button className="flex items-center gap-2 text-primary font-bold hover:underline mb-2">
                Voir toutes les publications
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {isLoadingPubs ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : publications.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed text-gray-400">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="italic">Aucune publication récente pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publications.map((pub, idx) => (
                  <PublicationCard key={idx} pub={pub} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* --- PHARMACIES SECTION --- */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-2 h-10 bg-primary rounded-full"></div>
                Trouver un médicament
              </h2>

              <div className="space-y-6">
                <SearchBar
                  onSearch={setSearchQuery}
                  placeholder="Ex: Paracétamol, Pharmacie de la Paix, quartier Adidogomé..."
                />

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button
                    onClick={() => setFilterOnDuty(!filterOnDuty)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-sm ${filterOnDuty
                      ? 'bg-primary text-white scale-105 shadow-primary/30'
                      : 'bg-white border hover:bg-gray-50 text-gray-600'
                      }`}
                  >
                    <Filter className="w-4 h-4" />
                    Pharmacies de Garde
                  </button>
                  <p className="text-sm font-medium text-gray-400">
                    {filteredPharmacies.length} résultats trouvés
                  </p>
                </div>
              </div>
            </div>

            {isLoadingPharmacies ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : filteredPharmacies.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune pharmacie trouvée</h3>
                <p className="text-gray-500">Essayez une autre recherche ou un autre quartier.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPharmacies.map((pharmacy) => (
                  <PharmacyCard
                    key={pharmacy.id}
                    pharmacy={pharmacy}
                    userLocation={userLocation || undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <h2 className="text-3xl font-black gradient-text mb-6">ALAFIA</h2>
              <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
                Première plateforme de santé digitale au Togo, facilitant l'accès aux soins et aux médicaments pour tous les citoyens.
              </p>
              <div className="flex gap-4">
                {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"></div>)}
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-6">Plateforme</h3>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer transition-colors">Accueil</li>
                <li className="hover:text-white cursor-pointer transition-colors">Trouver une Pharmacie</li>
                <li className="hover:text-white cursor-pointer transition-colors">Assistant IA Alafia</li>
                <li className="hover:text-white cursor-pointer transition-colors">Don de Sang</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-6">Légal</h3>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer transition-colors">Mentions Légales</li>
                <li className="hover:text-white cursor-pointer transition-colors">Données Personnelles</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contactez-nous</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 text-center text-xs text-gray-500">
            © 2026 ALAFIA - Tous droits réservés. Développé pour le bien-être du Togo.
          </div>
        </div>
      </footer>
    </div>
  )
}
