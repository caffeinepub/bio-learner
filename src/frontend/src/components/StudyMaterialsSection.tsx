import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Atom,
  BookOpen,
  Download,
  FileText,
  FlaskConical,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { StudyMaterial } from "../backend.d";
import { useGetAllStudyMaterials } from "../hooks/useQueries";

// Sample data for first-load experience
const SAMPLE_MATERIALS: (Omit<StudyMaterial, "file"> & {
  fileUrl?: string;
})[] = [
  {
    id: 1n,
    title: "Cell Structure & Cell Division — Complete Notes",
    subject: "Biology",
    description:
      "Comprehensive study notes covering prokaryotic vs eukaryotic cells, organelle functions, mitosis & meiosis with labeled diagrams. Ideal for Class 11 NCERT syllabus.",
    fileUrl: undefined,
  },
  {
    id: 2n,
    title: "Periodic Table & Chemical Bonding",
    subject: "Chemistry",
    description:
      "Detailed notes on periodic properties, ionic/covalent bonding, VSEPR theory, hybridization, and molecular geometry. Includes solved numerical examples.",
    fileUrl: undefined,
  },
  {
    id: 3n,
    title: "Laws of Motion & Work-Energy Theorem",
    subject: "Physics",
    description:
      "Covers Newton's three laws, friction, circular motion, work-energy theorem, and conservation of momentum. Includes important formulas and MCQ practice set.",
    fileUrl: undefined,
  },
  {
    id: 4n,
    title: "Photosynthesis & Respiration in Plants",
    subject: "Biology",
    description:
      "In-depth explanation of light & dark reactions, Calvin cycle, C3 and C4 plants, photorespiration, and aerobic/anaerobic respiration with flow diagrams.",
    fileUrl: undefined,
  },
];

const subjectConfig: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    badge: string;
  }
> = {
  Biology: {
    icon: Zap,
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
  Chemistry: {
    icon: FlaskConical,
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
  },
  Physics: {
    icon: Atom,
    color: "bg-sky-50 border-sky-200",
    badge: "bg-sky-100 text-sky-700",
  },
};

function getSubjectConfig(subject: string) {
  return (
    subjectConfig[subject] || {
      icon: FileText,
      color: "bg-muted border-border",
      badge: "bg-muted text-muted-foreground",
    }
  );
}

interface MaterialCardProps {
  material: (typeof SAMPLE_MATERIALS)[0] | StudyMaterial;
  index: number;
}

function MaterialCard({ material, index }: MaterialCardProps) {
  const config = getSubjectConfig(material.subject);
  const IconComp = config.icon;

  const fileUrl =
    "fileUrl" in material
      ? material.fileUrl
      : (material as StudyMaterial).file?.getDirectURL();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="card-hover border-border/60 shadow-xs h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${config.color}`}
            >
              <IconComp className="w-5 h-5 text-foreground/70" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-display font-semibold text-foreground leading-snug line-clamp-2">
                {material.title}
              </CardTitle>
              <span
                className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1.5 ${config.badge}`}
              >
                {material.subject}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between pt-0">
          <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {material.description}
          </p>
          {fileUrl ? (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 text-primary border-primary/30 hover:bg-primary/5"
              >
                <Download className="w-3.5 h-3.5" />
                Download / View
              </Button>
            </a>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5 text-muted-foreground cursor-not-allowed"
              disabled
            >
              <Download className="w-3.5 h-3.5" />
              Coming Soon
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function StudyMaterialsSection() {
  const { data: materials, isLoading } = useGetAllStudyMaterials();
  const displayMaterials =
    materials && materials.length > 0 ? materials : SAMPLE_MATERIALS;

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
              <div className="flex flex-wrap gap-2 mt-3">
                {Object.entries(subjectConfig).map(([subject, cfg]) => (
                  <Badge
                    key={subject}
                    className={`text-xs ${cfg.badge} border-0`}
                    variant="secondary"
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          {!isLoading && (
            <Badge
              variant="secondary"
              className="self-start sm:self-auto text-sm px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex-shrink-0"
            >
              {displayMaterials.length}{" "}
              {displayMaterials.length === 1 ? "resource" : "resources"}
            </Badge>
          )}
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <Card key={n}>
                <CardHeader>
                  <div className="flex gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-5/6 mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : displayMaterials.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No study materials uploaded yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {displayMaterials.map((material, i) => (
              <MaterialCard
                key={String(material.id)}
                material={material}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
