export default {
  async fetch(request) {
    return new Response(HTML, { headers: { "content-type": "text/html; charset=utf-8" } });
  },
};

const HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>گالری خودروهای رویایی</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Tahoma,sans-serif}
  body{background:#0b0b12;color:#fff}
  header{padding:70px 6vw 40px;text-align:center;background:radial-gradient(circle at 50% 0%,#1b1b2e,#0b0b12 70%)}
  header h1{font-size:40px;background:linear-gradient(90deg,#ff512f,#f09819);-webkit-background-clip:text;background-clip:text;color:transparent;letter-spacing:1px}
  header p{opacity:.65;margin-top:10px;font-size:15px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:26px;padding:0 6vw 70px;max-width:1300px;margin:0 auto}
  .card{background:linear-gradient(160deg,#151522,#0e0e17);border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,.06);
    cursor:pointer;transition:.35s;position:relative}
  .card:hover{transform:translateY(-8px);box-shadow:0 20px 40px rgba(240,120,30,.18);border-color:rgba(240,152,25,.4)}
  .shot{height:180px;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden}
  .shot svg{width:88%;filter:drop-shadow(0 10px 18px rgba(0,0,0,.5));transition:.4s}
  .card:hover .shot svg{transform:scale(1.08) translateX(-6px)}
  .tag{position:absolute;top:12px;left:12px;background:rgba(240,152,25,.9);color:#1a1a1a;font-size:11px;font-weight:bold;
    padding:3px 10px;border-radius:20px}
  .body{padding:18px 20px 22px}
  .body h3{font-size:19px;margin-bottom:4px}
  .body .model{opacity:.5;font-size:12px;margin-bottom:12px}
  .specs{display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12.5px;opacity:.85}
  .specs div b{display:block;color:#f09819;font-size:15px}
  .price{margin-top:14px;font-size:17px;font-weight:bold;color:#2ee6a6}
  .modal{position:fixed;inset:0;background:rgba(0,0,0,.75);display:none;align-items:center;justify-content:center;z-index:50;padding:20px}
  .modal.show{display:flex}
  .modal-box{background:#14141f;max-width:480px;width:100%;border-radius:20px;padding:30px;border:1px solid rgba(255,255,255,.08);text-align:center}
  .modal-box svg{width:70%;margin-bottom:10px}
  .modal-box h2{font-size:24px;margin-bottom:6px}
  .closeBtn{margin-top:18px;background:linear-gradient(135deg,#ff512f,#f09819);border:none;color:#1a1a1a;font-weight:bold;
    padding:10px 26px;border-radius:30px;cursor:pointer}
</style>
</head>
<body>
<header><h1>🏎️ گالری خودروهای رویایی</h1><p>مجموعه‌ای منتخب از مفهومی‌ترین طراحی‌های خودرو</p></header>
<div class="grid" id="grid"></div>
<div class="modal" id="modal"><div class="modal-box" id="modalBox"></div></div>
<script>
const colors=['#ff512f','#2ee6a6','#4facfe','#f093fb','#fa709a','#ffd23f'];
const cars=[
  {name:'Vortex GT',model:'کوپه اسپرت ۲۰۲۶',hp:612,speed:'3.1s',top:'330',price:'۴۲۰,۰۰۰ دلار',tag:'جدید',c:colors[0]},
  {name:'Lunar Phantom',model:'سدان لوکس الکتریکی',hp:980,speed:'2.0s',top:'350',price:'۵۸۰,۰۰۰ دلار',tag:'الکتریکی',c:colors[3]},
  {name:'Dune Raptor',model:'شاسی‌بلند آفرود',hp:510,speed:'4.4s',top:'230',price:'۱۹۰,۰۰۰ دلار',tag:'پرفروش',c:colors[2]},
  {name:'Nova Spectra',model:'هایپرکار مفهومی',hp:1350,speed:'1.8s',top:'410',price:'۲,۱۰۰,۰۰۰ دلار',tag:'انحصاری',c:colors[4]},
  {name:'Ember Roadster',model:'کانورتیبل کلاسیک',hp:450,speed:'4.0s',top:'270',price:'۲۱۰,۰۰۰ دلار',tag:'کلاسیک',c:colors[1]},
  {name:'Glacier X1',model:'شاسی‌بلند الکتریکی',hp:720,speed:'3.3s',top:'260',price:'۳۳۰,۰۰۰ دلار',tag:'خانواده',c:colors[5]},
];
function carSVG(c){
  return \`<svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="200" cy="140" rx="170" ry="12" fill="#000" opacity="0.4"/>
    <path d="M40 110 Q50 60 110 55 L160 30 Q200 18 250 30 L300 55 Q355 60 365 110 Z" fill="\${c}"/>
    <path d="M110 55 L160 32 Q200 22 250 32 L300 55 L275 60 L135 60 Z" fill="rgba(255,255,255,.25)"/>
    <circle cx="110" cy="115" r="26" fill="#111"/><circle cx="110" cy="115" r="12" fill="#777"/>
    <circle cx="300" cy="115" r="26" fill="#111"/><circle cx="300" cy="115" r="12" fill="#777"/>
    <rect x="45" y="95" width="30" height="10" rx="4" fill="#fffbe0"/>
    <rect x="330" y="95" width="30" height="10" rx="4" fill="#ff3b3b"/>
  </svg>\`;
}
const grid=document.getElementById('grid');
cars.forEach((car,i)=>{
  const el=document.createElement('div');
  el.className='card';
  el.innerHTML=\`<div class="shot" style="background:radial-gradient(circle,\${car.c}22,transparent 70%)">
      <span class="tag">\${car.tag}</span>\${carSVG(car.c)}</div>
    <div class="body"><h3>\${car.name}</h3><div class="model">\${car.model}</div>
      <div class="specs">
        <div>قدرت<b>\${car.hp} hp</b></div>
        <div>۰-۱۰۰<b>\${car.speed}</b></div>
        <div>سرعت نهایی<b>\${car.top} km/h</b></div>
        <div>رده<b>\${car.tag}</b></div>
      </div>
      <div class="price">\${car.price}</div></div>\`;
  el.addEventListener('click',()=>openModal(car));
  grid.appendChild(el);
});
function openModal(car){
  document.getElementById('modalBox').innerHTML=\`\${carSVG(car.c)}<h2>\${car.name}</h2>
    <p style="opacity:.6;margin-bottom:14px">\${car.model}</p>
    <div class="specs" style="justify-content:center">
      <div>قدرت<b>\${car.hp} hp</b></div><div>۰-۱۰۰<b>\${car.speed}</b></div>
      <div>سرعت نهایی<b>\${car.top} km/h</b></div><div>قیمت<b style="color:#2ee6a6">\${car.price}</b></div>
    </div><button class="closeBtn" onclick="document.getElementById('modal').classList.remove('show')">بستن</button>\`;
  document.getElementById('modal').classList.add('show');
}
document.getElementById('modal').addEventListener('click',e=>{ if(e.target.id==='modal') e.target.classList.remove('show'); });
</script>
</body>
</html>`;
