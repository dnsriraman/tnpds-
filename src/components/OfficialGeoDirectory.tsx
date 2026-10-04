/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Official TNCSC (Tamil Nadu Civil Supplies Corporation)
 * Geo-Location Directory Component (அமுதம் நியாய விலை கடைகள் - CRS)
 */

import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  ExternalLink, 
  Filter, 
  Table as TableIcon, 
  Compass, 
  Navigation,
  CheckCircle2,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { OFFICIAL_TNCSC_REGIONS_SUMMARY, OfficialTncscShop } from '../data/officialTncscShops';
import { OFFICIAL_SHOPS_SAMPLE } from '../data/officialShopsData';
import { RationShop } from '../types';

interface OfficialGeoDirectoryProps {
  onSelectShopForMap?: (shop: Partial<RationShop> & { latitude: number; longitude: number; name: string }) => void;
  onClose?: () => void;
}

export const OfficialGeoDirectory: React.FC<OfficialGeoDirectoryProps> = ({
  onSelectShopForMap,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'summary'>('directory');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState<'all' | 'Urban' | 'Rural'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Filtered official shops
  const filteredShops = useMemo(() => {
    let result = OFFICIAL_SHOPS_SAMPLE;

    if (selectedRegion !== 'all') {
      result = result.filter(s => s.region.toLowerCase() === selectedRegion.toLowerCase());
    }

    if (areaFilter !== 'all') {
      result = result.filter(s => s.areaType === areaFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.taluk.toLowerCase().includes(q) ||
        s.region.toLowerCase().includes(q)
      );
    }

    return result;
  }, [selectedRegion, areaFilter, searchQuery]);

  const totalPages = Math.ceil(filteredShops.length / pageSize) || 1;
  const paginatedShops = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredShops.slice(start, start + pageSize);
  }, [filteredShops, currentPage, pageSize]);

  // Unique regions
  const regionsList = useMemo(() => {
    const set = new Set(OFFICIAL_SHOPS_SAMPLE.map(s => s.region));
    return Array.from(set).sort();
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden font-sans">
      {/* Official Government Brand Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-emerald-950 text-white p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Building2 className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-400 text-blue-950 font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  TNCSC OFFICIAL DIRECTORY
                </span>
                <span className="text-xs text-emerald-300 font-bold">
                  தமிழ்நாடு அரசு நிறுவனம்
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1">
                தமிழ்நாடு நுகர்பொருள் வாணிபக் கழகம்
              </h2>
              <p className="text-sm font-semibold text-blue-100 mt-0.5">
                Tamil Nadu Civil Supplies Corporation — அமுதம் நியாய விலை கடைகள் (CRS)
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
              <p className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">Total Amutham Shops</p>
              <p className="text-xl font-black font-mono text-white">1,560</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
              <p className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold">Connected Family Cards</p>
              <p className="text-xl font-black font-mono text-emerald-300">15,22,017</p>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'directory'
                ? 'bg-white text-blue-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Table 2: Geo Coordinates Directory ({filteredShops.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'summary'
                ? 'bg-white text-blue-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <TableIcon className="w-4 h-4 text-amber-500" />
            <span>Table 1: Regional Summary (39 Regions)</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6 md:p-8 space-y-6">
        {activeTab === 'directory' && (
          <div className="space-y-6">
            {/* Filter and Search Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by shop name, address, shop code, or taluk..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Region Selector */}
                <select
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none shadow-sm cursor-pointer"
                >
                  <option value="all">📍 All Regions ({OFFICIAL_SHOPS_SAMPLE.length})</option>
                  {regionsList.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>

                {/* Area Type */}
                <select
                  value={areaFilter}
                  onChange={(e) => {
                    setAreaFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none shadow-sm cursor-pointer"
                >
                  <option value="all">All Areas</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                </select>

                {(searchQuery || selectedRegion !== 'all' || areaFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRegion('all');
                      setAreaFilter('all');
                      setCurrentPage(1);
                    }}
                    className="text-xs text-rose-600 font-bold hover:underline px-2"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Official Table 2: Details of Corporation - Full Time / Part Time */}
            <div className="overflow-x-auto border border-blue-900 rounded-2xl shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-blue-800 text-white font-black text-center uppercase tracking-wider text-[11px]">
                    <th colSpan={9} className="py-2.5 px-4 bg-blue-900 border-b border-blue-800 text-center text-sm">
                      Details of Corporation - Full Time / Part Time (அதிகாரப்பூர்வ இருப்பிட பட்டியல்)
                    </th>
                  </tr>
                  <tr className="bg-blue-800 text-white font-bold text-center">
                    <th className="p-3 border border-blue-700 w-12">S.NO</th>
                    <th className="p-3 border border-blue-700">REGION</th>
                    <th className="p-3 border border-blue-700">TALUK</th>
                    <th className="p-3 border border-blue-700">ADDRESS OF THE SHOP</th>
                    <th className="p-3 border border-blue-700">NAME OF THE SHOP</th>
                    <th className="p-3 border border-blue-700">SHOP CODE</th>
                    <th className="p-3 border border-blue-700">RURAL / URBAN</th>
                    <th className="p-3 border border-blue-700">FPS CATEGORY</th>
                    <th className="p-3 border border-blue-700">Geo Coordinates</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedShops.map((shop, idx) => (
                    <tr 
                      key={`${shop.code}-${idx}`} 
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="p-3 text-center font-bold text-gray-500 border border-blue-200">
                        {shop.sno}
                      </td>
                      <td className="p-3 font-black text-blue-950 border border-blue-200">
                        {shop.region}
                      </td>
                      <td className="p-3 font-semibold text-gray-700 border border-blue-200">
                        {shop.taluk}
                      </td>
                      <td className="p-3 font-medium text-gray-600 border border-blue-200 max-w-xs">
                        {shop.address}
                      </td>
                      <td className="p-3 font-bold text-gray-900 border border-blue-200">
                        {shop.name}
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-800 border border-blue-200 text-center bg-emerald-50/30">
                        {shop.code}
                      </td>
                      <td className="p-3 text-center border border-blue-200">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          shop.areaType === 'Urban' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {shop.areaType}
                        </span>
                      </td>
                      <td className="p-3 text-center border border-blue-200 font-semibold text-gray-700">
                        {shop.category}
                      </td>
                      <td className="p-3 border border-blue-200 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://www.google.com/maps?q=${shop.lat},${shop.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-blue-700 hover:text-blue-900 hover:underline font-bold flex items-center gap-1"
                            title="Open in Google Maps"
                          >
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            <span>{shop.lat.toFixed(6)}, {shop.lng.toFixed(6)}</span>
                            <ExternalLink className="w-3 h-3 text-blue-400" />
                          </a>

                          {onSelectShopForMap && (
                            <button
                              onClick={() => onSelectShopForMap({
                                latitude: shop.lat,
                                longitude: shop.lng,
                                name: `${shop.name} (${shop.code})`,
                                address: shop.address,
                                code: shop.code
                              })}
                              className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-bold transition-all shadow-sm active:scale-95"
                              title="Show this shop on the application map"
                            >
                              Pin Map
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">{((currentPage - 1) * pageSize) + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * pageSize, filteredShops.length)}</span> of <span className="font-bold text-gray-900">{filteredShops.length}</span> listed fair price shops
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-xl text-xs font-bold text-gray-700 transition-all flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <span className="text-xs font-bold text-gray-700 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-xl text-xs font-bold text-gray-700 transition-all flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-blue-900 text-xs font-semibold leading-relaxed flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
              <span>
                அமுதம் நியாயவிலை கடைகளின் எண்ணிக்கை : <strong>1,560</strong> | இணைக்கப்பட்டுள்ள குடும்ப அட்டைகள் எண்ணிக்கை : <strong>15,22,017</strong>
              </span>
            </div>

            {/* Table 1: Regional Summary */}
            <div className="overflow-x-auto border border-blue-900 rounded-2xl shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-blue-900 text-white font-black text-center text-sm">
                    <th colSpan={7} className="py-3 px-4 uppercase tracking-wider">
                      Details of Corporation - Full Time / Part Time (மண்டல வாரியான கடைகளின் எண்ணிக்கை)
                    </th>
                  </tr>
                  <tr className="bg-blue-800 text-white font-bold text-center">
                    <th className="p-3 border border-blue-700 w-14">S.No</th>
                    <th className="p-3 border border-blue-700 text-left pl-6">மண்டலம் (Region)</th>
                    <th className="p-3 border border-blue-700">பகுதி நேர கடைகள் (Part Time)</th>
                    <th className="p-3 border border-blue-700">முழு நேர கடைகள் (Full Time)</th>
                    <th className="p-3 border border-blue-700">கடைகளின் எண்ணிக்கை</th>
                    <th className="p-3 border border-blue-700">இலங்கை (Refugee)</th>
                    <th className="p-3 border border-blue-700 bg-blue-900">மொத்த கடைகள் (Grand Total)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-center font-semibold">
                  {OFFICIAL_TNCSC_REGIONS_SUMMARY.map((row) => (
                    <tr key={row.sno} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-2.5 border border-blue-200 text-gray-500 font-bold">{row.sno}</td>
                      <td className="p-2.5 border border-blue-200 text-left pl-6 font-bold text-gray-900">{row.region}</td>
                      <td className="p-2.5 border border-blue-200 font-mono text-gray-700">{row.partTime}</td>
                      <td className="p-2.5 border border-blue-200 font-mono text-gray-700">{row.fullTime}</td>
                      <td className="p-2.5 border border-blue-200 font-mono text-gray-800 font-bold">{row.total}</td>
                      <td className="p-2.5 border border-blue-200 font-mono text-gray-600">{row.refugee}</td>
                      <td className="p-2.5 border border-blue-200 font-mono font-black text-blue-950 bg-blue-50/40">{row.grandTotal}</td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-gray-100 font-black text-blue-950 text-sm border-t-2 border-blue-900">
                    <td colSpan={2} className="p-3 border border-blue-300 text-center">
                      மொத்தம் (GRAND TOTAL)
                    </td>
                    <td className="p-3 border border-blue-300 font-mono">1,327</td>
                    <td className="p-3 border border-blue-300 font-mono">219</td>
                    <td className="p-3 border border-blue-300 font-mono">1,546</td>
                    <td className="p-3 border border-blue-300 font-mono">14</td>
                    <td className="p-3 border border-blue-300 font-mono text-emerald-800 bg-emerald-100/60 text-base">
                      1,560
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialGeoDirectory;
