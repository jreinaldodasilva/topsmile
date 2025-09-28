# Frontend Review Request Prompt

Thoroughly and meticulously analyze the frontend of the TopSmile project.  

The files `frontend_raw_links.txt` contains raw GitHub URLs to every frontend source file (direct links to raw.githubusercontent.com).  
Do not execute any code or use private credentials — perform a static/code review only.

## **Frontend Architecture**
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: React Context + React Query (TanStack Query)
- **Styling**: CSS modules with global styles
- **Performance**: Code splitting with lazy loading
- **Error Handling**: Error boundaries and context-based error management

Deliverables (produce as Markdown with code snippets, file paths, and diffs where useful):

1. **Executive Summary** – one paragraph describing overall backend health and high-level risks.
2. **Architecture Overview** – describe how controllers, services, and models interact. Include a simple Mermaid or ASCII diagram of the data flow.
3. **Security Review** – enumerate each issue with severity (Critical/High/Medium/Low), the file and line number, reproduction scenario, and a recommended fix (patch or diff if possible).
4. **Correctness & Logic Issues** – identify potential bugs, missing validation, or error handling flaws, with examples of test cases to add.
5. **Performance & Scalability** – highlight expensive queries, N+1 problems, indexing needs, caching opportunities, and async/await pitfalls.
6. **API Contract Review** – document exposed endpoints, expected inputs/outputs, error-handling patterns, and suggest improvements (e.g., consistent status codes, validation middleware).
7. **Database & Schema Review** – inspect Mongoose models, schema design, required/optional fields, indexing, and data integrity risks.
8. **Testing & CI/CD** – review test coverage (unit, integration, e2e), identify gaps, and suggest improvements to the CI/CD pipeline.
9. **Dependencies & Vulnerabilities** – check for outdated or insecure npm packages and suggest stable replacements.
10. **Code Quality & Maintainability** – comment on TypeScript typing, error boundaries, file/module organization, duplication, and potential refactors (small, medium, large).
11. **Prioritized TODO List** – top 5 recommended fixes or improvements with justifications.
12. **Files Examined** – provide a short list of all files reviewed and note any assumptions made.

Constraints:

- Do not run the project or attempt to access secrets (e.g., `.env` values). Instead, flag potential secret usage.
- If encountering auto-generated or third-party code, note and skip deep review.
- If something is ambiguous, provide a best-effort recommendation and mark it as “assumption.”

Output format:

- Markdown report with clear section headers.
- Use code fences for inline diffs or code snippets.
- Include a concise summary table of issues with severity for quick scanning.

Artifacts to use (if available):

- `backend_raw_links.txt` and `backend_tests_raw_links` (list of backend source files)  
- `README.md`  
- `Dockerfile` / `docker-compose.yml`  
- `env.example` (sanitized)  
- Migration scripts and seed data  
- CI/CD config and test results
