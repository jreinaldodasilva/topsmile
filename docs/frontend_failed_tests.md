# Frontend Failed Tests

## Summary

- Total Tests Executed: **201**
- Total Failed Tests: **51**

# Test Suite: http service

## Test: http service request function successful requests should make successful GET request without auth

**File/Class:** `http service request function successful requests should make successful GET request without auth`


**Error Message:**

> TypeError: method.toUpperCase is not a function


**Stack Trace:**

```
    at normalizeMethod (/home/rebelde/Development/topsmile/node_modules/whatwg-fetch/dist/fetch.umd.js:352:26)
    at new Request (/home/rebelde/Development/topsmile/node_modules/whatwg-fetch/dist/fetch.umd.js:388:19)
    at Object.construct (/home/rebelde/Development/topsmile/node_modules/@mswjs/interceptors/src/interceptors/ClientRequest/utils/recordRawHeaders.ts:185:33)
    at fetchFn (/home/rebelde/Development/topsmile/node_modules/@mswjs/interceptors/src/interceptors/fetch/index.ts:52:23)
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:24:28)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:97:10)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:39:37)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

---

## Test: http service request function successful requests should make successful POST request with auth

**File/Class:** `http service request function successful requests should make successful POST request with auth`


**Error Message:**

> TypeError: method.toUpperCase is not a function


**Stack Trace:**

```
    at normalizeMethod (/home/rebelde/Development/topsmile/node_modules/whatwg-fetch/dist/fetch.umd.js:352:26)
    at new Request (/home/rebelde/Development/topsmile/node_modules/whatwg-fetch/dist/fetch.umd.js:388:19)
    at Object.construct (/home/rebelde/Development/topsmile/node_modules/@mswjs/interceptors/src/interceptors/ClientRequest/utils/recordRawHeaders.ts:185:33)
    at fetchFn (/home/rebelde/Development/topsmile/node_modules/@mswjs/interceptors/src/interceptors/fetch/index.ts:52:23)
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:24:28)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:97:10)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:66:37)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

---

## Test: http service request function successful requests should handle full URL endpoints

**File/Class:** `http service request function successful requests should handle full URL endpoints`


**Error Message:**

> TypeError: response.clone is not a function


**Stack Trace:**

```
    at /home/rebelde/Development/topsmile/node_modules/@mswjs/interceptors/src/interceptors/fetch/index.ts:170:42
```

---

## Test: http service request function error handling should handle HTTP errors

**File/Class:** `http service request function error handling should handle HTTP errors`


**Error Message:**

> TypeError: response.clone is not a function


**Stack Trace:**

```
    at /home/rebelde/Development/topsmile/node_modules/@mswjs/interceptors/src/interceptors/fetch/index.ts:170:42
```

---

## Test: http service request function error handling should handle malformed JSON responses

**File/Class:** `http service request function error handling should handle malformed JSON responses`


**Error Message:**

> TypeError: response.clone is not a function


**Stack Trace:**

```
    at /home/rebelde/Development/topsmile/node_modules/@mswjs/interceptors/src/interceptors/fetch/index.ts:170:42
```

---

## Test: http service request function token refresh should refresh token on 401 and retry request

**File/Class:** `http service request function token refresh should refresh token on 401 and retry request`


**Error Message:**

> TypeError: response.clone is not a function


**Stack Trace:**

```
    at /home/rebelde/Development/topsmile/node_modules/@mswjs/interceptors/src/interceptors/fetch/index.ts:170:42
```

---

## Test: http service request function token refresh should handle refresh failure

**File/Class:** `http service request function token refresh should handle refresh failure`


**Error Message:**

> TypeError: response.clone is not a function


**Stack Trace:**

```
    at /home/rebelde/Development/topsmile/node_modules/@mswjs/interceptors/src/interceptors/fetch/index.ts:170:42
```

---

## Test: http service request function token refresh should handle concurrent refresh requests

**File/Class:** `http service request function token refresh should handle concurrent refresh requests`


**Error Message:**

> TypeError: response.clone is not a function


**Stack Trace:**

```
    at /home/rebelde/Development/topsmile/node_modules/@mswjs/interceptors/src/interceptors/fetch/index.ts:170:42
```

---

## Test: http service logout function should notify backend about logout

**File/Class:** `http service logout function should notify backend about logout`


**Error Message:**

> Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)


**Stack Trace:**

```

Expected: "http://localhost:5000/api/auth/logout", ObjectContaining {"credentials": "include", "headers": {"Content-Type": "application/json"}, "method": "POST"}
Received: {"_bodyInit": undefined, "_bodyText": "", "_noBody": true, "bodyUsed": false, "credentials": "include", "headers": {"map": {"content-type": "application/json"}}, "method": "POST", "mode": null, "referrer": null, "signal": {}, "url": "http://localhost:5000/api/auth/logout"}

Number of calls: 1
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:253:25)
```

---

# Test Suite: PatientAppointmentBooking

## Test: PatientAppointmentBooking fetches and displays providers and appointment types

**File/Class:** `PatientAppointmentBooking fetches and displays providers and appointment types`


**Error Message:**

> Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.


**Stack Trace:**

```

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

---

## Test: PatientAppointmentBooking fetches and displays available time slots

**File/Class:** `PatientAppointmentBooking fetches and displays available time slots`


**Error Message:**

> Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.


**Stack Trace:**

```

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

---

## Test: PatientAppointmentBooking allows booking an appointment

**File/Class:** `PatientAppointmentBooking allows booking an appointment`


**Error Message:**

> Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.


**Stack Trace:**

```

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

---

## Test: PatientAppointmentBooking shows an error message if booking fails

**File/Class:** `PatientAppointmentBooking shows an error message if booking fails`


**Error Message:**

> Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.


**Stack Trace:**

```

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

---

# Test Suite: ProviderManagement

## Test: ProviderManagement renders provider management title

**File/Class:** `ProviderManagement renders provider management title`


**Error Message:**

> TestingLibraryElementError: Unable to find an element with the text: /Gestão de Profissionais/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.


