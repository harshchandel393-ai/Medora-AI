import json
import time
from medgemma_agents import ClinicalNote, ClinicalWorkflowOrchestrator

with open('clinical_notes.json', 'r') as f:
    notes_data = json.load(f)

print("=" * 60)
print("PERFORMANCE BENCHMARK")
print("=" * 60)

orchestrator = ClinicalWorkflowOrchestrator()
test_notes = notes_data[:10]

times = []
tool_counts = []

for idx, note_data in enumerate(test_notes):
    print(f"\n[{idx + 1}/10] {note_data['medical_specialty']}")
    
    clinical_note = ClinicalNote(
        patient_id=note_data['patient_id'],
        note_text=note_data['note_text'],
        medications=[]
    )
    
    start = time.time()
    result = orchestrator.process_note(clinical_note)
    elapsed = time.time() - start
    
    times.append(elapsed)
    tool_counts.append(result['tools_invoked'])
    
    print(f"  Time: {elapsed:.3f}s")
    print(f"  Tools: {result['tools_invoked']}")

print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)

avg_time = sum(times) / len(times)
avg_tools = sum(tool_counts) / len(tool_counts)

print(f"Average processing time: {avg_time:.3f} seconds per case")
print(f"Average tools per case: {avg_tools:.1f}")

manual_time = 45
speedup = (manual_time * 60) / avg_time

print(f"\nComparison to Manual Review (45 minutes):")
print(f"  Manual review time: {manual_time} minutes")
print(f"  System time: {avg_time:.3f} seconds")
print(f"  Speedup: {speedup:.0f}x faster")
print(f"  Time saved per case: {manual_time - (avg_time/60):.1f} minutes")

print("\n" + "=" * 60)