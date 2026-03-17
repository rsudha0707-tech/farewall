import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRecentBlocked, useTotalBlocked } from "@/hooks/useQueries";
import { useRouter } from "@tanstack/react-router";
import {
  Ban,
  Bell,
  CheckCircle,
  History,
  Phone,
  PhoneOff,
  ShieldCheck,
  Star,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: ShieldCheck,
    title: "Smart Call Screening",
    bullets: [
      "AI-powered detection",
      "Real-time analysis",
      "Instant block decisions",
    ],
  },
  {
    icon: Ban,
    title: "Advanced Blocklist",
    bullets: [
      "Custom block rules",
      "Community shared lists",
      "Pattern matching",
    ],
  },
  {
    icon: Star,
    title: "Trust Score Levels",
    bullets: [
      "Trusted contacts VIP",
      "Neutral auto-screen",
      "Blocked instant reject",
    ],
  },
  {
    icon: History,
    title: "Detailed Call History",
    bullets: ["Full audit trail", "Classification logs", "Export reports"],
  },
];

const recentBlockedSample = [
  {
    id: "s1",
    phone: "+1 (555) 234-5678",
    callerName: "Unknown Caller",
    classification: "Robocall",
  },
  {
    id: "s2",
    phone: "+1 (800) 987-6543",
    callerName: "Spam Likely",
    classification: "Scammer",
  },
  {
    id: "s3",
    phone: "+1 (555) 111-2233",
    callerName: "Telemarketer",
    classification: "Spam",
  },
];

const trustSample = [
  { id: "t1", name: "Sarah Johnson", trust: "Trusted" },
  { id: "t2", name: "Unknown +1 (555) 000", trust: "Blocked" },
  { id: "t3", name: "Work Colleague", trust: "Neutral" },
];

const starKeys = ["star1", "star2", "star3", "star4", "star5"];

