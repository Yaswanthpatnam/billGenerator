import { useState } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import Benefits from "./Benefits";
import Footer from "./Footer";
import {
  Clock,
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Zap,
  Printer,
  Smartphone,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function LandingPage({ onInvoice, onMultiTrip, onMultiVehicle }) {
  const [tripType, setTripType] = useState("single");

  const handleContinue = () => {
    if (tripType === "multi-vehicle") {
      onMultiVehicle?.();
    } else if (tripType === "multi") {
      onMultiTrip?.();
    } else {
      onInvoice?.();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 antialiased flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      <div>
        {/* Navigation Header */}
        <Header onGetStarted={handleContinue} />

        {/* Hero with Selection Cards and Live Preview */}
        <main>
          <HeroSection
            tripType={tripType}
            onSelectTripType={(type) => setTripType(type)}
            onContinue={handleContinue}
          />

          {/* Value Proposition & Benefits Row */}
          <Benefits />

          {/* SECTION 1: HOW IT WORKS */}
          <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-blue-600 font-bold text-[13px] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Simple 3-Step Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                Effortless invoicing in minutes
              </h2>
              <p className="text-slate-600 mt-3 text-[16px]">
                Built specifically for Indian taxi drivers, corporate tour operators, and vehicle fleet owners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Choose bill format",
                  desc: "Select a single journey bill (with km & time readings) or a multi-trip cash sheet for multiple days.",
                  icon: Sparkles,
                },
                {
                  step: "02",
                  title: "Enter trip details",
                  desc: "Add guest/company name, vehicle details, duty route, rate per km, toll, parking, and driver allowance in Rupees (₹).",
                  icon: FileSpreadsheet,
                },
                {
                  step: "03",
                  title: "Instant PDF download",
                  desc: "Generate high-resolution printable PDFs complete with signature fields ready to print or share via WhatsApp.",
                  icon: Clock,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 font-bold text-[15px] border border-blue-100">
                      {item.step}
                    </div>
                    <h3 className="text-[18px] font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 2: FEATURES */}
          <section id="features" className="py-20 bg-slate-100/70 border-t border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="text-blue-600 font-bold text-[13px] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  Powerful Capabilities
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                  Designed for Indian transport billing
                </h2>
                <p className="text-slate-600 mt-3 text-[16px]">
                  All the essential fields you need without complex software or subscription fees.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Layers,
                    title: "Single & Multi-Trip Formats",
                    desc: "Generate standalone trip receipts or bundle multiple dates and journeys into one clean corporate cash sheet.",
                  },
                  {
                    icon: Zap,
                    title: "Indian Travel Charges & Bata",
                    desc: "Pre-configured fields for opening/closing Km, 4hr/40km, 8hr/80km packages, toll, parking, and driver allowance in ₹.",
                  },
                  {
                    icon: FileText,
                    title: "Dynamic Duty Expansion",
                    desc: "Easily add multiple trip rows. Duty type descriptions expand with multi-line support for complex itineraries.",
                  },
                  {
                    icon: Printer,
                    title: "Standard Physical Print Layout",
                    desc: "1-to-1 matching with physical printed cash bill books, including Tours & Travels headers and official signature blocks.",
                  },
                  {
                    icon: Smartphone,
                    title: "Mobile-Friendly Bill Entry",
                    desc: "Create and download bills directly on your smartphone, tablet, or laptop on the go.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "100% Free & Zero Login",
                    desc: "No registration required, no credit cards, and no watermarks. Open the app and start generating bills instantly.",
                  },
                ].map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={i}
                      className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-blue-500/20">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-[17px] font-bold text-slate-900 mb-2">
                        {feat.title}
                      </h3>
                      <p className="text-[14px] text-slate-600 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SECTION 3: PRICING */}
          <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-emerald-700 font-bold text-[13px] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Transparent &amp; Free
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                100% Free Forever
              </h2>
              <p className="text-slate-600 mt-3 text-[16px]">
                No hidden fees, no subscriptions. Built to support drivers, agencies, and small tour operators across India.
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-white rounded-3xl border-2 border-blue-600 p-8 sm:p-10 shadow-xl shadow-blue-500/10 relative">
              <div className="absolute -top-3.5 right-8 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                Complete Access
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900">
                  ₹0
                </span>
                <span className="text-slate-500 font-medium text-lg">
                  / forever
                </span>
              </div>

              <p className="text-slate-600 text-[15px] mb-8">
                Generate unlimited travel invoices and cash bills whenever you need them.
              </p>

              <div className="space-y-3.5 mb-8 text-[15px] text-slate-700">
                {[
                  "Unlimited Single Trip Bills with km/hrs calculations",
                  "Unlimited Multi-Trip Cash Bills & sheets",
                  "High-resolution PDF downloads ready for WhatsApp",
                  "Signature boxes & Tours & Travels layout",
                  "Zero advertisements, zero account lockouts",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onInvoice}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-[14px] transition text-center cursor-pointer"
                >
                  Single Trip Bill
                </button>
                <button
                  type="button"
                  onClick={onMultiTrip}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[14px] transition shadow-md shadow-blue-500/20 text-center cursor-pointer"
                >
                  Multi-Trip Bill
                </button>
              </div>
            </div>
          </section>

          {/* Quick CTA Banner */}
          <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-500/15">
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Ready to generate your travel bill?
                </h3>
                <p className="text-blue-100 text-[15px] max-w-xl">
                  Choose between Single Trip and Multi-Trip formats and download your PDF instantly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={onInvoice}
                  className="px-6 py-3.5 rounded-xl bg-white text-slate-900 font-semibold text-[15px] hover:bg-slate-100 transition-all shadow-md active:scale-[0.98] text-center cursor-pointer"
                >
                  Create Single Trip Bill
                </button>
                <button
                  type="button"
                  onClick={onMultiTrip}
                  className="px-6 py-3.5 rounded-xl bg-blue-900/40 hover:bg-blue-900/60 text-white font-semibold text-[15px] border border-white/20 transition-all shadow-md active:scale-[0.98] text-center cursor-pointer"
                >
                  Create Multi-Trip Bill
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}


