import { Megaphone, Info, Zap, HeartPulse } from 'lucide-react'

export default function PublicationCard({ pub }: { pub: any }) {
    const typeMetadata: any = {
        'alert': { color: 'bg-red-100 text-red-600 border-red-200', icon: Megaphone, label: 'Alerte' },
        'info': { color: 'bg-blue-100 text-blue-600 border-blue-200', icon: Info, label: 'Info' },
        'health-tip': { color: 'bg-green-100 text-green-600 border-green-200', icon: HeartPulse, label: 'Conseil' },
        'event': { color: 'bg-purple-100 text-purple-600 border-purple-200', icon: Zap, label: 'Événement' }
    }

    const meta = typeMetadata[pub.type] || typeMetadata.info
    const Icon = meta.icon

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.color}`}>
                        <Icon className="w-3 h-3" />
                        {meta.label}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(pub.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {pub.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                    {pub.content}
                </p>

                <div className="pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-primary">
                            {pub.authorName?.[0] || 'D'}
                        </div>
                        <div className="text-[10px]">
                            <p className="font-bold text-gray-900">Dr. {pub.authorName}</p>
                            <p className="text-gray-400">{pub.authorSpecialization || 'Généraliste'}</p>
                        </div>
                    </div>
                    <button className="text-primary text-xs font-bold hover:underline">Lire plus</button>
                </div>
            </div>
        </div>
    )
}
