# Error Boundaries Guide

## Overview

Error boundaries catch JavaScript errors in component trees, log errors, and display fallback UI.

## Usage

### Basic Error Boundary

```tsx
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

<ErrorBoundary level="page" context="user-profile">
  <UserProfile />
</ErrorBoundary>
```

### Levels

**component** - Small component errors
```tsx
<ErrorBoundary level="component" context="user-card">
  <UserCard />
</ErrorBoundary>
```

**page** - Page-level errors
```tsx
<ErrorBoundary level="page" context="dashboard">
  <Dashboard />
</ErrorBoundary>
```

**critical** - App-level errors
```tsx
<ErrorBoundary level="critical" context="app-root">
  <App />
</ErrorBoundary>
```

### Custom Fallback

```tsx
<ErrorBoundary 
  fallback={
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => window.location.reload()}>
        Reload
      </button>
    </div>
  }
>
  <MyComponent />
</ErrorBoundary>
```

### Custom Error Handler

```tsx
<ErrorBoundary 
  onError={(error, errorInfo) => {
    console.log('Custom handler:', error);
    // Send to analytics
  }}
>
  <MyComponent />
</ErrorBoundary>
```

## Async Error Boundary

Catches unhandled promise rejections:

```tsx
import { AsyncErrorBoundary } from './components/ErrorBoundary/AsyncErrorBoundary';

<AsyncErrorBoundary>
  <App />
</AsyncErrorBoundary>
```

## useErrorBoundary Hook

Programmatically trigger error boundaries:

```tsx
import { useErrorBoundary } from './hooks/useErrorBoundary';

const MyComponent = () => {
  const { showBoundary } = useErrorBoundary();

  const handleClick = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      showBoundary(error);
    }
  };

  return <button onClick={handleClick}>Do Something</button>;
};
```

## Error Boundary Features

### Retry Mechanism
- Automatic retry up to 2 times
- Shows remaining retry count
- Disabled for critical errors

### Error Logging
- Logs to console in development
- Sends to monitoring service in production
- Includes context and component stack

### Error Details
- Unique error ID for tracking
- Copy error details to clipboard
- Full stack trace in development

### User Actions
- Retry (if available)
- Reload page
- Go to home
- Copy error details

## Best Practices

### 1. Wrap at Multiple Levels

```tsx
<ErrorBoundary level="critical" context="app">
  <App>
    <ErrorBoundary level="page" context="dashboard">
      <Dashboard>
        <ErrorBoundary level="component" context="chart">
          <Chart />
        </ErrorBoundary>
      </Dashboard>
    </ErrorBoundary>
  </App>
</ErrorBoundary>
```

### 2. Provide Context

```tsx
<ErrorBoundary context="user-profile-edit">
  <UserProfileEdit />
</ErrorBoundary>
```

### 3. Use Appropriate Levels

- **component**: Non-critical UI elements
- **page**: Important page sections
- **critical**: App shell, routing

### 4. Handle Async Errors

```tsx
const fetchData = async () => {
  try {
    return await api.getData();
  } catch (error) {
    showBoundary(error);
  }
};
```

### 5. Don't Catch Everything

Error boundaries should NOT catch:
- Event handlers (use try-catch)
- Async code (use try-catch or AsyncErrorBoundary)
- Server-side rendering
- Errors in error boundary itself

## Error Boundary Limitations

### Won't Catch

```tsx
// ❌ Event handler
<button onClick={() => { throw new Error('Boom'); }}>
  Click
</button>

// ✅ Use try-catch
<button onClick={() => {
  try {
    riskyOperation();
  } catch (error) {
    handleError(error);
  }
}}>
  Click
</button>
```

### Won't Catch Async

```tsx
// ❌ Async error
useEffect(() => {
  fetchData(); // Unhandled rejection
}, []);

// ✅ Use try-catch
useEffect(() => {
  const load = async () => {
    try {
      await fetchData();
    } catch (error) {
      showBoundary(error);
    }
  };
  load();
}, []);
```

## Testing Error Boundaries

```tsx
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

it('catches errors and displays fallback', () => {
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText(/algo deu errado/i)).toBeInTheDocument();
});
```

## Production Setup

### 1. Error Monitoring Service

```typescript
// In ErrorBoundary
private logToMonitoringService = async (errorData: any) => {
  await fetch('/api/errors', {
    method: 'POST',
    body: JSON.stringify(errorData)
  });
};
```

### 2. Backend Error Endpoint

```typescript
// backend/src/routes/errors.ts
router.post('/errors', async (req, res) => {
  const errorData = req.body;
  // Log to Sentry, DataDog, etc.
  await errorLogger.log(errorData);
  res.json({ success: true });
});
```

### 3. User Notifications

```tsx
<ErrorBoundary 
  onError={(error) => {
    notificationService.error('An error occurred');
  }}
>
  <App />
</ErrorBoundary>
```

## Resources

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Error Handling in React](https://react.dev/learn/error-boundaries)
