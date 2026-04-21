export const company = {
  name: "MATOSHREE ENGINEERING",
  tagline: "All Type of Fabrication Works & Manufacturer of Retroreflective Sign Boards",
  phone: "+91 9146531857",
  email: "info@matoshreeengineering.com",
  address: "Pune, Maharashtra, India",
  whatsapp: "+91 9146531857",
  since: "2011",
};

export const stats = [
  { value: "5000+", label: "Retroreflective boards manufactured and installed" },
  { value: "250+", label: "Satisfied clients across India" },
  { value: "99%", label: "On-time project completion rate" },
  { value: "13+", label: "Years of excellence in fabrication & signage" },
];

export const services = [
  {
    title: "Retroreflective Signboard Design & Planning",
    description:
      "Custom-designed retroreflective boards optimized for visibility, compliance with traffic regulations, and installation on highways, industrial sites, and construction zones.",
  },
  {
    title: "Precision Fabrication Services",
    description:
      "High-quality manufacturing of retroreflective sign boards using premium reflective sheeting, ACP panels, MS structures, GI poles, and durable finishes built to withstand harsh outdoor conditions.",
  },
  {
    title: "Site Assessment & Installation Planning",
    description:
      "Professional on-site assessment to determine optimal placement, visibility angles, and installation requirements for maximum impact, safety, and compliance.",
  },
  {
    title: "Professional Installation & Aftercare Support",
    description:
      "Expert installation by trained technicians, structural alignment verification, periodic maintenance, inspection, and prompt replacement service for all fabricated sign boards.",
  },
];

export const process = [
  {
    step: "01",
    title: "Requirement Consultation",
    description:
      "We understand your fabrication and signage requirements, site conditions, safety objectives, and specifications for retroreflective boards needed for your location.",
  },
  {
    step: "02",
    title: "Design & Site Planning",
    description:
      "Our expert team conducts a site survey, plans optimal placement, determines precise sizing, and designs retroreflective signboards that comply with all safety standards.",
  },
  {
    step: "03",
    title: "Precision Fabrication & QC",
    description:
      "Retroreflective boards are fabricated with precision engineering using premium materials, rigorously tested for durability, and finished to absolute perfection.",
  },
  {
    step: "04",
    title: "Installation & Long-term Support",
    description:
      "Professional installation by our trained technicians, structural verification, and comprehensive aftercare support and maintenance for your fabricated sign boards.",
  },
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
    value: company.whatsapp,
    href: `https://wa.me/${company.whatsapp.replace(/\D/g, "")}`,
  },
];
