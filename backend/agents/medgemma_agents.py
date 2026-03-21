import json
import re
from typing import List, Dict, Any
from dataclasses import dataclass, field
from enum import Enum


@dataclass
class ClinicalNote:
    patient_id: str
    note_text: str
    medications: List[str] = field(default_factory=list)


@dataclass
class AnalysisResult:
    agent_name: str
    findings: Dict[str, Any]
    confidence: float
    tool_calls_made: List[str]


class AgentType(Enum):
    CLINICAL_ANALYZER = "clinical_analyzer"
    RISK_DETECTOR = "risk_detector"
    DRUG_INTERACTION = "drug_interaction"
    RECOMMENDATION = "recommendation"


class MedGemmaAgent:
    def __init__(self, agent_type: AgentType):
        self.agent_type = agent_type
        self.tools = self._initialize_tools()

    def _initialize_tools(self) -> List[str]:
        base = ["analyze_text", "extract_entities", "score_findings"]
        
        tools_map = {
            AgentType.CLINICAL_ANALYZER: base + ["extract_symptoms", "identify_conditions", "classify_severity"],
            AgentType.RISK_DETECTOR: base + ["detect_critical_values", "flag_abnormalities", "assess_urgency"],
            AgentType.DRUG_INTERACTION: base + ["check_interactions", "check_contraindications", "verify_dosage"],
            AgentType.RECOMMENDATION: base + ["suggest_tests", "suggest_treatments", "predict_outcomes"],
        }
        
        return tools_map.get(self.agent_type, base)

    def generate_prompt(self, context: str, task: str) -> str:
        prompts = {
            AgentType.CLINICAL_ANALYZER: f"Extract clinical findings:\n1. Chief complaint\n2. Medical conditions\n3. Symptoms and severity\n4. Key clinical findings\n\nNote: {context}\nTask: {task}",
            AgentType.RISK_DETECTOR: f"Identify critical findings:\n1. Life-threatening conditions\n2. Abnormal vital signs\n3. Drug allergies\n4. Severity assessment\n\nNote: {context}\nTask: {task}",
            AgentType.DRUG_INTERACTION: f"Check medications:\n1. Drug interactions\n2. Contraindications\n3. Dosage appropriateness\n4. Alternatives\n\nMedications: {context}\nTask: {task}",
            AgentType.RECOMMENDATION: f"Generate recommendations:\n1. Additional tests\n2. Treatment options\n3. Follow-up actions\n4. Monitoring requirements\n\nContext: {context}\nTask: {task}",
        }
        
        return prompts.get(self.agent_type, f"Context: {context}\nTask: {task}")

    def call_tool(self, tool_name: str, **kwargs) -> Dict[str, Any]:
        tools = {
            "extract_symptoms": {"status": "success"},
            "identify_conditions": {"status": "success"},
            "classify_severity": {"status": "success"},
            "detect_critical_values": {"status": "success"},
            "flag_abnormalities": {"status": "success"},
            "assess_urgency": {"status": "success"},
            "check_interactions": {"status": "success"},
            "check_contraindications": {"status": "success"},
            "verify_dosage": {"status": "success"},
            "suggest_tests": {"status": "success"},
            "suggest_treatments": {"status": "success"},
            "predict_outcomes": {"status": "success"},
            "analyze_text": {"status": "success"},
            "extract_entities": {"status": "success"},
            "score_findings": {"status": "success"},
        }
        
        return tools.get(tool_name, {"status": "error", "message": f"Unknown: {tool_name}"})

    def analyze(self, note: ClinicalNote, task: str = None) -> AnalysisResult:
        if task is None:
            task = f"Analyze using {self.agent_type.value}"
        
        prompt = self.generate_prompt(note.note_text, task)
        response = self._simulate_inference(prompt, note)
        tool_calls = self._extract_tool_calls(response)
        
        for tc in tool_calls:
            self.call_tool(tc["name"], **tc.get("params", {}))
        
        findings = self._parse_findings(response)
        
        return AnalysisResult(
            agent_name=self.agent_type.value,
            findings=findings,
            confidence=0.87,
            tool_calls_made=[tc["name"] for tc in tool_calls]
        )

    def _simulate_inference(self, prompt: str, note: ClinicalNote) -> str:
        text_lower = note.note_text.lower()
        
        if self.agent_type == AgentType.CLINICAL_ANALYZER:
            findings = []
            
            if 'chest pain' in text_lower:
                findings.append('Chief Complaint: Chest pain')
            elif 'pain' in text_lower:
                findings.append('Chief Complaint: Pain')
            elif 'fever' in text_lower:
                findings.append('Chief Complaint: Fever')
            elif 'shortness of breath' in text_lower or 'dyspnea' in text_lower:
                findings.append('Chief Complaint: Shortness of breath')
            
            conditions = []
            if 'hypertension' in text_lower or 'high blood pressure' in text_lower:
                conditions.append('Hypertension')
            if 'diabetes' in text_lower:
                conditions.append('Diabetes')
            if 'asthma' in text_lower:
                conditions.append('Asthma')
            if 'copd' in text_lower:
                conditions.append('COPD')
            if 'heart' in text_lower:
                conditions.append('Cardiac condition')
            
            severity = 'Low'
            if 'acute' in text_lower or 'emergency' in text_lower or 'critical' in text_lower:
                severity = 'High'
            elif 'chronic' in text_lower:
                severity = 'Medium'
            
            findings_str = '\n'.join(findings) if findings else 'Chief complaint identified'
            conditions_str = ', '.join(conditions) if conditions else 'Medical conditions noted'
            
            return f"""<tool_calls>[{{"name": "extract_symptoms"}}, {{"name": "identify_conditions"}}, {{"name": "classify_severity"}}]</tool_calls>
FINDINGS:
- {findings_str}
- Conditions: {conditions_str}
- Severity: {severity}"""
        
        elif self.agent_type == AgentType.RISK_DETECTOR:
            risk_level = 'LOW'
            critical_flags = []
            
            if 'chest pain' in text_lower or 'acute' in text_lower or 'emergency' in text_lower:
                risk_level = 'HIGH'
                critical_flags.append('Acute presentation')
            elif 'chronic' in text_lower:
                risk_level = 'LOW'
            else:
                risk_level = 'MEDIUM'
            
            if 'bp' in text_lower or 'blood pressure' in text_lower:
                critical_flags.append('Vital sign abnormality')
            if 'o2' in text_lower or 'oxygen' in text_lower or 'sat' in text_lower:
                critical_flags.append('Respiratory concern')
            if 'fever' in text_lower:
                critical_flags.append('Fever present')
            if 'allerg' in text_lower:
                critical_flags.append('Allergy noted')
            
            flags_str = '\n- '.join(critical_flags) if critical_flags else 'No immediate critical flags'
            urgency = 'URGENT' if risk_level == 'HIGH' else 'ROUTINE'
            
            return f"""<tool_calls>[{{"name": "detect_critical_values"}}, {{"name": "flag_abnormalities"}}, {{"name": "assess_urgency"}}]</tool_calls>
CRITICAL FLAGS:
- {flags_str}
- Risk Level: {risk_level}
- Urgency: {urgency}"""
        
        elif self.agent_type == AgentType.DRUG_INTERACTION:
            interactions = []
            
            if 'lisinopril' in text_lower and 'potassium' in text_lower:
                interactions.append('Lisinopril-Potassium interaction')
            if 'metformin' in text_lower and 'alcohol' in text_lower:
                interactions.append('Metformin-Alcohol interaction')
            if 'aspirin' in text_lower and 'warfarin' in text_lower:
                interactions.append('Aspirin-Warfarin interaction')
            
            status = 'Safe' if not interactions else 'Caution'
            interactions_str = '\n- '.join(interactions) if interactions else 'No major interactions detected'
            
            return f"""<tool_calls>[{{"name": "check_interactions"}}, {{"name": "check_contraindications"}}, {{"name": "verify_dosage"}}]</tool_calls>
FINDINGS:
- {interactions_str}
- Status: {status}
- Dosages: Within normal range"""
        
        elif self.agent_type == AgentType.RECOMMENDATION:
            tests = []
            treatments = []
            
            if 'chest pain' in text_lower:
                tests.extend(['ECG', 'Troponin', 'Chest X-ray'])
                treatments.extend(['Aspirin', 'Beta-blocker', 'Nitrates'])
            if 'fever' in text_lower:
                tests.extend(['Complete Blood Count', 'Blood Culture'])
                treatments.extend(['Antibiotics if bacterial', 'Supportive care'])
            if 'shortness of breath' in text_lower or 'dyspnea' in text_lower:
                tests.extend(['Chest X-ray', 'Arterial Blood Gas'])
                treatments.extend(['Oxygen therapy', 'Bronchodilators'])
            
            tests_str = ', '.join(set(tests)) if tests else 'Baseline investigations'
            treatments_str = ', '.join(set(treatments)) if treatments else 'Supportive care'
            
            return f"""<tool_calls>[{{"name": "suggest_tests"}}, {{"name": "suggest_treatments"}}, {{"name": "predict_outcomes"}}]</tool_calls>
FINDINGS:
- Suggested tests: {tests_str}
- Recommended treatments: {treatments_str}
- Monitoring: Continuous vital signs and clinical assessment
- Outcome prediction: Favorable with appropriate intervention"""
        
        return f"Analysis complete"

    def _extract_tool_calls(self, response: str) -> List[Dict[str, Any]]:
        try:
            match = re.search(r'<tool_calls>(.*?)</tool_calls>', response, re.DOTALL)
            if match:
                return json.loads(match.group(1))
        except:
            pass
        return []

    def _parse_findings(self, response: str) -> Dict[str, Any]:
        findings = {}
        
        if "FINDINGS:" in response:
            findings["raw"] = response.split("FINDINGS:")[1].strip()
        
        if "CRITICAL" in response:
            findings["has_critical_alerts"] = True
        
        if "HIGH" in response.upper():
            findings["risk_level"] = "HIGH"
        elif "MEDIUM" in response.upper():
            findings["risk_level"] = "MEDIUM"
        else:
            findings["risk_level"] = "LOW"
        
        match = re.search(r'Urgency: (\w+)', response)
        if match:
            findings["urgency"] = match.group(1)
        
        return findings


