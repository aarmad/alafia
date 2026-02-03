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
        messages: [{ role: 'assistant', content: "Erreur : Clé API manquante dans .env.local." }]
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/diseases.json', 'utf8');
    const diseases = JSON.parse(fileContents);

    const systemPrompt = `Tu es ALAFIA, assistant médical intelligent au Togo.
        Connaissances : ${JSON.stringify(diseases.slice(0, 5))}.
        Urgence -> 118 ou 8200.
        Réponds brièvement en Markdown. Pas de diagnostic médical définitif.`;

    const result = await generateText({
      model: huggingface('mistralai/Mistral-7B-Instruct-v0.3') as any,
      system: systemPrompt,
      messages: messages,
    });

    return new Response(JSON.stringify({
      messages: [{ role: 'assistant', content: result.text }]
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error("Chat API Error:", error);

    let userMessage = "Désolé, je rencontre une difficulté technique.";
    if (error.message.includes('403')) {
      userMessage = "⚠️ Permission refusée : Votre token Hugging Face doit être de type 'Write' ou avoir les droits 'Inference'.";
    } else if (error.message.includes('400')) {
      userMessage = "⚠️ Erreur API : Le modèle est surchargé. Merci de réessayer dans 30 secondes.";
    }

    return new Response(JSON.stringify({
      messages: [{ role: 'assistant', content: userMessage }]
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
