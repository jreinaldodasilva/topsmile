# Frontend Failed Tests

## Test Suite: AuthContext

### Test: AuthContext Token Refresh Flow should handle refresh token expiration

**File or class:** AuthContext Token Refresh Flow should handle refresh token expiration

> Error: expect(received).toHaveBeenCalledWith(...expected)

Matcher error: received value must be a mock or spy function

Received has type:  function
Received has value: [Function removeItem]

Ignored nodes: comments, script, style
<html>
  <head />
  <body>
    <div>
      <div>
        <div
          data-testid="auth-status"
        >
          Not Authenticated
        </div>
        <div
          data-testid="loading-status"
        >
          Not Loading
        </div>
        <div
          data-testid="error-message"
        >
          No Error
        </div>
        <div
          data-testid="user-info"
        >
          No User
        </div>
        <button>
          Login
        </button>
        <button>
          Register
        </button>
        <button>
          Logout
        </button>
        <button>
          Clear Error
        </button>
        <button>
          Refresh User Data
        </button>
      </div>
    </div>
  </body>
</html>
    at /home/rebelde/Development/topsmile/src/tests/contexts/AuthContext.test.tsx:569:45
    at runWithExpensiveErrorDiagnosticsDisabled (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:47:12)
    at checkCallback (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:124:77)
    at checkRealTimersCallback (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:118:16)
    at Timeout.task [as _onTimeout] (/home/rebelde/Development/topsmile/node_modules/jsdom/lib/jsdom/browser/Window.js:516:19)
    at listOnTimeout (node:internal/timers:588:17)
    at processTimers (node:internal/timers:523:7)

```
Error: expect(received).toHaveBeenCalledWith(...expected)

Matcher error: received value must be a mock or spy function

Received has type:  function
Received has value: [Function removeItem]

Ignored nodes: comments, script, style
<html>
  <head />
  <body>
    <div>
      <div>
        <div
          data-testid="auth-status"
        >
          Not Authenticated
        </div>
        <div
          data-testid="loading-status"
        >
          Not Loading
        </div>
        <div
          data-testid="error-message"
        >
          No Error
        </div>
        <div
          data-testid="user-info"
        >
          No User
        </div>
        <button>
          Login
        </button>
        <button>
          Register
        </button>
        <button>
          Logout
        </button>
        <button>
          Clear Error
        </button>
        <button>
          Refresh User Data
        </button>
      </div>
    </div>
  </body>
</html>
    at /home/rebelde/Development/topsmile/src/tests/contexts/AuthContext.test.tsx:569:45
    at runWithExpensiveErrorDiagnosticsDisabled (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:47:12)
    at checkCallback (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:124:77)
    at checkRealTimersCallback (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:118:16)
    at Timeout.task [as _onTimeout] (/home/rebelde/Development/topsmile/node_modules/jsdom/lib/jsdom/browser/Window.js:516:19)
    at listOnTimeout (node:internal/timers:588:17)
    at processTimers (node:internal/timers:523:7)
```

### Test: AuthContext Cross-tab Synchronization should sync logout across tabs

**File or class:** AuthContext Cross-tab Synchronization should sync logout across tabs

> Error: expect(element).toHaveTextContent()

Expected element to have text content:
  Not Authenticated
Received:
  Authenticated

Ignored nodes: comments, script, style
<html>
  <head />
  <body>
    <div>
      <div>
        <div
          data-testid="auth-status"
        >
          Authenticated
        </div>
        <div
          data-testid="loading-status"
        >
          Not Loading
        </div>
        <div
          data-testid="error-message"
        >
          No Error
        </div>
        <div
          data-testid="user-info"
        >
          User: Test User (admin)
        </div>
        <button>
          Login
        </button>
        <button>
          Register
        </button>
        <button>
          Logout
        </button>
        <button>
          Clear Error
        </button>
        <button>
          Refresh User Data
        </button>
      </div>
    </div>
  </body>
</html>
    at /home/rebelde/Development/topsmile/src/tests/contexts/AuthContext.test.tsx:614:51
    at runWithExpensiveErrorDiagnosticsDisabled (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:47:12)
    at checkCallback (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:124:77)
    at checkRealTimersCallback (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:118:16)
    at Timeout.task [as _onTimeout] (/home/rebelde/Development/topsmile/node_modules/jsdom/lib/jsdom/browser/Window.js:516:19)
    at listOnTimeout (node:internal/timers:588:17)
    at processTimers (node:internal/timers:523:7)

```
Error: expect(element).toHaveTextContent()

Expected element to have text content:
  Not Authenticated
Received:
  Authenticated

Ignored nodes: comments, script, style
<html>
  <head />
  <body>
    <div>
      <div>
        <div
          data-testid="auth-status"
        >
          Authenticated
        </div>
        <div
          data-testid="loading-status"
        >
          Not Loading
        </div>
        <div
          data-testid="error-message"
        >
          No Error
        </div>
        <div
          data-testid="user-info"
        >
          User: Test User (admin)
        </div>
        <button>
          Login
        </button>
        <button>
          Register
        </button>
        <button>
          Logout
        </button>
        <button>
          Clear Error
        </button>
        <button>
          Refresh User Data
        </button>
      </div>
    </div>
  </body>
</html>
    at /home/rebelde/Development/topsmile/src/tests/contexts/AuthContext.test.tsx:614:51
    at runWithExpensiveErrorDiagnosticsDisabled (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:47:12)
    at checkCallback (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:124:77)
    at checkRealTimersCallback (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:118:16)
    at Timeout.task [as _onTimeout] (/home/rebelde/Development/topsmile/node_modules/jsdom/lib/jsdom/browser/Window.js:516:19)
    at listOnTimeout (node:internal/timers:588:17)
    at processTimers (node:internal/timers:523:7)
```

## Test Suite: Form Validation Real-time

### Test: Form Validation Real-time should validate email in real-time

**File or class:** Form Validation Real-time should validate email in real-time

> Error: Unable to find an element with the text: Email inválido. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value="invalid-email"
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/FormValidation.test.tsx:96:18)

```
Error: Unable to find an element with the text: Email inválido. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value="invalid-email"
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/FormValidation.test.tsx:96:18)
```

### Test: Form Validation Real-time should validate phone format in real-time

**File or class:** Form Validation Real-time should validate phone format in real-time

> Error: Unable to find an element with the text: Formato: (11) 99999-9999. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value="123456789"
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/FormValidation.test.tsx:118:18)

```
Error: Unable to find an element with the text: Formato: (11) 99999-9999. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value="123456789"
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/FormValidation.test.tsx:118:18)
```

### Test: Form Validation Real-time should only show errors after field is touched

