import Navbar from '@/components/Navbar'
import { Lock, Eye, ShieldCheck, Database } from 'lucide-react'

export default function PolitiqueConfidentialite() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 pt-24 pb-20">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-primary/10 p-3 rounded-2xl">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black gradient-text">Politique de Confidentialité</h1>
                    </div>

                    <div className="space-y-10 text-gray-600 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Database className="w-5 h-5 text-primary" /> Collecte des données
                            </h2>
                            <p>Nous collectons uniquement les données nécessaires au bon fonctionnement des services de santé :</p>
                            <ul className="list-disc ml-6 mt-2 space-y-2">
                                <li>Informations de profil (Email, Nom, Téléphone)</li>
                                <li>Données de santé (Groupe sanguin, semaines de grossesse, traitements)</li>
                                <li>Données de localisation (pour trouver les pharmacies proches)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Eye className="w-5 h-5 text-primary" /> Utilisation des données
                            </h2>
                            <p>Vos données sont utilisées pour :</p>
                            <ul className="list-disc ml-6 mt-2 space-y-2">
                                <li>Personnaliser votre suivi de santé</li>
                                <li>Vous alerter en cas de besoin de sang urgent (si vous êtes donneur)</li>
                                <li>Fournir des itinéraires vers les officines de garde</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-primary" /> Sécurité
                            </h2>
                            <p>
                                Toutes les données sont chiffrées au repos et durant le transfert. Nous utilisons des standards de sécurité de niveau bancaire
                                pour garantir l'intégrité de vos informations de santé.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}
