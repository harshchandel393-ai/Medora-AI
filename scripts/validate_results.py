import json
from collections import defaultdict

with open('results.json', 'r') as f:
    results = json.load(f)

print("=" * 60)
print("VALIDATION REPORT")
print("=" * 60)

print(f"\nTotal processed: {len(results)}")

specialties = defaultdict(int)
agent_execution = defaultdict(int)
critical_flags = 0
high_risk_cases = 0

for result in results:
    specialty = result.get('medical_specialty', 'Unknown')
    specialties[specialty] += 1
    
    if result.get('workflow_stage_2_risks', {}).get('has_critical_alerts'):
        critical_flags += 1
    
    if result.get('workflow_stage_2_risks', {}).get('risk_level') == 'HIGH':
        high_risk_cases += 1
    
    for log in result.get('execution_log', []):
        agent_execution[log['agent']] += 1

print("\nMedical Specialties Processed:")
for spec, count in sorted(specialties.items(), key=lambda x: x[1], reverse=True):
    print(f"  {spec}: {count}")

print(f"\nCritical Cases Detected: {critical_flags}/{len(results)}")
print(f"High Risk Cases: {high_risk_cases}/{len(results)}")

print("\nAgent Execution Summary:")
for agent, count in sorted(agent_execution.items()):
    print(f"  {agent}: {count} executions")

avg_tools = sum(r['tools_invoked'] for r in results) / len(results)
print(f"\nAverage tools invoked per case: {avg_tools:.1f}")

print("\n" + "=" * 60)