Comprehensive Project and Software Design Review

Task:
Perform a comprehensive review of the entire project, focusing on its software design, system architecture, and user interaction flows.

Context:
The project’s architectural and technological documentation is located in the .amazonq/rules/memory-bank/ directory. These files define the system’s intended structure, design decisions, and chosen technologies.
Use these materials as the main reference when analyzing how the implementation aligns with the documented architecture.

Scope of Review:

1. Architecture Consistency and Quality

Evaluate whether the system’s implemented architecture matches the structure described in .amazonq/rules/memory-bank/

Identify inconsistencies, missing layers, circular dependencies, or violations of separation of concerns.

Assess whether component boundaries and responsibilities are clearly defined and maintained.

1. System Understanding — How the Project Works

Analyze how well the project and its documentation explain the overall system behavior, specifically:

Component connectivity: How different modules, services, and systems are connected and communicate.

User authentication and navigation: How users log in, log out, and navigate between views.

Permissions and authorizations: How access control and user roles are managed and enforced.

Page and feature interaction: How main pages, dashboards, and subpages transition and exchange data.

Highlight any unclear or undocumented relationships between these parts.

3. User Interaction Flow (UX Flow / Functional Flow)

Assess how user interactions are designed and implemented:

Standard flow: Login → Dashboard → Subpages → Logout.

Role-based navigation: Differences in experience and access between admin, regular, or guest users.

Conditional rendering or redirects: How permissions and states affect navigation or visibility.

Example scenarios: Evaluate user journeys or use cases (if provided).

Check whether these flows are represented through visual models such as:

Sequence diagrams (UML)

Flowcharts

Wireflows (UI + logic)
If these are missing or incomplete, recommend adding them for clarity.

4. Authentication and Authorization Design

Conduct an in-depth review of how authentication and access control are designed and implemented:

Auth mechanism: Determine whether OAuth2, JWT, SSO, session cookies, or another method is used — and whether it’s appropriate for the system.

User roles and permissions matrix: Identify defined roles (e.g., admin, user, guest) and verify that permissions align with the principle of least privilege.

Access control logic: Evaluate how authorization is enforced (e.g., middleware, route guards, service-level checks) and ensure consistency between frontend and backend.

Session handling: Review how sessions or tokens are created, refreshed, and invalidated.

Logout behavior: Verify whether logout correctly terminates user sessions and revokes credentials.

Identify any potential security flaws, inconsistencies, or missing documentation in this area.

5. Software Design Principles

Assess adherence to fundamental principles (modularity, encapsulation, SOLID, DRY).

Identify design patterns in use (e.g., MVC, layered, repository, observer) and evaluate if they are applied correctly and consistently.

Highlight any anti-patterns or design smells (tight coupling, god classes, duplication, unclear responsibility boundaries).

6. Component and Module Organization

Review directory and package structure for logical organization, cohesion, and clarity.

Check if each component or module has a well-defined responsibility.

Identify any unnecessary complexity or lack of abstraction.

7. Data Flow and Integrations

Trace data flow between frontend, backend, and persistence layers.

Assess consistency with the .amazonq/rules/memory-bank/ data flow descriptions.

Verify integration points with external APIs, services, or message queues.

Identify missing diagrams or unclear data exchange documentation.

8. Scalability, Extensibility, and Maintainability

Evaluate whether the architecture supports scaling horizontally or vertically.

Assess modularity for future feature expansion.

Identify design bottlenecks that could hinder maintainability or evolution.

9. Technology Choices

Review the technologies listed in .amazonq/rules/memory-bank (frameworks, databases, libraries, tools).

Assess whether these technologies are appropriate for the system’s goals.

Identify mismatches between the documented stack and actual implementation.

Expected Output:
Generate a structured review report including:

Summary of findings: Key strengths, weaknesses, and overall design quality.

Detailed analysis: Section-by-section insights (architecture, data flow, UX flow, authentication, etc.).

Specific, actionable recommendations: How to improve clarity, maintainability, and security.

Optional: Suggest missing documentation or diagrams (architecture, sequence, or flow) that would clarify system behavior.

Additional Notes:

If discrepancies exist between the .amazonq/rules/memory-bank documentation and the actual implementation, list them explicitly with likely causes and recommended fixes.

Prioritize architectural clarity, consistent design patterns, and security correctness in your feedback.