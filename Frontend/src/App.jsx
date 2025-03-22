import './App.css'
import Header from "./components/header";
import Hero from "./components/hero";
import SymptomChecker from "./components/symptom-checker";
import PrescriptionManager from "./components/prescription-manager";
import MedicineSearch from "./components/medicine-search";
import Footer from "./components/footer";

function App() {

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Hero />
          <SymptomChecker />
          <PrescriptionManager />
          <MedicineSearch />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App