**Stack Trace:**

```

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

---

# Test Suite: PatientManagement

## Test: PatientManagement renders patient management title

**File/Class:** `PatientManagement renders patient management title`


**Error Message:**

> TestingLibraryElementError: Unable to find an element with the text: /Gerenciamento de Pacientes/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.


**Stack Trace:**

```

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

---

# Test Suite: ContactManagement

## Test: ContactManagement renders add contact button

**File/Class:** `ContactManagement renders add contact button`


**Error Message:**

> Error: Unable to find role="button" and name `/Criar Contato/i`


**Stack Trace:**

```

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="contact-management-page"
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
        class="contact-management-main"
      >
        <div
          class="container"
        >
          <section
            class="page-header"
          >
            <div
              class="header-content"
            >
              <div
                class="header-info"
              >
                <h1
                  class="page-title"
                >
                  Gerenciamento de Contatos
                </h1>
                <p
                  class="page-subtitle"
                >
                  Gerencie todos os contatos e leads da sua clínica odontológica
                </p>
              </div>
              <div
                class="header-stats"
              >
                <div
                  class="stat-item"
                >
                  <span
                    class="stat-number"
                  >
                    1,247
                  </span>
                  <span
                    class="stat-label"
                  >
                    Total de Contatos
                  </span>
                </div>
                <div
                  class="stat-item"
                >
                  <span
                    class="stat-number"
                  >
                    89
                  </span>
                  <span
                    class="stat-label"
                  >
                    Novos Esta Semana
                  </span>
                </div>
                <div
                  class="stat-item"
                >
                  <span
                    class="stat-number"
                  >
                    23%
                  </span>
                  <span
                    class="stat-label"
                  >
                    Taxa de Conversão
                  </span>
                </div>
              </div>
            </div>
          </section>
          <section
            class="contact-list-section"
          >
            <div
              class="contact-list"
            >
              <div
                class="contact-list-header"
              >
                <h2>
                  Gerenciar Contatos
                </h2>
                <div
                  class="header-actions"
                >
                  <button
                    aria-label="Criar novo contato"
                    class="btn btn-primary"
                  >
                    Criar Contato
                  </button>
                  <button
                    aria-label="Encontrar contatos duplicados"
                    class="btn btn-secondary"
                  >
                    Buscar Duplicados
                  </button>
                </div>
                <div
                  class="contact-filters"
                >
                  <div
                    class="search-box"
                  >
                    <input
                      class="search-input"
                      placeholder="Buscar por nome, email, clínica..."
                      type="text"
                      value=""
                    />
                  </div>
                  <div
                    class="status-filters"
                  >
                    <button
                      aria-label="Filtrar por todos os status"
                      class="filter-button active"
                    >
                      Todos
                    </button>
                    <button
                      aria-label="Filtrar por status: Novo"
                      class="filter-button "
                    >
                      Novos
                    </button>
                    <button
                      aria-label="Filtrar por status: Contatado"
                      class="filter-button "
                    >
                      Contatados
                    </button>
                    <button
                      aria-label="Filtrar por status: Qualificado"
                      class="filter-button "
                    >
                      Qualificados
                    </button>
                    <button
                      aria-label="Filtrar por status: Convertido"
                      class="filter-button "
                    >
                      Convertidos
                    </button>
                    <button
                      aria-label="Filtrar por status: Fechado"
                      class="filter-button "
                    >
                      Fechados
                    </button>
                  </div>
                  <div
                    class="priority-filters"
                  >
                    <label>
                      Prioridade:
                    </label>
                    <button
                      aria-label="Filtrar por todas as prioridades"
                      class="filter-button active"
                    >
                      Todas
                    </button>
                    <button
                      aria-label="Filtrar por prioridade: Alta"
                      class="filter-button "
                    >
                      Alta
                    </button>
                    <button
                      aria-label="Filtrar por prioridade: Média"
                      class="filter-button "
                    >
                      Média
                    </button>
                    <button
                      aria-label="Filtrar por prioridade: Baixa"
                      class="filter-button "
                    >
                      Baixa
                    </button>
                  </div>
                </div>
              </div>
              <div
                aria-live="assertive"
                class="error-banner"
                role="alert"
              >
                <span>
                  ⚠️ 
                  Network request failed
                </span>
                <button>
                  Tentar novamente
                </button>
              </div>
              <div
                class="contact-table-container"
              >
                <div
                  class="empty-state"
                >
                  <div
                    class="empty-icon"
                  >
                    📋
                  </div>
                  <h3>
                    Nenhum contato encontrado
                  </h3>
                  <p>
                    Você ainda não tem contatos registrados.
                  </p>
                </div>
              </div>
            </div>
          </section>
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
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/ContactManagement.test.tsx:28:18)
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

---

# Test Suite: PatientAuthContext

## Test: PatientAuthContext Initial Authentication Check handles invalid tokens on mount

**File/Class:** `PatientAuthContext Initial Authentication Check handles invalid tokens on mount`


**Error Message:**

> Error: expect(received).toBeNull()


**Stack Trace:**

```

Received: "invalid-token"

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
          Logout
        </button>
        <button>
          Clear Error
        </button>
        <button>
          Refresh Patient Data
        </button>
      </div>
    </div>
  </body>
</html>
    at /home/rebelde/Development/topsmile/src/tests/contexts/PatientAuthContext.test.tsx:254:75
    at runWithExpensiveErrorDiagnosticsDisabled (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:47:12)
    at checkCallback (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:124:77)
    at checkRealTimersCallback (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:118:16)
    at Timeout.task [as _onTimeout] (/home/rebelde/Development/topsmile/node_modules/jsdom/lib/jsdom/browser/Window.js:516:19)
    at listOnTimeout (node:internal/timers:588:17)
    at processTimers (node:internal/timers:523:7)
```

---

# Test Suite: AppointmentCalendar

## Test: AppointmentCalendar renders calendar header

**File/Class:** `AppointmentCalendar renders calendar header`


**Error Message:**

> TestingLibraryElementError: Unable to find an element with the text: /Agenda de Consultas/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.


**Stack Trace:**

```

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="appointment-calendar"
    >
      <div
        class="loading-container"
      >
        <div
          class="loading-spinner"
        >
          Carregando agendamentos...
        </div>
      </div>
    </div>
  </div>
