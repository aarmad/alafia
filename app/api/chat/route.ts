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

    // Tentative avec Llama 3 - Le modèle le plus stable sur le Router HF
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: "meta-llama/Llama-3.1-8B-Instruct", // Modèle standard et robuste
          messages: chatMessages,
          max_tokens: 500,
        }),
      }
    );

    let result = await response.json();

    // Si le modèle principal échoue, on tente un modèle de secours
    if (response.status !== 200) {
      console.warn("Tentative de secours suite à erreur:", result.error?.message);

      const fallbackResponse = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            messages: chatMessages,
            max_tokens: 500,
          }),
        }
      );

      result = await fallbackResponse.json();

      if (fallbackResponse.status !== 200) {
        throw new Error(result.error?.message || "Tous les modèles sont indisponibles.");
      }
    }

    const aiContent = result.choices?.[0]?.message?.content;

    return NextResponse.json({
      messages: [{
        role: 'assistant',
        content: aiContent || "Je n'ai pas pu obtenir de réponse."
      }]
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);

    let msg = "Désolé, les serveurs d'IA sont surchargés. Réessayez dans quelques secondes.";
    if (error.message.includes('permission') || error.message.includes('403')) {
      msg = "⚠️ Problème de clé API : Assurez-vous d'utiliser un token 'Write' sur Hugging Face.";
    }

    return NextResponse.json({
      messages: [{ role: 'assistant', content: msg }]
    });
  }
}
