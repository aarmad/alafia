'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Heart, Pill, MessageCircle, User } from 'lucide-react'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
                            <Heart className="w-6 h-6 text-white" fill="white" />
                        </div>
                        <span className="text-2xl font-bold gradient-text">ALAFIA</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                        >
                            <Pill className="w-5 h-5" />
                            <span>Pharmacies</span>
                        </Link>
                        <Link
                            href="/chatbot"
                            className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>Chatbot</span>
                        </Link>
                        <Link
                            href="/auth"
                            className="flex items-center space-x-2 btn-primary"
                        >
                            <User className="w-5 h-5" />
                            <span>Mon Compte</span>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-border animate-slide-up">
                    <div className="px-4 py-4 space-y-3">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Pill className="w-5 h-5" />
                            <span>Pharmacies</span>
                        </Link>
                        <Link
                            href="/chatbot"
                            className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>Chatbot</span>
                        </Link>
                        <Link
                            href="/auth"
                            className="flex items-center space-x-2 p-3 rounded-lg bg-primary text-white"
                            onClick={() => setIsOpen(false)}
                        >
                            <User className="w-5 h-5" />
                            <span>Mon Compte</span>
                        </Link>
                        <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-2">
                            <Link
                                href="/mentions-legales"
                                className="text-xs text-gray-400 hover:text-primary transition-colors px-4"
                                onClick={() => setIsOpen(false)}
                            >
                                Mentions Légales
                            </Link>
                            <Link
                                href="/politique-confidentialite"
                                className="text-xs text-gray-400 hover:text-primary transition-colors px-4"
                                onClick={() => setIsOpen(false)}
                            >
                                Politique de Confidentialité
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