</body>
    at Object.getElementError (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:37:19)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
    at getByText (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:95:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/AppointmentCalendar.test.tsx:9:19)
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

---

# Test Suite: ContactList

## Test: ContactList should render a list of contacts

**File/Class:** `ContactList should render a list of contacts`


**Error Message:**

> Error: Unable to find an element with the text: John Doe. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.


**Stack Trace:**

```

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="contact-list"
    >
      <div
        class="contact-list-header"
      >
        <h2>
          Gerenciar Contatos
        </h2>
        <div
          class="header-actions"
        >
          <button
            aria-label="Criar novo contato"
            class="btn btn-primary"
          >
            Criar Contato
          </button>
          <button
            aria-label="Encontrar contatos duplicados"
            class="btn btn-secondary"
          >
            Buscar Duplicados
          </button>
        </div>
        <div
          class="contact-filters"
        >
          <div
            class="search-box"
          >
            <input
              class="search-input"
              placeholder="Buscar por nome, email, clínica..."
              type="text"
              value=""
            />
          </div>
          <div
            class="status-filters"
          >
            <button
              aria-label="Filtrar por todos os status"
              class="filter-button active"
            >
              Todos
            </button>
            <button
              aria-label="Filtrar por status: Novo"
              class="filter-button "
            >
              Novos
            </button>
            <button
              aria-label="Filtrar por status: Contatado"
              class="filter-button "
            >
              Contatados
            </button>
            <button
              aria-label="Filtrar por status: Qualificado"
              class="filter-button "
            >
              Qualificados
            </button>
            <button
              aria-label="Filtrar por status: Convertido"
              class="filter-button "
            >
              Convertidos
            </button>
            <button
              aria-label="Filtrar por status: Fechado"
              class="filter-button "
            >
              Fechados
            </button>
          </div>
          <div
            class="priority-filters"
          >
            <label>
              Prioridade:
            </label>
            <button
              aria-label="Filtrar por todas as prioridades"
              class="filter-button active"
            >
              Todas
            </button>
            <button
              aria-label="Filtrar por prioridade: Alta"
              class="filter-button "
            >
              Alta
            </button>
            <button
              aria-label="Filtrar por prioridade: Média"
              class="filter-button "
            >
              Média
            </button>
            <button
              aria-label="Filtrar por prioridade: Baixa"
              class="filter-button "
            >
              Baixa
            </button>
          </div>
        </div>
      </div>
      <div
        aria-live="polite"
        role="status"
      >
        <div
          class="contact-list-skeleton"
        >
          <table
            class="contact-table"
          >
            <thead>
              <tr>
                <th />
                <th>
                  Nome
                </th>
                <th>
                  Email
                </th>
                <th>
                  Clínica
                </th>
                <th>
                  Especialidade
                </th>
                <th>
                  Telefone
                </th>
                <th>
                  Status
                </th>
                <th>
                  Data
                </th>
                <th>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="skeleton-row"
              >
                <td>
                  <div
                    class="skeleton-checkbox"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-actions"
                  />
                </td>
              </tr>
              <tr
                class="skeleton-row"
              >
                <td>
                  <div
                    class="skeleton-checkbox"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-actions"
                  />
                </td>
              </tr>
              <tr
                class="skeleton-row"
              >
                <td>
                  <div
                    class="skeleton-checkbox"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-actions"
                  />
                </td>
              </tr>
              <tr
                class="skeleton-row"
              >
                <td>
                  <div
                    class="skeleton-checkbox"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-actions"
                  />
                </td>
              </tr>
              <tr
                class="skeleton-row"
              >
                <td>
                  <div
                    class="skeleton-checkbox"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-actions"
                  />
                </td>
              </tr>
              <tr
                class="skeleton-row"
              >
                <td>
                  <div
                    class="skeleton-checkbox"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-actions"
                  />
                </td>
              </tr>
              <tr
                class="skeleton-row"
              >
                <td>
                  <div
                    class="skeleton-checkbox"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-actions"
                  />
                </td>
              </tr>
              <tr
                class="skeleton-row"
              >
                <td>
                  <div
                    class="skeleton-checkbox"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-actions"
                  />
                </td>
              </tr>
              <tr
                class="skeleton-row"
              >
                <td>
                  <div
                    class="skeleton-checkbox"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-actions"
                  />
                </td>
              </tr>
              <tr
                class="skeleton-row"
              >
                <td>
                  <div
                    class="skeleton-checkbox"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-text"
                  />
                </td>
                <td>
                  <div
                    class="skeleton-actions"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        class="loading-overlay"
      >
        <div
          class="loading-spinner"
        >
          Atualizando...
        </div>
      </div>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/components/Admin/Contacts/ContactList.test.tsx:52:18)
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

---

# Test Suite: RegisterPage

## Test: RegisterPage renders registration form fields

**File/Class:** `RegisterPage renders registration form fields`


**Error Message:**

> TestingLibraryElementError: Unable to find an accessible element with the role "button" and name `/Criar Conta/i`


**Stack Trace:**

```