function ClassificationBadge({ classification }: { classification: string }) {
  const colorMap: Record<string, string> = {
    Scammer: "bg-red-100 text-red-700 border-red-200",
    Robocall: "bg-orange-100 text-orange-700 border-orange-200",
    Spam: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Unknown: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colorMap[classification] ?? colorMap.Unknown}`}
    >
      {classification}
    </span>
  );
}

function TrustBadge({ level }: { level: string }) {
  const colorMap: Record<string, string> = {
    Trusted: "bg-emerald-500",
    Neutral: "bg-yellow-400",
    Blocked: "bg-red-500",
  };
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`w-2 h-2 rounded-full ${colorMap[level] ?? "bg-gray-400"}`}
      />
      <span className="text-xs text-foreground/70">{level}</span>
    </span>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { data: totalBlocked } = useTotalBlocked();
  const { data: recentBlocked } = useRecentBlocked();

  const displayBlocked = totalBlocked ? Number(totalBlocked) : 1842;
  const displayRecent =
    recentBlocked && recentBlocked.length > 0
      ? recentBlocked
          .slice(0, 3)
          .map((item) => ({ ...item, id: String(item.id) }))
      : recentBlockedSample;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient min-h-[560px] flex items-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.82 0.07 191), transparent)",
              }}
            />
            <div
              className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full opacity-15"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.82 0.07 191), transparent)",
              }}
            />
          </div>

          <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Badge className="mb-6 bg-white/15 text-white border-white/30 hover:bg-white/20">
                  <ShieldCheck className="h-3 w-3 mr-1" /> Smart Call Protection
                </Badge>
                <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.05] mb-6">
                  Silence Spam.
                  <br />
                  <span className="opacity-90">Safeguard Your Phone.</span>
                </h1>
                <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-md">
                  farewall uses AI-powered call screening to automatically
                  detect and block scammers, robocallers, and spam — before your
                  phone even rings.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="bg-white text-navy-800 hover:bg-white/90 font-bold px-7 rounded-full shadow-hero"
                    onClick={() => router.navigate({ to: "/dashboard" })}
                    data-ocid="hero.primary_button"
                  >
                    Start Protecting Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white bg-transparent hover:bg-white/10 px-7 rounded-full"
                    onClick={() =>
                      document
                        .getElementById("features")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    data-ocid="hero.secondary_button"
                  >
                    Explore Features
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="hidden md:flex justify-center"
              >
                <div className="relative">
                  <div className="w-52 h-96 bg-navy-900/80 rounded-[2.5rem] border-4 border-white/20 shadow-hero overflow-hidden relative">
                    <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-navy-800/60 to-navy-900/80" />
                    <div className="absolute top-6 left-3 right-3 bg-white rounded-2xl shadow-card p-3">
                      <p className="text-xs text-foreground/50 mb-0.5">
                        Incoming Call
                      </p>
                      <p className="text-sm font-bold text-navy-800">
                        +1 (800) 555-SPAM
                      </p>
                      <p className="text-xs text-red-600 font-semibold mt-1">
                        ⚠ Robocall Detected
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          className="flex-1 bg-red-500 text-white text-xs rounded-full py-1 font-semibold"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          className="flex-1 bg-emerald-500 text-white text-xs rounded-full py-1 font-semibold"
                        >
                          Answer
                        </button>
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-3 right-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3">
                      <p className="text-xs text-white/60">
                        Total Calls Blocked
                      </p>
                      <p className="text-2xl font-extrabold text-white">
                        {displayBlocked.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="absolute -left-16 top-8 bg-white rounded-xl shadow-card p-3 w-36"
                  >
                    <p className="text-xs font-semibold text-foreground/50 mb-1">
                      Blocked Today
                    </p>
                    <p className="text-2xl font-extrabold text-navy-800">47</p>
                    <p className="text-xs text-emerald-600 font-medium">
                      +12% ↑
                    </p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="absolute -right-12 bottom-16 bg-white rounded-xl shadow-card p-3 w-32"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="h-4 w-4 text-teal-500" />
                      <p className="text-xs font-semibold text-foreground/60">
                        Protected
                      </p>
                    </div>
                    <p className="text-sm font-bold text-navy-800">99.8%</p>
                    <p className="text-xs text-foreground/50">accuracy</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-extrabold text-navy-800 mb-4">
              Your Phone's Guardian Angel
            </h2>
            <p className="text-foreground/60 text-lg max-w-xl mx-auto">
              Powerful call management tools working silently in the background
              so you never have to worry.
            </p>
          </motion.div>

          <div className="relative flex justify-center items-center min-h-[480px]">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden lg:block absolute left-0 w-52 bg-white border border-border rounded-2xl shadow-card p-4"
            >
              <p className="text-xs font-bold text-navy-600 mb-3 uppercase tracking-wider">
                Features
              </p>
              {[
                { icon: ShieldCheck, label: "Smart Call Screening" },
                { icon: Ban, label: "Advanced Blocklist" },
                { icon: Star, label: "Trust Score Levels" },
                { icon: History, label: "Detailed Call History" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 py-2 border-b border-border/50 last:border-0"
                >
                  <Icon className="h-4 w-4 text-navy-500" />
                  <span className="text-xs font-medium text-foreground/80">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>

            <div className="w-48 h-80 bg-navy-800 rounded-[2.5rem] border-4 border-navy-700 shadow-hero overflow-hidden relative z-10">
              <div className="absolute inset-0 hero-gradient opacity-80" />
              <div className="absolute top-4 left-3 right-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2">
                <div className="flex items-center gap-1.5">
                  <PhoneOff className="h-3.5 w-3.5 text-red-400" />
                  <p className="text-xs text-white font-semibold">
                    Spam Blocked
                  </p>
                </div>
                <p className="text-xs text-white/70 mt-0.5">
                  +1 (555) 800-SCAM
                </p>
              </div>
              <div className="absolute bottom-4 left-3 right-3">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3">
                  <p className="text-[10px] text-white/60 uppercase tracking-wider">
                    Blocked Today
                  </p>
                  <p className="text-2xl font-extrabold text-white">47</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-3 absolute right-0 w-52">
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-white border border-border rounded-2xl shadow-card p-4"
              >
                <p className="text-xs font-bold text-navy-600 mb-3 uppercase tracking-wider">
                  Recent Blocked
                </p>
                {displayRecent.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {item.callerName}
                      </p>
                      <p className="text-[10px] text-foreground/50 truncate">
                        {item.phone}
                      </p>
                    </div>
                    <ClassificationBadge classification={item.classification} />
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white border border-border rounded-2xl shadow-card p-4"
              >
                <p className="text-xs font-bold text-navy-600 mb-3 uppercase tracking-wider">
                  Trust Levels
                </p>
                {trustSample.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0"
                  >
                    <p className="text-xs font-medium text-foreground truncate max-w-[80px]">
                      {item.name}
                    </p>
                    <TrustBadge level={item.trust} />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-extrabold text-navy-800 mb-3">
              Everything You Need
            </h2>
            <p className="text-foreground/60 max-w-lg mx-auto">
              A complete suite of tools to take back control of your phone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, bullets }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-border p-6 shadow-card hover:shadow-hero transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-navy-500" />
                </div>
                <h3 className="font-bold text-navy-800 mb-3">{title}</h3>
                <ul className="space-y-2">
                  {bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm text-foreground/60"
                    >
                      <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof + Download band */}
      <section className="py-16 bg-navy-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex gap-1 mb-4">
                {starKeys.map((k) => (
                  <Star
                    key={k}
                    className="h-5 w-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-3">
                Trusted by Thousands
              </h2>
              <p className="text-white/70 text-lg mb-6">
                "farewall blocked over 300 spam calls in my first month. I
                finally answer my phone again without fear."
              </p>
              <p className="text-white/50 text-sm">— Maria T., verified user</p>
              <div className="flex items-center gap-6 mt-8">
                <div>
                  <p className="text-3xl font-extrabold text-white">
                    {displayBlocked.toLocaleString()}+
                  </p>
                  <p className="text-white/50 text-sm">Calls Blocked</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div>
                  <p className="text-3xl font-extrabold text-white">99.8%</p>
                  <p className="text-white/50 text-sm">Accuracy</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div>
                  <p className="text-3xl font-extrabold text-white">50K+</p>
                  <p className="text-white/50 text-sm">Users</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/10 rounded-3xl border border-white/20 p-8"
            >
              <Bell className="h-10 w-10 text-teal-400 mb-4" />
              <h3 className="text-2xl font-extrabold text-white mb-2">
                Download Today
              </h3>
              <p className="text-white/70 mb-6">
                Available on iOS and Android. Free to start, premium plans
                available.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  className="flex items-center gap-3 bg-white text-navy-800 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  App Store
                </button>
                <button
                  type="button"
                  className="flex items-center gap-3 bg-white/15 text-white border border-white/30 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-white/25 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  Google Play
                </button>
              </div>
              <p className="text-white/40 text-xs mt-4">
                No credit card required
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
