"""
ColdLink AI - Data Inspection Script
Converts Excel to CSV and performs initial data inspection
"""

import pandas as pd
import numpy as np
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

# Load the Excel file
print("=" * 80)
print("COLDLINK AI - DATA INSPECTION")
print("=" * 80)
print("\nLoading data from input_data.xlsx...")

df = pd.read_excel('../data/input_data.xlsx')

print(f"\n✓ Data loaded successfully!")
print(f"  Shape: {df.shape[0]:,} rows × {df.shape[1]} columns")

# Save as CSV
df.to_csv('../data/input_data.csv', index=False)
print(f"✓ Saved as data/input_data.csv")

# Basic Information
print("\n" + "=" * 80)
print("DATASET OVERVIEW")
print("=" * 80)

print("\nColumn Names and Types:")
print("-" * 80)
for i, (col, dtype) in enumerate(zip(df.columns, df.dtypes), 1):
    null_count = df[col].isnull().sum()
    null_pct = (null_count / len(df)) * 100
    print(f"{i:2}. {col:35} | {str(dtype):15} | Nulls: {null_count:6} ({null_pct:5.2f}%)")

# Data types summary
print(f"\nData Type Summary:")
print(df.dtypes.value_counts())

# Missing values
print("\n" + "=" * 80)
print("MISSING VALUES ANALYSIS")
print("=" * 80)
missing_summary = pd.DataFrame({
    'Column': df.columns,
    'Missing_Count': df.isnull().sum().values,
    'Missing_Percentage': (df.isnull().sum().values / len(df) * 100).round(2)
})
missing_summary = missing_summary[missing_summary['Missing_Count'] > 0].sort_values('Missing_Count', ascending=False)

if len(missing_summary) > 0:
    print(missing_summary.to_string(index=False))
else:
    print("✓ No missing values found!")

# Check for duplicate rows
print("\n" + "=" * 80)
print("DUPLICATE ANALYSIS")
print("=" * 80)
duplicates = df.duplicated().sum()
print(f"Total duplicate rows: {duplicates:,} ({(duplicates/len(df)*100):.2f}%)")

# Numeric columns summary
print("\n" + "=" * 80)
print("NUMERIC COLUMNS SUMMARY")
print("=" * 80)
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
print(f"\nNumeric columns ({len(numeric_cols)}): {', '.join(numeric_cols)}")

if len(numeric_cols) > 0:
    print("\nBasic Statistics:")
    print(df[numeric_cols].describe().round(2))

# Categorical columns summary
print("\n" + "=" * 80)
print("CATEGORICAL COLUMNS SUMMARY")
print("=" * 80)
categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
print(f"\nCategorical columns ({len(categorical_cols)}): {', '.join(categorical_cols)}")

for col in categorical_cols:
    unique_count = df[col].nunique()
    print(f"\n{col}:")
    print(f"  Unique values: {unique_count}")
    if unique_count <= 20:
        print(f"  Value counts:")
        print(df[col].value_counts().head(20).to_string())
    else:
        print(f"  Top 10 values:")
        print(df[col].value_counts().head(10).to_string())

# Date/time columns
print("\n" + "=" * 80)
print("TEMPORAL COLUMNS ANALYSIS")
print("=" * 80)

# Try to identify datetime columns
datetime_cols = df.select_dtypes(include=['datetime64']).columns.tolist()
potential_date_cols = [col for col in df.columns if 'date' in col.lower() or 'time' in col.lower() or 'timestamp' in col.lower()]

print(f"\nDateTime columns: {datetime_cols if datetime_cols else 'None detected'}")
print(f"Potential date columns (by name): {potential_date_cols if potential_date_cols else 'None detected'}")

# If there are potential date columns, try to parse them
for col in potential_date_cols:
    if col not in datetime_cols:
        try:
            df[col + '_parsed'] = pd.to_datetime(df[col])
            print(f"\n✓ Successfully parsed '{col}' as datetime")
            print(f"  Range: {df[col + '_parsed'].min()} to {df[col + '_parsed'].max()}")
            print(f"  Span: {(df[col + '_parsed'].max() - df[col + '_parsed'].min()).days} days")
        except:
            print(f"\n✗ Could not parse '{col}' as datetime")

# Check for ID columns
print("\n" + "=" * 80)
print("IDENTIFIER COLUMNS")
print("=" * 80)
id_cols = [col for col in df.columns if 'id' in col.lower() or 'batch' in col.lower()]
print(f"\nIdentified ID columns: {id_cols if id_cols else 'None detected'}")

for col in id_cols:
    if col in df.columns:
        unique_count = df[col].nunique()
        total_count = len(df)
        print(f"\n{col}:")
        print(f"  Unique values: {unique_count:,}")
        print(f"  Total rows: {total_count:,}")
        print(f"  Uniqueness: {(unique_count/total_count*100):.2f}%")
        if unique_count <= 100:
            print(f"  Sample values: {df[col].head(10).tolist()}")

# First few rows
print("\n" + "=" * 80)
print("SAMPLE DATA (First 5 rows)")
print("=" * 80)
print(df.head().to_string())

# Summary
print("\n" + "=" * 80)
print("INSPECTION SUMMARY")
print("=" * 80)
print(f"✓ Total records: {len(df):,}")
print(f"✓ Total features: {len(df.columns)}")
print(f"✓ Numeric features: {len(numeric_cols)}")
print(f"✓ Categorical features: {len(categorical_cols)}")
print(f"✓ DateTime features: {len(datetime_cols)}")
print(f"✓ Memory usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
print(f"✓ Duplicate rows: {duplicates:,}")
print(f"✓ Columns with missing values: {len(missing_summary)}")

print("\n" + "=" * 80)
print("DATA INSPECTION COMPLETE")
print("=" * 80)
