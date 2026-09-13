export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">TripBill</span>
          <span>•</span>
          <span className="text-slate-500">Fast travel billing platform for India</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="hidden md:inline text-slate-400">
            Built for drivers &amp; travel agencies.
          </span>
          <a
            href="#how-it-works"
            className="hover:text-blue-600 transition-colors"
          >
            How it works
          </a>
          <a
            href="#features"
            className="hover:text-blue-600 transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="hover:text-blue-600 transition-colors"
          >
            Pricing
          </a>
        </div>
      </div>
    </footer>
  );
}


