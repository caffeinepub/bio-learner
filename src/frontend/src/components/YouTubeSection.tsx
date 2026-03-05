import { ExternalLink, Play, Youtube } from "lucide-react";
import { motion } from "motion/react";

const CHANNEL_URL = "https://www.youtube.com/@Lets_Explore_with_Pratyush";

export default function YouTubeSection() {
  return (
    <section
      data-ocid="youtube.section"
      className="relative overflow-hidden py-16 md:py-20"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.22 0.10 155) 0%, oklch(0.28 0.13 148) 45%, oklch(0.24 0.11 158) 100%)",
      }}
    >
      {/* Subtle glow orbs */}
      <div
        className="absolute top-0 left-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.60 0.22 148 / 0.28) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.20 152 / 0.22) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center text-center gap-6"
        >
          {/* Label pill */}
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "oklch(0.55 0.18 150 / 0.20)",
              border: "1px solid oklch(0.55 0.18 150 / 0.40)",
              color: "oklch(0.85 0.12 150)",
            }}
          >
            <Play className="w-3 h-3 fill-current" />
            Watch &amp; Learn
          </span>

          {/* Main content row */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Channel avatar — clickable */}
            <motion.a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="youtube.link"
              whileHover={{ scale: 1.06, rotate: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="relative flex-shrink-0 block focus:outline-none focus-visible:ring-4 rounded-full"
              style={
                {
                  "--tw-ring-color": "oklch(0.55 0.22 25 / 0.55)",
                } as React.CSSProperties
              }
              aria-label="Visit YouTube Channel: Lets Explore with Pratyush"
            >
              {/* Glowing red ring */}
              <div
                className="absolute -inset-2 rounded-full animate-pulse"
                style={{
                  background:
                    "conic-gradient(from 0deg, oklch(0.58 0.28 25), oklch(0.42 0.24 18), oklch(0.58 0.28 25))",
                  opacity: 1,
                  boxShadow: "0 0 28px 6px oklch(0.55 0.28 25 / 0.70)",
                }}
              />
              <div
                className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-red-600/80 shadow-2xl"
                style={{ boxShadow: "0 0 20px oklch(0.55 0.28 25 / 0.60)" }}
              >
                <img
                  src="/assets/uploads/Screenshot_2023-11-25-16-54-25-694_cn.wps.moffice_eng-1.png"
                  alt="Lets Explore with Pratyush - YouTube Channel"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* YouTube badge */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full shadow-lg"
                style={{
                  background: "oklch(0.48 0.28 25)",
                  boxShadow: "0 2px 12px oklch(0.50 0.28 25 / 0.70)",
                }}
              >
                <Youtube className="w-3 h-3 text-white fill-white" />
                <span className="text-white text-[10px] font-bold whitespace-nowrap">
                  YouTube
                </span>
              </div>
            </motion.a>

            {/* Text + CTA */}
            <div className="flex flex-col items-center md:items-start gap-4 max-w-md">
              <h2
                className="font-display text-2xl md:text-3xl font-bold leading-tight"
                style={{ color: "oklch(0.95 0.015 90)" }}
              >
                More Science Fun{" "}
                <span style={{ color: "oklch(0.72 0.18 28)" }}>
                  School Activities
                </span>
              </h2>

              <p
                className="text-sm md:text-base leading-relaxed"
                style={{ color: "oklch(0.80 0.02 80)" }}
              >
                For more Science Fun School Activities, visit the YouTube
                channel and explore exciting experiments, biology lessons, and
                classroom adventures.
              </p>

              <p
                className="font-mono text-sm font-semibold"
                style={{ color: "oklch(0.72 0.18 28)" }}
              >
                @Lets_Explore_with_Pratyush
              </p>

              {/* CTA button */}
              <motion.a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="youtube.link"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-sm shadow-lg focus:outline-none focus-visible:ring-4"
                style={
                  {
                    background: "oklch(0.48 0.28 25)",
                    color: "#fff",
                    boxShadow:
                      "0 4px 28px oklch(0.50 0.28 25 / 0.75), 0 0 0 2px oklch(0.60 0.26 25 / 0.40)",
                    "--tw-ring-color": "oklch(0.55 0.26 25 / 0.55)",
                  } as React.CSSProperties
                }
              >
                <Youtube className="w-4 h-4 fill-white" />
                Visit Channel
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </motion.a>
            </div>
          </div>

          {/* Decorative row of YouTube-style stat pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {[
              { label: "Biology Experiments", emoji: "🧬" },
              { label: "Field Trips", emoji: "🌿" },
              { label: "Lab Practicals", emoji: "🔬" },
              { label: "Fun Activities", emoji: "🎉" },
            ].map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "oklch(1 0 0 / 0.06)",
                  border: "1px solid oklch(1 0 0 / 0.12)",
                  color: "oklch(0.80 0.02 80)",
                }}
              >
                <span>{item.emoji}</span>
                {item.label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
