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
<title>منظومه شمسی تعاملی</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#000;overflow:hidden;font-family:'Segoe UI',Tahoma,sans-serif;color:#fff}
  #info{position:fixed;top:20px;right:24px;z-index:5;text-align:right;text-shadow:0 0 10px #000}
  #info h1{font-size:22px;color:#ffd23f}
  #info p{opacity:.65;font-size:12.5px;margin-top:4px}
  #panel{position:fixed;bottom:20px;left:24px;right:24px;z-index:5;display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
  #panel button{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.25);color:#fff;
    padding:7px 14px;border-radius:20px;cursor:pointer;font-size:12.5px;backdrop-filter:blur(6px)}
  #panel button:hover{background:rgba(255,210,63,.3)}
  #loading{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#000;z-index:10;opacity:.6;font-size:14px}
</style>
</head>
<body>
<div id="loading">در حال ساخت منظومه...</div>
<div id="info"><h1>🪐 منظومه شمسی</h1><p>موس: چرخش | اسکرول: زوم | روی سیاره کلیک کن</p></div>
<div id="panel"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,0.1,3000);
camera.position.set(0,260,520);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
document.body.appendChild(renderer.domElement);
document.getElementById('loading').remove();

scene.add(new THREE.AmbientLight(0x333355));
const sunLight=new THREE.PointLight(0xffffff,2.2,2000);
scene.add(sunLight);

function starField(){
  const geo=new THREE.BufferGeometry();
  const n=3000, pos=new Float32Array(n*3);
  for(let i=0;i<n;i++){
    pos[i*3]=(Math.random()-0.5)*3000; pos[i*3+1]=(Math.random()-0.5)*3000; pos[i*3+2]=(Math.random()-0.5)*3000;
  }
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const mat=new THREE.PointsMaterial({color:0xffffff,size:1.4,transparent:true,opacity:0.8});
  scene.add(new THREE.Points(geo,mat));
}
starField();

const sunGeo=new THREE.SphereGeometry(28,32,32);
const sunMat=new THREE.MeshBasicMaterial({color:0xffcc33});
const sun=new THREE.Mesh(sunGeo,sunMat);
scene.add(sun);
const glowGeo=new THREE.SphereGeometry(34,32,32);
const glowMat=new THREE.MeshBasicMaterial({color:0xffaa00,transparent:true,opacity:0.25});
sun.add(new THREE.Mesh(glowGeo,glowMat));

const planetData=[
  {name:'عطارد',color:0xaaaaaa,size:3.2,dist:50,speed:0.012,info:'نزدیک‌ترین سیاره به خورشید'},
  {name:'زهره',color:0xe8c27e,size:5.5,dist:72,speed:0.009,info:'داغ‌ترین سیاره منظومه'},
  {name:'زمین',color:0x3fa7ff,size:6,dist:100,speed:0.0075,info:'خانه‌ی ما 🌍'},
  {name:'مریخ',color:0xff5533,size:4.2,dist:130,speed:0.006,info:'سیاره‌ی سرخ'},
  {name:'مشتری',color:0xd9b382,size:15,dist:190,speed:0.0032,info:'بزرگترین سیاره منظومه'},
  {name:'زحل',color:0xeccf9c,size:13,dist:250,speed:0.0024,info:'مشهور به حلقه‌هایش'},
  {name:'اورانوس',color:0x8fd9e8,size:9,dist:300,speed:0.0017,info:'چرخش محوری عجیب'},
  {name:'نپتون',color:0x3f6fe0,size:8.6,dist:345,speed:0.0013,info:'دورترین سیاره شناخته‌شده'},
];
const planets=[];
const panel=document.getElementById('panel');
planetData.forEach(p=>{
  const orbitGeo=new THREE.RingGeometry(p.dist-0.3,p.dist+0.3,80);
  const orbitMat=new THREE.MeshBasicMaterial({color:0x444466,side:THREE.DoubleSide,transparent:true,opacity:0.35});
  const orbit=new THREE.Mesh(orbitGeo,orbitMat);
  orbit.rotation.x=Math.PI/2;
  scene.add(orbit);

  const geo=new THREE.SphereGeometry(p.size,24,24);
  const mat=new THREE.MeshStandardMaterial({color:p.color,roughness:0.7});
  const mesh=new THREE.Mesh(geo,mat);
  const pivot=new THREE.Object3D();
  pivot.add(mesh);
  mesh.position.x=p.dist;
  scene.add(pivot);
  const angle=Math.random()*Math.PI*2;
  pivot.rotation.y=angle;
  planets.push({mesh,pivot,...p});

  if(p.name==='زحل'){
    const ringGeo=new THREE.RingGeometry(p.size+3,p.size+9,48);
    const ringMat=new THREE.MeshBasicMaterial({color:0xd8c48a,side:THREE.DoubleSide,transparent:true,opacity:0.7});
    const ring=new THREE.Mesh(ringGeo,ringMat);
    ring.rotation.x=Math.PI/2.4;
    mesh.add(ring);
  }

  const btn=document.createElement('button');
  btn.textContent=p.name;
  btn.addEventListener('click',()=>focusPlanet(mesh,p));
  panel.appendChild(btn);
});

let infoBox=document.getElementById('info');
function focusPlanet(mesh,p){
  infoBox.innerHTML='<h1>'+p.name+'</h1><p>'+p.info+'</p>';
  const worldPos=new THREE.Vector3(); mesh.getWorldPosition(worldPos);
  targetCamPos.copy(worldPos).add(new THREE.Vector3(0,p.size*2.5+8,p.size*5+18));
  targetLook.copy(worldPos);
  animTarget=true;
}
const targetCamPos=new THREE.Vector3(); const targetLook=new THREE.Vector3();
let animTarget=false;

let dragging=false, lastX=0, lastY=0, rotX=0.35, rotY=0, dist=520;
renderer.domElement.addEventListener('mousedown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;animTarget=false;});
window.addEventListener('mouseup',()=>dragging=false);
window.addEventListener('mousemove',e=>{
  if(!dragging) return;
  rotY += (e.clientX-lastX)*0.005;
  rotX = Math.max(-1.2,Math.min(1.2,rotX+(e.clientY-lastY)*0.005));
  lastX=e.clientX; lastY=e.clientY;
});
renderer.domElement.addEventListener('wheel',e=>{ dist=Math.max(80,Math.min(1400,dist+e.deltaY*0.4)); animTarget=false; });
window.addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});

function animate(){
  requestAnimationFrame(animate);
  planets.forEach(p=>{ p.pivot.rotation.y += p.speed; p.mesh.rotation.y += 0.01; });
  sun.rotation.y += 0.001;

  if(animTarget){
    camera.position.lerp(targetCamPos,0.04);
    camera.lookAt(targetLook);
  } else {
    camera.position.x = Math.sin(rotY)*Math.cos(rotX)*dist;
    camera.position.z = Math.cos(rotY)*Math.cos(rotX)*dist;
    camera.position.y = Math.sin(rotX)*dist*0.6+100;
    camera.lookAt(0,0,0);
  }
  renderer.render(scene,camera);
}
animate();
</script>
</body>
</html>`;
