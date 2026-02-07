'use client'

import { useState, useEffect } from 'react'
import { MapPin, Phone, Clock, Navigation, ExternalLink } from 'lucide-react'
import type { Pharmacy } from '@/types'
import { calculateDistance, formatDistance } from '@/lib/utils'

interface PharmacyCardProps {
    pharmacy: Pharmacy
    userLocation?: { lat: number; lng: number }
}

export default function PharmacyCard({ pharmacy, userLocation }: PharmacyCardProps) {
    const [distance, setDistance] = useState<number | null>(null)

    useEffect(() => {
        if (userLocation) {
            const dist = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                pharmacy.latitude,
                pharmacy.longitude
            )
            setDistance(dist)
        }
    }, [userLocation, pharmacy])

    const openWhatsApp = () => {
        const message = encodeURIComponent(`Bonjour, je vous contacte depuis ALAFIA concernant votre pharmacie.`)
        window.open(`https://wa.me/${pharmacy.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
    }

    const openMaps = () => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${pharmacy.latitude},${pharmacy.longitude}`, '_blank')
    }

    return (
        <div className="card card-hover animate-fade-in">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{pharmacy.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{pharmacy.quartier}</p>
                    </div>
                </div>
                <div>
                    {pharmacy.isOnDuty ? (
                        <span className="badge-on-duty">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            De garde
                        </span>
                    ) : (
                        <span className="badge-closed">Fermé</span>
                    )}
                </div>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{pharmacy.hours}</span>
                </div>

                {distance !== null && (
                    <div className="flex items-center space-x-2 text-sm">
                        <Navigation className="w-4 h-4 text-accent" />
                        <span className="text-muted-foreground">À {formatDistance(distance)}</span>
                    </div>
                )}

                <p className="text-sm text-muted-foreground">{pharmacy.address}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {pharmacy.medications.slice(0, 3).map((med, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                    >
                        {typeof med === 'string' ? med : med.name}
                    </span>
                ))}
                {pharmacy.medications.length > 3 && (
                    <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                        +{pharmacy.medications.length - 3} autres
                    </span>
                )}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={openWhatsApp}
                    className="flex-1 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">WhatsApp</span>
                </button>
                <button
                    onClick={openMaps}
                    className="flex-1 flex items-center justify-center space-x-2 btn-secondary"
                >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm font-medium">Itinéraire</span>
                </button>
            </div>
        </div>
    )
}
