export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>داشبورد هوشمند انتخاب Cloudflare PoP و دیتاسنترها</title>
    <style>
        :root {
            --bg-grad: linear-gradient(135deg, #1c1917 0%, #292524 50%, #0c0a09 100%);
            --card-bg: linear-gradient(145deg, #2a2421, #1e1916);
            --gold-primary: #d4af37;
            --gold-light: #f3e5ab;
            --text-color: #f5f5f4;
            --shadow-3d: 8px 8px 16px #0c0a09, -8px -8px 16px #3a322d;
            --shadow-inset: inset 4px 4px 8px #0c0a09, inset -4px -4px 8px #3a322d;
            --accent-green: #2ecc71;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Tahoma', 'Segoe UI', sans-serif;
            user-select: none;
        }

        body {
            background: var(--bg-grad);
            color: var(--text-color);
            min-height: 100vh;
            padding: 25px 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .container {
            width: 100%;
            max-width: 1200px;
        }

        /* Header */
        .panel-header {
            background: var(--card-bg);
            padding: 20px;
            border-radius: 20px;
            box-shadow: var(--shadow-3d);
            border: 1px solid rgba(212, 175, 55, 0.25);
            text-align: center;
            margin-bottom: 25px;
        }

        .panel-header h1 {
            color: var(--gold-primary);
            font-size: 1.6rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.9);
        }

        /* Collapsible Country Section */
        .accordion-box {
            background: var(--card-bg);
            border-radius: 20px;
            box-shadow: var(--shadow-3d);
            margin-bottom: 25px;
            border: 1px solid rgba(212, 175, 55, 0.2);
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .accordion-header {
            padding: 18px 25px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(145deg, #322b27, #241e1b);
            color: var(--gold-primary);
            font-weight: bold;
            font-size: 1.1rem;
        }

        .accordion-header:hover {
            background: #3a322d;
        }

        .accordion-icon {
            transition: transform 0.3s ease;
            font-size: 1.2rem;
        }

        .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s cubic-bezier(0, 1, 0, 1);
            padding: 0 20px;
        }

        .accordion-box.open .accordion-content {
            max-height: 1000px;
            transition: max-height 0.4s ease-in-out;
            padding: 20px;
        }

        .accordion-box.open .accordion-icon {
            transform: rotate(180deg);
        }

        .search-input {
            width: 100%;
            padding: 12px 18px;
            border-radius: 12px;
            border: none;
            background: #141211;
            color: var(--gold-light);
            box-shadow: var(--shadow-inset);
            font-size: 0.95rem;
            outline: none;
            margin-bottom: 15px;
            direction: rtl;
        }

        .country-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
            gap: 10px;
            max-height: 280px;
            overflow-y: auto;
            padding-left: 5px;
        }

        ::-webkit-scrollbar {
            width: 7px;
        }
        ::-webkit-scrollbar-track {
            background: #141211;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background: var(--gold-primary);
            border-radius: 10px;
        }

        .country-card {
            background: var(--card-bg);
            padding: 10px 14px;
            border-radius: 10px;
            box-shadow: var(--shadow-3d);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.88rem;
            transition: all 0.2s ease;
            border: 1px solid transparent;
            direction: ltr;
        }

        .country-card:hover {
            border-color: var(--gold-primary);
        }

        .country-card.active {
            box-shadow: var(--shadow-inset);
            border-color: var(--gold-primary);
            background: #1a1513;
            color: var(--gold-primary);
            font-weight: bold;
        }

        /* Dynamic Datacenter Panels */
        .dc-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            width: 100%;
            align-items: start;
        }

        .dc-card {
            background: var(--card-bg);
            border-radius: 20px;
            box-shadow: var(--shadow-3d);
            padding: 20px;
            border: 1px solid rgba(212, 175, 55, 0.2);
            transition: all 0.3s ease;
        }

        .dc-title {
            color: var(--gold-primary);
            font-size: 1.15rem;
            text-align: center;
            padding-bottom: 10px;
            margin-bottom: 15px;
            border-bottom: 2px solid rgba(212, 175, 55, 0.25);
        }

        .region-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            direction: ltr;
        }

        .empty-state {
            text-align: center;
            color: #8c7b70;
            font-size: 0.9rem;
            padding: 30px 10px;
            direction: rtl;
        }

        .region-item {
            background: #1c1715;
            padding: 10px 14px;
            border-radius: 10px;
            box-shadow: var(--shadow-3d);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: monospace;
            font-size: 0.9rem;
            border: 1px solid rgba(255,255,255,0.03);
        }

        .region-tag {
            font-size: 0.72rem;
            padding: 3px 8px;
            border-radius: 6px;
            font-family: 'Tahoma', sans-serif;
            font-weight: bold;
            background: rgba(46, 204, 113, 0.15);
            color: var(--accent-green);
            border: 1px solid var(--accent-green);
        }

        .copy-btn {
            background: var(--card-bg);
            border: none;
            color: var(--gold-light);
            padding: 5px 10px;
            border-radius: 6px;
            box-shadow: var(--shadow-3d);
            cursor: pointer;
            font-size: 0.78rem;
        }

        .copy-btn:active {
            box-shadow: var(--shadow-inset);
            color: var(--gold-primary);
        }

        /* Toast Notifications */
        #toast-container {
            position: fixed;
            bottom: 25px;
            right: 25px;
            z-index: 1000;
        }

        .toast {
            background: var(--card-bg);
            color: var(--gold-primary);
            padding: 12px 20px;
            border-radius: 12px;
            box-shadow: 8px 8px 16px #000;
            border: 1px solid var(--gold-primary);
            margin-top: 10px;
            font-size: 0.9rem;
            font-weight: bold;
            animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
            direction: rtl;
        }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; transform: translateY(10px); }
        }
    </style>
