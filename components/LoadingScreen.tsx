import { Heart } from 'lucide-react'

export default function LoadingScreen({ message = "Chargement..." }: { message?: string }) {
    return (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="relative mb-4">
                {/* Effet de ping derrière le coeur */}
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>

                {/* Coeur central */}
                <div className="relative bg-white p-4 rounded-full shadow-lg border-2 border-primary/20">
                    <Heart className="w-12 h-12 text-primary animate-pulse fill-primary/20" />
                </div>
            </div>

            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse">
                ALAFIA
            </h2>
            <p className="text-sm text-gray-500 mt-2 font-medium">
                {message}
            </p>
        </div>
    )
}
