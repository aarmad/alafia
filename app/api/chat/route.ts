import { streamText } from 'ai';
import { huggingface } from '@ai-sdk/huggingface';
import { promises as fs } from 'fs';
import path from 'path';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.HUGGINGFACE_API_KEY) {
      return new Response(JSON.stringify({ error: "Clé API manquante" }), { status: 500 });
    }

    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/diseases.json', 'utf8');
    const diseases = JSON.parse(fileContents);

    const systemPrompt = `Tu es ALAFIA, assistant médical au Togo. 
        Utilise ces données : ${JSON.stringify(diseases.slice(0, 20))}.
        Réponds en Markdown. En cas d'urgence : 118 ou 8200.`;

    const result = await streamText({
      model: huggingface('mistralai/Mistral-7B-Instruct-v0.3'),
      system: systemPrompt,
      messages,
    });

    // Utiliser la méthode standard du SDK v4
    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
