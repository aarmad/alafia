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

    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/diseases.json', 'utf8');
    const diseases = JSON.parse(fileContents);
    const diseasesContext = JSON.stringify(diseases.slice(0, 5));

    const systemMessage = {
      role: "system",
      content: `Tu es ALAFIA, assistant médical au Togo. Urgence : 118 ou 8200. Connaissances : ${diseasesContext}. Réponds brièvement en Markdown. Pas de diagnostic médical.`
    };

    const chatMessages = [systemMessage, ...messages];

    // Utilisation de Phi-3-mini, qui est officiellement supporté par le Chat Router de HF
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: "microsoft/Phi-3-mini-4k-instruct",
          messages: chatMessages,
          max_tokens: 500,
        }),
      }
    );

    const result = await response.json();

    if (response.status !== 200) {
      console.error("HF Router Error Details:", result);
      let userMsg = "Désolé, l'IA est temporairement indisponible.";

      if (response.status === 403) {
        userMsg = "⚠️ Erreur 403 : Votre clé API n'a pas les droits nécessaires. Créez un token 'Write' sur Hugging Face.";
      } else if (result.error?.message) {
        userMsg = `Note technique : ${result.error.message}`;
      }

      return NextResponse.json({ messages: [{ role: 'assistant', content: userMsg }] });
    }

    const aiContent = result.choices?.[0]?.message?.content;

    return NextResponse.json({
      messages: [{
        role: 'assistant',
        content: aiContent || "Je n'ai pas pu obtenir de réponse claire."
      }]
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({
      messages: [{ role: 'assistant', content: "Une erreur technique est survenue." }]
    });
  }
}
