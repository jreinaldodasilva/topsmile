
Below are **concrete code patches** (minimal, consistent with the project architecture) you can apply. For each change I give: **Root cause**, **Patch/changes**, and **Why this fixes the tests** (justification). I kept changes small and conservative.

---

# 1) `src/services/http.ts` — make `makeRequest` robust and test-friendly

**Failing symptoms (from tests):** many tests failing with `Error: Network request failed` and traces pointing at `makeRequest`/`request` in `src/services/http.ts`. 

## Root cause

The code currently assumes `fetch` always resolves to a Response-like object and/or the internal `request` wrapper doesn't return a stable value the tests expect. When tests mock fetch or return custom response stubs, code either accesses `.ok` on `undefined` or throws `Network request failed`. Also some requests (e.g. `logout`) are being invoked with unexpected options (missing `body` or headers shape differs), causing mismatch with test expectations. The `fetch` call should be tolerant of mocked fetch implementations used in tests and should always return a well-defined object (or throw a consistent error) and should not swallow/lose the response.

## Solution (minimal change)

Replace the internals of `makeRequest` and `request` to:

* Always use `globalThis.fetch` (so tests that stub `global.fetch`/`globalThis.fetch` will be picked up).
* Wrap `fetch` in `try/catch` and rethrow a `NetworkError` with the original error message so tests that expect `Network request failed` still see that string (if they expect it).
* Always check response existence before reading `response.ok`.
* Return a **consistent** object (not `undefined`) — either the parsed JSON or a structured object `{ ok, status, data, headers }` depending on the project convention. (Below I show a small conservative implementation that returns parsed JSON for successful responses and throws for HTTP errors.)
* Ensure `logout` and other calls set `headers: { "Content-Type": "application/json" }` and `credentials: "include"` exactly as tests expect.

> **Patch** — replace the `makeRequest` and `request` functions in `src/services/http.ts` with the following implementation (TypeScript):

```ts
// src/services/http.ts
// --- (only replace the relevant functions; keep other exports as-is) ---

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function makeRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // ensure globalThis.fetch is used (so test mocks of global.fetch are respected)
  const fetchFn = (globalThis as any).fetch ?? fetch;

  try {
    const response = await fetchFn(url, options);

    // If a mocked fetch returns nothing, guard against that.
    if (!response) {
      throw new Error('Network request failed');
    }

    // Access safe properties
    const { ok, status } = response as Response;

    // Try to parse body safely (some responses may be empty)
    let data: any = null;
    const contentType = response.headers?.get?.('content-type') ?? '';
    if (contentType.includes('application/json')) {
      try {
        data = await (response as Response).json();
      } catch (err) {
        // Malformed JSON should be surfaced as a descriptive error
        throw new Error('Malformed JSON response');
      }
    } else {
      // for non-json, try text
      try {
        data = await (response as Response).text();
      } catch {
        data = null;
      }
    }

    if (!ok) {
      // create a structured error so callers/tests can inspect status and body
      const error: any = new Error('HTTP error');
      error.status = status;
      error.data = data;
      throw error;
    }

    return data as T;
  } catch (err: any) {
    // Preserve test-friendly message for network failures
    if (err.message === 'Failed to fetch' || err.message === 'Network request failed') {
      throw new Error('Network request failed');
    }
    throw err;
  }
}

// Generic request wrapper used by apiService and others
export async function request<T = any>(
  endpoint: string,
  method: HttpMethod = 'GET',
  body?: any,
  opts: RequestInit = {}
): Promise<T> {
  const isFullUrl = /^https?:\/\//i.test(endpoint);
  const url = isFullUrl ? endpoint : `${process.env.REACT_APP_API_URL ?? 'http://localhost:5000'}/api${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  };

  const init: RequestInit = {
    method,
    credentials: 'include',
    headers,
    ...opts,
  };

  if (body !== undefined && method !== 'GET' && method !== 'HEAD') {
    init.body = JSON.stringify(body);
  }

  return makeRequest<T>(url, init);
}
```

**Notes:**

* This code is conservative — it returns parsed JSON for JSON responses and throws a clear error for HTTP errors or malformed JSON.
* It uses `globalThis.fetch` so tests that mock `global.fetch` (or `globalThis.fetch`) will be picked up. The error messages are normalized so tests expecting `Network request failed` still get that on fetch errors.

## Why this should fix the tests

* Tests that previously got `Network request failed` from unpredictable fetch behavior will now get the same error only when actual network/fetch failure occurs.
* The guard against `response` being undefined prevents `reading 'ok' of undefined` errors.
* Creating a stable return shape and using `credentials: 'include'` and `Content-Type` header matches the expectations seen in tests for `logout` and other calls. Example failing assertion for logout showed the received object lacked body/headers shape expected by test; explicit `headers` and body serialization addresses that. 

---

# 2) `src/services/apiService.ts` — guard against undefined responses and forward useful errors

**Failing symptoms:** many tests show `TypeError: Cannot read properties of undefined (reading 'ok')` in `apiService.ts`. The stack traces show calls inside `apiService` reading `.ok` on undefined responses. 

## Root cause

`apiService` is probably calling the underlying HTTP `request`/`makeRequest` but expects a Response-like object (e.g., calling `.ok` or `.json()` itself). With the new `request` implementation above returning parsed data, `apiService` must treat the returned value as parsed data. Also in places where `fetch` is used directly in `apiService`, it may not be using `globalThis.fetch` or is failing to check for undefined responses.

## Solution (minimal change)

* Update `apiService` to use the exported `request` function (from `http.ts`) and **not** access `.ok` on the raw `fetch` return value.
* Add guards: if a lower-level call throws, rethrow a descriptive error; if `request` returns `null`/`undefined` (shouldn't happen), throw a `Network request failed` error.

> **Patch example snippets** (replace the internal body of functions that used `fetch`/`response.ok`):

```ts
// src/services/apiService.ts
import { request } from './http';

