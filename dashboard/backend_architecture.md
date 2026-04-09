# Backend Architecture (Node.js)

The PlaceIQ backend uses Express within Node.js, focusing heavily on a fast, modular structure. The AI generation focuses on deterministic scoring and heuristics to remain hackathon-friendly and lightning-fast.

## 1. Node.js Project Structure

```text
/backend
├── src/
│   ├── api/
│   │   ├── controllers/      # Route handlers mapping requests to services
│   │   ├── routes/           # Express router configs
│   │   └── middlewares/      # Auth & validation
│   ├── agents/
│   │   ├── orchestrator.js   # Central switchboard for AI requests
│   │   ├── resumeAnalyzer.js # Heuristic keyword matching
│   │   ├── companyMatcher.js # Skill overlapping evaluation
│   │   ├── predictor.js      # Probability estimation
│   │   └── planner.js        # Actionable insight generator
│   ├── core/
│   │   ├── decisionEngine.js # Match * 0.5 + Prob * 0.3 + Time * 0.2
│   │   ├── readinessScore.js # Global 0-100 baseline evaluator
│   │   ├── adminIntel.js     # Batch aggregation & forecasting
│   │   └── memoryLayer.js    # Interface for agent action history
│   ├── services/
│   │   ├── eventEngine.js    # WebSocket & condition trigger manager
│   │   └── database.js       # DB connection & models
│   ├── utils/
│   │   └── mockData.js       # 50 students, 20 companies population logic
│   ├── server.js             # Express app & Socket.io initialization
│└── package.json
```

## 2. Module Responsibilities

### 2.1 API Layer (`/api`)
- Handles incoming traditional REST requests.
- Maps endpoints like `/api/v1/students/score` directly to core logic.
- Purely stateless; extracts ID and passes execution downward.

### 2.2 Agent Orchestrator & Services (`/agents` & `/core`)
This acts as the bridge between raw data and deterministic intelligence.
- **Orchestrator**: Maintains the ReAct observe → reason → act loop. Coordinates outputs between specialized agents.
- **Decision Engine Layer**: The critical endpoint for ranking recommendations. Returns a blended final score ensuring priority actions surface to the top.
- **Readiness Score Engine**: Computes the foundational 0-100 score utilizing CGPA, project strength, and system interaction counts.
- **Agent Memory Layer**: Tracks past tasks/suggestions so the UI doesn't ask the user to "learn React" twice.

### 2.3 Event & Alert Engine (`/services/eventEngine.js`)
Trigger-based listener functioning alongside HTTP requests. Contains logic like:
- `if (deadline < 3 days) emit('urgent_alert')`
- `if (inactivity > 5 days) emit('nudge')`
- Emits payloads up to the active WebSocket connections.

### 2.4 Admin Intelligence Layer (`/core/adminIntel.js`)
Aggregates the metadata calculated by agents to present a macro-view.
- Forecasts college-wide placement probabilities using readiness averages.
- Detects the "At-Risk Dataset" (bottom 20% readiness score) for counselor intervention.

### 2.5 Mock Data Strategy (`/utils/mockData.js`)
- Houses JSON files mimicking real scenarios (50 distinct students spanning different disciplines, 20 varied company profiles).
- Has an initialization script allowing instant backend population to hit the ground running during the hackathon evaluation. 

## 3. Scalability Considerations

- **Redis Pub/Sub integration**: Anticipating concurrent websocket load, the event engine broadcasts through Redis so multi-replica scaled instances share events.
- **Decoupled Engine Logic**: `Decision Engine` and `Readiness Score Engine` are separated from the AI Agent text output. Decisions remain reliable, fast, and deterministic, ensuring zero hallucination on hard data points.
