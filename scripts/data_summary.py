import json
import pandas as pd

with open('clinical_notes.json', 'r') as f:
    notes = json.load(f)

summary = {
    'dataset_name': 'Medical Transcriptions from Kaggle',
    'total_records': len(notes),
    'records_processed': min(100, len(notes)),
    'specialties': list(set(n.get('medical_specialty', 'Unknown') for n in notes)),
    'total_specialties': len(set(n.get('medical_specialty', 'Unknown') for n in notes)),
    'avg_note_length': sum(len(n['note_text']) for n in notes) / len(notes),
}

with open('data_summary.json', 'w') as f:
    json.dump(summary, f, indent=2)

print("\n" + "=" * 60)
print("DATA SUMMARY")
print("=" * 60)
print(f"Dataset: {summary['dataset_name']}")
print(f"Total Records: {summary['total_records']}")
print(f"Records Processed: {summary['records_processed']}")
print(f"Specialties: {summary['total_specialties']}")
print(f"Avg Note Length: {summary['avg_note_length']:.0f} chars")
print("=" * 60)