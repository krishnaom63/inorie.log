exports.handler = async function(event, context) {
const headers = {
“Access-Control-Allow-Origin”: “*”,
“Access-Control-Allow-Headers”: “Content-Type”,
“Access-Control-Allow-Methods”: “POST, OPTIONS”
};

if (event.httpMethod === “OPTIONS”) {
return { statusCode: 200, headers, body: “” };
}

if (event.httpMethod !== “POST”) {
return { statusCode: 405, headers, body: JSON.stringify({ error: “Method not allowed” }) };
}

try {
const { system, message } = JSON.parse(event.body);
const apiKey = process.env.GEMINI_API_KEY;

```
if (!apiKey) {
  return { statusCode: 500, headers, body: JSON.stringify({ error: "API key not configured" }) };
}

const prompt = system ? `${system}\n\n${message}` : message;

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

return {
  statusCode: 200,
  headers,
  body: JSON.stringify({ text })
};
```

} catch (e) {
return {
statusCode: 500,
headers,
body: JSON.stringify({ error: e.message })
};
}
};
