let crm_countries = document.getElementById("crm_countries");

export const ServiceType = [
  { value: "New Project", label: "New Project" },
  { value: "Resale", label: "Resale" },
  { value: "Rent", label: "Rent" },
];

export const PropertyType = [
  { value: "Residential", label: "Residential" },
  { value: "Commercial", label: "Commercial" },
];

export const PropertyCategory = [
  { value: "Apartment", label: "Apartment", type: "Residential" },
  { value: "Townhouse", label: "Townhouse", type: "Residential" },
  { value: "Hotel apartment", label: "Hotel apartment", type: "Residential" },
  { value: "Bunglow", label: "Bunglow", type: "Residential" },
  { value: "Duplex", label: "Duplex", type: "Residential" },
  { value: "Farm House", label: "Farm House", type: "Residential" },
  {
    value: "Independent House",
    label: "Independent House",
    type: "Residential",
  },
  { value: "Pent House", label: "Pent House", type: "Residential" },
  {
    value: "Service/Studio Apartments",
    label: "Service/Studio Apartments",
    type: "Residential",
  },
  { value: "Plot", label: "Plot", type: "Residential" },
  { value: "Villa", label: "Villa", type: "Residential" },
  {
    value: "Commercial Office",
    label: "Commercial Office",
    type: "Commercial",
  },
  { value: "Commercial Shops", label: "Commercial Shops", type: "Commercial" },
  {
    value: "Commercial Showrooms",
    label: "Commercial Showrooms",
    type: "Commercial",
  },
  { value: "Commercial Space", label: "Commercial Space", type: "Commercial" },
  { value: "Hotels/Resorts", label: "Hotels/Resorts", type: "Commercial" },
  {
    value: "Office Space In It/Buisness Park",
    label: "Office Space In It/Buisness Park",
    type: "Commercial",
  },
  {
    value: "Commercial Warehouse",
    label: "Commercial Warehouse",
    type: "Commercial",
  },
  {
    value: "Godowns and Plots",
    label: "Godowns and Plots",
    type: "Commercial",
  },
  { value: "Factories", label: "Factories", type: "Commercial" },
  {
    value: "Plant and Machinery",
    label: "Plant and Machinery",
    type: "Commercial",
  },
];

export const PropertyArea = [
  { value: "Sq Feet", label: "Sq Feet" },
  { value: "Sq Meter", label: "Sq Meter" },
  { value: "Sq Yards", label: "Sq Yards" },
  { value: "Acres", label: "Acres" },
  { value: "Marla", label: "Marla" },
  { value: "Cents", label: "Cents" },
  { value: "Biggha", label: "Biggha" },
  { value: "Kottah", label: "Kottah" },
  { value: "Canals", label: "Canals" },
  { value: "Grounds", label: "Grounds" },
  { value: "Ares", label: "Ares" },
  { value: "Guntha", label: "Guntha" },
  { value: "Biswa", label: "Biswa" },
  { value: "Hectars", label: "Hectars" },
  { value: "Roods", label: "Roods" },
  { value: "Chataks", label: "Chataks" },
  { value: "Perch", label: "Perch" },
];
export const TypeOfBuyer = [
  { value: "Investor", label: "Investor" },
  { value: "End User", label: "End User" },
];
export const TypeOfInvestor = [
  { value: "Long Term Rental", label: "Long Term Rental" },
  { value: "Short Term Rental", label: "Short Term Rental" },
  { value: "Capital Appreciation", label: "Capital Appreciation" },
  { value: "Homeowner ", label: "Homeowner " },
];
export const PostHandover = [
  { value: "1 Year", label: "1 Year" },
  { value: "2 Years", label: "2 Years" },
  { value: "3 Years", label: "3 Years" },
  { value: "4 Years", label: "4 Years" },
  { value: "5 Years", label: "5 Years" },
  { value: "6 Years", label: "6 Years" },
  { value: "7 Years", label: "7 Years" },
  { value: "8 Years", label: "8 Years" },
  { value: "9 Years", label: "9 Years" },
  { value: "10 years or more", label: "10 Years or More" },
];

export const YearRange = [
  { value: "2000", label: "2000" },
  { value: "2001", label: "2001" },
  { value: "2002", label: "2002" },
  { value: "2003", label: "2003" },
  { value: "2004", label: "2004" },
  { value: "2005", label: "2005" },
  { value: "2006", label: "2006" },
  { value: "2007", label: "2007" },
  { value: "2008", label: "2008" },
  { value: "2009", label: "2009" },
  { value: "2010", label: "2010" },
  { value: "2011", label: "2011" },
  { value: "2012", label: "2012" },
  { value: "2013", label: "2013" },
  { value: "2014", label: "2014" },
  { value: "2015", label: "2015" },
  { value: "2016", label: "2016" },
  { value: "2017", label: "2017" },
  { value: "2018", label: "2018" },
  { value: "2019", label: "2019" },
  { value: "2020", label: "2020" },
  { value: "2021", label: "2021" },
  { value: "2022", label: "2022" },
  { value: "2023", label: "2023" },
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" },
  { value: "2027", label: "2027" },
  { value: "2028", label: "2028" },
  { value: "2029", label: "2029" },
  { value: "2030", label: "2030" },
  { value: "2031", label: "2031" },
  { value: "2032", label: "2032" },
  { value: "2033", label: "2033" },
  { value: "2034", label: "2034" },
  { value: "2035", label: "2035" }
];


