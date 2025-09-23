You will implement the fixes and improvements for the TopSmile project based on a provided document:  
`topsmile_fullstack_review.md`.  

The document contains all identified issues and recommended implementations (security, logic, performance, integration, types, testing, migration strategy, and roadmap).  
Do not invent new issues or solutions. Only implement what is explicitly described in the document.  

⚠️ Strict Rules:
- Fix **one issue at a time**, then stop and report before moving on.  
- Always explain what was fixed, why, and how it aligns with the document.  
- Never modify multiple issues in one patch.  
- If something is ambiguous, mark it as **“assumption”** and explain.  

---

## Workflow

### 1. Start with the Document
- Parse `topsmile_fullstack_review.md`.  
- Extract all listed issues and recommendations.  
- Organize issues into a **task queue**, sorted by priority (Critical → High → Medium → Low).  

### 2. Fix One Issue at a Time
- Select the **first issue** from the queue.  
- Quote the relevant section from the document.  
- Provide a patch in **git diff format** or a full updated snippet.  
- Explain:  
  - The original issue.  
  - Why the fix is needed.  
  - How the patch aligns with the review’s recommendation.  
- Stop after one fix and wait for confirmation before continuing.  

### 3. Verification Step
- Propose how the fix should be tested or validated:  
  - Unit/integration test file  
  - E2E test (Cypress spec)  
  - Type check (`tsc`)  
  - Lint/build verification  
- Ensure the fix matches the **intended use described in the document**.  

### 4. Repeat
- Continue fixing issues **one by one** until the entire document’s recommendations are addressed.  
- Never batch multiple fixes together.  

### 5. Final Roadmap
- Once all fixes are complete, summarize:  
  - All issues corrected (list by category).  
  - Remaining risks or ambiguous cases (**“assumption”**).  
  - Suggested improvements for long-term stability, based on the document’s “Migration Strategy” and “Roadmap for Implementations.”  

---

## Deliverables
For each fix:
1. **Issue description (quoted from review)**  
2. **Files affected**  
3. **Patch (git diff or snippet)**  
4. **Explanation**  
5. **Proposed test/verification step**  

At the end:
- **Final summary roadmap** with phases: short-term fixes, medium-term improvements, long-term strategy.  

---

## Constraints
- Do not execute or access secrets (`.env`).  
- Do not implement anything not described in the document.  
- If assumptions are required, clearly mark them as **“assumption.”**  

---

## Output Format
- Markdown with clear section headers.  
- **Git diff code fences** for patches.  
- Include a **summary table of issues with severity** for quick scanning.  
- End with a **roadmap table** (Short-term / Medium-term / Long-term).  

