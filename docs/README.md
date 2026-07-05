# GSO Inventory Management System

A modern inventory management system developed for the **General Services Office (GSO)** to streamline asset inventory, physical counting, QR code identification, and reporting.

The system replaces manual inventory processes with a centralized digital solution capable of managing inventory accounts, dynamic asset records, QR labels, Excel imports, and inventory reports.

> **Project Status:** Active Development

---

# Overview

The current implementation focuses exclusively on the **General Services Office (GSO)**.

The architecture is intentionally modular so the system can later expand into a complete **Municipal Asset Management System**, supporting additional offices such as:

- Accounting Office
- Mayor's Office
- Engineering Office
- Treasurer's Office
- Human Resource Office
- Assessor's Office

Each office will eventually have its own workflows while sharing a common authentication, reporting, and infrastructure layer.

---

# Current Features

## Inventory Account Management

- Create Inventory Accounts
- Edit Inventory Accounts
- Soft Delete
- Search Accounts
- Book Value Management
- Automatic Inventory Totals
- Variance Calculation

---

## Dynamic Inventory Records

Each inventory account supports its own dynamic fields.

Examples include:

- Land
- Buildings
- Machinery
- Vehicles
- Furniture
- ICT Equipment

Every account can define completely different columns without changing the database schema.

---

## Group Management

Organize inventory records into groups.

Examples:

- Office
- Building
- Department
- Location
- Warehouse

Supports both individual and bulk assignment.

---

## QR Code System

Each inventory record automatically receives a unique QR Code.

Features include:

- Individual QR Printing
- Bulk QR Printing
- Public Asset Information Page
- QR UUID Generation

---

## Excel Import

Dynamic Excel import that adapts to every inventory account.

Features include:

- Download Dynamic Template
- Multi-sheet Workbook Support
- Automatic Column Mapping
- Manual Column Mapping
- Preview Before Import
- Group Assignment
- Bulk Import

---

## Reports

Current reports include:

- PPE Summary Report
- Browser Printing (Long Bond 8.5 × 13)

Upcoming reports include:

- Inventory Account Report
- Direct PDF Generation
- Additional Government Report Templates

---

## Authentication

Current implementation:

- Secure Login
- Protected Routes
- Session Persistence
- Supabase Authentication
- Row Level Security (RLS)

Future versions will support:

- Multiple Users
- Role-Based Access Control (RBAC)
- Office-based Permissions
- Activity Logs

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- React Hook Form
- Zod

## Backend

- Supabase
  - PostgreSQL
  - Authentication
  - Storage
  - Row Level Security
  - Realtime

---

# Project Structure

```
src/
│
├── app/
├── components/
├── features/
│
│   ├── auth/
│   ├── inventory-accounts/
│   ├── inventory-records/
│   ├── account-columns/
│   ├── groups/
│   ├── excel-import/
│   ├── reporting/
│   └── public/
│
├── lib/
└── pages/
```

The project follows a **feature-based architecture**, where each module contains its own components, pages, hooks, APIs, types, and utilities.

---

# Documentation

Project documentation is organized under the `docs/` directory.

- `SYSTEM_OVERVIEW.md`
- `MUNICIPAL_SYSTEM_ROADMAP.md`
- `docs/GSO/README.md`
- `docs/GSO/SYSTEM_PURPOSE.md`
- `docs/GSO/DEVELOPMENT_CHECKLIST.md`

---

# Current Development

Current focus:

- Authentication & Authorization
- Inventory Reporting
- Dashboard
- UI/UX Improvements

---

# Future Vision

The long-term goal is to evolve this project into a complete **Municipal Asset Management System**, where multiple municipal offices operate within a unified platform while maintaining independent workflows and permissions.

Future modules may include:

- General Services Office (GSO)
- Accounting Office
- Mayor's Office
- Engineering Office
- Treasurer's Office
- Human Resource Office
- Assessor's Office

Each office will remain modular, making the system scalable and maintainable.

---

# License

This project is currently under active development.

All rights reserved to me
