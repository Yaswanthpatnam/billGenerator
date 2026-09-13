import { Check, Receipt, FileDown, ShieldCheck } from "lucide-react";

export default function Benefits() {
  const benefits = [
    {
      label: "Rupees (₹) & GST ready",
      icon: Receipt,
    },
    {
      label: "Instant High-Res PDF",
      icon: FileDown,
    },
    {
      label: "100% Free · No Sign Up",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="border-t border-b border-slate-200/80 bg-white/70 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[15px] font-bold text-slate-800 text-center md:text-left">
            Everything Indian tour operators, taxi drivers &amp; travel agencies need.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {benefits.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-2 text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-[14px] font-semibold text-slate-700">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