Here are the accessible roles:

  heading:

  Name "Criar Conta TopSmile":
  <h1
    class="auth-title"
  />

  --------------------------------------------------
  paragraph:

  Name "":
  <p
    class="auth-subtitle"
  />

  Name "":
  <p
    style="font-size: 0.75rem; color: rgb(107, 114, 128); margin-top: 0.25rem;"
  />

  Name "":
  <p />

  Name "":
  <p />

  --------------------------------------------------
  group:

  Name "Informações Pessoais":
  <fieldset
    class="form-fieldset"
  />

  Name "Informações da Clínica":
  <fieldset
    class="form-fieldset"
  />

  --------------------------------------------------
  textbox:

  Name "Nome Completo":
  <input
    class="form-input"
    disabled=""
    id="name"
    name="name"
    required=""
    type="text"
    value=""
  />

  Name "E-mail":
  <input
    class="form-input"
    disabled=""
    id="email"
    name="email"
    required=""
    type="email"
    value=""
  />

  Name "Nome da Clínica":
  <input
    class="form-input"
    disabled=""
    id="clinic.name"
    name="clinic.name"
    required=""
    type="text"
    value=""
  />

  Name "Telefone":
  <input
    class="form-input"
    disabled=""
    id="clinic.phone"
    name="clinic.phone"
    required=""
    type="tel"
    value=""
  />

  --------------------------------------------------
  button:

  Name "Mostrar":
  <button
    class="password-toggle"
    disabled=""
    type="button"
  />

  Name "Criando conta...":
  <button
    class="auth-button"
    disabled=""
    type="submit"
  />

  --------------------------------------------------
  checkbox:

  Name "Eu aceito os Termos de Serviço":
  <input
    class="checkbox-input"
    id="terms-accepted"
    name="terms-accepted"
    type="checkbox"
  />

  --------------------------------------------------
  link:

  Name "Termos de Serviço":
  <a
    class="auth-link primary"
    href="/terms"
    target="_blank"
  />

  Name "Fazer login":
  <a
    class="auth-link primary"
    href="/login"
  />

  Name "← Voltar ao site":
  <a
    class="auth-link"
    href="/"
  />

  --------------------------------------------------

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="auth-page"
    >
      <div
        class="auth-container"
        style="max-width: 600px;"
      >
        <div
          class="auth-header"
        >
          <div
            class="auth-logo"
          >
            <svg
              class="auth-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </div>
          <h1
            class="auth-title"
          >
            Criar Conta TopSmile
          </h1>
          <p
            class="auth-subtitle"
          >
            Cadastre sua clínica e comece a usar o TopSmile
          </p>
        </div>
        <form
          class="auth-form"
        >
          <fieldset
            class="form-fieldset"
          >
            <legend
              class="form-legend"
            >
              Informações Pessoais
            </legend>
            <div
              class="form-fields"
            >
              <div
                class="form-field"
              >
                <label
                  class="form-label"
                  for="name"
                >
                  Nome Completo
                </label>
                <input
                  class="form-input"
                  disabled=""
                  id="name"
                  name="name"
                  required=""
                  type="text"
                  value=""
                />
              </div>
              <div
                class="form-field"
              >
                <label
                  class="form-label"
                  for="email"
                >
                  E-mail
                </label>
                <input
                  class="form-input"
                  disabled=""
                  id="email"
                  name="email"
                  required=""
                  type="email"
                  value=""
                />
              </div>
              <div
                class="form-field"
              >
                <label
                  class="form-label"
                  for="password"
                >
                  Senha
                </label>
                <div
                  class="password-field"
                >
                  <input
                    class="form-input"
                    disabled=""
                    id="password"
                    name="password"
                    required=""
                    type="password"
                    value=""
                  />
                  <button
                    class="password-toggle"
                    disabled=""
                    type="button"
                  >
                    Mostrar
                  </button>
                </div>
                <div
                  style="margin-top: 0.5rem;"
                >
                  <div
                    style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.25rem; height: 0.5rem;"
                  >
                    <div
                      style="background-color: rgb(229, 231, 235); border-radius: 0.25rem;"
                    />
                    <div
                      style="background-color: rgb(229, 231, 235); border-radius: 0.25rem;"
                    />
                    <div
                      style="background-color: rgb(229, 231, 235); border-radius: 0.25rem;"
                    />
                    <div
                      style="background-color: rgb(229, 231, 235); border-radius: 0.25rem;"
                    />
                    <div
                      style="background-color: rgb(229, 231, 235); border-radius: 0.25rem;"
                    />
                  </div>
                  <p
                    style="font-size: 0.75rem; color: rgb(107, 114, 128); margin-top: 0.25rem;"
                  >
                    Força da senha: 
                  </p>
                </div>
              </div>
              <div
                class="form-field"
              >
                <label
                  class="form-label"
                  for="confirmPassword"
                >
                  Confirmar Senha
                </label>
                <input
                  class="form-input"
                  disabled=""
                  id="confirmPassword"
                  name="confirmPassword"
                  required=""
                  type="password"
                  value=""
                />
              </div>
            </div>
          </fieldset>
          <fieldset
            class="form-fieldset"
          >
            <legend
              class="form-legend"
            >
              Informações da Clínica
            </legend>
            <div
              class="form-fields"
            >
              <div
                class="form-field"
              >
                <label
                  class="form-label"
                  for="clinic.name"
                >
                  Nome da Clínica
                </label>
                <input
                  class="form-input"
                  disabled=""
                  id="clinic.name"
                  name="clinic.name"
                  required=""
                  type="text"
                  value=""
                />
              </div>
              <div
                class="form-field"
              >
                <label
                  class="form-label"
                  for="clinic.phone"
                >
                  Telefone
                </label>
                <input
                  class="form-input"
                  disabled=""
                  id="clinic.phone"
                  name="clinic.phone"
                  required=""
                  type="tel"
                  value=""
                />
              </div>
            </div>
          </fieldset>
          <div
            class="form-options"
          >
            <div
              class="remember-me"
            >
              <input
                class="checkbox-input"
                id="terms-accepted"
                name="terms-accepted"
                type="checkbox"
              />
              <label
                class="checkbox-label"
                for="terms-accepted"
              >
                Eu aceito os 
                <a
                  class="auth-link primary"
                  href="/terms"
                  target="_blank"
                >
                  Termos de Serviço
                </a>
              </label>
            </div>
          </div>
          <div
            class="form-actions"
          >
            <button
              class="auth-button"
              disabled=""
              type="submit"
            >
              Criando conta...
            </button>
          </div>
          <div
            class="auth-links"
          >
            <p>
              Já tem uma conta? 
              <a
                class="auth-link primary"
                href="/login"
              >
                Fazer login
              </a>
            </p>
            <p>
              <a
                class="auth-link"
                href="/"
              >
                ← Voltar ao site
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</body>
    at Object.getElementError (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:37:19)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
    at getByRole (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:95:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/RegisterPage.test.tsx:15:19)
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

