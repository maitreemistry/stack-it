const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function geminiRequest(prompt: string) {
  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  if (!res.ok) throw new Error('Gemini API error');
  const data = await res.json();
  // Gemini returns candidates[0].content.parts[0].text
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.'
  );
}

export async function analyzeRelevance(content: string) {
  const prompt = `Analyze how relevant the following content is to the question. Give a short, clear summary.\n\nContent:\n${content}`;
  return geminiRequest(prompt);
}

export async function paraphrase(content: string) {
  const prompt = `Rewrite the following content for better clarity and readability. Make sure you make the html and other languages properly formatted for better understanding. Do not make it big.\n\nContent:\n${content}`;
  return geminiRequest(prompt);
}

export async function translate(content: string, targetLang: string) {
  const prompt = `Translate the following content to ${targetLang}. Do not alter the code part, only translate the text part.\n\nContent:\n${content}`;
  return geminiRequest(prompt);
} 