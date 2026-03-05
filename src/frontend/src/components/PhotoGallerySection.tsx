import { X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const photos = [
  {
    src: "/assets/uploads/IMG_20240730_145109-1.jpg",
    caption: "Biology Lab Practical",
  },
  {
    src: "/assets/uploads/IMG_20240802_132824-2.jpg",
    caption: "Smart Class Teaching",
  },
  {
    src: "/assets/uploads/IMG_20240731_124700-3.jpg",
    caption: "Outdoor Field Study",
  },
  {
    src: "/assets/uploads/IMG_20241015_130322-4.jpg",
    caption: "Field Trip - Rice Crop Study",
  },
  {
    src: "/assets/uploads/Screenshot_2024-08-03-20-02-01-882_com.miui.gallery-1.png",
    caption: "Microscope Demonstration Outdoors",
  },
  {
    src: "/assets/uploads/IMG_20240801_131120-2.jpg",
    caption: "Lab Session - Microscope Class",
  },
  {
    src: "/assets/uploads/IMG_20241113_222955-3.jpg",
    caption: "Interactive Circle Teaching",
  },
  {
    src: "/assets/uploads/IMG_20240824_131858-4.jpg",
    caption: "Classroom Activity Session",
  },
  {
    src: "/assets/uploads/IMG_20240828_145548-5.jpg",
    caption: "Candle Flame Experiment",
  },
  {
    src: "/assets/uploads/IMG_20240731_132645-6.jpg",
    caption: "Science Lab Equipment Display",
  },
  {
    src: "/assets/uploads/Screenshot_2024-08-03-18-10-59-294_com.miui.gallery-7.png",
    caption: "Chemistry Lab Demonstration",
  },
  {
    src: "/assets/uploads/IMG_20240730_120926-8.jpg",
    caption: "Smart Class - Digital Teaching",
  },
  {
    src: "/assets/uploads/IMG_20241015_125352-9.jpg",
    caption: "Plant Study - Outdoor Learning",
  },
  {
    src: "/assets/uploads/IMG_20240810_121246-10.jpg",
    caption: "Nitrogen Cycle - Blackboard Teaching",
  },
];

export default function PhotoGallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section
      className="py-16 md:py-20 bg-background"
      data-ocid="gallery.section"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-1 self-stretch rounded-full bg-sky-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-xs font-semibold text-sky-600 uppercase tracking-widest mb-1.5">
                Memories
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Photo Gallery
              </h2>
              <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-lg">
                Glimpses from our classroom experiments, field trips, science
                fairs, and learning activities.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Photo Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          data-ocid="gallery.list"
        >
          {photos.map((photo, i) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="group relative overflow-hidden rounded-xl cursor-pointer aspect-[4/3] bg-muted shadow-sm hover:shadow-md transition-shadow"
              data-ocid={`gallery.item.${i + 1}`}
              onClick={() => setLightbox(i)}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent flex items-end p-3">
                <p className="text-white text-xs font-semibold leading-snug drop-shadow-md w-full">
                  {photo.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <dialog
          open
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 w-full h-full max-w-none max-h-none m-0 border-none"
          data-ocid="gallery.modal"
          onClick={() => setLightbox(null)}
          onKeyDown={(e) => e.key === "Escape" && setLightbox(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            data-ocid="gallery.close_button"
            onClick={() => setLightbox(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <motion.img
            key={lightbox}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            src={photos[lightbox].src}
            alt={photos[lightbox].caption}
            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
            {photos[lightbox].caption}
          </p>
        </dialog>
      )}
    </section>
  );
}
