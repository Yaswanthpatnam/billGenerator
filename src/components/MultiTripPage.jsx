import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef, useState, useEffect } from "react";
import logo from "../assets/logo.png";
import signature from "../assets/signature.png";
import { RotateCcw } from "lucide-react";

const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const blankTrip = () => ({
  dutyType: "",
  date: getTodayDate(),
  totalKm: "",
  totalTime: "",
  amount: "",
  toll: "",
  parking: "",
  total: "",
});

const DEFAULT_CUSTOMER_DATA = {
  tripSheetNo: "1252",
  guestName: "",
  companyName: "",
  reportingTo: "",
  driverName: "",
  vehicleType: "",
  vehicleNo: "",
};

const STORAGE_KEY = "tripbill_multitrip_v2";

const MultiTripPage = ({ onBack }) => {
  const pdfRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [customerData, setCustomerData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + "_customer");
      return saved ? JSON.parse(saved) : DEFAULT_CUSTOMER_DATA;
    } catch {
      return DEFAULT_CUSTOMER_DATA;
    }
  });

  const [trips, setTrips] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + "_trips");
      return saved ? JSON.parse(saved) : [blankTrip()];
    } catch {
      return [blankTrip()];
    }
  });

  // Save changes to localStorage so refreshing never loses data
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY + "_customer",
        JSON.stringify(customerData)
      );
    } catch (e) {
      console.warn(e);
    }
  }, [customerData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + "_trips", JSON.stringify(trips));
    } catch (e) {
      console.warn(e);
    }
  }, [trips]);

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all entered data?")) {
      try {
        localStorage.removeItem(STORAGE_KEY + "_customer");
        localStorage.removeItem(STORAGE_KEY + "_trips");
      } catch (e) {
        console.warn(e);
      }
      setCustomerData(DEFAULT_CUSTOMER_DATA);
      setTrips([blankTrip()]);
    }
  };

  const handleCustomerChange = (e) => {
    const val =
      e.target.name === "vehicleNo"
        ? e.target.value.toUpperCase()
        : e.target.value;
    setCustomerData({
      ...customerData,
      [e.target.name]: val,
    });
  };

  const handleTripChange = (index, field, value) => {
    const updatedTrips = [...trips];
    updatedTrips[index] = {
      ...updatedTrips[index],
      [field]: value,
    };

    // Auto calculate row total if amount/toll/parking change and are numeric
    if (field === "amount" || field === "toll" || field === "parking") {
      const amtNum = parseFloat(field === "amount" ? value : updatedTrips[index].amount) || 0;
      const tollNum = parseFloat(field === "toll" ? value : updatedTrips[index].toll) || 0;
      const parkNum = parseFloat(field === "parking" ? value : updatedTrips[index].parking) || 0;
      updatedTrips[index].total = String(amtNum + tollNum + parkNum);
    }

    setTrips(updatedTrips);
  };

  const addTrip = () => {
    setTrips([...trips, blankTrip()]);
  };

  const removeTrip = (index) => {
    if (trips.length <= 1) {
      setTrips([blankTrip()]);
      return;
    }
    setTrips(trips.filter((_, i) => i !== index));
  };

  const grandAmount = trips.reduce(
    (acc, item) => acc + (parseFloat(item.amount) || 0),
    0
  );
  const grandToll = trips.reduce(
    (acc, item) => acc + (parseFloat(item.toll) || 0),
    0
  );
  const grandParking = trips.reduce(
    (acc, item) => acc + (parseFloat(item.parking) || 0),
    0
  );
  const grandTotal = grandAmount + grandToll + grandParking;

  const formatIndianDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const generatePDF = async () => {
    if (loading) return;

    const hasCustomerData = Object.values(customerData).some(
      (val) => val && String(val).trim() !== ""
    );
    const hasTripData = trips.some((trip) =>
      Object.values(trip).some((val) => val && String(val).trim() !== "")
    );

    if (!hasCustomerData && !hasTripData) {
      alert("Please enter at least one field before generating PDF");
      return;
    }

    try {
      setLoading(true);
      const input = pdfRef.current;
      if (!input) {
        alert("Invoice element not found");
        return;
      }

      await document.fonts.ready;

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
        letterRendering: true,
        imageTimeout: 0,
        removeContainer: true,
        foreignObjectRendering: false,
      });

      // Restore user scroll immediately
      if (scrollContainer) scrollContainer.scrollLeft = savedScrollLeft;
      window.scrollTo(0, savedScrollY);

      const imgData = canvas.toDataURL("image/png");
      const pdfHeight = Math.max(1123, (canvas.height * 794) / canvas.width);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [794, pdfHeight],
        compress: false,
      });

      pdf.addImage(imgData, "PNG", 0, 0, 794, pdfHeight, undefined, "FAST");
      pdf.save(`MultiTripSheet-${customerData.tripSheetNo || Date.now()}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#bcc7ca] p-2 sm:p-4 md:p-6 font-sans">
      <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-5 items-start">
        {/* LEFT FORM SIDEBAR (Mobile-optimized) */}
        <div
          className="
            w-full
            xl:w-[32%]
            bg-white
            rounded-2xl
            shadow-xl
            p-4 sm:p-6
            xl:h-screen
            overflow-y-auto
            xl:sticky
            top-0
          "
        >
          {/* Top Actions: Back Button & Clear Data */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition cursor-pointer"
              >
                ← Back to Home
              </button>
            )}
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition cursor-pointer"
              title="Reset all fields"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Form
            </button>
          </div>

          <div className="mb-5 pb-3 border-b border-slate-100">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 leading-tight">
              Multi-Trip Cash Bill
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Add multiple trips into one sheet. Mobile-friendly entry.
            </p>
          </div>

          <div className="space-y-4">
            {/* Customer & Vehicle Information Card */}
            <div className="border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-3 bg-slate-50/70">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Customer &amp; Vehicle
                </h2>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">No:</span>
                  <input
                    type="text"
                    name="tripSheetNo"
                    value={customerData.tripSheetNo}
                    onChange={handleCustomerChange}
                    placeholder="1252"
                    className="w-20 border border-gray-400 dark:border-slate-600 px-2 py-1 rounded text-sm font-bold text-red-600 outline-none bg-white dark:bg-slate-800 dark:text-red-400 text-center"
                  />
                </div>
              </div>

              {/* Left column fields */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Guest Name
                </label>
                <input
                  type="text"
                  name="guestName"
                  value={customerData.guestName}
                  onChange={handleCustomerChange}
                  placeholder="e.g. Galiahotwala Eng. Co."
                  className="w-full border border-gray-300 dark:border-slate-600 p-2.5 sm:p-3 rounded-lg text-[15px] sm:text-[16px] outline-none bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={customerData.companyName}
                  onChange={handleCustomerChange}
                  placeholder="e.g. Engineering Company Pvt Ltd"
                  className="w-full border border-gray-300 dark:border-slate-600 p-2.5 sm:p-3 rounded-lg text-[15px] sm:text-[16px] outline-none bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Reporting To
                </label>
                <input
                  type="text"
                  name="reportingTo"
                  value={customerData.reportingTo}
                  onChange={handleCustomerChange}
                  placeholder="e.g. Operations Desk"
                  className="w-full border border-gray-300 dark:border-slate-600 p-2.5 sm:p-3 rounded-lg text-[15px] sm:text-[16px] outline-none bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-blue-500"
                />
              </div>

              {/* Right column fields */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    name="driverName"
                    value={customerData.driverName}
                    onChange={handleCustomerChange}
                    placeholder="e.g. Manu"
                    className="w-full border border-gray-300 dark:border-slate-600 p-2.5 sm:p-3 rounded-lg text-[15px] sm:text-[16px] outline-none bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Type of Vehicle
                    </label>
                    <input
                      type="text"
                      name="vehicleType"
                      value={customerData.vehicleType}
                      onChange={handleCustomerChange}
                      placeholder="e.g. Etios"
                      className="w-full border border-gray-300 dark:border-slate-600 p-2.5 sm:p-3 rounded-lg text-[15px] sm:text-[16px] outline-none bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Vehicle No.
                    </label>
                    <input
                      type="text"
                      name="vehicleNo"
                      value={customerData.vehicleNo}
                      onChange={handleCustomerChange}
                      placeholder="e.g. KA 02 AF 8062"
                      className="w-full border border-gray-300 dark:border-slate-600 p-2.5 sm:p-3 rounded-lg text-[15px] sm:text-[16px] outline-none bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Trips List Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Trips ({trips.length})
                </h2>
                <button
                  type="button"
                  onClick={addTrip}
                  className="text-xs sm:text-sm font-bold px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition shadow-sm cursor-pointer flex items-center gap-1"
                >
                  <span>+ Add Trip</span>
                </button>
              </div>

              {trips.map((trip, idx) => (
                <div
                  key={idx}
                  className="border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 bg-white dark:bg-slate-800/80 space-y-2.5 shadow-sm"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded">
                      Trip #{idx + 1}
                    </span>
                    {trips.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTrip(idx)}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold cursor-pointer p-1"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Duty Type with Multi-line Expandable Textarea */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5">
                      Duty Type (Shift+Enter for new line)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Airport Transfer&#10;Pickup: Indiranagar&#10;Drop: Airport"
                      value={trip.dutyType}
                      onChange={(e) =>
                        handleTripChange(idx, "dutyType", e.target.value)
                      }
                      className="w-full border border-gray-300 dark:border-slate-600 p-2 rounded-lg text-[14px] sm:text-[15px] outline-none focus:border-blue-600 dark:focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 resize-y"
                    />
                  </div>

                  {/* Date Picker per Trip Row */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5">
                      Trip Date
                    </label>
                    <input
                      type="date"
                      value={trip.date}
                      onChange={(e) =>
                        handleTripChange(idx, "date", e.target.value)
                      }
                      className="w-full border border-gray-300 dark:border-slate-600 p-2 rounded-lg text-[14px] sm:text-[15px] outline-none focus:border-blue-600 dark:focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5">
                        Total km
                      </label>
                      <input
                        type="text"
                        placeholder="75 Kms"
                        value={trip.totalKm}
                        onChange={(e) =>
                          handleTripChange(idx, "totalKm", e.target.value)
                        }
                        className="w-full border border-gray-300 dark:border-slate-600 p-2 rounded-lg text-[14px] sm:text-[15px] outline-none bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5">
                        Total Time
                      </label>
                      <input
                        type="text"
                        placeholder="7 HRS"
                        value={trip.totalTime}
                        onChange={(e) =>
                          handleTripChange(idx, "totalTime", e.target.value)
                        }
                        className="w-full border border-gray-300 dark:border-slate-600 p-2 rounded-lg text-[14px] sm:text-[15px] outline-none bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5">
                        Amount
                      </label>
                      <input
                        type="text"
                        placeholder="2500"
                        value={trip.amount}
                        onChange={(e) =>
                          handleTripChange(idx, "amount", e.target.value)
                        }
                        className="w-full border border-gray-300 dark:border-slate-600 p-2 rounded-lg text-[14px] sm:text-[15px] outline-none bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5">
                        Toll
                      </label>
                      <input
                        type="text"
                        placeholder="110"
                        value={trip.toll}
                        onChange={(e) =>
                          handleTripChange(idx, "toll", e.target.value)
                        }
                        className="w-full border border-gray-300 dark:border-slate-600 p-2 rounded-lg text-[14px] sm:text-[15px] outline-none bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5">
                        Parking
                      </label>
                      <input
                        type="text"
                        placeholder="-"
                        value={trip.parking}
                        onChange={(e) =>
                          handleTripChange(idx, "parking", e.target.value)
                        }
                        className="w-full border border-gray-300 dark:border-slate-600 p-2 rounded-lg text-[14px] sm:text-[15px] outline-none bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5">
                      Trip Total (Auto-calculated)
                    </label>
                    <input
                      type="text"
                      placeholder="2610/-"
                      value={trip.total}
                      onChange={(e) =>
                        handleTripChange(idx, "total", e.target.value)
                      }
                      className="w-full border border-gray-300 dark:border-slate-600 p-2 rounded-lg text-[14px] sm:text-[15px] font-bold outline-none bg-slate-50 dark:bg-slate-700/60 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky/Prominent Mobile Action Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={generatePDF}
                disabled={loading}
                className="
                  w-full
                  bg-[#15803d]
                  hover:bg-[#166534]
                  active:bg-[#14532d]
                  disabled:bg-gray-400
                  text-white
                  text-base sm:text-lg
                  font-bold
                  py-3.5 sm:py-4
                  px-4
                  rounded-xl
                  shadow-lg
                  transition-all
                  flex
                  items-center
                  justify-center
                  gap-3
                  cursor-pointer
                "
              >
                {loading && (
                  <div
                    className="
                      w-5
                      h-5
                      border-3
                      border-white
                      border-t-transparent
                      rounded-full
                      animate-spin
                    "
                  />
                )}
                <span>{loading ? "Generating PDF..." : "Generate PDF"}</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT BILL PREVIEW */}
        <div className="w-full xl:flex-1 overflow-x-auto pb-6">
          <div className="text-xs text-slate-600 font-medium mb-2 xl:hidden flex items-center gap-1.5 px-1">
            <span>⇄ Swipe horizontally to inspect bill preview</span>
          </div>

          <div
            ref={pdfRef}
            className="
              w-[794px]
              min-w-[794px]
              min-h-[1123px]
              bg-white
              border-[3px]
              border-black
              relative
              overflow-hidden
              mx-auto
              shrink-0
              p-7
              flex
              flex-col
              justify-between
            "
            style={{
              fontFamily: "Times New Roman, serif",
            }}
          >
            {/* TOP HEADER SECTION */}
            <div>
              {/* AK LOGO AND TOURS & TRAVELS SIDE BY SIDE */}
              <div className="flex items-center justify-center gap-5 pb-1">
                {/* AK LOGO NEXT TO TOURS & TRAVELS */}
                <img
                  src={logo}
                  alt="AK Tours & Travels"
                  className="w-[100px] h-[100px] object-contain shrink-0"
                />

                {/* COMPANY DETAILS */}
                <div className="text-center">
                  <h1 className="text-[34px] font-bold text-blue-900 leading-none tracking-wide">
                    TOURS &amp; TRAVELS
                  </h1>
                  <p className="text-[13px] mt-1.5 font-medium text-black">
                    #118, 28th Cross, LR Nagar, Vivek Nagar Post, Bangalore - 560047
                  </p>
                  <p className="text-[13px] font-medium text-black">
                    Mail: aktravelsbangalore@gmail.com
                  </p>
                  <p className="text-[13px] font-bold text-black mt-0.5">
                    Mob: 89700 94480, 97401 51921
                  </p>
                </div>
              </div>

              {/* TRIP SHEET NO ON LEFT & CASH BILL CENTERED */}
              <div className="relative my-2 flex items-center justify-center min-h-[32px]">
                <div className="absolute left-0 flex items-center gap-1.5 pl-0.5">
                  <span className="text-[15px] font-bold text-black whitespace-nowrap">
                    Trip Sheet No
                  </span>
                  <span className="text-red-600 font-bold text-[26px] leading-none ml-1">
                    {customerData.tripSheetNo}
                  </span>
                </div>

                {/* CASH BILL WITH CLEAN UNDERLINE */}
                <span className="text-[22px] font-bold border-b-2 border-black pb-1.5 px-4 inline-block tracking-wide text-black leading-normal">
                  Cash Bill
                </span>
              </div>

              {/* METADATA FIELDS (Exact structure, tags, and styling from InvoicePage.jsx) */}
              <div className="flex gap-10 mt-4 text-[14px]">
                {/* LEFT COLUMN */}
                <div className="w-1/2 space-y-3">
                  <div className="flex items-center">
                    <p className="w-32 font-semibold">Guest Name</p>
                    <p className="flex-1 border-b border-dotted border-black min-h-[24px] leading-[18px] pb-[2px] pl-2 flex items-start justify-center">
                      {customerData.guestName}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <p className="w-32 font-semibold">Company Name</p>
                    <p className="flex-1 border-b border-dotted border-black min-h-[24px] leading-[18px] pb-[2px] pl-2 flex items-start justify-center">
                      {customerData.companyName}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <p className="w-32 font-semibold">Reporting to</p>
                    <p className="flex-1 border-b border-dotted border-black min-h-[24px] leading-[18px] pb-[2px] pl-2 flex items-start justify-center">
                      {customerData.reportingTo}
                    </p>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="w-1/2 space-y-3">
                  <div className="flex items-center">
                    <p className="w-32 font-semibold">Driver Name</p>
                    <p className="flex-1 border-b border-dotted border-black min-h-[24px] leading-[18px] pb-[2px] pl-2 flex items-start justify-center">
                      {customerData.driverName}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <p className="w-32 font-semibold">Type of Vehicle</p>
                    <p className="flex-1 border-b border-dotted border-black min-h-[24px] leading-[18px] pb-[2px] pl-2 flex items-start justify-center">
                      {customerData.vehicleType}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <p className="w-32 font-semibold">Vehicle No.</p>
                    <p className="flex-1 border-b border-dotted border-black min-h-[24px] leading-[18px] pb-[2px] pl-2 flex items-start justify-center">
                      {customerData.vehicleNo}
                    </p>
                  </div>
                </div>
              </div>

              {/* MULTI-TRIP TABLE (Exact columns matching user sketch) */}
              <div className="mt-5 border-2 border-black">
                {/* Table Header */}
                <div className="grid grid-cols-[185px_85px_70px_70px_80px_70px_70px_1fr] border-b-2 border-black text-center font-bold text-[13px] bg-slate-50/70">
                  <div className="py-2 px-1 border-r border-black">Duty Type</div>
                  <div className="py-2 px-1 border-r border-black">Date</div>
                  <div className="py-2 px-1 border-r border-black">Total km</div>
                  <div className="py-2 px-1 border-r border-black">Total Time</div>
                  <div className="py-2 px-1 border-r border-black">Amount</div>
                  <div className="py-2 px-1 border-r border-black">Toll</div>
                  <div className="py-2 px-1 border-r border-black">Parking</div>
                  <div className="py-2 px-1">Total</div>
                </div>

                {/* Table Body Rows (Only entered trips, NO dummy empty rows) */}
                {trips.map((trip, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-[185px_85px_70px_70px_80px_70px_70px_1fr] text-center text-[13px] min-h-[46px] items-stretch ${
                      idx !== trips.length - 1 ? "border-b border-black" : ""
                    }`}
                  >
                    <div className="py-2 px-2 border-r border-black text-left font-medium whitespace-pre-line break-words flex items-center leading-snug">
                      {trip.dutyType}
                    </div>
                    <div className="py-2 px-1 border-r border-black flex items-center justify-center text-[12px]">
                      {formatIndianDate(trip.date)}
                    </div>
                    <div className="py-2 px-1 border-r border-black flex items-center justify-center">
                      {trip.totalKm}
                    </div>
                    <div className="py-2 px-1 border-r border-black flex items-center justify-center">
                      {trip.totalTime}
                    </div>
                    <div className="py-2 px-1 border-r border-black flex items-center justify-center">
                      {trip.amount}
                    </div>
                    <div className="py-2 px-1 border-r border-black flex items-center justify-center">
                      {trip.toll}
                    </div>
                    <div className="py-2 px-1 border-r border-black flex items-center justify-center">
                      {trip.parking}
                    </div>
                    <div className="py-2 px-1 flex items-center justify-center font-semibold">
                      {trip.total}
                    </div>
                  </div>
                ))}

                {/* Grand Total Row */}
                <div className="grid grid-cols-[185px_85px_70px_70px_80px_70px_70px_1fr] border-t-2 border-black text-center text-[14px] font-bold min-h-[42px] items-center bg-slate-50/40">
                  <div className="py-2 px-2 border-r border-black text-left">
                    Total
                  </div>
                  <div className="py-2 px-1 border-r border-black">-</div>
                  <div className="py-2 px-1 border-r border-black">-</div>
                  <div className="py-2 px-1 border-r border-black">-</div>
                  <div className="py-2 px-1 border-r border-black">-</div>
                  <div className="py-2 px-1 border-r border-black">-</div>
                  <div className="py-2 px-1 border-r border-black">-</div>
                  <div className="py-2 px-1 text-[16px] font-bold text-black flex items-center justify-center">
                    {grandTotal}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER SIGNATURE SECTION */}
            <div className="pt-8 pb-4 flex items-end justify-between text-[15px] font-semibold text-black">
              {/* Customer Signature on Left */}
              <div className="w-[320px]">
                <div className="flex items-end">
                  <span className="whitespace-nowrap mr-2">Customer Signature</span>
                  <div className="flex-1 border-b border-dotted border-black min-h-[22px]" />
                </div>
              </div>

              {/* Signature with Driver/Company Signature on Right */}
              <div className="w-[300px] flex flex-col items-end">
                <div className="w-full flex flex-col items-center">
                  <img
                    src={signature}
                    alt="Authorized Signature"
                    className="w-[100px] h-[45px] object-contain -mb-2"
                  />
                  <div className="w-full flex items-end">
                    <span className="whitespace-nowrap mr-2">Signature</span>
                    <div className="flex-1 border-b border-dotted border-black min-h-[22px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiTripPage;
