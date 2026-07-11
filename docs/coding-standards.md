# Coding Standards

This document defines the coding conventions used throughout the project.

The goal is consistency, readability, maintainability, and minimizing regressions.

---

# General Principles

Code should be:

- Simple
- Predictable
- Reusable
- Strongly typed
- Easy to refactor

Prefer readability over cleverness.

---

# File Naming

## Components

PascalCase

```
InventoryRecordsTable.tsx
InventoryHeader.tsx
GroupDialog.tsx
SearchInput.tsx
```

---

## Hooks

camelCase starting with `use`

```
useInventoryRecords.ts
useGroups.ts
useCurrentUser.ts
```

---

## Schemas

camelCase ending with `.schema.ts`

```
inventoryRecord.schema.ts
group.schema.ts
accountColumn.schema.ts
```

---

## Services

PascalCase

```
InventoryRecordService.ts
ReportService.ts
ExcelImportService.ts
```

---

## Repositories

camelCase

```
inventoryRecordRepository.ts
groupRepository.ts
authRepository.ts
```

---

## Types

One `types.ts` per feature whenever possible.

Avoid creating many small type files.

---

# Component Rules

Components should:

- Receive props
- Render UI
- Emit callbacks

Components should NOT:

- Fetch data
- Talk to Supabase
- Navigate
- Perform business logic

---

# Page Rules

Pages should compose features.

Pages should:

- Call hooks
- Pass props
- Render components

Pages should avoid:

- Data transformations
- Complex calculations
- Business rules

---

# Hook Rules

Hooks own:

- React Query
- Local state
- Mutations
- Memoization

Hooks should return a clean API.

Example:

```
const {
    records,
    loading,
    createRecord,
    deleteRecord
} = useInventoryRecords()
```

Avoid exposing unnecessary implementation details.

---

# Service Rules

Services contain business logic.

Good examples:

- Report generation
- Excel processing
- QR generation
- Inventory calculations

Services should never import React.

---

# Repository Rules

Repositories abstract data access.

Repositories are the only layer that knows where data comes from.

Current:

```
Supabase
```

Future:

```
Laravel
```

Changing backend should not affect UI.

---

# API Rules

API files should only communicate with external systems.

No UI logic.

No React.

No business logic.

---

# Utility Rules

Utilities should be pure.

Given the same input,
they always return the same output.

Utilities should never:

- mutate React state
- call APIs
- navigate

---

# Import Order

Use this order.

```
React

Third-party libraries

@ aliases

Relative imports

Types
```

Example

```ts
import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { useGroups } from "@/features/groups";

import Dialog from "./Dialog";

import type { Group } from "../types";
```

---

# Barrel Exports

Every feature should expose a public API through `index.ts`.

Consumers should import from:

```
@/features/groups
```

instead of

```
@/features/groups/hooks/useGroups
```

Only internal files may use deep imports.

---

# TypeScript

Avoid `any`.

Prefer:

```
unknown
```

or proper interfaces.

Always type:

- props
- hooks
- API responses
- mutations

---

# React Query

Every query should have:

```
queryKey

queryFn
```

Mutations should invalidate only affected queries.

Avoid invalidating everything.

---

# Comments

Comment WHY.

Avoid commenting WHAT.

Bad:

```ts
// increment counter
counter++;
```

Good:

```ts
// Inventory numbers must remain contiguous for report generation.
```

---

# Shared Components

Move to `/components` only when used by at least two features.

Otherwise keep components inside the feature.

---

# Refactoring Rules

Every refactor should satisfy:

- App compiles
- Existing functionality works
- No API changes
- No UI changes
- One concern per commit

Small commits are preferred.

---

# Future Backend

The frontend should remain backend-agnostic.

Only repositories should know whether data comes from:

- Supabase
- Laravel
- REST API
- Mock data
