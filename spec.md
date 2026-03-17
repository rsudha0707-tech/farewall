# Farewall - Smart Call Filter Application

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full landing page with hero section, feature highlights, and download CTA
- Smart call screening: log calls with spam/trusted/unknown classification
- Blocklist management: add/remove phone numbers to a personal blocklist
- Trust Levels: assign contact trust levels (trusted, neutral, blocked)
- Call History: view recent call log with status labels and timestamps
- Dashboard stats: total calls blocked, recent blocked list
- Contact management: store contacts with name, phone, and trust level

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend (Motoko):
   - Store contacts with name, phone number, trust level (Trusted / Neutral / Blocked)
   - Store blocklist of phone numbers with reason labels (Scammer, Robocall, Spam, etc.)
   - Store call history entries with phone, timestamp, classification, blocked status
   - CRUD for contacts, blocklist entries, and call history
   - Stats: total blocked count, recent blocked calls
2. Frontend:
   - Landing page: navbar, hero with gradient, feature showcase with phone mockup, feature grid, social proof, footer
   - Dashboard: stats cards, recent blocked list, call history table
   - Blocklist page: add/remove blocked numbers with reason
   - Trust Levels page: manage contacts with trust status
   - Call History page: full log with filters
