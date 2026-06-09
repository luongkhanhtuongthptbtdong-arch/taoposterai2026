export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages } = req.body;
    const userMsg = messages[0].content;

    const PROMPT = `Bạn là chuyên gia giải toán Việt Nam. Trả về JSON (KHÔNG markdown, KHÔNG backtick):
{"tieu_de":"TOÁN 12 – CÂU X","de_bai":"...","cac_buoc":[{"so":1,"ten":"...","noi_dung":"...","cong_thuc":"..."}],"dap_an":"...","don_vi":"..."}`;

    let text = typeof userMsg === 'string' ? userMsg : 
      userMsg.filter(i => i.type === 'text').map(i => i.text).join(' ');

    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: PROMPT },
            { role: 'user', content: text || 'Giải bài toán này' }
          ]
        })
      }
    );

    const data = await cfRes.json();
    const result = data.result?.response || '';
    res.status(200).json({ content: [{ type: 'text', text: result }] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
