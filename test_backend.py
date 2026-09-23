"""
Test script to verify backend API endpoints
"""
import requests
import json
import time

API_BASE = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("\n1. Testing Health Endpoint...")
    try:
        response = requests.get(f"{API_BASE}/api/health", timeout=5)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"   Error: {e}")
        return False

def test_statistics():
    """Test statistics endpoint"""
    print("\n2. Testing Statistics Endpoint...")
    try:
        response = requests.get(f"{API_BASE}/api/statistics", timeout=5)
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Total Batches: {data.get('total_batches')}")
        print(f"   High Risk: {data.get('high_risk_count')}")
        return response.status_code == 200
    except Exception as e:
        print(f"   Error: {e}")
        return False

def test_batches():
    """Test batches endpoint"""
    print("\n3. Testing Batches Endpoint...")
    try:
        response = requests.get(f"{API_BASE}/api/batches?limit=5", timeout=5)
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Total: {data.get('total')}")
        print(f"   Fetched: {len(data.get('batches', []))}")
        return response.status_code == 200
    except Exception as e:
        print(f"   Error: {e}")
        return False

def test_prediction():
    """Test prediction endpoint"""
    print("\n4. Testing Prediction Endpoint...")
    try:
        payload = {
            "thermal_shipper_temp_reading": 5.0,
            "room_temp_reading": 22.0,
            "room_humidity_reading": 55.0,
            "item_expiry_hours": 48.0,
            "ultra_low_temperature_freezer_hours": 0.0,
            "out_of_bound_temperature_hours": 0.0,
            "refrigeration_temperature_hours": 24.0,
            "location": "Mumbai",
            "current_hop": "dest_vaccine_storage_unit",
            "external_storage": "vaccine_storage_unit",
            "hour": 12,
            "day_of_week": 2
        }
        response = requests.post(f"{API_BASE}/api/predict", json=payload, timeout=10)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Risk Probability: {data.get('risk_probability')}")
            print(f"   Risk Level: {data.get('risk_level')}")
        return response.status_code == 200
    except Exception as e:
        print(f"   Error: {e}")
        return False

def test_model_metrics():
    """Test model metrics endpoint"""
    print("\n5. Testing Model Metrics Endpoint...")
    try:
        response = requests.get(f"{API_BASE}/api/model-metrics", timeout=5)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Best Model: {data.get('best_model')}")
        return response.status_code == 200
    except Exception as e:
        print(f"   Error: {e}")
        return False

def test_risk_summary():
    """Test risk summary endpoint"""
    print("\n6. Testing Risk Summary Endpoint...")
    try:
        response = requests.get(f"{API_BASE}/api/risk-summary", timeout=10)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Average Risk: {data.get('average_risk')}")
        return response.status_code == 200
    except Exception as e:
        print(f"   Error: {e}")
        return False

if __name__ == "__main__":
    print("="*60)
    print("COLDLINK AI - BACKEND API TESTS")
    print("="*60)
    print("\nWaiting for server to be ready...")
    time.sleep(2)
    
    results = []
    results.append(("Health", test_health()))
    results.append(("Statistics", test_statistics()))
    results.append(("Batches", test_batches()))
    results.append(("Prediction", test_prediction()))
    results.append(("Model Metrics", test_model_metrics()))
    results.append(("Risk Summary", test_risk_summary()))
    
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status} - {name}")
    
    passed = sum(1 for _, r in results if r)
    print(f"\nPassed: {passed}/{len(results)}")
    print("="*60)
