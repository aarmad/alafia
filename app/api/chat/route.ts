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
        messages: [{ role: 'assistant', content: "Erreur : Clé API manquante." }]
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/diseases.json', 'utf8');
    const diseases = JSON.parse(fileContents);

    // On fusionne le système dans le contexte pour une compatibilité maximale
    const contextualMessages = [
      {
        role: 'user',
        content: `Système: Tu es ALAFIA, assistant médical au Togo. Urgence: 118 ou 8200. Connaissances: ${JSON.stringify(diseases.slice(0, 5))}. Réponds brièvement en Markdown.`
      },
      { role: 'assistant', content: "Compris. Je suis prêt à vous aider." },
      ...messages
    ];

    const result = await generateText({
      // Phi-3 est très stable sur l'API Inference de Hugging Face
      model: huggingface('microsoft/Phi-3-mini-4k-instruct') as any,
      messages: contextualMessages,
      maxTokens: 500,
    });

    return new Response(JSON.stringify({
      messages: [{ role: 'assistant', content: result.text }]
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({
      messages: [{ role: 'assistant', content: "Désolé, je rencontre une difficulté avec le moteur de calcul de l'IA. Merci de réessayer." }]
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
