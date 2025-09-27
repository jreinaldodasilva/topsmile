# Frontend Failed Tests

## Summary

Total number of failed tests: 47

Total number of tests executed: 191

## Failed Test Details

## Test: http service request function successful requests should make successful GET request without auth
**File or class:** http service request function successful requests should make successful GET request without auth
> Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at runNextTicks (node:internal/process/task_queues:65:5)
    at processTimers (node:internal/timers:520:9)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:40:24)

## Test: http service request function successful requests should make successful POST request with auth
**File or class:** http service request function successful requests should make successful POST request with auth
> Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:58:24)

## Test: http service request function successful requests should handle full URL endpoints
**File or class:** http service request function successful requests should handle full URL endpoints
> Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:75:24)

## Test: http service request function error handling should handle HTTP errors
**File or class:** http service request function error handling should handle HTTP errors
> Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:89:24)

## Test: http service request function error handling should handle malformed JSON responses
**File or class:** http service request function error handling should handle malformed JSON responses
> Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:103:24)

## Test: http service request function token refresh should refresh token on 401 and retry request
**File or class:** http service request function token refresh should refresh token on 401 and retry request
> Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:142:24)

## Test: http service request function token refresh should handle refresh failure
**File or class:** http service request function token refresh should handle refresh failure
> Error: expect(received).toBeNull()

Received: "expired"
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:167:67)

## Test: http service request function token refresh should handle concurrent refresh requests
**File or class:** http service request function token refresh should handle concurrent refresh requests
> Error: Network request failed
    at makeRequest (/home/rebelde/Development/topsmile/src/services/http.ts:106:13)
    at request (/home/rebelde/Development/topsmile/src/services/http.ts:113:19)
    at async Promise.all (index 0)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:199:36)

## Test: http service logout function should notify backend about logout
**File or class:** http service logout function should notify backend about logout
> Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: "http://localhost:5000/api/auth/logout", ObjectContaining {"body": "{\"refreshToken\":\"test-refresh-token\"}", "headers": {"Content-Type": "application/json"}, "method": "POST"}
Received: {"_bodyInit": undefined, "_bodyText": "", "_noBody": true, "bodyUsed": false, "credentials": "include", "headers": {"map": {"content-type": "application/json"}}, "method": "POST", "mode": null, "referrer": null, "signal": {}, "url": "http://localhost:5000/api/auth/logout"}

Number of calls: 1
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/http.test.ts:223:25)

## Test: AdminDashboard renders dashboard title
**File or class:** AdminDashboard renders dashboard title
> Error: Unable to find an element with the text: /Dashboard/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

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
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/AdminDashboard.test.tsx:9:18)
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

## Test: AdminDashboard renders stats cards after loading
**File or class:** AdminDashboard renders stats cards after loading
> Error: Unable to find an element with the text: /Total de Contatos/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

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
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/AdminDashboard.test.tsx:22:18)
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

## Test: AdminDashboard renders upcoming appointments section
**File or class:** AdminDashboard renders upcoming appointments section
> Error: Unable to find an element with the text: /Próximas Consultas/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

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
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/AdminDashboard.test.tsx:39:18)
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

## Test: AdminDashboard renders recent patients section
**File or class:** AdminDashboard renders recent patients section
> Error: Unable to find an element with the text: /Pacientes Recentes/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

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
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/AdminDashboard.test.tsx:47:18)
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

## Test: AdminDashboard renders pending tasks section
**File or class:** AdminDashboard renders pending tasks section
> Error: Unable to find an element with the text: /Tarefas Pendentes/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

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
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/AdminDashboard.test.tsx:55:18)
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

## Test: AdminDashboard renders quick actions section
**File or class:** AdminDashboard renders quick actions section
> Error: Unable to find an element with the text: /Ações Rápidas/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

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
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/AdminDashboard.test.tsx:63:18)
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

## Test: PatientAppointmentBooking fetches and displays providers and appointment types
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

## Test: PatientAppointmentBooking fetches and displays available time slots
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

## Test: PatientAppointmentBooking allows booking an appointment
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

## Test: PatientAppointmentBooking shows an error message if booking fails
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

## Test: PatientManagement renders patient management title
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

## Test: PatientManagement renders patient list after loading
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

## Test: PatientManagement renders add patient button
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

## Test: ProviderManagement renders provider management title
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

## Test: ProviderManagement renders provider list after loading
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

## Test: ProviderManagement renders add provider button
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

## Test: PatientAuthContext Initial Authentication Check handles invalid tokens on mount
**File or class:** PatientAuthContext Initial Authentication Check handles invalid tokens on mount
> Error: expect(received).toBeNull()

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

## Test: ContactList should render a list of contacts
**File or class:** ContactList should render a list of contacts
> Error: Unable to find an element with the text: John Doe. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

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

## Test: ContactManagement renders add contact button
**File or class:** ContactManagement renders add contact button
> Error: Unable to find role="button" and name `/Criar Contato/i`

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

## Test: AppointmentCalendar renders calendar header
**File or class:** AppointmentCalendar renders calendar header
> TestingLibraryElementError: Unable to find an element with the text: /Agenda de Consultas/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

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

## Test: AppointmentCalendar renders calendar grid after loading
**File or class:** AppointmentCalendar renders calendar grid after loading
> Error: Unable to find an element with the text: /Nenhuma consulta encontrada/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

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

## Test: RegisterPage renders registration form fields
**File or class:** RegisterPage renders registration form fields
> TestingLibraryElementError: Unable to find an accessible element with the role "button" and name `/Criar Conta/i`

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

## Test: apiService patients methods getAll should get all patients
**File or class:** apiService patients methods getAll should get all patients
> Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 2

@@ -3,7 +3,8 @@
      Object {
        "_id": "1",
        "name": "John Doe",
      },
    ],
