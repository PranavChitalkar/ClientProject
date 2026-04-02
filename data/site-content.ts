export const company = {
  name: "AKB",
  tagline: "Premium Safety Signboards for Roads, Industries & Construction",
  phone: "+91 9146531857",
  email: "info@akbroadboards.com",
  address: "Pune, Maharashtra, India",
  whatsapp: "+91 9146531857",
  since: "2011",
};

export const stats = [
  { value: "5000+", label: "Signboards manufactured and installed" },
  { value: "250+", label: "Satisfied clients across India" },
  { value: "99%", label: "On-time project completion rate" },
  { value: "13+", label: "Years of excellence in signage" },
];

export const services = [
  {
    title: "Safety Sign Design & Planning",
    description:
      "Custom-designed signboards optimized for visibility, compliance with traffic regulations, and installation on highways, industrial sites, and construction zones.",
  },
  {
    title: "Expert Fabrication",
    description:
      "High-quality manufacturing using reflective sheeting, ACP panels, MS structures, GI poles, and durable finishes built to withstand harsh outdoor conditions.",
  },
  {
    title: "Site Survey & Positioning",
    description:
      "Professional on-site assessment to determine optimal placement, visibility angles, and installation requirements for maximum impact and safety.",
  },
  {
    title: "Professional Installation & Maintenance",
    description:
      "Complete installation service, structural alignment, periodic maintenance support, and immediate replacement service for damaged or worn signboards.",
  },
];

export const process = [
  {
    step: "01",
    title: "Project Consultation",
    description:
      "We understand your signage requirements, site conditions, safety objectives, and specific board types needed for your location.",
  },
  {
    step: "02",
    title: "Site Analysis & Design",
    description:
      "Our team conducts a site visit, plans optimal board positions, determines sizing, and designs signboards that comply with safety standards.",
  },
  {
    step: "03",
    title: "Manufacturing & Quality Check",
    description:
      "Signboards are fabricated with precision using premium reflective materials, tested for durability, and finished to perfection.",
  },
  {
    step: "04",
    title: "Expert Installation & Support",
    description:
      "Professional installation by trained technicians, structural alignment verification, and ongoing maintenance support for your investment.",
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
