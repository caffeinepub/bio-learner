import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import NoticesSection from "./components/NoticesSection";
import PhotoGallerySection from "./components/PhotoGallerySection";
import StudyMaterialsSection from "./components/StudyMaterialsSection";

export type ActiveSection =
  | "home"
  | "notices"
  | "materials"
  | "gallery"
  | "admin";

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");

  const navigate = (section: ActiveSection) => {
    setActiveSection(section);
    if (section !== "admin") {
      setTimeout(() => {
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header activeSection={activeSection} onNavigate={navigate} />
      <main className="flex-1">
        {activeSection === "admin" ? (
          <AdminPanel onBack={() => setActiveSection("home")} />
        ) : (
          <>
            <div id="home">
              <HeroSection onNavigate={navigate} />
            </div>
            <div id="notices">
              <NoticesSection />
            </div>
            <div id="materials">
              <StudyMaterialsSection />
            </div>
            <div id="gallery">
              <PhotoGallerySection />
            </div>
          </>
        )}
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}
