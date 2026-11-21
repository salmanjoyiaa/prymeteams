# Decision Log

| ID | Decision | Rationale | Status |
|---|---|---|---|
| D001 | Handoff HTML is binding visual source of truth | Master prompt §0–§4 | IMPLEMENTATION DECISION |
| D002 | Homepage ports handoff markup/CSS with link remaps only | Pixel match to `design-reference-full-page.png` | IMPLEMENTATION DECISION |
| D003 | Site settings (email, domain, office, buy-out terms) editable in admin | User request; replaces hard-coded placeholders | IMPLEMENTATION DECISION |
| D004 | Single `supabase/schema.sql` for user to run; keys later | User request; graceful fallback without env | IMPLEMENTATION DECISION |
| D005 | `/talent` is separate route; homepage unchanged | SRD vs handoff reconciliation | IMPLEMENTATION DECISION |
| D006 | Mobile hamburger + clamp() headings are implementation extensions | Handoff has no dedicated mobile MQ | IMPLEMENTATION DECISION |
| D007 | P1 ops modules included from prompt SRD summary | SRD file missing from workspace | IMPLEMENTATION DECISION |
