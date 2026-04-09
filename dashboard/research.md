# Practical Research & Architectural Findings

Building a powerful, intelligent application for a hackathon requires prioritizing determinism, speed, and reliability over deep neural nets.

## 1. Agentic AI Patterns (ReAct / Planner-Executor)
The multi-agent system thrives when responsibilities are rigidly defined. 

*   **The ReAct (Reason + Act) Concept**: Traditional LLMs pause at answering a prompt. ReAct forces the agent to output a "Reasoning/Thought" block, then determine a specific "Action" from its allowed toolkit.
*   **Hackathon Adaptation**: Instead of using Langchain under the hood dynamically routing code logic, we enforce a strict Pipeline logic inside the `Orchestrator.js`.
    *   *Finding*: Using heavy abstraction layers (like Langchain) in a pure Node/Vite app slows down development and increases hallucination risks. Relying on strict JSON-Schema outputs from the LLM endpoint and parsing them directly in native JS provides reliable structured output.
    *   *Implementation*: The Orchestrator parses outputs sequentially — Analyzer → Matcher → Predictor. The LLM simply provides keyword arrays that power the deterministic logic.

## 2. Lightweight Recommendation Systems (Heuristic vs. ML)
Instead of training a collaborative filtering model, which demands a massive dataset (impractical for hackathons without pre-existing telemetry), PlaceIQ utilizes **Heuristic Weighting Models**.

*   **The Approach**: We map attributes as vectors. 
    *   Resume Skills: `[React, Node, AWS]` vs Company Needs: `[React, Azure, Postgres]`
    *   Jaccard Similarity score: Intersection (React) / Union (React, Node, AWS, Azure, Postgres). Jaccard = `1/5 (20%)`.
*   **The Findings**: Pure text-matching isn't enough. We assign weightings to context: e.g., mapping exact CGPA boundaries against company hard constraints first, effectively functioning as an initial "gate" before running skill comparisons.
*   *Implementation*: The `Decision Engine` formula: `(Match Score * 0.5) + (Prediction * 0.3) + (Deadline * 0.2)` handles the complexity without Python-based SciKit pipelines.

## 3. Real-Time Dashboards & Scalability
While polling `setInterval` REST calls is an option, it drastically limits scalability and drains mobile battery for users checking metrics.

*   **Socket.IO**: Remains the industry standard for bidirectional JS. 
*   **Finding**: The challenge in Socket.io is horizontal scaling (deploying to multiple servers later on). It requires a central message broker.
*   **Solution implemented in design**: PlaceIQ dictates the use of a lightweight Redis Pub/Sub instance. When the backend triggers an update, it hits Redis, which broadcasts to all Socket instances to guarantee client delivery.
