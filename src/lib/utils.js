// Amazon Product Studio example images
// These are sample product photography examples across categories
export const productExamples = [
  {
    url: "https://cdn.muapi.ai/samples/headshot-1.jpg",
    category: "whitebox",
  },
  {
    url: "https://cdn.muapi.ai/samples/headshot-2.jpg",
    category: "lifestyle-kitchen",
  },
  {
    url: "https://cdn.muapi.ai/samples/headshot-3.jpg",
    category: "studio-ambient",
  },
  {
    url: "https://cdn.muapi.ai/samples/headshot-4.jpg",
    category: "natural-outdoor",
  },
  {
    url: "https://cdn.muapi.ai/samples/headshot-5.jpg",
    category: "premium-lifestyle",
  },
  {
    url: "https://cdn.muapi.ai/samples/headshot-6.jpg",
    category: "minimalist-workspace",
  },
  {
    url: "https://cdn.muapi.ai/samples/headshot-7.jpg",
    category: "tech-glow",
  },
  {
    url: "https://cdn.muapi.ai/samples/headshot-8.jpg",
    category: "flat-lay",
  },
  {
    url: "https://cdn.muapi.ai/samples/headshot-9.jpg",
    category: "beauty-glow",
  },
  {
    url: "https://cdn.muapi.ai/samples/headshot-10.jpg",
    category: "luxury-marble",
  },
  {
    url: "https://cdn.muapi.ai/samples/headshot-11.jpg",
    category: "dark-moody",
  },
  {
    url: "https://cdn.muapi.ai/samples/headshot-12.jpg",
    category: "vintage-rustic",
  },
];

export function formatCredits(credits) {
  return new Intl.NumberFormat().format(credits);
}

export function getCategoryLabel(categoryId) {
  const map = {
    whitebox: "Whitebox Pro",
    "lifestyle-kitchen": "Lifestyle Kitchen",
    "studio-ambient": "Studio Ambient",
    "natural-outdoor": "Natural Outdoor",
    "premium-lifestyle": "Premium Lifestyle",
    "minimalist-workspace": "Minimalist Workspace",
    "holiday-seasonal": "Holiday Seasonal",
    "dark-moody": "Dark Moody",
    "pastel-soft": "Pastel Soft",
    "luxury-marble": "Luxury Marble",
    "vintage-rustic": "Vintage Rustic",
    "tech-glow": "Tech Glow",
    "flat-lay": "Flat Lay",
    infographic: "Infographic Pack",
    "lifestyle-apparel": "Lifestyle Apparel",
    "beauty-glow": "Beauty Glow",
    "food-photography": "Food Photography",
    "pet-products": "Pet Products",
    "craft-supplies": "Craft Supplies",
    "seasonal-burst": "Seasonal Burst",
    "cozy-home": "Cozy Home",
    "office-professional": "Office Professional",
    "outdoor-adventure": "Outdoor Adventure",
    "cafe-lounge": "Café Lounge",
    "minimal-white": "Minimal White",
  };
  return map[categoryId] || categoryId;
}

export function getAspectRatioLabel(ratio) {
  const map = {
    "1:1": "Square (1:1)",
    "3:4": "Vertical (3:4)",
    "4:3": "Landscape (4:3)",
    "16:9": "Widescreen (16:9)",
  };
  return map[ratio] || ratio;
}

export function downloadImage(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'product-image.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
