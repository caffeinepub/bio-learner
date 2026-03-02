import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Notice } from "../backend.d";
import { useGetAllNotices } from "../hooks/useQueries";

const SAMPLE_NOTICES: Notice[] = [
  {
    id: 1n,
    title: "Mid-Term Exam Schedule Released",
    content:
      "Dear students, the mid-term examination schedule for Class 11 & 12 Biology has been released. The exams will commence from March 15th. The Biology paper will be held on March 18th (Friday) from 10:00 AM to 1:00 PM. Please ensure you carry your admit cards. Syllabus covers Chapters 1–8 as discussed in class.",
    date: BigInt(Date.now() * 1_000_000 - 2 * 86400 * 1_000_000_000),
  },
  {
    id: 2n,
    title: "Assignment Submission Deadline Extended",
    content:
      "The submission deadline for the Cell Biology Assignment (Unit 3) has been extended to March 10th, 2026. Students are required to submit both hand-written notes and the diagram sheet. Late submissions after the extended date will not be accepted. Contact me via the school portal if you have queries.",
    date: BigInt(Date.now() * 1_000_000 - 5 * 86400 * 1_000_000_000),
  },
  {
    id: 3n,
    title: "Special Lab Session — Microscopy & Cell Study",
    content:
      "We will be conducting a special lab session on microscopy and cell observation this Saturday, March 7th from 9:00 AM to 12:00 PM in Lab Room 201. Students are requested to bring their lab notebooks and aprons. We will be preparing temporary mounts of onion peel and Elodea leaves. Attendance is strongly recommended.",
    date: BigInt(Date.now() * 1_000_000 - 7 * 86400 * 1_000_000_000),
  },
];

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / 1_000_000n);
  if (ms <= 0) return "Recent";
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function NoticeCard({ notice, index }: { notice: Notice; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const preview =
    notice.content.slice(0, 140) + (notice.content.length > 140 ? "…" : "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="card-hover border-border/50 shadow-xs overflow-hidden group">
        {/* Left accent bar — replaces the top stripe */}
        <div className="flex">
          <div className="w-1 flex-shrink-0 bg-gradient-to-b from-amber-400 to-amber-500 rounded-l-lg" />
          <div className="flex-1 min-w-0">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-amber-100 transition-colors">
                  <Bell className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-display font-semibold text-foreground leading-snug">
                    {notice.title}
                  </CardTitle>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <CalendarDays className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(notice.date)}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <p className="text-sm text-foreground/75 leading-relaxed">
                {expanded ? notice.content : preview}
              </p>
              {notice.content.length > 140 && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/75 transition-colors"
                >
                  {expanded ? (
                    <>
                      Show less <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </CardContent>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function NoticesSection() {
  const { data: notices, isLoading } = useGetAllNotices();
  const displayNotices =
    notices && notices.length > 0 ? notices : SAMPLE_NOTICES;

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
            <div className="w-1 self-stretch rounded-full bg-amber-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1.5">
                Announcements
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Notices & Updates
              </h2>
              <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-lg">
                Stay informed with exam schedules, assignment deadlines, and
                important class updates.
              </p>
            </div>
          </div>
          {!isLoading && (
            <Badge
              variant="secondary"
              className="self-start sm:self-auto text-sm px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 font-semibold flex-shrink-0"
            >
              {displayNotices.length}{" "}
              {displayNotices.length === 1 ? "notice" : "notices"}
            </Badge>
          )}
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="overflow-hidden">
                <div className="flex">
                  <div className="w-1 bg-muted rounded-l-lg flex-shrink-0" />
                  <div className="flex-1 p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/3 mb-4" />
                    <Skeleton className="h-4 w-full mb-1.5" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : displayNotices.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No notices posted yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayNotices.map((notice, i) => (
              <NoticeCard key={String(notice.id)} notice={notice} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