</head>
<body>

<div class="container">
    <div class="panel-header">
        <h1>⚜️ مرکز مدیریت هوشمند دیتاسنترها و Cloudflare PoP ⚜️</h1>
    </div>

    <!-- Accordion Country Selector -->
    <div class="accordion-box" id="countryAccordion">
        <div class="accordion-header" onclick="toggleAccordion()">
            <span id="accordionTitle">🌍 انتخاب کشور (روی این کادر کلیک کنید)</span>
            <span class="accordion-icon">▼</span>
        </div>
        <div class="accordion-content">
            <input type="text" id="searchCountry" class="search-input" placeholder="🔍 جستجوی کشور..." oninput="filterCountries()">
            <div class="country-grid" id="countryGrid"></div>
        </div>
    </div>

    <!-- Dynamic Height Datacenters Grid -->
    <div class="dc-grid">
        <div class="dc-card">
            <div class="dc-title">Amazon Web Services (AWS)</div>
            <div class="region-list" id="awsList">
                <div class="empty-state">لطفاً ابتدا یک کشور را انتخاب کنید.</div>
            </div>
        </div>

        <div class="dc-card">
            <div class="dc-title">Google Cloud Platform (GCP)</div>
            <div class="region-list" id="gcpList">
                <div class="empty-state">لطفاً ابتدا یک کشور را انتخاب کنید.</div>
            </div>
        </div>

        <div class="dc-card">
            <div class="dc-title">Microsoft Azure</div>
            <div class="region-list" id="azureList">
                <div class="empty-state">لطفاً ابتدا یک کشور را انتخاب کنید.</div>
            </div>
        </div>
    </div>
</div>

<div id="toast-container"></div>

