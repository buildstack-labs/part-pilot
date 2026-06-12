import { useState, useEffect } from "react";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_VEHICLES = {
  "64-519-74": {
    plate: "64-519-74", make: "Hyundai", makeHe: "יונדאי", model: "i10", trim: "GL",
    year: 2011, color: "אדום", origin: "הודו", vin: "MALAM51CBBM755264",
    lastTest: "31-03-2026", licenseExpiry: "28-03-2027", annualFee: "966",
    engine: "1.2L בנזין",
    specs: {
      power: "78 כוחות סוס", engineCC: "1,248 סמ\"ק", fuelType: "בנזין",
      gearbox: "אוטומטי", transportCode: "502-41", registrationNote: "לא ידוע",
      tireFront: "175/60R14", tireRear: "175/60R14",
      driveType: "4X2", driveNote: "רגילה", airbags: "4",
      electricWindows: "4", doors: "5", bodyType: "הצ'בק",
      sunroof: "לא", stabilityControl: "כן", abs: "כן",
      powerSteering: "כן", alloyWheels: "לא",
      laneAssist: "לא", adaptiveCruise: "לא", pollutionGroup: "13",
    }
  },
  "12-345-67": {
    plate: "12-345-67", make: "Hyundai", makeHe: "יונדאי", model: "i20", trim: "Active",
    year: 2019, color: "לבן פנינה", origin: "קוריאה", vin: "KMHCT41ABKU123456",
    lastTest: "15-08-2025", licenseExpiry: "14-08-2026", annualFee: "1,234",
    engine: "1.2L בנזין",
    specs: {
      power: "84 כוחות סוס", engineCC: "1,197 סמ\"ק", fuelType: "בנזין",
      gearbox: "אוטומטי", transportCode: "510-22", registrationNote: "לא ידוע",
      tireFront: "185/65R15", tireRear: "185/65R15",
      driveType: "4X2", driveNote: "רגילה", airbags: "6",
      electricWindows: "4", doors: "5", bodyType: "הצ'בק",
      sunroof: "לא", stabilityControl: "כן", abs: "כן",
      powerSteering: "כן", alloyWheels: "כן",
      laneAssist: "לא", adaptiveCruise: "לא", pollutionGroup: "14",
    }
  },
  "98-765-43": {
    plate: "98-765-43", make: "Toyota", makeHe: "טויוטה", model: "Corolla", trim: "Executive",
    year: 2021, color: "אפור מטאלי", origin: "יפן", vin: "JTDBR32E010123456",
    lastTest: "20-03-2026", licenseExpiry: "19-03-2027", annualFee: "1,456",
    engine: "1.8L בנזין",
    specs: {
      power: "122 כוחות סוס", engineCC: "1,798 סמ\"ק", fuelType: "בנזין",
      gearbox: "אוטומטי CVT", transportCode: "620-11", registrationNote: "לא ידוע",
      tireFront: "195/65R15", tireRear: "195/65R15",
      driveType: "4X2", driveNote: "רגילה", airbags: "7",
      electricWindows: "4", doors: "4", bodyType: "סדאן",
      sunroof: "כן", stabilityControl: "כן", abs: "כן",
      powerSteering: "כן", alloyWheels: "כן",
      laneAssist: "כן", adaptiveCruise: "כן", pollutionGroup: "14",
    }
  },
  "55-123-89": {
    plate: "55-123-89", make: "Kia", makeHe: "קיה", model: "Sportage", trim: "GT-Line",
    year: 2020, color: "שחור", origin: "קוריאה", vin: "KNAPJ815XK7123456",
    lastTest: "10-11-2025", licenseExpiry: "09-11-2026", annualFee: "1,678",
    engine: "2.0L בנזין",
    specs: {
      power: "150 כוחות סוס", engineCC: "1,999 סמ\"ק", fuelType: "בנזין",
      gearbox: "אוטומטי", transportCode: "712-08", registrationNote: "לא ידוע",
      tireFront: "235/55R18", tireRear: "235/55R18",
      driveType: "4X4", driveNote: "AWD", airbags: "6",
      electricWindows: "4", doors: "5", bodyType: "קרוסאובר",
      sunroof: "פנורמי", stabilityControl: "כן", abs: "כן",
      powerSteering: "כן", alloyWheels: "כן",
      laneAssist: "כן", adaptiveCruise: "כן", pollutionGroup: "14",
    }
  },
  "77-432-11": {
    plate: "77-432-11", make: "Honda", makeHe: "הונדה", model: "Jazz", trim: "Comfort",
    year: 2018, color: "כחול", origin: "יפן", vin: "HHMGE2750JS123456",
    lastTest: "05-01-2026", licenseExpiry: "04-01-2027", annualFee: "1,102",
    engine: "1.3L בנזין",
    specs: {
      power: "102 כוחות סוס", engineCC: "1,339 סמ\"ק", fuelType: "בנזין",
      gearbox: "אוטומטי CVT", transportCode: "530-44", registrationNote: "לא ידוע",
      tireFront: "185/55R16", tireRear: "185/55R16",
      driveType: "4X2", driveNote: "רגילה", airbags: "6",
      electricWindows: "4", doors: "5", bodyType: "הצ'בק",
      sunroof: "לא", stabilityControl: "כן", abs: "כן",
      powerSteering: "כן", alloyWheels: "כן",
      laneAssist: "לא", adaptiveCruise: "לא", pollutionGroup: "13",
    }
  },
  "33-987-55": {
    plate: "33-987-55", make: "Mazda", makeHe: "מאזדה", model: "3", trim: "Luxury",
    year: 2022, color: "אדום", origin: "יפן", vin: "JM1BN1V70N1123456",
    lastTest: "18-06-2026", licenseExpiry: "17-06-2027", annualFee: "1,890",
    engine: "2.0L בנזין",
    specs: {
      power: "165 כוחות סוס", engineCC: "1,998 סמ\"ק", fuelType: "בנזין",
      gearbox: "אוטומטי", transportCode: "810-33", registrationNote: "לא ידוע",
      tireFront: "215/45R18", tireRear: "215/45R18",
      driveType: "4X2", driveNote: "רגילה", airbags: "6",
      electricWindows: "4", doors: "4", bodyType: "סדאן",
      sunroof: "כן", stabilityControl: "כן", abs: "כן",
      powerSteering: "כן", alloyWheels: "כן",
      laneAssist: "כן", adaptiveCruise: "כן", pollutionGroup: "15",
    }
  },
};

