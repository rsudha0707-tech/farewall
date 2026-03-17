import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAddCallHistory, useCallHistory } from "@/hooks/useQueries";
import { CheckCircle, Clock, Loader2, Plus, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const CLASSIFICATIONS = ["Scammer", "Robocall", "Spam", "Trusted", "Unknown"];

function ClassificationBadge({ classification }: { classification: string }) {
  const colorMap: Record<string, string> = {
    Scammer: "bg-red-100 text-red-700 border-red-200",
    Robocall: "bg-orange-100 text-orange-700 border-orange-200",
    Spam: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Trusted: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Unknown: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${colorMap[classification] ?? colorMap.Unknown}`}
    >
      {classification}
    </span>
  );
}

function formatTimestamp(ts: bigint): string {
  try {
    const ms = Number(ts / BigInt(1_000_000));
    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) return "Unknown time";
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Unknown time";
  }
}

export default function HistoryPage() {
  const { data: history, isLoading } = useCallHistory();
  const addHistory = useAddCallHistory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [callerName, setCallerName] = useState("");
  const [classification, setClassification] = useState("Unknown");
  const [wasBlocked, setWasBlocked] = useState(false);

  const handleAdd = async () => {
    if (!phone.trim()) return;
    try {
      await addHistory.mutateAsync({
        phone: phone.trim(),
        callerName: callerName.trim(),
        classification,
        wasBlocked,
      });
      toast.success("Call log entry added");
      setPhone("");
      setCallerName("");
      setClassification("Unknown");
      setWasBlocked(false);
      setDialogOpen(false);
    } catch {
      toast.error("Failed to add entry");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-800">Call History</h2>
            <p className="text-sm text-foreground/50 mt-0.5">
              {history?.length ?? 0} call
              {(history?.length ?? 0) !== 1 ? "s" : ""} logged
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-navy-800 hover:bg-navy-900 text-white rounded-full gap-2"
                data-ocid="history.open_modal_button"
              >
                <Plus className="h-4 w-4" /> Log Call
              </Button>
            </DialogTrigger>
            <DialogContent data-ocid="history.dialog">
              <DialogHeader>
                <DialogTitle className="text-navy-800">Log a Call</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="hist-phone">Phone Number</Label>
                  <Input
                    id="hist-phone"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    data-ocid="history.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hist-caller">Caller Name (optional)</Label>
                  <Input
                    id="hist-caller"
                    placeholder="Unknown Caller"
                    value={callerName}
                    onChange={(e) => setCallerName(e.target.value)}
                    data-ocid="history.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hist-class">Classification</Label>
                  <Select
                    value={classification}
                    onValueChange={setClassification}
                  >
                    <SelectTrigger id="hist-class" data-ocid="history.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASSIFICATIONS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hist-blocked">Was Blocked</Label>
                  <Switch
                    id="hist-blocked"
                    checked={wasBlocked}
                    onCheckedChange={setWasBlocked}
                    data-ocid="history.switch"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  data-ocid="history.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={addHistory.isPending || !phone.trim()}
                  className="bg-navy-800 hover:bg-navy-900 text-white"
                  data-ocid="history.submit_button"
                >
                  {addHistory.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : null}
                  Log Call
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border shadow-card">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3" data-ocid="history.loading_state">
                {[1, 2, 3, 4].map((n) => (
                  <Skeleton key={n} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : !history || history.length === 0 ? (
              <div
                className="text-center py-16 px-4"
                data-ocid="history.empty_state"
              >
                <Clock className="h-12 w-12 mx-auto mb-3 text-foreground/20" />
                <p className="font-semibold text-foreground/50">
                  No call history yet
                </p>
                <p className="text-sm text-foreground/40 mt-1">
                  Log calls to build your history
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {history.map((call, i) => (
                  <motion.div
                    key={Number(call.id)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.02 }}
                    className={`flex items-center justify-between px-5 py-4 ${
                      call.wasBlocked ? "bg-red-50/40" : "bg-emerald-50/20"
                    }`}
                    data-ocid={`history.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${
                          call.wasBlocked ? "bg-red-100" : "bg-emerald-100"
                        }`}
                      >
                        {call.wasBlocked ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {call.callerName || "Unknown Caller"}
                        </p>
                        <p className="text-xs text-foreground/50">
                          {call.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ClassificationBadge
                        classification={call.classification}
                      />
                      <p className="text-xs text-foreground/40 hidden sm:block">
                        {formatTimestamp(call.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
