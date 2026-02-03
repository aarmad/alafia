import { streamText } from 'ai';
import { huggingface } from '@ai-sdk/huggingface';
import { promises as fs } from 'fs';
import path from 'path';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

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

    const result = streamText({
        model: huggingface('mistralai/Mistral-7B-Instruct-v0.3'),
        system: systemPrompt,
        messages,
    });

    return result.toDataStreamResponse();
}