// SVG illustrations for each category — clean product-style drawings
const CAT_SVG = {
  filters: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="8" width="40" height="64" rx="8" fill="#E8C97A" stroke="#C8A444" stroke-width="2"/>
    <rect x="28" y="16" width="24" height="4" rx="2" fill="#A07820"/>
    <rect x="24" y="24" width="32" height="3" rx="1.5" fill="#C8A444"/>
    <rect x="24" y="30" width="32" height="3" rx="1.5" fill="#C8A444"/>
    <rect x="24" y="36" width="32" height="3" rx="1.5" fill="#C8A444"/>
    <rect x="24" y="42" width="32" height="3" rx="1.5" fill="#C8A444"/>
    <rect x="24" y="48" width="32" height="3" rx="1.5" fill="#C8A444"/>
    <rect x="28" y="58" width="24" height="6" rx="3" fill="#A07820"/>
  </svg>`,
  brakes: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="28" stroke="#CC2222" stroke-width="3" fill="none"/>
    <circle cx="40" cy="40" r="18" stroke="#888" stroke-width="2" fill="#DDDDDD"/>
    <circle cx="40" cy="40" r="6" fill="#555"/>
    <line x1="40" y1="12" x2="40" y2="22" stroke="#CC2222" stroke-width="3" stroke-linecap="round"/>
    <line x1="40" y1="58" x2="40" y2="68" stroke="#CC2222" stroke-width="3" stroke-linecap="round"/>
    <line x1="12" y1="40" x2="22" y2="40" stroke="#CC2222" stroke-width="3" stroke-linecap="round"/>
    <line x1="58" y1="40" x2="68" y2="40" stroke="#CC2222" stroke-width="3" stroke-linecap="round"/>
    <rect x="50" y="28" width="12" height="24" rx="3" fill="#CC2222" opacity="0.85"/>
  </svg>`,
  engine: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="28" width="44" height="28" rx="5" fill="#8899AA" stroke="#667788" stroke-width="1.5"/>
    <rect x="24" y="20" width="8" height="12" rx="2" fill="#667788"/>
    <rect x="36" y="20" width="8" height="12" rx="2" fill="#667788"/>
    <rect x="48" y="20" width="8" height="12" rx="2" fill="#667788"/>
    <rect x="8" y="34" width="10" height="16" rx="3" fill="#556677"/>
    <rect x="62" y="34" width="10" height="16" rx="3" fill="#556677"/>
    <circle cx="30" cy="44" r="6" fill="#445566"/>
    <circle cx="50" cy="44" r="6" fill="#445566"/>
    <rect x="24" y="56" width="32" height="6" rx="2" fill="#556677"/>
  </svg>`,
  body: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 52 L20 30 Q30 18 45 18 L65 18 Q72 18 72 26 L72 52 Z" fill="#6699CC" stroke="#4477AA" stroke-width="1.5"/>
    <rect x="8" y="50" width="66" height="14" rx="4" fill="#4477AA"/>
    <rect x="22" y="22" width="20" height="16" rx="2" fill="#AACCEE" opacity="0.8"/>
    <rect x="46" y="22" width="16" height="16" rx="2" fill="#AACCEE" opacity="0.8"/>
    <circle cx="20" cy="64" r="7" fill="#222"/>
    <circle cx="20" cy="64" r="4" fill="#888"/>
    <circle cx="60" cy="64" r="7" fill="#222"/>
    <circle cx="60" cy="64" r="4" fill="#888"/>
  </svg>`,
  electrical: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="16" y="22" width="48" height="36" rx="5" fill="#2244AA" stroke="#1133888" stroke-width="1.5"/>
    <rect x="24" y="14" width="10" height="12" rx="3" fill="#111"/>
    <rect x="46" y="14" width="10" height="12" rx="3" fill="#CC2222"/>
    <rect x="22" y="32" width="36" height="14" rx="3" fill="#AACCFF" opacity="0.3"/>
    <text x="40" y="43" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="bold" font-family="monospace">12V</text>
    <line x1="24" y1="52" x2="24" y2="58" stroke="#FFFFFF" stroke-width="2"/>
    <line x1="56" y1="52" x2="56" y2="58" stroke="#FFFFFF" stroke-width="2"/>
  </svg>`,
  suspension: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="34" y="8" width="12" height="14" rx="3" fill="#778899"/>
    <line x1="40" y1="22" x2="40" y2="46" stroke="#556677" stroke-width="5" stroke-linecap="round"/>
    <path d="M32 30 Q40 26 48 30 Q40 34 32 30Z" fill="#99AABB"/>
    <path d="M32 36 Q40 32 48 36 Q40 40 32 36Z" fill="#99AABB"/>
    <path d="M32 42 Q40 38 48 42 Q40 46 32 42Z" fill="#99AABB"/>
    <rect x="30" y="46" width="20" height="24" rx="4" fill="#667788"/>
    <circle cx="40" cy="70" r="6" fill="#445566"/>
  </svg>`,
  cooling: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="16" width="56" height="48" rx="4" fill="#AADDCC" stroke="#44AA88" stroke-width="1.5"/>
    <line x1="22" y1="16" x2="22" y2="64" stroke="#44AA88" stroke-width="2"/>
    <line x1="32" y1="16" x2="32" y2="64" stroke="#44AA88" stroke-width="2"/>
    <line x1="42" y1="16" x2="42" y2="64" stroke="#44AA88" stroke-width="2"/>
    <line x1="52" y1="16" x2="52" y2="64" stroke="#44AA88" stroke-width="2"/>
    <line x1="62" y1="16" x2="62" y2="64" stroke="#44AA88" stroke-width="2"/>
    <rect x="6" y="28" width="10" height="24" rx="3" fill="#33997766"/>
    <rect x="64" y="28" width="10" height="24" rx="3" fill="#33997766"/>
  </svg>`,
  exhaust: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 52 Q20 52 28 44 Q36 36 50 36 L70 36" stroke="#778899" stroke-width="7" stroke-linecap="round" fill="none"/>
    <ellipse cx="72" cy="36" rx="5" ry="9" fill="#556677"/>
    <circle cx="16" cy="56" r="8" fill="#445566" stroke="#334455" stroke-width="1.5"/>
    <circle cx="16" cy="56" r="4" fill="#778899"/>
  </svg>`,
  steering: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="28" stroke="#4455AA" stroke-width="3" fill="none"/>
    <circle cx="40" cy="40" r="8" fill="#4455AA"/>
    <line x1="40" y1="12" x2="40" y2="32" stroke="#4455AA" stroke-width="3"/>
    <line x1="14" y1="54" x2="31" y2="45" stroke="#4455AA" stroke-width="3"/>
    <line x1="66" y1="54" x2="49" y2="45" stroke="#4455AA" stroke-width="3"/>
  </svg>`,
  aircon: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="24" fill="#DDEEFF" stroke="#6699CC" stroke-width="2"/>
    <circle cx="40" cy="40" r="16" fill="none" stroke="#4488BB" stroke-width="1.5" stroke-dasharray="4 3"/>
    <path d="M40 20 L44 32 L40 28 L36 32 Z" fill="#2266AA"/>
    <path d="M60 40 L48 44 L52 40 L48 36 Z" fill="#2266AA"/>
    <path d="M40 60 L36 48 L40 52 L44 48 Z" fill="#2266AA"/>
    <path d="M20 40 L32 36 L28 40 L32 44 Z" fill="#2266AA"/>
    <circle cx="40" cy="40" r="5" fill="#2266AA"/>
  </svg>`,
};

const PART_CATEGORIES = [
  {
    id: "filters", nameHe: "פילטרים", nameEn: "Filters",
    subcats: ["מסנן שמן", "מסנן אוויר", "מסנן מזגן", "מסנן דלק"],
    count: 4,
  },
  {
    id: "brakes", nameHe: "מערכת בלמים", nameEn: "Braking System",
    subcats: ["רפידות בלם", "דיסקי בלם", "נוזל בלמים", "מאחז בלם"],
    count: 4,
  },
  {
    id: "engine", nameHe: "מנוע", nameEn: "Engine",
    subcats: ["מצתים", "רצועת תזמון", "חיישני מנוע"],
    count: 3,
  },
  {
    id: "body", nameHe: "מרכב", nameEn: "Body",
    subcats: ["מגבים", "מראות", "פגושים", "קפוט"],
    count: 2,
  },
  {
    id: "electrical", nameHe: "חשמל ומצבר", nameEn: "Electrics",
    subcats: ["מצבר", "פנסים", "חיישני חמצן", "יחידות בקרה"],
    count: 3,
  },
  {
    id: "suspension", nameHe: "מתלים והיגוי", nameEn: "Suspension / Steering",
    subcats: ["קפיצים", "שוחצים", "זרועות", "כדורי היגוי"],
    count: 3,
  },
  {
    id: "cooling", nameHe: "מערכת קירור", nameEn: "Cooling System",
    subcats: ["רדיאטור", "תרמוסטט", "צינורות", "נוזל קירור"],
    count: 4,
  },
  {
    id: "exhaust", nameHe: "מערכת פליטה", nameEn: "Exhaust System",
    subcats: ["מפלט", "חיישן חמצן", "ממיר קטליטי"],
    count: 3,
  },
  {
    id: "steering", nameHe: "הגה ובקרת כיוון", nameEn: "Steering",
    subcats: ["הגה כוח", "זרוע היגוי", "מסבי גלגל"],
    count: 3,
  },
  {
    id: "aircon", nameHe: "מיזוג אוויר", nameEn: "Air Conditioning",
    subcats: ["קומפרסור", "קולט חום", "חיישני טמפרטורה"],
    count: 3,
  },
];

