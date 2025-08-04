const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // CORS 设置
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 验证请求体
    if (!req.body || !req.body.question) {
      return res.status(400).json({ error: 'Missing question parameter' });
    }
    
    const { question } = req.body;
    const GEMINI_KEY = process.env.GEMINI_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ 
              text: `You are an IELTS writing expert. Generate a detailed outline with 4 paragraphs and academic vocabulary for:
              
Topic: ${question}
              
Format:
1. Introduction (paraphrase topic + thesis)
2. Body Paragraph 1 (main idea + 2 examples)
3. Body Paragraph 2 (counter-argument + rebuttal) 
4. Conclusion (restate thesis + recommendation)` 
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API request failed');
    }
    
    const data = await response.json();
    res.status(200).json({
      output: data.candidates?.[0]?.content?.parts?.[0]?.text || "No content generated"
    });
    
  } catch (e) {
    console.error('API Error:', e);
    res.status(500).json({ 
      error: e.message || 'Internal server error',
      tip: e.message.includes('key') ? 'Check GEMINI_KEY environment variable' : undefined
    });
  }
}
