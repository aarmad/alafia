"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import PharmacyDashboard from '@/components/dashboards/PharmacyDashboard'
import PregnantDashboard from '@/components/dashboards/PregnantDashboard'
import ElderlyDashboard from '@/components/dashboards/ElderlyDashboard'
import DonorDashboard from '@/components/dashboards/DonorDashboard'
import ChronicDashboard from '@/components/dashboards/ChronicDashboard'
import DoctorDashboard from '@/components/dashboards/DoctorDashboard'
import LoadingScreen from '@/components/LoadingScreen'
import { Loader2, LogOut } from 'lucide-react'

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Vérifier l'authentification
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (!token || !userData) {
            router.push('/auth')
            return
        }

        try {
            setUser(JSON.parse(userData))
        } catch (e) {
            console.error("Erreur lecture user data", e)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            router.push('/auth')
        } finally {
            setLoading(false)
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/auth')
    }

    if (loading) {
        return <LoadingScreen message="Initialisation de votre espace..." />
    }

    if (!user) return null

    // Rendu conditionnel selon le rôle
    const renderDashboard = () => {
        switch (user.role) {
            case 'pharmacy':
                return <PharmacyDashboard user={user} />
            case 'pregnant':
                return <PregnantDashboard user={user} />
            case 'elderly':
                return <ElderlyDashboard user={user} />
            case 'donor':
                return <DonorDashboard user={user} />
            case 'chronic':
                return <ChronicDashboard user={user} />
            case 'doctor':
                return <DoctorDashboard user={user} />
            default:
                return (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-800">Rôle non reconnu</h2>
                        <p className="text-gray-600">Veuillez contacter le support.</p>
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold gradient-text">Mon Espace</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                    </button>
                </div>

                <div className="animate-slide-up">
                    {renderDashboard()}
                </div>
            </main>
        </div>
    )
}
