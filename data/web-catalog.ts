export type ProductProject = {
  title: string;
  client: string;
  location: string;
  summary: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  size: string;
  weight: string;
  pricing: string;
  material: string;
  thickness: string;
  visibility: string;
  warranty: string;
  bestFor: string[];
  features: string[];
  realProjects: ProductProject[];
};

export type WebWork = {
  id: string;
  title: string;
  client: string;
  location: string;
  productSlug: string;
  status: string;
  summary: string;
};

export const websiteProducts: Product[] = [
  {
    slug: "retro-reflective-road-signs",
    name: "Retro Reflective Road Signs",
    category: "Highway Safety Boards",
    image: "/images/highway-guidance.svg",
    gallery: [
      "/images/highway-guidance.svg",
      "/images/construction-diversion.svg",
      "/images/factory-safety.svg",
    ],
    shortDescription:
      "Mandatory, caution, and directional boards for highways, city roads, and plant approaches.",
    description:
      "Reflective road signboards prepared for strong readability, weather resistance, and clean mounting across highways, main roads, and internal transport corridors.",
    size: "600 x 600 mm to 2400 x 1200 mm",
    weight: "4 kg to 28 kg",
    pricing: "Starting from Rs. 1,850 per board",
    material: "ACP sheet, reflective sheeting, GI clamp set",
    thickness: "3 mm ACP with 1.2 mm support options",
    visibility: "High day and night visibility",
    warranty: "12 month finish and fixing support",
    bestFor: ["National highways", "Plant entry roads", "Township approaches"],
    features: [
      "HIP and engineering grade reflective options",
      "ACP, GI, and MS support structures",
      "Lane guidance, warning, and regulatory layouts",
    ],
    realProjects: [
      {
        title: "NH-48 Overhead Direction Board Package",
        client: "Western Corridor Infra",
        location: "Pune - Satara",
        summary:
          "Supply and installation of gantry-mounted guide signs, shoulder caution boards, and kilometer plates.",
      },
      {
        title: "Industrial Township Entry Sign System",
        client: "Prime Logistic Parks",
        location: "Chakan",
        summary:
          "Directional sign package for truck circulation, visitor entry lanes, and restricted movement zones.",
      },
    ],
  },
  {
    slug: "industrial-safety-boards",
    name: "Industrial Safety Boards",
    category: "Factory Safety Boards",
    image: "/images/factory-safety.svg",
    gallery: [
      "/images/factory-safety.svg",
      "/images/highway-guidance.svg",
      "/images/construction-diversion.svg",
    ],
    shortDescription:
      "Hazard, PPE, emergency, and process safety boards for factories, warehouses, and plants.",
    description:
      "Safety communication boards designed for production areas, utility rooms, loading zones, and worker circulation points where clear messaging matters every day.",
    size: "300 x 450 mm to 1800 x 1200 mm",
    weight: "1.5 kg to 18 kg",
    pricing: "Starting from Rs. 480 per board",
    material: "Vinyl print, ACP, foam sheet, MS frame options",
    thickness: "2 mm to 3 mm panel range",
    visibility: "Matte indoor and reflective outdoor options",
    warranty: "6 to 12 month support depending on use area",
    bestFor: ["Factories", "Warehouses", "Process plants"],
    features: [
      "PPE, no-entry, and hazard communication boards",
      "Emergency route and assembly point signage",
      "Indoor and outdoor mounting formats",
    ],
    realProjects: [
      {
        title: "Plant Safety Upgrade Rollout",
        client: "PrimeForge Industries",
        location: "Chakan MIDC",
        summary:
          "Installed PPE instructions, forklift movement boards, utility warnings, and emergency assembly signs.",
      },
      {
        title: "Warehouse Compliance Sign Set",
        client: "SwiftLog Warehousing",
        location: "Bhiwandi",
        summary:
          "Developed hazard labels, route markers, restricted zone notices, and loading bay safety boards.",
      },
    ],
  },
  {
    slug: "construction-diversion-boards",
    name: "Construction Diversion Boards",
    category: "Temporary Work-Zone Boards",
    image: "/images/construction-diversion.svg",
    gallery: [
      "/images/construction-diversion.svg",
      "/images/highway-guidance.svg",
      "/images/factory-safety.svg",
    ],
    shortDescription:
      "Diversion boards, barricade graphics, and warning systems for active road and metro work zones.",
    description:
      "Temporary site signage prepared for phased construction, public diversions, contractor movement, and pedestrian rerouting in active project areas.",
    size: "900 x 600 mm to 2400 x 1500 mm",
    weight: "6 kg to 32 kg",
    pricing: "Starting from Rs. 2,250 per board",
    material: "ACP, reflective sheeting, fabricated frame",
    thickness: "3 mm ACP with heavy-duty mounting frame",
    visibility: "Reflective for low-light work zones",
    warranty: "Execution-period support and replacement assistance",
    bestFor: ["Metro works", "Road widening", "Bridge construction"],
    features: [
      "Detour arrows and caution communication",
      "Barricade-mounted graphics and route signs",
      "Quick deployment for temporary stages",
    ],
    realProjects: [
      {
        title: "Metro Corridor Diversion Setup",
        client: "Urban Rail Contractors",
        location: "Nagpur",
        summary:
          "Temporary traffic diversion boards, worker safety signs, and public guidance around barricaded stretches.",
      },
      {
        title: "Flyover Repair Traffic Control Boards",
        client: "Civic Structure Projects",
        location: "Nashik",
        summary:
          "Night-visible warning boards, median-mounted diversion signs, and pedestrian redirection panels.",
      },
    ],
  },
  {
    slug: "wayfinding-navigation-signs",
    name: "Wayfinding and Navigation Signs",
    category: "Directional Boards",
    image: "/images/highway-guidance.svg",
    gallery: [
      "/images/highway-guidance.svg",
      "/images/factory-safety.svg",
      "/images/construction-diversion.svg",
    ],
    shortDescription:
      "Internal route signs, building identifiers, and navigation boards for campuses and commercial sites.",
    description:
      "Wayfinding boards that guide visitors, trucks, staff, and contractors through larger campuses with less confusion and better route discipline.",
    size: "450 x 300 mm to 1800 x 900 mm",
    weight: "2 kg to 16 kg",
    pricing: "Starting from Rs. 950 per board",
    material: "ACP, vinyl, reflective film, mounting brackets",
    thickness: "3 mm display panel with optional frame",
    visibility: "Clear daylight readability and optional retro-reflection",
    warranty: "12 month outdoor display support",
    bestFor: ["Large campuses", "Warehouses", "Commercial parks"],
    features: [
      "Gate, block, and bay-level navigation",
      "Color-coded route planning",
      "Visitor-friendly directional copy",
    ],
    realProjects: [
      {
        title: "Warehouse Navigation System",
        client: "SwiftLog Warehousing",
        location: "Bhiwandi",
        summary:
          "Created dock numbering, route arrows, pedestrian guidance, and truck bay identification boards.",
      },
      {
        title: "Campus Route Map Installation",
        client: "Northfield Engineering",
        location: "Pimpri",
        summary:
          "Installed block markers, main direction boards, and vehicle route maps across the campus.",
      },
    ],
  },
  {
    slug: "mandatory-warning-boards",
    name: "Mandatory and Warning Boards",
    category: "Compliance Boards",
    image: "/images/factory-safety.svg",
    gallery: [
      "/images/factory-safety.svg",
      "/images/highway-guidance.svg",
      "/images/construction-diversion.svg",
    ],
    shortDescription:
      "Standard caution, prohibition, and mandatory message boards for compliance-heavy zones.",
    description:
      "Clear, durable warning and mandatory message boards for areas where operators, staff, and visitors must understand site rules immediately.",
    size: "300 x 300 mm to 900 x 600 mm",
    weight: "1 kg to 8 kg",
    pricing: "Starting from Rs. 320 per board",
    material: "ACP, sunboard, reflective and non-reflective print media",
    thickness: "2 mm to 3 mm panel options",
    visibility: "Bold icons and strong text contrast",
    warranty: "6 month standard replacement support",
    bestFor: ["Restricted zones", "Machine areas", "Electrical rooms"],
    features: [
      "Prohibition and mandatory icon-based designs",
      "Fast readability in high-attention zones",
      "Custom text in English, Hindi, or Marathi",
    ],
    realProjects: [
      {
        title: "Industrial Hazard Sign Set",
        client: "Mitra Process Plant",
        location: "Aurangabad",
        summary:
          "Delivered machine warnings, electrical hazard signs, and restricted-access safety boards.",
      },
      {
        title: "Utility Block Safety Sign Package",
        client: "Thermal Systems India",
        location: "Pune",
        summary:
          "Installed compliance boards around panel rooms, boiler utilities, and chemical storage points.",
      },
    ],
  },
  {
    slug: "custom-structure-signage",
    name: "Custom Structure Signage",
    category: "Mounted Sign Systems",
    image: "/images/construction-diversion.svg",
    gallery: [
      "/images/construction-diversion.svg",
      "/images/highway-guidance.svg",
      "/images/factory-safety.svg",
    ],
    shortDescription:
      "Pole-mounted, frame-mounted, and fabricated signage systems for large-format display needs.",
    description:
      "Custom sign systems with structure fabrication support for road edges, median islands, factory perimeters, and site-specific mounting conditions.",
    size: "1200 x 900 mm to 3600 x 2400 mm",
    weight: "12 kg to 75 kg",
    pricing: "Starting from Rs. 6,500 per setup",
    material: "ACP face, MS frame, GI pole, reflective film",
    thickness: "3 mm panel with custom fabricated support",
    visibility: "Long-range outdoor readability",
    warranty: "12 month structure and finish support",
    bestFor: ["Large format boards", "Roadside structures", "Perimeter signage"],
    features: [
      "MS frame and GI pole fabrication",
      "Custom dimensions and mounting plans",
      "Prepared for outdoor durability and visibility",
    ],
    realProjects: [
      {
        title: "Expressway Caution Sign Package",
        client: "HighRoute Projects",
        location: "Mumbai - Nashik Corridor",
        summary:
          "Delivered large-format roadside caution boards on fabricated pole structures for median and shoulder placement.",
      },
      {
        title: "Contractor Display and Route Sign Set",
        client: "BuildAxis Infra",
        location: "Thane",
        summary:
          "Prepared framed contractor boards, heavy-duty route signs, and site access signage for a multi-phase job.",
      },
    ],
  },
];

export const websiteWorks: WebWork[] = [
  {
    id: "work-nh48-direction",
    title: "NH-48 Overhead Direction Boards",
    client: "Western Corridor Infra",
    location: "Pune - Satara",
    productSlug: "retro-reflective-road-signs",
    status: "Fabrication in progress",
    summary:
      "Large reflective direction boards, caution signage, and highway route markers for a corridor upgrade package.",
  },
  {
    id: "work-primeforge-safety",
    title: "Plant Safety Upgrade",
    client: "PrimeForge Industries",
    location: "Chakan MIDC",
    productSlug: "industrial-safety-boards",
    status: "Installation scheduled",
    summary:
      "PPE communication, hazard notices, and internal movement signs for production and utility areas.",
  },
  {
    id: "work-metro-diversion",
    title: "Metro Diversion Signage",
    client: "Urban Rail Contractors",
    location: "Nagpur",
    productSlug: "construction-diversion-boards",
    status: "Material dispatch underway",
    summary:
      "Temporary barricade graphics, detour boards, and public movement guidance around an active metro stretch.",
  },
];
