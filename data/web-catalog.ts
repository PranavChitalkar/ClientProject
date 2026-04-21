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
  image: string;
  productSlug: string;
  status: string;
  summary: string;
};

export const websiteProducts: Product[] = [
  {
    slug: "retro-reflective-road-signs",
    name: "Retroreflective Road Signs",
    category: "Highway Safety Boards",
    image: "", // Placeholder space as requested
    gallery: [],
    shortDescription:
      "Fabricated retroreflective boards for highways, city roads, and industrial plant approaches with high visibility day and night.",
    description:
      "Premium retroreflective road signboards manufactured with precision engineering for strong readability, weather resistance, and secure mounting across highways, main roads, and internal transport corridors. MATOSHREE ENGINEERING custom-fabricates each board to specification.",
    size: "600 x 600 mm to 2400 x 1200 mm",
    weight: "4 kg to 28 kg",
    pricing: "Starting from Rs. 1,850 per board",
    material: "ACP sheet, retroreflective sheeting, GI clamp set",
    thickness: "3 mm ACP with 1.2 mm support options",
    visibility: "High day and night visibility with retroreflective coating",
    warranty: "12 month finish and fixing support",
    bestFor: ["National highways", "Plant entry roads", "Township approaches"],
    features: [
      "HIP and engineering grade retroreflective options",
      "Custom ACP, GI, and MS support structures",
      "Lane guidance, warning, and regulatory layouts",
    ],
    realProjects: [
      {
        title: "NH-48 Overhead Direction Board Package",
        client: "Western Corridor Infra",
        location: "Pune - Satara",
        summary:
          "Supply and installation of gantry-mounted guide signs, shoulder caution boards, and kilometer plates with retroreflective coating.",
      },
      {
        title: "Industrial Township Entry Sign System",
        client: "Prime Logistic Parks",
        location: "Chakan",
        summary:
          "Directional retroreflective sign package for truck circulation, visitor entry lanes, and restricted movement zones.",
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
      "Custom-fabricated hazard, PPE, emergency, and process safety boards for factories, warehouses, and plants.",
    description:
      "Custom-fabricated safety communication boards designed for production areas, utility rooms, loading zones, and worker circulation points. MATOSHREE ENGINEERING manufactures high-quality boards where clear safety messaging is critical every day.",
    size: "300 x 450 mm to 1800 x 1200 mm",
    weight: "1.5 kg to 18 kg",
    pricing: "Starting from Rs. 480 per board",
    material: "Vinyl print, ACP, foam sheet, MS frame options",
    thickness: "2 mm to 3 mm panel range",
    visibility: "Matte indoor and reflective outdoor options",
    warranty: "6 to 12 month support depending on use area",
    bestFor: ["Factories", "Warehouses", "Process plants"],
    features: [
      "Custom PPE, no-entry, and hazard communication boards",
      "Emergency route and assembly point signage",
      "Tailored indoor and outdoor mounting formats",
    ],
    realProjects: [
      {
        title: "Plant Safety Upgrade Rollout",
        client: "PrimeForge Industries",
        location: "Chakan MIDC",
        summary:
          "Fabricated and installed custom PPE instructions, forklift movement boards, utility warnings, and emergency assembly signs.",
      },
      {
        title: "Warehouse Compliance Sign Set",
        client: "SwiftLog Warehousing",
        location: "Bhiwandi",
        summary:
          "Custom-fabricated hazard labels, route markers, restricted zone notices, and loading bay safety boards.",
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
      "Custom-fabricated diversion boards, barricade graphics, and warning systems for active road and metro work zones.",
    description:
      "Custom-fabricated temporary site signage prepared for phased construction, public diversions, contractor movement, and pedestrian rerouting in active project areas. MATOSHREE ENGINEERING builds durable boards for every construction phase.",
    size: "900 x 600 mm to 2400 x 1500 mm",
    weight: "6 kg to 32 kg",
    pricing: "Starting from Rs. 2,250 per board",
    material: "ACP, retroreflective sheeting, custom-fabricated frame",
    thickness: "3 mm ACP with heavy-duty mounting frame",
    visibility: "Retroreflective for low-light work zones",
    warranty: "Execution-period support and replacement assistance",
    bestFor: ["Metro works", "Road widening", "Bridge construction"],
    features: [
      "Custom detour arrows and caution communication",
      "Barricade-mounted graphics and route signs",
      "Quick deployment for temporary construction phases",
    ],
    realProjects: [
      {
        title: "Metro Corridor Diversion Setup",
        client: "Urban Rail Contractors",
        location: "Nagpur",
        summary:
          "Custom-fabricated temporary traffic diversion boards, worker safety signs, and public guidance around barricaded stretches.",
      },
      {
        title: "Flyover Repair Traffic Control Boards",
        client: "Civic Structure Projects",
        location: "Nashik",
        summary:
          "Night-visible fabricated warning boards, median-mounted diversion signs, and pedestrian redirection panels.",
      },
    ],
  },
  {
    slug: "wayfinding-navigation-signs",
    name: "Wayfinding and Navigation Signs",
    category: "Directional Boards",
    image: "",
    gallery: [],
    shortDescription:
      "Custom-fabricated internal route signs, building identifiers, and navigation boards for campuses and commercial sites.",
    description:
      "Custom-fabricated wayfinding boards that guide visitors, trucks, staff, and contractors through larger campuses with less confusion and better route discipline. Engineered by MATOSHREE ENGINEERING for durability and clarity.",
    size: "450 x 300 mm to 1800 x 900 mm",
    weight: "2 kg to 16 kg",
    pricing: "Starting from Rs. 950 per board",
    material: "ACP, vinyl, retroreflective film, mounting brackets",
    thickness: "3 mm display panel with optional frame",
    visibility: "Clear daylight readability and optional retro-reflection",
    warranty: "12 month outdoor display support",
    bestFor: ["Large campuses", "Warehouses", "Commercial parks"],
    features: [
      "Custom gate, block, and bay-level navigation",
      "Color-coded route planning layouts",
      "Visitor-friendly directional copy and signage",
    ],
    realProjects: [
      {
        title: "Warehouse Navigation System",
        client: "SwiftLog Warehousing",
        location: "Bhiwandi",
        summary:
          "Custom-fabricated dock numbering, route arrows, pedestrian guidance, and truck bay identification boards.",
      },
      {
        title: "Campus Route Map Installation",
        client: "Northfield Engineering",
        location: "Pimpri",
        summary:
          "Installed custom block markers, main direction boards, and vehicle route maps across the campus.",
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
      "Custom-fabricated caution, prohibition, and mandatory message boards for compliance-heavy zones.",
    description:
      "Custom-fabricated warning and mandatory message boards designed for areas where operators, staff, and visitors must understand site rules immediately. MATOSHREE ENGINEERING builds boards with clear, durable finishes.",
    size: "300 x 300 mm to 900 x 600 mm",
    weight: "1 kg to 8 kg",
    pricing: "Starting from Rs. 320 per board",
    material: "ACP, sunboard, retroreflective and non-reflective print media",
    thickness: "2 mm to 3 mm panel options",
    visibility: "Bold icons and strong text contrast",
    warranty: "6 month standard replacement support",
    bestFor: ["Restricted zones", "Machine areas", "Electrical rooms"],
    features: [
      "Custom prohibition and mandatory icon-based designs",
      "Fast readability in high-attention zones",
      "Custom text in English, Hindi, or Marathi",
    ],
    realProjects: [
      {
        title: "Industrial Hazard Sign Set",
        client: "Mitra Process Plant",
        location: "Aurangabad",
        summary:
          "Custom-fabricated machine warnings, electrical hazard signs, and restricted-access safety boards.",
      },
      {
        title: "Utility Block Safety Sign Package",
        client: "Thermal Systems India",
        location: "Pune",
        summary:
          "Installed custom compliance boards around panel rooms, boiler utilities, and chemical storage points.",
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
      "Custom-fabricated pole-mounted, frame-mounted, and large-format signage systems with MATOSHREE ENGINEERING structure fabrication.",
    description:
      "Custom sign systems with complete structure fabrication support for road edges, median islands, factory perimeters, and site-specific mounting conditions. MATOSHREE ENGINEERING handles design, fabrication, and installation end-to-end.",
    size: "1200 x 900 mm to 3600 x 2400 mm",
    weight: "12 kg to 75 kg",
    pricing: "Starting from Rs. 6,500 per setup",
    material: "ACP face, MS frame, GI pole, retroreflective film",
    thickness: "3 mm panel with custom-fabricated support",
    visibility: "Long-range outdoor readability with retroreflection options",
    warranty: "12 month structure and finish support",
    bestFor: ["Large format boards", "Roadside structures", "Perimeter signage"],
    features: [
      "Custom MS frame and GI pole fabrication",
      "Tailored dimensions and mounting plans",
      "Built for outdoor durability and long-term visibility",
    ],
    realProjects: [
      {
        title: "Expressway Caution Sign Package",
        client: "HighRoute Projects",
        location: "Mumbai - Nashik Corridor",
        summary:
          "Custom-fabricated and delivered large-format roadside caution boards on fabricated pole structures for median and shoulder placement.",
      },
      {
        title: "Contractor Display and Route Sign Set",
        client: "BuildAxis Infra",
        location: "Thane",
        summary:
          "Custom-fabricated framed contractor boards, heavy-duty route signs, and site access signage for a multi-phase construction project.",
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
    image: "/images/hero-bg.png",
    productSlug: "retro-reflective-road-signs",
    status: "Fabrication in progress",
    summary:
      "MATOSHREE ENGINEERING is fabricating large retroreflective direction boards, caution signage, and highway route markers for a corridor upgrade package.",
  },
  {
    id: "work-primeforge-safety",
    title: "Plant Safety Upgrade",
    client: "PrimeForge Industries",
    location: "Chakan MIDC",
    image: "/images/hero-bg.png",
    productSlug: "industrial-safety-boards",
    status: "Installation scheduled",
    summary:
      "Custom-fabricated PPE communication, hazard notices, and internal movement signs for production and utility areas.",
  },
  {
    id: "work-metro-diversion",
    title: "Metro Diversion Signage",
    client: "Urban Rail Contractors",
    location: "Nagpur",
    image: "/images/hero-bg.png",
    productSlug: "construction-diversion-boards",
    status: "Material dispatch underway",
    summary:
      "MATOSHREE ENGINEERING's custom-fabricated temporary barricade graphics, detour boards, and public movement guidance around an active metro stretch.",
  },
];
