import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef, useState, useEffect } from "react";
import logo from "../assets/logo.png";
import logoTight from "../assets/logo_tight.png";
import { PlusCircle, Trash2, ArrowLeft, Download, RotateCcw } from "lucide-react";

// All 7 columns active and fixed by default matching the reference bill
const COLUMNS = [
  { id: "date", label: "Trip Date", placeholder: "14-02-2026", width: "115px" },
  { id: "cabType", label: "Cab Type", placeholder: "Sedan", width: "95px" },
  { id: "particular", label: "Particular", placeholder: "Bellundur to Airport", width: "auto" },
  { id: "vehicle", label: "Vehicle details", placeholder: "KA05AP3185", width: "140px" },
  { id: "hours", label: "Total Hours", placeholder: "3 Hrs", width: "95px" },
  { id: "kms", label: "Total KMs", placeholder: "120 Kms", width: "100px" },
  { id: "amount", label: "Total Amount", placeholder: "1300.00", width: "140px" },
];

const DEFAULT_INVOICE_DATA = {
  invoiceNo: "876",
  date: "28-02-2026",
  billTo: "C/O CREATION",
  phone: "8970094480",
  email: "aktravelsbangalore@gmail.com",
  signatoryName: "PRADEEP C",
};

const DEFAULT_TRIPS = [
  { id: 1, date: "", cabType: "", particular: "", vehicle: "", hours: "", kms: "", amount: "" },
  { id: 2, date: "", cabType: "", particular: "", vehicle: "", hours: "", kms: "", amount: "" },
  { id: 3, date: "", cabType: "", particular: "", vehicle: "", hours: "", kms: "", amount: "" },
  { id: 4, date: "", cabType: "", particular: "", vehicle: "", hours: "", kms: "", amount: "" },
];

const STORAGE_KEY = "tripbill_multivehicle_v2";