let PropertyPrice = [
  // { value: "(₹) Rupee", label: "(₹) Rupee" },
  // { value: "AED", label: "AED" },
  // { value: "($) Dollar", label: "($) Dollar" },
  // { value: "(€) Euro", label: "(€) Euro" },
  // { value: "(฿) Thai Baht", label: "(฿) Thai Baht" },
  // { value: "(₺) Turkish lira", label: "(₺) Turkish lira" },
];
let initialCurrencyValue = null;

if (crm_countries.value.includes("India")) {
  PropertyPrice.push(
    { value: "Rupee", label: "Rupee" },
    { value: "AED", label: "AED" }
  );
  initialCurrencyValue = { value: "Rupee", label: "Rupee" }; // Set initial value to Rupee
} else if (crm_countries.value.includes("UAE")) {
  PropertyPrice.push(
    { value: "AED", label: "AED" },
    { value: "Rupee", label: "Rupee" }
  );
  initialCurrencyValue = { value: "AED", label: "AED" }; // Set initial value to AED
} else {
  PropertyPrice.push(
    { value: "Rupee", label: "Rupee" },
    { value: "AED", label: "AED" }
  );
}

export { PropertyPrice, initialCurrencyValue };

let Ccode = [
  // { value: "91", label: "91" },
  // { value: "971", label: "971" },
  // { value: "120", label: "120" },
  // { value: "145", label: "145" },
];

if (crm_countries.value.includes("India")) {
  Ccode.push(...[{ value: "91", label: "91" }]);
}

if (crm_countries.value.includes("UAE")) {
  Ccode.push(...[{ value: "971", label: "971" }]);
}

export { Ccode };

export const ActivityStatus = [
  { value: "Activate", label: "Activate" },
  { value: "In-Active", label: "In-Active" },
];

export const SchedulerType = [
  { value: "Normal Scheduler", label: "Normal Scheduler" },
  { value: "Round Robin Scheduler", label: "Round Robin Scheduler" },
];

export const SchedulerStatus = [
  { value: "Activate", label: "Activate" },
  { value: "In-Active", label: "In-Active" },
];

export const LeadAssignType = [
  { value: "Manually Assign", label: "Manualy Assign" },
  { value: "Normal Scheduler", label: "Normal Scheduler" },
  { value: "Round Robin Scheduler", label: "Round Robin Scheduler" },
];

export const dubaiLocalities = [
  { value: "Downtown Dubai", label: "Downtown Dubai" },
  { value: "Business Bay", label: "Business Bay" },
  { value: "Dubai Marina", label: "Dubai Marina" },
  { value: "Palm Jumeirah", label: "Palm Jumeirah" },
  { value: "Jumeirah Lake Towers (JLT)", label: "Jumeirah Lake Towers (JLT)" },
  {
    value: "Jumeirah Village Circle (JVC)",
    label: "Jumeirah Village Circle (JVC)",
  },
  { value: "Arabian Ranches", label: "Arabian Ranches" },
  { value: "Dubai Hills Estate", label: "Dubai Hills Estate" },
  { value: "Al Barsha", label: "Al Barsha" },
  { value: "The Greens", label: "The Greens" },
  { value: "The Springs", label: "The Springs" },
  { value: "The Meadows", label: "The Meadows" },
  { value: "Jumeirah Islands", label: "Jumeirah Islands" },
  {
    value: "Jumeirah Beach Residence (JBR)",
    label: "Jumeirah Beach Residence (JBR)",
  },
  { value: "Dubai Silicon Oasis (DSO)", label: "Dubai Silicon Oasis (DSO)" },
  { value: "International City", label: "International City" },
  { value: "Al Nahda", label: "Al Nahda" },
  { value: "Deira", label: "Deira" },
  { value: "Satwa", label: "Satwa" },
  { value: "Muhaisnah", label: "Muhaisnah" },
  { value: "Discovery Gardens", label: "Discovery Gardens" },
  {
    value: "Dubai Investment Park (DIP)",
    label: "Dubai Investment Park (DIP)",
  },
  { value: "Al Qusais", label: "Al Qusais" },
  { value: "Emirates Hills", label: "Emirates Hills" },
  { value: "Al Safa", label: "Al Safa" },
  { value: "Jumeirah 1", label: "Jumeirah 1" },
  { value: "Jumeirah 2", label: "Jumeirah 2" },
  { value: "Jumeirah 3", label: "Jumeirah 3" },
  { value: "Umm Suqeim", label: "Umm Suqeim" },
  { value: "Zabeel", label: "Zabeel" },
  { value: "Bluewaters Island", label: "Bluewaters Island" },
  { value: "City Walk", label: "City Walk" },
  { value: "Sheikh Zayed Road", label: "Sheikh Zayed Road" },
  {
    value: "DIFC (Dubai International Financial Centre)",
    label: "DIFC (Dubai International Financial Centre)",
  },
  { value: "Al Quoz", label: "Al Quoz" },
  { value: "Dubai Production City", label: "Dubai Production City" },
  { value: "Dubai South", label: "Dubai South" },
  { value: "Dubai Design District (D3)", label: "Dubai Design District (D3)" },
  { value: "Bur Dubai", label: "Bur Dubai" },
  { value: "Karama", label: "Karama" },
  {
    value: "Al Bastakiya (Al Fahidi Historical Neighborhood)",
    label: "Al Bastakiya (Al Fahidi Historical Neighborhood)",
  },
  { value: "Mirdif", label: "Mirdif" },
  { value: "Dubai Festival City", label: "Dubai Festival City" },
];

