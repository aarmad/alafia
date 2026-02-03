'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import PharmacyCard from '@/components/PharmacyCard'
import SearchBar from '@/components/SearchBar'
import { MapPin, AlertCircle, Filter, Loader2 } from 'lucide-react'
import type { Pharmacy } from '@/types'
import pharmaciesData from '@/data/pharmacies.json'

export default function Home() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(pharmaciesData as Pharmacy[])
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>(pharmaciesData as Pharmacy[])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOnDuty, setFilterOnDuty] = useState(false)

  // Demander la localisation de l'utilisateur
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
          setLocationError('Impossible d\'obtenir votre position. Veuillez activer la géolocalisation.')
          setIsLoadingLocation(false)
        }
      )
    } else {
      setLocationError('La géolocalisation n\'est pas supportée par votre navigateur.')
      setIsLoadingLocation(false)
    }
  }

  // Filtrer les pharmacies
  useEffect(() => {
    let filtered = [...pharmacies]

    // Filtre par recherche de médicament
    if (searchQuery) {
      filtered = filtered.filter((pharmacy) =>
        pharmacy.medications.some((med) =>
          med.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pharmacy.quartier.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtre par pharmacies de garde
    if (filterOnDuty) {
      filtered = filtered.filter((pharmacy) => pharmacy.isOnDuty)
    }

    // Trier par distance si localisation disponible
    if (userLocation) {
      filtered.sort((a, b) => {
        const distA = Math.sqrt(
          Math.pow(a.latitude - userLocation.lat, 2) +
          Math.pow(a.longitude - userLocation.lng, 2)
        )
        const distB = Math.sqrt(
          Math.pow(b.latitude - userLocation.lat, 2) +
          Math.pow(b.longitude - userLocation.lng, 2)
        )
        return distA - distB
      })
    }

    setFilteredPharmacies(filtered)
  }, [searchQuery, filterOnDuty, userLocation, pharmacies])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Bienvenue sur ALAFIA</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Trouvez rapidement des pharmacies de garde et des médicaments à Lomé
            </p>

            {/* Bouton de localisation */}
            <div className="flex justify-center mb-8">
              <button
                onClick={requestLocation}
                disabled={isLoadingLocation}
                className="btn-primary flex items-center space-x-2"
              >
                {isLoadingLocation ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Localisation en cours...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    <span>Activer ma localisation</span>
                  </>
                )}
              </button>
            </div>

            {locationError && (
              <div className="flex items-center justify-center space-x-2 text-amber-600 mb-4">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{locationError}</span>
              </div>
            )}

            {userLocation && (
              <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">Localisation activée - Pharmacies triées par proximité</span>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Rechercher un médicament, une pharmacie ou un quartier..."
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setFilterOnDuty(!filterOnDuty)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${filterOnDuty
                      ? 'bg-primary text-white'
                      : 'bg-white border border-border hover:bg-muted'
                    }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Pharmacies de garde uniquement</span>
                </button>
              </div>

              <div className="text-sm text-muted-foreground">
                {filteredPharmacies.length} pharmacie{filteredPharmacies.length > 1 ? 's' : ''} trouvée{filteredPharmacies.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Pharmacies de garde - Section spéciale */}
          {!searchQuery && !filterOnDuty && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                Pharmacies de garde actuellement
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pharmacies
                  .filter((p) => p.isOnDuty)
                  .map((pharmacy) => (
                    <PharmacyCard
                      key={pharmacy.id}
                      pharmacy={pharmacy}
                      userLocation={userLocation || undefined}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Toutes les pharmacies */}
          <div>
            {!filterOnDuty && !searchQuery && (
              <h2 className="text-2xl font-bold mb-6">Toutes les pharmacies</h2>
            )}

            {filteredPharmacies.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucune pharmacie trouvée</h3>
                <p className="text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">
            © 2026 ALAFIA - Votre santé à Lomé | Fait avec ❤️ pour le Togo
          </p>
        </div>
      </footer>
    </div>
  )
}
