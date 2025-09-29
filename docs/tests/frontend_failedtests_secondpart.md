# Frontend Failed Tests

**Total failed tests:** 29
**Total tests executed:** 175
**Test suites affected:** 11

## Test Suite: Patient Appointment Booking Integration

### Test: Patient Appointment Booking Integration when booking is successful should complete full appointment booking flow

**File or class:** `Patient Appointment Booking Integration when booking is successful should complete full appointment booking flow`

> No message provided.

```
Error: Unable to find an element with the text: Dr. Smith. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="appointment-booking"
    >
      <div
        class="booking-loading"
      >
        <div
          class="loading-spinner"
        />
        <p>
          Carregando...
        </p>
      </div>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/integration/PatientAppointmentBooking.test.tsx:89:20)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

### Test: Patient Appointment Booking Integration when booking has conflicts should handle booking conflicts gracefully

**File or class:** `Patient Appointment Booking Integration when booking has conflicts should handle booking conflicts gracefully`

> No message provided.

```
Error: Unable to find an element with the text: Dr. Smith. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="appointment-booking"
    >
      <div
        class="booking-loading"
      >
        <div
          class="loading-spinner"
        />
        <p>
          Carregando...
        </p>
      </div>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/integration/PatientAppointmentBooking.test.tsx:167:20)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

## Test Suite: PatientAuthContext

### Test: PatientAuthContext Initial Authentication Check handles invalid tokens on mount

**File or class:** `PatientAuthContext Initial Authentication Check handles invalid tokens on mount`

> No message provided.

```
Error: expect(received).toBeNull()

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

## Test Suite: ContactManagement

### Test: ContactManagement renders add contact button

**File or class:** `ContactManagement renders add contact button`

> No message provided.

```
Error: Unable to find role="button" and name `/Criar Contato/i`

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
                [...
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

## Test Suite: ContactList

### Test: ContactList should render a list of contacts

**File or class:** `ContactList should render a list of contacts`

> No message provided.

```
Error: Unable to find an element with the text: John Doe. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

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

## Test Suite: AppointmentCalendar

### Test: AppointmentCalendar renders calendar header

**File or class:** `AppointmentCalendar renders calendar header`

> No message provided.

```
TestingLibraryElementError: Unable to find an element with the text: /Agenda de Consultas/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

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

### Test: AppointmentCalendar renders calendar grid after loading

**File or class:** `AppointmentCalendar renders calendar grid after loading`

> No message provided.

```
Error: Unable to find an element with the text: /Nenhuma consulta encontrada/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

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
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/AppointmentCalendar.test.tsx:20:18)
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

## Test Suite: Authentication Flow Integration

### Test: Authentication Flow Integration when logging in should handle complete login to dashboard flow

**File or class:** `Authentication Flow Integration when logging in should handle complete login to dashboard flow`

> No message provided.

```
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name `/entrar/i`

Here are the accessible roles:

  heading:

  Name "TopSmile Admin":
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
  <p />

  Name "":
  <p />

  --------------------------------------------------
  textbox:

  Name "E-mail":
  <input
    class="form-input"
    disabled=""
    id="email"
    name="email"
    placeholder="seu@email.com"
    required=""
    type="email"
    value="admin@topsmile.com"
  />

  --------------------------------------------------
  button:

  Name "":
  <button
    class="password-toggle"
    disabled=""
    type="button"
  />

  Name "Entrando...":
  <button
    class="auth-button"
    disabled=""
    type="submit"
  />

  --------------------------------------------------
  checkbox:

  Name "Lembrar-me":
  <input
    class="checkbox-input"
    disabled=""
    id="remember-me"
    name="remember-me"
    type="checkbox"
  />

  --------------------------------------------------
  link:

  Name "Esqueceu a senha?":
  <a
    class="forgot-password-link"
    href="/forgot-password"
  />

  Name "Criar conta":
  <a
    class="auth-link primary"
    href="/register"
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
            TopSmile Admin
          </h1>
          <p
            class="auth-subtitle"
          >
            Faça login para acessar o painel administrativo
          </p>
        </div>
        <form
          class="auth-form"
        >
          <div
            class="form-fields"
          >
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
                placeholder="seu@email.com"
                required=""
                type="email"
                value="admin@topsmile.com"
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
                  placeholder="Sua senha"
                  required=""
                  type="password"
                  value="password123"
                />
                <button
                  class="password-toggle"
                  disabled=""
                  type="button"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                    <path
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div
            class="form-options"
          >
            <div
              class="remember-me"
            >
              <input
                class="checkbox-input"
                disabled=""
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label
                class="checkbox-label"
                for="remember-me"
              >
                Lembrar-me
              </label>
            </div>
            <a
              class="forgot-password-link"
              href="/forgot-password"
            >
              Esqueceu a senha?
            </a>
          </div>
          <div
            class="form-actions"
          >
            <button
              class="auth-button"
              disabled=""
              type="submit"
            >
              Entrando...
            </button>
          </div>
          <div
            class="auth-links"
          >
            <p>
              Ainda não tem uma conta? 
              <a
                class="auth-link primary"
                href="/register"
              >
                Criar conta
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
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/integration/AuthFlow.test.tsx:64:30)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

