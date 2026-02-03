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

    // Charger le contexte local (diseases.json)
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/diseases.json', 'utf8');
    const diseases = JSON.parse(fileContents);
    const diseasesContext = JSON.stringify(diseases.slice(0, 5));

    const systemMessage = {
      role: "system",
      content: `Tu es ALAFIA, un assistant médical spécialisé au Togo. 
            Utilise ces connaissances locales : ${diseasesContext}. 
            Urgence : 118 ou 8200. Ton bienveillant, réponds en Markdown.`
    };

    // On formate les messages pour l'API de Chat (OpenAI compatible)
    const chatMessages = [systemMessage, ...messages];

    // APPEL AU NOUVEAU ROUTER HUGGING FACE (Point d'accès moderne)
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: "mistralai/Mistral-7B-Instruct-v0.3", // Modèle certifié compatible Chat
          messages: chatMessages,
          max_tokens: 500,
          stream: false
        }),
      }
    );

    const result = await response.json();

    // Gestion des erreurs
    if (response.status !== 200) {
      console.error("HF Router Error:", result);
      let msg = "Désolé, l'IA est temporairement indisponible.";
      if (response.status === 403) msg = "⚠️ Erreur de permissions : Assurez-vous d'utiliser un token 'Write' avec les droits 'Inference'.";
      if (result.error && typeof result.error === 'string') msg = `Erreur : ${result.error}`;
      return NextResponse.json({ messages: [{ role: 'assistant', content: msg }] });
    }

    const aiContent = result.choices?.[0]?.message?.content;

    return NextResponse.json({
      messages: [{
        role: 'assistant',
        content: aiContent || "Je n'ai pas pu générer de réponse."
      }]
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({
      messages: [{ role: 'assistant', content: "Désolé, une erreur technique est survenue." }]
    });
  }
}
