import type { BlocklistEntry, CallHistory, Contact } from "@/backend";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type { BlocklistEntry, Contact, CallHistory };

export function useTotalBlocked() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalBlocked"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalBlocked();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecentBlocked() {
  const { actor, isFetching } = useActor();
  return useQuery<CallHistory[]>({
    queryKey: ["recentBlocked"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentBlocked();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBlocklist() {
  const { actor, isFetching } = useActor();
  return useQuery<BlocklistEntry[]>({
    queryKey: ["blocklist"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlocklist();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useContacts() {
  const { actor, isFetching } = useActor();
  return useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContacts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<CallHistory[]>({
    queryKey: ["callHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBlocklistEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      phone,
      reason,
    }: { phone: string; reason: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addBlocklistEntry(phone, reason);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blocklist"] }),
  });
}

export function useRemoveBlocklistEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeBlocklistEntry(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blocklist"] }),
  });
}

export function useAddContact() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      phone,
      trustLevel,
    }: { name: string; phone: string; trustLevel: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addContact(name, phone, trustLevel);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

export function useUpdateContact() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      phone,
      trustLevel,
    }: { id: bigint; name: string; phone: string; trustLevel: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateContact(id, name, phone, trustLevel);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

export function useDeleteContact() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteContact(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

export function useAddCallHistory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      phone,
      callerName,
      classification,
      wasBlocked,
    }: {
      phone: string;
      callerName: string;
      classification: string;
      wasBlocked: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addCallHistory(
        phone,
        callerName,
        classification,
        wasBlocked,
      );
    },
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: ["callHistory"] }),
        qc.invalidateQueries({ queryKey: ["recentBlocked"] }),
        qc.invalidateQueries({ queryKey: ["totalBlocked"] }),
      ]),
  });
}
