// 必须使用 module.exports 格式（非 export default）
module.exports = async (req, res) => {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const { question } = req.body;
    const GEMINI_KEY = process.env.GEMINI_KEY; // 从环境变量读取

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `作为雅思写作专家，请生成大纲：\n\n${question}` }]
          }]
        })
      }
    );

    const data = await response.json();
    res.status(200).json({
      output: data.candidates?.[0]?.content?.parts?.[0]?.text || "AI响应为空"
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
