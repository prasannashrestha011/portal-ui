# Frontend Development Skill

## Core Architecture

This project follows a simple frontend architecture:

```text
src/
├── api/
│   └── client.ts
├── services/
│   └── *.ts
├── types/
│   └── *.ts
├── components/
│   └── *.tsx
├── context/
├── hooks/
└── app/
```

The standard flow for adding a new feature is:

```text
Types → Service → Component → Page/Integration
```

Follow this structure for every new frontend feature.

---

## 1. Types First

Before implementing a feature that communicates with the backend, create or update its types in:

```text
src/types/
```

Example:

```ts
export interface RegisterRequest {
    email: string;
    password: string;
    full_name: string;
}

export interface User {
    id: string;
    email: string;
    full_name: string;
    role: "student" | "employer" | "admin" | string;
    created_at: string;
}
```

Rules:

* Reuse existing types when possible.
* Do not duplicate existing interfaces.
* Match the backend API structure.
* Do not use `any` when a proper type can be defined.

---

## 2. Service Second

After defining the types, create or update the appropriate service in:

```text
src/services/
```

All API communication must go through the service layer.

Example:

```ts
export const authService = {
    async login(payload: LoginRequest) {
        const { data } = await apiClient.post<
            ApiResponse<TokenResponse>
        >("/auth/login", payload);

        return data;
    },
};
```

Components must not directly call `apiClient`.

Do not write API requests like this inside components:

```ts
apiClient.get(...)
apiClient.post(...)
apiClient.put(...)
apiClient.delete(...)
```

Instead:

```ts
await internshipService.create(payload);
```

Follow the existing service patterns in the project.

---

## 3. Components Third

Create the UI inside:

```text
src/components/
```

Components should use the services created for the feature.

For example:

```text
src/
├── services/
│   └── internshipService.ts
├── types/
│   └── internship.ts
└── components/
    └── internship/
        ├── InternshipCard.tsx
        ├── InternshipForm.tsx
        └── InternshipList.tsx
```

Keep components focused on UI and user interaction.

Do not put backend/API implementation inside components.

---

## 4. Reuse Existing Code

Before creating a new type, service, hook, component, or utility:

1. Search the existing codebase.
2. Check whether something similar already exists.
3. Reuse or extend it when appropriate.
4. Follow the existing naming and coding patterns.

Do not create duplicate abstractions unnecessarily.

---

## 5. Follow the Existing Project

Do not introduce a new library, architecture, state-management solution, or design pattern unless the project already uses it or there is a clear requirement for it.

For example, do not introduce TanStack Query, Redux, a new HTTP client, or another form library simply because it is commonly used.

Use the technologies and patterns already established in the project.

---

## 6. Feature Implementation Rule

When asked to add a new frontend feature:

1. Inspect the existing implementation and related files.
2. Identify the API request and response structures.
3. Create/update the required types in `src/types`.
4. Create/update the required service in `src/services`.
5. Create the required UI components in `src/components`.
6. Integrate the component into the appropriate page.
7. Follow the existing UI and coding conventions.

Keep the implementation as simple as the feature requires.

Do not over-engineer a straightforward feature.

## 7. Forms

Use the project's existing form architecture.

This project uses:

```text
React Hook Form
+
Zod
```

For forms, follow this structure:

```text
types/
    internship.ts

services/
    internshipService.ts

schemas/
    internshipSchema.ts

components/
    internship/
        InternshipForm.tsx
```

Create the Zod schema for form validation and use it with React Hook Form.

Example:

```ts
const form = useForm<CreateInternshipRequest>({
    resolver: zodResolver(createInternshipSchema),
});
```

Submit form data through the appropriate service:

```ts
await internshipService.create(values);
```

Do not put API requests directly inside the form component.

Do not duplicate validation rules manually when the same validation can be handled by the Zod schema.

When creating an update form, reuse the existing schema/types where appropriate rather than creating unnecessary duplicates.

---

## 8. API State and Error Handling

API-driven components should handle the relevant states:

```text
Loading
Success
Error
Empty
```

For example:

```tsx
if (isLoading) {
    return <LoadingSpinner />;
}

if (isError) {
    return <ErrorState />;
}

if (!data?.length) {
    return <EmptyState />;
}

return <InternshipList internships={data} />;
```

Use the project's existing approach for managing loading and error state. Do not introduce a new state-management library.

Do not silently swallow API errors.

Avoid:

```ts
try {
    ...
} catch {
}
```

If an error needs to be caught, handle it intentionally—for example, display an error message, update component state, or perform the appropriate UI action.

For mutations such as create, update, or delete, provide appropriate success and failure feedback to the user.

