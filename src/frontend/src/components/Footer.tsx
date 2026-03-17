import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-navy-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">farewall</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Smart call filtering to silence spam and safeguard your phone from
              scammers and robocallers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Dashboard", to: "/dashboard" },
                { label: "Blocklist", to: "/blocklist" },
                { label: "Trust Levels", to: "/trust-levels" },
                { label: "Call History", to: "/history" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">
              Contact Info
            </h4>
            <ul className="space-y-2">
              <li className="text-sm text-white/60">support@farewall.app</li>
              <li className="text-sm text-white/60">1-800-FAREWALL</li>
              <li className="text-sm text-white/60">Mon–Fri, 9am–5pm EST</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">
              Social Media
            </h4>
            <ul className="space-y-2">
              {["Twitter / X", "LinkedIn", "Facebook", "Instagram"].map((s) => (
                <li key={s}>
                  <span className="text-sm text-white/60 hover:text-white cursor-pointer transition-colors">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/40">
            &copy; {year} farewall. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Built with <span className="text-teal-400">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
