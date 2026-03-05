import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  Clock,
  Images,
  Leaf,
  Microscope,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { ActiveSection } from "../App";
import { useActor } from "../hooks/useActor";

interface HeroSectionProps {
  onNavigate: (section: ActiveSection) => void;
  onVisitorCount?: (count: bigint) => void;
}

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const quickLinks = [
  {
    icon: Bell,
    label: "Notices",
    desc: "Stay updated with class announcements",
    section: "notices" as ActiveSection,
    accentClass: "from-amber-400/30 to-amber-300/10",
    iconBg: "bg-amber-400/20 border-amber-300/30",
    iconClass: "text-amber-200",
  },
  {
    icon: BookOpen,
    label: "Study Materials",
    desc: "Notes, PDFs & learning resources",
    section: "materials" as ActiveSection,
    accentClass: "from-emerald-400/30 to-emerald-300/10",
    iconBg: "bg-emerald-400/20 border-emerald-300/30",
    iconClass: "text-emerald-200",
  },
  {
    icon: Images,
    label: "Photo Gallery",
    desc: "Classroom moments & events",
    section: "gallery" as ActiveSection,
    accentClass: "from-sky-400/30 to-sky-300/10",
    iconBg: "bg-sky-400/20 border-sky-300/30",
    iconClass: "text-sky-200",
  },
];

export default function HeroSection({
  onNavigate,
  onVisitorCount,
}: HeroSectionProps) {
  const [visitorCount, setVisitorCount] = useState<bigint | null>(null);
  const now = useLiveClock();
  const { actor, isFetching } = useActor();

  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .recordVisit()
      .then((count) => {
        setVisitorCount(count);
        onVisitorCount?.(count);
      })
      .catch(() => {
        // silently fail — visitor count is non-critical
      });
  }, [actor, isFetching, onVisitorCount]);

  return (
    <section className="relative overflow-hidden hero-bg">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-bio-learner.dim_1200x500.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative organic shapes */}
      <div className="absolute top-8 right-20 opacity-15 pointer-events-none">
        <Leaf className="w-28 h-28 text-white rotate-12" />
      </div>
      <div className="absolute bottom-32 left-8 opacity-8 pointer-events-none">
        <Microscope className="w-36 h-36 text-white -rotate-12" />
      </div>
      {/* Glowing orb accents */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-leaf/10 blur-3xl pointer-events-none" />

      {/* Hero content */}
      <div className="relative container mx-auto px-4 pt-20 pb-12 md:pt-28 md:pb-16">
        {/* Teacher photo — right side, visible to students */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute right-4 top-8 md:right-10 md:top-6 flex flex-col items-center gap-2 pointer-events-none select-none"
        >
          <div className="relative">
            <div className="w-36 h-36 md:w-52 md:h-52 overflow-hidden drop-shadow-2xl">
              <img
                src="/assets/uploads/IMG_20260305_074647-1.png"
                alt="Pratyush Sir - Biology Teacher"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-emerald-500 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow">
              Pratyush Sir
            </span>
          </div>
          <span className="mt-3 text-white/60 text-[10px] md:text-xs font-medium tracking-wide uppercase">
            Your Biology Teacher
          </span>
        </motion.div>

        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/12 text-white/90 text-xs font-medium mb-6 border border-white/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Your Biology Learning Hub
            </span>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-2">
              Bio-Learner
            </h1>
            <p className="text-emerald-300 text-base md:text-lg font-medium mb-3 tracking-wide">
              A Platform for Biology Students by Pratyush Sir
            </p>
            <p className="text-white/60 text-lg md:text-xl font-light mb-3 tracking-wide">
              Science Education, Simplified.
            </p>

            <p className="text-white/70 text-sm md:text-base max-w-lg mb-6 leading-relaxed">
              Your go-to platform for biology study notes, learning materials,
              class notices, and more — designed to make science engaging.
            </p>

            {/* Stats bar: visitors + live date/time */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              {/* Visitor count pill */}
              <motion.div
                key={visitorCount?.toString()}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{
                  opacity: visitorCount != null ? 1 : 0,
                  scale: visitorCount != null ? 1 : 0.85,
                }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/12 border border-white/20 backdrop-blur-sm"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-400/25 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-emerald-300" />
                </div>
                <span className="text-white font-semibold text-sm font-mono">
                  {visitorCount != null
                    ? Number(visitorCount).toLocaleString()
                    : "—"}
                </span>
                <span className="text-white/60 text-xs">Visitors</span>
              </motion.div>

              {/* Divider */}
              <div className="w-px h-6 bg-white/20 hidden sm:block" />

              {/* Date pill */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
                <Calendar className="w-3.5 h-3.5 text-sky-300" />
                <span className="text-white/85 text-xs font-medium">
                  {dateStr}
                </span>
              </div>

              {/* Time pill */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-white/95 text-xs font-mono font-semibold tabular-nums">
                  {timeStr}
                </span>
              </div>
            </motion.div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => onNavigate("materials")}
                className="bg-white text-leaf-dark hover:bg-white/90 font-semibold gap-2 shadow-green-lg h-10 px-5"
              >
                <BookOpen className="w-4 h-4" />
                Browse Materials
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate("notices")}
                className="border-white/35 text-white hover:bg-white/12 hover:text-white bg-transparent gap-2 h-10 px-5"
              >
                <Bell className="w-4 h-4" />
                View Notices
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick-link cards — frosted glass, part of the hero */}
      <div className="relative container mx-auto px-4 pb-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {quickLinks.map((link, i) => (
            <motion.button
              key={link.section}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
              onClick={() => onNavigate(link.section)}
              className={`text-left p-4 rounded-t-xl bg-gradient-to-br ${link.accentClass} backdrop-blur-md border border-white/15 hover:bg-white/15 hover:border-white/25 transition-all duration-200 group`}
            >
              <div
                className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${link.iconBg}`}
              >
                <link.icon className={`w-4.5 h-4.5 ${link.iconClass}`} />
              </div>
              <div className="font-display font-semibold text-white text-sm mb-0.5 group-hover:text-white transition-colors">
                {link.label}
              </div>
              <div className="text-white/55 text-xs">{link.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Wave divider — seamless transition to white content below */}
      <div className="relative h-10 overflow-hidden">
        <svg
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full"
          aria-hidden="true"
        >
          <path
            d="M0,40 L0,20 Q360,0 720,20 Q1080,40 1440,20 L1440,40 Z"
            fill="oklch(0.98 0.004 140)"
          />
        </svg>
      </div>
    </section>
  );
}