**File or class:** Form Validation Real-time should only show errors after field is touched

> Error: Unable to find an element with the text: Nome é obrigatório. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/FormValidation.test.tsx:144:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)

```
Error: Unable to find an element with the text: Nome é obrigatório. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/FormValidation.test.tsx:144:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

### Test: Form Validation Real-time should validate name length requirements

**File or class:** Form Validation Real-time should validate name length requirements

> Error: Unable to find an element with the text: Nome deve ter pelo menos 2 caracteres. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value="A"
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/FormValidation.test.tsx:158:18)

```
Error: Unable to find an element with the text: Nome deve ter pelo menos 2 caracteres. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value="A"
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/FormValidation.test.tsx:158:18)
```

### Test: Form Validation Real-time should handle multiple validation errors

**File or class:** Form Validation Real-time should handle multiple validation errors

> Error: Unable to find an element with the text: Nome deve ter pelo menos 2 caracteres. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--error input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-describedby="email-error"
            aria-invalid="true"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value="invalid"
          />
          <div
            class="input__icons-right"
          >
            <svg
              class="input__error-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clip-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                fill-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p
          class="input__error"
          id="email-error"
          role="alert"
        >
          Email inválido
        </p>
      </div>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--error input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-describedby="phone-error"
            aria-invalid="true"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value="invalid"
          />
          <div
            class="input__icons-right"
          >
            <svg
              class="input__error-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clip-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                fill-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p
          class="input__error"
          id="phone-error"
          role="alert"
        >
          Formato: (11) 99999-9999
        </p>
      </div>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value="A"
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/FormValidation.test.tsx:183:18)

```
Error: Unable to find an element with the text: Nome deve ter pelo menos 2 caracteres. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--error input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-describedby="email-error"
            aria-invalid="true"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value="invalid"
          />
          <div
            class="input__icons-right"
          >
            <svg
              class="input__error-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clip-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                fill-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p
          class="input__error"
          id="email-error"
          role="alert"
        >
          Email inválido
        </p>
      </div>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--error input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-describedby="phone-error"
            aria-invalid="true"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value="invalid"
          />
          <div
            class="input__icons-right"
          >
            <svg
              class="input__error-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clip-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                fill-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p
          class="input__error"
          id="phone-error"
          role="alert"
        >
          Formato: (11) 99999-9999
        </p>
      </div>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value="A"
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/FormValidation.test.tsx:183:18)
```

### Test: Form Validation Real-time should clear errors when valid data is entered

**File or class:** Form Validation Real-time should clear errors when valid data is entered

> Error: Unable to find an element with the text: Email inválido. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value="invalid"
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/FormValidation.test.tsx:199:18)

```
Error: Unable to find an element with the text: Email inválido. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value="invalid"
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/FormValidation.test.tsx:199:18)
```

### Test: Form Validation Real-time should validate email in real-time

**File or class:** Form Validation Real-time should validate email in real-time

> Error: Unable to find an element with the text: Email inválido. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value="invalid-email"
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/Form/FormValidation.test.tsx:97:18)

```
Error: Unable to find an element with the text: Email inválido. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value="invalid-email"
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/Form/FormValidation.test.tsx:97:18)
```

### Test: Form Validation Real-time should validate phone format in real-time

**File or class:** Form Validation Real-time should validate phone format in real-time

> Error: Unable to find an element with the text: Formato: (11) 99999-9999. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value="123456789"
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/Form/FormValidation.test.tsx:119:18)

```
Error: Unable to find an element with the text: Formato: (11) 99999-9999. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value="123456789"
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/Form/FormValidation.test.tsx:119:18)
```

### Test: Form Validation Real-time should only show errors after field is touched

**File or class:** Form Validation Real-time should only show errors after field is touched

> Error: Unable to find an element with the text: Nome é obrigatório. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/Form/FormValidation.test.tsx:145:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)

```
Error: Unable to find an element with the text: Nome é obrigatório. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <form>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="email"
        >
          Email
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="email"
            name="email"
            type="email"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="phone"
        >
          Telefone
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="phone"
            name="phone"
            type="tel"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
      <div
        class="input-group input-group--default input-group--md input-group--focused input-group--has-value"
        data-testid="input-group"
      >
        <label
          class="input__label"
          for="name"
        >
          Nome
        </label>
        <div
          class="input__container"
        >
          <input
            aria-invalid="false"
            class="input__field"
            id="name"
            name="name"
            type="text"
            value=""
          />
          <div
            class="input__icons-right"
          />
        </div>
      </div>
    </form>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/UI/Form/FormValidation.test.tsx:145:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

## Test Suite: PatientAppointmentBooking

### Test: PatientAppointmentBooking fetches and displays providers and appointment types

**File or class:** PatientAppointmentBooking fetches and displays providers and appointment types

> Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="appointment-booking"
    >
      <div
        class="booking-loading"
      >
        <p>
          Erro ao carregar dados. Tente novamente mais tarde.
        </p>
      </div>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/pages/Patient/Appointment/PatientAppointmentBooking.test.tsx:67:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at processTimers (node:internal/timers:523:7)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)

```
Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="appointment-booking"
    >
      <div
        class="booking-loading"
      >
        <p>
          Erro ao carregar dados. Tente novamente mais tarde.
        </p>
      </div>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/pages/Patient/Appointment/PatientAppointmentBooking.test.tsx:67:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at processTimers (node:internal/timers:523:7)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

### Test: PatientAppointmentBooking fetches and displays available time slots

**File or class:** PatientAppointmentBooking fetches and displays available time slots

> Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="appointment-booking"
    >
      <div
        class="booking-loading"
      >
        <p>
          Erro ao carregar dados. Tente novamente mais tarde.
        </p>
      </div>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at findByText (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:86:33)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/pages/Patient/Appointment/PatientAppointmentBooking.test.tsx:75:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)

```
Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="appointment-booking"
    >
      <div
        class="booking-loading"
      >
        <p>
          Erro ao carregar dados. Tente novamente mais tarde.
        </p>
      </div>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at findByText (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:86:33)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/pages/Patient/Appointment/PatientAppointmentBooking.test.tsx:75:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

### Test: PatientAppointmentBooking allows booking an appointment

**File or class:** PatientAppointmentBooking allows booking an appointment

> Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="appointment-booking"
    >
      <div
        class="booking-loading"
      >
        <p>
          Erro ao carregar dados. Tente novamente mais tarde.
        </p>
      </div>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at findByText (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:86:33)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/pages/Patient/Appointment/PatientAppointmentBooking.test.tsx:86:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)

