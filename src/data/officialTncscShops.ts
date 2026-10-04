/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Official TNCSC (Tamil Nadu Civil Supplies Corporation / தமிழ்நாடு நுகர்பொருள் வாணிபக் கழகம்)
 * Fair Price Shops Geo-Directory with verified coordinates from tncsc.tn.gov.in
 */

export interface OfficialTncscShop {
  sno: number;
  region: string;
  taluk: string;
  address: string;
  name: string;
  code: string;
  areaType: 'Urban' | 'Rural';
  category: 'Full Time' | 'Part Time';
  lat: number;
  lng: number;
}

export const OFFICIAL_TNCSC_REGIONS_SUMMARY = [
  { sno: 1, region: 'அரியலூர் (Ariyalur)', partTime: 2, fullTime: 0, total: 2, refugee: 0, grandTotal: 2 },
  { sno: 2, region: 'செங்கல்பட்டு (Chengalpattu)', partTime: 2, fullTime: 0, total: 2, refugee: 0, grandTotal: 2 },
  { sno: 3, region: 'சென்னை வடக்கு (North Chennai)', partTime: 335, fullTime: 0, total: 335, refugee: 0, grandTotal: 335 },
  { sno: 4, region: 'சென்னை தெற்கு (South Chennai)', partTime: 145, fullTime: 0, total: 145, refugee: 0, grandTotal: 145 },
  { sno: 5, region: 'கோயம்புத்தூர் (Coimbatore)', partTime: 55, fullTime: 0, total: 55, refugee: 0, grandTotal: 55 },
  { sno: 6, region: 'கடலூர் (Cuddalore)', partTime: 0, fullTime: 0, total: 0, refugee: 0, grandTotal: 0 },
  { sno: 7, region: 'தர்மபுரி (Dharmapuri)', partTime: 32, fullTime: 12, total: 44, refugee: 0, grandTotal: 44 },
  { sno: 8, region: 'திண்டுக்கல் (Dindigul)', partTime: 19, fullTime: 0, total: 19, refugee: 0, grandTotal: 19 },
  { sno: 9, region: 'ஈரோடு (Erode)', partTime: 14, fullTime: 1, total: 15, refugee: 1, grandTotal: 16 },
  { sno: 10, region: 'கள்ளக்குறிச்சி (Kallakurichi)', partTime: 0, fullTime: 0, total: 0, refugee: 0, grandTotal: 0 },
  { sno: 11, region: 'காஞ்சிபுரம் (Kancheepuram)', partTime: 32, fullTime: 0, total: 32, refugee: 0, grandTotal: 32 },
  { sno: 12, region: 'கன்னியாகுமரி (Kanniyakumari)', partTime: 103, fullTime: 48, total: 151, refugee: 3, grandTotal: 154 },
  { sno: 13, region: 'கரூர் (Karur)', partTime: 2, fullTime: 0, total: 2, refugee: 0, grandTotal: 2 },
  { sno: 14, region: 'கிருஷ்ணகிரி (Krishnagiri)', partTime: 34, fullTime: 3, total: 37, refugee: 0, grandTotal: 37 },
  { sno: 15, region: 'மதுரை (Madurai)', partTime: 29, fullTime: 0, total: 29, refugee: 1, grandTotal: 30 },
  { sno: 16, region: 'மயிலாடுதுறை (Mayiladuthurai)', partTime: 0, fullTime: 0, total: 0, refugee: 0, grandTotal: 0 },
  { sno: 17, region: 'நாகப்பட்டினம் (Nagapattinam)', partTime: 0, fullTime: 0, total: 0, refugee: 0, grandTotal: 0 },
  { sno: 18, region: 'நாமக்கல் (Namakkal)', partTime: 44, fullTime: 3, total: 47, refugee: 1, grandTotal: 48 },
  { sno: 19, region: 'நீலகிரி (The Nilgiris)', partTime: 24, fullTime: 7, total: 31, refugee: 0, grandTotal: 31 },
  { sno: 20, region: 'பெரம்பலூர் (Perambalur)', partTime: 1, fullTime: 0, total: 1, refugee: 0, grandTotal: 1 },
  { sno: 21, region: 'புதுக்கோட்டை (Pudukkottai)', partTime: 17, fullTime: 6, total: 23, refugee: 0, grandTotal: 23 },
  { sno: 22, region: 'இராமநாதபுரம் (Ramanathapuram)', partTime: 19, fullTime: 0, total: 19, refugee: 0, grandTotal: 19 },
  { sno: 23, region: 'ராணிப்பேட்டை (Ranipet)', partTime: 0, fullTime: 0, total: 0, refugee: 0, grandTotal: 0 },
  { sno: 24, region: 'சேலம் (Salem)', partTime: 0, fullTime: 0, total: 0, refugee: 3, grandTotal: 3 },
  { sno: 25, region: 'சிவகங்கை (Sivagangai)', partTime: 26, fullTime: 2, total: 28, refugee: 0, grandTotal: 28 },
  { sno: 26, region: 'தென்காசி (Tenkasi)', partTime: 116, fullTime: 57, total: 173, refugee: 3, grandTotal: 176 },
  { sno: 27, region: 'தஞ்சாவூர் (Thanjavur)', partTime: 0, fullTime: 0, total: 0, refugee: 0, grandTotal: 0 },
  { sno: 28, region: 'தேனி (Theni)', partTime: 0, fullTime: 0, total: 0, refugee: 0, grandTotal: 0 },
  { sno: 29, region: 'திருநெல்வேலி (Thirunelveli)', partTime: 67, fullTime: 37, total: 104, refugee: 1, grandTotal: 105 },
  { sno: 30, region: 'திருவள்ளூர் (Thiruvallur)', partTime: 7, fullTime: 0, total: 7, refugee: 1, grandTotal: 8 },
  { sno: 31, region: 'திருவாரூர் (Tiruvarur)', partTime: 0, fullTime: 0, total: 0, refugee: 0, grandTotal: 0 },
  { sno: 32, region: 'தூத்துக்குடி (Thoothukudi)', partTime: 84, fullTime: 37, total: 121, refugee: 0, grandTotal: 121 },
  { sno: 33, region: 'திருப்பத்தூர் (Thirupathur)', partTime: 6, fullTime: 0, total: 6, refugee: 0, grandTotal: 6 },
  { sno: 34, region: 'திருப்பூர் (Tiruppur)', partTime: 22, fullTime: 2, total: 24, refugee: 0, grandTotal: 24 },
  { sno: 35, region: 'திருவண்ணாமலை (Thiruvannamalai)', partTime: 3, fullTime: 0, total: 3, refugee: 0, grandTotal: 3 },
  { sno: 36, region: 'திருச்சிராப்பள்ளி (Trichy)', partTime: 20, fullTime: 1, total: 21, refugee: 0, grandTotal: 21 },
  { sno: 37, region: 'வேலூர் (Vellore)', partTime: 36, fullTime: 0, total: 36, refugee: 0, grandTotal: 36 },
  { sno: 38, region: 'விழுப்புரம் (Viluppuram)', partTime: 0, fullTime: 0, total: 0, refugee: 0, grandTotal: 0 },
  { sno: 39, region: 'விருதுநகர் (Virudhunagar)', partTime: 31, fullTime: 3, total: 34, refugee: 0, grandTotal: 34 },
];

export const TOTAL_TNCSC_OFFICIAL_SHOPS = 1560;
