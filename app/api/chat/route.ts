import { NextResponse } from 'next/server';

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

    const systemMessage = {
      role: "system",
      content: `Tu es un médecin professionnel et bienveillant. 
            Ta mission est d'écouter les symptômes de l'utilisateur, de poser des questions de suivi si nécessaire, et de donner des conseils médicaux avisés tout en restant prudent.

            NUMÉROS D'URGENCE AU TOGO (À COMMUNIQUER SYSTÉMATIQUEMENT EN CAS DE DANGER) :
            - Pompiers : 118 ou 22 21 67 06
            - Police secours : 177
            - Gendarmerie : 117 ou 22 22 21 39
            - CHU Sylvanus Olympio : 22 21 25 01
            - CHU Campus : 22 25 77 68
            - Violences sexuelles : 1014 / Protection enfant : 111

            CONSIGNES :
            1. Réponds comme un médecin : sois empathique, précis et professionnel.
            2. Analyse la conversation pour donner des conseils personnalisés.
            3. Si les symptômes semblent graves (douleur thoracique, difficulté respiratoire, hémorragie), insiste pour que l'utilisateur contacte immédiatement les urgences listées ci-dessus.
            4. Précise toujours que tes conseils sont à titre informatif et ne remplacent pas une consultation physique si le cas persiste.
            5. Utilise le formatage Markdown pour tes réponses.`
    };

    const chatMessages = [systemMessage, ...messages];

    // Appel au point d'accès moderne avec Llama 3.1
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
          messages: chatMessages,
          max_tokens: 800,
        }),
      }
    );

    let result = await response.json();

    if (response.status !== 200) {
      console.warn("Erreur Llama, tentative de secours sur Mistral...");
      const fallback = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            messages: chatMessages,
            max_tokens: 500
          }),
        }
      );
      result = await fallback.json();
      if (fallback.status !== 200) throw new Error(result.error?.message || "IA indisponible");
    }

    const aiContent = result.choices?.[0]?.message?.content;

    return NextResponse.json({
      messages: [{ role: 'assistant', content: aiContent || "Désolé, je ne peux pas répondre pour le moment." }]
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({
      messages: [{ role: 'assistant', content: "⚠️ Service momentanément indisponible. Je vous prie de réessayer dans quelques instants." }]
    });
  }
}
