export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages } = req.body;
    const userMsg = messages[0].content;

    const PROMPT = `Bạn là chuyên gia giải toán Việt Nam. Hãy đọc đề bài và trả về JSON (KHÔNG markdown, KHÔNG backtick), đúng format sau:
{"tieu_de":"TOÁN 12 – CÂU X","de_bai":"nội dung đề bài...","cac_buoc":[{"so":1,"ten":"Tên bước","noi_dung":"giải thích...","cong_thuc":"công thức dùng Unicode: π ² ³ √ × ÷ ≈ ⇔"}],"dap_an":"kết quả","don_vi":"đơn vị nếu có"}
Quy tắc: giải đúng đủ bước, cong_thuc để chuỗi rỗng nếu không cần, dap_an chỉ là con số/kết quả cuối.`;

    let parts = [];
    if (typeof userMsg === 'string') {
      parts = [{ text: PROMPT + '\n\nĐề bài: ' + userMsg }];
    } else {
      parts = [{ text: PROMPT + '\n\n' }];
      for (const item of userMsg) {
        if (item.type === 'text') {
          parts.push({ text: item.text || 'Hãy đọc và giải đề bài trong ảnh.' });
        } else if (item.type === 'image') {
          parts.push({ inlineData: { mimeType: item.source.media_type, data: item.source.data } });
        }
      }
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
        })
      }
    );

    const data = await geminiRes.json();
    console.log('GEMINI FULL:', JSON.stringify(data));
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.status(200).json({ content: [{ type: 'text', text }], debug: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
