export default async function handler(req, res) {
res.setHeader(“Access-Control-Allow-Origin”, “*”);
res.setHeader(“Access-Control-Allow-Methods”, “POST, OPTIONS”);
res.setHeader(“Access-Control-Allow-Headers”, “Content-Type”);
if (req.method === “OPTIONS”) return res.status(200).end();
if (req.method !== “POST”) return res.status(405).json({ error: “Method not allowed” });

try {
const { system, message } = req.body;
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) return res.status(500).json({ error: “API key not configured” });

```
const prompt = system
  ? `${system}\n\n${message}`
  : message;

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
    })
  }
);

const data = await response.json();
const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
res.status(200).json({ text });
```

} catch (e) {
res.status(500).json({ error: e.message });
}
}
