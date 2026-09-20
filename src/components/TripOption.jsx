import { FileText, Files, Car, ArrowRight } from "lucide-react";

export default function TripOption({ tripType, onSelectTripType, onContinue }) {
  const options = [
    {
      id: "single",
      title: "Single trip",
      subtitle: "One journey, one clear bill.",
      description: "Ideal for individual rides, airport transfers, and one-off client trips.",
      icon: FileText,
    },
    {
      id: "multi",
      title: "Multi trip",
      subtitle: "Bundle routes into one cash bill.",
      description: "Perfect for corporate sheets, recurring travel, or monthly company billing.",
      icon: Files,
    },
    {
      id: "multi-vehicle",
      title: "Multi-Vehicle Bill",
      subtitle: "Diff vehicles & trips in one bill.",
      description: "Consolidated tax invoice for different cabs, dates, routes, and bank details.",
      icon: Car,
    },
  ];

  const statusText =
    tripType === "single"
      ? "Single trip selected — ready to create your single journey bill."
      : tripType === "multi"
      ? "Multi trip selected — your multi-trip cash sheet workspace is ready."
      : "Multi-vehicle tax invoice selected — consolidated duty workspace is ready.";

  const continueLabel =
    tripType === "single"
      ? "Continue with single trip"
      : tripType === "multi"
      ? "Continue with multi trip"
      : "Continue with multi-vehicle bill";

  return (
    <div className="w-full space-y-6">
      {/* Cards container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt) => {
          const isActive = tripType === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectTripType(opt.id)}
              aria-pressed={isActive}
              className={`group relative text-left p-6 rounded-2xl border transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer ${
                isActive
                  ? "bg-blue-50/70 border-blue-600 shadow-md shadow-blue-500/10 -translate-y-0.5"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-1"
              }`}
            >
              {/* Card top: Icon + Arrow */}
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? "text-blue-600 bg-blue-100/80 translate-x-0.5"
                      : "text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5"
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-[18px] font-bold text-slate-900 tracking-tight mb-1">
                {opt.title}
              </h3>
              <p className="text-[14px] font-semibold text-slate-700 mb-2">
                {opt.subtitle}
              </p>
              <p className="text-[13px] leading-relaxed text-slate-500">
                {opt.description}
              </p>

              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-blue-600/10 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  Active
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Status note & CTA Button */}
      <div className="pt-2 space-y-4">
        <div className="flex items-center gap-2 text-[14px] font-medium text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{statusText}</span>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-[16px] font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 cursor-pointer"
        >
          <span>{continueLabel}</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}


