import { OfficialTncscShop } from './officialTncscShops';

export const OFFICIAL_SHOPS_SAMPLE: OfficialTncscShop[] = [
  // 1-2 Ariyalur
  { sno: 1, region: 'Ariyalur', taluk: 'Ariyalur', address: 'Krishnan Kovil Street, Ariyalur', name: 'Amutham Retail Shop', code: '15DA001PN', areaType: 'Urban', category: 'Full Time', lat: 11.140437, lng: 79.071809 },
  { sno: 2, region: 'Ariyalur', taluk: 'Udaiyarpalayam', address: 'Chithambaram Main Road, Udaiyarpalayam', name: 'Amutham Retail Shop', code: '15EA001PN', areaType: 'Urban', category: 'Full Time', lat: 11.392601, lng: 79.362924 },

  // 3-4 Chengalpattu
  { sno: 3, region: 'Chengalpattu', taluk: 'Chengalpattu', address: 'Anna Nagar, Chengalpattu', name: 'Anna Nagar Shop', code: '03DA002PN', areaType: 'Urban', category: 'Full Time', lat: 12.682401, lng: 79.985159 },
  { sno: 4, region: 'Chengalpattu', taluk: 'Chengalpattu', address: 'Varatharajan Street, Chengalpattu', name: 'Dr Varadharajan Street', code: '03DA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.682401, lng: 79.985159 },

  // 5-59 Coimbatore
  { sno: 5, region: 'Coimbatore', taluk: 'Coimbatore (West)', address: '97, Kalidass Road, Ram Nagar, Cbe-9', name: 'Ramnagar', code: '31EA003PN', areaType: 'Rural', category: 'Full Time', lat: 11.021121, lng: 76.8881 },
  { sno: 6, region: 'Coimbatore', taluk: 'Coimbatore (West)', address: 'Poosaripalayam Complex, Thondamuthur Road, Cbe-2', name: 'Poosaripalayam Godown', code: '31EA004PN', areaType: 'Rural', category: 'Full Time', lat: 11.00569, lng: 76.93853 },
  { sno: 7, region: 'Coimbatore', taluk: 'Coimbatore (West)', address: '162, M.A. Periasubbanna Gounder, K.K.Pudur, Cbe-38', name: 'Ramasamy Street K K Pudur', code: '31EA005PN', areaType: 'Rural', category: 'Full Time', lat: 11.0313, lng: 76.9473 },
  { sno: 8, region: 'Coimbatore', taluk: 'Coimbatore (West)', address: '15, Chinnammal St, Saibaba Colony, K.K.Pudur, Cbe-25', name: 'Krishnammal Street K K Pudur', code: '31EA006PN', areaType: 'Rural', category: 'Full Time', lat: 11.0305, lng: 76.94868 },
  { sno: 9, region: 'Coimbatore', taluk: 'Coimbatore (West)', address: '22 Lakshmana Gounder St, Sanganur, Cbe-27', name: 'Sankar Nagar', code: '31EA007PN', areaType: 'Rural', category: 'Full Time', lat: 11.035129, lng: 76.961407 },
  { sno: 10, region: 'Coimbatore', taluk: 'Coimbatore (West)', address: 'Poosaripalayam Complex, Thondamuthur Road, Cbe-2', name: 'Poosaripalayam Godown 2', code: '31EA008PN', areaType: 'Rural', category: 'Full Time', lat: 11.00569, lng: 76.93853 },
  { sno: 11, region: 'Coimbatore', taluk: 'Coimbatore (West)', address: 'Cbe Corporation Building, Ramalingam Nagar S.B.Colony, Cbe-1', name: 'Ramalingam Nagar 4Th Cross', code: '31EA009PN', areaType: 'Rural', category: 'Full Time', lat: 11.029693, lng: 76.937136 },
  { sno: 12, region: 'Coimbatore', taluk: 'Coimbatore (West)', address: '385, Maniam Kaliappa Gounder St, K.K.Pudur, Cbe-38', name: 'Alagannan Street', code: '31EA011PN', areaType: 'Rural', category: 'Full Time', lat: 11.0307, lng: 76.9486 },
  { sno: 13, region: 'Coimbatore', taluk: 'Coimbatore (West)', address: '186, Bye Pass Road, Tatabad, Cbe-12', name: 'Goundappan Street Saibabacolony', code: '31EA013PN', areaType: 'Rural', category: 'Full Time', lat: 10.993, lng: 76.961 },
  { sno: 14, region: 'Coimbatore', taluk: 'Coimbatore (West)', address: 'Krishnammal St, Saibaba Colony, Cbe-25', name: 'Goundappan Street Saibaba Colony', code: '31EA014PN', areaType: 'Rural', category: 'Full Time', lat: 10.993, lng: 76.961 },
  { sno: 15, region: 'Coimbatore', taluk: 'Coimbatore (West)', address: 'Poosaripalayam Complex, Thondamuthur Road, Cbe', name: 'Poosaripalayam Godown 3', code: '31EA015PN', areaType: 'Rural', category: 'Full Time', lat: 11.00569, lng: 76.93853 },
  { sno: 16, region: 'Coimbatore', taluk: 'Coimbatore( North)', address: '310B, Alagappa Chettiar St, Tatabad, Cbe-12', name: 'Eichipatti Colony', code: '31AA001PN', areaType: 'Rural', category: 'Full Time', lat: 11.022423, lng: 76.96823 },
  { sno: 17, region: 'Coimbatore', taluk: 'Coimbatore( North)', address: 'Housing Unit Bldg., Stall No. 4&5, Near Ttc Bus Stand, Gandhipuram', name: 'Tiruvalluvar Bus Stand', code: '31AA002PN', areaType: 'Rural', category: 'Full Time', lat: 11.017336, lng: 76.969904 },
  { sno: 18, region: 'Coimbatore', taluk: 'Coimbatore( North)', address: 'Maniakarampalayam, Cbe', name: 'Maniakarampalayam', code: '31AA003PN', areaType: 'Rural', category: 'Full Time', lat: 11.04761, lng: 76.96814 },
  { sno: 19, region: 'Coimbatore', taluk: 'Coimbatore( North)', address: '144, Devivanayaki Nagar, Sanganoor Road, Ganapathy, Cbe', name: 'Mamara Thottam', code: '31AA004PN', areaType: 'Rural', category: 'Full Time', lat: 11.036563, lng: 76.973801 },
  { sno: 20, region: 'Coimbatore', taluk: 'Coimbatore( North)', address: '27, Mariamman Kovil St, Peelamedu, Cbe-4', name: 'Peelamedu Mariamman', code: '31AA005PN', areaType: 'Rural', category: 'Full Time', lat: 11.03651, lng: 76.97432 },
  { sno: 21, region: 'Coimbatore', taluk: 'Coimbatore( North)', address: '31, Railway Unit-1, Lakshmipuram, Ganapathy, Cbe-6', name: 'Lakshmi Puram Chekkan Thottam', code: '31AA006PN', areaType: 'Rural', category: 'Full Time', lat: 11.027762, lng: 76.9724 },
  { sno: 22, region: 'Coimbatore', taluk: 'Coimbatore( North)', address: '52, Gounder Complex, Papanaikenpalayam Road, Avarampalayam', name: 'Chithaputhur 1 Nethaji Road', code: '31AA007PN', areaType: 'Rural', category: 'Full Time', lat: 11.021138, lng: 76.981191 },
  { sno: 23, region: 'Coimbatore', taluk: 'Coimbatore( North)', address: '208, Nethaji Road, Papanaickenpalayam, Cbe-37', name: 'Pappanaicken Palayam', code: '31AA008PN', areaType: 'Rural', category: 'Full Time', lat: 11.015263, lng: 76.984319 },
  { sno: 24, region: 'Coimbatore', taluk: 'Coimbatore( North)', address: '220, Mariamman Kovil St, Avarampalayam, Cbe-6', name: 'Aavarampalayam', code: '31AA009PN', areaType: 'Rural', category: 'Full Time', lat: 11.029738, lng: 76.985352 },
  { sno: 28, region: 'Coimbatore', taluk: 'Coimbatore( South)', address: 'Srt Layout, Vellalur Road, Singanallur, Cbe-5', name: 'Anayankadu Road', code: '31CA001PN', areaType: 'Rural', category: 'Full Time', lat: 10.996824, lng: 77.034733 },
  { sno: 31, region: 'Coimbatore', taluk: 'Coimbatore( South)', address: 'Krishnasamy Nagar, Ramanathapuram, Cbe-45', name: 'Ramanathapuram', code: '31CA004PN', areaType: 'Rural', category: 'Full Time', lat: 11.00427, lng: 76.99542 },
  { sno: 35, region: 'Coimbatore', taluk: 'Coimbatore( South)', address: '197 / B - House, Puliakulam Main Road, Cbe-45', name: 'Puliyakulam', code: '31CA008PN', areaType: 'Rural', category: 'Full Time', lat: 11.005006, lng: 76.992855 },
  { sno: 39, region: 'Coimbatore', taluk: 'Coimbatore( South)', address: 'Municipal Commercial Complex, Ukkadam Byepass Road', name: 'Ukkadam Bus Stop', code: '31DA004PN', areaType: 'Rural', category: 'Full Time', lat: 10.993, lng: 76.961 },
  { sno: 42, region: 'Coimbatore', taluk: 'Coimbatore( South)', address: '1A, Housing Unit, Race Course, Cbe-18', name: 'Racecourse', code: '31EA010PN', areaType: 'Rural', category: 'Full Time', lat: 10.999807, lng: 76.978426 },
  { sno: 44, region: 'Coimbatore', taluk: 'Mettupalayam', address: '13-A, Chirumugai Road, Sankar Nagar, Mettupalayam', name: 'Sirumugai Road', code: '31FA001PN', areaType: 'Rural', category: 'Full Time', lat: 11.309371, lng: 76.94541 },
  { sno: 54, region: 'Coimbatore', taluk: 'Pollachi', address: 'Kumaran Nagar, Pollachi', name: 'Nethaji Road Pollachi', code: '31GA001PN', areaType: 'Rural', category: 'Full Time', lat: 10.657107, lng: 76.99421 },
  { sno: 58, region: 'Coimbatore', taluk: 'Valparai', address: 'Town Panchayat Bldg, Valparai', name: 'Amutham-65 Valparai', code: '31HA001PN', areaType: 'Urban', category: 'Full Time', lat: 10.32922, lng: 76.955345 },

  // 60-103 Dharmapuri
  { sno: 60, region: 'Dharmapuri', taluk: 'Dharmapuri', address: '31A, Mathigonpalayam, Thiruppatur Road, Dharmapuri-Tk', name: 'Mathigonpalayam', code: '29AA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.144401, lng: 78.168555 },
  { sno: 61, region: 'Dharmapuri', taluk: 'Dharmapuri', address: '17/37, Sathiram Mel Street, Dharmapuri', name: 'Sathiram Mel Street', code: '29AA002PN', areaType: 'Urban', category: 'Full Time', lat: 12.128861, lng: 78.162631 },
  { sno: 65, region: 'Dharmapuri', taluk: 'Dharmapuri', address: 'Pennagaram Main Road, Kumarasamypettai, Dharmapuri', name: 'Kumarasamypettai', code: '29AA006PN', areaType: 'Urban', category: 'Full Time', lat: 12.129205, lng: 78.155789 },
  { sno: 67, region: 'Dharmapuri', taluk: 'Dharmapuri', address: '4/840, Teachers Colony, Near Railway Station, Dharmapuri', name: 'Teachers Colony', code: '29AA008PN', areaType: 'Urban', category: 'Full Time', lat: 12.125248, lng: 78.156522 },
  { sno: 70, region: 'Dharmapuri', taluk: 'Harur', address: 'Varnathertham St, Harur', name: 'Harur I', code: '29DA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.05519, lng: 78.483143 },
  { sno: 73, region: 'Dharmapuri', taluk: 'Karimangalam', address: 'Near Rajam Theater, Morappur Road, Karimangalam', name: 'Karimangalam', code: '29FA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.304727, lng: 78.207092 },
  { sno: 79, region: 'Dharmapuri', taluk: 'Nallampalli', address: 'Mariyamman Kovil St, Bazar, Nallampalli', name: 'Nallampalli', code: '29GA002PY', areaType: 'Rural', category: 'Full Time', lat: 12.056325, lng: 78.116752 },
  { sno: 82, region: 'Dharmapuri', taluk: 'Nallampalli', address: 'Bazar, Near Govt Hospital, Thoppur, Nallampalli', name: 'Thoppur', code: '29GA004PY', areaType: 'Rural', category: 'Full Time', lat: 11.940209, lng: 78.055382 },
  { sno: 85, region: 'Dharmapuri', taluk: 'Palacode', address: '3/220, Parris Corner, Jerthalav, Palacode', name: 'Palacode - 1', code: '29CA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.306793, lng: 78.078096 },
  { sno: 89, region: 'Dharmapuri', taluk: 'Pappireddypatti', address: 'Maya Bazar St, Pappireddypatti', name: 'Pappireddypatti-1', code: '29EA001PN', areaType: 'Urban', category: 'Full Time', lat: 11.917425, lng: 78.369778 },
  { sno: 94, region: 'Dharmapuri', taluk: 'Pennagaram', address: 'Sandapettai, Near Indian Bank, Pennagaram', name: 'Kavery Road Pennagaram', code: '29BA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.133079, lng: 77.89181 },
  { sno: 96, region: 'Dharmapuri', taluk: 'Pennagaram', address: 'Near Bus Stand, Hogenakkal, Pennagaram', name: 'Hogenakkal', code: '29BA002PY', areaType: 'Rural', category: 'Full Time', lat: 12.120965, lng: 77.77931 },

  // 104-122 Dindigul
  { sno: 104, region: 'Dindigul', taluk: 'Dindigul West', address: 'No 49, Complex Main Road, Muthalagupatty', name: 'Muthalaghupatti', code: '11AA001PN', areaType: 'Urban', category: 'Full Time', lat: 10.36268, lng: 77.958359 },
  { sno: 105, region: 'Dindigul', taluk: 'Dindigul West', address: '77/120, Muniyappan Koil Street, R.V.Nagar', name: 'R.V. Nagar', code: '11AA002PN', areaType: 'Urban', category: 'Full Time', lat: 10.356684, lng: 77.963333 },
  { sno: 115, region: 'Dindigul', taluk: 'Kodaikkanal', address: '4/69, Anandhagiri, Chinna Mariyamman Koil 2nd St, Kodaikanal', name: 'Ananthagiri-1 Kodaikanal', code: '11GA001PN', areaType: 'Urban', category: 'Full Time', lat: 10.241555, lng: 77.502412 },
  { sno: 117, region: 'Dindigul', taluk: 'Palani', address: 'Saravanapothigai Backside, Koil Adivaram, Palani', name: 'Amutham Angadi 1 Palani', code: '11BA001PN', areaType: 'Urban', category: 'Full Time', lat: 10.443671, lng: 77.51787 },

  // 123-138 Erode
  { sno: 123, region: 'Erode', taluk: 'Bhavani', address: '350/294 Car Street, Bhavani-1', name: 'Crs-7 Bhavani', code: '09CC005PN', areaType: 'Urban', category: 'Full Time', lat: 11.444025, lng: 77.684545 },
  { sno: 126, region: 'Erode', taluk: 'Bhavani Sagar', address: 'Near EB Office, Bhavanisagar', name: 'Crs-09 Bhavanisagar', code: '09EA001PN', areaType: 'Urban', category: 'Full Time', lat: 11.474604, lng: 77.12964 },
  { sno: 129, region: 'Erode', taluk: 'Erode', address: 'Marimuthu Street, Erode', name: 'Crs-1 Erode Town', code: '09AA001PN', areaType: 'Urban', category: 'Full Time', lat: 11.341352, lng: 77.732059 },
  { sno: 138, region: 'Erode', taluk: 'Sathyamangalam', address: 'Opp IOB, Parisalkaran Street, Sathy', name: 'Crs-10 Sathyamangalam', code: '09EC003PN', areaType: 'Urban', category: 'Full Time', lat: 11.504, lng: 77.2403 },

  // 139-170 Kancheepuram
  { sno: 139, region: 'Kancheepuram', taluk: 'Kancheepuram', address: 'No.70 Aladi Pillaiayar Koil St, Kpm', name: 'Aaladi Pilliyar Koil Street', code: '03AA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.821293, lng: 79.704171 },
  { sno: 141, region: 'Kancheepuram', taluk: 'Kancheepuram', address: 'Sheikpet Saliyar St, Kanchipuram', name: 'Seikhpet Saliyar Street', code: '03AA003PN', areaType: 'Urban', category: 'Full Time', lat: 12.814415, lng: 79.693967 },
  { sno: 146, region: 'Kancheepuram', taluk: 'Kancheepuram', address: 'Pallavan Nagar, TNCSC Regional Office Complex, Kpm', name: 'Pallavan Nagar', code: '03AA008PN', areaType: 'Urban', category: 'Full Time', lat: 12.824257, lng: 79.690493 },
  { sno: 167, region: 'Kancheepuram', taluk: 'Kundrathur', address: 'Mangadu Town, Kundrathur', name: 'Mangadu Main', code: '03BA002PN', areaType: 'Urban', category: 'Full Time', lat: 13.005574, lng: 80.131811 },
  { sno: 170, region: 'Kancheepuram', taluk: 'Sriperumbudur', address: 'Sriperumbudur Town', name: 'Sriperumbudur Shop', code: '03BA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.974063, lng: 79.95753 },

  // 171-325 Kanniyakumari
  { sno: 171, region: 'Kanniyakumari', taluk: 'Agasteeswaram', address: '7/46, Vadakku Salai, Agastheeswaram', name: 'Ars Agastheeswaram I', code: '28AA027PN', areaType: 'Urban', category: 'Full Time', lat: 8.100085, lng: 77.52207 },
  { sno: 178, region: 'Kanniyakumari', taluk: 'Agasteeswaram', address: 'Opposite Latha Hospital, Beach Road, Nagercoil', name: 'Ars Beach Road', code: '28AA017PN', areaType: 'Urban', category: 'Full Time', lat: 8.171805, lng: 77.438483 },
  { sno: 184, region: 'Kanniyakumari', taluk: 'Agasteeswaram', address: 'Nesavalar Street, Nagercoil', name: 'Ars Distillery', code: '28AA005PN', areaType: 'Urban', category: 'Full Time', lat: 8.193685, lng: 77.431093 },
  { sno: 199, region: 'Kanniyakumari', taluk: 'Agasteeswaram', address: 'Beach Road, Kanniyakumari Town', name: 'Ars Kanyakumari Beach', code: '28AA025PY', areaType: 'Urban', category: 'Full Time', lat: 8.156875, lng: 77.469562 },
  { sno: 202, region: 'Kanniyakumari', taluk: 'Agasteeswaram', address: 'Vellala Samuthaya Building, Kottaram', name: 'Ars Kottaram', code: '28AA026PN', areaType: 'Urban', category: 'Full Time', lat: 8.117555, lng: 77.523017 },
  { sno: 251, region: 'Kanniyakumari', taluk: 'Kalkulam', address: 'Pallivasal Road, Near Anna Salai, Colachel', name: 'Ars Colachel', code: '28CA001PN', areaType: 'Urban', category: 'Full Time', lat: 8.178628, lng: 77.259782 },
  { sno: 264, region: 'Kanniyakumari', taluk: 'Kalkulam', address: 'No 301, Sarodu, Thuckalay', name: 'Ars Thuckalay', code: '28CA002PN', areaType: 'Urban', category: 'Full Time', lat: 8.25377, lng: 77.31579 },
  { sno: 287, region: 'Kanniyakumari', taluk: 'Thiruvattar', address: '15-188, Padanilam, Kulasekharam', name: 'Ars Kulasekaram', code: '28CA006PN', areaType: 'Urban', category: 'Full Time', lat: 8.360585, lng: 77.293212 },
  { sno: 290, region: 'Kanniyakumari', taluk: 'Thovalai', address: 'Vinayagar Street, Aralvaimozhi', name: 'A R S Aralvoimozhy', code: '28BA002PN', areaType: 'Urban', category: 'Full Time', lat: 8.25791, lng: 77.521867 },
  { sno: 307, region: 'Kanniyakumari', taluk: 'Vilavancode', address: '28/65, Singleyar Street, Marthandam', name: 'Ars Marthandam', code: '28DA002PN', areaType: 'Urban', category: 'Full Time', lat: 8.318383, lng: 77.205763 },

  // 326-327 Karur
  { sno: 326, region: 'Karur', taluk: 'Karur', address: 'Anna Nagar, Near Water Tank, Karur', name: 'Ars - Karur Town', code: '12AA001PN', areaType: 'Urban', category: 'Full Time', lat: 10.957486, lng: 78.070216 },
  { sno: 327, region: 'Karur', taluk: 'Kulithalai', address: 'Anna Nagar, Kulithalai', name: 'Ars - Kulithalai', code: '12CA001PN', areaType: 'Urban', category: 'Full Time', lat: 10.937288, lng: 78.417355 },

  // 328-364 Krishnagiri
  { sno: 328, region: 'Krishnagiri', taluk: 'Anchetty', address: 'BDO Office, Koripalayam, Anchetty Block', name: 'Anchetty', code: '30EA004PN', areaType: 'Urban', category: 'Full Time', lat: 12.352218, lng: 77.721951 },
  { sno: 330, region: 'Krishnagiri', taluk: 'Bargur', address: 'Duraies Nagar, Jagadevi Road, Bargur', name: 'Crs Bargur I', code: '30FA007PN', areaType: 'Urban', category: 'Full Time', lat: 12.539724, lng: 78.354015 },
  { sno: 333, region: 'Krishnagiri', taluk: 'Denkanikottai', address: '80, Melkottai Road, Denkanikottai', name: 'Denkanikottai Town', code: '30EA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.530512, lng: 77.7876 },
  { sno: 337, region: 'Krishnagiri', taluk: 'Hosur', address: 'Aarekarai Street, Hosur Block, Hosur', name: 'Hosur-I Main', code: '30BA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.717, lng: 78.817 },
  { sno: 338, region: 'Krishnagiri', taluk: 'Hosur', address: '753, Housing Unit, Indira Nagar, Hosur', name: 'Hosur-Ii Indira Nagar', code: '30BA002PN', areaType: 'Urban', category: 'Full Time', lat: 12.740511, lng: 77.829775 },
  { sno: 347, region: 'Krishnagiri', taluk: 'Krishnagiri', address: '32/14, Thiruvannamalai Road, Pudhupettai, Krishnagiri', name: 'Crs I Krishnagiri', code: '30AA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.51423, lng: 78.222698 },

  // 365-394 Madurai
  { sno: 365, region: 'Madurai', taluk: 'Central', address: 'No 13 Alagarsamy Naidu First Street, Madurai-1', name: 'Tncsc Crs 13', code: '22CA001PN', areaType: 'Urban', category: 'Full Time', lat: 9.910842, lng: 78.12332 },
  { sno: 368, region: 'Madurai', taluk: 'Central', address: 'No.16, Madurai Corpn. N.M.A. Complex, Simmakkal, Madurai-1', name: 'Tncsc Crs 16 Simmakkal', code: '22CA004PN', areaType: 'Urban', category: 'Full Time', lat: 9.926503, lng: 78.1192 },
  { sno: 381, region: 'Madurai', taluk: 'North', address: 'No.30, Aasath Road, Anna Nagar, Madurai-20', name: 'Tncsc Anna Nagar Madurai', code: '22BA003PN', areaType: 'Urban', category: 'Full Time', lat: 9.92401, lng: 78.13716 },
  { sno: 382, region: 'Madurai', taluk: 'North', address: 'LIG Colony, KK Nagar, Madurai-20', name: 'Tncsc K.K. Nagar Madurai', code: '22BA002PN', areaType: 'Urban', category: 'Full Time', lat: 9.934673, lng: 78.14944 },

  // 395-442 Namakkal
  { sno: 395, region: 'Namakkal', taluk: 'Kumarapalayam', address: 'Aavarankadu, Santhai Pettai, Pallipalayam', name: 'Ars No - 1 Pallipalayam', code: '08GA020PN', areaType: 'Urban', category: 'Full Time', lat: 11.360469, lng: 77.748963 },
  { sno: 407, region: 'Namakkal', taluk: 'Kumarapalayam', address: 'Sathyabawa Nagar, High School Road, Kumarapalayam', name: 'Ars No - 1 Kumarapalayam', code: '08GA001PN', areaType: 'Urban', category: 'Full Time', lat: 11.44395, lng: 77.701611 },
  { sno: 437, region: 'Namakkal', taluk: 'Sendamangalam', address: 'Easwaran Kovil St, Sendamangalam, Namakkal', name: 'Ars No - 1 Sendamangalam', code: '08FA001PN', areaType: 'Urban', category: 'Full Time', lat: 11.286447, lng: 78.237112 },

  // 443-753 North Chennai & Suburbs
  { sno: 443, region: 'North Chennai', taluk: 'Avadi', address: 'Rajivgandhi Nagar -2, Main Road, Chekkadu, Avadi', name: 'Rajivgandhi Nagar -2', code: '02IA002NT', areaType: 'Urban', category: 'Full Time', lat: 13.112892, lng: 80.080522 },
  { sno: 445, region: 'North Chennai', taluk: 'Avadi', address: 'No.22, Kamaraj Nagar, Avadi, Chennai-54', name: 'Avadi-1 Kamaraj Nagar', code: '02IA020NT', areaType: 'Urban', category: 'Full Time', lat: 13.114323, lng: 80.09634 },
  { sno: 450, region: 'North Chennai', taluk: 'Avadi', address: '427 CTH Road, Avadi, Chennai', name: 'Gandhi Nagar Avadi', code: '02IA027NT', areaType: 'Urban', category: 'Full Time', lat: 13.070431, lng: 80.182449 },
  { sno: 483, region: 'North Chennai', taluk: 'Ambattur', address: '12/6, Perumal Koil St, Keel Ayanambakkam', name: 'Keel Ayanambakkam', code: '02FA075NT', areaType: 'Urban', category: 'Full Time', lat: 13.108282, lng: 80.153041 },
  { sno: 501, region: 'North Chennai', taluk: 'Ambattur', address: 'TI Cycle Road, Ambattur, Landmark Canara Bank', name: 'Varadarajapuram Ambattur', code: '02FA001NT', areaType: 'Urban', category: 'Full Time', lat: 13.110607, lng: 80.152054 },
  { sno: 509, region: 'North Chennai', taluk: 'Anna Nagar', address: '2 Flowers Road, Kilpauk, Chennai-10', name: 'Flowers Road-1 Kilpauk', code: '02DA025NC', areaType: 'Urban', category: 'Full Time', lat: 13.08084, lng: 80.249946 },
  { sno: 514, region: 'North Chennai', taluk: 'Anna Nagar', address: 'Pirivari Salai, Shenoy Nagar, Chennai-30', name: 'Pirivari Salai Shenoy Nagar', code: '02DA035NC', areaType: 'Urban', category: 'Full Time', lat: 13.079709, lng: 80.225697 },
  { sno: 519, region: 'North Chennai', taluk: 'Anna Nagar', address: '96 MMDA Colony, E-Block, Arumbakkam', name: 'MMDA Colony Arumbakkam', code: '02DA028NC', areaType: 'Urban', category: 'Full Time', lat: 13.065988, lng: 80.212798 },
  { sno: 523, region: 'North Chennai', taluk: 'Anna Nagar', address: 'Guruvappa Street, Ayanavaram Milk Society', name: 'NMK Street Ayanavaram', code: '02DA003NC', areaType: 'Urban', category: 'Full Time', lat: 13.094312, lng: 80.229499 },
  { sno: 550, region: 'North Chennai', taluk: 'Chidambaranar', address: '102, Pidariar Koil St, Sevenwells, Chennai-1', name: 'Grigori Street Sevenwells', code: '02AA045NC', areaType: 'Urban', category: 'Full Time', lat: 13.101011, lng: 80.285205 },
  { sno: 557, region: 'North Chennai', taluk: 'Chidambaranar', address: '105, Mint St, Sowcarpet, Chennai-79', name: 'Anna Street Sowcarpet', code: '02AA018NC', areaType: 'Urban', category: 'Full Time', lat: 13.094917, lng: 80.28005 },
  { sno: 576, region: 'North Chennai', taluk: 'Kolathur', address: '42, S.R.P. Koil St (N) Main Road, KC Garden, Kolathur', name: 'Vetri Nagar Kolathur', code: '02CA030NC', areaType: 'Urban', category: 'Full Time', lat: 13.118026, lng: 80.231752 },
  { sno: 587, region: 'North Chennai', taluk: 'Kolathur', address: '33, Karthikeyan Salai, Periyar Nagar Complex', name: 'Periyar Nagar Kolathur', code: '02CA025NC', areaType: 'Urban', category: 'Full Time', lat: 13.112245, lng: 80.22394 },
  { sno: 604, region: 'North Chennai', taluk: 'Perambur', address: '41/2/31, Nelvayal Road, Perambur', name: 'Paddy Field Salai Perambur', code: '02CA018NC', areaType: 'Urban', category: 'Full Time', lat: 13.107831, lng: 80.248336 },
  { sno: 646, region: 'North Chennai', taluk: 'R K Nagar', address: 'KVK Samy Street, Tondiarpet, Chennai-81', name: 'Parameshwari Nagar Tondiarpet', code: '02EA079NC', areaType: 'Urban', category: 'Full Time', lat: 13.128973, lng: 80.277004 },
  { sno: 673, region: 'North Chennai', taluk: 'Royapuram', address: '11/334 Periyathambi 2nd Street, Royapuram', name: 'Arthoonsalai Royapuram', code: '02BA001NC', areaType: 'Urban', category: 'Full Time', lat: 13.109812, lng: 80.280365 },
  { sno: 685, region: 'North Chennai', taluk: 'Thiruvottriyur', address: 'K.K.Thazhai, Anna Street, Madhavaram, Chennai-51', name: 'Anna Street Madhavaram', code: '02HA083NT', areaType: 'Urban', category: 'Full Time', lat: 13.156963, lng: 80.257048 },
  { sno: 729, region: 'North Chennai', taluk: 'Villivakkam', address: '2, P.E. Koil West Mada Street, Ayanavaram', name: 'PE Kovil Street Ayanavaram', code: '02GA001NC', areaType: 'Urban', category: 'Full Time', lat: 13.097315, lng: 80.224637 },
  { sno: 732, region: 'North Chennai', taluk: 'Villivakkam', address: '40, W-Block, Godown Complex, Anna Nagar, Chennai-40', name: 'Anna Nagar Godown CRS', code: '02GA019NC', areaType: 'Urban', category: 'Full Time', lat: 13.086217, lng: 80.217635 },

  // 754 Perambalur
  { sno: 754, region: 'Perambalur', taluk: 'Perambalur', address: 'No.67, Sangu Pettai, Venkateshpuram, Perambalur', name: 'Amutham Retail Shop Perambalur', code: '14AA001PN', areaType: 'Urban', category: 'Full Time', lat: 11.23552, lng: 78.869378 },

  // 755-777 Pudukkottai
  { sno: 755, region: 'Pudukkottai', taluk: 'Alangudi', address: '27/16 Kamarajar Street, Alangudi', name: 'Alangudi Amutham', code: '20BA001PN', areaType: 'Urban', category: 'Full Time', lat: 10.36708, lng: 78.98308 },
  { sno: 756, region: 'Pudukkottai', taluk: 'Aranthangi', address: '56, Bharathidasan Road, Aranthangi', name: 'Aranthangi Amutham', code: '20FA001PY', areaType: 'Urban', category: 'Full Time', lat: 10.166263, lng: 78.99433 },
  { sno: 774, region: 'Pudukkottai', taluk: 'Pudukkottai', address: 'Tax Collection Road, Kamban Nagar, Pudukkottai', name: 'Rajagopalapuram I Pudukkottai', code: '20AA001PN', areaType: 'Urban', category: 'Full Time', lat: 10.372362, lng: 78.81281 },

  // 778-796 Ramanathapuram
  { sno: 778, region: 'Ramanathapuram', taluk: 'Kamudi', address: 'Subramaniya Samy Kovil Street, Abiramam', name: 'Abiramam Crs -1', code: '25GA001PN', areaType: 'Urban', category: 'Full Time', lat: 9.442641, lng: 78.436828 },
  { sno: 780, region: 'Ramanathapuram', taluk: 'Paramakudi', address: '1/425 Pillayar Kovil Theru, Kattuparamakudi', name: 'Paramakudi Crs-1', code: '25DA001PN', areaType: 'Urban', category: 'Full Time', lat: 9.555213, lng: 78.576015 },
  { sno: 792, region: 'Ramanathapuram', taluk: 'Ramanathapuram', address: '4/32, Aranmanai West, Aranmanai Campus, Ramanathapuram', name: 'Ramanathapuram Crs-1 Aranmanai', code: '25AA001PN', areaType: 'Urban', category: 'Full Time', lat: 9.370861, lng: 78.826021 },

  // 797-799 Salem
  { sno: 797, region: 'Salem', taluk: 'Omalur', address: 'Pavalathanur, Tharamangalam, Omalur', name: 'Pavalathanur Shop', code: '08OM001PN', areaType: 'Rural', category: 'Full Time', lat: 11.690442, lng: 77.979496 },

  // 800-827 Sivagangai
  { sno: 800, region: 'Sivagangai', taluk: 'Devakottai', address: 'Kandadevi Road, Devakottai', name: 'Ars-1 Devakottai', code: '21DA001PN', areaType: 'Urban', category: 'Full Time', lat: 9.94607, lng: 78.82661 },
  { sno: 813, region: 'Sivagangai', taluk: 'Karaikudi', address: 'Periyar Nagar, Puthyasanthai Road, Karaikudi', name: 'Ars -1 Karaikudi', code: '21EA001PN', areaType: 'Urban', category: 'Full Time', lat: 10.054164, lng: 78.775456 },
  { sno: 818, region: 'Sivagangai', taluk: 'Sivagangai', address: 'Majeeth Road, LIC Building Opp, Sivagangai', name: 'Ars-1 Sivagangai Town', code: '21AA001PN', areaType: 'Urban', category: 'Full Time', lat: 9.852962, lng: 78.492671 },

  // 828-996 South Chennai
  { sno: 828, region: 'South Chennai', taluk: 'Chepauk', address: '1/2 Kalavai Chetty St, Chintadripet, Chennai', name: 'Arunachalam Street 1 Chintadripet', code: '02NA043SC', areaType: 'Urban', category: 'Full Time', lat: 13.077438, lng: 80.26994 },
  { sno: 831, region: 'South Chennai', taluk: 'Chepauk', address: 'Karpaga Kanniyamman Koil St, Chepauk, Chennai', name: 'Chepauk 4', code: '02NA035SC', areaType: 'Urban', category: 'Full Time', lat: 13.057055, lng: 80.280445 },
  { sno: 846, region: 'South Chennai', taluk: 'Chepauk', address: '15/2, Singachari St, Triplicane, Chennai', name: 'Singarachari Street Triplicane', code: '02NA008SC', areaType: 'Urban', category: 'Full Time', lat: 13.057791, lng: 80.280133 },
  { sno: 853, region: 'South Chennai', taluk: 'Maduravayal', address: '7th Cross Street, Mogappair Eri Scheme, Chennai', name: 'East Mogappair', code: '02FA037NT', areaType: 'Urban', category: 'Full Time', lat: 13.074691, lng: 80.180131 },
  { sno: 878, region: 'South Chennai', taluk: 'Maduravayal', address: 'Perumal Koil Street, Nerkundram, Chennai-107', name: 'Nerkundram -1', code: '02RA004SC', areaType: 'Urban', category: 'Full Time', lat: 13.070431, lng: 80.182449 },
  { sno: 881, region: 'South Chennai', taluk: 'Mylapore', address: '37 Bharathiyar Salai, Taramani, Chennai-113', name: 'Taramani 4', code: '02KA030SC', areaType: 'Urban', category: 'Full Time', lat: 12.986305, lng: 80.240785 },
  { sno: 883, region: 'South Chennai', taluk: 'Mylapore', address: '33 North Mada Street, Thiruvanmiyur, Chennai-41', name: 'Thiruvanmiyur Marundeeswarar', code: '02KA028SC', areaType: 'Urban', category: 'Full Time', lat: 12.986205, lng: 80.260453 },
  { sno: 884, region: 'South Chennai', taluk: 'Mylapore', address: 'Nochikuppam, Chennai (Near Light House)', name: 'Karaneswar Koil Nochikuppam', code: '02KA027SC', areaType: 'Urban', category: 'Full Time', lat: 13.037478, lng: 80.279641 },
  { sno: 896, region: 'South Chennai', taluk: 'Mylapore', address: '40, Salai St, Mylapore, Chennai', name: 'Salai Street Mylapore', code: '02KA009SC', areaType: 'Urban', category: 'Full Time', lat: 13.032633, lng: 80.273566 },
  { sno: 899, region: 'South Chennai', taluk: 'Saidapet', address: 'K.P.Kovil Street, Saidapet, Chennai', name: 'Koothadum Pillaiyar Saidapet', code: '02LA053SC', areaType: 'Urban', category: 'Full Time', lat: 13.021834, lng: 80.213941 },
  { sno: 901, region: 'South Chennai', taluk: 'Saidapet', address: '20, Lake View Road Kottur, Chennai', name: 'Kottur Garden Saidapet', code: '02LA051SC', areaType: 'Urban', category: 'Full Time', lat: 13.014636, lng: 80.244303 },
  { sno: 904, region: 'South Chennai', taluk: 'Saidapet', address: '115, Pillaiyar Kovil 2nd St, Ashok Nagar, Chennai', name: 'Bharathidasan Colony Ashok Nagar', code: '02LA048SC', areaType: 'Urban', category: 'Full Time', lat: 13.030172, lng: 80.204825 },
  { sno: 921, region: 'South Chennai', taluk: 'Saidapet', address: '46, Abdul Aziz St, T.Nagar, Chennai', name: 'Abdul Aziz Street T.Nagar', code: '02LA016SC', areaType: 'Urban', category: 'Full Time', lat: 13.033043, lng: 80.233826 },
  { sno: 934, region: 'South Chennai', taluk: 'Solinganallur', address: 'Kottivakkam Kuppam, Beach Road, Chennai', name: 'Injambakkam 8', code: '02QA035SK', areaType: 'Urban', category: 'Full Time', lat: 12.942024, lng: 80.249509 },
  { sno: 944, region: 'South Chennai', taluk: 'St.Thomas Mount', address: 'Mangali Amman Koil St, St.Thomas Mount, Chennai', name: 'Seven Wells St.Thomas Mount', code: '02OA003SK', areaType: 'Urban', category: 'Full Time', lat: 12.992543, lng: 80.198236 },
  { sno: 947, region: 'South Chennai', taluk: 'Thiyagaraya Nagar', address: 'Senthil Andavar Kovil Street, Vadapalani, Chennai', name: 'Andavar Nagar Vadapalani', code: '02JA051SC', areaType: 'Urban', category: 'Full Time', lat: 13.055215, lng: 80.213935 },
  { sno: 949, region: 'South Chennai', taluk: 'Thiyagaraya Nagar', address: 'Kodambakkam Railway Station Opposite, Mambalam Road', name: 'Mambalam Nedunchalai', code: '02JA048SC', areaType: 'Urban', category: 'Full Time', lat: 13.052458, lng: 80.2307 },
  { sno: 972, region: 'South Chennai', taluk: 'Thousandlights', address: 'N.H.Road, Periyamet, Chennai', name: 'Baracks Road Periyamet', code: '02MA029SC', areaType: 'Urban', category: 'Full Time', lat: 13.083313, lng: 80.24973 },
  { sno: 981, region: 'South Chennai', taluk: 'Thousandlights', address: 'A4, Armed Reserve Police Quarters, Egmore', name: 'A R Police Quarters Egmore', code: '02MA047SC', areaType: 'Urban', category: 'Full Time', lat: 13.07033, lng: 80.262978 },
  { sno: 994, region: 'South Chennai', taluk: 'Thousandlights', address: '5/6 Muthuramalingam Devar Salai, Nandanam Godown', name: 'Nandanam 2', code: '02MA004SC', areaType: 'Urban', category: 'Full Time', lat: 13.03077, lng: 80.241846 },

  // 997-1172 Tenkasi
  { sno: 997, region: 'Tenkasi', taluk: 'Alangulam', address: 'Adaikalapattinam, Alangulam Tk', name: 'Adaikkalapattanam', code: '27KA015PN', areaType: 'Rural', category: 'Full Time', lat: 8.889356, lng: 77.430553 },
  { sno: 998, region: 'Tenkasi', taluk: 'Alangulam', address: 'Nettur Road, Santhai Valagam, Alangulam', name: 'Alangulam 1', code: '27KA025PY', areaType: 'Urban', category: 'Full Time', lat: 8.86698, lng: 77.503665 },
  { sno: 1037, region: 'Tenkasi', taluk: 'Kadayanallur', address: 'Kamatchiamman Kovil St, Melakadayanallur', name: 'Kadayanallur 11', code: '27LA007PN', areaType: 'Urban', category: 'Full Time', lat: 9.070918, lng: 77.343511 },
  { sno: 1054, region: 'Tenkasi', taluk: 'Kadayanallur', address: 'Mettu Theru, Puliyangudi', name: 'Puliangudi 1', code: '27LA020PN', areaType: 'Urban', category: 'Full Time', lat: 9.176165, lng: 77.395917 },
  { sno: 1072, region: 'Tenkasi', taluk: 'Sankarankoil', address: 'Ilavankulam Road, Sankarankovil', name: 'Ilavankulam Road Sankarankovil', code: '27CA007PN', areaType: 'Urban', category: 'Full Time', lat: 9.179157, lng: 77.541303 },
  { sno: 1098, region: 'Tenkasi', taluk: 'Shenkottai', address: 'KC Road, Shenkottai', name: 'Shenkottai 1', code: '27EA001PY', areaType: 'Urban', category: 'Full Time', lat: 8.970481, lng: 77.245724 },
  { sno: 1114, region: 'Tenkasi', taluk: 'Sivagiri', address: 'Thergu Ratha Veethi, Vasudevanallur', name: 'Vasudevanallur 1', code: '27FA007PY', areaType: 'Urban', category: 'Full Time', lat: 9.238133, lng: 77.414886 },
  { sno: 1117, region: 'Tenkasi', taluk: 'Tenkasi', address: '172, RC School St, Keelakadayam', name: 'Amudam Kadayam 1', code: '27GA008PN', areaType: 'Rural', category: 'Full Time', lat: 8.822595, lng: 77.375216 },
  { sno: 1123, region: 'Tenkasi', taluk: 'Tenkasi', address: 'Main Road, Courtallam Falls', name: 'Courtallam Amutham', code: '27DA018PN', areaType: 'Urban', category: 'Full Time', lat: 8.935508, lng: 77.269829 },
  { sno: 1143, region: 'Tenkasi', taluk: 'Tenkasi', address: '108D/76 Vadakku Ratha Veethi, Tenkasi', name: 'North Car Street Tenkasi', code: '27DA002PN', areaType: 'Urban', category: 'Full Time', lat: 8.957813, lng: 77.307221 },

  // 1173-1203 The Nilgiris
  { sno: 1173, region: 'The Nilgiris', taluk: 'Coonoor', address: 'TNCSC Godown Complex, Ralley Compound, Coonoor', name: 'Upper Coonoor CRS', code: '10BA001PN', areaType: 'Urban', category: 'Full Time', lat: 11.349978, lng: 76.796838 },
  { sno: 1182, region: 'The Nilgiris', taluk: 'Gudalur', address: 'Thuppukuttipet, Gudalur', name: 'Thuppukuttipet Gudalur', code: '10DA001PN', areaType: 'Urban', category: 'Full Time', lat: 11.499128, lng: 76.484153 },
  { sno: 1187, region: 'The Nilgiris', taluk: 'Kothagiri', address: 'Carebetta, Donnington, Kothagiri', name: 'Donnington Kothagiri', code: '10CA001PN', areaType: 'Urban', category: 'Full Time', lat: 11.423421, lng: 76.863743 },
  { sno: 1200, region: 'The Nilgiris', taluk: 'Udagamandalam', address: '110 Goodshed Road, Ooty, 643001', name: 'RO Complex Ooty', code: '10AA001PN', areaType: 'Urban', category: 'Full Time', lat: 11.412866, lng: 76.702796 },

  // 1204-1308 Thirunelveli
  { sno: 1204, region: 'Thirunelveli', taluk: 'Ambasamudram', address: 'West Car Street, Ambasamudram', name: 'Ambasamudram 1', code: '27GA001PN', areaType: 'Urban', category: 'Full Time', lat: 8.700298, lng: 77.45194 },
  { sno: 1216, region: 'Thirunelveli', taluk: 'Cheranmahadevi', address: 'Payanalan Street, Mukkudal', name: 'Mukkudal', code: '27OA001PN', areaType: 'Urban', category: 'Full Time', lat: 8.741439, lng: 77.523412 },
  { sno: 1247, region: 'Thirunelveli', taluk: 'Palayamkottai', address: 'Samathanapuram, Palayamkottai', name: 'Tiruchendur Road Palayamkottai', code: '27BA001PN', areaType: 'Urban', category: 'Full Time', lat: 8.723985, lng: 77.744287 },
  { sno: 1270, region: 'Thirunelveli', taluk: 'Radhapuram', address: 'Bypass Main Road, Koodankulam', name: 'Koodankulam CRS', code: '27IA006PN', areaType: 'Rural', category: 'Full Time', lat: 8.193856, lng: 77.705843 },
  { sno: 1277, region: 'Thirunelveli', taluk: 'Thirunelveli', address: '46/22 Sorkavasal East Street, Tirunelveli', name: 'C.N.Village Tirunelveli', code: '27AA001PY', areaType: 'Urban', category: 'Full Time', lat: 8.721524, lng: 77.701931 },

  // 1309-1314 Thirupathur
  { sno: 1309, region: 'Thirupathur', taluk: 'Ambur', address: 'Ambur Town, 635802', name: 'Amutham – Iii Ambur', code: '04IA003PN', areaType: 'Urban', category: 'Full Time', lat: 12.788997, lng: 78.717104 },
  { sno: 1311, region: 'Thirupathur', taluk: 'Thirupathur', address: 'Gandhi Nagar, Tirupathur Town', name: 'Amutham – I Tirupathur', code: '04FA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.491655, lng: 78.560637 },
  { sno: 1313, region: 'Thirupathur', taluk: 'Vaniyambadi', address: 'Pilliyar Koil Street, New Town, Vaniyambadi', name: 'Amutham – I Vaniyambadi', code: '04GA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.672271, lng: 78.621792 },

  // 1315-1321 Thiruvallur
  { sno: 1315, region: 'Thiruvallur', taluk: 'Avadi', address: '17A, Dharmaraja Kovil St, Thiruninravur', name: 'Amutham Retail Thiruninravur', code: '01HA001PN', areaType: 'Urban', category: 'Full Time', lat: 13.117406, lng: 80.027797 },
  { sno: 1317, region: 'Thiruvallur', taluk: 'Ponneri', address: 'No 57, MGR Nagar, NGO Nagar Extension, Ponneri', name: 'Amutham Retail Ponneri', code: '01BA001PN', areaType: 'Urban', category: 'Full Time', lat: 13.330878, lng: 80.190471 },
  { sno: 1318, region: 'Thiruvallur', taluk: 'Poonamallee', address: '17/12 Dharmaraja Kovil St, Poonamallee', name: 'Amutham Retail Poonamallee', code: '01EA002PN', areaType: 'Urban', category: 'Full Time', lat: 13.050116, lng: 80.100698 },
  { sno: 1320, region: 'Thiruvallur', taluk: 'Thiruttani', address: '25, Radhakrishnan St, Murugappa Nagar, Thiruttani', name: 'Amutham Retail Thiruttani', code: '01FA001PN', areaType: 'Urban', category: 'Full Time', lat: 13.176763, lng: 79.616237 },

  // 1322-1324 Thiruvannamalai
  { sno: 1322, region: 'Thiruvannamalai', taluk: 'Cheyyar', address: 'Chinna Street, Cheyyar', name: 'Amutham 1 Cheyyar', code: '05FA001PN', areaType: 'Rural', category: 'Full Time', lat: 12.657586, lng: 79.543975 },

  // 1325-1445 Thoothukudi
  { sno: 1325, region: 'Thoothukudi', taluk: 'Eral', address: 'Vazhavallan, Eral', name: 'Eral CRS', code: '26BA001PN', areaType: 'Rural', category: 'Full Time', lat: 8.625833, lng: 78.027633 },
  { sno: 1333, region: 'Thoothukudi', taluk: 'Ettayapuram', address: '8/93, Keelavasal, Ettayapuram', name: 'Ettayapuram-I', code: '26HA001PN', areaType: 'Rural', category: 'Full Time', lat: 9.145, lng: 78.144584 },
  { sno: 1340, region: 'Thoothukudi', taluk: 'Kovilpatti', address: 'Kamaraj Middle School, Kovilpatti', name: 'Ars-I Kovilpatti', code: '26EA001PN', areaType: 'Urban', category: 'Full Time', lat: 9.174122, lng: 77.871067 },
  { sno: 1370, region: 'Thoothukudi', taluk: 'Srivaikundam', address: 'Srivaikundam Town', name: 'Srivaikundam-Ii', code: '26BA001PN', areaType: 'Urban', category: 'Full Time', lat: 8.634331, lng: 77.909238 },
  { sno: 1381, region: 'Thoothukudi', taluk: 'Thiruchendur', address: 'Aavudayarkulam, Thiruchendur', name: 'Thiruchendur-1', code: '26CA0011PN', areaType: 'Urban', category: 'Part Time', lat: 8.497077, lng: 78.116447 },
  { sno: 1399, region: 'Thoothukudi', taluk: 'Thoothukudi', address: '2, P&T Colony, 3rd Mile, Thoothukudi', name: '3Rd Mile Thoothukudi', code: '26AA017PN', areaType: 'Urban', category: 'Full Time', lat: 8.792279, lng: 78.113703 },

  // 1446-1469 Tiruppur
  { sno: 1446, region: 'Tiruppur', taluk: 'Avinashi', address: '4, Madathupalayam Road, Avinashi-641654', name: 'Crs No.17-I Avinashi', code: '32AA001PN', areaType: 'Urban', category: 'Full Time', lat: 11.200855, lng: 77.265999 },
  { sno: 1452, region: 'Tiruppur', taluk: 'Tiruppur', address: '24, Valarmathi Valagam, P.N.Road, Tiruppur-641605', name: 'Crs No.19 Tiruppur', code: '32BA001PN', areaType: 'Urban', category: 'Full Time', lat: 11.109357, lng: 77.34005 },
  { sno: 1469, region: 'Tiruppur', taluk: 'Udumalpettai', address: '1A, Singappur Nagar, Udumalpet-642126', name: 'Crs No.22 Udumalpet', code: '32IA001PN', areaType: 'Urban', category: 'Full Time', lat: 10.5814, lng: 77.24084 },

  // 1470-1490 Trichy
  { sno: 1470, region: 'Trichy', taluk: 'Lalgudi', address: '93, Melavethi, Near Thermutty, Lalgudi', name: 'Lalgudi CRS', code: '13DA001PN', areaType: 'Rural', category: 'Full Time', lat: 10.87043, lng: 78.818974 },
  { sno: 1472, region: 'Trichy', taluk: 'Manapparai', address: 'Trichy Road, Manapparai', name: 'Manapparai-I', code: '13CA001PN', areaType: 'Urban', category: 'Full Time', lat: 10.625202, lng: 78.417773 },
  { sno: 1476, region: 'Trichy', taluk: 'Srirangam', address: '9, New Bus Stand, Srirangam, Trichy', name: 'Srirangam -I', code: '13BA001PN', areaType: 'Urban', category: 'Full Time', lat: 10.85545, lng: 78.695843 },
  { sno: 1486, region: 'Trichy', taluk: 'Trichy West', address: 'District Court Campus, Heber Road, Trichy', name: 'Thennur-1 Trichy', code: '13AA001PN', areaType: 'Urban', category: 'Full Time', lat: 10.814706, lng: 78.68389 },

  // 1491-1526 Vellore
  { sno: 1491, region: 'Vellore', taluk: 'Katpadi', address: 'R.T. Center, Sithoor Road, Katpadi', name: 'Tharapadavedu - 1 Katpadi', code: '04HA004PN', areaType: 'Urban', category: 'Full Time', lat: 12.976961, lng: 79.133476 },
  { sno: 1497, region: 'Vellore', taluk: 'Kudiyatham', address: 'Anjumman Street, Kudiyatham', name: 'Amutham 4 Kudiyatham', code: '04EA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.946751, lng: 78.865273 },
  { sno: 1499, region: 'Vellore', taluk: 'Pernambat', address: 'Tannery Association, Pernambat', name: 'Pernambet Amutham', code: '04MA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.932131, lng: 78.715363 },
  { sno: 1500, region: 'Vellore', taluk: 'Vellore', address: 'Leather Godown Street, Old Town, Vellore', name: 'Amutham Oldtown 1 Vellore', code: '04AA001PN', areaType: 'Urban', category: 'Full Time', lat: 12.914455, lng: 79.140155 },
  { sno: 1502, region: 'Vellore', taluk: 'Vellore', address: '20, Sukkaiya Vathiyar Street, Saidapet, Vellore', name: 'Amutham Saidapet Vellore', code: '04AA003PN', areaType: 'Urban', category: 'Full Time', lat: 12.922491, lng: 79.136575 },

  // 1527-1560 Virudhunagar
  { sno: 1527, region: 'Virudhunagar', taluk: 'Aruppukottai', address: 'Nallur Muslim St, Aruppukottai', name: '19 Aruppukottai', code: '24BA001PN', areaType: 'Urban', category: 'Full Time', lat: 9.514842, lng: 78.096843 },
  { sno: 1529, region: 'Virudhunagar', taluk: 'Rajapalayam', address: 'Nattukal Raja Street, Rajapalayam', name: '1 Rajapalayam', code: '24DA001PN', areaType: 'Urban', category: 'Full Time', lat: 9.445409, lng: 77.553877 },
  { sno: 1533, region: 'Virudhunagar', taluk: 'Sattur', address: '28, Coronation Road, Sattur', name: '15 Sattur', code: '24GA001PN', areaType: 'Urban', category: 'Full Time', lat: 9.35519, lng: 77.91722 },
  { sno: 1536, region: 'Virudhunagar', taluk: 'Sivakasi', address: '26, Peria Pallivasal St, Sivakasi', name: '7 Sivakasi', code: '24FA001PN', areaType: 'Urban', category: 'Full Time', lat: 9.452741, lng: 77.799163 },
  { sno: 1554, region: 'Virudhunagar', taluk: 'Srivilliputhur', address: 'Koonankulam North St, Srivilliputhur', name: '4 Srivilliputhur', code: '24EA001PN', areaType: 'Urban', category: 'Full Time', lat: 9.515504, lng: 77.631723 },
  { sno: 1559, region: 'Virudhunagar', taluk: 'Virudhunagar', address: 'Kattaiyapuram, Virudhunagar', name: '17 Virudhunagar', code: '24AA001PN', areaType: 'Urban', category: 'Full Time', lat: 9.577488, lng: 77.954874 },
  { sno: 1560, region: 'Virudhunagar', taluk: 'Virudhunagar', address: '52, Fathima Nagar, Virudhunagar', name: '18 Fathima Nagar Virudhunagar', code: '24AA002PN', areaType: 'Urban', category: 'Full Time', lat: 9.580295, lng: 77.951127 },
];