---

# Test Suite: LoginPage

## Test: LoginPage renders login form

**File/Class:** `LoginPage renders login form`


**Error Message:**

> Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.


**Stack Trace:**

```

Check the render method of `AllTheProviders`.
    at createFiberFromTypeAndProps (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:28478:17)
    at createFiberFromElement (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:28504:15)
    at reconcileSingleElement (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:13986:23)
    at reconcileChildFibers (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:14044:35)
    at reconcileChildren (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:19186:28)
    at updateContextProvider (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:21193:3)
    at beginWork (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:21688:14)
    at beginWork$1 (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:27465:14)
    at performUnitOfWork (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:26599:12)
    at workLoopSync (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:26505:5)
    at renderRootSync (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:26473:7)
    at recoverFromConcurrentError (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:25889:20)
    at performConcurrentWorkOnRoot (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:25789:22)
    at flushActQueue (/home/rebelde/Development/topsmile/node_modules/react/cjs/react.development.js:2667:24)
    at act (/home/rebelde/Development/topsmile/node_modules/react/cjs/react.development.js:2582:11)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/react/dist/act-compat.js:47:25
    at renderRoot (/home/rebelde/Development/topsmile/node_modules/@testing-library/react/dist/pure.js:190:26)
    at render (/home/rebelde/Development/topsmile/node_modules/@testing-library/react/dist/pure.js:292:10)
    at customRender (/home/rebelde/Development/topsmile/src/tests/utils/test-utils.tsx:35:12)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/LoginPage.test.tsx:31:11)
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

---

## Test: LoginPage allows user to type email and password

**File/Class:** `LoginPage allows user to type email and password`


**Error Message:**

> Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.


**Stack Trace:**

```

Check the render method of `AllTheProviders`.
    at createFiberFromTypeAndProps (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:28478:17)
    at createFiberFromElement (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:28504:15)
    at reconcileSingleElement (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:13986:23)
    at reconcileChildFibers (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:14044:35)
    at reconcileChildren (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:19186:28)
    at updateContextProvider (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:21193:3)
    at beginWork (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:21688:14)
    at beginWork$1 (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:27465:14)
    at performUnitOfWork (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:26599:12)
    at workLoopSync (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:26505:5)
    at renderRootSync (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:26473:7)
    at recoverFromConcurrentError (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:25889:20)
    at performConcurrentWorkOnRoot (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:25789:22)
    at flushActQueue (/home/rebelde/Development/topsmile/node_modules/react/cjs/react.development.js:2667:24)
    at act (/home/rebelde/Development/topsmile/node_modules/react/cjs/react.development.js:2582:11)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/react/dist/act-compat.js:47:25
    at renderRoot (/home/rebelde/Development/topsmile/node_modules/@testing-library/react/dist/pure.js:190:26)
    at render (/home/rebelde/Development/topsmile/node_modules/@testing-library/react/dist/pure.js:292:10)
    at customRender (/home/rebelde/Development/topsmile/src/tests/utils/test-utils.tsx:35:12)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/LoginPage.test.tsx:38:11)
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

---

## Test: LoginPage toggles password visibility

**File/Class:** `LoginPage toggles password visibility`


**Error Message:**

> Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.


**Stack Trace:**

```

Check the render method of `AllTheProviders`.
    at createFiberFromTypeAndProps (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:28478:17)
    at createFiberFromElement (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:28504:15)
    at reconcileSingleElement (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:13986:23)
    at reconcileChildFibers (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:14044:35)
    at reconcileChildren (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:19186:28)
    at updateContextProvider (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:21193:3)
    at beginWork (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:21688:14)
    at beginWork$1 (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:27465:14)
    at performUnitOfWork (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:26599:12)
    at workLoopSync (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:26505:5)
    at renderRootSync (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:26473:7)
    at recoverFromConcurrentError (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:25889:20)
    at performConcurrentWorkOnRoot (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:25789:22)
    at flushActQueue (/home/rebelde/Development/topsmile/node_modules/react/cjs/react.development.js:2667:24)
    at act (/home/rebelde/Development/topsmile/node_modules/react/cjs/react.development.js:2582:11)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/react/dist/act-compat.js:47:25
    at renderRoot (/home/rebelde/Development/topsmile/node_modules/@testing-library/react/dist/pure.js:190:26)
    at render (/home/rebelde/Development/topsmile/node_modules/@testing-library/react/dist/pure.js:292:10)
    at customRender (/home/rebelde/Development/topsmile/src/tests/utils/test-utils.tsx:35:12)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/LoginPage.test.tsx:50:11)
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

---

## Test: LoginPage shows error message on login failure

**File/Class:** `LoginPage shows error message on login failure`


**Error Message:**

> Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.


**Stack Trace:**

```

Check the render method of `AllTheProviders`.
    at createFiberFromTypeAndProps (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:28478:17)
    at createFiberFromElement (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:28504:15)
    at reconcileSingleElement (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:13986:23)
    at reconcileChildFibers (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:14044:35)
    at reconcileChildren (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:19186:28)
    at updateContextProvider (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:21193:3)
    at beginWork (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:21688:14)
    at beginWork$1 (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:27465:14)
    at performUnitOfWork (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:26599:12)
    at workLoopSync (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:26505:5)
    at renderRootSync (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:26473:7)
    at recoverFromConcurrentError (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:25889:20)
    at performConcurrentWorkOnRoot (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:25789:22)
    at flushActQueue (/home/rebelde/Development/topsmile/node_modules/react/cjs/react.development.js:2667:24)
    at act (/home/rebelde/Development/topsmile/node_modules/react/cjs/react.development.js:2582:11)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/react/dist/act-compat.js:47:25
    at renderRoot (/home/rebelde/Development/topsmile/node_modules/@testing-library/react/dist/pure.js:190:26)
    at render (/home/rebelde/Development/topsmile/node_modules/@testing-library/react/dist/pure.js:292:10)
    at customRender (/home/rebelde/Development/topsmile/src/tests/utils/test-utils.tsx:35:12)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/LoginPage.test.tsx:80:11)
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

