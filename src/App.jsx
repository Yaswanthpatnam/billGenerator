import { useState, useEffect } from "react";
import InvoicePage from "./components/InvoicePage";
import MultiTripPage from "./components/MultiTripPage";
import LandingPage from "./components/LandingPage";

export default function App() {
  const [page, setPage] = useState("home");

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

  return (
    <LandingPage
      onInvoice={() => setPage("invoice")}
      onMultiTrip={() => setPage("multi")}
    />
  );
}



