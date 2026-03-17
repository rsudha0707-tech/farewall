import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import { Menu, ShieldCheck, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Blocklist", href: "/blocklist" },
  { label: "Trust Levels", href: "/trust-levels" },
  { label: "History", href: "/history" },
];

export default function Navbar({
  transparent = false,
}: { transparent?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleNav = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      router.navigate({ to: "/" });
      setTimeout(() => {
        const el = document.getElementById(href.slice(2));
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      router.navigate({ to: href });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        transparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-sm shadow-nav"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-700 text-white group-hover:bg-navy-800 transition-colors">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-navy-800 tracking-tight">
            farewall
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="text-sm font-medium text-foreground/70 hover:text-navy-700 transition-colors"
              data-ocid="nav.link"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            onClick={() => router.navigate({ to: "/dashboard" })}
            className="bg-navy-800 hover:bg-navy-900 text-white text-sm font-semibold px-5 rounded-full"
            data-ocid="nav.primary_button"
          >
            Get Started Free
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-md text-foreground/70 hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-white border-t border-border"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  className="text-sm font-medium text-left px-3 py-2 rounded-md text-foreground/70 hover:text-navy-700 hover:bg-secondary transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <Button
                onClick={() => {
                  setMobileOpen(false);
                  router.navigate({ to: "/dashboard" });
                }}
                className="mt-2 bg-navy-800 hover:bg-navy-900 text-white rounded-full"
              >
                Get Started Free
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
