/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RationShop, Product } from '../types';
import { INITIAL_PRODUCTS, MOCK_SHOPS } from '../constants';
import { OFFICIAL_SHOPS_SAMPLE } from '../data/officialShopsData';

export interface DistrictInfo {
  name: string;
  code: string;
  count: number;
  center: { lat: number; lng: number };
  pincodeBase: string;
  phoneCode: string;
  localities: string[];
}

export const TN_DISTRICTS: DistrictInfo[] = [
  {
    name: 'Chennai',
    code: 'CHN',
    count: 1826,
    center: { lat: 13.0827, lng: 80.2707 },
    pincodeBase: '6000',
    phoneCode: '044',
    localities: ['T. Nagar', 'Mylapore', 'Anna Nagar', 'Adyar', 'Velachery', 'Guindy', 'Royapettah', 'Tambaram', 'Perambur', 'Saidapet', 'Triplicane', 'Kilpauk', 'Kodambakkam', 'Thiruvanmiyur', 'Porur', 'Alwarpet', 'Nungambakkam', 'Vadapalani', 'Ambattur', 'Besant Nagar']
  },
  {
    name: 'Coimbatore',
    code: 'CBE',
    count: 1426,
    center: { lat: 11.0168, lng: 76.9558 },
    pincodeBase: '6410',
    phoneCode: '0422',
    localities: ['Gandhipuram', 'RS Puram', 'Peelamedu', 'Town Hall', 'Singanallur', 'Saibaba Colony', 'Ramanathapuram', 'Ganapathy', 'Saravanampatti', 'Kuniyamuthur', 'Ukkadam', 'Thudiyalur', 'Vadavalli', 'Sulur', 'Pollachi Town']
  },
  {
    name: 'Madurai',
    code: 'MDU',
    count: 1357,
    center: { lat: 9.9252, lng: 78.1198 },
    pincodeBase: '6250',
    phoneCode: '0452',
    localities: ['West Masi Street', 'Simmakkal', 'Goripalayam', 'Mattuthavani', 'KK Nagar', 'Anna Nagar', 'Alagappan Nagar', 'Teppakulam', 'Tallakulam', 'Thirunagar', 'Villapuram', 'Sellur', 'Tirumangalam', 'Melur']
  },
  {
    name: 'Salem',
    code: 'SLM',
    count: 1357,
    center: { lat: 11.6643, lng: 78.1460 },
    pincodeBase: '6360',
    phoneCode: '0427',
    localities: ['Shevapet', 'Hasthampatti', 'Four Roads', 'Suramangalam', 'Ammapet', 'Alagapuram', 'Fairlands', 'Junction', 'Kandhampatti', 'Attur', 'Mettur Town', 'Edappadi']
  },
  {
    name: 'Cuddalore',
    code: 'CUD',
    count: 1326,
    center: { lat: 11.7480, lng: 79.7714 },
    pincodeBase: '6070',
    phoneCode: '04142',
    localities: ['Cuddalore OT', 'Chidambaram Town', 'Panruti', 'Virudhachalam', 'Neyveli Township', 'Kattumannarkoil', 'Tittakudi', 'Kurinjipadi']
  },
  {
    name: 'Tiruvannamalai',
    code: 'TVM',
    count: 1297,
    center: { lat: 12.2253, lng: 79.0747 },
    pincodeBase: '6066',
    phoneCode: '04175',
    localities: ['Temple Car Street', 'Polur Road', 'Arani Town', 'Cheyyar', 'Vandavasi', 'Chengam', 'Kalasapakkam', 'Kilpennathur']
  },
  {
    name: 'Tiruchirappalli',
    code: 'TRY',
    count: 1197,
    center: { lat: 10.7905, lng: 78.7047 },
    pincodeBase: '6200',
    phoneCode: '0431',
    localities: ['Srirangam', 'Cantonment', 'Thillai Nagar', 'K.K. Nagar', 'Ponmalai', 'Palakarai', 'Lalgudi', 'Manapparai', 'Thuvakudi', 'Woraiyur']
  },
  {
    name: 'Erode',
    code: 'ERD',
    count: 1157,
    center: { lat: 11.3410, lng: 77.7172 },
    pincodeBase: '6380',
    phoneCode: '0424',
    localities: ['Brough Road', 'Perundurai', 'Gobichettipalayam', 'Bhavani', 'Sathyamangalam', 'Modakurichi', 'Surampatti', 'Kasipalayam']
  },
  {
    name: 'Tiruvallur',
    code: 'TLR',
    count: 1157,
    center: { lat: 13.1432, lng: 79.9083 },
    pincodeBase: '6020',
    phoneCode: '044',
    localities: ['Tiruvallur Town', 'Avadi', 'Poonamallee', 'Tiruttani', 'Gummidipoondi', 'Ponneri', 'Uthukottai', 'Thiruvalangadu']
  },
  {
    name: 'Viluppuram',
    code: 'VPM',
    count: 1127,
    center: { lat: 11.9401, lng: 79.4861 },
    pincodeBase: '6056',
    phoneCode: '04146',
    localities: ['Viluppuram Junction', 'Tindivanam', 'Gingee Town', 'Marakkanam', 'Vanur', 'Vikravandi', 'Valavanur']
  },
  {
    name: 'Thanjavur',
    code: 'TNJ',
    count: 1097,
    center: { lat: 10.7870, lng: 79.1378 },
    pincodeBase: '6130',
    phoneCode: '04362',
    localities: ['South Rampart', 'Kumbakonam Town', 'Pattukkottai', 'Papanasam', 'Orathanadu', 'Thiruvaiyaru', 'Peravurani', 'Budalur']
  },
  {
    name: 'Krishnagiri',
    code: 'KGI',
    count: 1057,
    center: { lat: 12.5186, lng: 78.2137 },
    pincodeBase: '6350',
    phoneCode: '04343',
    localities: ['Krishnagiri Town', 'Hosur Main Road', 'Bargur', 'Pochampalli', 'Uthangarai', 'Denkanikottai', 'Shoolagiri', 'Kelamangalam']
  },
  {
    name: 'Tiruppur',
    code: 'TPR',
    count: 1037,
    center: { lat: 11.1085, lng: 77.3411 },
    pincodeBase: '6416',
    phoneCode: '0421',
    localities: ['Kumaran Road', 'Avinashi', 'Dharapuram', 'Udumalaipettai', 'Kangeyam', 'Palladam', 'Madathukulam', 'Vellakoil']
  },
  {
    name: 'Dindigul',
    code: 'DGL',
    count: 1017,
    center: { lat: 10.3673, lng: 77.9803 },
    pincodeBase: '6240',
    phoneCode: '0451',
    localities: ['Rock Fort Area', 'Palani Town', 'Kodaikanal', 'Oddanchatram', 'Natham', 'Nilakottai', 'Vedasandur', 'Batlagundu']
  },
  {
    name: 'Pudukkottai',
    code: 'PDK',
    count: 957,
    center: { lat: 10.3797, lng: 78.8208 },
    pincodeBase: '6220',
    phoneCode: '04322',
    localities: ['Palace Road', 'Aranthangi', 'Alangudi', 'Illuppur', 'Thirumayam', 'Gandarvakottai', 'Ponnamaravathi', 'Avudaiyarkoil']
  },
  {
    name: 'Tirunelveli',
    code: 'TNV',
    count: 957,
    center: { lat: 8.7139, lng: 77.7567 },
    pincodeBase: '6270',
    phoneCode: '0462',
    localities: ['Palayamkottai', 'Junction', 'Town Market', 'Ambasamudram', 'Nanguneri', 'Cheranmahadevi', 'Radhapuram', 'Valliyur']
  },
  {
    name: 'Dharmapuri',
    code: 'DPI',
    count: 936,
    center: { lat: 12.1211, lng: 78.1582 },
    pincodeBase: '6367',
    phoneCode: '04342',
    localities: ['Dharmapuri Bazaar', 'Harur', 'Palacode', 'Pennagaram', 'Karimangalam', 'Pappireddipatti', 'Morappur']
  },
  {
    name: 'Chengalpattu',
    code: 'CGL',
    count: 926,
    center: { lat: 12.6939, lng: 79.9757 },
    pincodeBase: '6030',
    phoneCode: '044',
    localities: ['Chengalpattu Bazaar', 'Tambaram South', 'Pallavaram', 'Madurantakam', 'Cheyyur', 'Tirukalukundram', 'Kelambakkam', 'Mahabalipuram']
  },
  {
    name: 'Vellore',
    code: 'VEL',
    count: 897,
    center: { lat: 12.9165, lng: 79.1325 },
    pincodeBase: '6320',
    phoneCode: '0416',
    localities: ['Fort Round', 'Katpadi', 'Sathuvachari', 'Gudiyattam', 'Anaicut', 'Konavattam', 'Bagayam', 'Thorapadi']
  },
  {
    name: 'Kanchipuram',
    code: 'KPM',
    count: 867,
    center: { lat: 12.8342, lng: 79.7036 },
    pincodeBase: '6315',
    phoneCode: '044',
    localities: ['Silk Weavers Quarter', 'Sriperumbudur', 'Uthiramerur', 'Walajabad', 'Kundrathur', 'Pillayarpalayam']
  },
  {
    name: 'Thoothukudi',
    code: 'TKD',
    count: 857,
    center: { lat: 8.7642, lng: 78.1348 },
    pincodeBase: '6280',
    phoneCode: '0461',
    localities: ['Pearl City Port', 'Kovilpatti', 'Tiruchendur', 'Srivaikuntam', 'Ottapidaram', 'Ettayapuram', 'Sathankulam']
  },
  {
    name: 'Virudhunagar',
    code: 'VNR',
    count: 852,
    center: { lat: 9.5680, lng: 77.9624 },
    pincodeBase: '6260',
    phoneCode: '04562',
    localities: ['Virudhunagar Main', 'Sivakasi Town', 'Rajapalayam', 'Aruppukkottai', 'Sattur', 'Srivilliputhur', 'Watrap']
  },
  {
    name: 'Kallakurichi',
    code: 'KLK',
    count: 847,
    center: { lat: 11.7384, lng: 78.9639 },
    pincodeBase: '6062',
    phoneCode: '04151',
    localities: ['Kallakurichi Bus Stand', 'Sankarapuram', 'Tirukkoyilur', 'Ulundurpet', 'Chinnasalem', 'Kalvarayan Hills']
  },
  {
    name: 'Namakkal',
    code: 'NMK',
    count: 847,
    center: { lat: 11.2189, lng: 78.1674 },
    pincodeBase: '6370',
    phoneCode: '04286',
    localities: ['Anjaneyar Kovil St', 'Tiruchengode', 'Rasipuram', 'Paramathi Velur', 'Kolli Hills', 'Sendamangalam', 'Mohanur']
  },
  {
    name: 'Ramanathapuram',
    code: 'RMD',
    count: 817,
    center: { lat: 9.3639, lng: 78.8395 },
    pincodeBase: '6235',
    phoneCode: '04567',
    localities: ['Ramanathapuram Palace', 'Rameswaram Island', 'Paramakudi', 'Tiruvadanai', 'Mudukulathur', 'Kadaladi', 'Kilakarai']
  },
  {
    name: 'Kanniyakumari',
    code: 'KKI',
    count: 797,
    center: { lat: 8.0883, lng: 77.5385 },
    pincodeBase: '6290',
    phoneCode: '04652',
    localities: ['Nagercoil Town', 'Kanyakumari Beach', 'Thuckalay', 'Kuzhithurai', 'Padmanabhapuram', 'Colachel', 'Killiyoor']
  },
  {
    name: 'Sivaganga',
    code: 'SVG',
    count: 797,
    center: { lat: 9.8433, lng: 78.4809 },
    pincodeBase: '6305',
    phoneCode: '04575',
    localities: ['Sivaganga Palace', 'Karaikudi Chettinad', 'Devakottai', 'Manamadurai', 'Tiruppattur', 'Ilayangudi', 'Kalayarkovil']
  },
  {
    name: 'Tenkasi',
    code: 'TSI',
    count: 697,
    center: { lat: 8.9594, lng: 77.3152 },
    pincodeBase: '6278',
    phoneCode: '04633',
    localities: ['Kasi Viswanathar St', 'Courtallam Falls', 'Sankarankovil', 'Kadayanallur', 'Shenkottai', 'Alangulam', 'Puliyangudi']
  },
  {
    name: 'Tiruvarur',
    code: 'TVR',
    count: 697,
    center: { lat: 10.7725, lng: 79.6365 },
    pincodeBase: '6100',
    phoneCode: '04366',
    localities: ['Thyagaraja Car St', 'Mannargudi', 'Thiruthuraipoondi', 'Nannilam', 'Kudavasal', 'Valangaiman', 'Needamangalam']
  },
  {
    name: 'Tirupattur',
    code: 'TPT',
    count: 667,
    center: { lat: 12.4925, lng: 78.5678 },
    pincodeBase: '6356',
    phoneCode: '04179',
    localities: ['Tirupattur Bazaar', 'Vaniyambadi', 'Ambur Leather Hub', 'Natrampalli', 'Yelagiri Hills']
  },
  {
    name: 'Karur',
    code: 'KRR',
    count: 627,
    center: { lat: 10.9601, lng: 78.0766 },
    pincodeBase: '6390',
    phoneCode: '04324',
    localities: ['Textile Bazaar', 'Kulithalai', 'Aravakurichi', 'Krishnarayapuram', 'Pugalur', 'Manmangalam']
  },
  {
    name: 'Ranipet',
    code: 'RPT',
    count: 617,
    center: { lat: 12.9272, lng: 79.3330 },
    pincodeBase: '6324',
    phoneCode: '04172',
    localities: ['Ranipet Industrial', 'Walajapet', 'Arcot Town', 'Arakkonam Junction', 'Nemili', 'Sholinghur']
  },
  {
    name: 'Theni',
    code: 'THN',
    count: 597,
    center: { lat: 10.0104, lng: 77.4768 },
    pincodeBase: '6255',
    phoneCode: '04546',
    localities: ['Theni Main Road', 'Periyakulam', 'Bodinayakanur Cardamom Hub', 'Uthamapalayam', 'Cumbum Valley', 'Andipatti']
  },
  {
    name: 'Nagapattinam',
    code: 'NGP',
    count: 557,
    center: { lat: 10.7672, lng: 79.8449 },
    pincodeBase: '6110',
    phoneCode: '04365',
    localities: ['Nagore Dargah Road', 'Velankanni Shrine', 'Kilvelur', 'Vedaranyam Salt Flats', 'Thirukkuvalai']
  },
  {
    name: 'Mayiladuthurai',
    code: 'MYD',
    count: 497,
    center: { lat: 11.1075, lng: 79.6524 },
    pincodeBase: '6090',
    phoneCode: '04364',
    localities: ['Cauvery Banks', 'Sirkazhi Town', 'Tharangambadi Danish Fort', 'Kuthalam', 'Poompuhar Port']
  },
  {
    name: 'Ariyalur',
    code: 'ARI',
    count: 456,
    center: { lat: 11.1401, lng: 79.0786 },
    pincodeBase: '6217',
    phoneCode: '04329',
    localities: ['Ariyalur Cement Hub', 'Udayarpalayam Palace', 'Sendurai', 'Jayankondam Gangaikonda Cholapuram', 'Andimadam']
  },
  {
    name: 'Nilgiris',
    code: 'NLG',
    count: 367,
    center: { lat: 11.4102, lng: 76.6950 },
    pincodeBase: '6430',
    phoneCode: '0423',
    localities: ['Udhagamandalam Ooty', 'Coonoor Tea Estates', 'Kotagiri', 'Gudalur', 'Kundah', 'Pandalur']
  },
  {
    name: 'Perambalur',
    code: 'PBL',
    count: 367,
    center: { lat: 11.2342, lng: 78.8820 },
    pincodeBase: '6212',
    phoneCode: '04328',
    localities: ['Perambalur Four Roads', 'Kunnam', 'Veppanthattai', 'Alathur', 'Chettikulam']
  }
];