// export const uaeLocalities = [
//   // Dubai
//   { emirate: "Dubai", locality: "Downtown Dubai" },
//   { emirate: "Dubai", locality: "Business Bay" },
//   { emirate: "Dubai", locality: "Dubai Marina" },
//   { emirate: "Dubai", locality: "Palm Jumeirah" },
//   { emirate: "Dubai", locality: "Jumeirah Lake Towers (JLT)" },
//   { emirate: "Dubai", locality: "Jumeirah Village Circle (JVC)" },
//   { emirate: "Dubai", locality: "Arabian Ranches" },
//   { emirate: "Dubai", locality: "Dubai Hills Estate" },
//   { emirate: "Dubai", locality: "Al Barsha" },
//   { emirate: "Dubai", locality: "The Greens" },
//   { emirate: "Dubai", locality: "The Springs" },
//   { emirate: "Dubai", locality: "The Meadows" },
//   { emirate: "Dubai", locality: "Jumeirah Islands" },
//   { emirate: "Dubai", locality: "Jumeirah Beach Residence (JBR)" },
//   { emirate: "Dubai", locality: "Dubai Silicon Oasis (DSO)" },
//   { emirate: "Dubai", locality: "International City" },
//   { emirate: "Dubai", locality: "Al Nahda" },
//   { emirate: "Dubai", locality: "Deira" },
//   { emirate: "Dubai", locality: "Satwa" },
//   { emirate: "Dubai", locality: "Muhaisnah" },
//   { emirate: "Dubai", locality: "Discovery Gardens" },
//   { emirate: "Dubai", locality: "Dubai Investment Park (DIP)" },
//   { emirate: "Dubai", locality: "Al Qusais" },
//   { emirate: "Dubai", locality: "Emirates Hills" },
//   { emirate: "Dubai", locality: "Al Safa" },
//   { emirate: "Dubai", locality: "Jumeirah 1" },
//   { emirate: "Dubai", locality: "Jumeirah 2" },
//   { emirate: "Dubai", locality: "Jumeirah 3" },
//   { emirate: "Dubai", locality: "Umm Suqeim" },
//   { emirate: "Dubai", locality: "Zabeel" },
//   { emirate: "Dubai", locality: "Bluewaters Island" },
//   { emirate: "Dubai", locality: "City Walk" },
//   { emirate: "Dubai", locality: "Sheikh Zayed Road" },
//   { emirate: "Dubai", locality: "DIFC (Dubai International Financial Centre)" },
//   { emirate: "Dubai", locality: "Al Quoz" },
//   { emirate: "Dubai", locality: "Dubai Production City" },
//   { emirate: "Dubai", locality: "Dubai South" },
//   { emirate: "Dubai", locality: "Dubai Design District (D3)" },
//   { emirate: "Dubai", locality: "Bur Dubai" },
//   { emirate: "Dubai", locality: "Karama" },
//   { emirate: "Dubai", locality: "Al Bastakiya (Al Fahidi Historical Neighborhood)" },
//   { emirate: "Dubai", locality: "Mirdif" },
//   { emirate: "Dubai", locality: "Dubai Festival City" },

