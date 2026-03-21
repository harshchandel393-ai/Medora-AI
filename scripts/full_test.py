import json
from medgemma_agents import ClinicalNote, ClinicalWorkflowOrchestrator

test_cases = [
    {
        'id': 'TEST-001',
        'specialty': 'Cardiology',
        'note': 'Patient presents with acute chest pain, SOB. History of hypertension. BP 160/100. HR 105. EKG shows ST elevation in leads II, III. Troponin elevated. Patient transferred to cath lab.'
    },
    {
        'id': 'TEST-002',
        'specialty': 'Orthopedics',
        'note': 'Patient with right knee pain after fall. Physical exam shows swelling and limited ROM. X-ray negative for fracture. Prescribed NSAIDs and physical therapy.'
    },
    {
        'id': 'TEST-003',
        'specialty': 'Neurology',
        'note': 'Patient presents with sudden onset headache, neck stiffness, fever. Meningitis suspected. LP performed. CSF analysis pending. Started on antibiotics.'
    }
]

orchestrator = ClinicalWorkflowOrchestrator()

all_results = []

for test in test_cases:
    print(f"\nTesting: {test['id']} ({test['specialty']})")
    
    note = ClinicalNote(
        patient_id=test['id'],
        note_text=test['note'],
        medications=['Aspirin 81mg']
    )
    
    result = orchestrator.process_note(note)
    result['specialty'] = test['specialty']
    all_results.append(result)
    
    print(f"  Tools invoked: {result['tools_invoked']}")
    print(f"  Agents: {len(result['execution_log'])}")

with open('test_results.json', 'w') as f:
    json.dump(all_results, f, indent=2)

print("\n" + "=" * 60)
print("All tests completed. Results saved to test_results.json")
print("=" * 60)