```
Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="appointment-booking"
    >
      <div
        class="booking-loading"
      >
        <p>
          Erro ao carregar dados. Tente novamente mais tarde.
        </p>
      </div>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at findByText (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:86:33)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/pages/Patient/Appointment/PatientAppointmentBooking.test.tsx:86:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

### Test: PatientAppointmentBooking shows an error message if booking fails

**File or class:** PatientAppointmentBooking shows an error message if booking fails

> Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="appointment-booking"
    >
      <div
        class="booking-loading"
      >
        <p>
          Erro ao carregar dados. Tente novamente mais tarde.
        </p>
      </div>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at findByText (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:86:33)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/pages/Patient/Appointment/PatientAppointmentBooking.test.tsx:106:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)

```
Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="appointment-booking"
    >
      <div
        class="booking-loading"
      >
        <p>
          Erro ao carregar dados. Tente novamente mais tarde.
        </p>
      </div>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at findByText (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:86:33)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/pages/Patient/Appointment/PatientAppointmentBooking.test.tsx:106:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

## Test Suite: PatientManagement

### Test: PatientManagement renders patient management title

**File or class:** PatientManagement renders patient management title

> TestingLibraryElementError: Unable to find an element with the text: /Gerenciamento de Pacientes/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="patient-management-page"
    >
      <a
        class="skip-link"
        href="#main-content"
      >
        Pular para conteúdo principal
      </a>
      <header
        class="header"
        role="banner"
      >
        <div
          class="container"
        >
          <a
            class="skip-link"
            href="#main-content"
          >
            Pular para conteúdo principal
          </a>
          <a
            class="skip-link"
            href="#main-navigation"
          >
            Pular para navegação principal
          </a>
          <div
            class="header__logo"
          >
            <a
              aria-label="TopSmile - Página inicial"
              class="header__logo-link"
              href="/"
            >
              <img
                alt="TopSmile"
                class="header__logo-img"
                src="/src/assets/images/icon-192x192.png"
              />
              <span
                class="header__logo-text"
              >
                TopSmile
              </span>
            </a>
          </div>
          <nav
            aria-label="Navegação principal"
            class="header__nav hide-mobile"
            id="main-navigation"
            role="navigation"
          >
            <ul
              class="header__nav-list"
            >
              <li
                class="header__nav-item"
              >
                <a
                  aria-current="page"
                  class="header__nav-link header__nav-link--active"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/features"
                >
                  Benefícios
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/pricing"
                >
                  Preços
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/contact"
                >
                  Contato
                </a>
              </li>
            </ul>
          </nav>
          <div
            class="header__actions"
          >
            <div
              class="header__auth-buttons hide-mobile"
            >
              <a
                href="/login"
              >
                <button
                  aria-busy="false"
                  class="btn btn--ghost btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Entrar
                  </span>
                </button>
              </a>
              <a
                href="/register"
              >
                <button
                  aria-busy="false"
                  class="btn btn--primary btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Começar
                  </span>
                </button>
              </a>
            </div>
            <button
              aria-controls="mobile-menu"
              aria-expanded="false"
              aria-label="Menu de navegação"
              class="header__mobile-menu-button show-mobile"
            >
              <svg
                class="header__menu-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main
        class="patient-management-main"
      >
        <div
          class="container"
        >
          <div
            class="loading-container"
          >
            <div
              class="loading-spinner"
            >
              Carregando pacientes...
            </div>
          </div>
        </div>
      </main>
      <footer
        class="footer"
        id="footer"
      >
        <div
          class="footer-container"
        >
          <div
            class="footer-brand"
          >
            <h2>
              TopSmile
            </h2>
            <p>
              Conectando você à saúde de forma simples, rápida e segura.
            </p>
          </div>
          <div
            class="footer-links"
          >
            <a
              href="#hero"
            >
              Início
            </a>
            <a
              href="#features"
            >
              Recursos
            </a>
            <a
              href="#pricing"
            >
              Preços
            </a>
            <a
              href="#contact"
            >
              Contato
            </a>
          </div>
        </div>
        <div
          class="footer-bottom"
        >
          <p>
            © 
            2025
             TopSmile. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  </div>
</body>
    at Object.getElementError (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:37:19)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
    at getByText (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:95:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/PatientManagement.test.tsx:9:19)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)

