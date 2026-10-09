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
<title>جاده بی‌پایان</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;
    background:#05070d;color:#fff;font-family:'Segoe UI',Tahoma,sans-serif;overflow:hidden}
  h1{font-size:26px;color:#00e5ff;text-shadow:0 0 12px #00e5ff}
  .hud{display:flex;gap:26px;font-size:16px}
  .hud b{color:#ffd23f}
  .wrap{position:relative}
  canvas{background:#111;border-radius:14px;border:2px solid rgba(0,229,255,.35);box-shadow:0 0 30px rgba(0,229,255,.25)}
  .overlay{position:absolute;inset:0;background:rgba(0,0,0,.75);display:none;flex-direction:column;align-items:center;
    justify-content:center;border-radius:14px;gap:10px;text-align:center}
  .overlay.show{display:flex}
  .overlay h2{color:#ff2e63;text-shadow:0 0 12px #ff2e63;font-size:26px}
  button{background:linear-gradient(135deg,#00e5ff,#7f5af0);border:none;padding:10px 26px;border-radius:30px;
    font-weight:bold;cursor:pointer;color:#06131a}
  .hint{opacity:.6;font-size:13px}
  .ctrls{display:flex;gap:40px;margin-top:4px}
  .ctrls button{width:70px;height:50px;font-size:20px;background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.3)}
</style>
</head>
<body>
<h1>🏎️ جاده بی‌پایان</h1>
<div class="hud"><div>امتیاز: <b id="score">0</b></div><div>رکورد: <b id="best">0</b></div><div>سرعت: <b id="spd">1x</b></div></div>
<div class="wrap">
  <canvas id="c" width="360" height="520"></canvas>
  <div class="overlay" id="ov"><h2>تصادف کردی! 💥</h2><p id="ovScore"></p><button id="retry">دوباره بازی کن</button></div>
</div>
<p class="hint">با کلیدهای چپ/راست یا دکمه‌ها حرکت کن</p>
<div class="ctrls"><button id="L">◀</button><button id="R">▶</button></div>
<script>
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
const LANES=3, LANE_W=cv.width/LANES;
let carLane=1, carY=cv.height-90, obstacles=[], score=0, best=+(localStorage.getItem('roadBest')||0), speed=4, alive=true, frame=0;
document.getElementById('best').textContent=best;

function reset(){
  carLane=1; obstacles=[]; score=0; speed=4; alive=true; frame=0;
  document.getElementById('score').textContent=0;
  document.getElementById('spd').textContent='1x';
  document.getElementById('ov').classList.remove('show');
  requestAnimationFrame(loop);
}
function laneX(l){ return l*LANE_W+LANE_W/2; }
let roadOffset=0;
function loop(){
  if(!alive) return;
  frame++;
  roadOffset=(roadOffset+speed)%40;
  if(frame%Math.max(18,70-Math.floor(speed*6))===0){
    const lane=(Math.random()*LANES)|0;
    obstacles.push({lane,y:-40,type:Math.random()<0.2?'coin':'car'});
  }
  obstacles.forEach(o=>o.y+=speed);
  obstacles=obstacles.filter(o=>{
    if(o.y>cv.height+40) return false;
    const hit = Math.abs(o.y-carY)<34 && o.lane===carLane;
    if(hit){
      if(o.type==='coin'){ score+=5; return false; }
      else { gameOver(); }
    }
    return true;
  });
  if(frame%600===0){ speed=Math.min(11,speed+0.7); document.getElementById('spd').textContent=(speed/4).toFixed(1)+'x'; }
  score++;
  document.getElementById('score').textContent=score;
  draw();
  if(alive) requestAnimationFrame(loop);
}
function draw(){
  ctx.fillStyle='#1b1b24'; ctx.fillRect(0,0,cv.width,cv.height);
  ctx.fillStyle='#2a2a38';
  for(let l=1;l<LANES;l++){
    for(let y=-40+roadOffset;y<cv.height;y+=40){
      ctx.fillRect(l*LANE_W-2,y,4,22);
    }
  }
  obstacles.forEach(o=>{
    const x=laneX(o.lane);
    if(o.type==='coin'){
      ctx.fillStyle='#ffd23f'; ctx.shadowColor='#ffd23f'; ctx.shadowBlur=10;
      ctx.beginPath(); ctx.arc(x,o.y,12,0,7); ctx.fill(); ctx.shadowBlur=0;
    } else {
      ctx.fillStyle='#ff2e63'; ctx.shadowColor='#ff2e63'; ctx.shadowBlur=8;
      roundRect(x-22,o.y-28,44,56,8); ctx.fill();
      ctx.shadowBlur=0;
      ctx.fillStyle='rgba(255,255,255,.3)'; roundRect(x-16,o.y-18,32,16,4); ctx.fill();
    }
  });
  const cx=laneX(carLane);
  ctx.fillStyle='#00e5ff'; ctx.shadowColor='#00e5ff'; ctx.shadowBlur=12;
  roundRect(cx-22,carY-30,44,60,8); ctx.fill();
  ctx.shadowBlur=0;
  ctx.fillStyle='rgba(255,255,255,.35)'; roundRect(cx-16,carY-18,32,20,4); ctx.fill();
}
function roundRect(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
}
function gameOver(){
  alive=false;
  if(score>best){ best=score; localStorage.setItem('roadBest',best); document.getElementById('best').textContent=best; }
  document.getElementById('ovScore').textContent='امتیاز نهایی: '+score;
  document.getElementById('ov').classList.add('show');
}
function moveLane(d){ carLane=Math.max(0,Math.min(LANES-1,carLane+d)); }
window.addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft') moveLane(-1);
  else if(e.key==='ArrowRight') moveLane(1);
});
document.getElementById('L').addEventListener('click',()=>moveLane(-1));
document.getElementById('R').addEventListener('click',()=>moveLane(1));
document.getElementById('retry').addEventListener('click',reset);
reset();
</script>
</body>
</html>`;