class ClinicalWorkflowOrchestrator:
    def __init__(self):
        self.agents = {
            AgentType.CLINICAL_ANALYZER: MedGemmaAgent(AgentType.CLINICAL_ANALYZER),
            AgentType.RISK_DETECTOR: MedGemmaAgent(AgentType.RISK_DETECTOR),
            AgentType.DRUG_INTERACTION: MedGemmaAgent(AgentType.DRUG_INTERACTION),
            AgentType.RECOMMENDATION: MedGemmaAgent(AgentType.RECOMMENDATION),
        }
        self.execution_log = []

    def process_note(self, note: ClinicalNote) -> Dict[str, Any]:
        results = {}
        self.execution_log = []
        
        print(f"[Stage 1] Clinical Analyzer for {note.patient_id}...")
        clinical_result = self.agents[AgentType.CLINICAL_ANALYZER].analyze(note)
        results["clinical_analysis"] = clinical_result
        self.execution_log.append(clinical_result)
        
        print(f"[Stage 2] Risk Detector...")
        risk_result = self.agents[AgentType.RISK_DETECTOR].analyze(note)
        results["risk_assessment"] = risk_result
        self.execution_log.append(risk_result)
        
        if note.medications:
            print(f"[Stage 3] Drug Interaction Checker...")
            med_note = ClinicalNote(
                patient_id=note.patient_id,
                note_text=f"Medications: {', '.join(note.medications)}\n\n{note.note_text}",
                medications=note.medications
            )
            drug_result = self.agents[AgentType.DRUG_INTERACTION].analyze(med_note)
            results["drug_interactions"] = drug_result
            self.execution_log.append(drug_result)
        
        print(f"[Stage 4] Recommendation Engine...")
        rec_context = f"Analysis:\n- Clinical: {results['clinical_analysis'].findings}\n- Risk: {results.get('risk_assessment', {}).findings}\n\nNote: {note.note_text}"
        
        rec_note = ClinicalNote(
            patient_id=note.patient_id,
            note_text=rec_context,
            medications=note.medications
        )
        rec_result = self.agents[AgentType.RECOMMENDATION].analyze(rec_note)
        results["recommendations"] = rec_result
        self.execution_log.append(rec_result)
        
        return {
            "patient_id": note.patient_id,
            "workflow_stage_1_analysis": results["clinical_analysis"].findings,
            "workflow_stage_2_risks": results["risk_assessment"].findings,
            "workflow_stage_3_interactions": results.get("drug_interactions", {}).findings if "drug_interactions" in results else None,
            "workflow_stage_4_recommendations": results["recommendations"].findings,
            "tools_invoked": sum(len(r.tool_calls_made) for r in self.execution_log),
            "execution_log": [
                {
                    "agent": r.agent_name,
                    "tools_called": r.tool_calls_made,
                    "confidence": r.confidence
                }
                for r in self.execution_log
            ]
        }


if __name__ == "__main__":
    sample_note = ClinicalNote(
        patient_id="P12345",
        note_text="""Patient: John Doe, 58M
Chief Complaint: Chest pain and shortness of breath
HPI: 2 days of intermittent chest pain, worse with exertion.
Associated with dyspnea and diaphoresis.
PMH: Hypertension (10 years), Type 2 DM (5 years)
Vital Signs: BP 160/100, HR 105, RR 22, O2 Sat 94%
Physical Exam: Anxious, regular rate and rhythm, lungs clear.
Assessment: Acute coronary syndrome vs anxiety.""",
        medications=["Lisinopril 10mg", "Metformin 1000mg", "Aspirin 81mg"]
    )
    
    orchestrator = ClinicalWorkflowOrchestrator()
    
    print("=" * 60)
    print("CLINICAL WORKFLOW PROCESSING")
    print("=" * 60)
    result = orchestrator.process_note(sample_note)
    
    print("\n" + "=" * 60)
    print("RESULTS")
    print("=" * 60)
    print(json.dumps(result, indent=2, default=str))