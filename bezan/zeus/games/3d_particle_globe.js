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
<title>کهکشان تعاملی سه‌بعدی</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#000;overflow:hidden;font-family:'Segoe UI',Tahoma,sans-serif;color:#fff}
  #info{position:fixed;top:20px;right:24px;z-index:5;text-align:right;text-shadow:0 0 10px #000}
  #info h1{font-size:24px;background:linear-gradient(90deg,#7f5af0,#2cb67d);-webkit-background-clip:text;background-clip:text;color:transparent}
  #info p{opacity:.75;font-size:13px;margin-top:4px}
  #ctrls{position:fixed;bottom:20px;right:24px;z-index:5;display:flex;gap:10px}
  #ctrls button{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.25);color:#fff;
    padding:8px 16px;border-radius:24px;cursor:pointer;font-size:13px;backdrop-filter:blur(6px);transition:.2s}
  #ctrls button:hover{background:rgba(127,90,240,.4)}
  canvas{display:block}
  #loading{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#000;z-index:10;font-size:14px;opacity:.6}
</style>
</head>
<body>
<div id="loading">در حال ساخت کهکشان...</div>
<div id="info"><h1>🌌 کهکشان ذرات</h1><p>با موس بچرخون، اسکرول کن زوم بشه</p></div>
<div id="ctrls">
  <button id="colorBtn">تغییر رنگ</button>
  <button id="speedBtn">سرعت چرخش</button>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,0.1,2000);
camera.position.z=650;
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
document.body.appendChild(renderer.domElement);
document.getElementById('loading').remove();

const palettes=[[0x7f5af0,0x2cb67d],[0xff2e63,0xffd23f],[0x00c9ff,0x92fe9d],[0xff6ec7,0x6ec3ff]];
let paletteIdx=0;

const COUNT=6000, R=260;
const geo=new THREE.BufferGeometry();
const positions=new Float32Array(COUNT*3);
const colors=new Float32Array(COUNT*3);
const c1=new THREE.Color(palettes[0][0]), c2=new THREE.Color(palettes[0][1]);
for(let i=0;i<COUNT;i++){
  const theta=Math.random()*Math.PI*2, phi=Math.acos(2*Math.random()-1);
  const rad=R*(0.6+Math.random()*0.6);
  positions[i*3]=rad*Math.sin(phi)*Math.cos(theta);
  positions[i*3+1]=rad*Math.sin(phi)*Math.sin(theta);
  positions[i*3+2]=rad*Math.cos(phi);
  const mix=Math.random();
  const col=c1.clone().lerp(c2,mix);
  colors[i*3]=col.r; colors[i*3+1]=col.g; colors[i*3+2]=col.b;
}
geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
const mat=new THREE.PointsMaterial({size:2.6,vertexColors:true,transparent:true,opacity:0.9,depthWrite:false,blending:THREE.AdditiveBlending});
const points=new THREE.Points(geo,mat);
scene.add(points);

const coreGeo=new THREE.IcosahedronGeometry(50,2);
const coreMat=new THREE.MeshBasicMaterial({color:palettes[0][0],wireframe:true,transparent:true,opacity:0.5});
const core=new THREE.Mesh(coreGeo,coreMat);
scene.add(core);

let rotSpeed=0.0015;
let mouseX=0,mouseY=0,targetX=0,targetY=0;
window.addEventListener('mousemove',e=>{
  mouseX=(e.clientX/innerWidth-0.5)*2;
  mouseY=(e.clientY/innerHeight-0.5)*2;
});
window.addEventListener('wheel',e=>{
  camera.position.z=Math.max(250,Math.min(1200,camera.position.z+e.deltaY*0.4));
});
window.addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
document.getElementById('speedBtn').addEventListener('click',()=>{
  rotSpeed = rotSpeed>0.004 ? 0.0015 : rotSpeed+0.0018;
});
document.getElementById('colorBtn').addEventListener('click',()=>{
  paletteIdx=(paletteIdx+1)%palettes.length;
  const [a,b]=palettes[paletteIdx];
  const nc1=new THREE.Color(a), nc2=new THREE.Color(b);
  const colAttr=geo.getAttribute('color');
  for(let i=0;i<COUNT;i++){
    const mix=Math.random();
    const col=nc1.clone().lerp(nc2,mix);
    colAttr.setXYZ(i,col.r,col.g,col.b);
  }
  colAttr.needsUpdate=true;
  coreMat.color.set(a);
});

function animate(){
  requestAnimationFrame(animate);
  targetX += (mouseX-targetX)*0.03;
  targetY += (mouseY-targetY)*0.03;
  points.rotation.y += rotSpeed + targetX*0.002;
  points.rotation.x += targetY*0.001;
  core.rotation.y -= rotSpeed*1.4;
  core.rotation.x += rotSpeed*0.8;
  renderer.render(scene,camera);
}
animate();
</script>
</body>
</html>`;
