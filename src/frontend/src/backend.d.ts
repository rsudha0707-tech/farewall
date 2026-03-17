import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BlocklistEntry {
    id: bigint;
    phone: string;
    reason: string;
}
export interface Contact {
    id: bigint;
    name: string;
    trustLevel: string;
    phone: string;
}
export interface CallHistory {
    id: bigint;
    wasBlocked: boolean;
    callerName: string;
    timestamp: bigint;
    phone: string;
    classification: string;
}
export interface backendInterface {
    addBlocklistEntry(phone: string, reason: string): Promise<bigint>;
    addCallHistory(phone: string, callerName: string, classification: string, wasBlocked: boolean): Promise<bigint>;
    addContact(name: string, phone: string, trustLevel: string): Promise<bigint>;
    deleteContact(id: bigint): Promise<void>;
    getBlocklist(): Promise<Array<BlocklistEntry>>;
    getCallHistory(): Promise<Array<CallHistory>>;
    getContacts(): Promise<Array<Contact>>;
    getRecentBlocked(): Promise<Array<CallHistory>>;
    getTotalBlocked(): Promise<bigint>;
    removeBlocklistEntry(id: bigint): Promise<void>;
    updateContact(id: bigint, name: string, phone: string, trustLevel: string): Promise<void>;
}
