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
<title>استودیو نُوا | طراحی خلاقانه</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Tahoma,sans-serif}
  body{background:#07070d;color:#fff;overflow-x:hidden}
  .blob{position:fixed;border-radius:50%;filter:blur(90px);opacity:.45;z-index:0;pointer-events:none;transition:transform .2s ease-out}
  .b1{width:400px;height:400px;background:#7f5af0;top:-100px;right:-100px}
  .b2{width:380px;height:380px;background:#2cb67d;bottom:10%;left:-120px}
  .b3{width:300px;height:300px;background:#ff5e7e;top:50%;right:20%}
  nav{position:fixed;top:0;left:0;right:0;z-index:10;display:flex;justify-content:space-between;align-items:center;
    padding:22px 6vw;backdrop-filter:blur(10px);background:rgba(7,7,13,.5)}
  nav .logo{font-weight:bold;font-size:20px;letter-spacing:1px}
  nav .logo span{color:#7f5af0}
  nav a{color:#fff;text-decoration:none;margin-right:26px;font-size:14px;opacity:.8}
  section{position:relative;z-index:2;padding:140px 8vw 100px;max-width:1200px;margin:0 auto}
  .hero{min-height:90vh;display:flex;flex-direction:column;justify-content:center;padding-top:60px}
  .hero h1{font-size:clamp(34px,6vw,64px);line-height:1.2}
  .hero h1 em{font-style:normal;background:linear-gradient(90deg,#7f5af0,#2cb67d);-webkit-background-clip:text;background-clip:text;color:transparent}
  .hero p{margin-top:20px;opacity:.65;max-width:520px;font-size:16px;line-height:1.8}
  .hero .cta{margin-top:34px;display:flex;gap:14px}
  .btn{padding:13px 28px;border-radius:30px;font-weight:bold;cursor:pointer;border:none;font-size:14.5px}
  .btn.primary{background:linear-gradient(135deg,#7f5af0,#2cb67d);color:#06131a}
  .btn.ghost{background:transparent;border:1px solid rgba(255,255,255,.3);color:#fff}
  .grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;margin-top:40px}
  .card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:28px;
    transition:.3s;backdrop-filter:blur(6px)}
  .card:hover{transform:translateY(-6px);border-color:rgba(127,90,240,.5);box-shadow:0 20px 40px rgba(127,90,240,.15)}
  .card .ic{font-size:30px;margin-bottom:14px}
  .card h3{font-size:18px;margin-bottom:8px}
  .card p{opacity:.6;font-size:13.5px;line-height:1.7}
  h2.section-title{font-size:30px;margin-bottom:8px}
  .section-title span{opacity:.5;font-size:14px;display:block;margin-top:6px;font-weight:normal}
  .stats{display:flex;flex-wrap:wrap;gap:40px;margin-top:50px}
  .stat b{font-size:34px;color:#7f5af0;display:block}
  .stat span{opacity:.6;font-size:13px}
  footer{position:relative;z-index:2;text-align:center;padding:50px 20px;opacity:.5;font-size:13px}
</style>
</head>
<body>
<div class="blob b1" id="blob1"></div>
<div class="blob b2" id="blob2"></div>
<div class="blob b3" id="blob3"></div>
<nav><div class="logo">استودیو<span>نُوا</span></div>
  <div><a href="#work">نمونه‌کارها</a><a href="#services">خدمات</a><a href="#about">درباره</a></div>
</nav>
<section class="hero">
  <h1>ما ایده‌ها رو به <em>تجربه‌های دیجیتال</em> تبدیل می‌کنیم</h1>
  <p>استودیو نُوا یه تیم طراحی و توسعه‌ست که برندها، اپلیکیشن‌ها و وب‌سایت‌هایی می‌سازه که هم زیبا هستن و هم کار می‌کنن.</p>
  <div class="cta"><button class="btn primary">شروع پروژه</button><button class="btn ghost">مشاهده نمونه‌کارها</button></div>
  <div class="stats">
    <div class="stat"><b>120+</b><span>پروژه موفق</span></div>
    <div class="stat"><b>45</b><span>مشتری فعال</span></div>
    <div class="stat"><b>8</b><span>سال تجربه</span></div>
  </div>
</section>
<section id="services">
  <h2 class="section-title">خدمات ما<span>هر چیزی که برای رشد دیجیتال نیاز داری</span></h2>
  <div class="grid3">
    <div class="card"><div class="ic">🎨</div><h3>طراحی رابط کاربری</h3><p>طراحی‌هایی که هم زیبا هستن و هم تجربه‌ی کاربری روان می‌سازن.</p></div>
    <div class="card"><div class="ic">⚡</div><h3>توسعه وب</h3><p>وب‌سایت‌های سریع، مقیاس‌پذیر و مدرن با جدیدترین تکنولوژی‌ها.</p></div>
    <div class="card"><div class="ic">📱</div><h3>اپلیکیشن موبایل</h3><p>اپ‌های نیتیو و کراس‌پلتفرم با عملکرد بالا.</p></div>
    <div class="card"><div class="ic">🚀</div><h3>برندسازی</h3><p>هویت بصری قوی که برند شما رو به یاد موندنی می‌کنه.</p></div>
    <div class="card"><div class="ic">📊</div><h3>بهینه‌سازی</h3><p>تحلیل داده و بهینه‌سازی برای نرخ تبدیل بهتر.</p></div>
    <div class="card"><div class="ic">🛠️</div><h3>پشتیبانی فنی</h3><p>پشتیبانی مستمر و به‌روزرسانی محصولات دیجیتال.</p></div>
  </div>
</section>
<section id="work">
  <h2 class="section-title">نمونه‌کارهای اخیر<span>بخشی از پروژه‌هایی که بهشون افتخار می‌کنیم</span></h2>
  <div class="grid3">
    <div class="card"><div class="ic">🛒</div><h3>فروشگاه آنلاین اطلس</h3><p>افزایش ۳۸٪ نرخ تبدیل با بازطراحی کامل تجربه خرید.</p></div>
    <div class="card"><div class="ic">🏦</div><h3>اپ بانکداری دیجیتال</h3><p>طراحی و توسعه اپلیکیشن بانکی با بیش از ۲۰۰ هزار کاربر.</p></div>
    <div class="card"><div class="ic">🎮</div><h3>پلتفرم گیمینگ پالس</h3><p>طراحی هویت بصری و وب‌سایت برای پلتفرم استریم بازی.</p></div>
  </div>
</section>
<footer>© استودیو نُوا — طراحی‌شده با ❤️ برای وب بهتر</footer>
<script>
document.addEventListener('mousemove',e=>{
  const x=(e.clientX/innerWidth-0.5), y=(e.clientY/innerHeight-0.5);
  document.getElementById('blob1').style.transform=\`translate(\${x*40}px,\${y*40}px)\`;
  document.getElementById('blob2').style.transform=\`translate(\${-x*30}px,\${-y*30}px)\`;
  document.getElementById('blob3').style.transform=\`translate(\${x*25}px,\${-y*25}px)\`;
});
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{ e.preventDefault(); document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'}); });
});
</script>
</body>
</html>`;