// Example: getAppointments -> adapted to use request
export async function getAppointments(params?: Record<string, any>) {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  try {
    const data = await request('/appointments' + query, 'GET');
    // data is the parsed JSON (or the function will throw on HTTP error)
    return data;
  } catch (err) {
    // preserve error semantics for tests (rethrow)
    throw err;
  }
}

// Example: createAppointment
export async function createAppointment(payload: any) {
  try {
    const data = await request('/appointments', 'POST', payload);
    return data;
  } catch (err) {
    throw err;
  }
}

// Do the same pattern for patients, contacts, dashboard, public methods etc.
```

**Add null/undefined guards** where functions might previously have used `response.ok`:

```ts
// generic helper inside apiService.ts
function ensureData<T>(data: T | undefined | null): T {
  if (data === undefined || data === null) {
    throw new Error('Network request failed');
  }
  return data;
}
```

## Why this fixes the tests

* Prevents `reading 'ok' of undefined` because `apiService` will no longer access `.ok` on a possibly-undefined low-level response.
* Aligns `apiService` with the stable `request` return shape (parsed JSON or thrown error), so tests that assert returned data can run normally. Examples: `getAll`, `create`, `delete` tests referencing `apiService.*` will now get a concrete returned value or a thrown error that tests can inspect. 

---

# 3) `src/components/LoginPage` (or the LoginPage export) — fix invalid element type

**Failing symptoms:** LoginPage tests failing with `Element type is invalid: ... got: undefined` — indicates an export/import mismatch or a provider wrapper rendering an undefined component. The stack shows `customRender` from `src/tests/utils/test-utils.tsx` was rendering LoginPage via AllTheProviders. 

## Root cause

A component file is probably using a named export but tests (or the app) are importing it as default (or vice-versa). Alternatively, a component used by LoginPage (icon, UI component) is undefined due to a wrong import/export. The `Element type is invalid` error almost always points to a missing import/export (default vs named).

## Solution (minimal change)

Inspect `src/pages/LoginPage.tsx` or `src/components/LoginPage/index.tsx` and ensure:

* The component is exported as default at file end: `export default LoginPage;`
* The test imports match the export. If tests expect default export, provide it; if they expect named, ensure named export exists too.

Add both to be safe (conservative, minimal):

```tsx
// src/pages/LoginPage.tsx (or the main Login component file)
const LoginPage: React.FC = () => {
  // ...component code...
};

export { LoginPage };       // named export
export default LoginPage;   // default export for existing imports/tests
```

If LoginPage uses UI components from a single `index` barrel that export changed, ensure those child components are imported correctly (check for `import { Button } from '...'` vs `import Button from '...'`). But in practice adding the default export fixes the immediate `undefined` error.

## Why this fixes the test(s)

* The `Element type is invalid` error should disappear because React will then receive a valid component (not `undefined`) when the test renders `LoginPage` under `AllTheProviders`. This is a minimal, safe change that keeps both named and default import styles working so tests or code that used either will not break. 

---

# 4) ErrorContext / Notifications — remove duplicate nodes

**Failing symptoms:** `ErrorContext logs an error and shows a notification` expects one notification in DOM but receives duplicated nodes and nested span elements (Received length: 3). That indicates Notification component may render the title/message both inside container node **and** as separate nodes, causing test assertion failures. 

## Root cause

Notification rendering probably inserts both a container `div` wrapping `span` children **and** renders title and message elsewhere (maybe returns sibling nodes rather than a single container), causing tests expecting a single notification element to fail.

## Solution (minimal)

Ensure Notification component returns a single root element that contains title and message, and that it **does not** duplicate title and message as standalone elements. For example:

```tsx
// src/contexts/Notification/Notification.tsx (example)
interface NotificationProps {
  id: string;
  title: string;
  message: string;
  onClose?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ id, title, message, onClose }) => {
  return (
    <div data-testid={`notification-${id}`} role="alert">
      <span data-testid="notification-title">{title}</span>
      <span data-testid="notification-message">{message}</span>
      <button onClick={onClose} aria-label="Dismiss">Dismiss</button>
    </div>
  );
};
```

Make sure nothing else renders the same `title` and `message` strings outside that container. If a wrapper previously rendered the title/message as separate nodes (for accessibility or another reason), consolidate to single structure above.

## Why this fixes the tests

* Removing duplicated nodes ensures the test's `expect(received).toHaveLength(1)` (only one notification element) will pass. This is conservative and keeps notification markup semantic and test-friendly. 

---

# Quick checklist (what to edit)

1. `src/services/http.ts` — replace `makeRequest` / `request` bodies with the robust implementation above.
2. `src/services/apiService.ts` — change functions to call `request(...)` and stop assuming `.ok` on raw fetch responses; add `ensureData` guards.
3. `src/pages/LoginPage.tsx` (or wherever the Login component is defined) — ensure both named and default exports are present: `export { LoginPage }; export default LoginPage;`.
4. `src/contexts/Notification/*` or wherever notifications are rendered — ensure a single root DOM node per notification and remove duplicate rendering of title/message.



