import pandas as pd
import json
from pathlib import Path

data_dir = Path('data/mtsamples.csv')

if data_dir.exists():
    df = pd.read_csv(data_dir)
    print(f"Total records: {len(df)}")
    print(f"Columns: {df.columns.tolist()}")
else:
    print("Download from Kaggle: kaggle datasets download -d tboyle10/medicaltranscriptions")
    print("Then extract: unzip medicaltranscriptions.zip -d data/")
    exit(1)

clinical_notes = []

for idx, row in df.iterrows():
    if idx >= 100:
        break
    
    if pd.isna(row['transcription']):
        continue
    
    note = {
        'patient_id': f'P{idx:05d}',
        'note_text': row['transcription'][:3000],
        'medical_specialty': row['medical_specialty'],
        'sample_name': row['sample_name']
    }
    clinical_notes.append(note)

with open('clinical_notes.json', 'w') as f:
    json.dump(clinical_notes, f, indent=2)

print(f"\nSaved {len(clinical_notes)} clinical notes to clinical_notes.json")
print(f"Sample specialties: {set(n['medical_specialty'] for n in clinical_notes)}")