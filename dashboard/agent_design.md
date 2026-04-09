# Agentic AI System Design

The PlaceIQ AI is designed via a lightweight **ReAct** (Reason + Act) loop pattern, prioritizing modular execution over massive foundational models. 

## 1. Agent Design Philosophy
> *"AI is used for reasoning and explanation, while core decisions are driven by deterministic logic."*

Because hackathons require speed and reliability, heavy ML is avoided. The agents use heuristics and weighted math for "deciding," and Language Models/Rule Engines strictly to "explain" or "extract" the data.

## 2. The Core Agent Loop
Each agent's standard execution cycle follows:
1. **OBSERVE**: Collect variables (e.g. Resume parsed data, Company requirement JSON, and previous Agent Memory context).
2. **REASON**: Apply heuristic logic or LLM extraction. Evaluate readiness vs requirements.
3. **PLAN**: Outline deterministic output object (e.g., scoring data structure).
4. **ACT**: Push result to the Decision Engine or execute a database write.
5. **RETURN**: Send normalized response back to the Orchestrator.

## 3. Specialized Multi-Agent Breakdown

### A. The Orchestrator
The central switchboard. When an event hits the backend (like a resume upload), the Orchestrator sequences the work.
- Decides *which* agent needs to act next.
- Passes outputs from one agent as inputs to another.

### B. Resume Analyzer
- **Focus**: Extraction and Structuring.
- Reads a raw unstructured string or PDF blob and maps it utilizing keyword arrays or lightweight NLP to detect Skills, CGPA, and Projects.
- **Output**: Clean JSON schema representing the student.

### C. Company Matcher
- **Focus**: Comparing demand vs supply.
- Uses strict Jaccard Similarity / TF-IDF heuristics mapping the Student JSON to the structured Company pipeline JSON.
- **Output**: Base Match Rate percentage.

### D. Selection Predictor
- **Focus**: Contextual modification.
- Augments match rate focusing on historical boundaries. If a company strictly rejects `< 7.0 CGPA`, the Predictor flatlines the probability, overriding the raw text-match.

### E. Action Planner
- **Focus**: Human translation and actionable insights.
- Reviews weaknesses flagged by the Matcher and the Readiness Engine. 
- Analyzes the **Agent Memory Layer** to ensure it isn't repeating old advice.
- **Output**: "Complete 2 more Mock Interviews before applying to Amazon."

## 4. Layer Integration

### Agent Memory Layer
- Retains context. Stored on the user profile in the DB.
- **Why**: Allows personalized suggestions and avoids circular advice pipelines.
- **Fields tracked**: Past recommendations, historical application rejection logic, prior skill gaps identified.

### Decision Engine Layer 
The mathematical anchor uniting the Agents outputs.
- **Formula**: `Final Score = (Match Score × 0.5) + (Selection Probability × 0.3) + (Deadline Urgency × 0.2)`
- Evaluates the inputs of the agents and generates a hard numerical ranking to safely list recommendations UI side without hallucination risks.
