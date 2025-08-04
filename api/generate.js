export default async function handler(req, res) {
  // 允许跨域（可选）
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question } = req.body;
    const prompt = "You are an IELTS writing expert. Generate a detailed outline and useful vocabulary for:";
    
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${prompt}\n\nTopic: ${question}` }]
          }]
        })
      }
    );

    const data = await geminiResponse.json();
    res.status(200).json({
      output: data.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No valid response from AI"
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
