Thoroughly and meticulously analyze the frontend and the backend of the TopSmile project, with a strong focus on how frontend integrates with the backend.  
The file `frontend_raw_links.txt` contains raw GitHub URLs to every frontend source file (direct links to raw.githubusercontent.com).
The file `backend_raw_links.txt` contains raw GitHub URLs to every backend source file (direct links to raw.githubusercontent.com).   
Do not execute any code or use private credentials — perform a static/code review only.

Context:
- **Frontend Framework & Language**
  - React 18.2.0 with TypeScript 4.9.5 (strict configuration, full type safety)
  - React Router DOM 6.30.1 for client-side routing
- **UI/UX Libraries**
  - Framer Motion 10.16.5 for animations
  - React Icons 4.12.0
  - React Slick 0.29.0 with Slick Carousel
  - React Calendar 6.0.0 for appointment scheduling
- **Development & Testing Infrastructure**
  - Jest 30.1.3 + React Testing Library for unit tests
  - Cypress 15.1.0 for end-to-end testing
  - MSW 2.11.1 for API mocking
  - MongoDB Memory Server for database testing scenarios
- **Backend stack** (for integration review): Node.js + Express + TypeScript API with MongoDB/Mongoose
- **Project organization**: React components, pages/routes, API service modules/hooks, and state management (specify if Redux/Context/React Query is present)

Deliverables (produce as Markdown with file paths, snippets, and diffs where useful):
1. **Executive Summary** – overall frontend health and integration with backend.
2. **Architecture & Data Flow** – describe how components, services, and state management handle backend data. Provide a diagram (Mermaid or ASCII) of request/response flow.
3. **API Integration Review**
   - Endpoint usage and consistency with backend contract.
   - Input validation before requests.
   - HTTP methods, headers, tokens, and response parsing.
   - Error handling and retries.
   - Authentication & authorization flows (JWT/session/cookies).
4. **Routing & Navigation** – review React Router setup, route protection, nested routes, and handling of protected pages.
5. **Validation & Error Handling**
   - How inputs are validated on the client before backend calls.
   - How backend errors are surfaced (toast, modal, inline errors).
6. **State Management & Caching**
   - Review local vs global state usage.
   - Identify redundant API calls or stale data risks.
   - Suggestions for memoization, React Query, or caching strategies.
7. **Security Review**
   - Storage of tokens (localStorage/session/cookies/memory).
   - Exposure of sensitive data in frontend logic.
   - XSS/CSRF considerations.
   - Role-based access enforcement at the UI layer.
8. **UI/UX & Integration**
   - Loading states, skeletons, and error placeholders.
   - Proper synchronization between backend state and UI.
   - Accessibility considerations with third-party UI libraries.
9. **Testing Review**
   - Coverage of API calls with Jest + Testing Library.
   - Effectiveness of MSW mocks and whether they reflect backend contracts.
   - Cypress e2e coverage of real integration scenarios.
   - MongoDB Memory Server usage for realistic test flows.
10. **Performance & Scalability**
    - Identify large payload issues, over-fetching, or unbatched calls.
    - Component re-render hotspots (React profiler hints).
    - Opportunities for code splitting and lazy loading.
11. **Code Quality & Maintainability**
    - TypeScript typings for API responses (consistency with backend DTOs).
    - Organization of service modules and hooks.
    - Component reusability and adherence to design patterns.
12. **Prioritized TODO List** – top 5 fixes or improvements with justifications.
13. **Files Examined** – list of files reviewed and any assumptions.
14. **Implementation Roadmap** – A implementation roadmap from critical to low issues.
15. **Improvements and New Features** 


Constraints:
- Do not run the project or attempt to access private credentials.
- If backend contracts appear mismatched, flag both sides with suggested corrections.
- If something is ambiguous, provide best-effort guidance and label it as “assumption.”

Output format:
- Markdown report with clear headers.
- Summary table of endpoints used (frontend ↔ backend), with notes on errors, validation, and handling.
- Inline code snippets or diffs for recommended fixes.
