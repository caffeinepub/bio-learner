import { Bell, BookOpen, Dna, Heart, Images, Youtube } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="hero-bg text-white/80">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                <Dna className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-white">
                Bio-Learner
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              A dedicated platform for science education — sharing notes,
              materials, and classroom memories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                {
                  icon: Bell,
                  label: "Notices",
                  href: "#notices",
                  external: false,
                },
                {
                  icon: BookOpen,
                  label: "Study Materials",
                  href: "#materials",
                  external: false,
                },
                {
                  icon: Images,
                  label: "Photo Gallery",
                  href: "#gallery",
                  external: false,
                },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-white/65 hover:text-white transition-colors"
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://www.youtube.com/@Lets_Explore_with_Pratyush"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="footer.youtube.link"
                  className="flex items-center gap-2 text-sm text-white/65 hover:text-white transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-400" />
                  YouTube Channel
                </a>
              </li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-wider">
              Subjects Covered
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Biology",
                "Chemistry",
                "Physics",
                "Life Science",
                "Botany",
                "Zoology",
              ].map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/15"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/45">
            © {year} Bio-Learner. All rights reserved.
          </p>
          <p className="text-xs text-white/45 flex items-center gap-1.5">
            Built with <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
