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
import {
  useAddContact,
  useContacts,
  useDeleteContact,
  useUpdateContact,
} from "@/hooks/useQueries";
import type { Contact } from "@/hooks/useQueries";
import { Loader2, Pencil, Plus, Trash2, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const TRUST_LEVELS = ["Trusted", "Neutral", "Blocked"];

function TrustBadge({ level }: { level: string }) {
  const map: Record<string, { dot: string; text: string; bg: string }> = {
    Trusted: {
      dot: "bg-emerald-500",
      text: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
    },
    Neutral: {
      dot: "bg-yellow-400",
      text: "text-yellow-700",
      bg: "bg-yellow-50 border-yellow-200",
    },
    Blocked: {
      dot: "bg-red-500",
      text: "text-red-700",
      bg: "bg-red-50 border-red-200",
    },
  };
  const style = map[level] ?? map.Neutral;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {level}
    </span>
  );
}

function ContactForm({
  initial,
  onSave,
  isPending,
  onCancel,
}: {
  initial?: Contact;
  onSave: (data: { name: string; phone: string; trustLevel: string }) => void;
  isPending: boolean;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [trustLevel, setTrustLevel] = useState(
    initial?.trustLevel ?? "Neutral",
  );

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-1.5">
        <Label htmlFor="contact-name">Name</Label>
        <Input
          id="contact-name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-ocid="trust.input"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-phone">Phone Number</Label>
        <Input
          id="contact-phone"
          placeholder="+1 (555) 000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          data-ocid="trust.input"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-trust">Trust Level</Label>
        <Select value={trustLevel} onValueChange={setTrustLevel}>
          <SelectTrigger id="contact-trust" data-ocid="trust.select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TRUST_LEVELS.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onCancel}
          data-ocid="trust.cancel_button"
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSave({ name, phone, trustLevel })}
          disabled={isPending || !name.trim() || !phone.trim()}
          className="bg-navy-800 hover:bg-navy-900 text-white"
          data-ocid="trust.submit_button"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          {initial ? "Save Changes" : "Add Contact"}
        </Button>
      </DialogFooter>
    </div>
  );
}

export default function TrustLevelsPage() {
  const { data: contacts, isLoading } = useContacts();
  const addContact = useAddContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const [addOpen, setAddOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<bigint | null>(null);

  const handleAdd = async (data: {
    name: string;
    phone: string;
    trustLevel: string;
  }) => {
    try {
      await addContact.mutateAsync(data);
      toast.success("Contact added");
      setAddOpen(false);
    } catch {
      toast.error("Failed to add contact");
    }
  };

  const handleUpdate = async (data: {
    name: string;
    phone: string;
    trustLevel: string;
  }) => {
    if (!editContact) return;
    try {
      await updateContact.mutateAsync({ id: editContact.id, ...data });
      toast.success("Contact updated");
      setEditContact(null);
    } catch {
      toast.error("Failed to update contact");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteContact.mutateAsync(id);
      toast.success("Contact removed");
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to remove contact");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-800">Trust Levels</h2>
            <p className="text-sm text-foreground/50 mt-0.5">
              {contacts?.length ?? 0} contact
              {(contacts?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-navy-800 hover:bg-navy-900 text-white rounded-full gap-2"
                data-ocid="trust.open_modal_button"
              >
                <Plus className="h-4 w-4" /> Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent data-ocid="trust.dialog">
              <DialogHeader>
                <DialogTitle className="text-navy-800">Add Contact</DialogTitle>
              </DialogHeader>
              <ContactForm
                onSave={handleAdd}
                isPending={addContact.isPending}
                onCancel={() => setAddOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border shadow-card">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3" data-ocid="trust.loading_state">
                {[1, 2, 3].map((n) => (
                  <Skeleton key={n} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : !contacts || contacts.length === 0 ? (
              <div
                className="text-center py-16 px-4"
                data-ocid="trust.empty_state"
              >
                <Users className="h-12 w-12 mx-auto mb-3 text-foreground/20" />
                <p className="font-semibold text-foreground/50">
                  No contacts yet
                </p>
                <p className="text-sm text-foreground/40 mt-1">
                  Add contacts to manage trust levels
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {contacts.map((contact, i) => (
                  <motion.div
                    key={Number(contact.id)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="flex items-center justify-between px-5 py-4"
                    data-ocid={`trust.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-sm font-bold text-navy-600">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {contact.name}
                        </p>
                        <p className="text-xs text-foreground/50">
                          {contact.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrustBadge level={contact.trustLevel} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditContact(contact)}
                        className="text-foreground/40 hover:text-navy-600 hover:bg-secondary"
                        data-ocid={`trust.edit_button.${i + 1}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setConfirmDelete(contact.id)}
                        className="text-foreground/40 hover:text-red-500 hover:bg-red-50"
                        data-ocid={`trust.delete_button.${i + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit dialog */}
      <Dialog
        open={editContact !== null}
        onOpenChange={(o) => !o && setEditContact(null)}
      >
        <DialogContent data-ocid="trust.dialog">
          <DialogHeader>
            <DialogTitle className="text-navy-800">Edit Contact</DialogTitle>
          </DialogHeader>
          {editContact && (
            <ContactForm
              initial={editContact}
              onSave={handleUpdate}
              isPending={updateContact.isPending}
              onCancel={() => setEditContact(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm delete */}
      <Dialog
        open={confirmDelete !== null}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <DialogContent data-ocid="trust.dialog">
          <DialogHeader>
            <DialogTitle>Remove Contact?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-foreground/60 py-2">
            This contact will be permanently removed.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(null)}
              data-ocid="trust.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                confirmDelete !== null && handleDelete(confirmDelete)
              }
              disabled={deleteContact.isPending}
              data-ocid="trust.confirm_button"
            >
              {deleteContact.isPending ? (
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
