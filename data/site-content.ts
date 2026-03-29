export const company = {
  name: "SafePath Sign Systems",
  tagline: "Road safety, industrial signage, and navigation systems",
  phone: "+91 98765 43210",
  email: "hello@safepathsigns.com",
  address: "Pune, Maharashtra",
  whatsapp: "+919876543210",
  since: "2012",
};

export const stats = [
  { value: "450+", label: "Signboards supplied and installed" },
  { value: "120+", label: "Highway, plant, and site clients served" },
  { value: "98%", label: "Projects completed on committed timelines" },
  { value: "14+", label: "Years in signage execution and support" },
];

export const sectors = [
  {
    title: "Highways and Expressways",
    description:
      "Directional boards, lane guidance signs, chevron systems, speed warnings, kilometer markers, and reflective roadside safety signs.",
  },
  {
    title: "Factories and Warehouses",
    description:
      "Hazard identification boards, PPE instructions, emergency assembly signs, machine warnings, internal route signs, and loading zone markings.",
  },
  {
    title: "Construction and Infrastructure",
    description:
      "Diversion boards, barricade signage, excavation warnings, contractor boards, detour systems, and temporary work-zone guidance.",
  },
];

export const services = [
  {
    title: "Traffic and Safety Sign Design",
    description:
      "Sign layouts prepared for fast readability, site conditions, safety requirements, and practical installation needs.",
  },
  {
    title: "Reflective Sign Fabrication",
    description:
      "Production using reflective sheeting, ACP, MS structures, GI poles, and durable outdoor finishing suited to long-term use.",
  },
  {
    title: "Site Survey and Position Planning",
    description:
      "Placement planning based on viewing angle, traffic movement, plant circulation, obstruction points, and route flow.",
  },
  {
    title: "Installation and Maintenance Support",
    description:
      "On-site fixing, structure installation, alignment checks, replacement support, and scaling for new project phases.",
  },
];

export const highlights = [
  "Regulatory, caution, and directional road signs",
  "Industrial safety and hazard communication boards",
  "Factory route maps and internal navigation signage",
  "Construction diversion and temporary traffic systems",
  "Retro-reflective materials for day and night visibility",
  "Custom structures, poles, frames, and mounting solutions",
];

export const process = [
  {
    step: "01",
    title: "Requirement Discussion",
    description:
      "We collect site details, safety objectives, required sign types, and location priorities from the client team.",
  },
  {
    step: "02",
    title: "Survey and Layout Planning",
    description:
      "Our team studies the site and prepares sign positions, board sizes, messages, material requirements, and mounting plans.",
  },
  {
    step: "03",
    title: "Fabrication and Finishing",
    description:
      "Boards and supporting structures are produced with reflective films, weather-ready surfaces, and durable fabrication standards.",
  },
  {
    step: "04",
    title: "Installation and Handover",
    description:
      "The final system is installed, checked for readability and placement, and handed over with support for future requirements.",
  },
];

export const projects = [
  {
    title: "State Highway Guidance Package",
    category: "Road Safety Execution",
    image: "/images/highway-guidance.svg",
    description:
      "Design, fabrication, and installation of lane guidance boards, caution signs, kilometer markers, and reflective warning systems.",
  },
  {
    title: "Factory Safety Signage Rollout",
    category: "Industrial Signage System",
    image: "/images/factory-safety.svg",
    description:
      "Complete internal signage system covering PPE areas, restricted zones, hazard warnings, route maps, and emergency directions.",
  },
  {
    title: "Metro Construction Diversion Setup",
    category: "Construction Zone Signage",
    image: "/images/construction-diversion.svg",
    description:
      "Temporary traffic diversion boards, barricade graphics, pedestrian rerouting signs, and worker safety communication during execution.",
  },
];

export const reasons = [
  "Clear communication for contractors, plant managers, project teams, and procurement departments",
  "Strong presentation of actual signage services instead of generic portfolio wording",
  "Bright business-focused design that feels clean, professional, and trustworthy",
  "Frontend structure ready for future backend, ERP, CRM, or inquiry integrations",
];

export const companyOverview = [
  "SafePath Sign Systems supplies and installs safety signboards for highways, industrial plants, warehouses, and active construction zones.",
  "The company focuses on visibility, durability, and correct message placement so that signboards support movement, reduce confusion, and improve site safety.",
  "From small internal factory boards to large road-facing directional structures, the team handles design, fabrication, and installation in one workflow.",
];

export const contactOptions = [
  {
    label: "Email Us",
    value: company.email,
    href: `mailto:${company.email}`,
  },
  {
    label: "Call Now",
    value: company.phone,
    href: `tel:${company.phone.replace(/\s+/g, "")}`,
  },
  {
    label: "WhatsApp",
    value: "+91 98765 43210",
    href: `https://wa.me/${company.whatsapp.replace(/\D/g, "")}`,
  },
];
