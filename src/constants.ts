/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RationShop, UserRole, RationCard } from './types.ts';

export const INITIAL_PRODUCTS = [
  { id: 'p1', name: 'Raw Rice', tamilName: 'பச்சரிசி', price: 0, unit: 'kg', stock: 500, category: 'Rice' as const },
  { id: 'p2', name: 'Boiled Rice', tamilName: 'புழுங்கல் அரிசி', price: 0, unit: 'kg', stock: 1200, category: 'Rice' as const },
  { id: 'p3', name: 'Sugar', tamilName: 'சர்க்கரை', price: 25, unit: 'kg', stock: 300, category: 'Sugar' as const },
  { id: 'p4', name: 'Palm Oil', tamilName: 'பாம் ஆயில்', price: 25, unit: 'packet', stock: 150, category: 'Oil' as const },
  { id: 'p5', name: 'Toor Dhal', tamilName: 'துவரம் பருப்பு', price: 30, unit: 'kg', stock: 200, category: 'Dhal' as const },
];

export const MOCK_RATION_CARDS: RationCard[] = [
  {
    cardNumber: '3290884512',
    cardType: 'PHH',
    headOfFamily: 'Arumugam S',
    members: [
      { id: 'm1', name: 'Arumugam S', age: 45, relation: 'Head' },
      { id: 'm2', name: 'Lakshmi A', age: 40, relation: 'Wife' },
      { id: 'm3', name: 'Sriram A', age: 18, relation: 'Son' },
      { id: 'm4', name: 'Priya A', age: 14, relation: 'Daughter' },
    ],
    address: 'No 45, 2nd Main Road, T. Nagar, Chennai',
    allocations: [
      { productId: 'p1', quantity: 20, consumed: 15 },
      { productId: 'p2', quantity: 20, consumed: 10 },
      { productId: 'p3', quantity: 5, consumed: 2 },
      { productId: 'p4', quantity: 2, consumed: 1 },
      { productId: 'p5', quantity: 2, consumed: 0 },
    ]
  },
  {
    cardNumber: '3290884513',
    cardType: 'NPHH',
    headOfFamily: 'Rajesh K',
    members: [
      { id: 'm5', name: 'Rajesh K', age: 38, relation: 'Head' },
      { id: 'm6', name: 'Deepa R', age: 34, relation: 'Wife' },
    ],
    address: 'No 12, West Masi Street, Madurai',
    allocations: [
      { productId: 'p3', quantity: 2, consumed: 0 },
      { productId: 'p4', quantity: 1, consumed: 0 },
    ]
  }
];

export const MOCK_SHOPS: RationShop[] = [
  {
    id: 's1',
    name: 'TNPDS Shop #102 - T. Nagar',
    code: '01AA102',
    address: 'Near Usman Road, T. Nagar, Chennai, Tamil Nadu',
    pincode: '600017',
    phone: '044-24341234',
    openingTime: '09:00',
    closingTime: '18:00',
    lunchStart: '13:00',
    lunchEnd: '14:00',
    latitude: 13.0405,
    longitude: 80.2337,
    products: [...INITIAL_PRODUCTS],
  },
  {
    id: 's2',
    name: 'Fair Price Shop #45 - Adyar',
    code: '01AD045',
    address: 'LB Road, Adyar, Chennai, Tamil Nadu',
    pincode: '600020',
    phone: '044-24905678',
    openingTime: '08:30',
    closingTime: '17:30',
    lunchStart: '12:30',
    lunchEnd: '13:30',
    latitude: 13.0033,
    longitude: 80.2550,
    products: [...INITIAL_PRODUCTS],
  },
  {
    id: 's3',
    name: 'Ration Shop #88 - Madurai Main',
    code: '12MM088',
    address: 'West Masi Street, Madurai, Tamil Nadu',
    pincode: '625001',
    phone: '0452-2345678',
    openingTime: '09:00',
    closingTime: '18:00',
    lunchStart: '13:00',
    lunchEnd: '14:00',
    latitude: 9.9252,
    longitude: 78.1198,
    products: [...INITIAL_PRODUCTS],
  },
  {
    id: 's4',
    name: 'Cooperative Store #12 - Coimbatore',
    code: '05CB012',
    address: 'Oppanakara Street, Coimbatore, Tamil Nadu',
    pincode: '641001',
    phone: '0422-2391234',
    openingTime: '09:00',
    closingTime: '19:00',
    lunchStart: '13:30',
    lunchEnd: '14:30',
    latitude: 11.0168,
    longitude: 76.9558,
    products: [...INITIAL_PRODUCTS],
  }
];

export const STORAGE_KEYS = {
  SHOPS: 'tnpds_shops',
  USER: 'tnpds_user',
  USERS_DB: 'tnpds_users_db',
  RATION_CARDS: 'tnpds_ration_cards',
};