export default function MultiVehiclePage({ onBack }) {
  const pdfRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Initialize Invoice Meta with LocalStorage persistence
  const [invoiceData, setInvoiceData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + "_meta");
      return saved ? JSON.parse(saved) : DEFAULT_INVOICE_DATA;
    } catch {
      return DEFAULT_INVOICE_DATA;
    }
  });

  // Constant Bank details as requested
  const [bankDetails] = useState({
    holderName: "Pradeep C",
    accountNo: "05210100024518",
    bankName: "BANK OF BORODA",
    ifscCode: "BARB0STJOHN",
    branch: "JOHN NAGAR",
  });

  // Initialize 4 blank rows by default with LocalStorage persistence
  const [trips, setTrips] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + "_trips");
      return saved ? JSON.parse(saved) : DEFAULT_TRIPS;
    } catch {
      return DEFAULT_TRIPS;
    }
  });

  // Save changes to localStorage so refreshing never loses data
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + "_meta", JSON.stringify(invoiceData));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }, [invoiceData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + "_trips", JSON.stringify(trips));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }, [trips]);

  // Clear Form button handler
  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all entered data?")) {
      try {
        localStorage.removeItem(STORAGE_KEY + "_meta");
        localStorage.removeItem(STORAGE_KEY + "_trips");
      } catch (e) {
        console.warn(e);
      }
      setInvoiceData(DEFAULT_INVOICE_DATA);
      setTrips(DEFAULT_TRIPS);
    }
  };

  // Row operations with auto-uppercase for vehicle details/number
  const handleTripChange = (idx, field, value) => {
    const updated = [...trips];
    // Automatically uppercase all vehicle number inputs
    const finalVal = field === "vehicle" ? value.toUpperCase() : value;
    updated[idx][field] = finalVal;
    setTrips(updated);
  };

  const addTripRow = () => {
    const newRow = {
      id: Date.now(),
      date: invoiceData.date || "",
      cabType: "Sedan",
      particular: "",
      vehicle: "",
      hours: "",
      kms: "",
      amount: "",
    };
    setTrips([...trips, newRow]);
  };

  const removeTripRow = (idx) => {
    if (trips.length <= 1) {
      alert("Bill must contain at least 1 row.");
      return;
    }
    setTrips(trips.filter((_, i) => i !== idx));
  };

  // Grand Total calculation
  const grandTotal = trips.reduce((sum, item) => {
    const parsed = parseFloat(String(item.amount).replace(/,/g, "").trim());
    return sum + (isNaN(parsed) ? 0 : parsed);
  }, 0);

  const formatINR = (val) => {
    return Number(val).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // PDF Generation: exact 1-to-1 pixel match to preview
  const [isPrinting, setIsPrinting] = useState(false);

  const generatePDF = async () => {
    try {
      setLoading(true);
      setIsPrinting(true);

      const input = pdfRef.current;
      if (!input) {
        alert("Invoice element not found");
        return;
      }

      await document.fonts.ready;
      await new Promise((r) => setTimeout(r, 60));

      // Save scroll positions and reset to 0 to prevent cropping
      const scrollContainer = input.closest(".overflow-x-auto") || input.parentElement;
      const savedScrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
      const savedScrollY = window.scrollY;

      if (scrollContainer) scrollContainer.scrollLeft = 0;
      window.scrollTo(0, 0);

      const canvas = await html2canvas(input, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        letterRendering: false,
        imageTimeout: 0,
        removeContainer: true,
        foreignObjectRendering: false,
      });

      // Restore user scroll immediately
      if (scrollContainer) scrollContainer.scrollLeft = savedScrollLeft;
      window.scrollTo(0, savedScrollY);

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 1123;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [pdfWidth, pdfHeight],
        compress: false,
      });

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight,
        undefined,
        "FAST"
      );

      pdf.save(`TaxInvoice-${invoiceData.invoiceNo || Date.now()}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF");
    } finally {
      setIsPrinting(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#bcc7ca] p-3 md:p-5">
      <div className="flex flex-col xl:flex-row gap-5 items-start">
        {/* FORM SIDEBAR */}
        <div className="w-full xl:w-[32%] bg-white rounded-xl shadow-lg p-5 xl:h-screen overflow-auto xl:sticky top-0">
          {/* Top Actions: Back to Home & Clear Data */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
            <button
              type="button"
              onClick={handleClearData}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
              title="Reset all fields to default"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Form
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-1">
            Tax Invoice Generator
          </h1>
          <p className="text-xs text-slate-500 mb-4">
            7 active columns default. Data auto-saves across refresh.
          </p>

          <div className="space-y-4">
            {/* Invoice Meta */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Invoice Details
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Invoice No (Red in Bill)
                  </label>
                  <input
                    type="text"
                    value={invoiceData.invoiceNo}
                    onChange={(e) =>
                      setInvoiceData({ ...invoiceData, invoiceNo: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-blue-600 font-bold text-red-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Invoice Date
                  </label>
                  <input
                    type="text"
                    value={invoiceData.date}
                    onChange={(e) =>
                      setInvoiceData({ ...invoiceData, date: e.target.value })
                    }
                    placeholder="28-02-2026"
                    className="w-full border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-blue-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Bill To (Client / Company)
                </label>
                <input
                  type="text"
                  value={invoiceData.billTo}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, billTo: e.target.value })
                  }
                  placeholder="C/O CREATION"
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-blue-600 font-medium bg-white"
                />
              </div>

              {/* Editable Mobile & Email */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={invoiceData.phone}
                    onChange={(e) =>
                      setInvoiceData({ ...invoiceData, phone: e.target.value })
                    }
                    placeholder="8970094480"
                    className="w-full border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-blue-600 font-medium bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Email / Gmail
                  </label>
                  <input
                    type="text"
                    value={invoiceData.email}
                    onChange={(e) =>
                      setInvoiceData({ ...invoiceData, email: e.target.value })
                    }
                    placeholder="aktravelsbangalore@gmail.com"
                    className="w-full border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-blue-600 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Trip Entries (Dynamic Rows) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Duty / Trip Entries ({trips.length})
                </h2>
                <button
                  type="button"
                  onClick={addTripRow}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Add Trip Row
                </button>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {trips.map((trip, idx) => (
                  <div
                    key={trip.id || idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-xs font-bold text-slate-700">
                        Trip #{idx + 1}
                      </span>
                      {trips.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTripRow(idx)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          title="Delete trip row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* All 7 column input fields */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                          Trip Date
                        </label>
                        <input
                          type="text"
                          value={trip.date}
                          onChange={(e) =>
                            handleTripChange(idx, "date", e.target.value)
                          }
                          placeholder="14-02-2026"
                          className="w-full border border-gray-300 p-1.5 rounded-md text-xs outline-none focus:border-blue-600 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                          Cab Type
                        </label>
                        <input
                          type="text"
                          value={trip.cabType}
                          onChange={(e) =>
                            handleTripChange(idx, "cabType", e.target.value)
                          }
                          placeholder="Sedan"
                          className="w-full border border-gray-300 p-1.5 rounded-md text-xs outline-none focus:border-blue-600 bg-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                          Particular (Route)
                        </label>
                        <input
                          type="text"
                          value={trip.particular}
                          onChange={(e) =>
                            handleTripChange(idx, "particular", e.target.value)
                          }
                          placeholder="Bellundur to Airport"
                          className="w-full border border-gray-300 p-1.5 rounded-md text-xs outline-none focus:border-blue-600 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                          Vehicle Details (Auto CAPS)
                        </label>
                        <input
                          type="text"
                          value={trip.vehicle}
                          onChange={(e) =>
                            handleTripChange(idx, "vehicle", e.target.value)
                          }
                          placeholder="KA05AP3185"
                          className="w-full border border-gray-300 p-1.5 rounded-md text-xs outline-none focus:border-blue-600 bg-white uppercase font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                          Total Hours
                        </label>
                        <input
                          type="text"
                          value={trip.hours}
                          onChange={(e) =>
                            handleTripChange(idx, "hours", e.target.value)
                          }
                          placeholder="3 Hrs"
                          className="w-full border border-gray-300 p-1.5 rounded-md text-xs outline-none focus:border-blue-600 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                          Total KMs
                        </label>
                        <input
                          type="text"
                          value={trip.kms}
                          onChange={(e) =>
                            handleTripChange(idx, "kms", e.target.value)
                          }
                          placeholder="120 Kms"
                          className="w-full border border-gray-300 p-1.5 rounded-md text-xs outline-none focus:border-blue-600 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                          Total Amount (INR)
                        </label>
                        <input
                          type="text"
                          value={trip.amount}
                          onChange={(e) =>
                            handleTripChange(idx, "amount", e.target.value)
                          }
                          placeholder="1300.00"
                          className="w-full border border-gray-300 p-1.5 rounded-md text-xs outline-none focus:border-blue-600 bg-white font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Constant Bank Details */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Bank Details (Constant)
                </h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                  Constant
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 bg-white p-2.5 rounded border border-slate-200 font-mono">
                <div><span className="font-semibold text-slate-800">A/C Holder:</span> {bankDetails.holderName}</div>
                <div><span className="font-semibold text-slate-800">A/C No:</span> {bankDetails.accountNo}</div>
                <div><span className="font-semibold text-slate-800">Bank:</span> {bankDetails.bankName}</div>
                <div><span className="font-semibold text-slate-800">IFSC:</span> {bankDetails.ifscCode}</div>
                <div><span className="font-semibold text-slate-800">Branch:</span> {bankDetails.branch}</div>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={generatePDF}
                disabled={loading}
                className="w-full bg-[#15803d] hover:bg-[#166534] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{loading ? "Generating PDF..." : "Download Landscape PDF"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: COMPLETE 4-SIDED PRINTABLE INVOICE SHEET */}
        <div className="w-full xl:flex-1 overflow-x-auto pb-6">
          <div className="text-xs text-slate-600 font-medium mb-2 xl:hidden flex items-center gap-1.5 px-1">
            <span>⇄ Swipe horizontally to inspect bill preview</span>
          </div>

          {/* Unified Closed Box Container (1123px wide, border-[3px] border-black, NO outer padding) */}
          <div
            ref={pdfRef}
            className="w-[1123px] min-w-[1123px] max-w-[1123px] bg-white border-[3px] border-black relative overflow-hidden mx-auto shrink-0 flex flex-col justify-between"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              minHeight: "794px",
              boxSizing: "border-box",
            }}
          >
            <div>
              {/* TOP HEADER: LOGO + TOURS & TRAVELS (Aligned in exact same horizontal line) */}
              <div className="border-b-[2px] border-black py-2.5 px-4 bg-white flex items-center justify-center">
                <div className="inline-flex items-center justify-center gap-3.5">
                  <img
                    src={logoTight}
                    alt="AK Logo"
                    className="h-[54px] w-auto object-contain block shrink-0"
                    style={{ height: "54px", width: "auto", display: "block" }}
                  />
                  <h1
                    className="font-bold text-[#1d4ed8] tracking-wider leading-none font-serif m-0 p-0 whitespace-nowrap"
                    style={{
                      fontSize: "36px",
                      lineHeight: "1",
                      fontFamily: "'Times New Roman', Times, serif",
                      position: "relative",
                      top: isPrinting ? "-17px" : "0px",
                    }}
                  >
                    TOURS &amp; TRAVELS
                  </h1>
                </div>
              </div>

              {/* ADDRESS LINE */}
              <div className="border-b-[1.5px] border-black py-1.5 text-center px-4 bg-white">
                <p className="text-[13px] font-bold tracking-wide text-black uppercase">
                  #118 28TH CROSS LR NAGAR VIVEK NAGAR POST BANGALORE - 560047
                </p>
              </div>

              {/* CONTACT LINE: Editable Mobile & Gmail */}
              <div className="border-b-[1.5px] border-black py-1.5 flex items-center justify-between px-16 text-[13px] font-bold text-black bg-white">
                <p>Mobile :- {invoiceData.phone || "8970094480"}</p>
                <p>
                  Gmail :-{" "}
                  <span className="text-blue-800 underline">
                    {invoiceData.email || "aktravelsbangalore@gmail.com"}
                  </span>
                </p>
              </div>

              {/* DOCUMENT TITLE: Tax Invoice */}
              <div className="border-b-[1.5px] border-black py-1 text-center bg-white">
                <h2 className="text-[15px] font-bold text-black uppercase tracking-wide">
                  Tax Invoice
                </h2>
              </div>

              {/* SUBTITLE: Orginal for Tax Recipient */}
              <div className="border-b-[1.5px] border-black py-1 text-center bg-white">
                <p className="text-[13px] font-bold text-black tracking-wide">
                  Orginal for Tax Recipient
                </p>
              </div>

              {/* BILL TO & INVOICE META ROW */}
              <div className="border-b-[2px] border-black flex items-stretch bg-white">
                {/* Bill To */}
                <div className="flex-1 flex border-r border-black items-center">
                  <div className="w-[100px] border-r border-black px-3 py-2 text-[14px] font-bold text-black self-stretch flex items-center">
                    Bill To :
                  </div>
                  <div className="px-4 py-2 text-[15px] font-bold text-black uppercase tracking-wide">
                    {invoiceData.billTo || "C/O CREATION"}
                  </div>
                </div>

                {/* Invoice No & Date Centered */}
                <div className="w-[360px] flex flex-col justify-center divide-y divide-black">
                  <div className="px-3 py-1.5 flex items-center justify-center gap-2 text-[14px] font-bold">
                    <span className="text-black">Invoice no :</span>
                    <span className="text-red-600 font-bold text-[18px]">
                      {invoiceData.invoiceNo || "876"}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 flex items-center justify-center gap-2 text-[14px] font-bold text-black">
                    <span>Date :</span>
                    <span>{invoiceData.date || "28-02-2026"}</span>
                  </div>
                </div>
              </div>

              {/* STRICT FIXED-WIDTH MULTI-VEHICLE TRIPS TABLE (7 COLUMNS DEFAULT) */}
              <table
                className="w-full border-collapse border-b-[2px] border-black text-[13.5px]"
                style={{ tableLayout: "fixed" }}
              >
                <thead>
                  <tr className="border-b border-black bg-white">
                    {COLUMNS.map((col) => (
                      <th
                        key={col.id}
                        className="py-2 px-2 font-bold text-black border-r border-black last:border-r-0 text-center overflow-hidden"
                        style={{
                          width: col.id === "particular" ? undefined : col.width,
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip, rIdx) => (
                    <tr
                      key={trip.id || rIdx}
                      className="border-b border-black last:border-b-0 min-h-[40px] h-[40px]"
                    >
                      {COLUMNS.map((col) => {
                        const val = trip[col.id] || "";
                        if (col.id === "amount") {
                          const numVal = parseFloat(
                            String(val).replace(/,/g, "").trim()
                          );
                          const hasAmount = val !== "" && !isNaN(numVal);
                          return (
                            <td
                              key={col.id}
                              className="py-1.5 px-2 text-center font-medium border-r border-black last:border-r-0 h-[40px] overflow-hidden whitespace-nowrap"
                              style={{ width: col.width }}
                            >
                              {hasAmount ? (
                                <span>₹ {formatINR(numVal)}</span>
                              ) : (
                                <span>&nbsp;</span>
                              )}
                            </td>
                          );
                        }

                        return (
                          <td
                            key={col.id}
                            className={`py-1.5 px-2 border-r border-black last:border-r-0 h-[40px] overflow-hidden ${
                              col.id === "particular"
                                ? "text-center font-normal"
                                : "text-center font-medium"
                            }`}
                            style={{
                              width: col.id === "particular" ? undefined : col.width,
                              wordBreak: "break-word",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {val ? val : <span>&nbsp;</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* COMPLETE 4-SIDED BOTTOM SECTION: Bank Details, Signatory & Red Grand Total */}
            <div className="border-t-[2px] border-black bg-white">
              <div className="flex items-stretch min-h-[125px]">
                {/* Bank Details (Left box) */}
                <div className="w-[320px] border-r border-black p-3 text-[12.5px] leading-tight text-black flex flex-col justify-center">
                  <p className="font-bold text-[13px] mb-1">Bank Details:</p>
                  <p>A/C Holder : Name: {bankDetails.holderName}</p>
                  <p>A/C No: {bankDetails.accountNo}</p>
                  <p>Bank name: {bankDetails.bankName}</p>
                  <p>IFSC Code: {bankDetails.ifscCode}</p>
                  <p>Branch: {bankDetails.branch}</p>
                </div>

                {/* Right side area: Signatory + Bottom Grand Total Row */}
                <div className="flex-1 flex flex-col justify-between">
                  {/* Middle Company & Signatory */}
                  <div className="py-4 flex flex-col items-center justify-center text-center">
                    <p className="font-bold text-[16px] tracking-wide text-black">
                      AK TOURS &amp; TRAVELS
                    </p>
                    <p className="font-bold text-[14px] text-black mt-1">
                      {invoiceData.signatoryName || "PRADEEP C"}
                    </p>
                  </div>

                  {/* Grand Total Row directly aligned with bottom */}
                  <div className="border-t border-black flex items-stretch">
                    {/* Empty spacer on left */}
                    <div className="flex-1 border-r border-black"></div>

                    {/* Grand Total Label */}
                    <div className="w-[160px] border-r border-black py-2.5 px-4 text-center">
                      <span className="text-red-600 font-bold text-[20px]">
                        Grand Total
                      </span>
                    </div>

                    {/* Grand Total Amount Centered (matches 140px amount column) */}
                    <div className="w-[140px] py-2.5 px-2 text-center">
                      <span className="text-red-600 font-bold text-[20px] whitespace-nowrap">
                        ₹ {formatINR(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
