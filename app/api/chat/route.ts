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
        messages: [{ role: 'assistant', content: "Configuration incomplète : Clé API manquante." }]
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/diseases.json', 'utf8');
    const diseases = JSON.parse(fileContents);

    const systemPrompt = `Tu es ALAFIA, assistant médical intelligent au Togo.
        Connaissances : ${JSON.stringify(diseases.slice(0, 10))}.
        Règles :
        1. Ton bienveillant.
        2. Urgence -> 118 (Pompiers) ou 8200 (SAMU).
        3. Pas de diagnostic définitif.
        4. Réponds brièvement en Markdown.`;

    const result = await generateText({
      model: huggingface('mistralai/Mistral-7B-Instruct-v0.2') as any, // v0.2 est souvent plus stable sur les comptes gratuits
      system: systemPrompt,
      messages: messages,
    });

    return new Response(JSON.stringify({
      messages: [{ role: 'assistant', content: result.text }]
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error("Chat API Error:", error);

    // Message d'erreur détaillé pour l'utilisateur
    let userMessage = "Désolé, je rencontre une difficulté technique.";
    if (error.message.includes('403')) {
      userMessage = "Erreur 403 : Votre clé Hugging Face n'a pas les permissions 'Inference'. Veuillez activer 'Make calls to Inference Providers' dans vos paramètres de token.";
    }

    return new Response(JSON.stringify({
      messages: [{ role: 'assistant', content: userMessage }]
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
