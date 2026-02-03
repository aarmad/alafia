import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        messages: [{ role: 'assistant', content: "Erreur : Clé API manquante dans .env.local." }]
      });
    }

    const lastUserMessage = messages[messages.length - 1].content;

    // Charger le contexte local
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/diseases.json', 'utf8');
    const diseases = JSON.parse(fileContents);
    const context = JSON.stringify(diseases.slice(0, 5));

    const prompt = `<|system|>\nTu es ALAFIA, assistant médical au Togo. Urgence: 118 ou 8200. Connaissances: ${context}\nRéponds brièvement en Markdown. Pas de diagnostic médical définitif.</s>\n<|user|>\n${lastUserMessage}</s>\n<|assistant|>\n`;

    // APPEL DIRECT À L'API HUGGING FACE
    const response = await fetch(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            return_full_text: false
          }
        }),
      }
    );

    const result = await response.json();

    // Gestion des erreurs API
    if (response.status !== 200) {
      console.error("HF API Error:", result);
      let msg = "Désolé, l'IA est temporairement indisponible.";
      if (response.status === 403) msg = "⚠️ Erreur 403 : Vérifiez les permissions de votre Token (doit être 'Write' ou avoir l'accès 'Inference').";
      return NextResponse.json({ messages: [{ role: 'assistant', content: msg }] });
    }

    const aiText = Array.isArray(result) ? result[0].generated_text : result.generated_text;

    return NextResponse.json({
      messages: [{ role: 'assistant', content: aiText || "Désolé, je n'ai pas pu générer de réponse." }]
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({
      messages: [{ role: 'assistant', content: "Désolé, une erreur technique est survenue." }]
    });
  }
}
