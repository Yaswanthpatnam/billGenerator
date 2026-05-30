import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import logo from "../assets/logo.png";
import signature from "../assets/signature.png";

const InvoicePage = () => {
  const pdfRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
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

    mobileOne: "",
    mobileTwo: "",

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
    date: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generatePDF = async () => {
    if (loading) return;

    const allFields = Object.values(formData);

    const hasAtLeastOneValue = allFields.some(
      (field) => field && field.toString().trim() !== "",
    );

    if (!hasAtLeastOneValue) {
      alert("Please enter at least one field before generating PDF");
      return;
    }

    try {
      setLoading(true);

      const input = pdfRef.current;

      if (!input) {
        alert("Invoice not found");
        return;
      }

      await document.fonts.ready;

      const canvas = await html2canvas(input, {
        scale: 5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        letterRendering: true,
        imageTimeout: 0,
        removeContainer: true,
        foreignObjectRendering: false,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1123, 794],
        compress: false,
      });

      pdf.addImage(
  imgData,
  "PNG",
  0,
  0,
  1123,
  794,
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
            rounded-lg
            shadow-lg
            p-5
            xl:h-screen
            overflow-auto
            xl:sticky
            top-0
          "
        >
          <h1 className="text-4xl font-bold text-blue-800 mb-6">
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
                  p-3
                  rounded
                  text-[15px]
                  outline-none
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
                p-3
                rounded
                text-[15px]
              "
            />

            <textarea
              rows="5"
              name="routeList"
              value={formData.routeList}
              onChange={handleChange}
              placeholder="Route List"
              className="
                w-full
                border
                border-gray-400
                p-3
                rounded
                text-[15px]
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
              h-[794px]
              bg-white
              border-[3px]
              border-black
              relative
              overflow-hidden
              mx-auto
              shrink-0
            "
            style={{
              fontFamily: "Times New Roman",
            }}
          >
            {/* HEADER */}

            <div className="h-[155px] border-b-[2px] border-black relative">
              <div className="absolute left-1/2 -translate-x-1/2 top-2 w-[720px]">
                <div className="flex items-center justify-center gap-5">
                  <img src={logo} alt="logo" className="w-[115px]" />

                  <div className="text-center">
                    <p className="text-[21px] font-bold">
                      Trip Sheet/Cash Bill
                    </p>

                    <h1 className="text-[36px] font-bold text-blue-900 leading-none tracking-wide">
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

            <div className="flex h-[500px]">
              {/* LEFT */}

              <div className="w-[62%] p-4 relative">
                <div className="space-y-3 text-[14px]">
                  <div className="flex items-center">
  <p className="w-32 font-semibold">No.</p>

  <p
    className="
      text-red-700
      text-[34px]
      font-bold
      leading-none
      ml-4
    "
  >
    {formData.invoiceNo}
  </p>
</div>

<div className="flex items-center mt-3">
  <p className="w-32 font-semibold">Name</p>

  <p
    className="
      flex-1
      border-b
      border-dotted
      border-black
      min-h-[24px]
      leading-[18px]
      pb-[2px]
      pl-2
      flex
      items-start
      justify-center
    "
  >
    {formData.customerName}
  </p>
</div>

<div className="flex items-center mt-3">
  <p className="w-32  font-semibold">Reporting to</p>

  <p
    className="
      flex-1
      border-b
      border-dotted
      border-black
      min-h-[24px]
      leading-[18px]
      pb-[2px]
      pl-2
      flex
      items-start
      justify-center
    "
  >
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

                      <p
                        className="
                          w-[140px]
                          border-b
                          border-dotted
                          border-black
                          min-h-[24px]
                          leading-[18px]
                          pb-[2px]
                          text-center
                          flex
                          items-start
                          justify-center
                        "
                      >
                        {km}
                      </p>

                      <p className="w-[70px] text-center font-semibold">at</p>

                      <p
                        className="
                          w-[140px]
                          border-b
                          border-dotted
                          border-black
                          min-h-[24px]
                          leading-[18px]
                          pb-[2px]
                          text-center
                          flex
                          items-start
                          justify-center
                        "
                      >
                        {hrs}
                      </p>

                      <p className="w-[70px] text-center font-semibold">Hrs</p>
                    </div>
                  ))}
                </div>

                {/* ROUTE */}

                <div className="mt-5 h-[145px] ">
                  <p className="text-[18px] font-bold  mb-2">Route List</p>

                  {[1, 2, 3].map((line) => (
                    <div
                      key={line}
                      className="
                        border-b
                        border-dotted
                        border-black
                        min-h-[28px]
                        leading-[20px]
                        pt-[2px]
                        text-[14px]
                       
                      "
                    >
                      {formData.routeList.split("\n")[line - 1]}
                    </div>
                  ))}
                </div>

                {/* DISCLAIMERS */}

                <div className="absolute mt-2 bottom-2  left-4 w-[95%] text-[12px] leading-6 font-semibold">
                  <p>
                    1 The Meter Reading and Timing are Calculated from Office to
                    Office.
                  </p>

                  <p>2 For Outstation Trip Minimum 300 Kms is applicable.</p>

                  <p>
                    3 Parking Charges before 6.00 am and after 9.00 pm
                    Additional Bata will be Charged.
                  </p>

                  <p>
                    4 We will not be responsible for any loss of your items in
                    the vehicle.
                  </p>
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

                {/* CHARGES */}

                <div className="border-[2px] border-black mt-5 p-4 text-[13px]">
                  <div className="space-y-3">
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
                </div>

                {/* TOTAL */}

                <div
                  className="
    border-[2px]
    border-black
    border-t-0
    h-[70px]
    flex
    items-center
    justify-between
    px-8
    mt-0
    bg-white
  "
                >
                  <p className="text-[22px] font-bold">Total Amount</p>

                  <p className="text-[30px] font-bold">
                    {formData.totalAmount}
                  </p>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="absolute bottom-0 left-0 right-0 h-[90px] border-t-[2px] border-black flex bg-white">
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