```
TestingLibraryElementError: Unable to find an element with the text: /Gerenciamento de Pacientes/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="patient-management-page"
    >
      <a
        class="skip-link"
        href="#main-content"
      >
        Pular para conteúdo principal
      </a>
      <header
        class="header"
        role="banner"
      >
        <div
          class="container"
        >
          <a
            class="skip-link"
            href="#main-content"
          >
            Pular para conteúdo principal
          </a>
          <a
            class="skip-link"
            href="#main-navigation"
          >
            Pular para navegação principal
          </a>
          <div
            class="header__logo"
          >
            <a
              aria-label="TopSmile - Página inicial"
              class="header__logo-link"
              href="/"
            >
              <img
                alt="TopSmile"
                class="header__logo-img"
                src="/src/assets/images/icon-192x192.png"
              />
              <span
                class="header__logo-text"
              >
                TopSmile
              </span>
            </a>
          </div>
          <nav
            aria-label="Navegação principal"
            class="header__nav hide-mobile"
            id="main-navigation"
            role="navigation"
          >
            <ul
              class="header__nav-list"
            >
              <li
                class="header__nav-item"
              >
                <a
                  aria-current="page"
                  class="header__nav-link header__nav-link--active"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/features"
                >
                  Benefícios
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/pricing"
                >
                  Preços
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/contact"
                >
                  Contato
                </a>
              </li>
            </ul>
          </nav>
          <div
            class="header__actions"
          >
            <div
              class="header__auth-buttons hide-mobile"
            >
              <a
                href="/login"
              >
                <button
                  aria-busy="false"
                  class="btn btn--ghost btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Entrar
                  </span>
                </button>
              </a>
              <a
                href="/register"
              >
                <button
                  aria-busy="false"
                  class="btn btn--primary btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Começar
                  </span>
                </button>
              </a>
            </div>
            <button
              aria-controls="mobile-menu"
              aria-expanded="false"
              aria-label="Menu de navegação"
              class="header__mobile-menu-button show-mobile"
            >
              <svg
                class="header__menu-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main
        class="patient-management-main"
      >
        <div
          class="container"
        >
          <div
            class="loading-container"
          >
            <div
              class="loading-spinner"
            >
              Carregando pacientes...
            </div>
          </div>
        </div>
      </main>
      <footer
        class="footer"
        id="footer"
      >
        <div
          class="footer-container"
        >
          <div
            class="footer-brand"
          >
            <h2>
              TopSmile
            </h2>
            <p>
              Conectando você à saúde de forma simples, rápida e segura.
            </p>
          </div>
          <div
            class="footer-links"
          >
            <a
              href="#hero"
            >
              Início
            </a>
            <a
              href="#features"
            >
              Recursos
            </a>
            <a
              href="#pricing"
            >
              Preços
            </a>
            <a
              href="#contact"
            >
              Contato
            </a>
          </div>
        </div>
        <div
          class="footer-bottom"
        >
          <p>
            © 
            2025
             TopSmile. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  </div>
</body>
    at Object.getElementError (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:37:19)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
    at getByText (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:95:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/PatientManagement.test.tsx:9:19)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

### Test: PatientManagement renders patient list after loading

**File or class:** PatientManagement renders patient list after loading

> Error: Unable to find an element with the text: /Nenhum paciente encontrado/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="patient-management-page"
    >
      <a
        class="skip-link"
        href="#main-content"
      >
        Pular para conteúdo principal
      </a>
      <header
        class="header"
        role="banner"
      >
        <div
          class="container"
        >
          <a
            class="skip-link"
            href="#main-content"
          >
            Pular para conteúdo principal
          </a>
          <a
            class="skip-link"
            href="#main-navigation"
          >
            Pular para navegação principal
          </a>
          <div
            class="header__logo"
          >
            <a
              aria-label="TopSmile - Página inicial"
              class="header__logo-link"
              href="/"
            >
              <img
                alt="TopSmile"
                class="header__logo-img"
                src="/src/assets/images/icon-192x192.png"
              />
              <span
                class="header__logo-text"
              >
                TopSmile
              </span>
            </a>
          </div>
          <nav
            aria-label="Navegação principal"
            class="header__nav hide-mobile"
            id="main-navigation"
            role="navigation"
          >
            <ul
              class="header__nav-list"
            >
              <li
                class="header__nav-item"
              >
                <a
                  aria-current="page"
                  class="header__nav-link header__nav-link--active"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/features"
                >
                  Benefícios
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/pricing"
                >
                  Preços
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/contact"
                >
                  Contato
                </a>
              </li>
            </ul>
          </nav>
          <div
            class="header__actions"
          >
            <div
              class="header__auth-buttons hide-mobile"
            >
              <a
                href="/login"
              >
                <button
                  aria-busy="false"
                  class="btn btn--ghost btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Entrar
                  </span>
                </button>
              </a>
              <a
                href="/register"
              >
                <button
                  aria-busy="false"
                  class="btn btn--primary btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Começar
                  </span>
                </button>
              </a>
            </div>
            <button
              aria-controls="mobile-menu"
              aria-expanded="false"
              aria-label="Menu de navegação"
              class="header__mobile-menu-button show-mobile"
            >
              <svg
                class="header__menu-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main
        class="patient-management-main"
      >
        <div
          class="container"
        >
          <div
            class="loading-container"
          >
            <div
              class="loading-spinner"
            >
              Carregando pacientes...
            </div>
          </div>
        </div>
      </main>
      <footer
        class="footer"
        id="footer"
      >
        <div
          class="footer-container"
        >
          <div
            class="footer-brand"
          >
            <h2>
              TopSmile
            </h2>
            <p>
              Conectando você à saúde de forma simples, rápida e segura.
            </p>
          </div>
          <div
            class="footer-links"
          >
            <a
              href="#hero"
            >
              Início
            </a>
            <a
              href="#features"
            >
              Recursos
            </a>
            <a
              href="#pricing"
            >
              Preços
            </a>
            <a
              href="#contact"
            >
              Contato
            </a>
          </div>
        </div>
        <div
          class="footer-bottom"
        >
          <p>
            © 
            2025
             TopSmile. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/PatientManagement.test.tsx:20:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)

```
Error: Unable to find an element with the text: /Nenhum paciente encontrado/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="patient-management-page"
    >
      <a
        class="skip-link"
        href="#main-content"
      >
        Pular para conteúdo principal
      </a>
      <header
        class="header"
        role="banner"
      >
        <div
          class="container"
        >
          <a
            class="skip-link"
            href="#main-content"
          >
            Pular para conteúdo principal
          </a>
          <a
            class="skip-link"
            href="#main-navigation"
          >
            Pular para navegação principal
          </a>
          <div
            class="header__logo"
          >
            <a
              aria-label="TopSmile - Página inicial"
              class="header__logo-link"
              href="/"
            >
              <img
                alt="TopSmile"
                class="header__logo-img"
                src="/src/assets/images/icon-192x192.png"
              />
              <span
                class="header__logo-text"
              >
                TopSmile
              </span>
            </a>
          </div>
          <nav
            aria-label="Navegação principal"
            class="header__nav hide-mobile"
            id="main-navigation"
            role="navigation"
          >
            <ul
              class="header__nav-list"
            >
              <li
                class="header__nav-item"
              >
                <a
                  aria-current="page"
                  class="header__nav-link header__nav-link--active"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/features"
                >
                  Benefícios
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/pricing"
                >
                  Preços
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/contact"
                >
                  Contato
                </a>
              </li>
            </ul>
          </nav>
          <div
            class="header__actions"
          >
            <div
              class="header__auth-buttons hide-mobile"
            >
              <a
                href="/login"
              >
                <button
                  aria-busy="false"
                  class="btn btn--ghost btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Entrar
                  </span>
                </button>
              </a>
              <a
                href="/register"
              >
                <button
                  aria-busy="false"
                  class="btn btn--primary btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Começar
                  </span>
                </button>
              </a>
            </div>
            <button
              aria-controls="mobile-menu"
              aria-expanded="false"
              aria-label="Menu de navegação"
              class="header__mobile-menu-button show-mobile"
            >
              <svg
                class="header__menu-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main
        class="patient-management-main"
      >
        <div
          class="container"
        >
          <div
            class="loading-container"
          >
            <div
              class="loading-spinner"
            >
              Carregando pacientes...
            </div>
          </div>
        </div>
      </main>
      <footer
        class="footer"
        id="footer"
      >
        <div
          class="footer-container"
        >
          <div
            class="footer-brand"
          >
            <h2>
              TopSmile
            </h2>
            <p>
              Conectando você à saúde de forma simples, rápida e segura.
            </p>
          </div>
          <div
            class="footer-links"
          >
            <a
              href="#hero"
            >
              Início
            </a>
            <a
              href="#features"
            >
              Recursos
            </a>
            <a
              href="#pricing"
            >
              Preços
            </a>
            <a
              href="#contact"
            >
              Contato
            </a>
          </div>
        </div>
        <div
          class="footer-bottom"
        >
          <p>
            © 
            2025
             TopSmile. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/PatientManagement.test.tsx:20:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

