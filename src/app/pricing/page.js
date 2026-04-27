"use client";

import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FaCoins, FaCheck } from "react-icons/fa";
import Navbar from "@/components/saas/Navbar";
import Footer from "@/components/saas/Footer";

const tiers = [
  {
    name: "Starter Seller",
    credits: 3800,
    price: 19,
    description: "Perfect for new Amazon sellers getting started with AI product photography.",
    features: [
      "3,800 credits per month",
      "~58 product shot generations",
      "All 25 scene categories",
      "HD downloads (2048x2048)",
      "Amazon-optimized aspect ratios",
      "Commercial use license",
    ],
    highlight: false,
  },
  {
    name: "Professional Seller",
    credits: 9000,
    price: 45,
    description: "For growing brands and sellers who need high-volume, consistent product imagery.",
    features: [
      "9,000 credits per month",
      "~138 product shot generations",
      "All 25 scene categories",
      "4K downloads (4096x4096)",
      "Batch processing",
      "Priority support",
      "Commercial use license",
    ],
    highlight: true,
  },
  {
    name: "Enterprise Suite",
    credits: 19800,
    price: 99,
    description: "Agencies and high-volume sellers who need the most for their Amazon business.",
    features: [
      "19,800 credits per month",
      "~305 product shot generations",
      "All 25 scene categories",
      "4K downloads + source files",
      "Batch processing",
      "API access",
      "Dedicated support",
      "Commercial use license",
    ],
    highlight: false,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();

  const handleCheckout = async (price, credits, tierName) => {
    if (status !== "authenticated") {
      signIn();
      return;
    }
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price, credits }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Stripe error", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      <section className="bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Simple, Honest Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            One subscription. Unlimited creative control. No per-photo surprises.
            Cancel anytime.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 -mt-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border transition-all flex flex-col bg-white shadow-lg ${
                tier.highlight
                  ? "border-blue-500 ring-2 ring-blue-500/20"
                  : "border-gray-200"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-500 rounded-full text-[9px] font-bold uppercase tracking-widest text-white shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold tracking-tight text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <div className="mb-8 flex items-end gap-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  ${tier.price}
                </span>
                <span className="text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-widest">
                  /mo
                </span>
              </div>

              <div className="flex-1 space-y-3 mb-8">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <FaCoins className="text-blue-500 text-sm" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-none mb-1">
                      Monthly Credits
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {tier.credits.toLocaleString()}
                    </span>
                  </div>
                </div>

                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <FaCheck className="text-green-500 text-xs flex-shrink-0" />
                    <span className="text-xs text-gray-600 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleCheckout(tier.price, tier.credits, tier.name)}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
                  tier.highlight
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "What counts as one credit?", a: "Each product shot generation costs 65 credits." },
            { q: "Do unused credits roll over?", a: "Credits reset monthly and do not roll over." },
            { q: "Can I cancel anytime?", a: "Yes. Cancel anytime from your account settings." },
            { q: "What's included in commercial use?", a: "All generated images can be used commercially for your Amazon listings." },
            { q: "What image formats do I get?", a: "Downloads are PNG at Amazon-optimized aspect ratios." },
            { q: "Is there a free trial?", a: "New accounts get 100 free credits to test the service." },
          ].map(({ q, a }) => (
            <div key={q} className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
              <p className="text-gray-500 text-sm">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
