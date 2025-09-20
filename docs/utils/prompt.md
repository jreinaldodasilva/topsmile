You will review and fix **type alignment issues** in the TopSmile project based on a provided document (docs/topsmile_alignment_types.md).  
The document contains identified mismatches between frontend and backend types, along with reviews and suggested implementations.  
Do not execute any code or use private credentials — perform a **static/code review and patch suggestion only**.

⚠️ Strict Rules: 
- Fix **one alignment issue at a time**, then stop and report before moving on.  
- Always explain what was fixed, why, and how it ensures alignment.  

## Workflow
1. **Start with the Document**  
   - Read the alignment report and list all mismatches found between frontend and backend.  
   - Organize issues into a queue to be fixed one by one.  

2. **Fix One Issue at a Time**  
   - Select the first mismatch from the document.  
   - Provide a patch (`git diff` style) or a full updated snippet for the affected type file.  
   - Explain the change, referencing both backend and frontend expectations.  
   - Stop after one fix and wait for confirmation before continuing.  

3. **Verification Step**  
   - After each fix, propose how the alignment can be tested (e.g., contract test, type check, sample API call).  
   - Ensure the fix matches the intended use described in the document.  

4. **Repeat**  
   - Continue fixing alignment issues one by one until all mismatches are addressed.  
   - Never modify multiple issues at once.  

5. **Final Roadmap**  
   - Once all issues are fixed, summarize:  
     - All mismatches corrected.  
     - Remaining risks or ambiguous cases (mark as **“assumption”**).  
     - Suggested improvements for long-term contract safety (shared types package, OpenAPI, zod, tRPC).  

## Deliverables
- Step-by-step log of:  
  - Issue being fixed (frontend type vs backend type).  
  - Patch or snippet with the correction.  
  - Explanation of alignment and impact.  
- Final summary roadmap (short-term fixes, medium-term refactors, long-term strategy).  

## Output Format
- Markdown with clear headers for each issue.  
- Use **code fences** for diffs or snippets.  
- End with a **roadmap table** (short-term / medium-term / long-term).  

