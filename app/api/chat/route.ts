import { generateText } from 'ai';
import { huggingface } from '@ai-sdk/huggingface';
import { promises as fs } from 'fs';
import path from 'path';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.HUGGINGFACE_API_KEY) {
      return new Response(JSON.stringify({
        messages: [{ role: 'assistant', content: "Désolé, la configuration de l'IA est incomplète (Clé API manquante)." }]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Charger les données locales pour le contexte médical
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/diseases.json', 'utf8');
    const diseases = JSON.parse(fileContents);

    const systemPrompt = `Tu es ALAFIA, un assistant médical intelligent spécialisé dans le contexte de santé au Togo. 
        Utilise ces informations sur les maladies courantes pour donner des conseils précis : ${JSON.stringify(diseases.slice(0, 15))}.
        
        Règles :
        1. Ton ton doit être bienveillant et professionnel.
        2. Si un symptôme suggère une urgence, insiste lourdement sur l'appel au 118 (Pompiers) ou au 8200 (SAMU).
        3. Ne fais pas de diagnostic médical définitif. Répète que tu es une IA.
        4. Adapte tes conseils au climat du Togo.
        5. Réponds brièvement en utilisant du formatage Markdown.`;

    const result = await generateText({
      model: huggingface('mistralai/Mistral-7B-Instruct-v0.3') as any,
      system: systemPrompt,
      messages: messages,
    });

    // Retourner une réponse JSON complète (non-streaming)
    return new Response(JSON.stringify({
      messages: [
        {
          role: 'assistant',
          content: result.text,
        }
      ]
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({
      messages: [{ role: 'assistant', content: "Désolé, une erreur technique est survenue. Veuillez réessayer." }]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
