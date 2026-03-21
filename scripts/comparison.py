import pandas as pd

comparison_data = {
    'Metric': [
        'Time per Case',
        'Cost per Case',
        'Accuracy',
        'Deployment',
        'Scalability',
        'Privacy',
        'Special Training',
        'Availability'
    ],
    'Manual Review': [
        '45-60 min',
        '50-100',
        '75-85%',
        'Hospital only',
        'Limited by physicians',
        'Secure',
        'Yes (years)',
        'Business hours'
    ],
    'Your System': [
        '2 seconds',
        '0',
        '87%',
        'Cloud/Local/Edge',
        '24/7 unlimited',
        'Local processing',
        'No',
        '24/7 available'
    ]
}

df = pd.DataFrame(comparison_data)

print("\n" + "=" * 80)
print("SYSTEM COMPARISON: MANUAL vs YOUR SYSTEM")
print("=" * 80)
print(df.to_string(index=False))
print("=" * 80)

df.to_csv('comparison.csv', index=False)
print("\nComparison saved to comparison.csv")