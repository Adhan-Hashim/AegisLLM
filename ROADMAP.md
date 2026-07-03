# Enterprise AI Security Platform Roadmap

## Release Candidates

Instead of sprints, the path to v1.0 is now driven by Release Candidates to ensure polish and production readiness.

### 🚀 RC1: Feature Complete
The product is feature complete. No major capabilities are missing, and no new features will be added.
- ✅ Risk Engine & REST/Streaming API
- ✅ Attack Lab
- ✅ Investigation Workspace
- ✅ Rules Studio (editing, validation, evaluation, diff, testing)
- ✅ Replay Center
- ✅ Sessions Catalog
- ⏳ Landing Page
- ⏳ API Explorer
- ⏳ End-to-end Docker Compose
- ⏳ CI/CD Green (Typecheck, Lint, Tests, Build)
- ⏳ README and Architecture documentation
- ⏳ Benchmarks generated

### ✨ RC2: Polish Complete
Focus entirely on the user experience and removing friction.
- Animations & Microinteractions
- Loading & Empty states
- Accessibility & Keyboard navigation
- Responsive layouts
- Performance profiling (Diagnostics Panel in Developer Mode)
- Error handling

### 📦 RC3: Final Release Candidate
Focus on the public-facing footprint.
- Final README updates
- Comprehensive Documentation
- Stable Docker images
- Demo GIF and Demo video
- Final bug fixes

### 🚢 v1.0: Ship

---

## Architecture Details

### Replay & Sessions Domain
- **Architecture**: `Audit Store -> Replay Session -> Session Viewer`
- **Reusability**: Replay Center, Sessions Catalog, and Benchmarks all consume the pure `SessionViewer` component.
- **Explainability**: The Graph, Timeline, and Metrics all synchronize via a single `PlaybackFrame`.

### Rules Studio
- **Architecture**: `YAML -> Parser -> Validator -> Evaluation`
- **Coverage**: **Executed Tests ÷ Available Assertions**
- **Version History**: Semantic risk/severity changes (e.g., v3 Changed RULE001 -> Severity HIGH -> CRITICAL -> Risk 42→81)
- **Export**: Rule Export (`rule.yaml`) and Report Export (`Markdown`, `JSON`)

---

## v1.1 Release (Future)
Deferred capabilities:
- Rule Compiler
- Rule Dependency Graph
- Rule Packs
- Knowledge Graph
- Time Travel
- Advanced Versioning
