'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { User, Building2, Heart, Users, Droplet, Mail, Lock, Phone, MapPin } from 'lucide-react'

type UserRole = 'pharmacy' | 'pregnant' | 'elderly' | 'donor'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        // Pharmacy specific
        pharmacyName: '',
        license: '',
        address: '',
        // Pregnant specific
        dueDate: '',
        weeksPregnant: '',
        // Elderly specific
        age: '',
        emergencyContact: '',
        // Donor specific
        bloodType: '',
        location: '',
    })

    const roles = [
        {
            id: 'pharmacy' as UserRole,
            name: 'Pharmacie',
            icon: Building2,
            description: 'Gérez votre stock et vos horaires de garde',
            color: 'from-blue-500 to-blue-600',
        },
        {
            id: 'pregnant' as UserRole,
            name: 'Femme Enceinte',
            icon: Heart,
            description: 'Suivi de grossesse personnalisé',
            color: 'from-pink-500 to-pink-600',
        },
        {
            id: 'elderly' as UserRole,
            name: 'Troisième Âge',
            icon: Users,
            description: 'Gestion des traitements et rendez-vous',
            color: 'from-purple-500 to-purple-600',
        },
        {
            id: 'donor' as UserRole,
            name: 'Donneur de Sang',
            icon: Droplet,
            description: 'Sauver des vies par le don de sang',
            color: 'from-red-500 to-red-600',
        },
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement authentication logic
        console.log('Form submitted:', { isLogin, selectedRole, formData })
        alert('Fonctionnalité en cours de développement. Les données seront sauvegardées dans la base de données.')
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            <Navbar />

            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 animate-slide-up">
                        <h1 className="text-4xl font-bold gradient-text mb-4">
                            {isLogin ? 'Connexion' : 'Créer un compte'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isLogin
                                ? 'Accédez à votre espace personnel ALAFIA'
                                : 'Rejoignez ALAFIA et bénéficiez d\'un suivi santé personnalisé'}
                        </p>
                    </div>

                    {/* Toggle Login/Register */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-white rounded-lg p-1 shadow-md inline-flex">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`px-6 py-2 rounded-md transition-all ${isLogin
                                        ? 'bg-primary text-white'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Connexion
                            </button>
                            <button
                                onClick={() => {
                                    setIsLogin(false)
                                    setSelectedRole(null)
                                }}
                                className={`px-6 py-2 rounded-md transition-all ${!isLogin
                                        ? 'bg-primary text-white'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Inscription
                            </button>
                        </div>
                    </div>

                    {/* Role Selection (for registration) */}
                    {!isLogin && !selectedRole && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
                            {roles.map((role) => {
                                const Icon = role.icon
                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRole(role.id)}
                                        className="card card-hover text-left group"
                                    >
                                        <div className={`bg-gradient-to-br ${role.color} p-4 rounded-lg mb-4 inline-block group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{role.name}</h3>
                                        <p className="text-sm text-muted-foreground">{role.description}</p>
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {/* Login/Register Form */}
                    {(isLogin || selectedRole) && (
                        <div className="max-w-md mx-auto">
                            <div className="card animate-scale-in">
                                {!isLogin && selectedRole && (
                                    <div className="mb-6 pb-6 border-b border-border">
                                        <button
                                            onClick={() => setSelectedRole(null)}
                                            className="text-sm text-primary hover:underline mb-4"
                                        >
                                            ← Changer de profil
                                        </button>
                                        <div className="flex items-center space-x-3">
                                            {(() => {
                                                const role = roles.find((r) => r.id === selectedRole)
                                                if (!role) return null
                                                const Icon = role.icon
                                                return (
                                                    <>
                                                        <div className={`bg-gradient-to-br ${role.color} p-3 rounded-lg`}>
                                                            <Icon className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold">{role.name}</h3>
                                                            <p className="text-sm text-muted-foreground">{role.description}</p>
                                                        </div>
                                                    </>
                                                )
                                            })()}
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Common Fields */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="input-field pl-10"
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Mot de passe</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                className="input-field pl-10"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    {/* Registration-specific fields */}
                                    {!isLogin && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    {selectedRole === 'pharmacy' ? 'Nom du responsable' : 'Nom complet'}
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                        className="input-field pl-10"
                                                        placeholder="Votre nom"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">Téléphone</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        required
                                                        className="input-field pl-10"
                                                        placeholder="+228 XX XX XX XX"
                                                    />
                                                </div>
                                            </div>

                                            {/* Pharmacy-specific fields */}
                                            {selectedRole === 'pharmacy' && (
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Nom de la pharmacie</label>
                                                        <input
                                                            type="text"
                                                            name="pharmacyName"
                                                            value={formData.pharmacyName}
                                                            onChange={handleChange}
                                                            required
                                                            className="input-field"
                                                            placeholder="Pharmacie..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Numéro de licence</label>
                                                        <input
                                                            type="text"
                                                            name="license"
                                                            value={formData.license}
                                                            onChange={handleChange}
                                                            required
                                                            className="input-field"
                                                            placeholder="N° de licence"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Adresse complète</label>
                                                        <div className="relative">
                                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                            <input
                                                                type="text"
                                                                name="address"
                                                                value={formData.address}
                                                                onChange={handleChange}
                                                                required
                                                                className="input-field pl-10"
                                                                placeholder="Quartier, rue..."
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Pregnant-specific fields */}
                                            {selectedRole === 'pregnant' && (
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Date prévue d'accouchement</label>
                                                        <input
                                                            type="date"
                                                            name="dueDate"
                                                            value={formData.dueDate}
                                                            onChange={handleChange}
                                                            required
                                                            className="input-field"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Semaines de grossesse</label>
                                                        <input
                                                            type="number"
                                                            name="weeksPregnant"
                                                            value={formData.weeksPregnant}
                                                            onChange={handleChange}
                                                            required
                                                            min="1"
                                                            max="42"
                                                            className="input-field"
                                                            placeholder="Ex: 12"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {/* Elderly-specific fields */}
                                            {selectedRole === 'elderly' && (
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Âge</label>
                                                        <input
                                                            type="number"
                                                            name="age"
                                                            value={formData.age}
                                                            onChange={handleChange}
                                                            required
                                                            min="60"
                                                            className="input-field"
                                                            placeholder="Ex: 65"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Contact d'urgence</label>
                                                        <input
                                                            type="tel"
                                                            name="emergencyContact"
                                                            value={formData.emergencyContact}
                                                            onChange={handleChange}
                                                            required
                                                            className="input-field"
                                                            placeholder="+228 XX XX XX XX"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {/* Donor-specific fields */}
                                            {selectedRole === 'donor' && (
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Groupe sanguin</label>
                                                        <select
                                                            name="bloodType"
                                                            value={formData.bloodType}
                                                            onChange={handleChange}
                                                            required
                                                            className="input-field"
                                                        >
                                                            <option value="">Sélectionnez...</option>
                                                            <option value="A+">A+</option>
                                                            <option value="A-">A-</option>
                                                            <option value="B+">B+</option>
                                                            <option value="B-">B-</option>
                                                            <option value="AB+">AB+</option>
                                                            <option value="AB-">AB-</option>
                                                            <option value="O+">O+</option>
                                                            <option value="O-">O-</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Localisation</label>
                                                        <div className="relative">
                                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                            <input
                                                                type="text"
                                                                name="location"
                                                                value={formData.location}
                                                                onChange={handleChange}
                                                                required
                                                                className="input-field pl-10"
                                                                placeholder="Votre quartier"
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}

                                    <button type="submit" className="w-full btn-primary">
                                        {isLogin ? 'Se connecter' : 'Créer mon compte'}
                                    </button>
                                </form>

                                {isLogin && (
                                    <div className="mt-4 text-center">
                                        <a href="#" className="text-sm text-primary hover:underline">
                                            Mot de passe oublié ?
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
