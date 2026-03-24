# Architecture Overview

Gatekeeper is composed of two main planes:

## 1. Data Plane (Gateway Runtime)
- Handles real-time traffic
- Applies policies
- Produces decisions

## 2. Control Plane
- Manages APIs, clients, policies
- Produces configuration snapshots
- Provides simulation and audit capabilities

## Communication Model
- Gateway pulls configuration snapshots periodically
- Snapshots are versioned and immutable

## Core Flow

Request → Gateway → Decision Engine → Upstream / Deny
                         ↓
                      Logs / Metrics / Audit