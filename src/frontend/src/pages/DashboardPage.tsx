import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCallHistory,
  useContacts,
  useRecentBlocked,
  useTotalBlocked,
} from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  Ban,
  Clock,
  PhoneOff,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

function ClassificationBadge({ classification }: { classification: string }) {
  const colorMap: Record<string, string> = {
    Scammer: "bg-red-100 text-red-700 border-red-200",
    Robocall: "bg-orange-100 text-orange-700 border-orange-200",
    Spam: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Unknown: "bg-gray-100 text-gray-600 border-gray-200",
    Trusted: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${colorMap[classification] ?? colorMap.Unknown}`}
    >
      {classification}
    </span>
  );
}

export default function DashboardPage() {
  const { data: totalBlocked, isLoading: loadingTotal } = useTotalBlocked();
  const { data: recentBlocked, isLoading: loadingRecent } = useRecentBlocked();
  const { data: contacts, isLoading: loadingContacts } = useContacts();
  const { data: callHistory, isLoading: loadingHistory } = useCallHistory();

  const stats = [
    {
      title: "Total Calls Blocked",
      value: loadingTotal
        ? null
        : totalBlocked
          ? Number(totalBlocked).toLocaleString()
          : "0",
      icon: ShieldCheck,
      color: "text-red-500",
      bg: "bg-red-50",
      ocid: "dashboard.total_blocked.card",
    },
    {
      title: "Contacts Managed",
      value: loadingContacts ? null : (contacts?.length.toString() ?? "0"),
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
      ocid: "dashboard.contacts.card",
    },
    {
      title: "Call History Entries",
      value: loadingHistory ? null : (callHistory?.length.toString() ?? "0"),
      icon: Clock,
      color: "text-purple-500",
      bg: "bg-purple-50",
      ocid: "dashboard.history.card",
    },
    {
      title: "Protection Rate",
      value: "99.8%",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      ocid: "dashboard.rate.card",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="hero-gradient rounded-2xl p-6 text-white"
          data-ocid="dashboard.panel"
        >
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="h-6 w-6" />
            <h2 className="text-xl font-bold">Welcome to farewall</h2>
          </div>
          <p className="text-white/75 text-sm">
            Your phone is protected. Here's a real-time overview of your call
            filtering activity.
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ title, value, icon: Icon, color, bg, ocid }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Card className="border-border shadow-card" data-ocid={ocid}>
                <CardContent className="pt-5">
                  <div
                    className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}
                  >
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  {value === null ? (
                    <Skeleton
                      className="h-8 w-16 mb-1"
                      data-ocid="dashboard.loading_state"
                    />
                  ) : (
                    <p className="text-2xl font-extrabold text-navy-800">
                      {value}
                    </p>
                  )}
                  <p className="text-xs text-foreground/50 mt-0.5">{title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent blocked */}
        <Card className="border-border shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-navy-800">
              <PhoneOff className="h-4 w-4 text-red-500" />
              Recent Blocked Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingRecent ? (
              <div className="space-y-3" data-ocid="dashboard.loading_state">
                {[1, 2, 3].map((n) => (
                  <Skeleton key={n} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : !recentBlocked || recentBlocked.length === 0 ? (
              <div
                className="text-center py-10 text-foreground/40"
                data-ocid="dashboard.empty_state"
              >
                <PhoneOff className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No blocked calls yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentBlocked.map((call, i) => (
                  <div
                    key={Number(call.id)}
                    className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 border border-red-100"
                    data-ocid={`dashboard.item.${i + 1}`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {call.callerName || "Unknown"}
                      </p>
                      <p className="text-xs text-foreground/50">{call.phone}</p>
                    </div>
                    <ClassificationBadge classification={call.classification} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              label: "Manage Blocklist",
              desc: "Add or remove blocked numbers",
              to: "/blocklist",
              icon: Ban,
              color: "text-red-500",
            },
            {
              label: "Trust Levels",
              desc: "Configure contact trust scores",
              to: "/trust-levels",
              icon: Users,
              color: "text-blue-500",
            },
            {
              label: "Call History",
              desc: "View complete call log",
              to: "/history",
              icon: Clock,
              color: "text-purple-500",
            },
          ].map(({ label, desc, to, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="bg-white border border-border rounded-2xl p-5 hover:shadow-card transition-shadow group"
              data-ocid="dashboard.link"
            >
              <Icon className={`h-6 w-6 ${color} mb-2`} />
              <p className="font-semibold text-navy-800 text-sm group-hover:text-navy-600 transition-colors">
                {label}
              </p>
              <p className="text-xs text-foreground/50 mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
