# Contributing to AegisLLM

We welcome contributions to AegisLLM! Our goal is to build the most robust open-source risk engine for Large Language Models.

## Development Setup

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/Adhan-Hashim/AegisLLM.git
   cd AegisLLM
   \`\`\`

2. **Start the core services (PostgreSQL, Redis):**
   \`\`\`bash
   docker compose up postgres redis -d
   \`\`\`

3. **Install Dependencies:**
   - **Backend (Python):** \`pip install -r apps/api/requirements.txt\` and \`pip install -e packages/risk-engine\`
   - **Frontend (Next.js):** \`cd apps/dashboard && npm install\`

## Pull Request Process
- Ensure all CI checks pass (\`Typecheck\`, \`Lint\`, \`Test\`).
- Provide a clear description of the problem and your solution.
- For UI changes, attach a screenshot or GIF in the PR description.

## Code Standards
- **Python**: We use \`mypy\` for type checking and \`ruff\` for linting.
- **TypeScript**: We use strict \`tsc\` and \`eslint\`.
