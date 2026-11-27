import "server-only";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

export type GroqResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

export async function groqComplete(
  system: string,
  user: string,
): Promise<GroqResult> {
  const key =
    process.env.GROQ_API_KEY?.trim() ||
    process.env.groq_api_key?.trim() ||
    "";

  if (!key) {
    return {
      ok: false,
      error: "GROQ_API_KEY is not configured on the server.",
    };
  }

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        max_tokens: 900,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Groq error ${res.status}${body ? `: ${body.slice(0, 180)}` : ""}`,
      };
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) return { ok: false, error: "Empty response from Groq." };
    return { ok: true, text };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Groq request failed.",
    };
  }
}
