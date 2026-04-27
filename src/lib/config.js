export const config = {
  name: "Amazon Product Studio",
  description: "AI-powered product photography for Amazon sellers",
  url: process.env.NEXTAUTH_URL || "https://amazon-product-studio.vercel.app",
  muapi: {
    endpoint: process.env.MUAPI_ENDPOINT || "product-shot",
    creditCost: 65,
  },
  webhooks: {
    muapi: `${process.env.NEXTAUTH_URL}/api/webhook/muapi`,
    stripe: `${process.env.NEXTAUTH_URL}/api/webhook/stripe`,
  },
  aspectRatios: [
    { label: "1:1 Square", value: "1:1", description: "Standard square for search results" },
    { label: "3:4 Vertical", value: "3:4", description: "Amazon recommended ratio" },
    { label: "4:3 Landscape", value: "4:3", description: "Lifestyle images" },
    { label: "16:9 Widescreen", value: "16:9", description: "Video content & banners" },
  ],
  categories: [
    "whitebox", "lifestyle-kitchen", "studio-ambient", "natural-outdoor",
    "premium-lifestyle", "minimalist-workspace", "holiday-seasonal", "dark-moody",
    "pastel-soft", "luxury-marble", "vintage-rustic", "tech-glow", "flat-lay",
    "infographic", "lifestyle-apparel", "beauty-glow", "food-photography",
    "pet-products", "craft-supplies", "seasonal-burst", "cozy-home",
    "office-professional", "outdoor-adventure", "cafe-lounge", "minimal-white"
  ],
};
