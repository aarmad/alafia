import { streamText } from 'ai';
import { huggingface } from '@ai-sdk/huggingface';
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log("Chat API called. API Key present:", !!process.env.HUGGINGFACE_API_KEY);

    if (!process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json({
        error: "La clé API Hugging Face (HUGGINGFACE_API_KEY) n'est pas configurée dans les variables d'environnement. Veuillez l'ajouter pour activer l'IA.",
        success: false
      }, { status: 500 });
    }

    // Charger les données locales pour le contexte
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/diseases.json', 'utf8');
    const diseases = JSON.parse(fileContents);

    const systemPrompt = `Tu es ALAFIA, un assistant médical intelligent spécialisé dans le contexte de santé au Togo. 
  Utilise les informations suivantes sur les maladies courantes pour donner des conseils précis : ${JSON.stringify(diseases)}.
  
  Règles importantes :
  1. Ton ton doit être bienveillant, professionnel et rassurant.
  2. Si un symptôme suggère une urgence (comme indiqué dans tes connaissances), insiste lourdement sur l'appel au 118 (Pompiers) ou au 8200 (SAMU).
  3. Ne fais pas de diagnostic médical définitif. Répète souvent que tu es un assistant IA et non un médecin.
  4. Adapte tes conseils au climat et à l'environnement du Togo.
  5. Réponds en utilisant du formatage Markdown pour la clarté.`;

    const result = await streamText({
      model: huggingface('mistralai/Mistral-7B-Instruct-v0.3') as any,
      system: systemPrompt,
      messages,
    });

    console.log("Stream initiated successfully");
    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({
      error: "Une erreur est survenue lors de la communication avec l'IA. Vérifiez votre connexion et votre clé API.",
      details: error.message,
      success: false
    }, { status: 500 });
  }
}