//   // Abu Dhabi
//   { emirate: "Abu Dhabi", locality: "Downtown Abu Dhabi" },
//   { emirate: "Abu Dhabi", locality: "Al Reem Island" },
//   { emirate: "Abu Dhabi", locality: "Al Raha Beach" },
//   { emirate: "Abu Dhabi", locality: "Yas Island" },
//   { emirate: "Abu Dhabi", locality: "Khalifa City" },
//   { emirate: "Abu Dhabi", locality: "Mohammed Bin Zayed City" },
//   { emirate: "Abu Dhabi", locality: "Al Bateen" },
//   { emirate: "Abu Dhabi", locality: "Al Khalidiyah" },
//   { emirate: "Abu Dhabi", locality: "Al Mushrif" },
//   { emirate: "Abu Dhabi", locality: "Al Markaziyah" },
//   { emirate: "Abu Dhabi", locality: "Al Najda Street" },
//   { emirate: "Abu Dhabi", locality: "Al Maqta" },
//   { emirate: "Abu Dhabi", locality: "Corniche Road" },
//   { emirate: "Abu Dhabi", locality: "Al Muroor" },
//   { emirate: "Abu Dhabi", locality: "Al Wathba" },
//   { emirate: "Abu Dhabi", locality: "Al Shahama" },
//   { emirate: "Abu Dhabi", locality: "Al Dhafrah" },
//   { emirate: "Abu Dhabi", locality: "Zayed Sports City" },
//   { emirate: "Abu Dhabi", locality: "Saadiyat Island" },
//   { emirate: "Abu Dhabi", locality: "Al Falah" },

//   // Sharjah
//   { emirate: "Sharjah", locality: "Al Nahda" },
//   { emirate: "Sharjah", locality: "Al Qasimia" },
//   { emirate: "Sharjah", locality: "Al Majaz" },
//   { emirate: "Sharjah", locality: "Al Taawun" },
//   { emirate: "Sharjah", locality: "Al Buhaira Corniche" },
//   { emirate: "Sharjah", locality: "Al Khan" },
//   { emirate: "Sharjah", locality: "Al Sharq" },
//   { emirate: "Sharjah", locality: "Al Jadaf" },
//   { emirate: "Sharjah", locality: "Al Muwailah" },
//   { emirate: "Sharjah", locality: "Al Raqaib" },
//   { emirate: "Sharjah", locality: "Al Yarmook" },
//   { emirate: "Sharjah", locality: "Al Mirgab" },
//   { emirate: "Sharjah", locality: "Al Gharb" },
//   { emirate: "Sharjah", locality: "Al Sabkha" },

//   // Ajman
//   { emirate: "Ajman", locality: "Ajman City Centre" },
//   { emirate: "Ajman", locality: "Al Nuaimiya" },
//   { emirate: "Ajman", locality: "Al Mowaihat" },
//   { emirate: "Ajman", locality: "Al Hamidiyah" },
//   { emirate: "Ajman", locality: "Al Rashidiya" },
//   { emirate: "Ajman", locality: "Al Jurf" },
//   { emirate: "Ajman", locality: "Al Yasmeen" },
//   { emirate: "Ajman", locality: "Al Muwaileh" },

//   // Fujairah
//   { emirate: "Fujairah", locality: "Fujairah City Centre" },
//   { emirate: "Fujairah", locality: "Al Faseel" },
//   { emirate: "Fujairah", locality: "Al Hail" },
//   { emirate: "Fujairah", locality: "Al Bidyah" },
//   { emirate: "Fujairah", locality: "Dibba Al Fujairah" },
//   { emirate: "Fujairah", locality: "Al Matar" },

//   // Ras Al Khaimah
//   { emirate: "Ras Al Khaimah", locality: "Ras Al Khaimah City" },
//   { emirate: "Ras Al Khaimah", locality: "Al Dhait" },
//   { emirate: "Ras Al Khaimah", locality: "Al Nakheel" },
//   { emirate: "Ras Al Khaimah", locality: "Al Mamourah" },
//   { emirate: "Ras Al Khaimah", locality: "Al Muwaihat" },
//   { emirate: "Ras Al Khaimah", locality: "Al Hamra Village" },
//   { emirate: "Ras Al Khaimah", locality: "Al Marjan Island" },

//   // Umm Al Quwain
//   { emirate: "Umm Al Quwain", locality: "Umm Al Quwain City" },
//   { emirate: "Umm Al Quwain", locality: "Al Salama" },
//   { emirate: "Umm Al Quwain", locality: "Al Jurf" },
//   { emirate: "Umm Al Quwain", locality: "Al Raas" },
//   { emirate: "Umm Al Quwain", locality: "Al Qarayen" },
//   { emirate: "Umm Al Quwain", locality: "Al Humaidiya" },

//   // Other Regions
//   { emirate: "Abu Dhabi", locality: "Al Ain" },
//   { emirate: "Abu Dhabi", locality: "Liwa" },
//   { emirate: "Abu Dhabi", locality: "Al Ghayathi" },
//   { emirate: "Sharjah", locality: "Khor Fakkan" },
// ];