### Test: PatientManagement renders add patient button

**File or class:** PatientManagement renders add patient button

> Error: Unable to find role="button" and name `/Novo Paciente/i`

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="patient-management-page"
    >
      <a
        class="skip-link"
        href="#main-content"
      >
        Pular para conteúdo principal
      </a>
      <header
        class="header"
        role="banner"
      >
        <div
          class="container"
        >
          <a
            class="skip-link"
            href="#main-content"
          >
            Pular para conteúdo principal
          </a>
          <a
            class="skip-link"
            href="#main-navigation"
          >
            Pular para navegação principal
          </a>
          <div
            class="header__logo"
          >
            <a
              aria-label="TopSmile - Página inicial"
              class="header__logo-link"
              href="/"
            >
              <img
                alt="TopSmile"
                class="header__logo-img"
                src="/src/assets/images/icon-192x192.png"
              />
              <span
                class="header__logo-text"
              >
                TopSmile
              </span>
            </a>
          </div>
          <nav
            aria-label="Navegação principal"
            class="header__nav hide-mobile"
            id="main-navigation"
            role="navigation"
          >
            <ul
              class="header__nav-list"
            >
              <li
                class="header__nav-item"
              >
                <a
                  aria-current="page"
                  class="header__nav-link header__nav-link--active"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/features"
                >
                  Benefícios
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/pricing"
                >
                  Preços
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/contact"
                >
                  Contato
                </a>
              </li>
            </ul>
          </nav>
          <div
            class="header__actions"
          >
            <div
              class="header__auth-buttons hide-mobile"
            >
              <a
                href="/login"
              >
                <button
                  aria-busy="false"
                  class="btn btn--ghost btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Entrar
                  </span>
                </button>
              </a>
              <a
                href="/register"
              >
                <button
                  aria-busy="false"
                  class="btn btn--primary btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Começar
                  </span>
                </button>
              </a>
            </div>
            <button
              aria-controls="mobile-menu"
              aria-expanded="false"
              aria-label="Menu de navegação"
              class="header__mobile-menu-button show-mobile"
            >
              <svg
                class="header__menu-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main
        class="patient-management-main"
      >
        <div
          class="container"
        >
          <div
            class="loading-container"
          >
            <div
              class="loading-spinner"
            >
              Carregando pacientes...
            </div>
          </div>
        </div>
      </main>
      <footer
        class="footer"
        id="footer"
      >
        <div
          class="footer-container"
        >
          <div
            class="footer-brand"
          >
            <h2>
              TopSmile
            </h2>
            <p>
              Conectando você à saúde de forma simples, rápida e segura.
            </p>
          </div>
          <div
            class="footer-links"
          >
            <a
              href="#hero"
            >
              Início
            </a>
            <a
              href="#features"
            >
              Recursos
            </a>
            <a
              href="#pricing"
            >
              Preços
            </a>
            <a
              href="#contact"
            >
              Contato
            </a>
          </div>
        </div>
        <div
          class="footer-bottom"
        >
          <p>
            © 
            2025
             TopSmile. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/PatientManagement.test.tsx:28:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)

