import Navbar from '@/components/Navbar'
import { Shield, Lock, Scale, Info } from 'lucide-react'

export default function MentionsLegales() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 pt-24 pb-20">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-primary/10 p-3 rounded-2xl">
                            <Scale className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black gradient-text">Mentions Légales</h1>
                    </div>

                    <div className="space-y-12 text-gray-600 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-primary" /> 1. Éditeur du Site
                            </h2>
                            <p>
                                L'application <strong>ALAFIA</strong> est une plateforme de santé numérique dédiée aux résidents de Lomé, Togo.
                            </p>
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 italic">
                                Directeur de la publication : Équipe ALAFIA<br />
                                Siège social : Lomé, Togo<br />
                                Contact : contact@alafia.tg
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" /> 2. Hébergement
                            </h2>
                            <p>
                                Le site est hébergé par <strong>Netlify, Inc.</strong><br />
                                44 Montgomery Street, Suite 300, San Francisco, CA 94104, USA.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-primary" /> 3. Protection des données (RGPD)
                            </h2>
                            <p>
                                Conformément à la législation en vigueur, ALAFIA s'engage à protéger la vie privée de ses utilisateurs.
                                Les données médicales saisies dans les profils (grossesse, traitements, groupe sanguin) sont strictement confidentielles
                                et ne sont jamais revendues à des tiers.
                            </p>
                            <p className="mt-4">
                                Vous disposez d'un droit d'accès, de rectification et de suppression de vos données via votre espace personnel.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Scale className="w-5 h-5 text-primary" /> 4. Responsabilité Médicale
                            </h2>
                            <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 text-orange-800">
                                <p className="font-bold flex items-center gap-2 mb-2">
                                    AVERTISSEMENT :
                                </p>
                                <p>
                                    ALAFIA et son chatbot médical ne remplacent en aucun cas un avis médical professionnel.
                                    En cas d'urgence, contactez immédiatement le 118 (Sapeurs-Pompiers) ou le 8200 (SAMU Togo).
                                </p>
                            </div>
                        </section>

                        <footer className="pt-8 border-t border-gray-100 text-sm text-gray-400">
                            Dernière mise à jour : 03 Février 2026
                        </footer>
                    </div>
                </div>
            </main>
        </div>
    )
}
