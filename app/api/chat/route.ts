import { streamText } from 'ai';
import { huggingface } from '@ai-sdk/huggingface';
import { promises as fs } from 'fs';
import path from 'path';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.HUGGINGFACE_API_KEY) {
      return new Response("Erreur : Clé API manquante", { status: 500 });
    }

    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/diseases.json', 'utf8');
    const diseases = JSON.parse(fileContents);

    const systemPrompt = `Tu es ALAFIA, assistant médical au Togo. 
        Connaissances : ${JSON.stringify(diseases.slice(0, 30))}.
        Réponds brièvement en Markdown. Si urgence : 118 ou 8200.`;

    const result = await streamText({
      model: huggingface('mistralai/Mistral-7B-Instruct-v0.3') as any,
      system: systemPrompt,
      messages,
    });

    // SOLUTION ULTIME : On renvoie le flux de texte BRUT sans passer par les helpers du SDK
    return new Response(result.textStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response("Une erreur est survenue.", { status: 500 });
  }
}
