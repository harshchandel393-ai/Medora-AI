from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.agents.medgemma_agents import ClinicalNote, ClinicalWorkflowOrchestrator

app = Flask(__name__)
CORS(app)

orchestrator = ClinicalWorkflowOrchestrator()


@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "Ready",
        "version": "1.0",
        "agents": ["clinical_analyzer", "risk_detector", "drug_interaction", "recommendation"]
    })


@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        
        if not data.get('note_text'):
            return jsonify({"error": "note_text required"}), 400
        
        note = ClinicalNote(
            patient_id=data.get('patient_id', 'DEMO-001'),
            note_text=data.get('note_text'),
            medications=data.get('medications', [])
        )
        
        result = orchestrator.process_note(note)
        
        return jsonify({"success": True, "data": result})
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/agents', methods=['GET'])
def get_agents():
    return jsonify({
        "agents": [
            {
                "name": "Clinical Analyzer",
                "type": "clinical_analyzer",
                "tools": ["extract_symptoms", "identify_conditions", "classify_severity"]
            },
            {
                "name": "Risk Detector",
                "type": "risk_detector",
                "tools": ["detect_critical_values", "flag_abnormalities", "assess_urgency"]
            },
            {
                "name": "Drug Interaction",
                "type": "drug_interaction",
                "tools": ["check_interactions", "check_contraindications", "verify_dosage"]
            },
            {
                "name": "Recommendation",
                "type": "recommendation",
                "tools": ["suggest_tests", "suggest_treatments", "predict_outcomes"]
            }
        ]
    })


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
