# Alpatrix — project context for Claude

## What we are building

Alpatrix is a **prediction market aggregation and execution layer built on Solana**.

It sits above existing prediction market platforms as a connective and execution layer — unifying fragmented markets into a single, efficient trading interface. Alpatrix does not run its own prediction markets. It connects to existing platforms, aggregates their liquidity and market data, and provides superior execution on top.

---

## The problem

Prediction markets are fragmented:
- The same event exists across multiple platforms with different prices and liquidity depths
- Users manually choose where to trade with no visibility into best pricing
- Most platforms lack advanced trading tools like limit orders
- Users must switch between platforms to compare markets

There is no unified infrastructure layer that aggregates markets, optimises execution, and provides advanced trading primitives. That is what Alpatrix builds.

---

## System architecture — three layers

```
Frontend (Next.js)
       ↓
AGGREGATION ENGINE
  Data Layer → Aggregation Layer → Execution Layer
       ↓
SOLANA PROGRAMS
  Factory | Execution Engine | Order Manager | Position Manager | Vault
       ↓
EXTERNAL MARKET PLATFORMS
  Polymarket | Bayes Market | (future venues)
```

---

## Core layers

### Data layer
Ingests and standardises data across prediction market platforms.
- Fetches markets from external platforms via their APIs
- Normalises market structures into a unified internal schema
- Matches equivalent events across platforms (same event, different venue)
- Maintains real-time price and liquidity updates

### Aggregation layer
Optimises execution across fragmented liquidity.
- Compares prices across markets
- Evaluates liquidity depth per venue
- Computes best execution path
- Splits orders across multiple venues when necessary to minimise slippage

### Execution layer
Handles actual trade execution and position management.
- Routes trades to appropriate platforms
- Executes orders with slippage control
- Tracks unified positions across markets
- Supports non-custodial transactions

---

## Core features (launch scope)

### Limit orders
Alpatrix introduces limit order functionality to prediction markets — most venues do not offer this natively.
- Buy limits — enter positions at target prices
- Sell limits — exit positions at predefined profit levels
- Automated execution when market conditions are met
- Orders stored on-chain (Solana Order Manager program)

### Unified market access
- View markets from multiple platforms in a single interface
- Compare prices and liquidity in real time
- Trade without switching platforms

### Cross-market execution
- Execute a single trade across multiple venues simultaneously
- Access deeper combined liquidity pools
- Optimise trade outcomes via the aggregation layer

---

## Core flows

### Market discovery
User opens Alpatrix → Data layer fetches markets from platforms → Normalised into unified format → Equivalent events grouped → User views aggregated feed

### Trade execution
User selects market + direction → Aggregation layer evaluates price, liquidity depth, slippage impact across venues → Execution plan generated → Execution layer routes trade → Executed across one or more platforms → User position updated

### Limit order execution
User sets limit order → Order stored on-chain (Order Manager program) → System monitors market prices continuously → Condition met → Order executed automatically → Position updated

---

## Solana program architecture

All on-chain logic lives as modular Solana programs written in Rust using the Anchor framework.

| Program | Responsibility |
|---|---|
| Factory | Deploys and manages market interaction instances |
| Execution engine | Trade routing and execution logic |
| Order manager | Stores and triggers limit orders on-chain |
| Position manager | Tracks user positions and exposure across venues |
| Vault | Asset custody for trades — non-custodial |

### Key Solana concepts in use
- **Programs** — Alpatrix's on-chain logic (not "smart contracts" — use Solana terminology)
- **PDAs (program derived addresses)** — deterministic account addresses for per-order and per-position state
- **Anchor** — Rust framework for program development; handles account validation, serialisation, CPI
- **CPI (cross-program invocation)** — how programs call each other (e.g. execution engine → vault)
- **Accounts model** — all state lives in accounts; programs are stateless
- **Lamports** — Solana's fee unit (not "gas")

---

## Tech stack

| Layer | Technology |
|---|---|
| Blockchain | Solana |
| Programs | Rust / Anchor |
| Frontend | Next.js, TypeScript |
| Data layer | APIs + Indexers |
| Wallet integration | Solana Wallet Adapter |

---

## Integrated venues (current)

| Venue | Notes |
|---|---|
| Polymarket | Primary integration — CLOB, Polygon execution |
| Bayes Market | Integration in progress — details TBC |

More venues extensible by design — adding a venue means a new data layer adapter + normaliser.

---

## Roadmap

### MVP
- Market aggregation (single platform)
- Basic execution engine
- Simple UI for trading

### V1
- Multi-platform aggregation (Polymarket + Bayes Market)
- Limit order support
- Position tracking dashboard

### V2
- Cross-chain execution
- Advanced routing strategies
- SDK for integrations

---

## Design principles

1. **Composability** — all components are modular and can integrate with external applications
2. **Non-custodial** — users maintain full control of funds; vault program holds assets, not Alpatrix
3. **Efficiency** — execution optimised for best price and minimal slippage
4. **Abstraction** — users interact with a unified interface, never the underlying platforms directly

---

## What Alpatrix is NOT

- Not a prediction market (does not create or resolve markets)
- Not a custodian (vault is a non-custodial program)
- Not EVM — all on-chain logic is Solana-native Rust/Anchor, not Solidity
- Not a simple price display layer — execution, routing, and limit orders are the core value

---

## Naming and terminology

- **Alpatrix** — the product
- **Venues / platforms** — the prediction market platforms aggregated (Polymarket, Bayes Market)
- **Program** — Solana on-chain logic unit (not "smart contract")
- **Anchor** — the Rust framework for Solana programs
- **PDA** — program derived address
- **Aggregation engine** — the combined data + aggregation + execution layer (backend)
- **Data layer** — ingestion and normalisation of venue data
- **Aggregation layer** — execution path optimisation across venues
- **Execution layer** — trade routing and position management
- **Order manager** — the Solana program handling limit orders
- **Vault** — the Solana program handling asset custody
- **Fill** — a completed or partial execution of an order
- **Leg** — one side of a multi-venue trade
- **Slippage** — difference between expected and actual fill price
- **Spread** — gap between best bid and best ask

---

## Current build focus

Claude should focus on:
1. **Solana program architecture** — Rust/Anchor programs: factory, execution engine, order manager, position manager, vault
2. **Aggregation engine backend** — data layer (API ingestion, normalisation), aggregation layer (routing logic), execution layer (order management)
3. **API/SDK design** — interfaces that the Next.js frontend and future B2B integrators consume

The UI (Next.js frontend) is already designed. Do not suggest UI changes unless asked.

---

## Tone and approach

- Technical and precise — the team is building, not learning basics
- Use Solana-native terminology: programs, accounts, PDAs, lamports, CPI — never EVM terms
- When suggesting implementation, default to Anchor patterns and Solana account model conventions
- Flag trade-offs explicitly — routing logic, on-chain vs off-chain order monitoring, and bridge mechanics all have real complexity
- When in doubt about Bayes Market specifics, flag as TBC rather than assuming
