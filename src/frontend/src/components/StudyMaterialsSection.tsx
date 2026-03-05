import { motion } from "motion/react";

export default function StudyMaterialsSection() {
  return (
    <section className="py-16 md:py-20 bg-secondary/25">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            {/* Left accent bar */}
            <div className="w-1 self-stretch rounded-full bg-primary flex-shrink-0 mt-1" />
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1.5">
                Learning Resources
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Study Materials
              </h2>
              <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-lg">
                Download notes, PDFs, and learning resources across Biology,
                Chemistry, and Physics.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-xl font-semibold text-foreground/60">
            Updated Soon ...
          </p>
        </div>
      </div>
    </section>
  );
}
