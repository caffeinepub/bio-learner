import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const notices = [
  {
    id: 1,
    title: "Biology Practical Examination Result & Rank List Published",
    date: "27 Feb 2026",
    badge: "Result Published",
    badgeColor: "bg-green-100 text-green-700 border-green-300",
    content:
      "The results and rank list for the Class XI Biology Practical Examination have been officially published. Students can view their rank, roll number, marks in practical (MS), viva-voce marks, and final marks (FM) below.",
    image: "/assets/uploads/biology_rank_list_with_column_lines-1-1.png",
  },
];

export default function NoticesSection() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-1 self-stretch rounded-full bg-amber-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1.5">
                Announcements
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Notices & Updates
              </h2>
              <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-lg">
                Stay informed with exam results, schedules, assignment
                deadlines, and important class updates.
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="self-start sm:self-auto text-sm px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 font-semibold flex-shrink-0"
          >
            {notices.length} notice{notices.length !== 1 ? "s" : ""}
          </Badge>
        </motion.div>

        {/* Notices List */}
        <div className="space-y-6">
          {notices.map((notice, i) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
            >
              <div className="p-5 md:p-7">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${notice.badgeColor}`}
                  >
                    {notice.badge}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {notice.date}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                  {notice.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {notice.content}
                </p>
                {notice.image && (
                  <button
                    type="button"
                    className="mt-4 cursor-zoom-in rounded-xl overflow-hidden border border-border max-w-2xl w-full text-left p-0 block"
                    onClick={() => setLightbox(notice.image!)}
                    title="Click to enlarge"
                  >
                    <img
                      src={notice.image}
                      alt="Rank List - Class XI Biology Practical"
                      className="w-full object-contain hover:scale-[1.02] transition-transform duration-200"
                    />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              onClick={() => setLightbox(null)}
            >
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={lightbox}
                alt="Enlarged rank list"
                className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                type="button"
                className="absolute top-4 right-4 text-white text-3xl font-bold bg-black/40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition"
                onClick={() => setLightbox(null)}
              >
                &times;
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
