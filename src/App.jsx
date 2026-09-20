import { useState, useEffect } from "react";
import InvoicePage from "./components/InvoicePage";
import MultiTripPage from "./components/MultiTripPage";
import MultiVehiclePage from "./components/MultiVehiclePage";
import LandingPage from "./components/LandingPage";

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const [page, setPage] = useState(urlParams.get("page") || "home");

  // Ensure default Light Mode across the document
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }, []);

  if (page === "invoice") {
    return <InvoicePage onBack={() => setPage("home")} />;
  }

  if (page === "multi") {
    return <MultiTripPage onBack={() => setPage("home")} />;
  }

  if (page === "multi-vehicle") {
    return <MultiVehiclePage onBack={() => setPage("home")} />;
  }

  return (
    <LandingPage
      onInvoice={() => setPage("invoice")}
      onMultiTrip={() => setPage("multi")}
      onMultiVehicle={() => setPage("multi-vehicle")}
    />
  );
}