---

# Test Suite: apiService

## Test: apiService auth methods login should successfully login with valid credentials

**File/Class:** `apiService auth methods login should successfully login with valid credentials`


**Error Message:**

> Error: expect(received).toBe(expected) // Object.is equality


**Stack Trace:**

```

Expected: true
Received: undefined
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:32:32)
```

---

## Test: apiService auth methods login should handle login failure with invalid credentials

**File/Class:** `apiService auth methods login should handle login failure with invalid credentials`


**Error Message:**

> Error: expect(received).toBe(expected) // Object.is equality


**Stack Trace:**

```

Expected: false
Received: undefined
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:48:32)
```

---

## Test: apiService auth methods login should handle network errors

**File/Class:** `apiService auth methods login should handle network errors`


**Error Message:**

> Error: Network request failed


**Stack Trace:**

```
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:53:54)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

---

## Test: apiService auth methods register should successfully register a new user

**File/Class:** `apiService auth methods register should successfully register a new user`


**Error Message:**

> Error: expect(received).toBe(expected) // Object.is equality


**Stack Trace:**

```

Expected: true
Received: undefined
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:82:32)
```

---

## Test: apiService auth methods me should get current user data

**File/Class:** `apiService auth methods me should get current user data`


**Error Message:**

> Error: expect(received).toBe(expected) // Object.is equality


**Stack Trace:**

```

Expected: true
Received: undefined
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:99:32)
```

---

## Test: apiService patients methods getAll should get all patients

**File/Class:** `apiService patients methods getAll should get all patients`


**Error Message:**

> Error: Network request failed


**Stack Trace:**

```
    at ensureData (/home/rebelde/Development/topsmile/src/services/apiService.ts:27:11)
    at Object.getAll (/home/rebelde/Development/topsmile/src/services/apiService.ts:242:16)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:109:24)
```

---

## Test: apiService patients methods getAll should handle query parameters

**File/Class:** `apiService patients methods getAll should handle query parameters`


**Error Message:**

> Error: Network request failed


**Stack Trace:**

```
    at ensureData (/home/rebelde/Development/topsmile/src/services/apiService.ts:27:11)
    at Object.getAll (/home/rebelde/Development/topsmile/src/services/apiService.ts:242:16)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:118:24)
```

---

## Test: apiService patients methods getOne should get patient by ID

**File/Class:** `apiService patients methods getOne should get patient by ID`


**Error Message:**

> Error: Network request failed


**Stack Trace:**

```
    at ensureData (/home/rebelde/Development/topsmile/src/services/apiService.ts:27:11)
    at Object.getPatient [as getOne] (/home/rebelde/Development/topsmile/src/services/apiService.ts:135:12)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:128:24)
```

---

## Test: apiService patients methods getOne should handle non-existent patient

**File/Class:** `apiService patients methods getOne should handle non-existent patient`


**Error Message:**

> Error: Network request failed


**Stack Trace:**

```
    at ensureData (/home/rebelde/Development/topsmile/src/services/apiService.ts:27:11)
    at Object.getPatient [as getOne] (/home/rebelde/Development/topsmile/src/services/apiService.ts:135:12)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:137:24)
```

---

## Test: apiService patients methods create should create a new patient

**File/Class:** `apiService patients methods create should create a new patient`


**Error Message:**

> Error: Network request failed


**Stack Trace:**

```
    at ensureData (/home/rebelde/Development/topsmile/src/services/apiService.ts:27:11)
    at Object.createPatient [as create] (/home/rebelde/Development/topsmile/src/services/apiService.ts:144:12)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:155:24)
```

---

## Test: apiService patients methods update should update patient data

**File/Class:** `apiService patients methods update should update patient data`


**Error Message:**

> Error: Network request failed


**Stack Trace:**

```
    at ensureData (/home/rebelde/Development/topsmile/src/services/apiService.ts:27:11)
    at Object.updatePatient [as update] (/home/rebelde/Development/topsmile/src/services/apiService.ts:153:12)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:172:24)
```

---

## Test: apiService patients methods delete should delete patient

**File/Class:** `apiService patients methods delete should delete patient`


**Error Message:**

> TypeError: Cannot read properties of undefined (reading 'success')


**Stack Trace:**

```
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:184:23)
```

---

## Test: apiService contacts methods getAll should get all contacts

**File/Class:** `apiService contacts methods getAll should get all contacts`


**Error Message:**

> Error: Network request failed


**Stack Trace:**

```
    at ensureData (/home/rebelde/Development/topsmile/src/services/apiService.ts:27:11)
    at Object.getAll (/home/rebelde/Development/topsmile/src/services/apiService.ts:193:16)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:193:24)
```

---

## Test: apiService contacts methods create should create a new contact

**File/Class:** `apiService contacts methods create should create a new contact`


**Error Message:**

> Error: Network request failed


**Stack Trace:**

```
    at ensureData (/home/rebelde/Development/topsmile/src/services/apiService.ts:27:11)
    at Object.createContact [as create] (/home/rebelde/Development/topsmile/src/services/apiService.ts:88:12)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:213:24)
```

---

## Test: apiService appointments methods getAll should get all appointments

**File/Class:** `apiService appointments methods getAll should get all appointments`


**Error Message:**

> Error: Network request failed


**Stack Trace:**

```
    at ensureData (/home/rebelde/Development/topsmile/src/services/apiService.ts:27:11)
    at Object.getAppointments [as getAll] (/home/rebelde/Development/topsmile/src/services/apiService.ts:42:12)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:225:24)
```

---

## Test: apiService appointments methods create should create a new appointment

**File/Class:** `apiService appointments methods create should create a new appointment`


**Error Message:**

> Error: Network request failed


**Stack Trace:**

```
    at ensureData (/home/rebelde/Development/topsmile/src/services/apiService.ts:27:11)
    at Object.createAppointment [as create] (/home/rebelde/Development/topsmile/src/services/apiService.ts:60:12)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:251:24)
