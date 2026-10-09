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
<title>مار پله فضایی</title>
<style>
  :root{--bg1:#0f0c29;--bg2:#302b63;--bg3:#24243e;--neon:#39ff14;--neon2:#ff2e63;}
  *{box-sizing:border-box;margin:0;padding:0}
  body{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:linear-gradient(135deg,var(--bg1),var(--bg2),var(--bg3));
    font-family:'Segoe UI',Tahoma,sans-serif;color:#fff;overflow:hidden;gap:16px;padding:20px}
  h1{font-size:28px;text-shadow:0 0 12px var(--neon);letter-spacing:2px}
  .wrap{position:relative}
  canvas{background:rgba(0,0,0,.45);border-radius:16px;box-shadow:0 0 40px rgba(57,255,20,.35),inset 0 0 30px rgba(0,0,0,.6);
    border:2px solid rgba(57,255,20,.4)}
  .hud{display:flex;gap:24px;font-size:18px;text-shadow:0 0 8px #000}
  .hud b{color:var(--neon)}
  .overlay{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;
    background:rgba(0,0,0,.75);border-radius:16px;gap:12px;text-align:center;padding:20px}
  .overlay.show{display:flex}
  .overlay h2{color:var(--neon2);text-shadow:0 0 14px var(--neon2);font-size:30px}
  button{background:linear-gradient(135deg,var(--neon),#00c9ff);border:none;padding:10px 26px;border-radius:30px;
    font-size:16px;font-weight:bold;cursor:pointer;color:#06231a;box-shadow:0 0 18px rgba(57,255,20,.6);transition:.2s}
  button:hover{transform:scale(1.06)}
  .hint{opacity:.7;font-size:13px}
  .dpad{display:grid;grid-template-columns:50px 50px 50px;grid-template-rows:50px 50px 50px;gap:6px;margin-top:4px}
  .dpad button{padding:0;font-size:20px;box-shadow:none;background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.3)}
  .dpad span{width:50px;height:50px}
</style>
</head>
<body>
  <h1>🐍 مار پله فضایی</h1>
  <div class="hud"><div>امتیاز: <b id="score">0</b></div><div>رکورد: <b id="best">0</b></div></div>
  <div class="wrap">
    <canvas id="c" width="400" height="400"></canvas>
    <div class="overlay" id="ov"><h2 id="ovTitle">باختی!</h2><p id="ovScore"></p><button id="retry">دوباره بازی کن</button></div>
  </div>
  <p class="hint">با کلیدهای جهت‌دار یا WASD حرکت کن</p>
  <div class="dpad">
    <span></span><button data-d="0,-1">▲</button><span></span>
    <button data-d="-1,0">◀</button><span></span><button data-d="1,0">▶</button>
    <span></span><button data-d="0,1">▼</button><span></span>
  </div>
<script>
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const SIZE=20,COUNT=20;
let snake,dir,food,score,best=+(localStorage.getItem('snakeBest')||0),alive,loopId,speed;
document.getElementById('best').textContent=best;

function reset(){
  snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];
  dir={x:1,y:0}; score=0; alive=true; speed=120;
  placeFood();
  document.getElementById('score').textContent=score;
  document.getElementById('ov').classList.remove('show');
  if(loopId) clearTimeout(loopId);
  tick();
}
function placeFood(){
  while(true){
    food={x:(Math.random()*COUNT)|0,y:(Math.random()*COUNT)|0};
    if(!snake.some(s=>s.x===food.x&&s.y===food.y)) break;
  }
}
function tick(){
  if(!alive) return;
  const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  if(head.x<0||head.y<0||head.x>=COUNT||head.y>=COUNT||snake.some(s=>s.x===head.x&&s.y===head.y)){
    gameOver(); return;
  }
  snake.unshift(head);
  if(head.x===food.x&&head.y===food.y){
    score++; document.getElementById('score').textContent=score;
    if(score>best){best=score;localStorage.setItem('snakeBest',best);document.getElementById('best').textContent=best;}
    placeFood();
    speed=Math.max(55,speed-2);
  } else snake.pop();
  draw();
  loopId=setTimeout(tick,speed);
}
function draw(){
  ctx.clearRect(0,0,cv.width,cv.height);
  const g=ctx.createLinearGradient(0,0,cv.width,cv.height);
  g.addColorStop(0,'#0f0c29');g.addColorStop(1,'#24243e');
  ctx.fillStyle=g; ctx.fillRect(0,0,cv.width,cv.height);
  ctx.fillStyle='#ff2e63'; ctx.shadowColor='#ff2e63'; ctx.shadowBlur=14;
  ctx.beginPath(); ctx.arc(food.x*SIZE+SIZE/2, food.y*SIZE+SIZE/2, SIZE/2-2,0,7); ctx.fill();
  ctx.shadowBlur=0;
  snake.forEach((s,i)=>{
    ctx.fillStyle = i===0 ? '#39ff14' : \`hsl(\${110+i*2},90%,\${45-i}%)\`;
    ctx.shadowColor='#39ff14'; ctx.shadowBlur = i===0?12:4;
    ctx.fillRect(s.x*SIZE+1,s.y*SIZE+1,SIZE-2,SIZE-2);
  });
  ctx.shadowBlur=0;
}
function gameOver(){
  alive=false;
  document.getElementById('ovTitle').textContent='باختی! 💥';
  document.getElementById('ovScore').textContent='امتیاز نهایی: '+score;
  document.getElementById('ov').classList.add('show');
}
function setDir(nx,ny){
  if(nx===-dir.x && ny===dir.y) return;
  if(ny===-dir.y && nx===dir.x) return;
  dir={x:nx,y:ny};
}
window.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(k==='arrowup'||k==='w') setDir(0,-1);
  else if(k==='arrowdown'||k==='s') setDir(0,1);
  else if(k==='arrowleft'||k==='a') setDir(-1,0);
  else if(k==='arrowright'||k==='d') setDir(1,0);
});
document.querySelectorAll('.dpad button').forEach(b=>{
  b.addEventListener('click',()=>{const [x,y]=b.dataset.d.split(',').map(Number); setDir(x,y);});
});
document.getElementById('retry').addEventListener('click',reset);
reset();
</script>
</body>
</html>`;