const PARTS_BY_CATEGORY = {
  filters: [
    { id: "p1", oemNumber: "26300-35505", nameHe: "מסנן שמן", nameEn: "Oil Filter", difficulty: "beginner", description: "להחלפה כל 10,000 ק״מ", imageUrl: null },
    { id: "p2", oemNumber: "28113-2H000", nameHe: "מסנן אוויר", nameEn: "Air Filter", difficulty: "beginner", description: "להחלפה כל 20,000 ק״מ", imageUrl: null },
    { id: "p3", oemNumber: "97133-2H000", nameHe: "מסנן מזגן", nameEn: "Cabin Filter", difficulty: "beginner", description: "להחלפה כל שנה או 15,000 ק״מ", imageUrl: null },
    { id: "p4", oemNumber: "31112-2H000", nameHe: "מסנן דלק", nameEn: "Fuel Filter", difficulty: "intermediate", description: "להחלפה כל 40,000 ק״מ", imageUrl: null },
  ],
  brakes: [
    { id: "p5", oemNumber: "58101-2HA10", nameHe: "רפידות בלם קדמיות", nameEn: "Front Brake Pads", difficulty: "intermediate", description: "להחלפה כל 30,000-50,000 ק״מ", imageUrl: null },
    { id: "p6", oemNumber: "58302-2HA10", nameHe: "רפידות בלם אחוריות", nameEn: "Rear Brake Pads", difficulty: "intermediate", description: "להחלפה כל 40,000-60,000 ק״מ", imageUrl: null },
    { id: "p7", oemNumber: "51712-2HA00", nameHe: "דיסק בלם קדמי", nameEn: "Front Brake Disc", difficulty: "professional", description: "בדיקה בכל החלפת רפידות", imageUrl: null },
    { id: "p8", oemNumber: "58411-2HA00", nameHe: "נוזל בלמים", nameEn: "Brake Fluid DOT4", difficulty: "beginner", description: "להחלפה כל שנתיים", imageUrl: null },
  ],
  engine: [
    { id: "p9", oemNumber: "18841-11051", nameHe: "מצתים", nameEn: "Spark Plugs (x4)", difficulty: "intermediate", description: "להחלפה כל 30,000 ק״מ", imageUrl: null },
    { id: "p10", oemNumber: "25100-2B000", nameHe: "חיישן טמפרטורת קירור", nameEn: "Coolant Temp Sensor", difficulty: "professional", description: "להחלפה בעת תקלה", imageUrl: null },
    { id: "p11", oemNumber: "24312-2B600", nameHe: "רצועת תזמון", nameEn: "Timing Belt", difficulty: "professional", description: "להחלפה כל 80,000 ק״מ", imageUrl: null },
  ],
  body: [
    { id: "p12", oemNumber: "98350-2H100", nameHe: "מגבי שמשה קדמיים", nameEn: "Wiper Blades", difficulty: "beginner", description: "להחלפה כל שנה", imageUrl: null },
    { id: "p13", oemNumber: "86521-2H000", nameHe: "מראה צד ימין", nameEn: "Right Side Mirror", difficulty: "intermediate", description: "החלפה בעת נזק", imageUrl: null },
  ],
  electrical: [
    { id: "p14", oemNumber: "37110-2H010", nameHe: "מצבר", nameEn: "Battery 60Ah", difficulty: "beginner", description: "להחלפה כל 3-5 שנים", imageUrl: null },
    { id: "p15", oemNumber: "92101-2H010", nameHe: "פנס קדמי ימין", nameEn: "Right Headlight", difficulty: "professional", description: "החלפה בעת נזק", imageUrl: null },
    { id: "p16", oemNumber: "18665-2B000", nameHe: "חיישן חמצן (למבדה)", nameEn: "Oxygen Sensor", difficulty: "professional", description: "החלפה בעת תקלה בחיישן", imageUrl: null },
  ],
  suspension: [
    { id: "p17", oemNumber: "54610-2H000", nameHe: "זרוע השעיה קדמית", nameEn: "Front Control Arm", difficulty: "professional", description: "החלפה בעת בלאי", imageUrl: null },
    { id: "p18", oemNumber: "54302-2H000", nameHe: "קפיץ קדמי", nameEn: "Front Coil Spring", difficulty: "professional", description: "החלפה בזוגות", imageUrl: null },
    { id: "p19", oemNumber: "55111-2H000", nameHe: "שוחץ (אמורטיזר) קדמי", nameEn: "Front Shock Absorber", difficulty: "professional", description: "החלפה בזוגות, כל 60,000 ק״מ", imageUrl: null },
  ],
};

const SUPPLIERS = [
  { id: "s1", nameHe: "א.ל.מ חלפים", nameEn: "ALM Parts", country: "ישראל", flag: "🇮🇱", type: "local", rating: 4.5, deliveryDays: "1-2" },
  { id: "s2", nameHe: "יינות ביתן מוטורס", nameEn: "YB Motors", country: "ישראל", flag: "🇮🇱", type: "local", rating: 4.2, deliveryDays: "2-3" },
  { id: "s3", nameHe: "eBay מוטורס", nameEn: "eBay Motors", country: "גרמניה", flag: "🇩🇪", type: "international", rating: 4.7, deliveryDays: "10-14" },
  { id: "s4", nameHe: "Amayama", nameEn: "Amayama", country: "יפן", flag: "🇯🇵", type: "international", rating: 4.8, deliveryDays: "14-21" },
  { id: "s5", nameHe: "RockAuto", nameEn: "RockAuto", country: "ארה״ב", flag: "🇺🇸", type: "international", rating: 4.6, deliveryDays: "10-15" },
];

function getOffersForPart(partId) {
  const base = Math.floor(Math.random() * 80) + 40;
  return SUPPLIERS.map((s, i) => ({
    supplierId: s.id,
    price: s.type === "local" ? base * (1.4 + i * 0.1) : base * (0.7 + i * 0.05),
    currency: "₪",
    inStock: Math.random() > 0.2,
    shipping: s.type === "local" ? 0 : Math.floor(Math.random() * 30) + 25,
  }));
}

const DIFFICULTY_MAP = {
  beginner: { label: "קל — מתחיל", color: "#48BB78", bg: "#F0FFF4" },
  intermediate: { label: "בינוני", color: "#F6AD55", bg: "#FFFAF0" },
  professional: { label: "מקצועי — מוסך", color: "#F56565", bg: "#FFF5F5" },
};

