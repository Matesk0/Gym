# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Feature Development & Git Workflow

Whenever implementing new features or making structural code changes:
1. **Branching**: Always create a new topic/feature branch before writing code (`git checkout -b feat/feature-name`).
2. **Conventional Commits**: Format commit messages using standard Conventional Commits structure (`feat: ...`, `fix: ...`, `docs: ...`, `test: ...`).
3. **Tests & Verification**: Write unit tests for new features/logic (`npm test`), and verify clean TypeScript typechecking (`npm run typecheck`) and build export (`npm run build:check`).
4. **Integration**: Fix any broken tests or build errors, merge the feature branch into `main` clean without conflicts and push changes.

# Verification & Build Commands

- `npm run typecheck`: Runs TypeScript compiler check (`tsc --noEmit`).
- `npm test`: Runs unit test suite (`jest`).
- `npm run build:check`: Exports Expo app bundle to verify zero bundling errors (`npx expo export`).
- `npm run check`: Runs the complete pipeline in optimal order (`npm run typecheck && npm run test && npm run build:check`).