```
Error: Unable to find role="button" and name `/Novo Paciente/i`

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="patient-management-page"
    >
      <a
        class="skip-link"
        href="#main-content"
      >
        Pular para conteúdo principal
      </a>
      <header
        class="header"
        role="banner"
      >
        <div
          class="container"
        >
          <a
            class="skip-link"
            href="#main-content"
          >
            Pular para conteúdo principal
          </a>
          <a
            class="skip-link"
            href="#main-navigation"
          >
            Pular para navegação principal
          </a>
          <div
            class="header__logo"
          >
            <a
              aria-label="TopSmile - Página inicial"
              class="header__logo-link"
              href="/"
            >
              <img
                alt="TopSmile"
                class="header__logo-img"
                src="/src/assets/images/icon-192x192.png"
              />
              <span
                class="header__logo-text"
              >
                TopSmile
              </span>
            </a>
          </div>
          <nav
            aria-label="Navegação principal"
            class="header__nav hide-mobile"
            id="main-navigation"
            role="navigation"
          >
            <ul
              class="header__nav-list"
            >
              <li
                class="header__nav-item"
              >
                <a
                  aria-current="page"
                  class="header__nav-link header__nav-link--active"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/features"
                >
                  Benefícios
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/pricing"
                >
                  Preços
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/contact"
                >
                  Contato
                </a>
              </li>
            </ul>
          </nav>
          <div
            class="header__actions"
          >
            <div
              class="header__auth-buttons hide-mobile"
            >
              <a
                href="/login"
              >
                <button
                  aria-busy="false"
                  class="btn btn--ghost btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Entrar
                  </span>
                </button>
              </a>
              <a
                href="/register"
              >
                <button
                  aria-busy="false"
                  class="btn btn--primary btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Começar
                  </span>
                </button>
              </a>
            </div>
            <button
              aria-controls="mobile-menu"
              aria-expanded="false"
              aria-label="Menu de navegação"
              class="header__mobile-menu-button show-mobile"
            >
              <svg
                class="header__menu-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main
        class="patient-management-main"
      >
        <div
          class="container"
        >
          <div
            class="loading-container"
          >
            <div
              class="loading-spinner"
            >
              Carregando pacientes...
            </div>
          </div>
        </div>
      </main>
      <footer
        class="footer"
        id="footer"
      >
        <div
          class="footer-container"
        >
          <div
            class="footer-brand"
          >
            <h2>
              TopSmile
            </h2>
            <p>
              Conectando você à saúde de forma simples, rápida e segura.
            </p>
          </div>
          <div
            class="footer-links"
          >
            <a
              href="#hero"
            >
              Início
            </a>
            <a
              href="#features"
            >
              Recursos
            </a>
            <a
              href="#pricing"
            >
              Preços
            </a>
            <a
              href="#contact"
            >
              Contato
            </a>
          </div>
        </div>
        <div
          class="footer-bottom"
        >
          <p>
            © 
            2025
             TopSmile. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/PatientManagement.test.tsx:28:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

## Test Suite: ProviderManagement

### Test: ProviderManagement renders provider management title

**File or class:** ProviderManagement renders provider management title

> TestingLibraryElementError: Unable to find an element with the text: /Gestão de Profissionais/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="provider-management-page"
    >
      <a
        class="skip-link"
        href="#main-content"
      >
        Pular para conteúdo principal
      </a>
      <header
        class="header"
        role="banner"
      >
        <div
          class="container"
        >
          <a
            class="skip-link"
            href="#main-content"
          >
            Pular para conteúdo principal
          </a>
          <a
            class="skip-link"
            href="#main-navigation"
          >
            Pular para navegação principal
          </a>
          <div
            class="header__logo"
          >
            <a
              aria-label="TopSmile - Página inicial"
              class="header__logo-link"
              href="/"
            >
              <img
                alt="TopSmile"
                class="header__logo-img"
                src="/src/assets/images/icon-192x192.png"
              />
              <span
                class="header__logo-text"
              >
                TopSmile
              </span>
            </a>
          </div>
          <nav
            aria-label="Navegação principal"
            class="header__nav hide-mobile"
            id="main-navigation"
            role="navigation"
          >
            <ul
              class="header__nav-list"
            >
              <li
                class="header__nav-item"
              >
                <a
                  aria-current="page"
                  class="header__nav-link header__nav-link--active"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/features"
                >
                  Benefícios
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/pricing"
                >
                  Preços
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/contact"
                >
                  Contato
                </a>
              </li>
            </ul>
          </nav>
          <div
            class="header__actions"
          >
            <div
              class="header__auth-buttons hide-mobile"
            >
              <a
                href="/login"
              >
                <button
                  aria-busy="false"
                  class="btn btn--ghost btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Entrar
                  </span>
                </button>
              </a>
              <a
                href="/register"
              >
                <button
                  aria-busy="false"
                  class="btn btn--primary btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Começar
                  </span>
                </button>
              </a>
            </div>
            <button
              aria-controls="mobile-menu"
              aria-expanded="false"
              aria-label="Menu de navegação"
              class="header__mobile-menu-button show-mobile"
            >
              <svg
                class="header__menu-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main
        class="provider-management-main"
      >
        <div
          class="container"
        >
          <div
            class="loading-container"
          >
            <div
              class="loading-spinner"
            >
              Carregando profissionais...
            </div>
          </div>
        </div>
      </main>
      <footer
        class="footer"
        id="footer"
      >
        <div
          class="footer-container"
        >
          <div
            class="footer-brand"
          >
            <h2>
              TopSmile
            </h2>
            <p>
              Conectando você à saúde de forma simples, rápida e segura.
            </p>
          </div>
          <div
            class="footer-links"
          >
            <a
              href="#hero"
            >
              Início
            </a>
            <a
              href="#features"
            >
              Recursos
            </a>
            <a
              href="#pricing"
            >
              Preços
            </a>
            <a
              href="#contact"
            >
              Contato
            </a>
          </div>
        </div>
        <div
          class="footer-bottom"
        >
          <p>
            © 
            2025
             TopSmile. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  </div>
</body>
    at Object.getElementError (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:37:19)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
    at getByText (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:95:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/ProviderManagement.test.tsx:9:19)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)

```
TestingLibraryElementError: Unable to find an element with the text: /Gestão de Profissionais/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="provider-management-page"
    >
      <a
        class="skip-link"
        href="#main-content"
      >
        Pular para conteúdo principal
      </a>
      <header
        class="header"
        role="banner"
      >
        <div
          class="container"
        >
          <a
            class="skip-link"
            href="#main-content"
          >
            Pular para conteúdo principal
          </a>
          <a
            class="skip-link"
            href="#main-navigation"
          >
            Pular para navegação principal
          </a>
          <div
            class="header__logo"
          >
            <a
              aria-label="TopSmile - Página inicial"
              class="header__logo-link"
              href="/"
            >
              <img
                alt="TopSmile"
                class="header__logo-img"
                src="/src/assets/images/icon-192x192.png"
              />
              <span
                class="header__logo-text"
              >
                TopSmile
              </span>
            </a>
          </div>
          <nav
            aria-label="Navegação principal"
            class="header__nav hide-mobile"
            id="main-navigation"
            role="navigation"
          >
            <ul
              class="header__nav-list"
            >
              <li
                class="header__nav-item"
              >
                <a
                  aria-current="page"
                  class="header__nav-link header__nav-link--active"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/features"
                >
                  Benefícios
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/pricing"
                >
                  Preços
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/contact"
                >
                  Contato
                </a>
              </li>
            </ul>
          </nav>
          <div
            class="header__actions"
          >
            <div
              class="header__auth-buttons hide-mobile"
            >
              <a
                href="/login"
              >
                <button
                  aria-busy="false"
                  class="btn btn--ghost btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Entrar
                  </span>
                </button>
              </a>
              <a
                href="/register"
              >
                <button
                  aria-busy="false"
                  class="btn btn--primary btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Começar
                  </span>
                </button>
              </a>
            </div>
            <button
              aria-controls="mobile-menu"
              aria-expanded="false"
              aria-label="Menu de navegação"
              class="header__mobile-menu-button show-mobile"
            >
              <svg
                class="header__menu-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main
        class="provider-management-main"
      >
        <div
          class="container"
        >
          <div
            class="loading-container"
          >
            <div
              class="loading-spinner"
            >
              Carregando profissionais...
            </div>
          </div>
        </div>
      </main>
      <footer
        class="footer"
        id="footer"
      >
        <div
          class="footer-container"
        >
          <div
            class="footer-brand"
          >
            <h2>
              TopSmile
            </h2>
            <p>
              Conectando você à saúde de forma simples, rápida e segura.
            </p>
          </div>
          <div
            class="footer-links"
          >
            <a
              href="#hero"
            >
              Início
            </a>
            <a
              href="#features"
            >
              Recursos
            </a>
            <a
              href="#pricing"
            >
              Preços
            </a>
            <a
              href="#contact"
            >
              Contato
            </a>
          </div>
        </div>
        <div
          class="footer-bottom"
        >
          <p>
            © 
            2025
             TopSmile. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  </div>
</body>
    at Object.getElementError (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:37:19)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
    at getByText (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:95:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/ProviderManagement.test.tsx:9:19)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

### Test: ProviderManagement renders provider list after loading

**File or class:** ProviderManagement renders provider list after loading

