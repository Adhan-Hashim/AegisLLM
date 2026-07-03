AegisLLM v1.0.0

The open-source, event-driven Risk Engine for Large Language Models.
AegisLLM evaluates risks live, providing a complete forensic and authoring platform rather than just an API.

Highlights
- Attack Lab: Live streaming SSE workspace to test malicious payloads.
- Rules Studio: Declarative YAML editor for crafting deterministic and AI-driven guardrails.
- Replay Center: Forensic viewer to step through the reasoning graph and latency timeline of a blocked prompt.
- Sessions: Catalog and index of all intercepted sessions for easy filtering.
- Streaming API: Deeply integrated Server-Sent Events (SSE) pipeline for minimal latency overhead.

Performance
- 98.6% benchmark accuracy across Prompt Injection, PII, and SQL injections.
- 14.4 ms average evaluation latency for high-throughput AI platforms.

Breaking Changes
- None (Initial v1.0.0 Release)

Known Limitations
- Rule Packs scheduled for v1.1
- Knowledge Graph backend scheduled for v1.1
- Time Travel (undo/redo inside replay) scheduled for v1.1

Getting Started
\`\`\`bash
git clone https://github.com/Adhan-Hashim/AegisLLM.git
cd AegisLLM
docker compose up
\`\`\`
Visit http://localhost:3000 to launch the AegisLLM Dashboard.
