import { Button } from "@/components/ui/button";
import { Menu, ShieldCheck, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { ActiveSection } from "../App";

interface HeaderProps {
  activeSection: ActiveSection;
  onNavigate: (section: ActiveSection) => void;
  visitorCount?: bigint | null;
}

const navLinks: { label: string; section: Exclude<ActiveSection, "admin"> }[] =
  [
    { label: "Home", section: "home" },
    { label: "Notices", section: "notices" },
    { label: "Study Materials", section: "materials" },
    { label: "Gallery", section: "gallery" },
  ];

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function Header({
  activeSection,
  onNavigate,
  visitorCount,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const now = useLiveClock();

  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handleNav = (section: ActiveSection) => {
    onNavigate(section);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 nav-glass border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNav("home")}
          className="flex items-center gap-2.5 group"
          aria-label="Bio-Learner Home"
        >
          <img
            src="/assets/uploads/IMG_20260305_062630-2.png"
            alt="Bio-Learner"
            className="h-10 w-10 rounded-full object-contain group-hover:scale-105 transition-transform shadow-green"
          />
          <span className="font-display text-xl font-bold text-white tracking-tight">
            Bio-Learner
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.section}
              onClick={() => handleNav(link.section)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSection === link.section
                  ? "bg-white/20 text-white"
                  : "text-white/75 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Live Date & Time + Visitor Count */}
        <div className="hidden md:flex items-center gap-4">
          {visitorCount != null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-1.5 text-white/80 text-xs font-mono select-none bg-white/10 border border-white/15 rounded-full px-3 py-1"
            >
              <Users className="w-3 h-3 text-emerald-300" />
              <span className="text-white/95 font-semibold">
                {Number(visitorCount).toLocaleString()}
              </span>
              <span className="text-white/55 hidden lg:inline">visitors</span>
            </motion.div>
          )}
          <div className="hidden lg:flex flex-col items-end leading-tight text-white/80 text-xs font-mono select-none">
            <span className="font-semibold text-white/95">{timeStr}</span>
            <span>{dateStr}</span>
          </div>
        </div>

        {/* Admin + Mobile Menu */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNav("admin")}
            className={`border-white/30 text-white hover:bg-white/15 hover:text-white bg-transparent text-xs gap-1.5 ${
              activeSection === "admin" ? "bg-white/20" : ""
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </Button>

          <button
            type="button"
            className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-leaf-dark/95 border-t border-white/10"
          >
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.section}
                  onClick={() => handleNav(link.section)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
                    activeSection === link.section
                      ? "bg-white/20 text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
