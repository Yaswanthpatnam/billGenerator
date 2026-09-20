import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef, useState, useEffect } from "react";
import logo from "../assets/logo.png";
import signature from "../assets/signature.png";
import { RotateCcw } from "lucide-react";

const STORAGE_KEY = "tripbill_single_v2";

const DEFAULT_FORM_DATA = {
  invoiceNo: "",
  customerName: "",
  reportingTo: "",
  openingKm: "",
  openingHrs: "",
  closingKm: "",
  closingHrs: "",
  extraKm: "",
  extraHrs: "",
  totalKm: "",
  totalHrs: "",
  routeList: "",
  driverName: "",
  vehicleType: "",
  vehicleNo: "",
  fourHours: "",
  eightHours: "",
  ratePerKm: "",
  ratePerHour: "",
  outStation: "",
  checkPost: "",
  tollCharges: "",
  parkingCharges: "",
  driverBata: "",
  totalAmount: "",
  mobileOne: "",
  mobileTwo: "",
  date: "",
};

const InvoicePage = ({ onBack }) => {
  const pdfRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_FORM_DATA;
    } catch {
      return DEFAULT_FORM_DATA;
    }
  });

  // Save changes to localStorage so refreshing never loses data
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }, [formData]);

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all entered data?")) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn(e);
      }
      setFormData(DEFAULT_FORM_DATA);
    }
  };

  const handleChange = (e) => {
    const val =
      e.target.name === "vehicleNo"
        ? e.target.value.toUpperCase()
        : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: val,
    });
  };

  const generatePDF = async () => {
    const hasData = Object.values(formData).some(
      (value) => value && value.trim() !== ""
    );

    if (!hasData) {
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

      pdf.save(`TripSheet-${formData.invoiceNo || Date.now()}.pdf`);

    } catch (error) {
      console.error(error);
      alert("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  const formatRouteLines = (text, maxChars = 75, minLines = 4) => {
    if (!text || !text.trim()) return Array(minLines).fill("");
    const rawParagraphs = text.split("\n");
    const lines = [];
    for (const para of rawParagraphs) {
      const trimmed = para.trim();
      if (!trimmed) {
        lines.push("");
        continue;
      }
      const words = trimmed.split(/\s+/);
      let currentLine = "";
      for (const word of words) {
        if (word.length > maxChars) {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = "";
          }
          let remaining = word;
          while (remaining.length > maxChars) {
            lines.push(remaining.slice(0, maxChars));
            remaining = remaining.slice(maxChars);
          }
          currentLine = remaining;
        } else if (!currentLine) {
          currentLine = word;
        } else if ((currentLine + " " + word).length <= maxChars) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
    }
    const count = Math.max(minLines, lines.length);
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(lines[i] || "");
    }
    return result;
  };

  const formatIndianDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  return (
    <div className="min-h-screen bg-[#bcc7ca] p-3 md:p-5">
      <div className="flex flex-col xl:flex-row gap-5 items-start">
        {/* FORM */}

        <div
          className="
            w-full
            xl:w-[28%]
            bg-white
            rounded-xl
            shadow-lg
            p-5
            xl:h-screen
            overflow-auto
            xl:sticky
            top-0
          "
        >
          {/* Top Actions: Back to Home & Clear Form */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                ← Back to Home
              </button>
            )}
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
              title="Reset all fields"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Form
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 dark:text-blue-400 mb-6">
            Trip Sheet Generator
          </h1>

          <div className="space-y-3">
            {[
              ["invoiceNo", "Invoice No"],
              ["customerName", "Customer Name"],
              ["reportingTo", "Reporting To"],
              ["mobileOne", "Mobile Number 1"],
              ["mobileTwo", "Mobile Number 2"],
              ["openingKm", "Opening Km"],
              ["openingHrs", "Opening Hrs"],
              ["closingKm", "Closing Km"],
              ["closingHrs", "Closing Hrs"],
              ["extraKm", "Extra Km"],
              ["extraHrs", "Extra Hrs"],
              ["totalKm", "Total Km"],
              ["totalHrs", "Total Hrs"],
              ["driverName", "Driver Name"],
              ["vehicleType", "Vehicle Type"],
              ["vehicleNo", "Vehicle Number"],
              ["fourHours", "4 Hours 40 Km"],
              ["eightHours", "8 Hours 80 Km"],
              ["ratePerKm", "Rate Per Km"],
              ["ratePerHour", "Rate Per Hour"],
              ["outStation", "Out Station"],
              ["checkPost", "Check Post Charges"],
              ["tollCharges", "Toll Charges"],
              ["parkingCharges", "Parking Charges"],
              ["driverBata", "Driver Bata"],
              ["totalAmount", "Total Amount"],
            ].map(([name, placeholder]) => (
              <input
                key={name}
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="
                  w-full
                  border
                  border-gray-400
                  dark:border-slate-600
                  p-3
                  rounded
                  text-[15px]
                  outline-none
                  bg-white
                  dark:bg-slate-800
                  text-slate-900
                  dark:text-white
                  dark:placeholder-slate-500
                  focus:border-blue-600
                "
              />
            ))}

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="
                w-full
                border
                border-gray-400
                dark:border-slate-600
                p-3
                rounded
                text-[15px]
                bg-white
                dark:bg-slate-800
                text-slate-900
                dark:text-white
                outline-none
                focus:border-blue-600
              "
            />

            <textarea
              rows="5"
              name="routeList"
              value={formData.routeList}
              onChange={handleChange}
              placeholder="Route List (Auto-wraps across lines in bill)"
              className="
                w-full
                border
                border-gray-400
                dark:border-slate-600
                p-3
                rounded
                text-[15px]
                bg-white
                dark:bg-slate-800
                text-slate-900
                dark:text-white
                dark:placeholder-slate-500
                outline-none
                focus:border-blue-600
              "
            />

            <button
              type="button"
              onClick={generatePDF}
              disabled={loading}
              className="
                w-full
                bg-[#15803d]
                hover:bg-[#166534]
                disabled:bg-gray-500
                text-white
                text-lg
                md:text-xl
                font-bold
                p-4
                rounded-lg
                transition-all
                flex
                items-center
                justify-center
                gap-3
              "
            >
              {loading && (
                <div
                  className="
                    w-6
                    h-6
                    border-4
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

        {/* BILL */}

        <div
          className="
            w-full
            xl:flex-1
            overflow-x-auto
            overflow-y-hidden
            pb-5
          "
        >
          <div
            ref={pdfRef}
            className="
              w-[1123px]
              min-w-[1123px]
              min-h-[794px]
              bg-white
              border-[3px]
              border-black
              relative
              overflow-hidden
              mx-auto
              shrink-0
              flex
              flex-col
              justify-between
            "
            style={{
              fontFamily: "Times New Roman",
            }}
          >
            {/* HEADER */}

            <div className="min-h-[155px] h-[155px] border-b-[2px] border-black relative shrink-0">
              <div className="absolute left-1/2 -translate-x-1/2 top-2 w-[720px]">
                <div className="flex items-center justify-center gap-5">
                  <img src={logo} alt="logo" className="w-[115px]" />

                  <div className="text-center">
                    <p className="text-[20px] font-bold">
                      Trip Sheet/Cash Bill
                    </p>

                    <h1 className="text-[34px] font-bold text-blue-900 leading-none tracking-wide">
                      TOURS & TRAVELS
                    </h1>

                    <p className="text-[14px] mt-2">
                      #118, 28th Cross, L.R Nagar, Vivek Nagar Post
                    </p>

                    <p className="text-[14px]">Bangalore - 560047</p>

                    <p className="text-[14px] mt-1">
                      Mail: aktravelsbangalore@gmail.com
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT */}

              <div className="absolute right-5 top-4 w-[240px]">
                {[
                  ["Mobile 1 :", formData.mobileOne],
                  ["Mobile 2 :", formData.mobileTwo],
                  ["Date :", formatIndianDate(formData.date)],
                  ,
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className={`flex items-center justify-end gap-2 ${
                      index !== 0 ? "mt-3" : ""
                    }`}
                  >
                    <p className="text-[14px] font-bold">{label}</p>

                    <div
                      className="
                        w-[120px]
                        border-b
                        border-dotted
                        border-black
                        min-h-[24px]
                        leading-[18px]
                        pb-[2px]
                        text-[13px]
                        flex
                        items-start
                      "
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BODY */}

            <div className="flex flex-1 min-h-[549px]">
              {/* LEFT */}

              <div className="w-[62%] p-4 flex flex-col justify-between border-r-[2px] border-black">
                <div>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex items-center">
                      <p className="w-32 font-semibold">No.</p>
                      <p className="text-red-700 text-[34px] font-bold leading-none ml-4">
                        {formData.invoiceNo}
                      </p>
                    </div>

                    <div className="flex items-center mt-3">
                      <p className="w-32 font-semibold">Name</p>
                      <p className="flex-1 border-b border-dotted border-black min-h-[24px] leading-[18px] pb-[2px] pl-2 flex items-start justify-center">
                        {formData.customerName}
                      </p>
                    </div>

                    <div className="flex items-center mt-3">
                      <p className="w-32  font-semibold">Reporting to</p>
                      <p className="flex-1 border-b border-dotted border-black min-h-[24px] leading-[18px] pb-[2px] pl-2 flex items-start justify-center">
                        {formData.reportingTo}
                      </p>
                    </div>

                    {[
                      ["Opening Km", formData.openingKm, formData.openingHrs],
                      ["Closing Km", formData.closingKm, formData.closingHrs],
                      ["Extra Km", formData.extraKm, formData.extraHrs],
                      ["Total Kms", formData.totalKm, formData.totalHrs],
                    ].map(([label, km, hrs]) => (
                      <div key={label} className="flex items-center">
                        <p className="w-32 font-semibold">{label}</p>
                        <p className="w-[140px] border-b border-dotted border-black min-h-[24px] leading-[18px] pb-[2px] text-center flex items-start justify-center">
                          {km}
                        </p>
                        <p className="w-[70px] text-center font-semibold">at</p>
                        <p className="w-[140px] border-b border-dotted border-black min-h-[24px] leading-[18px] pb-[2px] text-center flex items-start justify-center">
                          {hrs}
                        </p>
                        <p className="w-[70px] text-center font-semibold">Hrs</p>
                      </div>
                    ))}
                  </div>

                  {/* ROUTE LIST (Smart word-wrapped, unlimited dynamic lines, never truncates) */}
                  <div className="mt-2.5">
                    <p className="text-[15px] font-bold mb-1">Route List</p>
                    <div className="space-y-0.5">
                      {formatRouteLines(formData.routeList, 75, 4).map((line, idx) => (
                        <div
                          key={idx}
                          className="border-b border-dotted border-black min-h-[22px] text-[12px] leading-[20px] flex items-center justify-center text-center px-1"
                        >
                          {line || ""}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* DISCLAIMERS (Static at bottom of flex column, never overlaps) */}
                <div className="pt-2 text-[11px] leading-[17px] font-semibold border-t border-dotted border-black/40 text-black mt-3">
                  <p>1 The Meter Reading and Timing are Calculated from Office to Office.</p>
                  <p>2 For Outstation Trip Minimum 300 Kms is applicable.</p>
                  <p>3 Parking Charges before 6.00 am and after 9.00 pm Additional Bata will be Charged.</p>
                  <p>4 We will not be responsible for any loss of your items in the vehicle.</p>
                </div>
              </div>

              {/* RIGHT */}

              <div className="w-[38%] p-4">
                <div className="space-y-4 text-[14px]">
                  {[
                    ["Driver Name", formData.driverName],
                    ["Vehicle Type", formData.vehicleType],
                    ["Vehicle No", formData.vehicleNo],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center">
                      <p className="w-32 font-semibold">{label}</p>

                      <p
                        className="
                          flex-1
                          border-b
                          border-dotted
                          border-black
                          min-h-[24px]
                          leading-[18px]
                          pb-[2px]
                          flex
                          items-start
                          justify-center
                        "
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CHARGES & TOTAL IN ONE SEAMLESS LINKED CONTAINER */}
                <div className="border-[2px] border-black mt-5">
                  <div className="p-4 text-[13px] space-y-3">
                    {[
                      ["4 Hours 40 Km", formData.fourHours],
                      ["8 Hours 80 Km", formData.eightHours],
                      ["Rate per Km", formData.ratePerKm],
                      ["Rate per Hour", formData.ratePerHour],
                      ["Out Station", formData.outStation],
                      ["Check post permit Charges", formData.checkPost],
                      ["Toll Charges", formData.tollCharges],
                      ["Parking Charges", formData.parkingCharges],
                      ["Driver Bata per day", formData.driverBata],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center">
                        <p className="w-[180px] font-semibold">{label}</p>

                        <p
                          className="
                            flex-1
                            border-b
                            border-dotted
                            border-black
                            min-h-[24px]
                            leading-[18px]
                            pb-[2px]
                            text-center
                            flex
                            items-center
                            justify-center
                          "
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* TOTAL (Seamlessly linked at bottom of charges box) */}
                  <div
                    className="
                      border-t-[2px]
                      border-black
                      h-[68px]
                      flex
                      items-center
                      justify-between
                      px-8
                      bg-white
                    "
                  >
                    <p className="text-[20px] font-bold">Total Amount</p>

                    <p className="text-[25px] font-bold">
                      {formData.totalAmount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="h-[90px] border-t-[2px] border-black flex bg-white shrink-0">
              <div
  className="
    w-1/2
    border-r-[2px]
    border-black
    flex
    flex-col
    items-center
    justify-center
    
  "
>
  <img
  src={signature}
  alt="signature"
  className="
    w-[80px]
    object-contain
    mb-0
  "
/>

 <p
  className="
    text-[13px]
    font-semibold
    leading-tight
    mt-[2px]
  "
>
    Driver Signature
  </p>
</div>

              <div className="w-1/2 flex flex-col items-center justify-center">
                <p className="text-[15px] font-semibold mt-8">
                  Customer Signature
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
