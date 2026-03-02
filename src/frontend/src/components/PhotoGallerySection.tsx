import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Images, X, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Photo } from "../backend.d";
import { useGetAllPhotos } from "../hooks/useQueries";

interface SamplePhoto {
  id: bigint;
  title: string;
  imageUrl: string;
}

const SAMPLE_PHOTOS: SamplePhoto[] = [
  {
    id: 1n,
    title: "Cell Observation Lab Session",
    imageUrl: "https://picsum.photos/seed/biology1/600/400",
  },
  {
    id: 2n,
    title: "Chemistry Experiment Day",
    imageUrl: "https://picsum.photos/seed/science2/600/400",
  },
  {
    id: 3n,
    title: "Annual Science Exhibition",
    imageUrl: "https://picsum.photos/seed/exhibition3/600/400",
  },
  {
    id: 4n,
    title: "Botanical Garden Field Trip",
    imageUrl: "https://picsum.photos/seed/garden4/600/400",
  },
  {
    id: 5n,
    title: "Physics Lab — Optics Experiments",
    imageUrl: "https://picsum.photos/seed/physics5/600/400",
  },
  {
    id: 6n,
    title: "Biology Olympiad Preparation",
    imageUrl: "https://picsum.photos/seed/olympiad6/600/400",
  },
];

type DisplayPhoto = SamplePhoto | (Photo & { imageUrl: string });

function PhotoCard({
  photo,
  index,
  featured,
  onClick,
}: {
  photo: DisplayPhoto;
  index: number;
  featured?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={`group cursor-pointer ${featured ? "md:col-span-2 md:row-span-2" : ""}`}
      onClick={onClick}
    >
      <div
        className={`relative overflow-hidden rounded-xl border border-border/40 shadow-xs bg-muted ${
          featured
            ? "aspect-[16/9] md:aspect-auto md:h-full min-h-48"
            : "aspect-[4/3]"
        }`}
      >
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Persistent bottom gradient + title — always visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        {/* Zoom icon — appears on hover */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-250 border border-white/20 translate-y-1 group-hover:translate-y-0">
          <ZoomIn className="w-4 h-4 text-white" />
        </div>

        {/* Title — always at bottom, no duplicate below card */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
          <p
            className={`text-white font-display font-semibold leading-snug drop-shadow-sm ${
              featured ? "text-base md:text-lg" : "text-xs md:text-sm"
            }`}
          >
            {photo.title}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function PhotoGallerySection() {
  const { data: photos, isLoading } = useGetAllPhotos();
  const [lightboxPhoto, setLightboxPhoto] = useState<DisplayPhoto | null>(null);

  const backendPhotos: DisplayPhoto[] = (photos ?? []).map((p) => ({
    ...p,
    imageUrl: p.image.getDirectURL(),
  }));

  const displayPhotos: DisplayPhoto[] =
    backendPhotos.length > 0 ? backendPhotos : SAMPLE_PHOTOS;

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
            {/* Left accent bar */}
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
          {!isLoading && (
            <Badge
              variant="secondary"
              className="self-start sm:self-auto text-sm px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 font-semibold flex-shrink-0"
            >
              {displayPhotos.length}{" "}
              {displayPhotos.length === 1 ? "photo" : "photos"}
            </Badge>
          )}
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Skeleton key={n} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        ) : displayPhotos.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No photos uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 md:auto-rows-[200px]">
            {displayPhotos.map((photo, i) => (
              <PhotoCard
                key={String(photo.id)}
                photo={photo}
                index={i}
                featured={i === 0}
                onClick={() => setLightboxPhoto(photo)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 p-4"
            onClick={() => setLightboxPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                className="absolute -top-11 right-0 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors border border-white/20"
                aria-label="Close lightbox"
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={lightboxPhoto.imageUrl}
                alt={lightboxPhoto.title}
                className="w-full rounded-xl shadow-2xl"
              />
              <p className="text-center text-white/75 mt-3 text-sm font-medium font-display">
                {lightboxPhoto.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