<script>
    const allCountries = [
        { code: 'AF', flag: '🇦🇫', nameEn: 'Afghanistan', nameFa: 'افغانستان', prefixes: [] },
        { code: 'AL', flag: '🇦🇱', nameEn: 'Albania', nameFa: 'آلبانی', prefixes: [] },
        { code: 'DZ', flag: '🇩🇿', nameEn: 'Algeria', nameFa: 'الجزایر', prefixes: [] },
        { code: 'AD', flag: '🇦🇩', nameEn: 'Andorra', nameFa: 'آندورا', prefixes: [] },
        { code: 'AO', flag: '🇦🇴', nameEn: 'Angola', nameFa: 'آنگولا', prefixes: [] },
        { code: 'AR', flag: '🇦🇷', nameEn: 'Argentina', nameFa: 'آرژانتین', prefixes: ['sa-east', 'southamerica'] },
        { code: 'AM', flag: '🇦🇲', nameEn: 'Armenia', nameFa: 'ارمنستان', prefixes: [] },
        { code: 'AU', flag: '🇦🇺', nameEn: 'Australia', nameFa: 'استرالیا', prefixes: ['ap-southeast-2', 'australia'] },
        { code: 'AT', flag: '🇦🇹', nameEn: 'Austria', nameFa: 'اتریش', prefixes: ['austria', 'eu-central'] },
        { code: 'AZ', flag: '🇦🇿', nameEn: 'Azerbaijan', nameFa: 'آذربایجان', prefixes: [] },
        { code: 'BHR', flag: '🇧🇭', nameEn: 'Bahrain', nameFa: 'بحرین', prefixes: ['me-south-1'] },
        { code: 'BD', flag: '🇧🇩', nameEn: 'Bangladesh', nameFa: 'بنگلادش', prefixes: [] },
        { code: 'BY', flag: '🇧🇾', nameEn: 'Belarus', nameFa: 'بلاروس', prefixes: [] },
        { code: 'BE', flag: '🇧🇪', nameEn: 'Belgium', nameFa: 'بلژیک', prefixes: ['belgium'] },
        { code: 'BR', flag: '🇧🇷', nameEn: 'Brazil', nameFa: 'برزیل', prefixes: ['sa-east-1', 'southamerica-east1', 'brazil'] },
        { code: 'BG', flag: '🇧🇬', nameEn: 'Bulgaria', nameFa: 'بلغارستان', prefixes: [] },
        { code: 'CA', flag: '🇨🇦', nameEn: 'Canada', nameFa: 'کانادا', prefixes: ['ca-central', 'northamerica-northeast', 'canada'] },
        { code: 'CL', flag: '🇨🇱', nameEn: 'Chile', nameFa: 'شیلی', prefixes: ['southamerica-west1', 'chile'] },
        { code: 'CN', flag: '🇨🇳', nameEn: 'China', nameFa: 'چین', prefixes: ['cn-north', 'eastasia'] },
        { code: 'CO', flag: '🇨🇴', nameEn: 'Colombia', nameFa: 'کلمبیا', prefixes: [] },
        { code: 'HR', flag: '🇭🇷', nameEn: 'Croatia', nameFa: 'کرواسی', prefixes: [] },
        { code: 'CY', flag: '🇨🇾', nameEn: 'Cyprus', nameFa: 'قبرس', prefixes: [] },
        { code: 'CZ', flag: '🇨🇿', nameEn: 'Czechia', nameFa: 'جمهوری چک', prefixes: [] },
        { code: 'DK', flag: '🇩🇰', nameEn: 'Denmark', nameFa: 'دانمارک', prefixes: ['europe-north'] },
        { code: 'EGY', flag: '🇪🇬', nameEn: 'Egypt', nameFa: 'مصر', prefixes: [] },
        { code: 'FI', flag: '🇫🇮', nameEn: 'Finland', nameFa: 'فنلاند', prefixes: ['europe-north1'] },
        { code: 'FR', flag: '🇫🇷', nameEn: 'France', nameFa: 'فرانسه', prefixes: ['eu-west-3', 'europe-west9', 'france'] },
        { code: 'DE', flag: '🇩🇪', nameEn: 'Germany', nameFa: 'آلمان', prefixes: ['eu-central', 'europe-west3', 'germany'] },
        { code: 'GR', flag: '🇬🇷', nameEn: 'Greece', nameFa: 'یونان', prefixes: [] },
        { code: 'HK', flag: '🇭🇰', nameEn: 'Hong Kong', nameFa: 'هنگ کنگ', prefixes: ['ap-east-1', 'eastasia'] },
        { code: 'HU', flag: '🇭🇺', nameEn: 'Hungary', nameFa: 'مجارستان', prefixes: [] },
        { code: 'IS', flag: '🇮🇸', nameEn: 'Iceland', nameFa: 'ایسلند', prefixes: [] },
        { code: 'IN', flag: '🇮🇳', nameEn: 'India', nameFa: 'هند', prefixes: ['ap-south', 'asia-south', 'india'] },
        { code: 'ID', flag: '🇮🇩', nameEn: 'Indonesia', nameFa: 'اندونزی', prefixes: ['ap-southeast-3', 'asia-southeast2', 'indonesia'] },
        { code: 'IR', flag: '🇮🇷', nameEn: 'Iran', nameFa: 'ایران', prefixes: [] },
        { code: 'IQ', flag: '🇮🇶', nameEn: 'Iraq', nameFa: 'عراق', prefixes: [] },
        { code: 'IE', flag: '🇮🇪', nameEn: 'Ireland', nameFa: 'ایرلند', prefixes: ['eu-west-1', 'europe-west1'] },
        { code: 'IL', flag: '🇮🇱', nameEn: 'Israel', nameFa: 'اسرائیل', prefixes: ['il-central-1', 'me-west1', 'israel'] },
        { code: 'IT', flag: '🇮🇹', nameEn: 'Italy', nameFa: 'ایتالیا', prefixes: ['eu-south-1', 'europe-west8', 'italy'] },
        { code: 'JP', flag: '🇯🇵', nameEn: 'Japan', nameFa: 'ژاپن', prefixes: ['ap-northeast-1', 'asia-northeast1', 'japan'] },
        { code: 'JO', flag: '🇯🇴', nameEn: 'Jordan', nameFa: 'اردن', prefixes: [] },
        { code: 'KZ', flag: '🇰🇿', nameEn: 'Kazakhstan', nameFa: 'قزاقستان', prefixes: [] },
        { code: 'KE', flag: '🇰🇪', nameEn: 'Kenya', nameFa: 'کنیا', prefixes: [] },
        { code: 'KR', flag: '🇰🇷', nameEn: 'Korea (South)', nameFa: 'کره جنوبی', prefixes: ['ap-northeast-2', 'asia-northeast3', 'korea'] },
        { code: 'KW', flag: '🇰🇼', nameEn: 'Kuwait', nameFa: 'کویت', prefixes: [] },
        { code: 'MY', flag: '🇲🇾', nameEn: 'Malaysia', nameFa: 'مالزی', prefixes: ['ap-southeast-5', 'malaysia'] },
        { code: 'MX', flag: '🇲🇽', nameEn: 'Mexico', nameFa: 'مکزیک', prefixes: ['mx-central-1', 'mexico'] },
        { code: 'NL', flag: '🇳🇱', nameEn: 'Netherlands', nameFa: 'هلند', prefixes: ['europe-west4', 'westeurope'] },
        { code: 'NZ', flag: '🇳🇿', nameEn: 'New Zealand', nameFa: 'نیوزیلند', prefixes: ['newzealand'] },
        { code: 'NO', flag: '🇳🇴', nameEn: 'Norway', nameFa: 'نروژ', prefixes: ['norway'] },
        { code: 'OM', flag: '🇴🇲', nameEn: 'Oman', nameFa: 'عمان', prefixes: [] },
        { code: 'PK', flag: '🇵🇰', nameEn: 'Pakistan', nameFa: 'پاکستان', prefixes: [] },
        { code: 'PH', flag: '🇵🇭', nameEn: 'Philippines', nameFa: 'فیلیپین', prefixes: [] },
        { code: 'PL', flag: '🇵🇱', nameEn: 'Poland', nameFa: 'لهستان', prefixes: ['europe-central2', 'poland'] },
        { code: 'PT', flag: '🇵🇹', nameEn: 'Portugal', nameFa: 'پرتغال', prefixes: [] },
        { code: 'QA', flag: '🇶🇦', nameEn: 'Qatar', nameFa: 'قطر', prefixes: ['me-central2', 'qatar'] },
        { code: 'RO', flag: '🇷🇴', nameEn: 'Romania', nameFa: 'رومانی', prefixes: [] },
        { code: 'RU', flag: '🇷🇺', nameEn: 'Russia', nameFa: 'روسیه', prefixes: [] },
        { code: 'SA', flag: '🇸🇦', nameEn: 'Saudi Arabia', nameFa: 'عربستان', prefixes: ['me-central-1'] },
        { code: 'SG', flag: '🇸🇬', nameEn: 'Singapore', nameFa: 'سنگاپور', prefixes: ['ap-southeast-1', 'asia-southeast1', 'southeastasia'] },
        { code: 'ZA', flag: '🇿🇦', nameEn: 'South Africa', nameFa: 'آفریقای جنوبی', prefixes: ['af-south-1', 'africa-south1', 'southafrica'] },
        { code: 'ES', flag: '🇪🇸', nameEn: 'Spain', nameFa: 'اسپانیا', prefixes: ['eu-south-2', 'europe-southwest1'] },
        { code: 'SE', flag: '🇸🇪', nameEn: 'Sweden', nameFa: 'سوئد', prefixes: ['eu-north-1'] },
        { code: 'CH', flag: '🇨🇭', nameEn: 'Switzerland', nameFa: 'سوئیس', prefixes: ['europe-west6'] },
        { code: 'TW', flag: '🇹🇼', nameEn: 'Taiwan', nameFa: 'تایوان', prefixes: ['asia-east1'] },
        { code: 'TH', flag: '🇹🇭', nameEn: 'Thailand', nameFa: 'تایلند', prefixes: ['ap-southeast-7'] },
        { code: 'TR', flag: '🇹🇷', nameEn: 'Turkey', nameFa: 'ترکیه', prefixes: [] },
        { code: 'UA', flag: '🇺🇦', nameEn: 'Ukraine', nameFa: 'اوکراین', prefixes: [] },
        { code: 'AE', flag: '🇦🇪', nameEn: 'United Arab Emirates', nameFa: 'امارات', prefixes: ['me-central-1', 'me-central2'] },
        { code: 'GB', flag: '🇬🇧', nameEn: 'United Kingdom', nameFa: 'بریتانیا', prefixes: ['eu-west-2', 'europe-west2', 'uk'] },
        { code: 'US', flag: '🇺🇸', nameEn: 'United States', nameFa: 'آمریکا', prefixes: ['us-', 'northamerica'] },
        { code: 'VN', flag: '🇻🇳', nameEn: 'Vietnam', nameFa: 'ویتنام', prefixes: [] }
    ];

    const awsRegions = [
        "af-south-1", "ap-east-1", "ap-east-2", "ap-northeast-1", "ap-northeast-2", "ap-northeast-3", 
        "ap-south-1", "ap-south-2", "ap-southeast-1", "ap-southeast-2", "ap-southeast-3", "ap-southeast-4", 
        "ap-southeast-5", "ap-southeast-6", "ap-southeast-7", "ca-central-1", "ca-west-1", "eu-central-1", 
        "eu-central-2", "eu-north-1", "eu-south-1", "eu-south-2", "eu-west-1", "eu-west-2", "eu-west-3", 
        "il-central-1", "me-central-1", "me-south-1", "mx-central-1", "sa-east-1", "us-east-1", "us-east-2", 
        "us-west-1", "us-west-2"
    ];

    const gcpRegions = [
        "africa-south1", "asia-east1", "asia-east2", "asia-northeast1", "asia-northeast2", "asia-northeast3", 
        "asia-south1", "asia-south2", "asia-southeast1", "asia-southeast2", "australia-southeast1", 
        "australia-southeast2", "europe-central2", "europe-north1", "europe-north2", "europe-southwest1", 
        "europe-west1", "europe-west10", "europe-west12", "europe-west2", "europe-west3", "europe-west4", 
        "europe-west6", "europe-west8", "europe-west9", "me-central1", "me-central2", "me-west1", 
        "northamerica-northeast1", "northamerica-northeast2", "northamerica-south1", "southamerica-east1", 
        "southamerica-west1", "us-central1", "us-east1", "us-east4", "us-east5", "us-south1", "us-west1", 
        "us-west2", "us-west3", "us-west4"
    ];

    const azureRegions = [
        "australiacentral", "australiacentral2", "australiaeast", "australiasoutheast", "austriaeast", 
        "belgiumcentral", "brazilsouth", "brazilsoutheast", "canadacentral", "canadaeast", "centralindia", 
        "centralus", "chilecentral", "eastasia", "eastus", "eastus2", "francecentral", "francesouth", 
        "germanynorth", "germanywestcentral", "indonesiacentral", "israelcentral", "italynorth", 
        "japaneast", "japanwest", "koreacentral", "koreasouth", "malaysiawest", "mexicocentral", 
        "newzealandnorth", "northcentralus", "northeurope", "norwayeast", "norwaywest", "polandcentral", 
        "qatarcentral", "southafricanorth", "southafricawest", "southcentralus", "southeastasia", 
        "uksouth", "ukwest", "westcentralus", "westeurope", "westindia", "westus", "westus2", "westus3"
    ];

    let selectedCountry = null;

    function init() {
        renderCountries(allCountries);
    }

    function toggleAccordion() {
        document.getElementById('countryAccordion').classList.toggle('open');
    }

    function renderCountries(list) {
        const grid = document.getElementById('countryGrid');
        grid.innerHTML = '';
        list.forEach(c => {
            const el = document.createElement('div');
            el.className = \`country-card \${selectedCountry?.code === c.code ? 'active' : ''}\`;
            el.innerHTML = \`<span>\${c.flag} | \${c.nameEn}</span><span>\${c.nameFa}</span>\`;
            el.onclick = () => selectCountry(c);
            grid.appendChild(el);
        });
    }

    function filterCountries() {
        const val = document.getElementById('searchCountry').value.toLowerCase();
        const filtered = allCountries.filter(c => 
            c.nameEn.toLowerCase().includes(val) || 
            c.nameFa.includes(val) || 
            c.code.toLowerCase().includes(val)
        );
        renderCountries(filtered);
    }

    function selectCountry(country) {
        selectedCountry = country;
        document.getElementById('accordionTitle').innerText = \`\${country.flag} کشور انتخاب شده: \${country.nameFa} (\${country.nameEn})\`;
        document.getElementById('countryAccordion').classList.remove('open');
        showToast(\`کشور \${country.nameFa} انتخاب شد.\`);
        renderCountries(allCountries);
        renderDatacenters();
    }

    function renderDatacenters() {
        if(!selectedCountry) return;

        renderList('awsList', awsRegions);
        renderList('gcpList', gcpRegions);
        renderList('azureList', azureRegions);
    }

    function renderList(elementId, regions) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';

        const matches = regions.filter(r => 
            selectedCountry.prefixes.some(pref => r.toLowerCase().includes(pref))
        );

        if (matches.length === 0) {
            container.innerHTML = \`<div class="empty-state">ریجن مستقیمی برای این کشور پیدا نشد.</div>\`;
            return;
        }

        matches.forEach(regionName => {
            const div = document.createElement('div');
            div.className = 'region-item';
            div.innerHTML = \`
                <div><strong>\${regionName}</strong></div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <span class="region-tag">⚡ پیشنهاد شده</span>
                    <button class="copy-btn" onclick="copyToClipboard('\${regionName}')">کپی</button>
                </div>
            \`;
            container.appendChild(div);
        });
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(\`کد \${text} کپی شد!\`);
        });
    }

    function showToast(msg) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = \`<span>✨</span> <span>\${msg}</span>\`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    init();
</script>

</body>
</html>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
};
