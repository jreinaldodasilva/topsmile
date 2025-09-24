Perfect 👍 Here’s a **migration note** you can drop into your repo’s README or share with your team so everyone knows the new testing workflow:

---

# 🧪 TopSmile Testing Guide (Updated)

We’ve standardized the **frontend** and **backend** test setups. Please read carefully to avoid confusion.

---

## 📌 Running Tests

### **All tests (frontend + backend)**

```bash
npm test
```

👉 Runs frontend unit/integration tests **and** backend tests once.

---

### **Frontend tests (React)**

* Run once:

  ```bash
  npm run test:frontend
  ```
* Watch mode (reruns on file changes):

  ```bash
  npm run test:watch:frontend
  ```

---

### **Backend tests (Node/Express API)**

* Run once:

  ```bash
  npm run test:backend
  ```
* Watch mode:

  ```bash
  npm run test:watch:backend
  ```

---

### **End-to-End (E2E) tests (Cypress)**

* Run headless (CI/CD):

  ```bash
  npm run test:e2e
  ```
* Open Cypress GUI:

  ```bash
  npm run cy:open
  ```

---

## 📌 Test Coverage

### **Frontend coverage**

```bash
npm run test:coverage:frontend
```

→ Report saved in `coverage/frontend/`

### **Backend coverage**

```bash
npm run test:coverage:backend
```

→ Report saved in `coverage/backend/`

### **Combined coverage (frontend + backend)**

```bash
npm run test:coverage
```

---

## 📌 JUnit Reports

For CI/CD integration:

* Frontend report: `reports/junit-frontend.xml`
* Backend report: `reports/junit-backend.xml`

---

## 📌 Thresholds

Both frontend and backend enforce **80% coverage minimum** across:

* branches
* functions
* lines
* statements

Tests will fail if coverage falls below this.

---

✅ **Summary**:

* `npm test` → everything.
* `npm run test:frontend` / `npm run test:backend` → scoped.
* Coverage is split (`coverage/frontend`, `coverage/backend`) but can be merged in CI if needed.

---

Do you also want me to **add a coverage merge script** (so `npm run test:coverage` outputs a single unified HTML report combining frontend + backend)? That’s often helpful in CI dashboards.