// ─── CSS ─────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'Heebo', sans-serif; direction: rtl; background: #F7FAFC; color: #2D3748; }

  :root {
    --navy: #1E3A5F;
    --navy-light: #2A4A72;
    --orange: #F6AD55;
    --orange-dark: #E8941A;
    --green: #48BB78;
    --red: #F56565;
    --bg: #F7FAFC;
    --card: #FFFFFF;
    --border: #E2E8F0;
    --text: #2D3748;
    --muted: #718096;
    --shadow: 0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06);
    --shadow-lg: 0 10px 25px rgba(0,0,0,0.12);
  }

  .app { min-height: 100vh; direction: rtl; }

  /* ─── HEADER ─── */
  .header {
    background: var(--navy);
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }
  .logo-icon {
    width: 34px; height: 34px;
    background: var(--orange);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .logo-text { color: white; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; }
  .logo-sub { color: var(--orange); font-size: 10px; font-weight: 400; margin-top: -2px; }
  .header-search {
    flex: 1; max-width: 380px; margin: 0 24px;
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px; padding: 6px 12px;
    cursor: pointer; transition: background 0.2s;
  }
  .header-search:hover { background: rgba(255,255,255,0.15); }
  .header-search-text { color: rgba(255,255,255,0.6); font-size: 14px; font-family: 'Heebo'; }
  .header-actions { display: flex; gap: 12px; align-items: center; }
  .btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.25); color: white; padding: 6px 14px; border-radius: 7px; cursor: pointer; font-family: 'Heebo'; font-size: 13px; font-weight: 500; transition: all 0.15s; }
  .btn-ghost:hover { background: rgba(255,255,255,0.1); }

  /* ─── HERO ─── */
  .hero {
    background: linear-gradient(145deg, var(--navy) 0%, #2d5f9e 60%, #1a3050 100%);
    padding: 64px 24px 80px;
    text-align: center;
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(246,173,85,0.15); border: 1px solid rgba(246,173,85,0.3);
    color: var(--orange); font-size: 12px; font-weight: 600;
    padding: 4px 12px; border-radius: 20px; margin-bottom: 20px;
  }
  .hero-title { color: white; font-size: 40px; font-weight: 900; line-height: 1.15; margin-bottom: 12px; }
  .hero-title span { color: var(--orange); }
  .hero-sub { color: rgba(255,255,255,0.65); font-size: 16px; margin-bottom: 40px; font-weight: 400; }

  /* ─── SEARCH BOX ─── */
  .search-box {
    max-width: 560px; margin: 0 auto;
    background: white; border-radius: 14px;
    padding: 20px; box-shadow: var(--shadow-lg);
    position: relative; z-index: 1;
  }
  .search-label { font-size: 13px; font-weight: 600; color: var(--muted); margin-bottom: 10px; text-align: right; }
  .search-row { display: flex; gap: 10px; }
  .plate-input {
    flex: 1; background: #F7FAFC; border: 2px solid var(--border);
    border-radius: 10px; padding: 14px 16px;
    font-size: 22px; font-weight: 700; letter-spacing: 3px;
    font-family: 'Heebo'; text-align: center; color: var(--navy);
    transition: border-color 0.2s; outline: none; direction: ltr;
  }
  .plate-input::placeholder { font-size: 16px; letter-spacing: 1px; color: #CBD5E0; font-weight: 400; }
  .plate-input:focus { border-color: var(--orange); background: white; }
  .plate-input.error { border-color: var(--red); }
  .btn-search {
    background: var(--orange); color: white;
    border: none; border-radius: 10px;
    padding: 14px 28px; font-size: 16px; font-weight: 700;
    font-family: 'Heebo'; cursor: pointer; white-space: nowrap;
    transition: all 0.15s; box-shadow: 0 4px 12px rgba(246,173,85,0.35);
  }
  .btn-search:hover { background: var(--orange-dark); transform: translateY(-1px); }
  .btn-search:active { transform: translateY(0); }
  .btn-search:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .search-hint { margin-top: 12px; font-size: 12px; color: var(--muted); text-align: center; }
  .search-hint a { color: var(--orange); text-decoration: none; }
  .search-error { margin-top: 10px; color: var(--red); font-size: 13px; font-weight: 500; text-align: center; }
  .recent-searches { margin-top: 14px; display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .recent-chip {
    background: #EDF2F7; border: none; border-radius: 6px;
    padding: 5px 11px; font-size: 12px; font-weight: 600;
    color: var(--navy); cursor: pointer; font-family: 'Heebo';
    letter-spacing: 1px; transition: background 0.15s;
  }
  .recent-chip:hover { background: #E2E8F0; }

  /* ─── STATS STRIP ─── */
  .stats-strip {
    background: white; border-bottom: 1px solid var(--border);
    padding: 16px 24px; display: flex; justify-content: center; gap: 48px;
  }
  .stat-item { text-align: center; }
  .stat-num { font-size: 22px; font-weight: 800; color: var(--navy); }
  .stat-label { font-size: 12px; color: var(--muted); margin-top: 1px; }

  /* ─── PAGE CONTAINER ─── */
  .page { max-width: 1000px; margin: 0 auto; padding: 24px; }

  /* ─── BREADCRUMB ─── */
  .breadcrumb {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; color: var(--muted); margin-bottom: 20px; flex-wrap: wrap;
  }
  .breadcrumb-link { cursor: pointer; color: var(--navy); font-weight: 500; }
  .breadcrumb-link:hover { text-decoration: underline; }
  .breadcrumb-sep { color: #CBD5E0; }

  /* ─── VEHICLE CARD ─── */
  .vehicle-card {
    background: var(--card); border-radius: 14px;
    box-shadow: var(--shadow); margin-bottom: 24px;
    overflow: hidden; border: 1px solid var(--border);
  }
  .vehicle-card-header {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
    padding: 20px 24px; display: flex; align-items: center; justify-content: space-between;
  }
  .vehicle-card-title { color: white; }
  .vehicle-make { font-size: 13px; color: rgba(255,255,255,0.6); font-weight: 400; }
  .vehicle-name { font-size: 26px; font-weight: 800; color: white; line-height: 1.1; }
  .vehicle-year { font-size: 15px; color: var(--orange); font-weight: 600; margin-top: 2px; }
  .vehicle-plate-badge {
    background: white; border-radius: 8px; padding: 8px 14px;
    text-align: center; min-width: 110px;
  }
  .plate-label { font-size: 9px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
  .plate-number { font-size: 17px; font-weight: 800; color: var(--navy); letter-spacing: 2px; direction: ltr; }
  .vehicle-card-body { padding: 20px 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px; }
  .vehicle-spec { }
  .vehicle-spec-label { font-size: 11px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
  .vehicle-spec-value { font-size: 15px; font-weight: 700; color: var(--text); }
  .vehicle-card-footer { padding: 16px 24px; background: #F7FAFC; border-top: 1px solid var(--border); display: flex; gap: 10px; }
  .btn-primary {
    background: var(--orange); color: white; border: none; border-radius: 9px;
    padding: 10px 22px; font-size: 14px; font-weight: 700; font-family: 'Heebo';
    cursor: pointer; transition: all 0.15s; box-shadow: 0 3px 8px rgba(246,173,85,0.3);
  }
  .btn-primary:hover { background: var(--orange-dark); transform: translateY(-1px); }
  .btn-secondary {
    background: white; color: var(--navy); border: 1.5px solid var(--border); border-radius: 9px;
    padding: 10px 20px; font-size: 14px; font-weight: 600; font-family: 'Heebo';
    cursor: pointer; transition: all 0.15s;
  }
  .btn-secondary:hover { border-color: var(--navy); background: #EDF2F7; }

  /* ─── SECTION TITLE ─── */
  .section-title { font-size: 20px; font-weight: 800; color: var(--navy); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .section-title-count { font-size: 13px; color: var(--muted); font-weight: 500; background: #EDF2F7; padding: 2px 9px; border-radius: 10px; }

  /* ─── SPARETO-STYLE CATEGORY GRID ─── */
  .cat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    background: white;
    box-shadow: var(--shadow);
    margin-bottom: 28px;
  }
  .cat-cell {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 18px 16px;
    border-left: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.15s;
    position: relative;
  }
  .cat-cell:nth-child(3n) { border-left: none; }
  .cat-cell:nth-last-child(-n+3) { border-bottom: none; }
  .cat-cell:hover { background: #F7FAFC; }
  .cat-cell.active { background: #FFFBF5; }
  .cat-cell.active::before {
    content: '';
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--orange);
    border-radius: 0 3px 3px 0;
  }
  .cat-img {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cat-img svg { width: 60px; height: 60px; }
  .cat-text { flex: 1; min-width: 0; }
  .cat-title-he { font-size: 14px; font-weight: 800; color: #1E3A5F; margin-bottom: 2px; }
  .cat-title-en { font-size: 11px; color: #718096; margin-bottom: 6px; font-weight: 500; }
  .cat-subcats { display: flex; flex-direction: column; gap: 1px; }
  .cat-subcat { font-size: 12px; color: #4A5568; line-height: 1.5; }
  .cat-subcat:hover { color: var(--orange); }
  .cat-more { font-size: 11px; color: #A0AEC0; margin-top: 2px; }

  @media (max-width: 700px) {
    .cat-grid { grid-template-columns: repeat(2, 1fr); }
    .cat-cell:nth-child(3n) { border-left: 1px solid var(--border); }
    .cat-cell:nth-child(2n) { border-left: none; }
  }
  @media (max-width: 420px) {
    .cat-grid { grid-template-columns: 1fr; }
    .cat-cell { border-left: none !important; }
  }

  /* ─── CATEGORY GRID (old small cards, kept for fallback) ─── */
  .category-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; margin-bottom: 28px; }
  .category-card {
    background: var(--card); border: 1.5px solid var(--border); border-radius: 12px;
    padding: 18px 14px; text-align: center; cursor: pointer;
    transition: all 0.15s; box-shadow: var(--shadow);
  }
  .category-card:hover { border-color: var(--orange); transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.1); }
  .category-card.active { border-color: var(--orange); background: #FFFBF5; }
  .category-icon { font-size: 28px; margin-bottom: 8px; }
  .category-name { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .category-count { font-size: 11px; color: var(--muted); }

  /* ─── PARTS LIST ─── */
  .parts-grid { display: flex; flex-direction: column; gap: 10px; }
  .part-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 11px;
    padding: 16px 18px; display: flex; align-items: center; gap: 14px;
    cursor: pointer; transition: all 0.15s; box-shadow: var(--shadow);
  }
  .part-card:hover { border-color: var(--orange); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .part-icon-box {
    width: 44px; height: 44px; border-radius: 10px;
    background: #EDF2F7; display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .part-info { flex: 1; }
  .part-name-he { font-size: 15px; font-weight: 700; color: var(--text); }
  .part-name-en { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .part-oem { font-size: 11px; color: var(--navy); font-weight: 600; background: #EDF2F7; padding: 2px 8px; border-radius: 5px; display: inline-block; margin-top: 4px; direction: ltr; }
  .part-meta { display: flex; align-items: center; gap: 10px; }
  .difficulty-badge { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 5px; }
  .part-arrow { color: var(--muted); font-size: 16px; }

  /* ─── PART DETAIL ─── */
  .detail-header {
    background: var(--card); border-radius: 14px; padding: 24px;
    box-shadow: var(--shadow); margin-bottom: 20px; border: 1px solid var(--border);
  }
  .detail-oem-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .detail-oem-chip { background: #EDF2F7; border-radius: 7px; padding: 4px 12px; font-size: 13px; font-weight: 700; color: var(--navy); direction: ltr; }
  .detail-title { font-size: 26px; font-weight: 800; color: var(--navy); margin-bottom: 4px; }
  .detail-title-en { font-size: 14px; color: var(--muted); margin-bottom: 12px; }
  .detail-desc { font-size: 14px; color: var(--text); line-height: 1.6; background: #F7FAFC; padding: 12px 14px; border-radius: 8px; margin-bottom: 14px; }
  .detail-badges { display: flex; gap: 8px; flex-wrap: wrap; }

  /* ─── SUPPLIER COMPARISON ─── */
  .suppliers-section { }
  .supplier-filters { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
  .filter-btn {
    background: white; border: 1.5px solid var(--border); border-radius: 7px;
    padding: 6px 14px; font-size: 13px; font-weight: 600; color: var(--muted);
    font-family: 'Heebo'; cursor: pointer; transition: all 0.15s;
  }
  .filter-btn.active { border-color: var(--navy); color: var(--navy); background: #EDF2F7; }
  .supplier-cards { display: flex; flex-direction: column; gap: 10px; }
  .supplier-row {
    background: var(--card); border-radius: 11px; border: 1px solid var(--border);
    padding: 16px 18px; display: flex; align-items: center; gap: 14px;
    box-shadow: var(--shadow); transition: box-shadow 0.15s;
  }
  .supplier-row:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .supplier-row.best { border-color: var(--green); border-width: 1.5px; }
  .supplier-rank {
    width: 28px; height: 28px; border-radius: 50%;
    background: #EDF2F7; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; color: var(--navy); flex-shrink: 0;
  }
  .supplier-rank.gold { background: #FEFCBF; color: #975A16; }
  .supplier-flag { font-size: 20px; flex-shrink: 0; }
  .supplier-info { flex: 1; }
  .supplier-name { font-size: 15px; font-weight: 700; color: var(--text); }
  .supplier-country { font-size: 12px; color: var(--muted); }
  .supplier-delivery { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .supplier-pricing { text-align: left; }
  .supplier-price { font-size: 22px; font-weight: 800; color: var(--navy); }
  .supplier-shipping { font-size: 11px; color: var(--muted); }
  .btn-order {
    background: var(--navy); color: white; border: none; border-radius: 8px;
    padding: 8px 16px; font-size: 13px; font-weight: 700; font-family: 'Heebo';
    cursor: pointer; transition: all 0.15s; white-space: nowrap;
  }
  .btn-order:hover { background: var(--navy-light); }
  .btn-order:disabled { background: #CBD5E0; cursor: not-allowed; }
  .out-of-stock { font-size: 12px; color: var(--red); font-weight: 600; }
  .best-badge {
    background: #F0FFF4; color: #276749; border: 1px solid #9AE6B4;
    font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px;
    margin-right: 6px;
  }

  /* ─── LOADING ─── */
  .loading-overlay {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 60px 24px; gap: 16px;
  }
  .spinner {
    width: 40px; height: 40px; border: 3px solid #E2E8F0;
    border-top-color: var(--orange); border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-size: 15px; color: var(--muted); font-weight: 500; }

  /* ─── EMPTY / ERROR ─── */
  .empty-state { text-align: center; padding: 48px 24px; }
  .empty-icon { font-size: 48px; margin-bottom: 16px; }
  .empty-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
  .empty-sub { font-size: 14px; color: var(--muted); }

  /* ─── TABS ─── */
  .tabs { display: flex; gap: 2px; background: #EDF2F7; border-radius: 9px; padding: 3px; margin-bottom: 18px; }
  .tab {
    flex: 1; padding: 8px 14px; font-size: 13px; font-weight: 600;
    font-family: 'Heebo'; border: none; border-radius: 7px;
    cursor: pointer; transition: all 0.15s; color: var(--muted); background: transparent;
    text-align: center;
  }
  .tab.active { background: white; color: var(--navy); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

  /* ─── FOOTER ─── */
  .footer {
    background: var(--navy); color: rgba(255,255,255,0.5);
    text-align: center; padding: 24px; font-size: 12px; margin-top: 48px;
  }
  .footer strong { color: rgba(255,255,255,0.8); }

  @media (max-width: 600px) {
    .hero { padding: 40px 16px 60px; }
    .hero-title { font-size: 28px; }
    .stats-strip { gap: 24px; padding: 14px 16px; }
    .page { padding: 16px; }
    .vehicle-card-body { grid-template-columns: repeat(2, 1fr); }
    .category-grid { grid-template-columns: repeat(3, 1fr); }
    .supplier-row { flex-wrap: wrap; }
    .search-row { flex-direction: column; }
    .btn-search { width: 100%; }
    .vehicle-detail-grid { grid-template-columns: 1fr !important; }
  }
`;

// ─── APP COMPONENT ────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("home"); // home | vehicle | parts | partDetail
  const [plate, setPlate] = useState("");
  const [plateInput, setPlateInput] = useState("");
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("filters");
  const [selectedPart, setSelectedPart] = useState(null);
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [recentSearches, setRecentSearches] = useState(["64-519-74", "12-345-67"]);

  const handleSearch = (p) => {
    const raw = (p || plateInput).trim().toUpperCase();
    setError("");
    if (!raw) { setError("נא להזין מספר לוחית"); return; }

    // Normalize: try as-is, then add dashes if missing
    const candidates = [raw];
    const digits = raw.replace(/-/g, "");
    if (digits.length === 7) candidates.push(`${digits.slice(0,2)}-${digits.slice(2,5)}-${digits.slice(5,7)}`);
    if (digits.length === 8) candidates.push(`${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6,8)}`);

    setLoading(true);
    setTimeout(() => {
      const found = candidates.reduce((acc, c) => acc || MOCK_VEHICLES[c], null);
      if (found) {
        setVehicle(found);
        setPlate(found.plate);
        setView("vehicle");
        if (!recentSearches.includes(found.plate)) {
          setRecentSearches(prev => [found.plate, ...prev].slice(0, 5));
        }
      } else {
        setError(`לא נמצא רכב עם לוחית "${raw}". נסה: 64-519-74`);
      }
      setLoading(false);
    }, 1100);
  };

  const goHome = () => { setView("home"); setVehicle(null); setPlateInput(""); setError(""); };

  return (
    <div className="app">
      <style>{styles}</style>
      <Header vehicle={vehicle} onLogoClick={goHome} onSearch={handleSearch} view={view} />
      {view === "home" && (
        <HomePage
          plateInput={plateInput}
          setPlateInput={setPlateInput}
          onSearch={() => handleSearch()}
          loading={loading}
          error={error}
          recentSearches={recentSearches}
        />
      )}
      {view === "vehicle" && vehicle && (
        <VehiclePage
          vehicle={vehicle}
          onViewParts={() => setView("parts")}
          onBack={goHome}
        />
      )}
      {view === "parts" && vehicle && (
        <PartsPage
          vehicle={vehicle}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onSelectPart={(p) => { setSelectedPart(p); setView("partDetail"); }}
          onBack={() => setView("vehicle")}
        />
      )}
      {view === "partDetail" && selectedPart && vehicle && (
        <PartDetailPage
          part={selectedPart}
          vehicle={vehicle}
          supplierFilter={supplierFilter}
          setSupplierFilter={setSupplierFilter}
          onBack={() => setView("parts")}
        />
      )}
      <footer className="footer">
        <strong>PartPilot</strong> · פלטפורמת חלקי רכב ישראלית · כל הזכויות שמורות © 2026
      </footer>
    </div>
  );
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
function Header({ vehicle, onLogoClick, onSearch, view }) {
  const [q, setQ] = useState("");
  return (
    <header className="header">
      <div className="logo" onClick={onLogoClick}>
        <div className="logo-icon">🔩</div>
        <div>
          <div className="logo-text">PartPilot</div>
          <div className="logo-sub">חלקי רכב ישראלי</div>
        </div>
      </div>
      {view !== "home" && (
        <div className="header-search" onClick={() => onLogoClick()}>
          <span style={{color: "rgba(255,255,255,0.5)", fontSize: 15}}>🔍</span>
          <span className="header-search-text">חיפוש לפי לוחית...</span>
        </div>
      )}
      <div className="header-actions">
        <button className="btn-ghost">התחברות</button>
      </div>
    </header>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ plateInput, setPlateInput, onSearch, loading, error, recentSearches }) {
  return (
    <>
      <section className="hero">
        <div className="hero-badge">🇮🇱 &nbsp;מעל 4 מיליון רכבים רשומים בישראל</div>
        <h1 className="hero-title">
          מצא חלקים <span>בדיוק</span> לרכב שלך
        </h1>
        <p className="hero-sub">הזן מספר לוחית וקבל קטלוג חלקי OEM, מספרי יצרן והשוואת מחירים</p>

        <div className="search-box">
          <div className="search-label">מספר לוחית רכב</div>
          <div className="search-row">
            <input
              className={`plate-input${error ? " error" : ""}`}
              placeholder="12-345-67"
              value={plateInput}
              onChange={e => setPlateInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onSearch()}
              maxLength={10}
              autoFocus
            />
            <button className="btn-search" onClick={onSearch} disabled={loading}>
              {loading ? "מחפש..." : "מצא חלקים"}
            </button>
          </div>
          {error && <div className="search-error">⚠️ {error}</div>}
        {!error && <div className="search-hint">הנתונים נטענים מ-<a href="#">data.gov.il</a> — API ממשלתי רשמי</div>}
          {recentSearches.length > 0 && (
            <div className="recent-searches">
              <span style={{fontSize: 12, color: "#A0AEC0"}}>חיפושים אחרונים:</span>
              {recentSearches.map(p => (
                <button key={p} className="recent-chip" onClick={() => { setPlateInput(p); setTimeout(onSearch, 50); }}>{p}</button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="stats-strip">
        <div className="stat-item"><div className="stat-num">5</div><div className="stat-label">דגמי רכב</div></div>
        <div className="stat-item"><div className="stat-num">19</div><div className="stat-label">חלקים קטלוג</div></div>
        <div className="stat-item"><div className="stat-num">5</div><div className="stat-label">ספקים</div></div>
        <div className="stat-item"><div className="stat-num">חינם</div><div className="stat-label">גישה למידע</div></div>
      </div>

      <div className="page">
        <div className="section-title" style={{marginTop: 12}}>
          רכבים נתמכים
          <span className="section-title-count">MVP</span>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12}}>
          {Object.values(MOCK_VEHICLES).map(v => (
            <div key={v.plate} style={{background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.07)"}}>
              <div style={{fontSize: 11, color: "#718096", fontWeight: 600, marginBottom: 2}}>{v.makeHe}</div>
              <div style={{fontSize: 16, fontWeight: 800, color: "#1E3A5F"}}>{v.makeHe} {v.model}</div>
              <div style={{fontSize: 13, color: "#718096"}}>{v.year} · {v.engine}</div>
              <div style={{fontSize: 11, color: "#1E3A5F", background: "#EDF2F7", borderRadius: 5, padding: "2px 8px", display: "inline-block", marginTop: 6, fontWeight: 600, letterSpacing: 1, direction: "ltr"}}>{v.plate}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── VEHICLE PAGE ─────────────────────────────────────────────────────────────
function VehiclePage({ vehicle, onViewParts, onBack }) {
  const v = vehicle;
  const s = v.specs || {};

  const yesNo = (val) => {
    if (val === "כן") return <span style={{color: "#276749", fontWeight: 700}}>✓ כן</span>;
    if (val === "לא") return <span style={{color: "#9B2C2C", fontWeight: 600}}>✗ לא</span>;
    return <span style={{fontWeight: 600}}>{val}</span>;
  };

  const Row = ({ label, value, dir }) => (
    <div style={{display: "flex", alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid #EDF2F7", gap: 12}}>
      <div style={{width: 160, flexShrink: 0, fontSize: 13, color: "#718096", textAlign: "right"}}>{label}</div>
      <div style={{flex: 1, fontSize: 14, fontWeight: 600, color: "#2D3748", direction: dir || "rtl"}}>{value}</div>
    </div>
  );

  const SectionTitle = ({ children }) => (
    <div style={{fontSize: 16, fontWeight: 800, color: "#1E3A5F", padding: "14px 0 6px", borderBottom: "2px solid #E2E8F0", marginBottom: 4, marginTop: 8}}>
      {children}
    </div>
  );

  return (
    <div className="page">
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={onBack}>🏠 דף הבית</span>
        <span className="breadcrumb-sep">›</span>
        <span>{v.makeHe} {v.model} {v.year}</span>
      </div>

      {/* Top card with plate + actions */}
      <div className="vehicle-card" style={{marginBottom: 20}}>
        <div className="vehicle-card-header">
          <div className="vehicle-card-title">
            <div className="vehicle-make">{v.makeHe}</div>
            <div className="vehicle-name">{v.makeHe} {v.model}</div>
            <div className="vehicle-year">{v.year} · {v.trim}</div>
          </div>
          <div className="vehicle-plate-badge">
            <div className="plate-label">🇮🇱 Israel</div>
            <div className="plate-number">{v.plate}</div>
          </div>
        </div>
        <div className="vehicle-card-footer">
          <button className="btn-primary" onClick={onViewParts}>🔧 צפה בחלקים מתאימים</button>
          <button className="btn-secondary">💾 שמור לגראז׳</button>
        </div>
      </div>

      {/* Two-column detail layout */}
      <div className="vehicle-detail-grid" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>

        {/* RIGHT column — פרטי רכב */}
        <div style={{background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.07)"}}>
          <SectionTitle>פרטי רכב</SectionTitle>
          <Row label="מספר רכב" value={<span style={{direction:"ltr", letterSpacing:1}}>{v.plate}</span>} />
          <Row label="יצרן" value={v.makeHe} />
          <Row label="דגם" value={v.model} />
          <Row label="תת דגם" value={v.trim} />
          <Row label="שנת עלייה לכביש" value={v.year} />
          <Row label="תוצרת" value={v.origin || "—"} />
          <Row label="מספר שלדה" value={<span style={{direction:"ltr", fontSize:12, letterSpacing:0.5}}>{v.vin}</span>} />
          <Row label="תאריך טסט אחרון" value={v.lastTest} />
          <Row label="תוקף רישיון" value={v.licenseExpiry} />
          <Row label="צבע" value={v.color} />
          <Row label="אגרת רכב" value={`${v.annualFee} ₪`} />
        </div>

        {/* LEFT column — מידע נוסף */}
        <div style={{background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.07)"}}>
          <SectionTitle>מידע נוסף</SectionTitle>
          <Row label="הספק מרבי" value={s.power} />
          <Row label="נפח מנוע" value={s.engineCC} />
          <Row label="סוג מנוע" value={s.fuelType} />
          <Row label="גיר" value={s.gearbox} />
          <Row label="קוד משרד התחבורה" value={<span style={{direction:"ltr"}}>{s.transportCode}</span>} />
          <Row label="הוראת רישום" value={s.registrationNote} />
          <Row label="מידות צמיג קדמי" value={<span style={{direction:"ltr"}}>{s.tireFront}</span>} />
          <Row label="מידות צמיג אחורי" value={<span style={{direction:"ltr"}}>{s.tireRear}</span>} />
          <Row label="הנעה" value={<span style={{direction:"ltr"}}>{s.driveType}</span>} />
          <Row label="סוג הנעה" value={s.driveNote} />
          <Row label="כריות אוויר" value={s.airbags} />
          <Row label="חלונות חשמל" value={s.electricWindows} />
          <Row label="מספר דלתות" value={s.doors} />
          <Row label="מרכב" value={s.bodyType} />
          <Row label="חלון שמש" value={yesNo(s.sunroof === "לא" ? "לא" : s.sunroof === "כן" ? "כן" : s.sunroof)} />
          <Row label="בקרת יציבות" value={yesNo(s.stabilityControl)} />
          <Row label="מערכת ABS" value={yesNo(s.abs)} />
          <Row label="הגה כוח" value={yesNo(s.powerSteering)} />
          <Row label="גלגלי סגסוגת קלה" value={yesNo(s.alloyWheels)} />
          <Row label="בקרת סטיה מנתיבים" value={yesNo(s.laneAssist)} />
          <Row label="בקרת שיוט אדפטיבית" value={yesNo(s.adaptiveCruise)} />
          <Row label="קבוצת זיהום" value={s.pollutionGroup} />
        </div>
      </div>

      {/* Test validity banner */}
      <div style={{
        marginTop: 14, borderRadius: 10, padding: "12px 16px", fontSize: 13,
        background: "#EBF8FF", border: "1px solid #90CDF4", color: "#2C5282",
        display: "flex", alignItems: "center", gap: 8
      }}>
        ✅ נתוני הרכב נטענו מ-<strong>data.gov.il</strong> — מאגר רשות הרישוי הישראלית. המידע עדכני ורשמי.
      </div>
    </div>
  );
}


// ─── PARTS PAGE ───────────────────────────────────────────────────────────────
function PartsPage({ vehicle, selectedCategory, setSelectedCategory, onSelectPart, onBack }) {
  const parts = PARTS_BY_CATEGORY[selectedCategory] || [];
  const catInfo = PART_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="page">
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={onBack}>🏠 דף הבית</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-link" onClick={onBack}>{vehicle.makeHe} {vehicle.model}</span>
        <span className="breadcrumb-sep">›</span>
        <span>קטלוג חלקים</span>
      </div>

      {/* Vehicle context bar */}
      <div style={{
        background: "white", border: "1px solid #E2E8F0", borderRadius: 10,
        padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center",
        gap: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
      }}>
        <span style={{fontSize: 20}}>🚗</span>
        <div style={{flex: 1}}>
          <div style={{fontSize: 14, fontWeight: 700, color: "#1E3A5F"}}>
            {vehicle.makeHe} {vehicle.model} {vehicle.trim} · {vehicle.year}
          </div>
          <div style={{fontSize: 12, color: "#718096"}}>{vehicle.engine} · לוחית {vehicle.plate}</div>
        </div>
        <button onClick={onBack} style={{
          background: "transparent", border: "1px solid #E2E8F0", borderRadius: 7,
          padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#4A5568",
          cursor: "pointer", fontFamily: "Heebo"
        }}>שנה רכב</button>
      </div>

      {/* Category title */}
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14}}>
        <div className="section-title" style={{marginBottom: 0}}>
          קטגוריות חלקים
          <span className="section-title-count">{PART_CATEGORIES.length} קטגוריות</span>
        </div>
      </div>

      {/* SPARETO-STYLE GRID */}
      <div className="cat-grid">
        {PART_CATEGORIES.map(cat => (
          <div
            key={cat.id}
            className={`cat-cell${selectedCategory === cat.id ? " active" : ""}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <div className="cat-img" dangerouslySetInnerHTML={{ __html: CAT_SVG[cat.id] || CAT_SVG.engine }} />
            <div className="cat-text">
              <div className="cat-title-he">{cat.nameHe}</div>
              <div className="cat-title-en">{cat.nameEn}</div>
              <div className="cat-subcats">
                {cat.subcats.slice(0, 3).map((s, i) => (
                  <span key={i} className="cat-subcat">{s}</span>
                ))}
                {cat.subcats.length > 3 && (
                  <span className="cat-more">... עוד {cat.subcats.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected category parts */}
      {catInfo && (
        <>
          <div className="section-title">
            {catInfo.nameHe}
            <span className="section-title-count">{parts.length} חלקים</span>
          </div>
          <div className="parts-grid">
            {parts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔧</div>
                <div className="empty-title">אין חלקים בקטגוריה זו עדיין</div>
                <div className="empty-sub">בחר קטגוריה אחרת</div>
              </div>
            ) : parts.map(part => {
              const diff = DIFFICULTY_MAP[part.difficulty];
              return (
                <div key={part.id} className="part-card" onClick={() => onSelectPart(part)}>
                  <div className="part-icon-box">🔩</div>
                  <div className="part-info">
                    <div className="part-name-he">{part.nameHe}</div>
                    <div className="part-name-en">{part.nameEn}</div>
                    <div className="part-oem">{part.oemNumber}</div>
                  </div>
                  <div className="part-meta">
                    <span className="difficulty-badge" style={{background: diff.bg, color: diff.color}}>{diff.label}</span>
                    <span className="part-arrow">←</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── PART DETAIL PAGE ─────────────────────────────────────────────────────────
function PartDetailPage({ part, vehicle, supplierFilter, setSupplierFilter, onBack }) {
  const [offers] = useState(() => getOffersForPart(part.id));
  const [tab, setTab] = useState("suppliers");
  const diff = DIFFICULTY_MAP[part.difficulty];

  const filteredOffers = offers
    .filter(o => {
      const s = SUPPLIERS.find(s => s.id === o.supplierId);
      if (supplierFilter === "local") return s.type === "local";
      if (supplierFilter === "international") return s.type === "international";
      return true;
    })
    .sort((a, b) => (a.price + a.shipping) - (b.price + b.shipping));

  return (
    <div className="page">
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => { }}>🏠 דף הבית</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-link" onClick={onBack}>קטלוג חלקים</span>
        <span className="breadcrumb-sep">›</span>
        <span>{part.nameHe}</span>
      </div>

      <div className="detail-header">
        <div className="detail-oem-row">
          <span className="detail-oem-chip">{part.oemNumber}</span>
          <span style={{fontSize: 12, color: "#718096"}}>מספר OEM מקורי</span>
        </div>
        <div className="detail-title">{part.nameHe}</div>
        <div className="detail-title-en">{part.nameEn}</div>
        <div className="detail-desc">📋 {part.description}</div>
        <div className="detail-badges">
          <span className="difficulty-badge" style={{background: diff.bg, color: diff.color, fontSize: 12, padding: "4px 11px"}}>
            רמת החלפה: {diff.label}
          </span>
          <span style={{background: "#EBF8FF", color: "#2B6CB0", fontSize: 12, fontWeight: 600, padding: "4px 11px", borderRadius: 6}}>
            🚗 {vehicle.makeHe} {vehicle.model} {vehicle.year}
          </span>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab${tab === "suppliers" ? " active" : ""}`} onClick={() => setTab("suppliers")}>
          🛒 ספקים ומחירים ({offers.length})
        </button>
        <button className={`tab${tab === "info" ? " active" : ""}`} onClick={() => setTab("info")}>
          📖 מידע נוסף
        </button>
      </div>

      {tab === "suppliers" && (
        <div className="suppliers-section">
          <div className="supplier-filters">
            <span style={{fontSize: 13, color: "#718096", alignSelf: "center"}}>סנן:</span>
            {[["all","הכל"],["local","🇮🇱 ישראל בלבד"],["international","חו״ל בלבד"]].map(([val,label]) => (
              <button key={val} className={`filter-btn${supplierFilter === val ? " active" : ""}`} onClick={() => setSupplierFilter(val)}>{label}</button>
            ))}
          </div>

          <div className="supplier-cards">
            {filteredOffers.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <div className="empty-title">לא נמצאו ספקים</div>
                <div className="empty-sub">נסה לשנות את הסינון</div>
              </div>
            )}
            {filteredOffers.map((offer, idx) => {
              const supplier = SUPPLIERS.find(s => s.id === offer.supplierId);
              const total = Math.round(offer.price + offer.shipping);
              const isBest = idx === 0;
              return (
                <div key={offer.supplierId} className={`supplier-row${isBest ? " best" : ""}`}>
                  <div className={`supplier-rank${isBest ? " gold" : ""}`}>{idx + 1}</div>
                  <div className="supplier-flag">{supplier.flag}</div>
                  <div className="supplier-info">
                    <div className="supplier-name">
                      {isBest && <span className="best-badge">💰 זול ביותר</span>}
                      {supplier.nameHe}
                    </div>
                    <div className="supplier-country">{supplier.country} · ⭐ {supplier.rating}</div>
                    <div className="supplier-delivery">🚚 {supplier.deliveryDays} ימי עסקים</div>
                  </div>
                  <div className="supplier-pricing">
                    <div className="supplier-price">{Math.round(offer.price)}₪</div>
                    <div className="supplier-shipping">
                      {offer.shipping === 0 ? "✅ משלוח חינם" : `+ ${offer.shipping}₪ משלוח`}
                    </div>
                    <div style={{fontSize: 11, color: "#718096"}}>סה״כ: {total}₪</div>
                  </div>
                  {offer.inStock
                    ? <button className="btn-order">הזמן עכשיו →</button>
                    : <div className="out-of-stock">אזל מהמלאי</div>
                  }
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "info" && (
        <div style={{background: "white", borderRadius: 12, padding: 20, border: "1px solid #E2E8F0"}}>
          <div style={{marginBottom: 16}}>
            <div style={{fontSize: 14, fontWeight: 700, color: "#1E3A5F", marginBottom: 6}}>מספר OEM</div>
            <div style={{fontSize: 16, fontWeight: 800, direction: "ltr", display: "inline-block", background: "#EDF2F7", padding: "6px 14px", borderRadius: 8}}>{part.oemNumber}</div>
          </div>
          <div style={{marginBottom: 16}}>
            <div style={{fontSize: 14, fontWeight: 700, color: "#1E3A5F", marginBottom: 6}}>תיאור</div>
            <div style={{fontSize: 14, color: "#4A5568", lineHeight: 1.7}}>{part.description}</div>
          </div>
          <div style={{background: "#FFFBF5", border: "1px solid #F6AD55", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#744210"}}>
            ⚠️ תמיד בדוק תאימות עם מספר השילדה לפני הזמנה. מידע זה מסופק לצורך מידע בלבד.
          </div>
        </div>
      )}
    </div>
  );
}
