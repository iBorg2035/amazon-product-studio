import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white py-12 px-6 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="font-black text-lg tracking-tight">Amazon Product Studio</div>
            <p className="text-gray-500 text-xs mt-1">AI-powered product photography for Amazon sellers</p>
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <a href="mailto:support@amazonproductstudio.com" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-gray-600">
          © 2026 Amazon Product Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
