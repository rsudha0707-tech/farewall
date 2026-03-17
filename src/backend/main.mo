import Text "mo:core/Text";
import Array "mo:core/Array";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

actor {
  // Contacts
  type Contact = {
    id : Nat;
    name : Text;
    phone : Text;
    trustLevel : Text;
  };

  // Blocklist
  type BlocklistEntry = {
    id : Nat;
    phone : Text;
    reason : Text;
  };

  // Call History
  type CallHistory = {
    id : Nat;
    phone : Text;
    callerName : Text;
    timestamp : Int;
    classification : Text;
    wasBlocked : Bool;
  };

  let contactsList = List.empty<Contact>();
  let blocklist = List.empty<BlocklistEntry>();
  let callHistory = List.empty<CallHistory>();

  var nextContactId = 1;
  var nextBlocklistId = 1;
  var nextCallHistoryId = 1;

  // Initialize with sample data
  system func preupgrade() {
    if (contactsList.isEmpty()) {
      contactsList.add({
        id = nextContactId;
        name = "Alice";
        phone = "+123456789";
        trustLevel = "Trusted";
      });
      nextContactId += 1;

      contactsList.add({
        id = nextContactId;
        name = "Bob";
        phone = "+987654321";
        trustLevel = "Neutral";
      });
      nextContactId += 1;
    };

    if (blocklist.isEmpty()) {
      blocklist.add({
        id = nextBlocklistId;
        phone = "+1122334455";
        reason = "Scammer";
      });
      nextBlocklistId += 1;
    };

    if (callHistory.isEmpty()) {
      callHistory.add({
        id = nextCallHistoryId;
        phone = "+123456789";
        callerName = "Alice";
        timestamp = Time.now();
        classification = "Normal";
        wasBlocked = false;
      });
      nextCallHistoryId += 1;
    };
  };

  // Contact CRUD operations
  public shared ({ caller }) func addContact(name : Text, phone : Text, trustLevel : Text) : async Nat {
    let contact : Contact = {
      id = nextContactId;
      name;
      phone;
      trustLevel;
    };
    contactsList.add(contact);
    nextContactId += 1;
    contact.id;
  };

  public shared ({ caller }) func updateContact(id : Nat, name : Text, phone : Text, trustLevel : Text) : async () {
    let foundContact = contactsList.find(func(c) { c.id == id });
    switch (foundContact) {
      case (null) { Runtime.trap("Contact not found") };
      case (?contact) {
        let updatedContacts = contactsList.toArray().filter(func(c) { c.id != id });
        contactsList.clear();
        contactsList.addAll(updatedContacts.values());
        contactsList.add({
          id;
          name;
          phone;
          trustLevel;
        });
      };
    };
  };

  public shared ({ caller }) func deleteContact(id : Nat) : async () {
    let foundContact = contactsList.find(func(c) { c.id == id });
    switch (foundContact) {
      case (null) { Runtime.trap("Contact not found") };
      case (?contact) {
        let updatedContacts = contactsList.toArray().filter(func(c) { c.id != id });
        contactsList.clear();
        contactsList.addAll(updatedContacts.values());
      };
    };
  };

  public query ({ caller }) func getContacts() : async [Contact] {
    contactsList.toArray();
  };

  // Blocklist operations
  public shared ({ caller }) func addBlocklistEntry(phone : Text, reason : Text) : async Nat {
    let entry : BlocklistEntry = {
      id = nextBlocklistId;
      phone;
      reason;
    };
    blocklist.add(entry);
    nextBlocklistId += 1;
    entry.id;
  };

  public shared ({ caller }) func removeBlocklistEntry(id : Nat) : async () {
    let foundEntry = blocklist.find(func(e) { e.id == id });
    switch (foundEntry) {
      case (null) { Runtime.trap("Blocklist entry not found") };
      case (?entry) {
        let updatedBlocklist = blocklist.toArray().filter(func(e) { e.id != id });
        blocklist.clear();
        blocklist.addAll(updatedBlocklist.values());
      };
    };
  };

  public query ({ caller }) func getBlocklist() : async [BlocklistEntry] {
    blocklist.toArray();
  };

  // Call History operations
  public shared ({ caller }) func addCallHistory(phone : Text, callerName : Text, classification : Text, wasBlocked : Bool) : async Nat {
    let entry : CallHistory = {
      id = nextCallHistoryId;
      phone;
      callerName;
      timestamp = Time.now();
      classification;
      wasBlocked;
    };
    callHistory.add(entry);
    nextCallHistoryId += 1;
    entry.id;
  };

  public query ({ caller }) func getCallHistory() : async [CallHistory] {
    callHistory.toArray();
  };

  public query ({ caller }) func getRecentBlocked() : async [CallHistory] {
    let filtered = callHistory.toArray().filter(func(e) { e.wasBlocked });
    filtered.sliceToArray(0, 10);
  };

  public query ({ caller }) func getTotalBlocked() : async Nat {
    callHistory.toArray().filter(func(e) { e.wasBlocked }).size();
  };
};
