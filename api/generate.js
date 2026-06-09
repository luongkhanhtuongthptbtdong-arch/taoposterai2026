<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Poster Giải Toán AI</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { min-height:100vh; background:#050f05; font-family:'Segoe UI',Arial,sans-serif; color:#fff; padding:24px; }
#input-panel { max-width:780px; margin:0 auto 32px; background:#0d1f0d; border:1.5px solid rgba(255,215,0,.35); border-radius:14px; padding:24px; }
#input-panel h1 { font-size:20px; font-weight:900; background:linear-gradient(90deg,#ff4444,#ffd700); -webkit-background-clip:text; -webkit-text-fill-color:transparent; letter-spacing:1px; margin-bottom:16px; }
#upload-zone { border:2px dashed rgba(255,215,0,.4); border-radius:10px; padding:18px; text-align:center; cursor:pointer; margin-bottom:12px; transition:border-color .2s,background .2s; position:relative; }
#upload-zone:hover, #upload-zone.drag-over { border-color:#ffd700; background:rgba(255,215,0,.05); }
#upload-zone input[type=file] { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }
#upload-zone .uz-icon { font-size:28px; margin-bottom:6px; }
#upload-zone .uz-text { color:#aaffaa; font-size:13px; }
#upload-zone .uz-sub { color:#668866; font-size:11px; margin-top:3px; }
#preview-area { display:none; margin-bottom:12px; position:relative; }
#preview-area img { max-width:100%; max-height:220px; border-radius:8px; border:1px solid rgba(255,215,0,.3); display:block; margin:0 auto; }
#preview-area .preview-label { font-size:11px; color:#ffd700; text-align:center; margin-bottom:6px; text-transform:uppercase; letter-spacing:1px; }
#btn-clear { position:absolute; top:26px; right:8px; background:rgba(255,50,50,.8); border:none; border-radius:50%; width:26px; height:26px; color:#fff; font-size:14px; cursor:pointer; font-weight:700; }
.divider { display:flex; align-items:center; gap:10px; margin-bottom:12px; color:#446644; font-size:12px; }
.divider::before, .divider::after { content:''; flex:1; height:1px; background:rgba(255,215,0,.15); }
textarea { width:100%; min-height:90px; background:#0a150a; border:1px solid rgba(255,215,0,.25); border-radius:8px; color:#e0ffe0; padding:12px; font-size:14px; resize:vertical; outline:none; font-family:inherit; }
textarea:focus { border-color:rgba(255,215,0,.6); }
.btn-row { display:flex; gap:12px; margin-top:14px; }
button { padding:12px 0; border:none; border-radius:8px; font-weight:800; font-size:15px; cursor:pointer; letter-spacing:1px; transition:opacity .2s; }
button:disabled { opacity:.45; cursor:not-allowed; }
#btn-generate { flex:1; background:linear-gradient(135deg,#ff4444,#ffd700); color:#000; }
#btn-export { padding:12px 22px; background:linear-gradient(135deg,#00d4ff,#0055ff); color:#fff; display:none; }
#error-msg { color:#ff7777; font-size:13px; margin-top:10px; }
#poster-wrap { max-width:780px; margin:0 auto; display:none; }
#poster { background:linear-gradient(180deg,#050f05 0%,#071507 100%); border-radius:16px; box-shadow:0 0 0 3px #ffd700,0 0 50px rgba(255,215,0,.2); overflow:hidden; }
.p-header { background:linear-gradient(135deg,#1a0000,#0a0a00,#001a00); padding:22px 30px 18px; border-bottom:2px solid rgba(255,215,0,.4); text-align:center; }
.p-header .sub { font-size:12px; color:#00d4ff; letter-spacing:3px; font-weight:600; margin-bottom:6px; text-transform:uppercase; }
.p-header .title { font-size:24px; font-weight:900; background:linear-gradient(90deg,#ff4444,#ffd700,#ff4444); -webkit-background-clip:text; -webkit-text-fill-color:transparent; letter-spacing:2px; }
.p-body { padding:22px 30px; }
.p-debai { background:#0d2b0d; border-left:4px solid #ffd700; border-radius:0 10px 10px 0; padding:14px 18px; margin-bottom:20px; }
.p-debai .label { font-size:12px; color:#ffd700; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
.p-debai .text { font-size:14px; color:#c8ffc8; line-height:1.75; }
.p-section-title { font-size:12px; color:#ffd700; font-weight:700; text-align:center; letter-spacing:3px; text-transform:uppercase; margin-bottom:14px; }
.p-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
.p-step { border-radius:10px; padding:14px 16px; border:1.5px solid; }
.p-step.full { grid-column:1/-1; }
.step-head { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.step-num { width:28px; height:28px; border-radius:50%; font-weight:900; font-size:13px; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#000; }
.step-name { font-weight:700; font-size:13px; }
.step-body { font-size:13px; color:#d0f0d0; line-height:1.7; }
.step-formula { margin-top:8px; background:rgba(0,0,0,.35); border-radius:6px; padding:8px 12px; font-size:13px; color:#fffbe0; font-family:'Courier New',monospace; line-height:1.75; white-space:pre-wrap; }
.p-answer { background:linear-gradient(135deg,#001540,#00102a,#001540); border:2px solid #ffd700; border-radius:12px; padding:22px 30px; text-align:center; box-shadow:0 0 30px rgba(255,215,0,.2); }
.p-answer .ans-label { font-size:13px; color:#00d4ff; letter-spacing:4px; font-weight:700; text-transform:uppercase; margin-bottom:8px; }
.p-answer .ans-val { font-size:56px; font-weight:900; color:#ffd700; text-shadow:0 0 20px #ffd700,0 0 40px rgba(255,215,0,.5); line-height:1.1; }
.p-answer .ans-unit { color:#88aaff; font-size:14px; margin-top:5px; }
@keyframes spin { to { transform:rotate(360deg); } }
.spinner { width:18px; height:18px; border:2px solid rgba(255,255,255,.2); border-top-color:#ffd700; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; vertical-align:middle; margin-right:8px; }
</style>
</head>
<body>
<div id="input-panel">
  <h1>🎯 POSTER GIẢI TOÁN AI</h1>
  <div id="upload-zone"
    ondragover="event.preventDefault();this.classList.add('drag-over')"
    ondragleave="this.classList.remove('drag-over')"
    ondrop="handleDrop(event)">
    <input type="file" accept="image/*,.pdf" onchange="handleFile(this.files[0])">
    <div class="uz-icon">📎</div>
    <div class="uz-text">Kéo thả hoặc nhấn để chọn <strong>ảnh / PDF</strong> đề bài</div>
    <div class="uz-sub">JPG, PNG, WEBP, PDF</div>
  </div>
  <div id="preview-area">
    <div class="preview-label">📋 Xem trước file đã chọn</div>
    <img id="preview-img" src="" alt="preview">
    <button id="btn-clear" onclick="clearFile()">✕</button>
  </div>
  <div class="divider">hoặc nhập tay</div>
  <textarea id="de-bai" placeholder="Dán đề bài vào đây... (văn bản hoặc mô tả bài toán)"></textarea>
  <div class="btn-row">
    <button id="btn-generate" onclick="generate()">✨ TẠO POSTER</button>
    <button id="btn-export" onclick="exportImg()">📥 Tải ảnh PNG</button>
  </div>
  <div id="error-msg"></div>
</div>
<div id="poster-wrap"><div id="poster"></div></div>

<script>
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ⚠️ Thay key này bằng Gemini API key của bạn
const GEMINI_KEY = 'AQ.Ab8RN6IRK28NLgwWNR3914l5ZVAH_fW7J52A53pwyAnuLIxu-w';

const COLORS=[
  {bg:'#0d2b0d',border:'rgba(255,215,0,.3)',accent:'#ffd700'},
  {bg:'#0a1e2e',border:'rgba(0,212,255,.3)',accent:'#00d4ff'},
  {bg:'#1a0a2e',border:'rgba(192,132,252,.3)',accent:'#c084fc'},
  {bg:'#2e1a0a',border:'rgba(251,146,60,.3)',accent:'#fb923c'},
  {bg:'#0a2e1a',border:'rgba(52,211,153,.3)',accent:'#34d399'},
];

const PROMPT=`Bạn là chuyên gia giải toán Việt Nam. Hãy đọc đề bài và trả về JSON (KHÔNG markdown, KHÔNG backtick), đúng format sau:
{"tieu_de":"TOÁN 12 – CÂU X","de_bai":"nội dung đề bài...","cac_buoc":[{"so":1,"ten":"Tên bước","noi_dung":"giải thích...","cong_thuc":"công thức dùng Unicode: π ² ³ √ × ÷ ≈ ⇔"}],"dap_an":"kết quả","don_vi":"đơn vị nếu có"}
Quy tắc: giải đúng đủ bước, cong_thuc để chuỗi rỗng nếu không cần, dap_an chỉ là con số/kết quả cuối.`;

let currentFileData=null;

function handleDrop(e){e.preventDefault();document.getElementById('upload-zone').classList.remove('drag-over');const f=e.dataTransfer.files[0];if(f)handleFile(f);}
function handleFile(file){
  if(!file)return;
  const isPDF=file.type==='application/pdf',isImg=file.type.startsWith('image/');
  if(!isPDF&&!isImg){document.getElementById('error-msg').textContent='❌ Chỉ hỗ trợ ảnh hoặc PDF.';return;}
  const reader=new FileReader();
  reader.onload=async(ev)=>{
    const base64=ev.target.result.split(',')[1];
    if(isPDF){await showPDFPreview(ev.target.result);currentFileData={type:'pdf',base64,mediaType:'application/pdf'};}
    else{document.getElementById('preview-img').src=ev.target.result;document.getElementById('preview-area').style.display='block';currentFileData={type:'image',base64,mediaType:file.type};}
    document.getElementById('error-msg').textContent='';
  };
  reader.readAsDataURL(file);
}
async function showPDFPreview(dataUrl){
  try{
    const pdf=await pdfjsLib.getDocument(dataUrl).promise;
    const page=await pdf.getPage(1);
    const vp=page.getViewport({scale:1.2});
    const c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;
    await page.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;
    document.getElementById('preview-img').src=c.toDataURL();
    document.getElementById('preview-area').style.display='block';
  }catch(e){}
}
function clearFile(){currentFileData=null;document.getElementById('preview-area').style.display='none';document.getElementById('preview-img').src='';document.getElementById('upload-zone').querySelector('input').value='';}

async function generate(){
  const textInput=document.getElementById('de-bai').value.trim();
  if(!currentFileData&&!textInput){document.getElementById('error-msg').textContent='❌ Vui lòng upload ảnh/PDF hoặc nhập đề bài.';return;}
  const btn=document.getElementById('btn-generate');
  document.getElementById('error-msg').textContent='';
  btn.disabled=true;btn.innerHTML='<span class="spinner"></span>Đang tạo poster...';

  try{
    let parts=[{text: PROMPT + '\n\n' + (textInput||'Hãy đọc và giải đề bài trong ảnh.')}];
    if(currentFileData&&currentFileData.type==='image'){
      parts.push({inline_data:{mime_type:currentFileData.mediaType,data:currentFileData.base64}});
    }

    const res=await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {method:'POST',headers:{'Content-Type':'application/json'},
       body:JSON.stringify({contents:[{parts}],generationConfig:{temperature:0.2,maxOutputTokens:2048}})}
    );
    const data=await res.json();
    const text=data.candidates?.[0]?.content?.parts?.[0]?.text||'';
    if(!text)throw new Error('Không có phản hồi');
    const d=JSON.parse(text.replace(/```json|```/g,'').trim());
    renderPoster(d);
    document.getElementById('btn-export').style.display='block';
  }catch(e){
    document.getElementById('error-msg').textContent='❌ Không tạo được poster. Kiểm tra lại hoặc thử lại.';
  }finally{btn.disabled=false;btn.innerHTML='✨ TẠO POSTER';}
}

function renderPoster(d){
  const steps=(d.cac_buoc||[]).map((b,i)=>{
    const c=COLORS[i%COLORS.length];
    const fw=(d.cac_buoc.length%2!==0&&i===d.cac_buoc.length-1)?' full':'';
    return `<div class="p-step${fw}" style="background:${c.bg};border-color:${c.border}"><div class="step-head"><div class="step-num" style="background:${c.accent}">${b.so}</div><div class="step-name" style="color:${c.accent}">${b.ten}</div></div><div class="step-body">${b.noi_dung}</div>${b.cong_thuc?`<div class="step-formula">${b.cong_thuc}</div>`:''}</div>`;
  }).join('');
  document.getElementById('poster').innerHTML=`<div class="p-header"><div class="sub">GIẢI CHI TIẾT ĐỀ THI THỬ TỐT NGHIỆP</div><div class="title">${d.tieu_de}</div></div><div class="p-body"><div class="p-debai"><div class="label">📋 Đề bài</div><div class="text">${d.de_bai}</div></div><div class="p-section-title">✦ BÀI GIẢI ✦</div><div class="p-grid">${steps}</div><div class="p-answer"><div class="ans-label">Đáp án</div><div class="ans-val">${d.dap_an}</div>${d.don_vi?`<div class="ans-unit">${d.don_vi}</div>`:''}</div></div>`;
  document.getElementById('poster-wrap').style.display='block';
  document.getElementById('poster-wrap').scrollIntoView({behavior:'smooth'});
}

async function exportImg(){
  const btn=document.getElementById('btn-export');
  btn.disabled=true;btn.textContent='⏳ Đang xuất...';
  try{
    const canvas=await html2canvas(document.getElementById('poster'),{scale:2,backgroundColor:'#050f05',useCORS:true,logging:false});
    const link=document.createElement('a');link.download='poster-giai-toan.png';link.href=canvas.toDataURL('image/png');link.click();
  }catch(e){alert('Không xuất được ảnh.');}
  finally{btn.disabled=false;btn.textContent='📥 Tải ảnh PNG';}
}
document.getElementById('de-bai').addEventListener('keydown',e=>{if(e.ctrlKey&&e.key==='Enter')generate();});
</script>
</body>
</html>
