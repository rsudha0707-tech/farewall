import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  useAddBlocklistEntry,
  useBlocklist,
  useRemoveBlocklistEntry,
} from "@/hooks/useQueries";
import { Ban, Loader2, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const REASONS = ["Scammer", "Robocall", "Spam", "Unknown"];

function ReasonBadge({ reason }: { reason: string }) {
  const colorMap: Record<string, string> = {
    Scammer: "bg-red-100 text-red-700 border-red-200",
    Robocall: "bg-orange-100 text-orange-700 border-orange-200",
    Spam: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Unknown: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${colorMap[reason] ?? colorMap.Unknown}`}
    >
      {reason}
    </span>
  );
}

export default function BlocklistPage() {
  const { data: blocklist, isLoading } = useBlocklist();
  const addEntry = useAddBlocklistEntry();
  const removeEntry = useRemoveBlocklistEntry();

  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("Spam");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<bigint | null>(null);

  const handleAdd = async () => {
    if (!phone.trim()) return;
    try {
      await addEntry.mutateAsync({ phone: phone.trim(), reason });
      toast.success("Number added to blocklist");
      setPhone("");
      setReason("Spam");
      setDialogOpen(false);
    } catch {
      toast.error("Failed to add entry");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await removeEntry.mutateAsync(id);
      toast.success("Entry removed");
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to remove entry");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-800">Blocklist</h2>
            <p className="text-sm text-foreground/50 mt-0.5">
              {blocklist?.length ?? 0} blocked number
              {(blocklist?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-navy-800 hover:bg-navy-900 text-white rounded-full gap-2"
                data-ocid="blocklist.open_modal_button"
              >
                <Plus className="h-4 w-4" /> Add Number
              </Button>
            </DialogTrigger>
            <DialogContent data-ocid="blocklist.dialog">
              <DialogHeader>
                <DialogTitle className="text-navy-800">
                  Add to Blocklist
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="block-phone">Phone Number</Label>
                  <Input
                    id="block-phone"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    data-ocid="blocklist.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="block-reason">Reason</Label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger
                      id="block-reason"
                      data-ocid="blocklist.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REASONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  data-ocid="blocklist.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={addEntry.isPending || !phone.trim()}
                  className="bg-navy-800 hover:bg-navy-900 text-white"
                  data-ocid="blocklist.submit_button"
                >
                  {addEntry.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : null}
                  Add to Blocklist
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border shadow-card">
          <CardContent className="p-0">
            {isLoading ? (
              <div
                className="p-6 space-y-3"
                data-ocid="blocklist.loading_state"
              >
                {[1, 2, 3].map((n) => (
                  <Skeleton key={n} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : !blocklist || blocklist.length === 0 ? (
              <div
                className="text-center py-16 px-4"
                data-ocid="blocklist.empty_state"
              >
                <Ban className="h-12 w-12 mx-auto mb-3 text-foreground/20" />
                <p className="font-semibold text-foreground/50">
                  No blocked numbers
                </p>
                <p className="text-sm text-foreground/40 mt-1">
                  Add a number to get started
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {blocklist.map((entry, i) => (
                  <motion.div
                    key={Number(entry.id)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="flex items-center justify-between px-5 py-4"
                    data-ocid={`blocklist.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                        <Ban className="h-4 w-4 text-red-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {entry.phone}
                        </p>
                        <ReasonBadge reason={entry.reason} />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setConfirmDelete(entry.id)}
                      className="text-foreground/40 hover:text-red-500 hover:bg-red-50"
                      data-ocid={`blocklist.delete_button.${i + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirm delete dialog */}
      <Dialog
        open={confirmDelete !== null}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <DialogContent data-ocid="blocklist.dialog">
          <DialogHeader>
            <DialogTitle>Remove from Blocklist?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-foreground/60 py-2">
            This number will no longer be blocked.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(null)}
              data-ocid="blocklist.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                confirmDelete !== null && handleDelete(confirmDelete)
              }
              disabled={removeEntry.isPending}
              data-ocid="blocklist.confirm_button"
            >
              {removeEntry.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
