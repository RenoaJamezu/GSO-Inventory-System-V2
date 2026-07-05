# General Services Office (GSO) Module

## Overview

The **General Services Office (GSO) Module** is the first operational module of the Municipal Asset Management System.

It provides a complete inventory management solution for the General Services Office by allowing personnel to manage government-owned assets, organize inventory records, generate reports, and identify assets using QR codes.

This module serves as the foundation for future municipal office modules while remaining independent from their business processes.

---

# Purpose

The GSO module aims to:

- Digitize inventory management
- Replace paper-based inventory records
- Improve asset tracking
- Simplify inventory reporting
- Reduce manual data encoding
- Provide QR-based asset identification
- Standardize inventory processes

---

# Current Scope

The current implementation includes:

- Inventory Account Management
- Dynamic Inventory Records
- Dynamic Column Configuration
- Group Management
- Excel Import
- QR Code Generation
- QR Label Printing
- Public QR Information Page
- PPE Summary Reporting
- Authentication & Authorization

---

# Major Features

## Inventory Accounts

Inventory accounts represent categories of government assets.

Examples:

- Land
- Buildings
- Office Equipment
- Furniture
- ICT Equipment
- Vehicles

Each account defines its own inventory structure.

---

## Dynamic Inventory Records

Every inventory account can contain completely different fields.

Example:

Land

- Lot Number
- Area
- Title Number

Vehicle

- Plate Number
- Engine Number
- Model

This flexibility allows the system to support many asset categories without requiring new database tables.

---

## QR Code System

Each inventory record automatically receives a unique QR code.

QR codes support:

- Individual label printing
- Bulk label printing
- Public asset information

Future improvements include signed QR templates and direct PDF generation.

---

## Excel Import

Inventory records can be imported using Excel.

Capabilities include:

- Dynamic templates
- Automatic column mapping
- Manual mapping
- Validation
- Preview before import
- Bulk insertion

---

## Reporting

Current reports:

- PPE Summary Report

Planned reports:

- Inventory Account Report
- Additional government reporting templates

---

## Authentication

The module currently supports authenticated access for authorized GSO personnel.

Security is implemented using:

- Supabase Authentication
- Protected Routes
- Row Level Security (RLS)

Public users can only access asset information through QR codes.

---

# Target Users

Current users include:

- General Services Office personnel
- Inventory custodians
- Asset management staff

Public users have read-only access to asset information through QR code scanning.

---

# Technology Stack

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand

Backend

- Supabase
- PostgreSQL
- Row Level Security (RLS)

Utilities

- React Hook Form
- Zod
- React QR Code
- XLSX
- React To Print

---

# Development Status

The GSO module is under active development.

Core inventory management functionality is substantially complete, while reporting, dashboard, and user experience improvements continue to be developed.

Future enhancements will remain isolated within the GSO module to avoid affecting other municipal office modules.

---

# Relationship to the Municipal System

The GSO module is one part of the larger Municipal Asset Management System.

Future office modules will reuse the shared infrastructure while maintaining independent workflows and business rules.

This design ensures the continued stability of the GSO module as the overall system expands.
