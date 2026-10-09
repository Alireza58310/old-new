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
<title>۲۰۴۸ کهکشانی</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Tahoma,sans-serif;user-select:none}
  body{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;
    background:linear-gradient(160deg,#1a1a2e,#16213e);color:#fff;padding:20px}
  h1{font-size:30px;background:linear-gradient(90deg,#ffd23f,#ff512f);-webkit-background-clip:text;background-clip:text;color:transparent}
  .top{display:flex;gap:14px;align-items:center}
  .score-box{background:#0f3460;padding:8px 20px;border-radius:12px;text-align:center;min-width:80px}
  .score-box span{display:block;font-size:11px;opacity:.6}
  .score-box b{font-size:20px}
  #board{display:grid;grid-template-columns:repeat(4,76px);grid-template-rows:repeat(4,76px);gap:10px;
    background:#0f3460;padding:12px;border-radius:16px;position:relative;box-shadow:0 10px 30px rgba(0,0,0,.4)}
  .cell{background:rgba(255,255,255,.06);border-radius:10px}
  .tile{position:absolute;width:76px;height:76px;border-radius:10px;display:flex;align-items:center;justify-content:center;
    font-size:26px;font-weight:bold;transition:top .12s,left .12s,transform .12s;color:#1a1a2e}
  button{background:linear-gradient(135deg,#ffd23f,#ff512f);border:none;padding:10px 24px;border-radius:30px;
    font-weight:bold;cursor:pointer;color:#1a1a2e}
  .msg{position:absolute;inset:12px;background:rgba(15,15,30,.85);border-radius:14px;display:none;flex-direction:column;
    align-items:center;justify-content:center;gap:10px;z-index:9}
  .msg.show{display:flex}
  .hint{opacity:.55;font-size:13px}
</style>
</head>
<body>
<h1>🪐 ۲۰۴۸ کهکشانی</h1>
<div class="top">
  <div class="score-box"><span>امتیاز</span><b id="score">0</b></div>
  <div class="score-box"><span>رکورد</span><b id="best">0</b></div>
  <button id="newGame">بازی جدید</button>
</div>
<div id="board">
  <div class="msg" id="msg"><div id="msgText" style="font-size:22px;font-weight:bold"></div><button id="again">دوباره</button></div>
</div>
<p class="hint">با کلیدهای جهت‌دار یا سوایپ بازی کن</p>
<script>
const SIZE=4, GAP=10, CELL=76;
let grid, score=0, best=+(localStorage.getItem('g2048Best')||0);
document.getElementById('best').textContent=best;
const board=document.getElementById('board');
for(let i=0;i<16;i++){const c=document.createElement('div');c.className='cell';board.appendChild(c);}
const colors={2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',64:'#f65e3b',
  128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#edc22e',4096:'#3c3a32'};

function newGame(){
  grid=Array.from({length:SIZE},()=>Array(SIZE).fill(0));
  score=0; document.getElementById('score').textContent=0;
  document.getElementById('msg').classList.remove('show');
  addTile(); addTile(); render();
}
function addTile(){
  const empty=[];
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++) if(!grid[r][c]) empty.push([r,c]);
  if(!empty.length) return;
  const [r,c]=empty[(Math.random()*empty.length)|0];
  grid[r][c]=Math.random()<0.9?2:4;
}
function render(){
  board.querySelectorAll('.tile').forEach(t=>t.remove());
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){
    if(!grid[r][c]) continue;
    const t=document.createElement('div');
    t.className='tile'; t.textContent=grid[r][c];
    t.style.top=(12+r*(CELL+GAP))+'px'; t.style.left=(12+c*(CELL+GAP))+'px';
    t.style.background=colors[grid[r][c]]||'#000';
    t.style.color=grid[r][c]<=4?'#776e65':'#fff';
    t.style.fontSize=grid[r][c]>512?'20px':'26px';
    board.appendChild(t);
  }
}
function slide(row){
  const arr=row.filter(x=>x);
  for(let i=0;i<arr.length-1;i++){
    if(arr[i]===arr[i+1]){arr[i]*=2; score+=arr[i]; arr.splice(i+1,1);}
  }
  while(arr.length<SIZE) arr.push(0);
  return arr;
}
function rotate(g){
  const n=g.length, res=Array.from({length:n},()=>Array(n).fill(0));
  for(let r=0;r<n;r++)for(let c=0;c<n;c++) res[c][n-1-r]=g[r][c];
  return res;
}
function move(dir){
  let g=grid.map(r=>r.slice());
  let rot=0;
  if(dir==='up') rot=3; else if(dir==='right') rot=2; else if(dir==='down') rot=1;
  for(let i=0;i<rot;i++) g=rotate(g);
  const before=JSON.stringify(g);
  g=g.map(slide);
  const after=JSON.stringify(g);
  for(let i=0;i<(4-rot)%4;i++) g=rotate(g);
  if(before!==after){
    grid=g; addTile(); render();
    document.getElementById('score').textContent=score;
    if(score>best){best=score;localStorage.setItem('g2048Best',best);document.getElementById('best').textContent=best;}
    checkEnd();
  }
}
function checkEnd(){
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){
    if(grid[r][c]===2048){ showMsg('بردی! 🎉'); return; }
    if(!grid[r][c]) return;
    if(c<SIZE-1 && grid[r][c]===grid[r][c+1]) return;
    if(r<SIZE-1 && grid[r][c]===grid[r+1][c]) return;
  }
  showMsg('باختی! تمام خونه‌ها پر شد 💀');
}
function showMsg(t){
  document.getElementById('msgText').textContent=t;
  document.getElementById('msg').classList.add('show');
}
window.addEventListener('keydown',e=>{
  const map={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'};
  if(map[e.key]){ e.preventDefault(); move(map[e.key]); }
});
let sx=0,sy=0;
board.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;});
board.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-sx, dy=e.changedTouches[0].clientY-sy;
  if(Math.max(Math.abs(dx),Math.abs(dy))<30) return;
  if(Math.abs(dx)>Math.abs(dy)) move(dx>0?'right':'left'); else move(dy>0?'down':'up');
});
document.getElementById('newGame').addEventListener('click',newGame);
document.getElementById('again').addEventListener('click',newGame);
newGame();
</script>
</body>
</html>`;