### Test: Authentication Flow Integration when refreshing a token should handle token refresh seamlessly

**File or class:** `Authentication Flow Integration when refreshing a token should handle token refresh seamlessly`

> No message provided.

```
Error: Unable to find an element with the text: /dashboard/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="dashboard"
    >
      <div
        class="container"
      >
        <div
          class="dashboard__loading"
        >
          <div
            class="dashboard__loading-content"
          >
            <div
              class="loading-shimmer dashboard__loading-header"
            />
            <div
              class="dashboard__loading-grid"
            >
              <div
                class="loading-shimmer dashboard__loading-card"
              />
              <div
                class="loading-shimmer dashboard__loading-card"
              />
              <div
                class="loading-shimmer dashboard__loading-card"
              />
              <div
                class="loading-shimmer dashboard__loading-card"
              />
            </div>
            <div
              class="dashboard__loading-widgets"
            >
              <div
                class="loading-shimmer dashboard__loading-widget"
              />
              <div
                class="loading-shimmer dashboard__loading-widget"
              />
              <div
                class="loading-shimmer dashboard__loading-widget"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/integration/AuthFlow.test.tsx:114:20)
    at Promise.then.completed (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:391:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/utils.js:316:10)
    at _callCircusTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:218:40)
    at _runTest (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:66:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at _runTestsForDescribeBlock (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:60:9)
    at run (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
    at jestAdapter (/home/rebelde/Development/topsmile/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
    at runTestInternal (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:389:16)
    at runTest (/home/rebelde/Development/topsmile/node_modules/jest-runner/build/runTest.js:475:34)
```

## Test Suite: Accessibility Integration

### Test: Accessibility Integration should have no accessibility violations on LoginPage

**File or class:** `Accessibility Integration should have no accessibility violations on LoginPage`

> No message provided.

```
Error: expect(received).toHaveNoViolations(expected)

Expected the HTML found at $('.password-toggle') to have no violations:

<button type="button" class="password-toggle" disabled="">

Received:

"Buttons must have discernible text (button-name)"

Fix any of the following:
  Element does not have inner text that is visible to screen readers
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  Element's default semantics were not overridden with role="none" or role="presentation"

You can find more information on this issue here: 
https://dequeuniversity.com/rules/axe/4.10/button-name?application=axeAPI
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/accessibility/AccessibilityIntegration.test.tsx:24:21)
```

### Test: Accessibility Integration should have proper keyboard navigation on forms

**File or class:** `Accessibility Integration should have proper keyboard navigation on forms`

> No message provided.

```
Error: expect(element).toHaveAttribute("tabIndex", "0") // element.getAttribute("tabIndex") === "0"

Expected the element to have attribute:
  tabIndex="0"
Received:
  null
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/accessibility/AccessibilityIntegration.test.tsx:54:24)
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

### Test: Accessibility Integration should have sufficient color contrast

**File or class:** `Accessibility Integration should have sufficient color contrast`

> No message provided.

```
Error: No QueryClient set, use QueryClientProvider to set one
    at useQueryClient (/home/rebelde/Development/topsmile/node_modules/@tanstack/react-query/src/QueryClientProvider.tsx:18:11)
    at useBaseQuery (/home/rebelde/Development/topsmile/node_modules/@tanstack/react-query/src/useBaseQuery.ts:54:18)
    at useQuery (/home/rebelde/Development/topsmile/node_modules/@tanstack/react-query/src/useQuery.ts:51:10)
    at useAppointments (/home/rebelde/Development/topsmile/src/hooks/useApiState.ts:24:18)
    at PatientDashboard (/home/rebelde/Development/topsmile/src/pages/Patient/Dashboard/PatientDashboard.tsx:16:79)
    at renderWithHooks (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:15486:18)
    at mountIndeterminateComponent (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:20103:13)
    at beginWork (/home/rebelde/Development/topsmile/node_modules/react-dom/cjs/react-dom.development.js:21626:16)
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
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/accessibility/AccessibilityIntegration.test.tsx:83:33)
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

### Test: Accessibility Integration should have proper form labels and descriptions

**File or class:** `Accessibility Integration should have proper form labels and descriptions`

> No message provided.

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: <label class="form-label" for="email">E-mail</label>
    at forEach (/home/rebelde/Development/topsmile/src/tests/accessibility/AccessibilityIntegration.test.tsx:121:24)
    at Proxy.forEach (<anonymous>)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/accessibility/AccessibilityIntegration.test.tsx:115:12)
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

### Test: Accessibility Integration should support screen reader announcements

**File or class:** `Accessibility Integration should support screen reader announcements`

> No message provided.

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/accessibility/AccessibilityIntegration.test.tsx:136:32)
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

### Test: Accessibility Integration should handle focus management properly

