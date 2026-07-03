<div align="center">
  <br />
  <img src="apps/dashboard/public/logo.png" width="120" alt="AegisLLM Logo"/>
  <h1>AegisLLM</h1>
  <p>
    <strong>The open-source, event-driven Risk Engine for Large Language Models.</strong>
  </p>
  <p>
    Verify, explain, and secure every LLM request in real-time before it reaches your model.
  </p>

  <div>
    <a href="https://github.com/Adhan-Hashim/AegisLLM/releases"><img src="https://img.shields.io/github/v/release/Adhan-Hashim/AegisLLM?style=flat-square&color=blue" alt="GitHub release" /></a>
    <a href="https://github.com/Adhan-Hashim/AegisLLM/actions"><img src="https://img.shields.io/badge/CI-Passing-brightgreen?style=flat-square" alt="Build Status" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License: MIT" /></a>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=FastAPI&logoColor=white" alt="FastAPI" />
  </div>
</div>

<br />

Most LLM applications trust every prompt. AegisLLM helps you build a secure perimeter, detecting **prompt injection**, **jailbreaks**, **PII leakage**, and **toxicity** out of band or inline without slowing down your user experience.

---

## ✨ The AegisLLM Platform

AegisLLM goes beyond being a simple API by providing a comprehensive forensic and authoring platform built for the enterprise.

- ⚡ **Streaming Engine**: Evaluate risks live via Server-Sent Events with sub-20ms latency.
- 🔍 **Forensic Replay**: Don't just log events. Step through the exact reasoning graph to understand *why* a prompt was blocked or rewritten.
- 🗂️ **Sessions Catalog**: Search, index, and filter millions of intercepted sessions instantly.
- 🛠️ **Rules Studio**: Author detectors dynamically using a pure declarative YAML schema. 
- 🧪 **Attack Lab**: A built-in SSE streaming workspace to stress-test your rules with malicious payloads.

---

## 🚀 5-Minute Quickstart

AegisLLM is designed for maximum developer velocity and runs anywhere via Docker Compose.

### 1. Clone the repository
```bash
git clone https://github.com/Adhan-Hashim/AegisLLM.git
cd AegisLLM
```

### 2. Start the stack 
Boot up PostgreSQL, Redis, the Python API, and the Next.js Dashboard.
```bash
docker compose up -d
```

### 3. Verify the installation
```bash
./scripts/verify.ps1   # Windows
# or ./scripts/verify.sh on Linux/Mac
```

🎉 **That's it.**
- Open the Dashboard at [http://localhost:3000](http://localhost:3000)
- Access the REST API Docs at [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📊 Performance Benchmarks

AegisLLM is built for the critical path. Our engine executes complex multi-rule evaluations concurrently.

| Category             | Accuracy | Avg Latency |
|----------------------|----------|-------------|
| **Prompt Injection** | `98.6%`  | `18.3 ms`   |
| **PII Detection**    | `97.3%`  | `14.5 ms`   |
| **SQL Injection**    | `96.8%`  | `20.4 ms`   |
| **Safe Prompts**     | `99.1%`  | `12.5 ms`   |
| **Overall**          | **98.6%**| **14.4 ms** |

> *Benchmarks generated against `v1.0.0` across a 7,950-example corpus via `benchmarks/run_benchmarks.py`.*

---

## 🏗️ Architecture Stack

AegisLLM is powered by a modern, high-performance tech stack:

*   **API & Risk Engine:** Python, FastAPI, Pydantic
*   **Frontend Dashboard:** Next.js, React, TailwindCSS, TypeScript
*   **State & Streaming:** Redis, Server-Sent Events (SSE)
*   **Persistence:** PostgreSQL

---

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

- 🏛️ [Architecture Guide](ARCHITECTURE.md)
- 🔌 [API Reference](docs/api/README.md)
- 📝 [Rules Studio Reference](docs/rules-studio/README.md)
- 🕵️‍♂️ [Replay & Explanation Engine](docs/replay/README.md)

---

## 🤝 Contributing

We welcome contributions of all sizes! Whether it's adding a new Rule Pack, optimizing the engine, or fixing typos.

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to set up your local development environment, run the typecheckers, linters, and execute the test suites.

## 🛡️ Security

If you discover a security vulnerability, please refer to [SECURITY.md](SECURITY.md) for our responsible disclosure process. Do not file a public issue for security-related flaws.

---

<div align="center">
  <p>Built with ❤️ for the open-source AI community.</p>
  <p>
    <a href="LICENSE">MIT License</a> &copy; Adhan Hashim
  </p>
</div>
