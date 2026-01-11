<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/5d6559bb-9573-4d76-beff-7c6a9faf1477" />


# Mobi Shield

Mobi Shield is an AI-powered Dip Shield bot designed to monitor token market conditions on pumpfun and coordinate full treasury reinjection strategies during 30% drawdown events.

The system continuously observes price data, detects structured drawdowns relative to recent peaks, and produces deterministic reinjection plans that allocate all accumulated developer fees and protocol profits back into the ecosystem when thresholds are met.

This repository focuses on detection, policy definition, accounting, and communication logic. Execution of capital movements is intentionally separated.

## Overview

Mobi Shield operates as a modular service composed of the following layers:

- Market data ingestion
- Drawdown detection
- Treasury accounting
- Reinjection planning
- Automated communication and reporting

The system is designed to be transparent, auditable, and deterministic, with clear separation between policy logic and capital execution.

## Core Principles

- **Threshold-based response**  
  Reinjection events are triggered at 30% drawdowns from a rolling local peak.

- **Full allocation policy**  
  All accumulated developer fees and protocol profits are allocated during each reinjection event.

- **Execution separation**  
  This codebase does not perform swaps, trades, or on-chain execution directly.

- **Deterministic behavior**  
  Identical inputs produce identical reinjection plans.

## Architecture
