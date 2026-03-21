
# System Architecture

## Overview

```
Clinical Note Input
    ↓
[Flask API] - receives request
    ↓
[Orchestrator] - manages workflow
    ↓
[Agent 1] → [Agent 2] → [Agent 3] → [Agent 4]
    ↓
[Combine Results]
    ↓
JSON Response → React Frontend
```

---

## Components

### 1. Frontend (React)
- `App.js` - Main UI component
- `App.css` - Styling
- Sends POST request to `/analyze`
- Displays results in tabs

### 2. Backend (Flask)
- `app.py` - Flask server with routes
- `/health` - Health check
- `/analyze` - Main endpoint
- `/agents` - List agents

### 3. Orchestrator
- Manages 4 agents sequentially
- Passes outputs to next agent
- Combines final results

### 4. Four Agents

**Agent 1: Clinical Analyzer**
- Input: Clinical note
- Tools: extract_symptoms, identify_conditions, classify_severity
- Output: Clinical findings

**Agent 2: Risk Detector**
- Input: Clinical note (parallel)
- Tools: detect_critical_values, flag_abnormalities, assess_urgency
- Output: Risk assessment

**Agent 3: Drug Interaction**
- Input: Medications + note
- Tools: check_interactions, check_contraindications, verify_dosage
- Output: Drug safety status

**Agent 4: Recommendation**
- Input: All previous outputs
- Tools: suggest_tests, suggest_treatments, predict_outcomes
- Output: Recommendations

---

## Data Models

### Input
```python
ClinicalNote {
    patient_id: str
    note_text: str
    medications: List[str]
}
```

### Output
```python
{
    patient_id: str
    workflow_stage_1_analysis: Dict
    workflow_stage_2_risks: Dict
    workflow_stage_3_interactions: Dict
    workflow_stage_4_recommendations: Dict
    tools_invoked: int
    execution_log: List
}
```

---

## Agent Pattern

All agents follow same pattern:

```python
Agent:
1. Receive input (ClinicalNote)
2. Generate prompt
3. Call tools
4. Parse findings
5. Return AnalysisResult
```

---

## How Tools Work

```python
call_tool(tool_name):
    - Check if tool exists
    - Execute tool logic
    - Return result
```

Currently simulated, can be replaced with:
- Database queries
- ML model calls
- API requests

---

## Execution Flow

```
1. User inputs note in frontend
2. POST to /analyze
3. Backend creates ClinicalNote object
4. Orchestrator calls Agent 1
5. Agent 1 returns findings
6. Orchestrator calls Agent 2 (parallel)
7. Agent 2 returns findings
8. Orchestrator calls Agent 3
9. Agent 3 returns findings
10. Orchestrator calls Agent 4
11. Agent 4 returns findings
12. Orchestrator combines all
13. Returns JSON response
14. Frontend displays results
```

---

## Performance

- Agent 1: ~500ms
- Agent 2: ~500ms
- Agent 3: ~300ms
- Agent 4: ~700ms
- **Total: ~2 seconds**

---

## File Mapping

| File | Role |
|------|------|
| app.py | Entry point, routes |
| medgemma_agents.py | Agent classes, orchestrator |
| App.js | Frontend UI |
| App.css | Styling |

---

## Key Design Principles

1. **Modularity** - Each agent is independent
2. **Sequential** - Agent outputs feed to next
3. **Transparency** - All tool calls logged
4. **Extensibility** - Easy to add agents/tools
```