export const TOTAL_SHOPS_COUNT = TN_DISTRICTS.reduce((sum, d) => sum + d.count, 0); // Exactly 34,935

// Deterministic fast pseudo-random number generator
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate the complete master index of 34,935 Tamil Nadu Fair Price Shops
let cachedAllShops: RationShop[] | null = null;

export function getAllRationShops(): RationShop[] {
  if (cachedAllShops) {
    return cachedAllShops;
  }

  const shops: RationShop[] = [];

  // Include existing mock shops at the top
  MOCK_SHOPS.forEach(shop => shops.push(shop));

  // Include verified official TNCSC Fair Price Shops with real GPS coordinates
  OFFICIAL_SHOPS_SAMPLE.forEach(s => {
    shops.push({
      id: `tncsc_${s.code.toLowerCase()}_${s.sno}`,
      name: `${s.name} (${s.code})`,
      code: s.code,
      address: `${s.address}, ${s.taluk} Taluk, ${s.region} Region, Tamil Nadu`,
      pincode: '600001',
      phone: '044-28330000',
      openingTime: s.category === 'Part Time' ? '09:00' : '08:30',
      closingTime: s.category === 'Part Time' ? '13:00' : '17:30',
      lunchStart: '13:00',
      lunchEnd: '14:00',
      latitude: s.lat,
      longitude: s.lng,
      products: [...INITIAL_PRODUCTS]
    });
  });

  let seed = 42;

  TN_DISTRICTS.forEach((district) => {
    // Generate (count) shops spread naturally around the district's center
    const targetCount = district.name === 'Chennai' 
      ? district.count - 2 // account for mock shops
      : district.name === 'Madurai' || district.name === 'Coimbatore'
      ? district.count - 1
      : district.count;

    for (let i = 1; i <= targetCount; i++) {
      const locality = district.localities[(i - 1) % district.localities.length];
      const shopNumber = 100 + i;
      const code = `${district.code}-${String(shopNumber).padStart(4, '0')}`;
      
      // Radius distribution: 70% in urban/suburban cluster, 30% wider rural coverage
      const isRural = seededRandom(seed++) > 0.7;
      const maxOffset = isRural ? 0.28 : 0.08;
      const angle = seededRandom(seed++) * 2 * Math.PI;
      const dist = Math.sqrt(seededRandom(seed++)) * maxOffset;

      const latitude = Number((district.center.lat + dist * Math.cos(angle)).toFixed(6));
      const longitude = Number((district.center.lng + dist * Math.sin(angle) * 1.05).toFixed(6));

      // Diversify open hours slightly based on location
      const openHour = i % 5 === 0 ? '08:30' : '09:00';
      const closeHour = i % 5 === 0 ? '17:30' : '18:00';

      const products: Product[] = INITIAL_PRODUCTS.map((p, idx) => ({
        ...p,
        stock: Math.floor(seededRandom(seed + idx * 10) * 1200) + 50
      }));

      shops.push({
        id: `tnpds_${district.code.toLowerCase()}_${i}`,
        name: `FPS #${code} - ${locality}`,
        code: code,
        address: `No. ${i * 3 + 12}, Main Road, ${locality}, ${district.name} District, Tamil Nadu`,
        pincode: `${district.pincodeBase}${String(10 + (i % 80)).padStart(2, '0')}`,
        phone: `${district.phoneCode}-${String(2400000 + (i * 17) % 899999)}`,
        openingTime: openHour,
        closingTime: closeHour,
        lunchStart: '13:00',
        lunchEnd: '14:00',
        latitude,
        longitude,
        products
      });
    }
  });

  cachedAllShops = shops;
  return shops;
}