**File or class:** `Accessibility Integration should handle focus management properly`

> No message provided.

```
Error: expect(element).toHaveAttribute("tabIndex") // element.hasAttribute("tabIndex")

Expected the element to have attribute:
  tabIndex
Received:
  null
    at forEach (/home/rebelde/Development/topsmile/src/tests/accessibility/AccessibilityIntegration.test.tsx:159:23)
    at Proxy.forEach (<anonymous>)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/accessibility/AccessibilityIntegration.test.tsx:158:23)
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

## Test Suite: RegisterPage

### Test: RegisterPage renders registration form fields

**File or class:** `RegisterPage renders registration form fields`

> No message provided.

```
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name `/Criar Conta/i`

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

## Test Suite: apiService

### Test: apiService auth methods login should handle network errors

**File or class:** `apiService auth methods login should handle network errors`

> No message provided.

```
Error: Network request failed
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:60:54)
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

### Test: apiService public methods sendContactForm should send contact form successfully

**File or class:** `apiService public methods sendContactForm should send contact form successfully`

> No message provided.

```
Error: expect(received).toBeDefined()

Received: undefined
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:377:29)
```

### Test: apiService Error Handling and Edge Cases Network Timeouts should handle network timeout errors

**File or class:** `apiService Error Handling and Edge Cases Network Timeouts should handle network timeout errors`

> No message provided.

```
TimeoutError: Network request timed out
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:417:30)
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

### Test: apiService Error Handling and Edge Cases Network Timeouts should retry on timeout for critical operations

**File or class:** `apiService Error Handling and Edge Cases Network Timeouts should retry on timeout for critical operations`

> No message provided.

```
TimeoutError: Network request timed out
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:429:30)
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

### Test: apiService Error Handling and Edge Cases Malformed Responses should handle malformed JSON responses

**File or class:** `apiService Error Handling and Edge Cases Malformed Responses should handle malformed JSON responses`

> No message provided.

```
Error: Invalid JSON response
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:453:54)
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

### Test: apiService Error Handling and Edge Cases Retry Logic should retry on 5xx server errors

**File or class:** `apiService Error Handling and Edge Cases Retry Logic should retry on 5xx server errors`

> No message provided.

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:500:32)
```

### Test: apiService Error Handling and Edge Cases Error Boundary Integration should propagate errors to error boundary

**File or class:** `apiService Error Handling and Edge Cases Error Boundary Integration should propagate errors to error boundary`

> No message provided.

```
Error: Critical API failure
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:538:54)
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

## Test Suite: LoginPage

### Test: LoginPage renders login form

**File or class:** `LoginPage renders login form`

> No message provided.

```
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

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
    at customRender (/home/rebelde/Development/topsmile/src/tests/utils/test-utils.tsx:37:12)
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

### Test: LoginPage allows user to type email and password

**File or class:** `LoginPage allows user to type email and password`

> No message provided.

```
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

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
    at customRender (/home/rebelde/Development/topsmile/src/tests/utils/test-utils.tsx:37:12)
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

### Test: LoginPage toggles password visibility

**File or class:** `LoginPage toggles password visibility`

> No message provided.

```
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

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
    at customRender (/home/rebelde/Development/topsmile/src/tests/utils/test-utils.tsx:37:12)
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

### Test: LoginPage shows error message on login failure

**File or class:** `LoginPage shows error message on login failure`

> No message provided.

```
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

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
    at customRender (/home/rebelde/Development/topsmile/src/tests/utils/test-utils.tsx:37:12)
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

## Test Suite: ErrorContext

### Test: ErrorContext clears all notifications

**File or class:** `ErrorContext clears all notifications`

> No message provided.

```
Error: expect(received).toHaveLength(expected)

Expected length: 2
Received length: 6
Received array:  [<div data-testid="notification-notification-1759150787007-zo38hk0jn"><span data-testid="notification-title">Error</span><span data-testid="notification-message">Error message</span><button>Dismiss</button></div>, <span data-testid="notification-title">Error</span>, <span data-testid="notification-message">Error message</span>, <div data-testid="notification-notification-1759150787007-tpjlvd8mk"><span data-testid="notification-title">Warning</span><span data-testid="notification-message">Warning message</span><button>Dismiss</button></div>, <span data-testid="notification-title">Warning</span>, <span data-testid="notification-message">Warning message</span>]
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/contexts/ErrorContext.test.tsx:114:52)
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

### Test: ErrorContext logs an error and shows a notification

**File or class:** `ErrorContext logs an error and shows a notification`

> No message provided.

```
Error: expect(received).toHaveLength(expected)

Expected length: 1
Received length: 3
Received array:  [<div data-testid="notification-notification-1759150799007-6p6eig47p"><span data-testid="notification-title">Erro no Sistema</span><span data-testid="notification-message">Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.</span><button>Dismiss</button></div>, <span data-testid="notification-title">Erro no Sistema</span>, <span data-testid="notification-message">Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.</span>]
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/contexts/ErrorContext.test.tsx:158:27)
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

