import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Building2,
  Clock,
  Loader2,
  UserCheck,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { VisitorEntry } from "../backend.d";
import { useGetAllVisitors, useSignInVisitor } from "../hooks/useQueries";

function bigintToDate(ns: bigint): Date {
  return new Date(Number(ns / 1_000_000n));
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

function avatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

// Sort visitors by visitedAt descending (newest first)
function sortedVisitors(list: VisitorEntry[]): VisitorEntry[] {
  return [...list].sort((a, b) =>
    b.visitedAt > a.visitedAt ? 1 : b.visitedAt < a.visitedAt ? -1 : 0,
  );
}

export default function VisitorPanel() {
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");

  const { data: rawVisitors, isLoading, isError } = useGetAllVisitors();
  const signInMutation = useSignInVisitor();

  const visitors = rawVisitors ? sortedVisitors(rawVisitors) : [];
  const lifetimeCount = visitors.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedInstitution = institution.trim();
    if (!trimmedName || !trimmedInstitution) return;

    signInMutation.mutate(
      { name: trimmedName, institution: trimmedInstitution },
      {
        onSuccess: () => {
          setName("");
          setInstitution("");
          toast.success(`Welcome, ${trimmedName}! 🎉`, {
            description: `Signed in from ${trimmedInstitution}`,
          });
        },
        onError: () => {
          toast.error("Could not sign in. Please try again.");
        },
      },
    );
  };

  const isSubmitting = signInMutation.isPending;

  return (
    <section className="py-16 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-1 self-stretch rounded-full flex-shrink-0 mt-1 section-accent-amber" />
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                style={{ color: "oklch(0.62 0.13 75)" }}
              >
                Visitor Register
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Visitor Sign-in
              </h2>
              <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-lg">
                Welcome to Bio-Learner! Please register your visit so we know
                who's learning with us.
              </p>
            </div>
          </div>
          {!isLoading && lifetimeCount > 0 && (
            <Badge
              variant="secondary"
              className="self-start sm:self-auto text-sm px-3 py-1 font-semibold flex items-center gap-1.5 flex-shrink-0"
              style={{
                background: "oklch(0.96 0.04 80)",
                color: "oklch(0.45 0.14 75)",
                border: "1px solid oklch(0.88 0.10 80)",
              }}
            >
              <Users className="w-3.5 h-3.5" />
              {lifetimeCount} {lifetimeCount === 1 ? "visitor" : "visitors"}{" "}
              lifetime
            </Badge>
          )}
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6 items-start">
          {/* Sign-in Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2"
          >
            <div
              className="rounded-2xl border border-border/60 p-6 shadow-sm"
              style={{ background: "oklch(0.995 0.004 100)" }}
            >
              <div className="flex items-center gap-2.5 mb-6">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "oklch(0.92 0.08 80)" }}
                >
                  <UserCheck
                    className="w-4.5 h-4.5"
                    style={{
                      color: "oklch(0.45 0.14 75)",
                      width: "18px",
                      height: "18px",
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground text-base leading-tight">
                    Register Your Visit
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Takes less than 10 seconds
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="visitor-name"
                    className="text-sm font-semibold text-foreground"
                  >
                    Your Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="visitor-name"
                    data-ocid="visitor.name.input"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                    autoComplete="name"
                    className="text-sm h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="visitor-institution"
                    className="text-sm font-semibold text-foreground"
                  >
                    Institution / School Name{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="visitor-institution"
                    data-ocid="visitor.institution.input"
                    type="text"
                    placeholder="e.g. Delhi Public School, Sector 14"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required
                    disabled={isSubmitting}
                    autoComplete="organization"
                    className="text-sm h-10"
                  />
                </div>

                <Button
                  type="submit"
                  data-ocid="visitor.submit_button"
                  disabled={isSubmitting || !name.trim() || !institution.trim()}
                  className="w-full h-10 font-semibold"
                  style={{
                    background: "oklch(0.50 0.16 75)",
                    color: "white",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Visitor List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-3"
          >
            {isLoading ? (
              <div
                data-ocid="visitor.loading_state"
                className="rounded-2xl border border-border/40 p-10 text-center flex flex-col items-center gap-3"
                style={{ background: "oklch(0.97 0.006 100)" }}
              >
                <Loader2
                  className="w-8 h-8 animate-spin"
                  style={{ color: "oklch(0.55 0.12 75)" }}
                />
                <p className="text-muted-foreground text-sm">
                  Loading visitor list…
                </p>
              </div>
            ) : isError ? (
              <div
                data-ocid="visitor.error_state"
                className="rounded-2xl border border-destructive/30 p-10 text-center flex flex-col items-center gap-3"
                style={{ background: "oklch(0.97 0.006 100)" }}
              >
                <p className="font-display font-bold text-foreground text-base">
                  Could not load visitors
                </p>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Please refresh the page to try again.
                </p>
              </div>
            ) : visitors.length === 0 ? (
              <div
                data-ocid="visitor.empty_state"
                className="rounded-2xl border border-border/40 p-10 text-center flex flex-col items-center gap-3"
                style={{ background: "oklch(0.97 0.006 100)" }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1"
                  style={{ background: "oklch(0.92 0.04 80)" }}
                >
                  <BookOpen
                    className="w-7 h-7"
                    style={{ color: "oklch(0.55 0.12 75)" }}
                  />
                </div>
                <p className="font-display font-bold text-foreground text-base">
                  No visitors yet
                </p>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Be the first to sign in! Fill in the form on the left to
                  register your visit.
                </p>
              </div>
            ) : (
              <div
                data-ocid="visitor.list"
                className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1"
              >
                <AnimatePresence initial={false}>
                  {visitors.map((visitor, idx) => {
                    const visitDate = bigintToDate(visitor.visitedAt);
                    return (
                      <motion.div
                        key={String(visitor.id)}
                        data-ocid={`visitor.item.${idx + 1}`}
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start gap-3 rounded-xl border border-border/40 p-3.5 shadow-xs"
                        style={{ background: "oklch(0.995 0.003 100)" }}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColor(visitors.length - 1 - idx)}`}
                        >
                          {getInitials(visitor.name)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-foreground text-sm truncate">
                              {visitor.name}
                            </p>
                            <span className="text-muted-foreground text-[11px] flex-shrink-0 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(visitDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <p className="text-muted-foreground text-xs truncate">
                              {visitor.institution}
                            </p>
                          </div>
                          <p className="text-muted-foreground text-[11px] mt-1">
                            {formatDate(visitDate)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
