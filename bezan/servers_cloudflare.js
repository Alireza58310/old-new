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
            --accent-blue: #3498db;
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
            gap: 12px;
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
            padding: 12px 14px;
            border-radius: 12px;
            box-shadow: var(--shadow-3d);
            display: flex;
            flex-direction: column;
            gap: 6px;
            border: 1px solid rgba(255,255,255,0.03);
        }

        .region-main-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: monospace;
            font-size: 0.92rem;
        }

        .region-subtext {
            font-size: 0.73rem;
            color: #a39285;
            direction: rtl;
            font-family: 'Tahoma', sans-serif;
        }

        .region-tag {
            font-size: 0.72rem;
            padding: 3px 8px;
            border-radius: 6px;
            font-family: 'Tahoma', sans-serif;
            font-weight: bold;
        }

        .tag-direct {
            background: rgba(46, 204, 113, 0.15);
            color: var(--accent-green);
            border: 1px solid var(--accent-green);
        }

        .tag-nearby {
            background: rgba(52, 152, 219, 0.15);
            color: var(--accent-blue);
            border: 1px solid var(--accent-blue);
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
    // Region Categories & Regional Fallbacks for All Countries
    const allCountries = [
        // Europe (Balkans & Eastern Europe Near Fallbacks)
        { code: 'AL', flag: '🇦🇱', nameEn: 'Albania', nameFa: 'آلبانی', direct: [], nearby: ['eu-south-1', 'italynorth', 'europe-west8', 'eu-central-1', 'europe-west3', 'germanywestcentral', 'europe-central2'] },
        { code: 'AM', flag: '🇦🇲', nameEn: 'Armenia', nameFa: 'ارمنستان', direct: [], nearby: ['me-central-1', 'me-central2', 'israelcentral', 'me-west1', 'europe-central2'] },
        { code: 'AT', flag: '🇦🇹', nameEn: 'Austria', nameFa: 'اتریش', direct: ['austriaeast'], nearby: ['eu-central-1', 'europe-west3', 'germanywestcentral', 'eu-south-1', 'italynorth'] },
        { code: 'AZ', flag: '🇦🇿', nameEn: 'Azerbaijan', nameFa: 'آذربایجان', direct: [], nearby: ['me-central-1', 'me-central2', 'europe-central2', 'israelcentral'] },
        { code: 'BY', flag: '🇧🇾', nameEn: 'Belarus', nameFa: 'بلاروس', direct: [], nearby: ['europe-central2', 'polandcentral', 'eu-north-1', 'europe-north1'] },
        { code: 'BE', flag: '🇧🇪', nameEn: 'Belgium', nameFa: 'بلژیک', direct: ['belgiumcentral'], nearby: ['europe-west4', 'westeurope', 'eu-west-3', 'francecentral', 'europe-west9'] },
        { code: 'BG', flag: '🇧🇬', nameEn: 'Bulgaria', nameFa: 'بلغارستان', direct: [], nearby: ['europe-central2', 'eu-south-1', 'italynorth', 'eu-central-1', 'europe-west3'] },
        { code: 'HR', flag: '🇭🇷', nameEn: 'Croatia', nameFa: 'کرواسی', direct: [], nearby: ['eu-south-1', 'italynorth', 'austriaeast', 'eu-central-1'] },
        { code: 'CY', flag: '🇨🇾', nameEn: 'Cyprus', nameFa: 'قبرس', direct: [], nearby: ['israelcentral', 'me-west1', 'eu-south-1', 'italynorth'] },
        { code: 'CZ', flag: '🇨🇿', nameEn: 'Czechia', nameFa: 'جمهوری چک', direct: [], nearby: ['eu-central-1', 'europe-west3', 'germanywestcentral', 'europe-central2', 'polandcentral'] },
        { code: 'DK', flag: '🇩🇰', nameEn: 'Denmark', nameFa: 'دانمارک', direct: [], nearby: ['eu-north-1', 'europe-north1', 'europe-west4', 'westeurope'] },
        { code: 'FI', flag: '🇫🇮', nameEn: 'Finland', nameFa: 'فنلاند', direct: ['europe-north1'], nearby: ['eu-north-1', 'norwayeast', 'northeurope'] },
        { code: 'FR', flag: '🇫🇷', nameEn: 'France', nameFa: 'فرانسه', direct: ['eu-west-3', 'europe-west9', 'francecentral', 'francesouth'], nearby: ['eu-central-1', 'westeurope', 'belgiumcentral'] },
        { code: 'DE', flag: '🇩🇪', nameEn: 'Germany', nameFa: 'آلمان', direct: ['eu-central-1', 'eu-central-2', 'europe-west3', 'germanynorth', 'germanywestcentral'], nearby: ['europe-west4', 'westeurope', 'francecentral'] },
        { code: 'GR', flag: '🇬🇷', nameEn: 'Greece', nameFa: 'یونان', direct: [], nearby: ['eu-south-1', 'italynorth', 'israelcentral', 'austriaeast'] },
        { code: 'HU', flag: '🇭🇺', nameEn: 'Hungary', nameFa: 'مجارستان', direct: [], nearby: ['austriaeast', 'europe-central2', 'polandcentral', 'eu-central-1'] },
        { code: 'IS', flag: '🇮🇸', nameEn: 'Iceland', nameFa: 'ایسلند', direct: [], nearby: ['eu-west-1', 'northeurope', 'eu-north-1'] },
        { code: 'IE', flag: '🇮🇪', nameEn: 'Ireland', nameFa: 'ایرلند', direct: ['eu-west-1', 'europe-west1', 'northeurope'], nearby: ['eu-west-2', 'uksouth', 'europe-west2'] },
        { code: 'IT', flag: '🇮🇹', nameEn: 'Italy', nameFa: 'ایتالیا', direct: ['eu-south-1', 'europe-west8', 'italynorth'], nearby: ['francecentral', 'eu-central-1', 'austriaeast'] },
        { code: 'NL', flag: '🇳🇱', nameEn: 'Netherlands', nameFa: 'هلند', direct: ['europe-west4', 'westeurope'], nearby: ['belgiumcentral', 'eu-central-1', 'europe-west3'] },
        { code: 'NO', flag: '🇳🇴', nameEn: 'Norway', nameFa: 'نروژ', direct: ['norwayeast', 'norwaywest'], nearby: ['eu-north-1', 'europe-north1', 'northeurope'] },
        { code: 'PL', flag: '🇵🇱', nameEn: 'Poland', nameFa: 'لهستان', direct: ['europe-central2', 'polandcentral'], nearby: ['eu-central-1', 'germanywestcentral', 'austriaeast'] },
        { code: 'PT', flag: '🇵🇹', nameEn: 'Portugal', nameFa: 'پرتغال', direct: [], nearby: ['europe-southwest1', 'spain', 'eu-south-2', 'francecentral'] },
        { code: 'RO', flag: '🇷🇴', nameEn: 'Romania', nameFa: 'رومانی', direct: [], nearby: ['europe-central2', 'polandcentral', 'austriaeast', 'eu-central-1'] },
        { code: 'RU', flag: '🇷🇺', nameEn: 'Russia', nameFa: 'روسیه', direct: [], nearby: ['europe-north1', 'eu-north-1', 'europe-central2', 'polandcentral'] },
        { code: 'ES', flag: '🇪🇸', nameEn: 'Spain', nameFa: 'اسپانیا', direct: ['eu-south-2', 'europe-southwest1'], nearby: ['francecentral', 'eu-west-3', 'francesouth'] },
        { code: 'SE', flag: '🇸🇪', nameEn: 'Sweden', nameFa: 'سوئد', direct: ['eu-north-1'], nearby: ['europe-north1', 'norwayeast', 'northeurope'] },
        { code: 'CH', flag: '🇨🇭', nameEn: 'Switzerland', nameFa: 'سوئیس', direct: ['europe-west6', 'switzerlandnorth'], nearby: ['eu-central-1', 'germanywestcentral', 'italynorth', 'francecentral'] },
        { code: 'TR', flag: '🇹🇷', nameEn: 'Turkey', nameFa: 'ترکیه', direct: [], nearby: ['eu-south-1', 'italynorth', 'israelcentral', 'me-central-1', 'europe-central2'] },
        { code: 'UA', flag: '🇺🇦', nameEn: 'Ukraine', nameFa: 'اوکراین', direct: [], nearby: ['europe-central2', 'polandcentral', 'austriaeast', 'eu-central-1'] },
        { code: 'GB', flag: '🇬🇧', nameEn: 'United Kingdom', nameFa: 'بریتانیا', direct: ['eu-west-2', 'europe-west2', 'uksouth', 'ukwest'], nearby: ['eu-west-1', 'northeurope', 'europe-west1', 'westeurope'] },

        // Middle East & Asia
        { code: 'AF', flag: '🇦🇫', nameEn: 'Afghanistan', nameFa: 'افغانستان', direct: [], nearby: ['me-central-1', 'me-south-1', 'centralindia', 'ap-south-1'] },
        { code: 'BHR', flag: '🇧🇭', nameEn: 'Bahrain', nameFa: 'بحرین', direct: ['me-south-1'], nearby: ['me-central-1', 'me-central2', 'qatarcentral'] },
        { code: 'IN', flag: '🇮🇳', nameEn: 'India', nameFa: 'هند', direct: ['ap-south-1', 'ap-south-2', 'asia-south1', 'asia-south2', 'centralindia', 'westindia'], nearby: ['me-central-1', 'asia-southeast1'] },
        { code: 'IR', flag: '🇮🇷', nameEn: 'Iran', nameFa: 'ایران', direct: [], nearby: ['me-central-1', 'me-central2', 'me-south-1', 'qatarcentral', 'me-west1', 'israelcentral'] },
        { code: 'IQ', flag: '🇮🇶', nameEn: 'Iraq', nameFa: 'عراق', direct: [], nearby: ['me-central-1', 'me-central2', 'me-south-1', 'qatarcentral'] },
        { code: 'IL', flag: '🇮🇱', nameEn: 'Israel', nameFa: 'اسرائیل', direct: ['il-central-1', 'me-west1', 'israelcentral'], nearby: ['me-central-1', 'eu-south-1', 'italynorth'] },
        { code: 'JP', flag: '🇯🇵', nameEn: 'Japan', nameFa: 'ژاپن', direct: ['ap-northeast-1', 'ap-northeast-3', 'asia-northeast1', 'japaneast', 'japanwest'], nearby: ['ap-northeast-2', 'koreacentral'] },
        { code: 'KR', flag: '🇰🇷', nameEn: 'Korea (South)', nameFa: 'کره جنوبی', direct: ['ap-northeast-2', 'asia-northeast3', 'koreacentral', 'koreasouth'], nearby: ['ap-northeast-1', 'japaneast'] },
        { code: 'KW', flag: '🇰🇼', nameEn: 'Kuwait', nameFa: 'کویت', direct: [], nearby: ['me-central-1', 'me-central2', 'qatarcentral', 'me-south-1'] },
        { code: 'PK', flag: '🇵🇰', nameEn: 'Pakistan', nameFa: 'پاکستان', direct: [], nearby: ['me-central-1', 'me-south-1', 'ap-south-1', 'centralindia'] },
        { code: 'QA', flag: '🇶🇦', nameEn: 'Qatar', nameFa: 'قطر', direct: ['me-central2', 'qatarcentral'], nearby: ['me-central-1', 'me-south-1'] },
        { code: 'SA', flag: '🇸🇦', nameEn: 'Saudi Arabia', nameFa: 'عربستان', direct: ['me-central-1'], nearby: ['me-central2', 'qatarcentral', 'me-south-1'] },
        { code: 'SG', flag: '🇸🇬', nameEn: 'Singapore', nameFa: 'سنگاپور', direct: ['ap-southeast-1', 'asia-southeast1', 'southeastasia'], nearby: ['ap-southeast-3', 'indonesiacentral', 'malaysiawest'] },
        { code: 'AE', flag: '🇦🇪', nameEn: 'United Arab Emirates', nameFa: 'امارات', prefixes: [], direct: ['me-central-1', 'me-central2', 'uaenorth'], nearby: ['me-south-1', 'qatarcentral'] },

        // Americas
        { code: 'AR', flag: '🇦🇷', nameEn: 'Argentina', nameFa: 'آرژانتین', direct: [], nearby: ['sa-east-1', 'southamerica-east1', 'brazilsouth', 'chilecentral'] },
        { code: 'BR', flag: '🇧🇷', nameEn: 'Brazil', nameFa: 'برزیل', direct: ['sa-east-1', 'southamerica-east1', 'brazilsouth', 'brazilsoutheast'], nearby: ['chilecentral', 'southamerica-west1'] },
        { code: 'CA', flag: '🇨🇦', nameEn: 'Canada', nameFa: 'کانادا', direct: ['ca-central-1', 'ca-west-1', 'northamerica-northeast1', 'canadacentral', 'canadaeast'], nearby: ['us-east-1', 'us-east4', 'us-west-2'] },
        { code: 'CL', flag: '🇨🇱', nameEn: 'Chile', nameFa: 'شیلی', direct: ['southamerica-west1', 'chilecentral'], nearby: ['sa-east-1', 'brazilsouth'] },
        { code: 'MX', flag: '🇲🇽', nameEn: 'Mexico', nameFa: 'مکزیک', direct: ['mx-central-1', 'mexicocentral'], nearby: ['us-south1', 'southcentralus', 'us-west-1'] },
        { code: 'US', flag: '🇺🇸', nameEn: 'United States', nameFa: 'آمریکا', direct: ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'us-central1', 'us-east1', 'us-east4', 'us-east5', 'us-south1', 'us-west1', 'us-west2', 'us-west3', 'us-west4', 'eastus', 'eastus2', 'westus', 'westus2', 'westus3', 'centralus', 'southcentralus'], nearby: ['ca-central-1', 'mexicocentral'] },

        // Africa & Oceania
        { code: 'AU', flag: '🇦🇺', nameEn: 'Australia', nameFa: 'استرالیا', direct: ['ap-southeast-2', 'australia-southeast1', 'australiaeast', 'australiasoutheast'], nearby: ['ap-southeast-1', 'southeastasia'] },
        { code: 'NZ', flag: '🇳🇿', nameEn: 'New Zealand', nameFa: 'نیوزیلند', direct: ['newzealandnorth'], nearby: ['ap-southeast-2', 'australiaeast'] },
        { code: 'ZA', flag: '🇿🇦', nameEn: 'South Africa', nameFa: 'آفریقای جنوبی', direct: ['af-south-1', 'africa-south1', 'southafricanorth', 'southafricawest'], nearby: ['eu-south-1', 'me-central-1'] }
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

    function renderList(elementId, allProviderRegions) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';

        const directMatches = allProviderRegions.filter(r => 
            selectedCountry.direct.some(pref => r.toLowerCase().includes(pref))
        );

        const nearbyMatches = allProviderRegions.filter(r => 
            selectedCountry.nearby.some(pref => r.toLowerCase().includes(pref)) && !directMatches.includes(r)
        );

        if (directMatches.length === 0 && nearbyMatches.length === 0) {
            container.innerHTML = \`<div class="empty-state">ریجن پیشنهادی برای این دیتاسنتر یافت نشد.</div>\`;
            return;
        }

        // Render Direct Matches First
        directMatches.forEach(regionName => {
            container.appendChild(createRegionItem(regionName, '⚡ دیتاسنتر مستقیم', 'tag-direct', 'دیتاسنتر اختصاصی موجود در خاک این کشور با کمترین پینگ'));
        });

        // Render Nearby Fallback Matches
        nearbyMatches.forEach(regionName => {
            container.appendChild(createRegionItem(regionName, '🌐 نزدیک‌ترین دیتاسنتر', 'tag-nearby', 'این نزدیک‌ترین دیتاسنتر منطقه‌ای به این کشور است که شانس قبولی و پینگ مناسبی دارد'));
        });
    }

    function createRegionItem(name, tagLabel, tagClass, subtext) {
        const div = document.createElement('div');
        div.className = 'region-item';
        div.innerHTML = \`
            <div class="region-main-row">
                <div><strong>\${name}</strong></div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <span class="region-tag \${tagClass}">\${tagLabel}</span>
                    <button class="copy-btn" onclick="copyToClipboard('\${name}')">کپی</button>
                </div>
            </div>
            <div class="region-subtext">\${subtext}</div>
        \`;
        return div;
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
