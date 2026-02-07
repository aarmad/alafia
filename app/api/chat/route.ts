import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey || apiKey.trim() === "") {
      console.error("HUGGINGFACE_API_KEY is missing or empty");
      return NextResponse.json({
        messages: [{ role: 'assistant', content: "⚠️ Configuration incomplète : La clé API Hugging Face est manquante. Veuillez la configurer sur Vercel." }]
      });
    }

    try {
      const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            model: "meta-llama/Llama-3.1-8B-Instruct",
            messages: [
              { role: "system", content: "Tu es un médecin professionnel et bienveillant au Togo. Ta mission est d'aider les patients avec des conseils avisés. NUMÉROS D'URGENCE : Police: 177, Pompiers: 118, Gendarmerie: 117." },
              ...messages
            ],
            max_tokens: 800,
          }),
        }
      );

      let result = await response.json();

      if (!response.ok) {
        console.error("HF Llama Error:", result);
        const fallback = await fetch(
          "https://router.huggingface.co/v1/chat/completions",
          {
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
              model: "mistralai/Mistral-7B-Instruct-v0.2",
              messages: [
                { role: "system", content: "Tu es un médecin au Togo." },
                ...messages
              ],
              max_tokens: 500
            }),
          }
        );
        result = await fallback.json();
        if (!fallback.ok) throw new Error(result.error?.message || "IA indisponible");
      }

      const aiContent = result.choices?.[0]?.message?.content;

      return NextResponse.json({
        messages: [{ role: 'assistant', content: aiContent || "Désolé, je ne peux pas répondre pour le moment." }]
      });
    } catch (apiError: any) {
      console.error("External HF API Error:", apiError);
      throw apiError;
    }

  } catch (error: any) {
    console.error("Chat API Route Error:", error);
    return NextResponse.json({
      messages: [{ role: 'assistant', content: `⚠️ Erreur : ${error.message || "Service momentanément indisponible."}` }]
    });
  }
}
