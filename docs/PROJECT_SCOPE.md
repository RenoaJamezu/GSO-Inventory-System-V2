# Project Scope

## Current Implementation

This project currently focuses exclusively on the **General Services Office (GSO)**.

The purpose of this implementation is to fully digitalize the inventory management workflow of the GSO, including inventory records, reporting, QR code asset identification, and inventory data management.

The current version is intended to be used by **one administrator from the General Services Office**.

Public users do not have administrative access and may only view public asset information by scanning QR Codes attached to government property.

---

# Current Users

## GSO Administrator

The administrator has full access to:

- Inventory Accounts
- Inventory Records
- Dynamic Columns
- Group Management
- Excel Import
- QR Code Printing
- Inventory Reports
- PPE Summary Reports

---

## Public Users

Public users can:

- Scan QR Codes
- View Asset Information
- Access Public Inventory Details

Public users cannot:

- Modify Records
- Access Reports
- Import Data
- Print QR Labels
- Manage Inventory

---

# Current System Boundary

The current implementation covers only the inventory-related operations of the General Services Office.

Other municipal offices are outside the scope of the present implementation.

Examples include:

- Accounting Office
- Office of the Municipal Mayor
- Treasurer's Office
- Engineering Office
- Budget Office
- Human Resource Office

---

# Future Scalability

Although the current implementation focuses only on the General Services Office, the system architecture has been designed with future expansion in mind.

Future versions may support multiple municipal offices while keeping each office's data, reports, users, and workflows independent.

Possible future enhancements include:

- Multiple Office Support
- Multi-user Authentication
- Office-based Permissions
- Role-Based Access Control (RBAC)
- User Management
- Office-specific Reports
- Office-specific Inventory Workflows
- Centralized Municipal Asset Monitoring

---

# Long-Term Vision

The long-term goal of this project is to evolve from a **GSO Inventory Management System** into a **Municipal Government Asset Management Platform**.

In the future, each municipal office may have its own dedicated workspace while sharing a common system infrastructure.

Example future architecture:

Municipal Government Asset Management Platform

├── General Services Office (GSO)
│ ├── Inventory Management
│ ├── Reports
│ ├── QR Asset Tracking
│ └── Asset Monitoring
│
├── Accounting Office
│ ├── Accounting Processes
│ ├── Financial Reports
│ └── Asset Verification
│
├── Engineering Office
│ ├── Infrastructure Assets
│ └── Equipment Monitoring
│
├── Treasurer's Office
│ └── Office-specific Modules
│
└── Other Municipal Offices
└── Office-specific Processes

Each office will maintain its own data and operational processes while operating within the same unified platform.

---

# Current Development Philosophy

The current priority is to complete a stable, production-ready system for the General Services Office before introducing additional offices or expanding into a multi-office platform.

This phased approach ensures that the GSO workflow remains stable, maintainable, and reliable while providing a solid architectural foundation for future expansion.
