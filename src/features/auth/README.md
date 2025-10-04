# Authentication Feature

This feature implements a clean, maintainable authentication flow following Vue 3 and TypeScript best practices.

## Architecture

### Separation of Concerns

```
lib/               → Pure business logic (schemas, error mapping, field config)
composables/       → Reactive state management and side effects
ui/                → Pure presentation components
```

### Key Principles

1. **UI components are presentational** - No business logic, just render props and emit events
2. **Composables handle all logic** - State management, API calls, error handling
3. **Utilities are pure functions** - Reusable, testable, no side effects
4. **Type safety everywhere** - Full TypeScript coverage with proper types

## File Structure

### `/lib` - Business Logic

- `schema.ts` - Zod validation schemas for login/register forms
- `error-mapping.ts` - Maps API errors to form field errors
- `form-fields.ts` - Form field configurations and display helpers
- `index.ts` - Public API exports

### `/composables` - State Management

- `useAuth.ts` - Core authentication state and API interactions
- `useAuthForm.ts` - Form state management and submission logic
- `useAuthGuard.ts` - Route protection logic
- `useAuthRedirect.ts` - Redirect logic after auth actions
- `useAuthUtils.ts` - Auth-related utility computations

### `/ui` - Components

- `AuthForm.vue` - Main authentication form (login/register)
- `LoginForm.vue` - Dedicated login form
- `RegisterForm.vue` - Dedicated register form

## Usage Example

### In a Page Component

```vue
<script setup lang="ts">
import { AuthForm } from '@/features/auth'

const handleSuccess = (user) => {
  console.log('User authenticated:', user)
}
</script>

<template>
  <AuthForm mode="login" @success="handleSuccess" />
</template>
```

### Using the Composable Directly

```ts
import { useAuthForm } from '@/features/auth/composables'

const { mode, isLoading, handleSubmit, toggleMode, meta } = useAuthForm({
  mode: 'login',
  redirectTo: '/dashboard',
  onSuccess: (user) => console.log('Success!', user),
  onError: (error) => console.error('Error!', error),
})
```

### Route Protection

```ts
import { useAuthGuard } from '@/features/auth/composables'

// Require authentication
useAuthGuard({
  mode: 'requireAuth',
  redirectTo: '/auth',
})

// Require guest (not authenticated)
useAuthGuard({
  mode: 'requireGuest',
  redirectTo: '/dashboard',
})
```

## Benefits of This Architecture

### ✅ Testability

- Pure functions are easy to unit test
- Composables can be tested in isolation
- Components have minimal logic to test

### ✅ Reusability

- Error mapping logic is centralized
- Form field configs can be reused
- Composables can be used across components

### ✅ Maintainability

- Business logic is separate from UI
- Single source of truth for validation
- Easy to update schemas without touching components

### ✅ Type Safety

- Full TypeScript coverage
- Inferred types from Zod schemas
- Type-safe error handling

### ✅ DRY (Don't Repeat Yourself)

- No duplicated error handling code
- Centralized field configurations
- Shared validation logic

## Error Handling Flow

```
API Error
  ↓
isAuthError() validates error type
  ↓
mapAuthErrorToField() maps to form fields
  ↓
setErrors() updates form state
  ↓
FormMessage components display errors
```

## Validation Flow

```
User Input
  ↓
Zod Schema (LoginFormSchema/RegisterFormSchema)
  ↓
vee-validate with toTypedSchema()
  ↓
Real-time validation feedback
  ↓
Form submission only if valid
```

## Common Patterns

### Adding a New Field

1. Update schema in `lib/schema.ts`
2. Add field config to `lib/form-fields.ts`
3. No component changes needed - it renders automatically!

### Changing Error Messages

1. Update Zod schema messages in `lib/schema.ts`
2. No other changes needed

### Adding New Auth Method (e.g., OAuth)

1. Add method to `useAuth.ts` composable
2. Add handler in `useAuthForm.ts` if needed
3. UI automatically gets new functionality

## CORS Configuration Note

If you encounter CORS errors like:

```
Access to XMLHttpRequest at 'http://localhost:4000/v1/auth/login' from origin
'http://localhost:5173' has been blocked by CORS policy
```

This is a **backend configuration issue**. The backend needs to:

1. Set `Access-Control-Allow-Origin` header
2. Set `Access-Control-Allow-Methods` header
3. Set `Access-Control-Allow-Headers` header
4. Handle preflight OPTIONS requests

Example Express.js middleware:

```js
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)
```
