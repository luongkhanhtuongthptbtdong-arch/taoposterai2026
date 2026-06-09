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

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    let textContent = PROMPT + '\n\n';
    let imageBase64 = null;
    let imageType = null;

    if (typeof userMsg === 'string') {
      textContent += 'Đề bài: ' + userMsg;
    } else {
      for (const item of userMsg) {
        if (item.type === 'text') {
          textContent += item.text || 'Hãy đọc và giải đề bài trong ảnh.';
        } else if (item.type === 'image') {
          imageBase64 = item.source.data;
          imageType = item.source.media_type;
        }
      }
    }

    let requestBody;
    let model;

    if (imageBase64) {
      // Dùng model
