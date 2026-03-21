import json
import time
from medgemma_agents import ClinicalNote, ClinicalWorkflowOrchestrator

with open('clinical_notes.json', 'r') as f:
    notes_data = json.load(f)

orchestrator = ClinicalWorkflowOrchestrator()
results = []
times = []

print("=" * 60)
print("PROCESSING CLINICAL NOTES")
print("=" * 60)

for idx, note_data in enumerate(notes_data[:20]):
    print(f"\n[{idx + 1}/{min(20, len(notes_data))}] {note_data['medical_specialty']}")
    
    clinical_note = ClinicalNote(
        patient_id=note_data['patient_id'],
        note_text=note_data['note_text'],
        medications=[]
    )
    
    start = time.time()
    result = orchestrator.process_note(clinical_note)
    elapsed = time.time() - start
    
    result['medical_specialty'] = note_data['medical_specialty']
    results.append(result)
    times.append(elapsed)
    
    print(f"    Time: {elapsed:.3f}s, Tools: {result['tools_invoked']}")

with open('results.json', 'w') as f:
    json.dump(results, f, indent=2)

print("\n" + "=" * 60)
print(f"PROCESSED {len(results)} NOTES")
print(f"Average time: {sum(times)/len(times):.3f}s per note")
print(f"Results saved to results.json")
print("=" * 60)