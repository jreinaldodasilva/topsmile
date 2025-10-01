Here's your enhanced prompt with **code redundancy checks** integrated:

```markdown
Please perform a comprehensive code review of the TopSmile repository archive I'm uploading. This is a TypeScript/Node.js monorepo with backend API, shared types package, and frontend components.

**Focus Areas (prioritized):**
1. Critical blockers that prevent successful builds or runtime execution
2. Security vulnerabilities, authentication/authorization flaws, and type safety issues
3. **Code redundancy and duplication** (duplicate logic, copy-pasted code, redundant utilities)
4. Architecture concerns, code quality issues, and maintainability risks
5. Missing test coverage for critical paths
6. Documentation gaps and configuration problems

**Deliverables Required:**

1. **Executive Summary Report** (`TOPSMILE_REVIEW.md`)
   - Overall health assessment with confidence rating
   - Top 3-5 immediate action items, prioritized by impact
   - Architecture observations and recommendations
   - **Code duplication metrics** (estimated % of duplicated code, hotspots)
   - Explicit assumptions you made during review

2. **Machine-Readable Issues** (`issues.json`)
   - Structured issue objects with schema:
     ```json
     {
       "id": "ISSUE-XXX",
       "title": "Brief title",
       "severity": "Critical|High|Medium|Low",
       "area": "backend|frontend|infrastructure|types|duplication",
       "file": "path/to/file",
       "lineRange": "L10-L25",
       "description": "Detailed explanation",
       "reproductionSteps": ["step 1", "step 2"],
       "suggestedFixPatchRef": "patches/00XX_name.patch",
       "testsSuggested": ["test file references"],
       "confidence": "High|Medium|Low",
       "duplicatedIn": ["path/to/other/file:L20-L35"] // optional, for duplication issues
     }
     ```

3. **Code Duplication Report** (`duplication_analysis.md`)
   - **Exact duplicates**: Identical code blocks across files (>10 lines)
   - **Semantic duplicates**: Similar logic with minor variations
   - **Redundant utilities**: Functions/classes that could be consolidated
   - **Cross-package duplication**: Repeated code between backend/frontend/types
   - Consolidation opportunities with refactoring suggestions
   - Risk assessment for deduplication (breaking changes, coupling)

4. **Concrete Patches** (`patches/` directory)
   - Unified diff format (git-apply compatible)
   - Focus on minimal, low-risk, high-impact fixes
   - **Include safe deduplication patches** (extract common utilities, DRY violations)
   - Each patch should include: title, motivation, risk assessment, testing notes
   - Prioritize: error handling, type safety, linting rules, critical bugs, high-value deduplication

5. **Test Recommendations** (`tests_to_add.md`)
   - Concrete test code examples (Jest, Supertest, Cypress)
   - Cover critical paths: auth flows, error handling, API endpoints, edge cases
   - **Tests for consolidated/deduplicated code** to prevent regression
   - Include both unit and integration test suggestions

6. **Files Reviewed List** (`files_reviewed.txt`)
   - Scanned files enumeration
   - Excluded paths (node_modules, build artifacts, etc.)
   - **Duplication scan coverage** (which file pairs were compared)

**Redundancy Detection Criteria:**
- Flag code blocks >10 lines with >80% similarity
- Identify repeated patterns: validation logic, error handling, API calls, utility functions
- Check for redundant type definitions across packages
- Detect copy-pasted React components with minor prop differences
- Note opportunities to extract shared constants, configs, or helpers
- **Ignore acceptable duplication**: test fixtures, migration files, generated code

**Constraints:**
- Provide minimal, low-risk patches I can apply immediately to unblock development
- Avoid full refactors; focus on surgical fixes
- **For deduplication**: Only suggest consolidation if it reduces maintenance burden without increasing coupling
- Flag any placeholder code (e.g., literal '...', TODO comments, unimplemented functions)
- Identify type safety issues (any usage, implicit any, loose typings)
- Note missing error handling and security concerns

**Output Format:**
Package everything into a downloadable ZIP bundle: `TOPSMILE_REVIEW_bundle.zip`

**Next Steps Guidance:**
After the review, suggest whether I should:
- (A) Apply safe fixes + linting to unblock CI first, OR
- (B) Prioritize deep remediation of incomplete implementations, OR
- (C) **Tackle high-ROI deduplication first** (if duplication is >20% and causing maintenance issues)

Be explicit about confidence levels and areas where human judgment is needed.
```

---

## Key Additions for Redundancy Checking:

1. **New Focus Area (#3)**: Explicitly prioritizes code duplication analysis
2. **Enhanced JSON Schema**: Added `duplicatedIn` field to track related duplicates
3. **New Deliverable**: `duplication_analysis.md` with detailed redundancy report
4. **Detection Criteria Section**: Defines thresholds (>10 lines, >80% similarity) and patterns to look for
5. **Exclusions**: Ignores acceptable duplication (tests, migrations, generated code)
6. **Deduplication Patches**: Requests safe, low-risk consolidation patches
7. **ROI Assessment**: Asks for refactoring risk vs. maintenance benefit analysis
8. **Next Steps**: Adds option (C) to prioritize deduplication if it's a major issue

This enhanced prompt will catch:
- Copy-pasted validation logic
- Repeated API error handling
- Duplicate type definitions
- Redundant utility functions
- Similar React components that could share a base