-   "ok": true,
+   "message": undefined,
+   "success": true,
  }
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:37:22)

## Test: apiService patients methods getAll should handle query parameters
**File or class:** apiService patients methods getAll should handle query parameters
> Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 2

@@ -3,7 +3,8 @@
      Object {
        "_id": "1",
        "name": "John Doe",
      },
    ],
-   "ok": true,
+   "message": undefined,
+   "success": true,
  }
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:51:22)

## Test: apiService patients methods getOne should get patient by ID
**File or class:** apiService patients methods getOne should get patient by ID
> Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 2

  Object {
    "data": Object {
      "_id": "123",
      "name": "John Doe",
    },
-   "ok": true,
+   "message": undefined,
+   "success": true,
  }
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:64:22)

## Test: apiService patients methods getOne should handle non-existent patient
**File or class:** apiService patients methods getOne should handle non-existent patient
> Error: expect(received).toEqual(expected) // deep equality

- Expected  - 2
+ Received  + 2

  Object {
+   "data": undefined,
    "message": "Patient not found",
-   "ok": false,
-   "status": 404,
+   "success": false,
  }
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:77:22)

## Test: apiService patients methods create should create a new patient
**File or class:** apiService patients methods create should create a new patient
> Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 2

@@ -12,7 +12,8 @@
      "email": "new@example.com",
      "firstName": "New",
      "lastName": "Patient",
      "phone": "123456789",
    },
-   "ok": true,
+   "message": undefined,
+   "success": true,
  }
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:94:22)

## Test: apiService patients methods update should update patient data
**File or class:** apiService patients methods update should update patient data
> Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 2

  Object {
    "data": Object {
      "_id": "123",
      "name": "Updated Name",
    },
-   "ok": true,
+   "message": undefined,
+   "success": true,
  }
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:111:22)

## Test: apiService patients methods delete should delete patient
**File or class:** apiService patients methods delete should delete patient
> Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 2

  Object {
+   "data": undefined,
    "message": "Patient deleted successfully",
-   "ok": true,
+   "success": true,
  }
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:126:22)

## Test: apiService contacts methods getAll should get all contacts
**File or class:** apiService contacts methods getAll should get all contacts
> Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 2

  Object {
    "data": Object {
      "contacts": Array [],
      "total": 0,
    },
-   "ok": true,
+   "message": undefined,
+   "success": true,
  }
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:140:22)

## Test: apiService contacts methods create should create a new contact
**File or class:** apiService contacts methods create should create a new contact
> Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 2

@@ -2,7 +2,8 @@
    "data": Object {
      "_id": "new-contact-id",
      "email": "contact@example.com",
      "name": "New Contact",
    },
-   "ok": true,
+   "message": undefined,
+   "success": true,
  }
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:152:22)

## Test: apiService appointments methods getAll should get all appointments
**File or class:** apiService appointments methods getAll should get all appointments
> Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 2

  Object {
    "data": Array [],
-   "ok": true,
+   "message": undefined,
+   "success": true,
  }
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/services/apiService.test.ts:165:22)

## Test: LoginPage renders login form
**File or class:** LoginPage renders login form
> Error: Unable to find role="button" and name `/entrar/i`

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
                  placeholder="Sua senha"
                  required=""
                  type="password"
                  value=""
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
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/LoginPage.test.tsx:28:18)
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

## Test: LoginPage allows user to type email and password
**File or class:** LoginPage allows user to type email and password
> Error: expect(element).toHaveValue(test@example.com)

Expected the element to have value:
  test@example.com
Received:

    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/LoginPage.test.tsx:50:24)

## Test: LoginPage toggles password visibility
**File or class:** LoginPage toggles password visibility
> Error: Unable to find role="button" and name `/mostrar senha/i`

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
                  placeholder="Sua senha"
                  required=""
                  type="password"
                  value=""
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
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at findByRole (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:86:33)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/LoginPage.test.tsx:64:39)

## Test: LoginPage shows error message on login failure
**File or class:** LoginPage shows error message on login failure
> Error: Unable to find role="button" and name `/entrar/i`

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
                  placeholder="Sua senha"
                  required=""
                  type="password"
                  value=""
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
    at waitForWrapper (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at findByRole (/home/rebelde/Development/topsmile/node_modules/@testing-library/dom/dist/query-helpers.js:86:33)
    at Object.<anonymous> (/home/rebelde/Development/topsmile/src/tests/components/LoginPage.test.tsx:83:39)

## Test: ErrorContext clears all notifications
**File or class:** ErrorContext clears all notifications
> Error: expect(received).toHaveLength(expected)

Expected length: 2
Received length: 6
Received array:  [<div data-testid="notification-notification-1758999734956-m1dx92npm"><span data-testid="notification-title">Error</span><span data-testid="notification-message">Error message</span><button>Dismiss</button></div>, <span data-testid="notification-title">Error</span>, <span data-testid="notification-message">Error message</span>, <div data-testid="notification-notification-1758999734956-5ksz1hdru"><span data-testid="notification-title">Warning</span><span data-testid="notification-message">Warning message</span><button>Dismiss</button></div>, <span data-testid="notification-title">Warning</span>, <span data-testid="notification-message">Warning message</span>]
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

## Test: ErrorContext logs an error and shows a notification
**File or class:** ErrorContext logs an error and shows a notification
> Error: expect(received).toHaveLength(expected)

Expected length: 1
Received length: 3
Received array:  [<div data-testid="notification-notification-1758999746956-3rf8tnws6"><span data-testid="notification-title">Erro no Sistema</span><span data-testid="notification-message">Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.</span><button>Dismiss</button></div>, <span data-testid="notification-title">Erro no Sistema</span>, <span data-testid="notification-message">Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.</span>]
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

