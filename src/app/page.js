"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
  FaBolt,
  FaMagic,
  FaChevronDown,
  FaExpand,
  FaPlus,
  FaTrash,
  FaImages,
} from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/saas/Navbar";
import Footer from "@/components/saas/Footer";
import { downloadImage, productExamples } from "@/lib/utils";

const ASPECT_RATIOS = [
  { label: "1:1 Square", value: "1:1", desc: "Amazon search results" },
  { label: "3:4 Vertical", value: "3:4", desc: "Amazon recommended" },
  { label: "4:3 Landscape", value: "4:3", desc: "Lifestyle images" },
  { label: "16:9 Widescreen", value: "16:9", desc: "Video & banners" },
];

const PRODUCT_CATEGORIES = [
  { id: "whitebox", name: "Whitebox Pro", desc: "Clean white background" },
  { id: "lifestyle-kitchen", name: "Lifestyle Kitchen", desc: "Beautiful kitchen setting" },
  { id: "studio-ambient", name: "Studio Ambient", desc: "Professional studio lighting" },
  { id: "natural-outdoor", name: "Natural Outdoor", desc: "Sunlit outdoor scene" },
  { id: "premium-lifestyle", name: "Premium Lifestyle", desc: "Upscale lifestyle branding" },
  { id: "minimalist-workspace", name: "Minimalist Workspace", desc: "Clean desk setup" },
  { id: "holiday-seasonal", name: "Holiday Seasonal", desc: "Festive seasonal mood" },
  { id: "dark-moody", name: "Dark Moody", desc: "High-contrast dramatic" },
  { id: "pastel-soft", name: "Pastel Soft", desc: "Soft pastel colors" },
  { id: "luxury-marble", name: "Luxury Marble", desc: "White marble luxury feel" },
  { id: "vintage-rustic", name: "Vintage Rustic", desc: "Rustic wood and vintage" },
  { id: "tech-glow", name: "Tech Glow", desc: "Neon glow tech aesthetic" },
  { id: "flat-lay", name: "Flat Lay", desc: "Top-down flat composition" },
  { id: "infographic", name: "Infographic Pack", desc: "Callouts and specs graphic" },
  { id: "lifestyle-apparel", name: "Lifestyle Apparel", desc: "Fashion lifestyle shots" },
  { id: "beauty-glow", name: "Beauty Glow", desc: "Soft beauty lighting" },
  { id: "food-photography", name: "Food Photography", desc: "Appetizing food product" },
  { id: "pet-products", name: "Pet Products", desc: "Happy pets with your product" },
  { id: "craft-supplies", name: "Craft Supplies", desc: "Creative flat lay crafts" },
  { id: "seasonal-burst", name: "Seasonal Burst", desc: "Vibrant seasonal colors" },
  { id: "cozy-home", name: "Cozy Home", desc: "Warm cozy indoor setting" },
  { id: "office-professional", name: "Office Professional", desc: "Professional office" },
  { id: "outdoor-adventure", name: "Outdoor Adventure", desc: "Hiking/outdoor lifestyle" },
  { id: "cafe-lounge", name: "Café Lounge", desc: "Stylish café setting" },
  { id: "minimal-white", name: "Minimal White", desc: "Ultra-minimal pure white" },
];

const ProductCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full overflow-hidden relative py-6">
      <div
        className="flex gap-4 transition-transform duration-500"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {productExamples.map((example, index) => (
          <div
            key={index}
            className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-glass-bg border border-glass-border group">
              <img
                src={example.url}
                alt={example.category}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 flex items-center gap-1.5 shadow-xl">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-[8px] font-black text-white uppercase tracking-widest leading-none">
                  AI Generated
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const { data: session, status } = useSession();

  // UI State
  const [isRatioOpen, setIsRatioOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const ratioRef = useRef(null);
  const categoryRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Form State
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0].id);
  const [categoryName, setCategoryName] = useState(PRODUCT_CATEGORIES[0].name);
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0]);
  const [referenceImage, setReferenceImage] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Generation State
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (ratioRef.current && !ratioRef.current.contains(event.target)) {
        setIsRatioOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PNG, JPG, or JPEG images.");
      return;
    }

    if (!session) {
      signIn();
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed.");

      const data = await res.json();
      if (data.url) {
        setReferenceImage(data.url);
      }
    } catch (err) {
      setError("Failed to upload image. Try a URL instead.");
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleGenerate = async () => {
    if (!session) {
      signIn();
      return;
    }

    if (!referenceImage && !newImageUrl) {
      setError("Please provide a product image.");
      return;
    }

    const finalImageUrl = referenceImage || newImageUrl;

    try {
      setLoading(true);
      setError(null);
      setResultUrl(null);
      setStatusMessage("GENERATING YOUR PRODUCT SHOT...");

      const res = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: finalImageUrl,
          category,
          aspectRatio: aspectRatio.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate request.");
      }

      const { requestId } = data;
      await pollStatus(requestId);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const pollStatus = async (requestId) => {
    setStatusMessage("CRAFTING YOUR SCENE...");

    try {
      const res = await fetch(`/api/product/status?requestId=${requestId}`);

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Status check failed.");

      if (data.status === "completed") {
        setResultUrl(data.resultUrl);
        setStatusMessage("");
        setLoading(false);
      } else if (data.status === "failed") {
        throw new Error(data.error || "Generation failed.");
      } else {
        setTimeout(() => pollStatus(requestId), 3000);
      }
    } catch (err) {
      setError(err.message || "An error occurred during verification.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      <div className="flex flex-col-reverse lg:flex-row flex-1 h-full w-full overflow-y-auto lg:overflow-hidden" style={{ minHeight: "calc(100vh - 80px)" }}>
        {/* Sidebar */}
        <aside className="w-full lg:w-96 border-t lg:border-t-0 lg:border-r border-gray-200 bg-white flex flex-col shrink-0 h-auto lg:h-full lg:overflow-y-auto">
          <div className="p-6 border-b border-gray-100 space-y-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-black tracking-tight text-gray-900">
                PRODUCT STUDIO
              </h2>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em]">
                AI Product Photography Engine
              </p>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-6">
            {/* Category Selector */}
            <div className="space-y-3" ref={categoryRef}>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-500 rounded-full" /> Scene Category
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 shadow-sm rounded-lg text-sm font-medium transition-all outline-none text-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <FaMagic className="text-blue-500" />
                    {categoryName}
                  </div>
                  <FaChevronDown
                    className={`text-xs transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-12 left-0 right-0 max-h-60 bg-white border border-gray-200 rounded-lg overflow-y-auto shadow-xl z-[100] p-1"
                    >
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setCategory(cat.id);
                            setCategoryName(cat.name);
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full text-left p-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                            category === cat.id
                              ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {cat.name}
                          <span className={`text-xs ml-auto ${category === cat.id ? "text-blue-200" : "text-gray-400"}`}>
                            {cat.desc}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Product Image */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-500 rounded-full" /> Product Image
              </label>

              {!referenceImage ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Product image URL..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-blue-500/50 text-gray-900"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      hidden
                      accept=".png, .jpg, .jpeg"
                      onChange={handleFileUpload}
                    />
                    <button
                      onClick={() =>
                        session ? fileInputRef.current?.click() : signIn()
                      }
                      className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm group"
                    >
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FaPlus className="group-hover:scale-110 transition-transform" />
                      )}
                    </button>
                  </div>
                  <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 bg-gray-50/30">
                    <FaImages className="text-gray-300 text-xl" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      PNG, JPG or JPEG only
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-square rounded-2xl bg-gray-100 overflow-hidden group border-2 border-blue-500/20">
                  <img
                    src={referenceImage}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setReferenceImage(null)}
                    className="absolute top-2 right-2 bg-red-500 p-2 rounded-xl text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              )}
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-3" ref={ratioRef}>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-500 rounded-full" /> Aspect Ratio
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsRatioOpen(!isRatioOpen)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 shadow-sm rounded-lg text-sm font-medium transition-all outline-none text-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <FaExpand className="text-blue-500" />
                    {aspectRatio.label}
                  </div>
                  <FaChevronDown
                    className={`text-xs transition-transform duration-300 ${isRatioOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isRatioOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute bottom-12 left-0 right-0 max-h-60 bg-white border border-gray-200 rounded-lg overflow-y-auto shadow-xl z-[100] p-1"
                    >
                      {ASPECT_RATIOS.map((ratio) => (
                        <button
                          key={ratio.value}
                          onClick={() => {
                            setAspectRatio(ratio);
                            setIsRatioOpen(false);
                          }}
                          className={`w-full text-left p-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                            aspectRatio.value === ratio.value
                              ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {ratio.label}
                          <span className={`text-xs ml-auto ${aspectRatio.value === ratio.value ? "text-blue-200" : "text-gray-400"}`}>
                            {ratio.desc}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 mt-auto">
            <button
              onClick={handleGenerate}
              disabled={loading || (!referenceImage && !newImageUrl)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl py-4 font-bold tracking-wider uppercase text-xs flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 shadow-xl shadow-blue-500/30 border border-blue-400/50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <FaBolt className="text-yellow-300" />
              )}
              {loading ? "PROCESSING..." : "Generate — 65 Credits"}
            </button>
          </div>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 relative flex flex-col bg-gradient-to-br from-gray-50 to-white overflow-hidden min-h-[50vh] lg:min-h-0">
          <div className="flex-1 relative z-10 p-8 overflow-y-auto flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!resultUrl && !loading && !error && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full flex flex-col items-center justify-center p-4 md:p-12 space-y-12"
                >
                  <div className="max-w-md w-full text-center space-y-8">
                    <div className="relative w-28 h-28 mx-auto group">
                      <div className="absolute inset-0 bg-blue-500/10 blur-[30px] rounded-full" />
                      <div className="relative w-full h-full bg-white border border-gray-200 rounded-3xl flex items-center justify-center shadow-sm transition-transform duration-700 group-hover:rotate-12">
                        <FaMagic className="text-3xl text-gray-300" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                        Studio Ready.
                      </h2>
                      <p className="text-gray-400 font-medium text-xs uppercase tracking-widest leading-loose">
                        Upload your product and select a scene<br />
                        to generate professional listing photos.
                      </p>
                    </div>
                  </div>

                  <div className="w-full max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {productExamples.slice(0, 8).map((example, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group"
                        >
                          <img
                            src={example.url}
                            alt={example.category}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10">
                            <span className="text-[7px] font-black text-white uppercase tracking-widest">
                              {example.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center space-y-12"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-48 h-48 border-2 border-blue-500/10 rounded-full border-t-blue-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaBolt className="text-blue-500 animate-pulse text-2xl" />
                    </div>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="text-2xl font-black italic uppercase animate-pulse text-gray-900">
                      {statusMessage}
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-500 text-[9px] font-black uppercase tracking-widest">
                      SESSION ACTIVE
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-sm w-full p-10 bg-red-50 border-2 border-red-100 rounded-3xl text-center space-y-4"
                >
                  <div className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px]">
                    Processing Error
                  </div>
                  <p className="text-gray-500 text-xs font-bold leading-loose text-center">
                    {error}
                  </p>
                </motion.div>
              )}

              {resultUrl && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-4xl"
                >
                  <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                    <img
                      src={resultUrl}
                      alt="Generated product shot"
                      className="max-h-[70vh] w-auto h-auto mx-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
                      <div className="flex items-end justify-between">
                        <div className="space-y-3">
                          <h3 className="text-white text-lg font-semibold tracking-tight uppercase">
                            {categoryName} — {aspectRatio.label}
                          </h3>
                          <div className="px-3 py-1.5 inline-block rounded-lg bg-white/20 backdrop-blur-xl text-[10px] font-semibold text-white">
                            Commercial License Included
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            setDownloading(true);
                            await downloadImage(
                              resultUrl,
                              `product-${category}-${Date.now()}.jpg`,
                            );
                            setDownloading(false);
                          }}
                          disabled={downloading}
                          className="p-3 bg-white text-gray-900 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                        >
                          {downloading ? (
                            <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FiDownload className="text-xl" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
