import { Sparkles } from "lucide-react";
import TripOption from "./TripOption";
import InvoicePreview from "./InvoicePreview";

export default function HeroSection({ tripType, onSelectTripType, onContinue }) {
  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
      {/* Decorative subtle blue circular backdrop accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[500px] bg-gradient-to-b from-blue-100/60 via-blue-50/30 to-transparent rounded-full blur-3xl -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Eyebrow + Headline Area */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[13px] font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Fast &amp; Simple Travel Billing in Rupees (₹)</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-slate-900 tracking-tight leading-[1.06] mb-5">
            Make every trip <br className="hidden sm:inline" />
            <span className="text-blue-600">billable.</span>
          </h1>

          {/* Supporting paragraph */}
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
            Generate clean, professional Indian travel bills, single trip sheets, and multi-trip cash bills in just a few clicks.
          </p>
        </div>

        {/* 2-Column Grid on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: Trip selection cards & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <TripOption
              tripType={tripType}
              onSelectTripType={onSelectTripType}
              onContinue={onContinue}
            />
          </div>

          {/* Right: Realistic invoice preview card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <InvoicePreview tripType={tripType} />
          </div>
        </div>
      </div>
    </section>
  );
}