> Error: Unable to find an element with the text: /Nenhum profissional encontrado/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="provider-management-page"
    >
      <a
        class="skip-link"
        href="#main-content"
      >
        Pular para conteúdo principal
      </a>
      <header
        class="header"
        role="banner"
      >
        <div
          class="container"
        >
          <a
            class="skip-link"
            href="#main-content"
          >
            Pular para conteúdo principal
          </a>
          <a
            class="skip-link"
            href="#main-navigation"
          >
            Pular para navegação principal
          </a>
          <div
            class="header__logo"
          >
            <a
              aria-label="TopSmile - Página inicial"
              class="header__logo-link"
              href="/"
            >
              <img
                alt="TopSmile"
                class="header__logo-img"
                src="/src/assets/images/icon-192x192.png"
              />
              <span
                class="header__logo-text"
              >
                TopSmile
              </span>
            </a>
          </div>
          <nav
            aria-label="Navegação principal"
            class="header__nav hide-mobile"
            id="main-navigation"
            role="navigation"
          >
            <ul
              class="header__nav-list"
            >
              <li
                class="header__nav-item"
              >
                <a
                  aria-current="page"
                  class="header__nav-link header__nav-link--active"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/features"
                >
                  Benefícios
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/pricing"
                >
                  Preços
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/contact"
                >
                  Contato
                </a>
              </li>
            </ul>
          </nav>
          <div
            class="header__actions"
          >
            <div
              class="header__auth-buttons hide-mobile"
            >
              <a
                href="/login"
              >
                <button
                  aria-busy="false"
                  class="btn btn--ghost btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Entrar
                  </span>
                </button>
              </a>
              <a
                href="/register"
              >
                <button
                  aria-busy="false"
                  class="btn btn--primary btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Começar
                  </span>
                </button>
              </a>
            </div>
            <button
              aria-controls="mobile-menu"
              aria-expanded="false"
              aria-label="Menu de navegação"
              class="header__mobile-menu-button show-mobile"
            >
              <svg
                class="header__menu-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main
        class="provider-management-main"
      >
        <div
          class="container"
        >
          <div
            class="loading-container"
          >
            <div
              class="loading-spinner"
            >
              Carregando profissionais...
            </div>
          </div>
        </div>
      </main>
      <footer
        class="footer"
        id="footer"
      >
        <div
          class="footer-container"
        >
          <div
            class="footer-brand"
          >
            <h2>
              TopSmile
            </h2>
            <p>
              Conectando você à saúde de forma simples, rápida e segura.
            </p>
          </div>
          <div
            class="footer-links"
          >
            <a
              href="#hero"
            >
              Início
            </a>
            <a
              href="#features"
            >
              Recursos
            </a>
            <a
              href="#pricing"
            >
              Preços
            </a>
            <a
              href="#contact"
            >
              Contato
            </a>
          </div>
        </div>
        <div
          class="footer-bottom"
        >
          <p>
            © 
            2025
             TopSmile. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/ProviderManagement.test.tsx:20:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)

