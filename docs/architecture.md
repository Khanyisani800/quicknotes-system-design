# QuickNotes System Architecture Document

## Functional & Non-Functional Requirements

### Functional Requirements
* Users must be able to create, view, and delete notes.
* System must support tagging notes and querying notes by tag.
* Users must be authenticated before performing actions on their notes.

### Non-Functional Requirements
* **Scale**: Support 1 million active users[cite: 2, 4].
* **High Availability**: 99.9% uptime.
* **Low Latency**: Read operations under 50ms; writes under 200ms.
* **Data Persistence & Security**: Encrypted communication (HTTPS/TLS) and isolated multi-tenant data access.

---

## Load Estimates (1 Million Daily Active Users)

* **Reads per second**: Assuming each active user views 10 notes/pages per day:
  $$\frac{10,000,000 \text{ reads}}{86,400 \text{ seconds}} \approx 116 \text{ reads/sec (Average)}$$
  *Peak load (3x average)* = **~350 reads/sec**

* **Writes per second**: Assuming each user creates/deletes 2 notes per day:
  $$\frac{2,000,000 \text{ writes}}{86,400 \text{ seconds}} \approx 23 \text{ writes/sec (Average)}$$
  *Peak load (3x average)* = **~70 writes/sec**

* **Storage per year**: Assuming 1KB per note and 2 notes created daily per user ($2,000,000 \text{ notes/day}$):
  $$2,000,000 \times 1 \text{ KB} = 2 \text{ GB/day}$$
  $$2 \text{ GB/day} \times 365 \text{ days} = \mathbf{730 \text{ GB/year}}$$

---

## Architecture Diagram (Text Representation)

```text
[ Client (Web/Mobile) ]
          │
          ▼
     [ DNS ]
          │
          ▼
   [ Cloudflare CDN ]
          │
          ▼
  [ Load Balancer ]
     │         │
     ▼         ▼
 [ App Server 1 ]   [ App Server 2 ]  <-- Auto-scaling pool
     │         │         │
     ├─────────┼─────────┼──────────────────────┐
     │         │         │                      │
     ▼         ▼         ▼                      ▼
[ Redis Cache ]  [ Queue (RabbitMQ) ]   [ Primary DB (PostgreSQL) ]
                             │                  │ (Writes)
                             ▼                  ▼
                     [ Background Worker ]   [ Read Replica DB ]
                                                (Reads)
