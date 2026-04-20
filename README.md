# Playwright E2E Framework

Reusable TypeScript Playwright framework for API and UI validation with modular architecture. This repository demonstrates scalable QA automation design for regression and release confidence.

## QA Focus

- API + UI test coverage in one framework
- Modular authentication and domain-level test modules
- Maintainable test code with reusable helpers
- CI-ready execution and reporting

## Tech Stack

- Playwright
- TypeScript
- Node.js

## Suggested Architecture

```text
playwright-e2e-tests/
├── modules/                # Feature/domain modules (auth, etc.)
├── tests/                  # Scenario-oriented test specs
├── utils/                  # Shared helpers and fixtures
├── playwright.config.ts
└── package.json
```

## Setup

```bash
npm install
npx playwright install
```

## Run

```bash
npm test
npx playwright test
npx playwright test --headed
```

## Why This Repo Matters

This project highlights framework-level QA engineering skills: abstraction, maintainability, and test reliability under CI/CD workflows.