```

---

## Test: apiService dashboard methods getStats should get dashboard statistics

**File/Class:** `apiService dashboard methods getStats should get dashboard statistics`


**Error Message:**

> Error: Network request failed


**Stack Trace:**

```
    at ensureData (/home/rebelde/Development/topsmile/src/services/apiService.ts:27:11)
    at Object.getStats (/home/rebelde/Development/topsmile/src/services/apiService.ts:342:16)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:264:24)
```

---

## Test: apiService public methods sendContactForm should send contact form successfully

**File/Class:** `apiService public methods sendContactForm should send contact form successfully`


**Error Message:**

> TypeError: Cannot read properties of undefined (reading 'success')


**Stack Trace:**

```
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:289:23)
```

---

## Test: apiService system methods health should get health status

**File/Class:** `apiService system methods health should get health status`


**Error Message:**

> Error: Network request failed


**Stack Trace:**

```
    at ensureData (/home/rebelde/Development/topsmile/src/services/apiService.ts:27:11)
    at Object.health (/home/rebelde/Development/topsmile/src/services/apiService.ts:361:16)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:301:24)
```

---

# Test Suite: ErrorContext

## Test: ErrorContext shows an error notification

**File/Class:** `ErrorContext shows an error notification`


**Error Message:**

> TestingLibraryElementError: Unable to find an element by: [data-testid="notification-notification-1759015674680-0zhqkm1sy"]


**Stack Trace:**

```

Ignored nodes: comments, script, style
<body>
  <div>
    <div>
      <button>
        Show Error
      </button>
      <button>
        Show Warning
      </button>
      <button>
        Show Info
      </button>
      <button>
        Show Success
      </button>
      <button>
        Clear All
      </button>
      <button>
        Log Error
      </button>
    </div>
    <div
      aria-label="Notificações"
      class="notification-container"
      role="region"
    >
      <div
        aria-live="polite"
        class="notification-item notification-item--error  "
        role="alert"
      >
        <div
          class="notification-item__icon"
        >
          ❌
        </div>
        <div
          class="notification-item__content"
        >
          <div
            class="notification-item__header"
          >
            <h4
              class="notification-item__title"
              data-testid="notification-title"
            >
              Error
            </h4>
            <span
              class="notification-item__time"
            >
              20:27
            </span>
          </div>
          <p
            class="notification-item__message"
            data-testid="notification-message"
          >
            Error message
          </p>
        </div>
        <button
          aria-label="Fechar notificação"
          class="notification-item__close"
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</body>
    at Object.getElementError (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:37:19)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
    at getByTestId (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:95:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/contexts/ErrorContext.test.tsx:57:33)
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

---

## Test: ErrorContext shows a warning notification

**File/Class:** `ErrorContext shows a warning notification`


**Error Message:**

> TestingLibraryElementError: Unable to find an element by: [data-testid="notification-notification-1759015674680-ydbsy1b82"]


**Stack Trace:**

```

Ignored nodes: comments, script, style
<body>
  <div>
    <div>
      <button>
        Show Error
      </button>
      <button>
        Show Warning
      </button>
      <button>
        Show Info
      </button>
      <button>
        Show Success
      </button>
      <button>
        Clear All
      </button>
      <button>
        Log Error
      </button>
    </div>
    <div
      aria-label="Notificações"
      class="notification-container"
      role="region"
    >
      <div
        aria-live="polite"
        class="notification-item notification-item--warning  "
        role="alert"
      >
        <div
          class="notification-item__icon"
        >
          ⚠️
        </div>
        <div
          class="notification-item__content"
        >
          <div
            class="notification-item__header"
          >
            <h4
              class="notification-item__title"
              data-testid="notification-title"
            >
              Warning
            </h4>
            <span
              class="notification-item__time"
            >
              20:27
            </span>
          </div>
          <p
            class="notification-item__message"
            data-testid="notification-message"
          >
            Warning message
          </p>
        </div>
        <button
          aria-label="Fechar notificação"
          class="notification-item__close"
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</body>
    at Object.getElementError (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:37:19)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
    at getByTestId (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:95:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/contexts/ErrorContext.test.tsx:66:33)
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

---

## Test: ErrorContext shows an info notification

**File/Class:** `ErrorContext shows an info notification`


**Error Message:**

> TestingLibraryElementError: Unable to find an element by: [data-testid="notification-notification-1759015674680-wcxdxduo0"]


**Stack Trace:**

```

Ignored nodes: comments, script, style
<body>
  <div>
    <div>
      <button>
        Show Error
      </button>
      <button>
        Show Warning
      </button>
      <button>
        Show Info
      </button>
      <button>
        Show Success
      </button>
      <button>
        Clear All
      </button>
      <button>
        Log Error
      </button>
    </div>
    <div
      aria-label="Notificações"
      class="notification-container"
      role="region"
    >
      <div
        aria-live="polite"
        class="notification-item notification-item--info  "
        role="alert"
      >
        <div
          class="notification-item__icon"
        >
          ℹ️
        </div>
        <div
          class="notification-item__content"
        >
          <div
            class="notification-item__header"
          >
            <h4
              class="notification-item__title"
              data-testid="notification-title"
            >
              Info
            </h4>
            <span
              class="notification-item__time"
            >
              20:27
            </span>
          </div>
          <p
            class="notification-item__message"
            data-testid="notification-message"
          >
            Info message
          </p>
        </div>
        <button
          aria-label="Fechar notificação"
          class="notification-item__close"
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</body>
    at Object.getElementError (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:37:19)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
    at getByTestId (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:95:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/contexts/ErrorContext.test.tsx:75:33)
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

---

## Test: ErrorContext shows a success notification

**File/Class:** `ErrorContext shows a success notification`


**Error Message:**

> TestingLibraryElementError: Unable to find an element by: [data-testid="notification-notification-1759015674680-xc3j7tfq8"]


**Stack Trace:**

