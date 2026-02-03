import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET() {
    try {
        const jsonDirectory = path.join(process.cwd(), 'data')
        const fileContents = await fs.readFile(jsonDirectory + '/diseases.json', 'utf8')
        const diseases = JSON.parse(fileContents)

        return NextResponse.json({
            success: true,
            data: diseases
        })
    } catch (error) {
        console.error('Erreur API Diseases:', error)
        return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 })
    }
}
