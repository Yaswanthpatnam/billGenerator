import { FileText, CheckCircle2 } from "lucide-react";

export default function InvoicePreview({ tripType = "single" }) {
  const isMulti = tripType === "multi";
  const isMultiVehicle = tripType === "multi-vehicle";

  const singleItems = [
    {
      title: "Airport Transfer · Toyota Etios",
      subtitle: "12 Sep · Indiranagar → KIAL Airport (T2)",
      qty: 1,
      rate: "₹1,850",
      amount: "₹1,850",
    },
  ];

  const multiItems = [
    {
      title: "Airport Drop · Innova Crysta",
      subtitle: "10 Sep · Indiranagar → Kempegowda Intl Airport",
      qty: 1,
      rate: "₹2,200",
      amount: "₹2,200",
    },
    {
      title: "Corporate Local 8hr/80km · Etios",
      subtitle: "11 Sep · Indiranagar ↔ Electronic City Phase 1",
      qty: 1,
      rate: "₹2,800",
      amount: "₹2,800",
    },
    {
      title: "Outstation Day Trip · Sedan",
      subtitle: "12 Sep · Bengaluru ↔ Mysuru Palace",
      qty: 1,
      rate: "₹3,850",
      amount: "₹3,850",
    },
  ];

  const multiVehicleItems = [
    {
      title: "KA05AP3185 · Sedan",
      subtitle: "14 Feb · Bellundur To Airport (3 Hrs, 120 Kms)",
      amount: "₹1,300.00",
    },
    {
      title: "KA19AE9828 · Sedan",
      subtitle: "14 Feb · Ksr rly station → Creation office (Short Drop)",
      amount: "₹900.00",
    },
    {
      title: "KA51AD1376 · Sedan",
      subtitle: "14 Feb · Airport To Bellundur (3 Hrs, 120 Kms)",
      amount: "₹1,300.00",
    },
    {
      title: "KA04AA4186 · Sedan",
      subtitle: "18 Feb · Bellundur To Airport (3 Hrs, 120 Kms)",
      amount: "₹1,300.00",
    },
  ];

  const currentItems = isMultiVehicle
    ? multiVehicleItems
    : isMulti
    ? multiItems
    : singleItems;

  const subtotal = isMultiVehicle
    ? "₹8,700.00"
    : isMulti
    ? "₹8,850.00"
    : "₹1,850.00";
  const tax = "₹0.00";
  const total = isMultiVehicle
    ? "₹8,700.00"
    : isMulti
    ? "₹8,850.00"
    : "₹1,850.00";

  return (
    <div className="w-full">
      {/* Top Label */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
          Preview
        </span>
        <span className="text-[12px] font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
          {isMultiVehicle
            ? "Multi-Vehicle Bill"
            : isMulti
            ? "3 items bundled"
            : "Single journey"}
        </span>
      </div>

      {/* Invoice Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-6 sm:p-7 transition-all duration-300">
        {/* Header inside invoice */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[15px] font-bold text-slate-900">TripBill</span>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            GST Ready
          </span>
        </div>

        {/* Invoice Title & Number */}
        <div className="pt-5 pb-4">
          <h4 className="text-[22px] font-bold text-slate-900 tracking-tight">
            {isMultiVehicle
              ? "Tax Invoice"
              : isMulti
              ? "Multi-Trip Cash Bill"
              : "Single Trip Sheet"}
          </h4>
          <p className="text-[13px] text-slate-400 font-mono mt-0.5">
            {isMultiVehicle ? (
              <>
                <span className="text-red-600 font-bold">#876</span> · 28 Feb 2026 · Original for Tax Recipient
              </>
            ) : isMulti ? (
              "#TB-1252 · 12 Sep 2026"
            ) : (
              "#TB-2048 · 12 Sep 2026"
            )}
          </p>
        </div>

        {/* Billed To / From */}
        <div className="grid grid-cols-2 gap-4 py-3 text-[13px]">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Operator
            </span>
            <p className="font-semibold text-slate-800">AK Tours &amp; Travels</p>
            <p className="text-slate-500 text-[12px]">Bengaluru, Karnataka</p>
          </div>
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Guest / Company
            </span>
            <p className="font-semibold text-slate-800">
              {isMultiVehicle ? "C/O CREATION" : "Galiahotwala Eng. Co."}
            </p>
            <p className="text-slate-500 text-[12px]">Corporate Client</p>
          </div>
        </div>

        {/* Table items */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-2">
            <span>{isMultiVehicle ? "Vehicle & Route Details" : "Duty Description"}</span>
            <span>Amount (INR)</span>
          </div>

          <div className="space-y-3 divide-y divide-slate-50">
            {currentItems.map((item, idx) => (
              <div key={idx} className="pt-2.5 first:pt-1 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">
                    {item.title}
                  </p>
                  <p className="text-[12px] text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[14px] font-semibold text-slate-900">
                    {item.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constant Bank Info Badge for Multi-Vehicle */}
        {isMultiVehicle && (
          <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 font-mono">
            <span className="font-bold text-slate-800">Bank of Baroda:</span> A/C 05210100024518 · BARB0STJOHN (Constant)
          </div>
        )}

        {/* Financial Summary */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-[13px]">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-medium text-slate-700">{subtotal}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Tolls &amp; Parking</span>
            <span className="font-medium text-slate-700">{tax}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-slate-200/60">
            <span className="text-[15px] font-bold text-slate-900">
              {isMultiVehicle ? "Grand Total" : "Total Amount"}
            </span>
            <span
              className={`text-[26px] font-extrabold ${
                isMultiVehicle ? "text-red-600" : "text-blue-900"
              }`}
            >
              {total}
            </span>
          </div>
        </div>

        {/* Ready to send pill */}
        <div className="mt-5 pt-3">
          <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ready to generate &amp; print PDF</span>
          </div>
        </div>
      </div>
    </div>
  );
}