```

Ignored nodes: comments, script, style
<body>
  <div>
    <div>
      <button>
        Show Error
      </button>
      <button>
        Show Warning
      </button>
      <button>
        Show Info
      </button>
      <button>
        Show Success
      </button>
      <button>
        Clear All
      </button>
      <button>
        Log Error
      </button>
    </div>
    <div
      aria-label="Notificações"
      class="notification-container"
      role="region"
    >
      <div
        aria-live="polite"
        class="notification-item notification-item--success  "
        role="alert"
      >
        <div
          class="notification-item__icon"
        >
          ✅
        </div>
        <div
          class="notification-item__content"
        >
          <div
            class="notification-item__header"
          >
            <h4
              class="notification-item__title"
              data-testid="notification-title"
            >
              Success
            </h4>
            <span
              class="notification-item__time"
            >
              20:27
            </span>
          </div>
          <p
            class="notification-item__message"
            data-testid="notification-message"
          >
            Success message
          </p>
        </div>
        <button
          aria-label="Fechar notificação"
          class="notification-item__close"
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</body>
    at Object.getElementError (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:37:19)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
    at getByTestId (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:95:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/contexts/ErrorContext.test.tsx:84:33)
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

---

## Test: ErrorContext dismisses a notification

**File/Class:** `ErrorContext dismisses a notification`


**Error Message:**

> TestingLibraryElementError: Unable to find an element by: [data-testid="notification-notification-1759015674680-5z7lt1fwt"]


**Stack Trace:**

```

Ignored nodes: comments, script, style
<body>
  <div>
    <div>
      <button>
        Show Error
      </button>
      <button>
        Show Warning
      </button>
      <button>
        Show Info
      </button>
      <button>
        Show Success
      </button>
      <button>
        Clear All
      </button>
      <button>
        Log Error
      </button>
    </div>
    <div
      aria-label="Notificações"
      class="notification-container"
      role="region"
    >
      <div
        aria-live="polite"
        class="notification-item notification-item--error  "
        role="alert"
      >
        <div
          class="notification-item__icon"
        >
          ❌
        </div>
        <div
          class="notification-item__content"
        >
          <div
            class="notification-item__header"
          >
            <h4
              class="notification-item__title"
              data-testid="notification-title"
            >
              Error
            </h4>
            <span
              class="notification-item__time"
            >
              20:27
            </span>
          </div>
          <p
            class="notification-item__message"
            data-testid="notification-message"
          >
            Error message
          </p>
        </div>
        <button
          aria-label="Fechar notificação"
          class="notification-item__close"
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</body>
    at Object.getElementError (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:37:19)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
    at getByTestId (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:95:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/contexts/ErrorContext.test.tsx:93:33)
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

---

## Test: ErrorContext auto-dismisses success notification

**File/Class:** `ErrorContext auto-dismisses success notification`


**Error Message:**

> TestingLibraryElementError: Unable to find an element by: [data-testid="notification-notification-1759015674680-ztombwvb6"]


**Stack Trace:**

```

Ignored nodes: comments, script, style
<body>
  <div>
    <div>
      <button>
        Show Error
      </button>
      <button>
        Show Warning
      </button>
      <button>
        Show Info
      </button>
      <button>
        Show Success
      </button>
      <button>
        Clear All
      </button>
      <button>
        Log Error
      </button>
    </div>
    <div
      aria-label="Notificações"
      class="notification-container"
      role="region"
    >
      <div
        aria-live="polite"
        class="notification-item notification-item--success  "
        role="alert"
      >
        <div
          class="notification-item__icon"
        >
          ✅
        </div>
        <div
          class="notification-item__content"
        >
          <div
            class="notification-item__header"
          >
            <h4
              class="notification-item__title"
              data-testid="notification-title"
            >
              Success
            </h4>
            <span
              class="notification-item__time"
            >
              20:27
            </span>
          </div>
          <p
            class="notification-item__message"
            data-testid="notification-message"
          >
            Success message
          </p>
        </div>
        <button
          aria-label="Fechar notificação"
          class="notification-item__close"
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</body>
    at Object.getElementError (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:37:19)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
    at getByTestId (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:95:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/contexts/ErrorContext.test.tsx:121:19)
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

---

## Test: ErrorContext auto-dismisses info notification

**File/Class:** `ErrorContext auto-dismisses info notification`


**Error Message:**

> TestingLibraryElementError: Unable to find an element by: [data-testid="notification-notification-1759015674680-1hu26hdan"]


**Stack Trace:**

```

Ignored nodes: comments, script, style
<body>
  <div>
    <div>
      <button>
        Show Error
      </button>
      <button>
        Show Warning
      </button>
      <button>
        Show Info
      </button>
      <button>
        Show Success
      </button>
      <button>
        Clear All
      </button>
      <button>
        Log Error
      </button>
    </div>
    <div
      aria-label="Notificações"
      class="notification-container"
      role="region"
    >
      <div
        aria-live="polite"
        class="notification-item notification-item--info  "
        role="alert"
      >
        <div
          class="notification-item__icon"
        >
          ℹ️
        </div>
        <div
          class="notification-item__content"
        >
          <div
            class="notification-item__header"
          >
            <h4
              class="notification-item__title"
              data-testid="notification-title"
            >
              Info
            </h4>
            <span
              class="notification-item__time"
            >
              20:27
            </span>
          </div>
          <p
            class="notification-item__message"
            data-testid="notification-message"
          >
            Info message
          </p>
        </div>
        <button
          aria-label="Fechar notificação"
          class="notification-item__close"
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</body>
    at Object.getElementError (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/config.js:37:19)
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
    at /home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
    at getByTestId (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:95:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/contexts/ErrorContext.test.tsx:135:19)
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

---

## Test: ErrorContext logs an error and shows a notification

**File/Class:** `ErrorContext logs an error and shows a notification`


**Error Message:**

> Error: expect(jest.fn()).toHaveBeenCalled()


**Stack Trace:**

```

Expected number of calls: >= 1
Received number of calls:    0
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/contexts/ErrorContext.test.tsx:161:26)
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

---
