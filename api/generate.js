export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { system, messages } = req.body;
    const userMsg = messages[0].content;

    // Chuyển format sang Gemini
    let parts = [];
    if (typeof userMsg === 'string') {
      parts.push({ text: system + '\n\n' + userMsg });
    } else {
      parts.push({ text: system + '\n\n' });
      for (const item of userMsg) {
        if (item.type === 'text') {
          parts.push({ text: item.text });
        } else if (item.type === 'image') {
          parts.push({ inlineData: { mimeType: item.source.media_type, data: item.source.data } });
        }
      }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] })
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Trả về format giống Anthropic để frontend không cần sửa
    res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
