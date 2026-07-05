# System Overview

## Introduction

The **GSO Inventory Management System** is a modular web-based inventory management application developed for the **General Services Office (GSO)**.

Its primary objective is to digitize and simplify the inventory management process by replacing paper-based records with a centralized system capable of managing dynamic inventory records, QR code identification, reporting, and future office integrations.

The application is intentionally designed with scalability in mind so it can eventually become a complete **Municipal Asset Management System**.

---

# Design Philosophy

The project follows several core principles.

## Modular

Each business feature is isolated into its own module.

Examples include:

- Authentication
- Inventory Accounts
- Inventory Records
- Dynamic Columns
- Groups
- Excel Import
- Reporting

Each module owns its:

- Components
- Pages
- Hooks
- API
- Types
- Utilities
- Validation

This keeps the project maintainable as it grows.

---

## Feature-Based Architecture

Instead of organizing files by type (components, hooks, pages), the application groups everything by feature.

Example:

```text
features/
│
├── auth/
├── inventory-accounts/
├── inventory-records/
├── reporting/
└── groups/
```

This allows every feature to evolve independently without affecting unrelated modules.

---

## Dynamic Data Structure

Unlike traditional inventory systems where every asset type requires its own table, this system stores inventory data using **dynamic columns**.

Example:

Inventory Account

```
Land
```

Fields

```
Lot Number
Area
Location
Land Title
```

Another account

```
Vehicle
```

Fields

```
Plate Number
Engine Number
Color
Model
```

Both use the same inventory records table while supporting completely different data structures.

---

# Major Modules

## Authentication

Responsible for:

- User login
- Session management
- Protected routes
- Authorization
- Row Level Security (RLS)

---

## Inventory Accounts

Represents high-level inventory categories.

Examples:

- Land
- Buildings
- Office Equipment
- ICT Equipment
- Vehicles

Each account defines its own inventory structure.

---

## Dynamic Columns

Allows every inventory account to define its own fields.

Supports:

- Text
- Number
- Date
- Currency
- Dropdowns (future)
- Validation

---

## Inventory Records

Stores the actual inventory items.

Each record contains:

- Dynamic field values
- QR UUID
- Group assignment
- Creation metadata

---

## Groups

Groups organize inventory records.

Examples:

- Offices
- Buildings
- Departments
- Warehouses

Supports individual and bulk assignment.

---

## QR Code Module

Every inventory record automatically receives a QR UUID.

Capabilities include:

- Individual printing
- Bulk printing
- Public information page
- Future signed QR templates

---

## Excel Import

Allows rapid migration of inventory data.

Features include:

- Dynamic templates
- Automatic mapping
- Manual mapping
- Preview
- Validation
- Bulk insertion

---

## Reporting

Generates printable government reports.

Current:

- PPE Summary

Planned:

- Inventory Account Report
- Additional government forms
- Direct PDF generation

---

## Dashboard

Provides operational insights.

Planned widgets include:

- Total Inventory Accounts
- Total Records
- Total Groups
- Total Asset Value
- Recent Activity
- Charts

---

# Application Flow

```text
Authentication
        │
        ▼
Inventory Accounts
        │
        ▼
Dynamic Columns
        │
        ▼
Inventory Records
        │
 ┌──────┼───────────┐
 ▼      ▼           ▼
Groups  QR      Reports
        │
        ▼
 Public Asset Page
```

---

# Database Design

The database uses a relational structure with dynamic inventory data.

Core tables:

- inventory_accounts
- account_columns
- inventory_records
- groups
- users

Supporting objects:

- inventory_accounts_summary (View)
- public_inventory_records (View)

Future additions may include:

- roles
- permissions
- offices
- audit_logs

---

# Security

The system uses **Supabase Authentication** together with **Row Level Security (RLS)**.

Security features include:

- Protected Routes
- Session Persistence
- Authenticated Database Access
- Public QR Access
- Future Role-Based Access Control (RBAC)

---

# Scalability

Although the current implementation focuses only on the General Services Office, the architecture is designed for future expansion.

Future office modules may include:

- Accounting Office
- Mayor's Office
- Treasurer's Office
- Engineering Office
- Human Resource Office
- Assessor's Office

Each office will maintain independent workflows while sharing the same authentication, infrastructure, and core services.

---

# Current Development Focus

Current priorities include:

1. Authentication & Authorization
2. Inventory Reporting
3. Dashboard
4. User Interface Improvements

Once completed, the system will serve as the foundation for a larger municipal information system.
