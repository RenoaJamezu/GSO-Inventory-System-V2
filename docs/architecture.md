# Project Architecture

This document defines the architectural rules for the project.

These rules are intended to keep the codebase:

- Maintainable
- Scalable
- Easy to understand
- Easy to migrate to another backend
- Resistant to regressions

Every new feature and refactor should follow these guidelines.

---

# Architecture Philosophy

The application follows a **Feature-First Architecture**.

Each business feature owns its:

- UI
- Hooks
- Business logic
- Data access
- Types
- Validation

Features should be as independent as possible.

---

# Feature Structure

Every feature should follow this structure.

```
feature/

api/
components/
hooks/
pages/
repositories/
schemas/
services/
utils/

constants.ts
permissions.ts (optional)
types.ts
index.ts
```

Some folders may be empty until needed.

Folder consistency is preferred over folder minimalism.

---

# Folder Responsibilities

## api/

Responsible for talking to external systems.

Examples:

- Supabase
- REST API
- Laravel API
- External Services

Rules:

- No React
- No JSX
- No React Query
- No UI logic

---

## repositories/

Responsible for abstracting data access.

Repositories hide where data comes from.

Today:

```
Repository
↓

Supabase
```

Future:

```
Repository
↓

Laravel API
```

Components and hooks should never know which backend is being used.

---

## services/

Contains business logic.

Examples:

- Report generation
- QR generation
- Excel processing
- Validation
- Calculations
- Inventory processing

Services should never contain UI.

---

## hooks/

Contains React hooks.

Examples:

- React Query
- State management
- UI orchestration

Hooks communicate with repositories.

Hooks should never call Supabase directly.

---

## components/

Reusable UI.

Components should:

- Receive props
- Render UI
- Emit events

Components should not know where data comes from.

---

## pages/

Compose an entire screen.

Pages should remain thin.

Pages should primarily:

- Load hooks
- Render components
- Connect dialogs

Business logic should not live here.

---

## schemas/

Contains Zod validation.

---

## utils/

Contains pure helper functions.

Rules:

- No React
- No Supabase
- No React Query

Pure functions only.

---

# Dependency Direction

Dependencies must only flow downward.

```
Pages
↓

Components
↓

Hooks
↓

Services
↓

Repositories
↓

API
↓

Backend
```

Never reverse this direction.

---

# Forbidden Dependencies

The following are not allowed.

❌ Components -> API

❌ Components -> Supabase

❌ Pages -> Supabase

❌ Services -> React Query

❌ Services -> React Components

❌ Repositories -> React

❌ API -> React

---

# Naming Conventions

Hooks

```
useInventoryRecords()
useGroups()
useCurrentUser()
```

Repositories

```
inventoryRecordRepository
groupRepository
userRepository
```

Services

```
InventoryRecordService
ReportService
ExcelImportService
```

Components

```
InventoryRecordsTable
GroupDialog
SearchInput
```

---

# Shared Components

Move components to `/components` only if they are reused by at least two features.

Otherwise they stay inside their feature.

---

# Backend Independence

The frontend should never depend directly on Supabase.

Only the repository layer knows the backend implementation.

This allows future migration to:

- Laravel
- ASP.NET
- Node.js
- Spring Boot

without changing UI code.

---

# Office Independence

The current implementation focuses on the General Services Office (GSO).

Future offices:

- Accounting
- Mayor's Office
- Engineering
- HR
- Treasurer

should reuse core systems whenever possible.

Office-specific workflows should extend the system instead of modifying shared functionality.

---

# No Regression Principle

Every refactor must satisfy the following:

- Application compiles
- Existing features continue working
- Public APIs remain unchanged unless intentionally redesigned
- Changes should be incremental
- One architectural concern per commit

Large refactors should be avoided.

Prefer many small safe refactors over one large rewrite.

---

# Long-Term Vision

Current Backend

```
React
↓

Supabase
```

Future Backend

```
React
↓

Repositories
↓

Laravel API
↓

MySQL
```

The UI should remain unchanged during backend migration.