```
Error: Unable to find an element with the text: /Nenhum profissional encontrado/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="provider-management-page"
    >
      <a
        class="skip-link"
        href="#main-content"
      >
        Pular para conteúdo principal
      </a>
      <header
        class="header"
        role="banner"
      >
        <div
          class="container"
        >
          <a
            class="skip-link"
            href="#main-content"
          >
            Pular para conteúdo principal
          </a>
          <a
            class="skip-link"
            href="#main-navigation"
          >
            Pular para navegação principal
          </a>
          <div
            class="header__logo"
          >
            <a
              aria-label="TopSmile - Página inicial"
              class="header__logo-link"
              href="/"
            >
              <img
                alt="TopSmile"
                class="header__logo-img"
                src="/src/assets/images/icon-192x192.png"
              />
              <span
                class="header__logo-text"
              >
                TopSmile
              </span>
            </a>
          </div>
          <nav
            aria-label="Navegação principal"
            class="header__nav hide-mobile"
            id="main-navigation"
            role="navigation"
          >
            <ul
              class="header__nav-list"
            >
              <li
                class="header__nav-item"
              >
                <a
                  aria-current="page"
                  class="header__nav-link header__nav-link--active"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/features"
                >
                  Benefícios
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/pricing"
                >
                  Preços
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/contact"
                >
                  Contato
                </a>
              </li>
            </ul>
          </nav>
          <div
            class="header__actions"
          >
            <div
              class="header__auth-buttons hide-mobile"
            >
              <a
                href="/login"
              >
                <button
                  aria-busy="false"
                  class="btn btn--ghost btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Entrar
                  </span>
                </button>
              </a>
              <a
                href="/register"
              >
                <button
                  aria-busy="false"
                  class="btn btn--primary btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Começar
                  </span>
                </button>
              </a>
            </div>
            <button
              aria-controls="mobile-menu"
              aria-expanded="false"
              aria-label="Menu de navegação"
              class="header__mobile-menu-button show-mobile"
            >
              <svg
                class="header__menu-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main
        class="provider-management-main"
      >
        <div
          class="container"
        >
          <div
            class="loading-container"
          >
            <div
              class="loading-spinner"
            >
              Carregando profissionais...
            </div>
          </div>
        </div>
      </main>
      <footer
        class="footer"
        id="footer"
      >
        <div
          class="footer-container"
        >
          <div
            class="footer-brand"
          >
            <h2>
              TopSmile
            </h2>
            <p>
              Conectando você à saúde de forma simples, rápida e segura.
            </p>
          </div>
          <div
            class="footer-links"
          >
            <a
              href="#hero"
            >
              Início
            </a>
            <a
              href="#features"
            >
              Recursos
            </a>
            <a
              href="#pricing"
            >
              Preços
            </a>
            <a
              href="#contact"
            >
              Contato
            </a>
          </div>
        </div>
        <div
          class="footer-bottom"
        >
          <p>
            © 
            2025
             TopSmile. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/ProviderManagement.test.tsx:20:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

### Test: ProviderManagement renders add provider button

**File or class:** ProviderManagement renders add provider button

> Error: Unable to find role="button" and name `/Novo Profissional/i`

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="provider-management-page"
    >
      <a
        class="skip-link"
        href="#main-content"
      >
        Pular para conteúdo principal
      </a>
      <header
        class="header"
        role="banner"
      >
        <div
          class="container"
        >
          <a
            class="skip-link"
            href="#main-content"
          >
            Pular para conteúdo principal
          </a>
          <a
            class="skip-link"
            href="#main-navigation"
          >
            Pular para navegação principal
          </a>
          <div
            class="header__logo"
          >
            <a
              aria-label="TopSmile - Página inicial"
              class="header__logo-link"
              href="/"
            >
              <img
                alt="TopSmile"
                class="header__logo-img"
                src="/src/assets/images/icon-192x192.png"
              />
              <span
                class="header__logo-text"
              >
                TopSmile
              </span>
            </a>
          </div>
          <nav
            aria-label="Navegação principal"
            class="header__nav hide-mobile"
            id="main-navigation"
            role="navigation"
          >
            <ul
              class="header__nav-list"
            >
              <li
                class="header__nav-item"
              >
                <a
                  aria-current="page"
                  class="header__nav-link header__nav-link--active"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/features"
                >
                  Benefícios
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/pricing"
                >
                  Preços
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/contact"
                >
                  Contato
                </a>
              </li>
            </ul>
          </nav>
          <div
            class="header__actions"
          >
            <div
              class="header__auth-buttons hide-mobile"
            >
              <a
                href="/login"
              >
                <button
                  aria-busy="false"
                  class="btn btn--ghost btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Entrar
                  </span>
                </button>
              </a>
              <a
                href="/register"
              >
                <button
                  aria-busy="false"
                  class="btn btn--primary btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Começar
                  </span>
                </button>
              </a>
            </div>
            <button
              aria-controls="mobile-menu"
              aria-expanded="false"
              aria-label="Menu de navegação"
              class="header__mobile-menu-button show-mobile"
            >
              <svg
                class="header__menu-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main
        class="provider-management-main"
      >
        <div
          class="container"
        >
          <div
            class="loading-container"
          >
            <div
              class="loading-spinner"
            >
              Carregando profissionais...
            </div>
          </div>
        </div>
      </main>
      <footer
        class="footer"
        id="footer"
      >
        <div
          class="footer-container"
        >
          <div
            class="footer-brand"
          >
            <h2>
              TopSmile
            </h2>
            <p>
              Conectando você à saúde de forma simples, rápida e segura.
            </p>
          </div>
          <div
            class="footer-links"
          >
            <a
              href="#hero"
            >
              Início
            </a>
            <a
              href="#features"
            >
              Recursos
            </a>
            <a
              href="#pricing"
            >
              Preços
            </a>
            <a
              href="#contact"
            >
              Contato
            </a>
          </div>
        </div>
        <div
          class="footer-bottom"
        >
          <p>
            © 
            2025
             TopSmile. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/ProviderManagement.test.tsx:28:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)

```
Error: Unable to find role="button" and name `/Novo Profissional/i`

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="provider-management-page"
    >
      <a
        class="skip-link"
        href="#main-content"
      >
        Pular para conteúdo principal
      </a>
      <header
        class="header"
        role="banner"
      >
        <div
          class="container"
        >
          <a
            class="skip-link"
            href="#main-content"
          >
            Pular para conteúdo principal
          </a>
          <a
            class="skip-link"
            href="#main-navigation"
          >
            Pular para navegação principal
          </a>
          <div
            class="header__logo"
          >
            <a
              aria-label="TopSmile - Página inicial"
              class="header__logo-link"
              href="/"
            >
              <img
                alt="TopSmile"
                class="header__logo-img"
                src="/src/assets/images/icon-192x192.png"
              />
              <span
                class="header__logo-text"
              >
                TopSmile
              </span>
            </a>
          </div>
          <nav
            aria-label="Navegação principal"
            class="header__nav hide-mobile"
            id="main-navigation"
            role="navigation"
          >
            <ul
              class="header__nav-list"
            >
              <li
                class="header__nav-item"
              >
                <a
                  aria-current="page"
                  class="header__nav-link header__nav-link--active"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/features"
                >
                  Benefícios
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/pricing"
                >
                  Preços
                </a>
              </li>
              <li
                class="header__nav-item"
              >
                <a
                  class="header__nav-link "
                  href="/contact"
                >
                  Contato
                </a>
              </li>
            </ul>
          </nav>
          <div
            class="header__actions"
          >
            <div
              class="header__auth-buttons hide-mobile"
            >
              <a
                href="/login"
              >
                <button
                  aria-busy="false"
                  class="btn btn--ghost btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Entrar
                  </span>
                </button>
              </a>
              <a
                href="/register"
              >
                <button
                  aria-busy="false"
                  class="btn btn--primary btn--md"
                >
                  <span
                    class="btn__content"
                  >
                    Começar
                  </span>
                </button>
              </a>
            </div>
            <button
              aria-controls="mobile-menu"
              aria-expanded="false"
              aria-label="Menu de navegação"
              class="header__mobile-menu-button show-mobile"
            >
              <svg
                class="header__menu-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main
        class="provider-management-main"
      >
        <div
          class="container"
        >
          <div
            class="loading-container"
          >
            <div
              class="loading-spinner"
            >
              Carregando profissionais...
            </div>
          </div>
        </div>
      </main>
      <footer
        class="footer"
        id="footer"
      >
        <div
          class="footer-container"
        >
          <div
            class="footer-brand"
          >
            <h2>
              TopSmile
            </h2>
            <p>
              Conectando você à saúde de forma simples, rápida e segura.
            </p>
          </div>
          <div
            class="footer-links"
          >
            <a
              href="#hero"
            >
              Início
            </a>
            <a
              href="#features"
            >
              Recursos
            </a>
            <a
              href="#pricing"
            >
              Preços
            </a>
            <a
              href="#contact"
            >
              Contato
            </a>
          </div>
        </div>
        <div
          class="footer-bottom"
        >
          <p>
            © 
            2025
             TopSmile. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/ProviderManagement.test.tsx:28:18)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

## Test Suite: http service

### Test: http service request function successful requests should make successful GET request without auth

**File or class:** http service request function successful requests should make successful GET request without auth

> Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:39:24)

```
Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:39:24)
```

### Test: http service request function successful requests should make successful POST request with auth

**File or class:** http service request function successful requests should make successful POST request with auth

> Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:66:24)

```
Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:66:24)
```

### Test: http service request function successful requests should handle full URL endpoints

**File or class:** http service request function successful requests should handle full URL endpoints

> Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:94:9)

```
Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:94:9)
```

### Test: http service request function error handling should handle HTTP errors

**File or class:** http service request function error handling should handle HTTP errors

> Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:109:24)

```
Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:109:24)
```

### Test: http service request function error handling should handle malformed JSON responses

**File or class:** http service request function error handling should handle malformed JSON responses

> Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:131:24)

```
Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:131:24)
```

### Test: http service request function token refresh should refresh token on 401 and retry request

**File or class:** http service request function token refresh should refresh token on 401 and retry request

> Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:170:24)

```
Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:170:24)
```

### Test: http service request function token refresh should handle refresh failure

**File or class:** http service request function token refresh should handle refresh failure

> Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:195:24)

```
Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:195:24)
```

### Test: http service request function token refresh should handle concurrent refresh requests

**File or class:** http service request function token refresh should handle concurrent refresh requests

> Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at async Promise.all (index 0)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:230:36)

```
Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at async Promise.all (index 0)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:230:36)
```

### Test: http service logout function should notify backend about logout

**File or class:** http service logout function should notify backend about logout

> Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: "http://localhost:5000/api/auth/logout", ObjectContaining {"credentials": "include", "headers": {"Content-Type": "application/json"}, "method": "POST"}

Number of calls: 0
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:253:25)

```
Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: "http://localhost:5000/api/auth/logout", ObjectContaining {"credentials": "include", "headers": {"Content-Type": "application/json"}, "method": "POST"}

Number of calls: 0
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:253:25)
```

