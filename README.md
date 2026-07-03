# AegisLLM

![GitHub Release](https://img.shields.io/badge/release-v1.0.0--rc.1-blue)
![CI](https://img.shields.io/badge/CI-Passing-brightgreen)

The open-source, event-driven Risk Engine for Large Language Models.

Most LLM applications trust every prompt. AegisLLM helps you verify, explain, and secure every request **before** it reaches your model. Detect prompt injection, jailbreaks, PII, and toxicity in real-time with deterministic and AI-driven rules.

## The AegisLLM Platform
AegisLLM goes beyond being a simple API by providing a comprehensive forensic and authoring platform:
- **Streaming Engine**: Evaluate risks live via Server-Sent Events with incredibly low latency.
- **Forensic Replay**: Don't just log events. Step through the exact reasoning graph to understand why a prompt was blocked.
- **Sessions Catalog**: Search and filter millions of intercepted sessions instantly.
- **Rules Studio**: Author detectors dynamically using a pure declarative YAML schema.

## 🚀 5-Minute Quickstart

AegisLLM is designed to run anywhere via Docker Compose.

```bash
# 1. Clone the repository
git clone https://github.com/Adhan-Hashim/AegisLLM.git
cd AegisLLM

# 2. Start the stack (PostgreSQL, Redis, API, Dashboard)
docker compose up -d

# 3. Verify the installation
./scripts/verify.ps1 # (or verify.sh on Linux/Mac)
```

**That's it.** 
- Open the Dashboard at `http://localhost:3000`
- Access the REST API at `http://localhost:8000/docs`

## 📊 Benchmarks

AegisLLM is built for the critical path. Our engine executes complex multi-rule evaluations concurrently.

| Category             | Accuracy | Avg Latency |
|----------------------|----------|-------------|
| Prompt Injection     | 98.4%    | 18.2 ms     |
| PII Detection        | 97.2%    | 14.5 ms     |
| SQL Injection        | 96.8%    | 19.8 ms     |
| Safe Prompts         | 99.1%    | 12.1 ms     |
| **Overall**          | **98.4%**| **14.2 ms** |

*(Benchmarks generated against v1.0.0-rc.0 via `benchmarks/run_benchmarks.py`)*

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:
- [Architecture Guide](ARCHITECTURE.md)
- [API Reference](docs/api/README.md)
- [Rules Studio Reference](docs/rules-studio/README.md)
- [Replay & Explanation Engine](docs/replay/README.md)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to run the typecheckers, linters, and test suites.

## 🛡️ Security

If you discover a security vulnerability, please refer to [SECURITY.md](SECURITY.md) for our responsible disclosure process.
